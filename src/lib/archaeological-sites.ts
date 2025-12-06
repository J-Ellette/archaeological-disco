import { ArchaeologicalSite } from './types'

export const archaeologicalSites: ArchaeologicalSite[] = [
  {
    id: 'angkor-wat',
    name: 'Angkor Wat',
    type: 'temple',
    period: '12th Century CE',
    description: 'The largest religious monument in the world, originally constructed as a Hindu temple dedicated to Vishnu, later transformed into a Buddhist temple. The temple complex represents the pinnacle of Khmer architecture and is Cambodia\'s most famous landmark.',
    lat: 13.4125,
    lng: 103.8670,
    discovered: '1860',
    significance: 'high'
  },
  {
    id: 'machu-picchu',
    name: 'Machu Picchu',
    type: 'settlement',
    period: '15th Century CE',
    description: 'An Incan citadel set high in the Andes Mountains in Peru. Built in the 15th century and later abandoned, it is renowned for its sophisticated dry-stone walls and astronomical alignments. The site remained unknown to the outside world until its scientific discovery in 1911.',
    lat: -13.1631,
    lng: -72.5450,
    discovered: '1911',
    significance: 'high'
  },
  {
    id: 'petra',
    name: 'Petra',
    type: 'settlement',
    period: '4th Century BCE',
    description: 'An archaeological city in southern Jordan famous for its rock-cut architecture and water conduit system. Established as the capital of the Nabataean Kingdom, it is one of the New Seven Wonders of the World.',
    lat: 30.3285,
    lng: 35.4444,
    discovered: '1812',
    significance: 'high'
  },
  {
    id: 'stonehenge',
    name: 'Stonehenge',
    type: 'monument',
    period: '3000-2000 BCE',
    description: 'A prehistoric monument consisting of a ring of standing stones in Wiltshire, England. Each stone is around 13 feet high and weighs around 25 tons. The purpose and construction methods remain subjects of intense debate.',
    lat: 51.1789,
    lng: -1.8262,
    discovered: 'Ancient (documented 1130 CE)',
    significance: 'high'
  },
  {
    id: 'pompeii',
    name: 'Pompeii',
    type: 'settlement',
    period: '79 CE',
    description: 'An ancient Roman city preserved under volcanic ash from Mount Vesuvius. The eruption buried the city, preserving buildings, artifacts, and even the forms of victims in the positions they were in when they died.',
    lat: 40.7516,
    lng: 14.4900,
    discovered: '1748',
    significance: 'high'
  },
  {
    id: 'teotihuacan',
    name: 'Teotihuacan',
    type: 'settlement',
    period: '100 BCE - 750 CE',
    description: 'An ancient Mesoamerican city located in the Basin of Mexico. Known for its pyramids including the Pyramid of the Sun and the Pyramid of the Moon, it was one of the largest cities in the ancient world.',
    lat: 19.6925,
    lng: -98.8438,
    discovered: 'Pre-Columbian knowledge',
    significance: 'high'
  },
  {
    id: 'gobekli-tepe',
    name: 'Göbekli Tepe',
    type: 'monument',
    period: '9600-8200 BCE',
    description: 'One of the world\'s oldest known temple structures. Located in southeastern Turkey, it predates Stonehenge by thousands of years and challenges our understanding of early human civilization.',
    lat: 37.2233,
    lng: 38.9225,
    discovered: '1963',
    significance: 'high'
  },
  {
    id: 'tikal',
    name: 'Tikal',
    type: 'settlement',
    period: '600 BCE - 900 CE',
    description: 'One of the largest urban centers of the ancient Maya civilization. Located in the rainforests of Guatemala, it contains temples reaching over 70 meters in height and numerous palaces.',
    lat: 17.2221,
    lng: -89.6236,
    discovered: '1848',
    significance: 'high'
  },
  {
    id: 'chichen-itza',
    name: 'Chichén Itzá',
    type: 'settlement',
    period: '600-1200 CE',
    description: 'A large pre-Columbian city built by the Maya people of the Terminal Classic period. The site exhibits a multitude of architectural styles and is home to the famous El Castillo pyramid.',
    lat: 20.6843,
    lng: -88.5678,
    discovered: '1841',
    significance: 'high'
  },
  {
    id: 'valley-of-kings',
    name: 'Valley of the Kings',
    type: 'burial',
    period: '1539-1075 BCE',
    description: 'A valley in Egypt where rock-cut tombs were excavated for pharaohs and powerful nobles of the New Kingdom. The valley contains 63 tombs, including that of Tutankhamun.',
    lat: 25.7402,
    lng: 32.6014,
    discovered: 'Ancient (systematic excavation 1799)',
    significance: 'high'
  },
  {
    id: 'great-zimbabwe',
    name: 'Great Zimbabwe',
    type: 'settlement',
    period: '11th-15th Century CE',
    description: 'A medieval city in southeastern Zimbabwe. It was the capital of the Kingdom of Zimbabwe and is famous for its massive stone walls built without mortar.',
    lat: -20.2667,
    lng: 30.9333,
    discovered: '1871',
    significance: 'high'
  },
  {
    id: 'mohenjo-daro',
    name: 'Mohenjo-daro',
    type: 'settlement',
    period: '2500-1900 BCE',
    description: 'An archaeological site in Pakistan that was one of the largest settlements of the ancient Indus Valley Civilization. Notable for its advanced urban planning, including a sophisticated drainage system.',
    lat: 27.3244,
    lng: 68.1375,
    discovered: '1922',
    significance: 'high'
  }
]
