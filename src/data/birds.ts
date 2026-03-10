import { ImageSource } from 'expo-image'

export interface Bird {
  id: string
  name: string
  species: string
  rarity: 'common' | 'uncommon' | 'rare'
  latitude: number
  longitude: number
  image: ImageSource
  description: string
}

export const birds: Bird[] = [
  { id: '1', name: 'European Robin', species: 'Erithacus rubecula', rarity: 'common', latitude: 38.7223, longitude: -9.1393, image: require('@/assets/birds/european-robin.jpg'), description: 'A small, plump bird with a distinctive orange-red breast.' },
  { id: '2', name: 'Common Blackbird', species: 'Turdus merula', rarity: 'common', latitude: 38.7250, longitude: -9.1500, image: require('@/assets/birds/common-blackbird.jpg'), description: 'Males are all black with an orange-yellow bill.' },
  { id: '3', name: 'White Stork', species: 'Ciconia ciconia', rarity: 'common', latitude: 38.7100, longitude: -9.1350, image: require('@/assets/birds/white-stork.jpg'), description: 'Large bird with white plumage, black wing feathers, and a long red bill.' },
  { id: '4', name: 'Eurasian Blue Tit', species: 'Cyanistes caeruleus', rarity: 'common', latitude: 38.7300, longitude: -9.1450, image: require('@/assets/birds/eurasian-blue-tit.jpg'), description: 'Small, colorful bird with a blue cap and yellow underparts.' },
  { id: '5', name: 'Sardinian Warbler', species: 'Curruca melanocephala', rarity: 'common', latitude: 38.7180, longitude: -9.1280, image: require('@/assets/birds/sardinian-warbler.jpg'), description: 'A small warbler with a distinctive black head and red eye-ring.' },
  { id: '6', name: 'House Sparrow', species: 'Passer domesticus', rarity: 'common', latitude: 38.7260, longitude: -9.1420, image: require('@/assets/birds/house-sparrow.jpg'), description: 'One of the most familiar birds, often found near human habitation.' },
  { id: '7', name: 'Common Swift', species: 'Apus apus', rarity: 'common', latitude: 38.7200, longitude: -9.1550, image: require('@/assets/birds/common-swift.jpg'), description: 'Dark, sickle-shaped wings. Spends most of its life in flight.' },
  { id: '8', name: 'Serin', species: 'Serinus serinus', rarity: 'common', latitude: 38.7150, longitude: -9.1600, image: require('@/assets/birds/serin.jpg'), description: 'Tiny finch with a yellow-green body and streaked flanks.' },
  { id: '9', name: 'Goldfinch', species: 'Carduelis carduelis', rarity: 'common', latitude: 38.7280, longitude: -9.1320, image: require('@/assets/birds/goldfinch.jpg'), description: 'Striking red face with black and white head and golden wing bars.' },
  { id: '10', name: 'Grey Heron', species: 'Ardea cinerea', rarity: 'uncommon', latitude: 38.7120, longitude: -9.1250, image: require('@/assets/birds/grey-heron.jpg'), description: 'Tall wading bird with grey plumage and a long yellowish bill.' },
  { id: '11', name: 'Peregrine Falcon', species: 'Falco peregrinus', rarity: 'uncommon', latitude: 38.7350, longitude: -9.1380, image: require('@/assets/birds/peregrine-falcon.jpg'), description: 'The fastest bird in the world, reaching speeds over 300 km/h.' },
  { id: '12', name: 'Common Kingfisher', species: 'Alcedo atthis', rarity: 'uncommon', latitude: 38.7080, longitude: -9.1480, image: require('@/assets/birds/common-kingfisher.jpg'), description: 'Electric blue and orange, dives headfirst to catch fish.' },
  { id: '13', name: 'Hoopoe', species: 'Upupa epops', rarity: 'uncommon', latitude: 38.7190, longitude: -9.1180, image: require('@/assets/birds/hoopoe.jpg'), description: 'Distinctive crown of feathers and a long, thin, curved bill.' },
  { id: '14', name: 'Little Egret', species: 'Egretta garzetta', rarity: 'uncommon', latitude: 38.7050, longitude: -9.1350, image: require('@/assets/birds/little-egret.jpg'), description: 'Elegant white heron with black legs and yellow feet.' },
  { id: '15', name: 'Eurasian Spoonbill', species: 'Platalea leucorodia', rarity: 'rare', latitude: 38.7000, longitude: -9.1300, image: require('@/assets/birds/eurasian-spoonbill.jpg'), description: 'Large white bird with a distinctive spatula-shaped bill.' },
  { id: '16', name: 'Black Stork', species: 'Ciconia nigra', rarity: 'rare', latitude: 38.7400, longitude: -9.1200, image: require('@/assets/birds/black-stork.jpg'), description: 'Shy forest dweller with glossy black plumage and red bill.' },
  { id: '17', name: 'Eagle Owl', species: 'Bubo bubo', rarity: 'rare', latitude: 38.7380, longitude: -9.1100, image: require('@/assets/birds/eagle-owl.jpg'), description: 'One of the largest owls, with prominent ear tufts and orange eyes.' },
  { id: '18', name: 'Flamingo', species: 'Phoenicopterus roseus', rarity: 'rare', latitude: 38.6950, longitude: -9.1400, image: require('@/assets/birds/flamingo.jpg'), description: 'Tall pink wading bird with a distinctive downward-bending bill.' },
  { id: '19', name: 'Bee-eater', species: 'Merops apiaster', rarity: 'uncommon', latitude: 38.7320, longitude: -9.1550, image: require('@/assets/birds/bee-eater.jpg'), description: 'One of Europe\'s most colorful birds with rainbow plumage.' },
  { id: '20', name: 'Iberian Magpie', species: 'Cyanopica cooki', rarity: 'uncommon', latitude: 38.7160, longitude: -9.1650, image: require('@/assets/birds/iberian-magpie.jpg'), description: 'Beautiful blue-winged corvid endemic to the Iberian Peninsula.' },
]
