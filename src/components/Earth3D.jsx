import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const DEFAULT_DIST = 3.7

function Tip({ r, sel }) {
  return (
    <div ref={r} style={{ opacity: 0 }} className="pointer-events-none absolute left-0 top-0 z-10 transition-opacity duration-200">
      <div className={`mb-1 whitespace-nowrap rounded-xl px-3 py-1.5 text-center backdrop-blur-md ${sel ? 'bg-white text-navy-900' : 'bg-navy-900/85 text-white ring-1 ring-white/20'}`}>
        <div data-n className="text-sm font-semibold leading-tight" />
        <div data-c className={`text-[10px] uppercase tracking-[0.18em] ${sel ? 'text-ocean-600' : 'text-ocean-300'}`} />
      </div>
    </div>
  )
}

/* =====================================================================
   Realistic interactive Earth (Three.js)
   - day/night shader with city lights, ocean specular, cloud shadows
   - cloud layer, atmosphere glow, starfield
   - OrbitControls: drag to rotate, wheel / pinch to zoom, idle auto-rotate
   - clickable destination markers with highlight animation
   ===================================================================== */
const Earth3D = forwardRef(function Earth3D(
  { places, selected, favorites, dimmed, onSelect, onProgress, shift = 0, className = '' }, ref
) {
  const mount = useRef(null)
  const hoverTip = useRef(null)
  const selTip = useRef(null)
  const api = useRef({})

  // latest props, read from inside the render loop
  Object.assign(api.current, { onSelect, onProgress, selected, favorites, dimmed, shift, places })

  useImperativeHandle(ref, () => ({
    zoom: (f) => api.current.zoom?.(f),
    reset: () => api.current.reset?.(),
  }))

  useEffect(() => { api.current.focus?.(selected) }, [selected])
  useEffect(() => { api.current.resize?.() }, [shift])

  useEffect(() => {
    let disposed = false
    let raf = 0
    let cleanup = () => {}

    ;(async () => {
      const THREE = await import('three')
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')
      if (disposed || !mount.current) return
      const el = mount.current
      const still = reduced()

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      el.appendChild(renderer.domElement)
      renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;touch-action:none;outline:none'

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 200)
      const toVec = (lat, lon, r = 1) => {
        const phi = (90 - lat) * (Math.PI / 180), theta = (lon + 180) * (Math.PI / 180)
        return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
      }
      const home = toVec(22, 25, 1).normalize()
      camera.position.copy(home.clone().multiplyScalar(DEFAULT_DIST))

      const disposables = []
      const track = (o) => { disposables.push(o); return o }

      /* ---- textures with loading progress ---- */
      const manager = new THREE.LoadingManager()
      manager.onProgress = (_u, loaded, total) => api.current.onProgress?.(loaded / total, false)
      manager.onLoad = () => api.current.onProgress?.(1, true)
      manager.onError = () => api.current.onProgress?.(1, true)
      const loader = new THREE.TextureLoader(manager)
      const aniso = renderer.capabilities.getMaxAnisotropy()
      const tex = (url) => { const t = loader.load(url); t.anisotropy = aniso; t.colorSpace = THREE.NoColorSpace; return track(t) }
      const dayMap = tex('/textures/earth_atmos_2048.jpg')
      const nightMap = tex('/textures/earth_lights_2048.png')
      const specMap = tex('/textures/earth_specular_2048.jpg')

      /* procedural clouds: smooth 3D fbm noise, shared by the Earth (cloud shadows) and the cloud shell */
      const NOISE = `
        float hash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
        float noise(vec3 x){ vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                     mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z); }
        float fbm(vec3 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }
        float cloudAt(vec3 n, float t){ vec3 p = n * 3.4 + vec3(t * 0.025, t * 0.004, t * 0.012); return smoothstep(0.5, 0.76, fbm(p)); }`

      /* ---- Earth ---- */
      const sunDir = new THREE.Vector3(1, 0.3, 0.6).normalize()
      const earthMat = track(new THREE.ShaderMaterial({
        uniforms: {
          dayMap: { value: dayMap }, nightMap: { value: nightMap }, specMap: { value: specMap },
          sunDir: { value: sunDir }, camPos: { value: camera.position }, time: { value: 0 },
        },
        vertexShader: `
          varying vec2 vUv; varying vec3 vNW; varying vec3 vPW;
          void main(){ vUv = uv; vNW = normalize(mat3(modelMatrix) * normal); vec4 wp = modelMatrix * vec4(position,1.0); vPW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,
        fragmentShader: `
          uniform sampler2D dayMap; uniform sampler2D nightMap; uniform sampler2D specMap;
          uniform vec3 sunDir; uniform vec3 camPos; uniform float time;
          varying vec2 vUv; varying vec3 vNW; varying vec3 vPW;
          ${NOISE}
          void main(){
            vec3 N = normalize(vNW); vec3 V = normalize(camPos - vPW);
            float d = dot(N, sunDir);
            vec3 day = texture2D(dayMap, vUv).rgb;
            day = pow(day, vec3(0.9)) * vec3(1.03, 1.04, 1.1);
            float cl = cloudAt(normalize(N - sunDir * 0.02), time);
            day *= 1.0 - cl * 0.32;                                 // soft cloud shadows
            float light = smoothstep(-0.12, 0.35, d);
            vec3 lit = day * (0.14 + 1.15 * max(d, 0.0));
            vec3 dark = day * vec3(0.03, 0.05, 0.11);
            vec3 col = mix(dark, lit, light);
            float nm = smoothstep(0.05, -0.28, d);                  // city lights on the night side
            col += texture2D(nightMap, vUv).rgb * vec3(1.0, 0.78, 0.45) * 1.8 * nm * (1.0 - cl * 0.6);
            vec3 H = normalize(sunDir + V);                         // ocean glint
            float sp = pow(max(dot(N, H), 0.0), 70.0) * texture2D(specMap, vUv).r;
            col += vec3(0.75, 0.88, 1.0) * sp * 0.9 * light;
            float tw = smoothstep(-0.1, 0.05, d) * smoothstep(0.3, 0.05, d);   // sunset band
            col += vec3(0.95, 0.4, 0.15) * tw * 0.07;
            float fr = pow(1.0 - max(dot(N, V), 0.0), 3.0);         // atmospheric rim
            col += vec3(0.15, 0.45, 0.9) * fr * (0.25 + 0.9 * light) * 0.8;
            gl_FragColor = vec4(col, 1.0);
          }`,
      }))
      const earth = new THREE.Mesh(track(new THREE.SphereGeometry(1, 128, 128)), earthMat)
      scene.add(earth)

      /* ---- cloud shell (procedural, lit by the same sun) ---- */
      const cloudMat = track(new THREE.ShaderMaterial({
        uniforms: { sunDir: { value: sunDir }, time: { value: 0 } },
        transparent: true, depthWrite: false,
        vertexShader: 'varying vec3 vNW; void main(){ vNW = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `uniform vec3 sunDir; uniform float time; varying vec3 vNW; ${NOISE}
          void main(){ vec3 N = normalize(vNW); float c = cloudAt(N, time); float l = smoothstep(-0.15, 0.4, dot(N, sunDir));
            vec3 col = mix(vec3(0.05, 0.07, 0.13), vec3(1.0), l); gl_FragColor = vec4(col, c * 0.82 * (0.2 + 0.8 * l)); }`,
      }))
      scene.add(new THREE.Mesh(track(new THREE.SphereGeometry(1.012, 96, 96)), cloudMat))

      /* ---- atmosphere glow ---- */
      const atmoMat = track(new THREE.ShaderMaterial({
        uniforms: { sunV: { value: new THREE.Vector3(0, 0, 1) } },
        transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
        vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: 'uniform vec3 sunV; varying vec3 vN; void main(){ float i = pow(0.66 - dot(vN, vec3(0.,0.,1.)), 2.8); float l = 0.3 + 0.7 * smoothstep(-0.4, 0.6, dot(vN, sunV)); gl_FragColor = vec4(0.22, 0.6, 1.0, 1.0) * i * l * 1.5; }',
      }))
      scene.add(new THREE.Mesh(track(new THREE.SphereGeometry(1.16, 64, 64)), atmoMat))

      /* ---- stars ---- */
      const dot = document.createElement('canvas'); dot.width = dot.height = 32
      const dx = dot.getContext('2d'); const dg = dx.createRadialGradient(16, 16, 0, 16, 16, 16)
      dg.addColorStop(0, 'rgba(255,255,255,1)'); dg.addColorStop(1, 'rgba(255,255,255,0)'); dx.fillStyle = dg; dx.fillRect(0, 0, 32, 32)
      const dotTex = track(new THREE.CanvasTexture(dot))
      const sp = []; for (let i = 0; i < 1800; i++) { const v = new THREE.Vector3().randomDirection().multiplyScalar(30 + Math.random() * 40); sp.push(v.x, v.y, v.z) }
      const starGeo = track(new THREE.BufferGeometry()); starGeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3))
      const stars = new THREE.Points(starGeo, track(new THREE.PointsMaterial({ color: 0xcfe6ff, size: 0.45, map: dotTex, transparent: true, opacity: 0.85, depthWrite: false, sizeAttenuation: true })))
      scene.add(stars)

      /* ---- destination markers ---- */
      const markers = {}
      const hitMeshes = []
      const glowMat = (c) => track(new THREE.MeshBasicMaterial({ map: dotTex, color: c, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending }))
      api.current.places.forEach((d, i) => {
        const p = toVec(d.lat, d.lon, 1.0)
        const g = new THREE.Group(); g.position.copy(p); g.lookAt(p.clone().multiplyScalar(2))
        const headMat = track(new THREE.MeshBasicMaterial({ color: 0x2dd4bf, transparent: true }))
        const stem = new THREE.Mesh(track(new THREE.CylinderGeometry(0.0025, 0.0025, 0.05, 6)), headMat)
        stem.rotation.x = Math.PI / 2; stem.position.z = 0.025
        const head = new THREE.Mesh(track(new THREE.SphereGeometry(0.016, 20, 20)), headMat); head.position.z = 0.055
        const halo = new THREE.Mesh(track(new THREE.PlaneGeometry(0.12, 0.12)), glowMat(0x2dd4bf)); halo.position.z = 0.055
        // selected-state "country highlight": ground glow + ripple rings
        const ground = new THREE.Mesh(track(new THREE.CircleGeometry(0.1, 48)), glowMat(0x22d3ee)); ground.position.z = 0.004; ground.scale.setScalar(0.001)
        const rings = [0, 1, 2].map(() => {
          const rm = track(new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }))
          const r = new THREE.Mesh(track(new THREE.RingGeometry(0.03, 0.036, 64)), rm); r.position.z = 0.006; g.add(r); return { r, rm }
        })
        const hit = new THREE.Mesh(track(new THREE.SphereGeometry(0.055, 8, 8)), track(new THREE.MeshBasicMaterial({ visible: false })))
        hit.position.z = 0.03; hit.userData.slug = d.slug; hitMeshes.push(hit)
        g.add(stem, head, halo, ground, hit); scene.add(g)
        markers[d.slug] = { g, head, headMat, halo, ground, rings, phase: i * 0.7, s: 0, pos: p, d }
      })

      /* ---- controls ---- */
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enablePan = false
      controls.enableDamping = true; controls.dampingFactor = 0.07
      controls.minDistance = 1.35; controls.maxDistance = 6.5
      controls.zoomSpeed = 0.7; controls.autoRotateSpeed = 0.5

      const st = { fly: null, zoomTo: null, idleOk: true, idleTimer: 0, hover: null, down: false, moved: 0, sx: 0, sy: 0 }
      controls.addEventListener('start', () => { st.fly = null; st.zoomTo = null; st.idleOk = false; clearTimeout(st.idleTimer) })
      controls.addEventListener('end', () => { clearTimeout(st.idleTimer); st.idleTimer = setTimeout(() => { st.idleOk = true }, 3500) })

      api.current.focus = (slug) => {
        const m = markers[slug]
        if (!m) { st.fly = null; return }
        st.fly = { dir: m.pos.clone().normalize(), dist: 2.25 }
      }
      api.current.zoom = (f) => { const d = camera.position.length(); st.fly = null; st.zoomTo = Math.min(6.5, Math.max(1.35, d * f)) }
      api.current.reset = () => { st.fly = { dir: home.clone(), dist: DEFAULT_DIST } }
      if (api.current.selected) api.current.focus(api.current.selected)

      /* ---- sizing (with optional sideways shift to make room for the info panel) ---- */
      const size = () => {
        const w = el.clientWidth || 1, h = el.clientHeight || 1
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.fov = w / h < 0.85 ? 46 : 36
        const sh = api.current.shift || 0
        if (sh) camera.setViewOffset(w, h, sh, 0, w, h); else camera.clearViewOffset()
        camera.updateProjectionMatrix()
      }
      api.current.resize = size
      size()
      const ro = new ResizeObserver(size); ro.observe(el)

      /* ---- picking ---- */
      const ray = new THREE.Raycaster(); const ptr = new THREE.Vector2()
      const tmp = new THREE.Vector3()
      const pick = (e) => {
        const r = renderer.domElement.getBoundingClientRect()
        ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
        ray.setFromCamera(ptr, camera)
        const cd = camera.position.clone().normalize()
        const hits = ray.intersectObjects(hitMeshes, false).filter((h) => {
          const slug = h.object.userData.slug
          return markers[slug].pos.clone().normalize().dot(cd) > 0.2 && !api.current.dimmed?.has(slug)
        })
        return hits.length ? hits[0].object.userData.slug : null
      }
      const dom = renderer.domElement
      const onDown = (e) => { st.down = true; st.moved = 0; st.sx = e.clientX; st.sy = e.clientY }
      const onMove = (e) => {
        if (st.down) { st.moved = Math.max(st.moved, Math.abs(e.clientX - st.sx) + Math.abs(e.clientY - st.sy)); return }
        st.hover = pick(e); dom.style.cursor = st.hover ? 'pointer' : 'grab'
      }
      const onUp = (e) => {
        if (st.down && st.moved < 6) { const s = pick(e); if (s) api.current.onSelect?.(s) }
        st.down = false
      }
      const onLeave = () => { st.hover = null }
      dom.addEventListener('pointerdown', onDown); dom.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp); dom.addEventListener('pointerleave', onLeave)
      dom.style.cursor = 'grab'

      let visible = true
      const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting }); io.observe(el)

      /* ---- tooltips (DOM, projected each frame) ---- */
      const label = (node, slug, active) => {
        if (!node) return
        const m = slug && markers[slug]
        if (!m || !active) { node.style.opacity = '0'; return }
        tmp.copy(m.pos).multiplyScalar(1.09).project(camera)
        const facing = m.pos.clone().normalize().dot(camera.position.clone().normalize())
        const w = el.clientWidth, h = el.clientHeight
        if (facing < 0.12) { node.style.opacity = '0'; return }
        if (node.dataset.slug !== slug) { node.dataset.slug = slug; node.querySelector('[data-n]').textContent = m.d.name; node.querySelector('[data-c]').textContent = m.d.country }
        node.style.opacity = '1'
        node.style.transform = `translate3d(${(tmp.x * 0.5 + 0.5) * w}px, ${(-tmp.y * 0.5 + 0.5) * h}px, 0) translate(-50%, -100%)`
      }

      const t0 = performance.now()
      const up = new THREE.Vector3(0, 1, 0)
      const frame = () => {
        raf = requestAnimationFrame(frame)
        if (!visible || document.hidden) return
        const t = (performance.now() - t0) / 1000
        const sel = api.current.selected

        // sun follows the camera so the visible hemisphere is always lit, with the terminator near the limb
        const cd = camera.position.clone().normalize()
        sunDir.copy(cd).applyAxisAngle(up, 0.85); sunDir.y += 0.22; sunDir.normalize()
        atmoMat.uniforms.sunV.value.copy(sunDir).transformDirection(camera.matrixWorldInverse)
        const ct = still ? 0 : t
        earthMat.uniforms.time.value = ct; cloudMat.uniforms.time.value = ct
        stars.rotation.y += still ? 0 : 0.00005

        // fly-to / zoom animation
        const dist = camera.position.length()
        if (st.fly) {
          const nd = cd.clone().lerp(st.fly.dir, 0.075).normalize()
          const ndist = dist + (st.fly.dist - dist) * 0.075
          camera.position.copy(nd.multiplyScalar(ndist))
          if (cd.angleTo(st.fly.dir) < 0.004 && Math.abs(ndist - st.fly.dist) < 0.01) st.fly = null
        } else if (st.zoomTo != null) {
          const nd = dist + (st.zoomTo - dist) * 0.12
          camera.position.setLength(nd)
          if (Math.abs(nd - st.zoomTo) < 0.005) st.zoomTo = null
        }
        controls.autoRotate = !still && st.idleOk && !sel && !st.fly && !st.down
        controls.rotateSpeed = 0.28 + 0.32 * Math.min(1, (dist - 1.35) / 3)
        controls.update()

        // markers
        const sc = Math.min(1.3, Math.max(0.5, dist / 3.2))
        const favs = api.current.favorites, dim = api.current.dimmed
        for (const [slug, m] of Object.entries(markers)) {
          const isSel = slug === sel, isHover = slug === st.hover, isDim = dim?.has(slug), isFav = favs?.has(slug)
          const target = isSel ? 1.9 : isHover ? 1.5 : isDim ? 0.55 : 1
          m.s += (target - m.s) * 0.18
          m.g.scale.setScalar(sc * m.s)
          const col = isSel ? 0xffffff : isFav ? 0xfbbf24 : isDim ? 0x64748b : 0x2dd4bf
          m.headMat.color.setHex(col); m.headMat.opacity = isDim ? 0.35 : 1
          m.halo.material.color.setHex(isSel ? 0x22d3ee : isFav ? 0xfbbf24 : 0x2dd4bf)
          m.halo.material.opacity = isDim ? 0.08 : 0.55 + Math.sin(t * 2.4 + m.phase) * 0.25
          m.halo.lookAt(camera.position)
          // country highlight
          const gs = m.ground.scale.x + ((isSel ? 1 : 0.001) - m.ground.scale.x) * 0.1
          m.ground.scale.setScalar(Math.max(0.001, gs))
          m.ground.material.opacity = isSel ? 0.32 + Math.sin(t * 3) * 0.08 : 0
          m.rings.forEach(({ r, rm }, k) => {
            if (!isSel) { rm.opacity += (0 - rm.opacity) * 0.2; return }
            const p = ((t * 0.55 + k / 3) % 1)
            r.scale.setScalar(1 + p * 3); rm.opacity = (1 - p) * 0.6
          })
        }
        label(hoverTip.current, st.hover && st.hover !== sel ? st.hover : null, true)
        label(selTip.current, sel, true)
        renderer.render(scene, camera)
      }
      frame()

      cleanup = () => {
        cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); clearTimeout(st.idleTimer)
        dom.removeEventListener('pointerdown', onDown); dom.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp); dom.removeEventListener('pointerleave', onLeave)
        controls.dispose()
        disposables.forEach((d) => d.dispose?.())
        renderer.dispose(); renderer.domElement.remove()
        api.current.focus = api.current.zoom = api.current.reset = api.current.resize = null
      }
    })()

    return () => { disposed = true; cleanup() }
  }, [])

  return (
    <div className={className || 'relative'}>
      <div ref={mount} className="absolute inset-0" role="img" aria-label="Interactive 3D Earth. Drag to rotate, scroll to zoom, click a marker to explore a destination." />
      <Tip r={hoverTip} />
      <Tip r={selTip} sel />
    </div>
  )
})

export default Earth3D
