export const img = (id, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

const P = {
  hero: '1507525428034-b723cf961d3e',
  maldives: '1514282401047-d79a71a590e8',
  maldives2: '1573843981267-be1999ff37cd',
  bali: '1537996194471-e657df975ab4',
  dubai: '1512453979798-5ea266f8880c',
  swiss: '1530122037265-a5f1f91d3b99',
  swiss2: '1527668752968-14dc70a27c95',
  turkey: '1641128324972-af3212f0f6bd',
  turkey2: '1527838832700-5059252407fa',
  thai: '1552465011-b4e21bf6e79a',
  thai2: '1589394815804-964ed0be2eb5',
  morocco: '1597212618440-806262de4f6b',
  morocco2: '1489749798305-4fea3ae63d43',
  dubai2: '1518684079-3c830dcef090',
  pool: '1551918120-9739cb430c6d',
  pool2: '1600011689032-8b628b8a8747',
  hotel1: '1566073771259-6a8506099945',
  hotel2: '1582719508461-905c673771fd',
  hotel3: '1571896349842-33c89424de2d',
  hotel4: '1551882547-ff40c63fe5fa',
  hotel5: '1540541338287-41700207dee6',
  dive: '1544551763-46a013bb70d5',
  plane: '1436491865332-7a61a109cc05',
  beach: '1520250497591-112f2f40a3f4',
}
export const IMG = P

export const BASE = { name: 'Paris', lat: 48.85, lon: 2.35 }

export const destinations = [
  {
    slug: 'maldives', name: 'Maldives', country: 'Indian Ocean', tag: 'Overwater paradise',
    image: P.maldives, alt: P.maldives2, lat: 3.2, lon: 73.2, perNight: 420, from: 3890,
    desc: 'Twinkling lagoons, powder-white sandbars and villas suspended above water so clear you can watch rays glide beneath your terrace. The Maldives is the art of doing nothing, perfected.',
    best: 'Nov — Apr', temp: '29°C', flight: '10h 30', duration: '7 nights',
    highlights: ['Private overwater villas', 'Bioluminescent beaches', 'Sunset dolphin cruises', 'Underwater dining', 'Seaplane arrival'],
    itinerary: [
      ['Arrival by seaplane', 'Glide over 26 atolls to your private island, welcomed with chilled coconut and a barefoot-luxury check-in.'],
      ['Lagoon & reef', 'Guided snorkel with a marine biologist, followed by a floating breakfast served in your pool.'],
      ['Sandbank escape', 'A private speedboat to a deserted sandbank for a champagne picnic under a canopy of white linen.'],
      ['Sunset & stars', 'Dolphin cruise at golden hour, then a celestial dinner on the beach with a resident astronomer.'],
      ['Spa & slow living', 'Ocean-view spa ritual, yoga at dawn and a farewell dinner in the underwater restaurant.'],
    ],
  },
  {
    slug: 'bali', name: 'Bali', country: 'Indonesia', tag: 'Temples & terraces',
    image: P.bali, alt: P.beach, lat: -8.4, lon: 115.2, perNight: 190, from: 2290,
    desc: 'Emerald rice terraces, incense-scented temples and clifftop infinity pools. Bali wraps spiritual calm and tropical energy into a single unforgettable rhythm.',
    best: 'Apr — Oct', temp: '28°C', flight: '17h 10', duration: '8 nights',
    highlights: ['Sunrise at Mount Batur', 'Ubud rice terraces', 'Private temple ceremony', 'Uluwatu cliff sunsets', 'Balinese healing rituals'],
    itinerary: [
      ['Ubud awakening', 'Settle into a jungle villa, then a purification ceremony led by a local priest.'],
      ['Terraces & waterfalls', 'Cycle through Tegallalang terraces and swim beneath a hidden waterfall.'],
      ['Volcano sunrise', 'Pre-dawn hike up Mount Batur with a gourmet breakfast served at the summit.'],
      ['Coast & cliffs', 'Transfer to Uluwatu; sunset cocktails above the Indian Ocean at the Kecak fire dance.'],
      ['Island of the Gods', 'Private yacht to Nusa Penida, snorkelling with manta rays and a beach barbecue.'],
    ],
  },
  {
    slug: 'dubai', name: 'Dubai', country: 'United Arab Emirates', tag: 'Skyline & desert',
    image: P.dubai, alt: P.dubai2, lat: 25.2, lon: 55.27, perNight: 310, from: 2790,
    desc: 'A city that rewrites the skyline every decade. Sail the marina by night, dine above the clouds and slip into the silent gold of the desert at dawn.',
    best: 'Nov — Mar', temp: '27°C', flight: '6h 40', duration: '5 nights',
    highlights: ['Burj Khalifa sky lounge', 'Private desert camp', 'Palm Jumeirah by helicopter', 'Old Dubai souks by abra', 'Michelin-starred dining'],
    itinerary: [
      ['Arrival in style', 'Chauffeured transfer to your suite with a view of the Burj and a private fountain-show dinner.'],
      ['City from above', 'Helicopter tour of the Palm and the World Islands, then a hosted afternoon at the Museum of the Future.'],
      ['Old & new', 'Abra crossing of the Creek, spice and gold souks, then an Emirati tasting menu.'],
      ['Golden dunes', 'Falconry, camel trek and a candle-lit Bedouin-style dinner under the Milky Way.'],
      ['Marina by night', 'Private yacht cruise and farewell cocktails at the top of the world.'],
    ],
  },
  {
    slug: 'switzerland', name: 'Switzerland', country: 'Europe', tag: 'Alpine elegance',
    image: P.swiss, alt: P.swiss2, lat: 46.8, lon: 8.2, perNight: 380, from: 3290,
    desc: 'Snow-brushed peaks, mirrored lakes and the world’s most poetic railways. Switzerland is precision and wonder, wrapped in cashmere.',
    best: 'Dec — Mar · Jun — Sep', temp: '8°C', flight: '1h 30', duration: '6 nights',
    highlights: ['Glacier Express panoramic', 'Matterhorn helicopter', 'Lake Lucerne cruise', 'Alpine fondue & chocolate atelier', 'Private ski instruction'],
    itinerary: [
      ['Zürich to Lucerne', 'Scenic lakeside transfer, old-town stroll and a chocolate masterclass.'],
      ['Mount Pilatus', 'Cogwheel ascent in the world’s steepest railway and a summit lunch above the clouds.'],
      ['Glacier Express', 'First-class panoramic carriages across 291 bridges to Zermatt.'],
      ['Matterhorn day', 'Helicopter flight around the peak and a glacier-side champagne picnic.'],
      ['Lake Geneva', 'Vineyard terraces of Lavaux and a farewell dinner in a belle-époque palace.'],
    ],
  },
  {
    slug: 'turkey', name: 'Turkey', country: 'Türkiye', tag: 'Balloons & bazaars',
    image: P.turkey, alt: P.turkey2, lat: 38.9, lon: 35.2, perNight: 170, from: 1990,
    desc: 'Where two continents meet. Float above fairy chimneys at sunrise, wander Istanbul’s mosaic of minarets and sail the turquoise Lycian coast.',
    best: 'Apr — Jun · Sep — Oct', temp: '24°C', flight: '3h 45', duration: '7 nights',
    highlights: ['Cappadocia hot-air balloon', 'Bosphorus private cruise', 'Cave-hotel suites', 'Hammam rituals', 'Gulet sailing in Fethiye'],
    itinerary: [
      ['Istanbul grandeur', 'Hagia Sophia, Topkapı and the Grand Bazaar with a private historian.'],
      ['Bosphorus by sea', 'Private yacht between Europe and Asia, followed by a meyhane dinner.'],
      ['Into Cappadocia', 'Domestic flight, then sunset above the rose valley from your cave suite.'],
      ['Balloon dawn', 'A sunrise balloon flight over fairy chimneys with champagne landing.'],
      ['Turquoise coast', 'Overnight on a private gulet with swimming stops in hidden coves.'],
    ],
  },
  {
    slug: 'thailand', name: 'Thailand', country: 'Southeast Asia', tag: 'Islands & spice',
    image: P.thai, alt: P.thai2, lat: 13.7, lon: 100.5, perNight: 150, from: 1890,
    desc: 'Longtail boats, limestone karsts and street-food symphonies. Thailand pairs warm-hearted hospitality with some of the planet’s most beautiful water.',
    best: 'Nov — Feb', temp: '31°C', flight: '11h 30', duration: '9 nights',
    highlights: ['Phang Nga Bay by speedboat', 'Bangkok rooftop dining', 'Elephant sanctuary visit', 'Thai cooking masterclass', 'Private island hopping'],
    itinerary: [
      ['Bangkok by river', 'Longtail through the canals, temple visits and a rooftop dinner above the Chao Phraya.'],
      ['Chiang Mai', 'Ethical elephant sanctuary, lantern-lit old city and a northern cooking class.'],
      ['Phuket arrival', 'Beachfront villa check-in and sunset on Promthep Cape.'],
      ['Phang Nga Bay', 'Private speedboat, sea-kayaking through hidden hongs and the James Bond island.'],
      ['Koh Lanta', 'Slow days, Thai massage and a farewell beach barbecue.'],
    ],
  },
  {
    slug: 'morocco', name: 'Morocco', country: 'North Africa', tag: 'Riads & Sahara',
    image: P.morocco, alt: P.morocco2, lat: 31.6, lon: -8.0, perNight: 160, from: 1790,
    desc: 'A sensory kaleidoscope of saffron, indigo and rose-pink walls. Sleep in a hidden riad, haggle in the medina and camp beneath a Saharan sky.',
    best: 'Mar — May · Sep — Nov', temp: '26°C', flight: '3h 20', duration: '7 nights',
    highlights: ['Marrakech riad stay', 'Luxury Sahara camp', 'Atlas mountain villages', 'Chefchaouen blue city', 'Argan & hammam rituals'],
    itinerary: [
      ['Marrakech medina', 'Private guide through the souks, followed by dinner in a candle-lit riad courtyard.'],
      ['Atlas crossing', 'Scenic drive over the Tizi n’Tichka pass, with lunch in a Berber village.'],
      ['Aït Benhaddou', 'Walk the cinematic kasbah, then onwards to Merzouga.'],
      ['Sahara night', 'Camel trek at sunset and a private tented camp with live gnawa music.'],
      ['Essaouira', 'Atlantic breezes, fresh grilled fish and artists’ galleries on the ramparts.'],
    ],
  },
]

export const dest = (slug) => destinations.find((d) => d.slug === slug) || moreDestinations.find((d) => d.slug === slug)
export const allDestinations = () => [...destinations, ...moreDestinations]

/* Additional destinations shown on the interactive globe (full detail pages too) */
export const moreDestinations = [
  {
    slug: 'santorini', name: 'Santorini', country: 'Greece', tag: 'Caldera sunsets',
    image: '1570077188670-e3a8d69ac5ff', alt: '1533105079780-92b9be482077', lat: 36.39, lon: 25.46, perNight: 330, from: 2490,
    desc: 'Whitewashed villages stacked on a volcanic caldera, blue-domed chapels and the most famous sunsets in the Aegean. Santorini is romance with a view.',
    best: 'May — Oct', temp: '24°C', flight: '3h 40', duration: '5 nights',
    highlights: ['Oia sunset terrace', 'Caldera catamaran cruise', 'Volcanic wine tasting', 'Cave suites with plunge pools'],
    itinerary: [
      ['Arrival in Fira', 'Private transfer to your cave suite and a welcome dinner above the caldera.'],
      ['Caldera by sea', 'Sail past the volcano, swim in hot springs and lunch on board.'],
      ['Vineyards & villages', 'Taste Assyrtiko wines among volcanic vines, then watch sunset from Oia.'],
      ['Slow Aegean day', 'Red Beach, a long lunch in Pyrgos and a farewell dinner by candlelight.'],
    ],
  },
  {
    slug: 'rome', name: 'Rome', country: 'Italy', tag: 'The eternal city',
    image: '1552832230-c0197dd311b5', alt: '1515542622106-78bda8ba0e5b', lat: 41.9, lon: 12.5, perNight: 300, from: 2190,
    desc: 'Three thousand years of history on every corner. Walk from the Colosseum to the Trevi Fountain, then settle into a trattoria for the best pasta of your life.',
    best: 'Apr — Jun · Sep — Oct', temp: '19°C', flight: '2h 05', duration: '4 nights',
    highlights: ['After-hours Vatican visit', 'Colosseum underground', 'Pasta-making masterclass', 'Vespa tour at sunset'],
    itinerary: [
      ['Ancient Rome', 'Colosseum arena floor and Roman Forum with a private archaeologist.'],
      ['Vatican at dawn', 'Early-access Sistine Chapel and St Peter’s dome climb.'],
      ['Trastevere flavours', 'Market tour, cooking class and a Roman supper.'],
      ['Baroque Rome', 'Piazza Navona, the Pantheon and an aperitivo on a rooftop terrace.'],
    ],
  },
  {
    slug: 'tokyo', name: 'Tokyo', country: 'Japan', tag: 'Neon & tradition',
    image: '1540959733332-eab4deabeeaf', alt: '1493976040374-85c8e12f0c0e', lat: 35.68, lon: 139.69, perNight: 340, from: 3190,
    desc: 'Electric neon districts beside silent shrines. Tokyo effortlessly blends the ultra-modern with centuries of craft — and the food is unmatched.',
    best: 'Mar — May · Oct — Nov', temp: '18°C', flight: '12h 40', duration: '6 nights',
    highlights: ['Omakase sushi counter', 'Senso-ji at dawn', 'Mount Fuji day trip', 'Shibuya & Shinjuku by night'],
    itinerary: [
      ['Old Tokyo', 'Asakusa and Senso-ji with a local guide, then a tempura lunch.'],
      ['Modern Tokyo', 'Shibuya crossing, Harajuku and a digital-art museum.'],
      ['Fuji & Hakone', 'Day trip with onsen soak and views of Mount Fuji.'],
      ['Tsukiji & tea', 'Market breakfast, tea ceremony and an omakase farewell.'],
    ],
  },
  {
    slug: 'new-york', name: 'New York', country: 'United States', tag: 'The city that never sleeps',
    image: '1496442226666-8d4d0e62e6e9', alt: '1485871981521-5b1fd3805eee', lat: 40.71, lon: -74.0, perNight: 420, from: 2990,
    desc: 'Skyscraper canyons, Broadway lights and world-class museums. New York rewards every kind of traveller with something unforgettable on every block.',
    best: 'Apr — Jun · Sep — Nov', temp: '15°C', flight: '8h 15', duration: '5 nights',
    highlights: ['Broadway front-row seats', 'Helicopter over Manhattan', 'The Met after hours', 'Brooklyn food crawl'],
    itinerary: [
      ['Midtown icons', 'Top of the Rock at sunset and Times Square after dark.'],
      ['Museums & Central Park', 'The Met, a bike ride through Central Park and a Broadway show.'],
      ['Downtown & harbour', 'Statue of Liberty ferry, 9/11 Memorial and Brooklyn Bridge walk.'],
      ['Brooklyn bites', 'Williamsburg, DUMBO and a pizza-and-skyline farewell.'],
    ],
  },
  {
    slug: 'sydney', name: 'Sydney', country: 'Australia', tag: 'Harbour & beaches',
    image: '1506973035872-a4ec16b8e8d9', alt: '1524293581917-878a6d017c71', lat: -33.87, lon: 151.21, perNight: 350, from: 3890,
    desc: 'A sparkling harbour, golden beaches and the Opera House sails. Sydney is outdoors living at its most glamorous.',
    best: 'Sep — Nov · Mar — May', temp: '22°C', flight: '22h 00', duration: '6 nights',
    highlights: ['Private harbour sail', 'Opera House backstage', 'Bondi to Coogee coastal walk', 'Blue Mountains day trip'],
    itinerary: [
      ['Harbour icons', 'Opera House tour and the Rocks historic district.'],
      ['Under sail', 'Private yacht across the harbour with lunch on board.'],
      ['Beaches', 'Bondi to Coogee clifftop walk, then fresh seafood at Watsons Bay.'],
      ['Blue Mountains', 'Three Sisters lookout, scenic railway and rainforest walk.'],
    ],
  },
  {
    slug: 'cape-town', name: 'Cape Town', country: 'South Africa', tag: 'Mountain meets ocean',
    image: '1580060839134-75a5edca2e99', alt: '1576485290814-1c72aa4bbb8e', lat: -33.92, lon: 18.42, perNight: 260, from: 2790,
    desc: 'Table Mountain towering over two oceans, world-class wine valleys and penguin-dotted beaches. Cape Town is wild beauty with a cosmopolitan heart.',
    best: 'Nov — Mar', temp: '23°C', flight: '11h 30', duration: '6 nights',
    highlights: ['Table Mountain cable car', 'Cape Point & penguins', 'Winelands tasting', 'Safari day trip'],
    itinerary: [
      ['Table Mountain', 'Cable car to the summit and sunset sundowners over Camps Bay.'],
      ['Cape Peninsula', 'Cape Point, Boulders Beach penguins and a seafood lunch.'],
      ['Winelands', 'Stellenbosch and Franschhoek estates with a private sommelier.'],
      ['Big Five day', 'Nearby private reserve game drive with champagne breakfast.'],
    ],
  },
  {
    slug: 'rio', name: 'Rio de Janeiro', country: 'Brazil', tag: 'Rhythm & rainforest',
    image: '1483729558449-99ef09a8c325', alt: '1544989164-31dc3c645987', lat: -22.91, lon: -43.17, perNight: 240, from: 2590,
    desc: 'Sugarloaf Mountain, golden beaches and samba on every corner. Rio is a joyful collision of rainforest, rhythm and sea.',
    best: 'Dec — Mar', temp: '27°C', flight: '11h 45', duration: '6 nights',
    highlights: ['Christ the Redeemer', 'Sugarloaf cable car', 'Ipanema sunset', 'Samba night in Lapa'],
    itinerary: [
      ['Corcovado', 'Train to Christ the Redeemer and panoramic views over the bay.'],
      ['Sugarloaf & beaches', 'Cable car at golden hour, then Ipanema beach club.'],
      ['Rainforest & favelas', 'Tijuca National Park hike and a community-led cultural tour.'],
      ['Samba', 'Santa Teresa trams and a live samba night in Lapa.'],
    ],
  },
]

export const offers = [
  { id: 'o1', title: 'Early Bird Overwater Escape', dest: 'maldives', discount: 30, old: 5560, price: 3890, nights: 7, image: P.maldives, code: 'AZURA30', perk: 'Free seaplane transfer' },
  { id: 'o2', title: 'Cappadocia Sunrise Package', dest: 'turkey', discount: 25, old: 2650, price: 1990, nights: 7, image: P.turkey, code: 'BALLOON25', perk: 'Private balloon flight' },
  { id: 'o3', title: 'Alpine Winter Retreat', dest: 'switzerland', discount: 20, old: 4110, price: 3290, nights: 6, image: P.swiss, code: 'ALPS20', perk: 'Glacier Express upgrade' },
  { id: 'o4', title: 'Bali Wellness & Soul', dest: 'bali', discount: 35, old: 3520, price: 2290, nights: 8, image: P.bali, code: 'ZEN35', perk: 'Daily spa ritual' },
  { id: 'o5', title: 'Dubai Sky & Dunes', dest: 'dubai', discount: 22, old: 3580, price: 2790, nights: 5, image: P.dubai, code: 'SKY22', perk: 'Helicopter transfer' },
  { id: 'o6', title: 'Sahara Starlight Journey', dest: 'morocco', discount: 28, old: 2490, price: 1790, nights: 7, image: P.morocco, code: 'DUNE28', perk: 'Luxury desert camp night' },
]

export const categories = ['All', 'Romantic', 'Adventure', 'Family', 'Luxury', 'Culture']

export const packages = [
  { id: 'p1', title: 'The Overwater Honeymoon', dest: 'maldives', days: 8, price: 4890, cat: 'Romantic', rating: 4.98, image: P.maldives2, tag: 'Bestseller', includes: ['Return flights', 'Overwater villa', 'Half-board', 'Sunset cruise', 'Couple’s spa'] },
  { id: 'p2', title: 'Ubud & Uluwatu Odyssey', dest: 'bali', days: 9, price: 2690, cat: 'Culture', rating: 4.92, image: P.bali, tag: 'Soulful', includes: ['Return flights', 'Private villa', 'Daily breakfast', 'Temple ceremony', 'Private driver'] },
  { id: 'p3', title: 'Desert & Skyline Grand Tour', dest: 'dubai', days: 6, price: 3190, cat: 'Luxury', rating: 4.9, image: P.dubai, tag: 'New', includes: ['Return flights', '5★ suite', 'Desert camp night', 'Helicopter tour', 'Chauffeur'] },
  { id: 'p4', title: 'Matterhorn & Glacier Express', dest: 'switzerland', days: 7, price: 3790, cat: 'Adventure', rating: 4.95, image: P.swiss2, tag: 'Iconic', includes: ['Rail passes', 'Alpine chalet', 'Half-board', 'Helicopter flight', 'Ski guide'] },
  { id: 'p5', title: 'Cappadocia & Istanbul Classic', dest: 'turkey', days: 8, price: 2290, cat: 'Culture', rating: 4.9, image: P.turkey, tag: 'Value', includes: ['Return flights', 'Cave suite', 'Balloon flight', 'Bosphorus cruise', 'Private guide'] },
  { id: 'p6', title: 'Phang Nga Family Adventure', dest: 'thailand', days: 10, price: 2490, cat: 'Family', rating: 4.88, image: P.thai, tag: 'Family favourite', includes: ['Return flights', 'Beach villa', 'Island hopping', 'Cooking class', 'Kids’ club'] },
  { id: 'p7', title: 'Riads & Royal Sahara', dest: 'morocco', days: 8, price: 2190, cat: 'Adventure', rating: 4.93, image: P.morocco, tag: 'Editor’s pick', includes: ['Return flights', 'Boutique riads', 'Sahara camp', '4x4 & driver', 'Cooking class'] },
  { id: 'p8', title: 'Private Island Retreat', dest: 'maldives', days: 10, price: 7490, cat: 'Luxury', rating: 5.0, image: P.maldives, tag: 'Ultra luxe', includes: ['First-class flights', 'Private island villa', 'All-inclusive', 'Butler', 'Seaplane charter'] },
  { id: 'p9', title: 'Siam Sunset Romance', dest: 'thailand', days: 9, price: 2790, cat: 'Romantic', rating: 4.91, image: P.thai2, tag: 'Romantic', includes: ['Return flights', 'Pool villa', 'Private yacht day', 'Couple’s massage', 'Candle-lit dinners'] },
]

export const hotels = [
  { id: 'h1', name: 'Coral Mirage Atoll Resort', dest: 'maldives', stars: 5, night: 1290, rating: 9.8, image: P.maldives2, amenities: ['Overwater villa', 'Private pool', 'Underwater spa', 'Butler'], blurb: 'A crescent of 38 overwater villas on a private house-reef.' },
  { id: 'h2', name: 'Jungle Canopy Ubud', dest: 'bali', stars: 5, night: 640, rating: 9.6, image: P.beach, amenities: ['Valley view', 'Infinity pool', 'Yoga pavilion', 'Organic farm'], blurb: 'Teak villas cantilevered over the Ayung River gorge.' },
  { id: 'h3', name: 'Palais Zenith Dubai', dest: 'dubai', stars: 5, night: 890, rating: 9.5, image: P.pool2, amenities: ['Skyline suite', 'Rooftop pool', 'Private beach', 'Michelin dining'], blurb: 'Forty-eight floors of understated Arabian glamour.' },
  { id: 'h4', name: 'Chalet Edelweiss Zermatt', dest: 'switzerland', stars: 5, night: 1050, rating: 9.7, image: P.hotel1, amenities: ['Matterhorn view', 'Ski-in/out', 'Wellness spa', 'Fireside lounge'], blurb: 'A cashmere-soft alpine hideaway at the foot of the mountain.' },
  { id: 'h5', name: 'Cave Suites Göreme', dest: 'turkey', stars: 5, night: 420, rating: 9.4, image: P.hotel2, amenities: ['Cave suite', 'Balloon terrace', 'Hammam', 'Wine cellar'], blurb: 'Hand-carved suites with private terraces facing the balloons.' },
  { id: 'h6', name: 'Siam Tides Beach Villas', dest: 'thailand', stars: 5, night: 480, rating: 9.5, image: P.pool, amenities: ['Beachfront', 'Private pool', 'Thai spa', 'Kids’ club'], blurb: 'Whitewashed villas facing the Andaman Sea.' },
  { id: 'h7', name: 'Riad Safran Marrakech', dest: 'morocco', stars: 5, night: 390, rating: 9.6, image: P.hotel4, amenities: ['Courtyard pool', 'Hammam', 'Rooftop terrace', 'Cooking class'], blurb: 'A 17th-century riad restored with zellige tiles and cedar.' },
  { id: 'h8', name: 'Azure Sands Overwater', dest: 'maldives', stars: 5, night: 980, rating: 9.4, image: P.hotel5, amenities: ['Water slide villa', 'Snorkel reef', 'Kids’ club', 'All-inclusive'], blurb: 'Playful luxury for families on a glowing lagoon.' },
]

export const experiences = [
  { id: 'e1', title: 'Hot-Air Balloon Dawn', place: 'Cappadocia', image: P.turkey, text: 'Rise with the sun over fairy chimneys and land to a champagne breakfast.' },
  { id: 'e2', title: 'Overwater Private Dining', place: 'Maldives', image: P.maldives, text: 'A lantern-lit table on a sandbank, a chef, a sommelier and only the sea.' },
  { id: 'e3', title: 'Sahara Starlight Camp', place: 'Morocco', image: P.morocco2, text: 'Camel at sunset, gnawa music and a tented suite beneath the Milky Way.' },
  { id: 'e4', title: 'Alpine Peaks by Helicopter', place: 'Switzerland', image: P.swiss2, text: 'Circle the Matterhorn and land on a glacier for a summit toast.' },
  { id: 'e5', title: 'Temple & Terrace Sunrise', place: 'Bali', image: P.bali, text: 'A private ceremony at dawn followed by a walk through emerald paddies.' },
  { id: 'e6', title: 'Deep Blue Diving', place: 'Thailand', image: P.dive, text: 'Dive with reef sharks and sea turtles guided by a PADI master.' },
]

export const testimonials = [
  { name: 'Camille & Julien R.', place: 'Maldives honeymoon', text: 'Every single detail was anticipated. The seaplane, the private sandbank dinner, the handwritten notes — Azura turned our honeymoon into something cinematic.', rating: 5 },
  { name: 'Sofia Marchetti', place: 'Cappadocia & Istanbul', text: 'I have travelled with many agencies. Azura is the first that felt like a friend with impeccable taste and an excellent address book.', rating: 5 },
  { name: 'The Okafor Family', place: 'Thailand family journey', text: 'Three kids, one plan, zero stress. Our concierge handled everything from the strollers to the cooking class. We are already planning next year.', rating: 5 },
  { name: 'Daniel Whitfield', place: 'Swiss Alps', text: 'The Glacier Express in first class followed by a helicopter over the Matterhorn. I still do not know how they arranged the weather.', rating: 5 },
  { name: 'Amira Haddad', place: 'Morocco in spring', text: 'Staying in a hidden riad and sleeping in the dunes felt like stepping into a film. Utterly flawless logistics throughout.', rating: 5 },
  { name: 'Lucas & Mei Tanaka', place: 'Bali retreat', text: 'Authentic, thoughtful, serene. They introduced us to people and places we would never have found on our own.', rating: 5 },
]

export const features = [
  { title: 'Bespoke by design', text: 'No templates. Every itinerary is composed around your tastes, pace and passions by a destination specialist.', icon: 'compass' },
  { title: 'Private access', text: 'Closed-door temples, after-hours museums, chef’s tables — doors that stay shut for others open for you.', icon: 'key' },
  { title: '24/7 concierge', text: 'A real human, on call in your time zone, from the first inspiration to the moment you land home.', icon: 'chat' },
  { title: 'Handpicked partners', text: 'We personally inspect every hotel, guide and driver. If we would not send our family, we do not send you.', icon: 'shield' },
]

export const stats = [
  { n: 18, suffix: '+', label: 'Years of craft' },
  { n: 42000, suffix: '', label: 'Journeys delivered' },
  { n: 97, suffix: '%', label: 'Guests who rebook' },
  { n: 64, suffix: '', label: 'Countries curated' },
]

export const extras = [
  { id: 'transfer', label: 'Private chauffeur transfers', price: 180, per: 'trip' },
  { id: 'spa', label: 'Signature spa journey', price: 240, per: 'person' },
  { id: 'insurance', label: 'Premium travel insurance', price: 95, per: 'person' },
  { id: 'dining', label: 'Chef’s table experience', price: 320, per: 'person' },
  { id: 'photo', label: 'Private travel photographer', price: 450, per: 'trip' },
]

export const tiers = [
  { id: 'essential', label: 'Essential', mult: 1, text: '4★ stays, curated highlights, shared guides' },
  { id: 'signature', label: 'Signature', mult: 1.45, text: '5★ stays, private guides, one hero experience' },
  { id: 'royal', label: 'Royal', mult: 2.2, text: 'Ultra-luxe villas, butler, private transfers & jets' },
]

export const faqs = [
  ['How far ahead should I book?', 'For peak seasons we recommend 4–6 months ahead, but our concierge team regularly crafts last-minute journeys within 72 hours.'],
  ['Can I customise any package?', 'Absolutely. Every package is a starting point — swap hotels, add experiences, extend nights or change pace entirely.'],
  ['What is your cancellation policy?', 'Free cancellation up to 45 days before departure on most journeys. Flexible “Azura Assure” cover is available on request.'],
  ['Do you handle visas and insurance?', 'Yes. Our travel desk prepares visa documentation and recommends premium cover tailored to your itinerary.'],
]

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/offers', label: 'Offers' },
  { to: '/packages', label: 'Packages' },
  { to: '/hotels', label: 'Hotels' },
  { to: '/experiences', label: 'Experiences' },
  { to: '/about', label: 'Why Azura' },
  { to: '/contact', label: 'Contact' },
]

export const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
