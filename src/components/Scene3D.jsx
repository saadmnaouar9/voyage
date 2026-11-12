import { useEffect, useRef } from 'react'
import { destinations, BASE } from '../data/data'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* =========================================================
   Floating 3D airplane (procedural geometry, PBR + env map)
   ========================================================= */
export function Plane3D({ className = '' }) {
  const mount = useRef(null)

  useEffect(() => {
    let disposed = false
    let raf = 0
    let cleanup = () => {}

    ;(async () => {
      const THREE = await import('three')
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js')
      if (disposed || !mount.current) return
      const el = mount.current

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.05
      el.appendChild(renderer.domElement)
      renderer.domElement.style.cssText = 'width:100%;height:100%;display:block'

      const scene = new THREE.Scene()
      const pmrem = new THREE.PMREMGenerator(renderer)
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
      scene.environment = envTex
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
      camera.position.set(0, 0.6, 11)

      const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(4, 6, 5); scene.add(key)
      const rim = new THREE.DirectionalLight(0x7cc4f2, 2.5); rim.position.set(-5, 2, -4); scene.add(rim)

      const white = new THREE.MeshStandardMaterial({ color: 0xf6f8ff, metalness: 0.35, roughness: 0.22 })
      const blue = new THREE.MeshStandardMaterial({ color: 0x1b86d6, metalness: 0.4, roughness: 0.25 })
      const dark = new THREE.MeshStandardMaterial({ color: 0x0b1f47, metalness: 0.7, roughness: 0.2 })
      const glass = new THREE.MeshStandardMaterial({ color: 0x07142f, metalness: 0.9, roughness: 0.05 })

      const plane = new THREE.Group()
      const geos = []
      const add = (geo, mat, parent = plane) => { geos.push(geo); const m = new THREE.Mesh(geo, mat); parent.add(m); return m }

      // fuselage — nose toward +x
      const fus = add(new THREE.CapsuleGeometry(0.42, 3.6, 12, 32), white); fus.rotation.z = Math.PI / 2
      fus.scale.set(1, 1, 1)
      // nose cone tint + cockpit
      const cockpit = add(new THREE.SphereGeometry(0.3, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.4), glass)
      cockpit.position.set(1.95, 0.18, 0); cockpit.rotation.z = -0.9; cockpit.scale.set(1.1, 0.8, 0.9)
      // cheatline stripe
      const stripe = add(new THREE.CylinderGeometry(0.425, 0.425, 3.4, 32, 1, true), blue); stripe.rotation.z = Math.PI / 2; stripe.scale.set(0.2, 1, 1.0); stripe.position.y = -0.04
      // windows
      for (let i = 0; i < 12; i++) for (const s of [-1, 1]) {
        const w = add(new THREE.SphereGeometry(0.05, 10, 8), glass)
        w.position.set(1.1 - i * 0.2, 0.12, s * 0.405); w.scale.set(1, 1.2, 0.4)
      }

      // wings (swept extrusion)
      const wingShape = new THREE.Shape()
      wingShape.moveTo(0.55, 0); wingShape.lineTo(-0.95, 3.1); wingShape.lineTo(-1.55, 3.1); wingShape.lineTo(-0.85, 0); wingShape.closePath()
      const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.09, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 2 })
      wingGeo.rotateX(-Math.PI / 2); geos.push(wingGeo)
      const wingMat = white.clone(); wingMat.side = THREE.DoubleSide
      for (const s of [1, -1]) {
        const w = new THREE.Mesh(wingGeo, wingMat)
        w.position.set(0.1, -0.2, 0); w.scale.z = -s; w.rotation.x = s * 0.06
        plane.add(w)
        const tip = add(new THREE.BoxGeometry(0.5, 0.04, 0.05), blue); tip.position.set(-1.25, -0.12 + 0.19 * 0, s * 3.1)
        const eng = add(new THREE.CylinderGeometry(0.22, 0.19, 1.05, 24), dark); eng.rotation.z = Math.PI / 2; eng.position.set(-0.05, -0.55, s * 1.25)
        const fan = add(new THREE.CylinderGeometry(0.17, 0.17, 0.04, 24), glass); fan.rotation.z = Math.PI / 2; fan.position.set(0.5, -0.55, s * 1.25)
      }

      // tail
      const finShape = new THREE.Shape()
      finShape.moveTo(-1.5, 0.25); finShape.lineTo(-2.3, 1.45); finShape.lineTo(-2.75, 1.45); finShape.lineTo(-2.35, 0.25); finShape.closePath()
      const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.08, bevelEnabled: false }); finGeo.translate(0, 0, -0.04); geos.push(finGeo)
      plane.add(new THREE.Mesh(finGeo, blue))
      const stabShape = new THREE.Shape()
      stabShape.moveTo(0.3, 0); stabShape.lineTo(-0.55, 1.15); stabShape.lineTo(-0.9, 1.15); stabShape.lineTo(-0.35, 0); stabShape.closePath()
      const stabGeo = new THREE.ExtrudeGeometry(stabShape, { depth: 0.05, bevelEnabled: false }); stabGeo.rotateX(-Math.PI / 2); geos.push(stabGeo)
      for (const s of [1, -1]) {
        const st = new THREE.Mesh(stabGeo, wingMat); st.position.set(-2.1, 0.12, 0); st.scale.z = -s; plane.add(st)
      }

      plane.scale.setScalar(0.95)
      const holder = new THREE.Group(); holder.add(plane); scene.add(holder)

      // soft contrail particles
      const N = 90
      const tp = new Float32Array(N * 3)
      const trailGeo = new THREE.BufferGeometry(); trailGeo.setAttribute('position', new THREE.BufferAttribute(tp, 3))
      const cv = document.createElement('canvas'); cv.width = cv.height = 64
      const cx = cv.getContext('2d'); const gr = cx.createRadialGradient(32, 32, 0, 32, 32, 32)
      gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); cx.fillStyle = gr; cx.fillRect(0, 0, 64, 64)
      const spr = new THREE.CanvasTexture(cv)
      const trail = new THREE.Points(trailGeo, new THREE.PointsMaterial({ size: 0.42, map: spr, transparent: true, opacity: 0.22, depthWrite: false, sizeAttenuation: true }))
      scene.add(trail)

      const size = () => {
        const w = el.clientWidth || 1, h = el.clientHeight || 1
        renderer.setSize(w, h, false); camera.aspect = w / h
        camera.position.z = w / h < 0.8 ? 14 : 11
        camera.updateProjectionMatrix()
      }
      size()
      const ro = new ResizeObserver(size); ro.observe(el)

      const mouse = { x: 0, y: 0 }
      const onMove = (e) => { mouse.x = (e.clientX / window.innerWidth - 0.5) * 2; mouse.y = (e.clientY / window.innerHeight - 0.5) * 2 }
      window.addEventListener('pointermove', onMove)

      let visible = true
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }); io.observe(el)

      const clock = new THREE.Clock()
      const still = reduced()
      const frame = () => {
        raf = requestAnimationFrame(frame)
        if (!visible) return
        const t = still ? 0 : clock.getElapsedTime()
        holder.position.y = Math.sin(t * 0.9) * 0.22 + mouse.y * -0.25
        holder.position.x = Math.sin(t * 0.45) * 0.18 + mouse.x * 0.3
        holder.rotation.y += ((-0.62 + mouse.x * 0.28) - holder.rotation.y) * 0.05
        holder.rotation.z += ((0.1 - mouse.y * 0.1 + Math.sin(t * 0.7) * 0.05) - holder.rotation.z) * 0.05
        holder.rotation.x = Math.sin(t * 0.6) * 0.07 + 0.16
        // trail follows the tail
        const tail = new THREE.Vector3(-2.7, 0.2, 0).applyMatrix4(plane.matrixWorld)
        for (let i = N - 1; i > 0; i--) {
          tp[i * 3] = tp[(i - 1) * 3] - 0.07; tp[i * 3 + 1] = tp[(i - 1) * 3 + 1] + (Math.sin(t * 2 + i) * 0.003); tp[i * 3 + 2] = tp[(i - 1) * 3 + 2] + 0.01
        }
        tp[0] = tail.x; tp[1] = tail.y; tp[2] = tail.z
        trailGeo.attributes.position.needsUpdate = true
        renderer.render(scene, camera)
      }
      frame()

      cleanup = () => {
        cancelAnimationFrame(raf); ro.disconnect(); io.disconnect()
        window.removeEventListener('pointermove', onMove)
        geos.forEach((g) => g.dispose()); trailGeo.dispose(); spr.dispose(); envTex.dispose(); pmrem.dispose()
        ;[white, blue, dark, glass, wingMat].forEach((m) => m.dispose())
        renderer.dispose(); renderer.domElement.remove()
      }
    })()

    return () => { disposed = true; cleanup() }
  }, [])

  return <div ref={mount} className={className} aria-hidden />
}

/* =========================================================
   Interactive globe: land dots, flight arcs, hoverable markers
   ========================================================= */
const toVec = (THREE, lat, lon, r = 1) => {
  const phi = (90 - lat) * (Math.PI / 180), theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
}

export function Globe({ selected, onSelect, className = '' }) {
  const mount = useRef(null)
  const api = useRef({ selected: null, onSelect: null, focus: null })
  api.current.onSelect = onSelect

  useEffect(() => { api.current.selected = selected; api.current.focus?.(selected) }, [selected])

  useEffect(() => {
    let disposed = false
    let raf = 0
    let cleanup = () => {}

    ;(async () => {
      const THREE = await import('three')
      if (disposed || !mount.current) return
      const el = mount.current

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      el.appendChild(renderer.domElement)
      renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;touch-action:pan-y'

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50)
      camera.position.set(0, 0, 3.7)

      const globe = new THREE.Group(); scene.add(globe)
      const disposables = []
      const track = (o) => { disposables.push(o); return o }

      // ocean sphere with soft gradient
      const sphere = new THREE.Mesh(
        track(new THREE.SphereGeometry(0.995, 64, 64)),
        track(new THREE.ShaderMaterial({
          transparent: true,
          vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
          fragmentShader: 'varying vec3 vN; void main(){ float f = pow(1.0 - abs(vN.z), 1.6); vec3 c = mix(vec3(0.03,0.09,0.22), vec3(0.08,0.32,0.62), f); gl_FragColor = vec4(c, 0.96); }',
        }))
      )
      globe.add(sphere)

      // graticule
      const gMat = track(new THREE.LineBasicMaterial({ color: 0x7cc4f2, transparent: true, opacity: 0.10 }))
      for (let lat = -60; lat <= 60; lat += 30) {
        const pts = []; for (let lon = 0; lon <= 360; lon += 6) pts.push(toVec(THREE, lat, lon - 180, 1.001))
        globe.add(new THREE.Line(track(new THREE.BufferGeometry().setFromPoints(pts)), gMat))
      }
      for (let lon = -180; lon < 180; lon += 30) {
        const pts = []; for (let lat = -90; lat <= 90; lat += 6) pts.push(toVec(THREE, lat, lon, 1.001))
        globe.add(new THREE.Line(track(new THREE.BufferGeometry().setFromPoints(pts)), gMat))
      }

      // dot texture
      const cv = document.createElement('canvas'); cv.width = cv.height = 32
      const cx = cv.getContext('2d'); cx.beginPath(); cx.arc(16, 16, 14, 0, Math.PI * 2); cx.fillStyle = '#fff'; cx.fill()
      const dotTex = track(new THREE.CanvasTexture(cv))

      // land dots from mask (falls back to a uniform dotted sphere)
      const buildDots = (data, w, h) => {
        const pos = []
        const step = 1.5
        for (let lat = -84; lat <= 84; lat += step) {
          const n = Math.max(1, Math.floor((360 / step) * Math.cos((lat * Math.PI) / 180)))
          for (let i = 0; i < n; i++) {
            const lon = -180 + (i / n) * 360
            if (data) {
              const px = Math.min(w - 1, Math.floor(((lon + 180) / 360) * w))
              const py = Math.min(h - 1, Math.floor(((90 - lat) / 180) * h))
              if (data[(py * w + px) * 4] > 110) continue // bright = ocean in specular map
            }
            const v = toVec(THREE, lat, lon, 1.004); pos.push(v.x, v.y, v.z)
          }
        }
        const g = track(new THREE.BufferGeometry()); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
        const pts = new THREE.Points(g, track(new THREE.PointsMaterial({ color: 0xa8d8fb, size: 0.0125, map: dotTex, transparent: true, alphaTest: 0.2, depthWrite: false, opacity: 0.95 })))
        globe.add(pts)
      }
      const im = new Image()
      im.onload = () => {
        if (disposed) return
        const c = document.createElement('canvas'); c.width = 1024; c.height = 512
        const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0, 1024, 512)
        buildDots(x.getImageData(0, 0, 1024, 512).data, 1024, 512)
      }
      im.onerror = () => !disposed && buildDots(null)
      im.src = '/earth-mask.jpg'

      // atmosphere
      const atmo = new THREE.Mesh(
        track(new THREE.SphereGeometry(1.16, 64, 64)),
        track(new THREE.ShaderMaterial({
          transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
          vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
          fragmentShader: 'varying vec3 vN; void main(){ float i = pow(0.62 - dot(vN, vec3(0.,0.,1.)), 3.0); gl_FragColor = vec4(0.26,0.66,0.92,1.0) * i * 1.5; }',
        }))
      )
      scene.add(atmo)

      // markers + arcs
      const base = toVec(THREE, BASE.lat, BASE.lon)
      const hit = []
      const markers = {}
      const arcs = {}
      const movers = []
      const baseDot = new THREE.Mesh(track(new THREE.SphereGeometry(0.02, 16, 16)), track(new THREE.MeshBasicMaterial({ color: 0xe9dec6 })))
      baseDot.position.copy(base.clone().multiplyScalar(1.01)); globe.add(baseDot)

      destinations.forEach((d, idx) => {
        const p = toVec(THREE, d.lat, d.lon, 1.01)
        const g = new THREE.Group(); g.position.copy(p); g.lookAt(p.clone().multiplyScalar(2))
        const core = new THREE.Mesh(track(new THREE.SphereGeometry(0.014, 16, 16)), track(new THREE.MeshBasicMaterial({ color: 0xffffff })))
        const ringMat = track(new THREE.MeshBasicMaterial({ color: 0x43a8ea, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false }))
        const ring = new THREE.Mesh(track(new THREE.RingGeometry(0.026, 0.031, 40)), ringMat)
        const h = new THREE.Mesh(track(new THREE.SphereGeometry(0.07, 8, 8)), track(new THREE.MeshBasicMaterial({ visible: false })))
        h.userData.slug = d.slug; hit.push(h)
        g.add(core, ring, h); globe.add(g)
        markers[d.slug] = { g, core, ring, ringMat, phase: idx * 0.9 }

        // arc
        const a = base.clone().normalize(), b = toVec(THREE, d.lat, d.lon).normalize()
        const ang = a.angleTo(b)
        const pts = []
        for (let i = 0; i <= 64; i++) {
          const t = i / 64
          const v = a.clone().lerp(b, t).normalize().multiplyScalar(1.005 + Math.sin(Math.PI * t) * (0.1 + ang * 0.16))
          pts.push(v)
        }
        const curve = new THREE.CatmullRomCurve3(pts)
        const lm = track(new THREE.LineBasicMaterial({ color: 0x7cc4f2, transparent: true, opacity: 0.38 }))
        const line = new THREE.Line(track(new THREE.BufferGeometry().setFromPoints(curve.getPoints(80))), lm)
        globe.add(line)
        arcs[d.slug] = lm
        const mv = new THREE.Mesh(track(new THREE.SphereGeometry(0.012, 10, 10)), track(new THREE.MeshBasicMaterial({ color: 0xffffff })))
        globe.add(mv); movers.push({ mv, curve, off: idx / destinations.length, speed: 0.07 + (idx % 3) * 0.02 })
      })

      // rotation state
      const rot = { cy: 0, cx: 0.25, ty: 0, tx: 0.25, auto: true, idleAt: 0 }
      api.current.focus = (slug) => {
        const d = destinations.find((x) => x.slug === slug)
        if (!d) { rot.auto = true; return }
        const lonRad = ((d.lon + 180) * Math.PI) / 180
        const x = -Math.cos((d.lat * Math.PI) / 180) * Math.cos(lonRad), z = Math.cos((d.lat * Math.PI) / 180) * Math.sin(lonRad)
        const a = Math.atan2(x, z)
        rot.auto = false
        let diff = (-a - rot.cy) % (Math.PI * 2)
        if (diff > Math.PI) diff -= Math.PI * 2
        if (diff < -Math.PI) diff += Math.PI * 2
        rot.ty = rot.cy + diff
        rot.tx = Math.max(-0.7, Math.min(0.7, (d.lat * Math.PI) / 180 * 0.7))
      }
      if (api.current.selected) api.current.focus(api.current.selected)

      // sizing
      const size = () => {
        const w = el.clientWidth || 1, h = el.clientHeight || 1
        renderer.setSize(w, h, false); camera.aspect = w / h
        camera.position.z = w / h < 1 ? 3.7 / Math.min(1, w / h) * 0.95 : 3.7
        camera.updateProjectionMatrix()
      }
      size()
      const ro = new ResizeObserver(size); ro.observe(el)

      // interaction
      const ray = new THREE.Raycaster(), ptr = new THREE.Vector2()
      let hover = null, down = false, moved = 0, lx = 0, ly = 0
      const pick = (e) => {
        const r = el.getBoundingClientRect()
        ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
        ray.setFromCamera(ptr, camera)
        const hits = ray.intersectObjects(hit, false)
        // ignore markers on the far side of the planet
        const h = hits.find((x) => x.object.getWorldPosition(new THREE.Vector3()).z > 0.1)
        return h ? h.object.userData.slug : null
      }
      const onDown = (e) => { down = true; moved = 0; lx = e.clientX; ly = e.clientY; rot.auto = false; el.setPointerCapture?.(e.pointerId) }
      const onMove = (e) => {
        if (down) {
          const dx = e.clientX - lx, dy = e.clientY - ly
          moved += Math.abs(dx) + Math.abs(dy)
          rot.ty += dx * 0.006; rot.tx = Math.max(-0.9, Math.min(0.9, rot.tx + dy * 0.004)); lx = e.clientX; ly = e.clientY
        } else {
          hover = pick(e); el.style.cursor = hover ? 'pointer' : 'grab'
        }
      }
      const onUp = (e) => {
        if (down && moved < 6) { const s = pick(e); if (s) api.current.onSelect?.(s) }
        down = false; rot.idleAt = performance.now()
      }
      el.addEventListener('pointerdown', onDown); el.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      el.style.cursor = 'grab'

      let visible = true
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }); io.observe(el)
      const clock = new THREE.Clock()
      const still = reduced()

      const frame = () => {
        raf = requestAnimationFrame(frame)
        if (!visible) return
        const t = clock.getElapsedTime(), dt = Math.min(clock.getDelta(), 0.05)
        if (!down && !api.current.selected && !still && performance.now() - rot.idleAt > 1800) rot.auto = true
        if (rot.auto && !down && !still) rot.ty += 0.0016
        rot.cy += (rot.ty - rot.cy) * 0.06; rot.cx += (rot.tx - rot.cx) * 0.06
        globe.rotation.y = rot.cy; globe.rotation.x = rot.cx
        const sel = api.current.selected
        for (const [slug, m] of Object.entries(markers)) {
          const k = ((t * 0.7 + m.phase) % 1)
          m.ring.scale.setScalar(1 + k * 1.8); m.ringMat.opacity = (1 - k) * 0.8
          const on = slug === sel || slug === hover
          m.core.scale.setScalar(on ? 1.7 : 1)
          m.core.material.color.set(on ? 0xffd9a0 : 0xffffff)
          arcs[slug].opacity = slug === sel ? 0.95 : slug === hover ? 0.7 : 0.3
        }
        movers.forEach((o) => { o.mv.position.copy(o.curve.getPoint((t * o.speed + o.off) % 1)) })
        renderer.render(scene, camera)
      }
      frame()

      cleanup = () => {
        cancelAnimationFrame(raf); ro.disconnect(); io.disconnect()
        el.removeEventListener('pointerdown', onDown); el.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        disposables.forEach((d) => d.dispose?.())
        renderer.dispose(); renderer.domElement.remove()
        api.current.focus = null
      }
    })()

    return () => { disposed = true; cleanup() }
  }, [])

  return <div ref={mount} className={className} role="img" aria-label="Interactive 3D globe showing flight routes from Paris to our seven destinations" />
}
