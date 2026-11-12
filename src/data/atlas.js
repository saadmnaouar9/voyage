import { allDestinations, img } from './data'

export const continents = ['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania']
export const travelCategories = ['Beach', 'City', 'Culture', 'Adventure', 'Romantic', 'Luxury', 'Nature']

// Extra, real-world facts for the globe panel (keyed by destination slug)
const info = {
  maldives: {
    continent: 'Asia', cats: ['Beach', 'Romantic', 'Luxury', 'Nature'], currency: 'Maldivian rufiyaa (MVR) · USD widely accepted', language: 'Dhivehi · English widely spoken',
    budget: '$350 – $900 / day', level: 4, tempRange: '27 – 31°C',
    attractions: ['Baa Atoll Biosphere Reserve', 'Hanifaru Bay manta rays', 'Malé Old Friday Mosque', 'Maafushi sandbanks'],
    activities: ['Snorkelling & diving', 'Sunset dolphin cruise', 'Overwater spa', 'Sandbank picnics'],
  },
  bali: {
    continent: 'Asia', cats: ['Culture', 'Romantic', 'Nature', 'Beach'], currency: 'Indonesian rupiah (IDR)', language: 'Indonesian · Balinese · English',
    budget: '$120 – $400 / day', level: 2, tempRange: '26 – 31°C',
    attractions: ['Tanah Lot Temple', 'Tegallalang Rice Terraces', 'Uluwatu Temple', 'Sacred Monkey Forest, Ubud'],
    activities: ['Mount Batur sunrise trek', 'Yoga & wellness retreats', 'Surfing in Canggu', 'Waterfall swimming'],
  },
  dubai: {
    continent: 'Asia', cats: ['City', 'Luxury', 'Adventure'], currency: 'UAE dirham (AED)', language: 'Arabic · English',
    budget: '$250 – $800 / day', level: 4, tempRange: '24 – 34°C',
    attractions: ['Burj Khalifa', 'Dubai Mall & Fountain', 'Palm Jumeirah', 'Al Fahidi Historic District'],
    activities: ['Desert safari', 'Helicopter tour', 'Souk shopping', 'Yacht cruising'],
  },
  switzerland: {
    continent: 'Europe', cats: ['Nature', 'Adventure', 'Luxury', 'Romantic'], currency: 'Swiss franc (CHF)', language: 'German · French · Italian · Romansh',
    budget: '$300 – $700 / day', level: 4, tempRange: '-2 – 24°C',
    attractions: ['Matterhorn, Zermatt', 'Jungfraujoch', 'Lake Lucerne & Chapel Bridge', 'Lavaux Vineyards'],
    activities: ['Skiing & snowboarding', 'Glacier Express journey', 'Alpine hiking', 'Chocolate & cheese tasting'],
  },
  turkey: {
    continent: 'Europe', cats: ['Culture', 'Adventure', 'Romantic'], currency: 'Turkish lira (TRY)', language: 'Turkish · English in tourist areas',
    budget: '$100 – $350 / day', level: 2, tempRange: '14 – 32°C',
    attractions: ['Hagia Sophia, Istanbul', 'Cappadocia fairy chimneys', 'Pamukkale terraces', 'Ephesus ancient city'],
    activities: ['Hot-air balloon flight', 'Bosphorus cruise', 'Turkish hammam', 'Gulet sailing'],
  },
  thailand: {
    continent: 'Asia', cats: ['Beach', 'Culture', 'Adventure'], currency: 'Thai baht (THB)', language: 'Thai · English in resorts',
    budget: '$80 – $300 / day', level: 2, tempRange: '26 – 35°C',
    attractions: ['Grand Palace, Bangkok', 'Phi Phi Islands', 'Doi Suthep, Chiang Mai', 'Railay Beach'],
    activities: ['Island hopping', 'Thai cooking class', 'Ethical elephant sanctuary', 'Scuba diving'],
  },
  morocco: {
    continent: 'Africa', cats: ['Culture', 'Adventure', 'Luxury'], currency: 'Moroccan dirham (MAD)', language: 'Arabic · Berber · French',
    budget: '$90 – $320 / day', level: 2, tempRange: '15 – 35°C',
    attractions: ['Jemaa el-Fnaa, Marrakech', 'Aït Benhaddou', 'Chefchaouen blue city', 'Hassan II Mosque'],
    activities: ['Sahara camel trek', 'Medina souk tour', 'Hammam & argan spa', 'Atlas mountain hiking'],
  },
  santorini: {
    continent: 'Europe', cats: ['Romantic', 'Beach', 'Culture', 'Luxury'], currency: 'Euro (EUR)', language: 'Greek · English widely spoken',
    budget: '$200 – $600 / day', level: 3, tempRange: '15 – 29°C',
    attractions: ['Oia sunset viewpoint', 'Akrotiri archaeological site', 'Red Beach', 'Fira to Oia caldera walk'],
    activities: ['Catamaran caldera cruise', 'Volcanic wine tasting', 'Sunset dinner', 'Photography tours'],
  },
  rome: {
    continent: 'Europe', cats: ['City', 'Culture', 'Romantic'], currency: 'Euro (EUR)', language: 'Italian · English in tourist areas',
    budget: '$180 – $500 / day', level: 3, tempRange: '8 – 31°C',
    attractions: ['Colosseum', 'Vatican Museums & St Peter’s', 'Trevi Fountain', 'Roman Forum'],
    activities: ['Pasta-making class', 'Vespa tour', 'Trastevere food walk', 'Vatican early access'],
  },
  tokyo: {
    continent: 'Asia', cats: ['City', 'Culture', 'Adventure'], currency: 'Japanese yen (JPY)', language: 'Japanese · English signage widespread',
    budget: '$180 – $600 / day', level: 3, tempRange: '5 – 31°C',
    attractions: ['Senso-ji Temple', 'Shibuya Crossing', 'Meiji Shrine', 'teamLab digital art'],
    activities: ['Omakase sushi', 'Mount Fuji day trip', 'Tea ceremony', 'Cherry-blossom picnics'],
  },
  'new-york': {
    continent: 'North America', cats: ['City', 'Luxury', 'Culture'], currency: 'US dollar (USD)', language: 'English',
    budget: '$250 – $800 / day', level: 4, tempRange: '0 – 29°C',
    attractions: ['Statue of Liberty', 'Central Park', 'Top of the Rock', 'The Metropolitan Museum of Art'],
    activities: ['Broadway show', 'Helicopter tour', 'Brooklyn Bridge walk', 'Food tours'],
  },
  sydney: {
    continent: 'Oceania', cats: ['Beach', 'City', 'Adventure'], currency: 'Australian dollar (AUD)', language: 'English',
    budget: '$200 – $600 / day', level: 3, tempRange: '9 – 26°C',
    attractions: ['Sydney Opera House', 'Harbour Bridge', 'Bondi Beach', 'Blue Mountains'],
    activities: ['Harbour sailing', 'Bondi–Coogee coastal walk', 'Bridge climb', 'Wildlife park visit'],
  },
  'cape-town': {
    continent: 'Africa', cats: ['Nature', 'Adventure', 'Culture'], currency: 'South African rand (ZAR)', language: 'English · Afrikaans · Xhosa',
    budget: '$120 – $450 / day', level: 2, tempRange: '8 – 27°C',
    attractions: ['Table Mountain', 'Cape Point', 'Boulders Beach penguins', 'Stellenbosch Winelands'],
    activities: ['Safari day trip', 'Wine tasting', 'Shark-cage diving', 'Sundowner hikes'],
  },
  rio: {
    continent: 'South America', cats: ['Beach', 'City', 'Culture', 'Adventure'], currency: 'Brazilian real (BRL)', language: 'Portuguese · limited English',
    budget: '$100 – $400 / day', level: 2, tempRange: '21 – 30°C',
    attractions: ['Christ the Redeemer', 'Sugarloaf Mountain', 'Copacabana & Ipanema', 'Tijuca National Park'],
    activities: ['Samba night', 'Favela cultural tour', 'Hang-gliding', 'Beach volleyball'],
  },
}

export const atlas = allDestinations().map((d) => ({
  ...d,
  ...info[d.slug],
  gallery: d.image === d.alt ? [d.image] : [d.image, d.alt],
}))

export const atlasBySlug = (slug) => atlas.find((d) => d.slug === slug)
export const thumb = (d, w = 600) => img(d.image, w)
