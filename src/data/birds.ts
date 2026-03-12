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
  sightings: number
  habitat: string
  diet: string
  wingspan: string
  weight: string
  length: string
  conservationStatus: string
  funFact: string
  family: string
}

export const birds: Bird[] = [
  {
    id: '1', name: 'European Robin', species: 'Erithacus rubecula', rarity: 'common', latitude: 38.7223, longitude: -9.1393, image: require('@/assets/birds/european-robin.jpg'), sightings: 47,
    family: 'Muscicapidae', length: '12.5–14 cm', wingspan: '20–22 cm', weight: '14–21 g', conservationStatus: 'Least Concern',
    description: 'A small, plump bird instantly recognizable by its bright orange-red breast and face. The European Robin is one of the most beloved garden birds across Europe, often approaching humans closely in search of food turned up by digging.',
    habitat: 'Found in woodlands, hedgerows, parks, and gardens across Europe and into western Siberia. It favors areas with dense undergrowth for nesting, and readily adapts to urban and suburban environments.',
    diet: 'Feeds on insects, spiders, and worms, supplemented with berries and seeds in autumn and winter.',
    funFact: 'European Robins are fiercely territorial — they have been known to attack red objects, mistaking them for rival birds.',
  },
  {
    id: '2', name: 'Common Blackbird', species: 'Turdus merula', rarity: 'common', latitude: 38.7250, longitude: -9.1500, image: require('@/assets/birds/common-blackbird.jpg'), sightings: 63,
    family: 'Turdidae', length: '23.5–29 cm', wingspan: '34–38 cm', weight: '80–125 g', conservationStatus: 'Least Concern',
    description: 'Males are entirely jet-black with a bright orange-yellow bill and eye-ring, while females are brown with streaked underparts. One of the most common and melodious songbirds in Europe, its rich fluting song is a hallmark of dawn and dusk.',
    habitat: 'Thrives in woodland, gardens, hedgerows, and parks. Originally a forest bird, it has become one of the most successful urban colonizers across Europe and has been introduced to Australia and New Zealand.',
    diet: 'Omnivorous, feeding on earthworms, insects, and berries. Often seen flipping leaf litter on the ground to uncover prey.',
    funFact: 'The Common Blackbird was the first bird species scientifically documented to sing at night under artificial street lighting.',
  },
  {
    id: '3', name: 'White Stork', species: 'Ciconia ciconia', rarity: 'common', latitude: 38.7100, longitude: -9.1350, image: require('@/assets/birds/white-stork.jpg'), sightings: 31,
    family: 'Ciconiidae', length: '100–115 cm', wingspan: '155–215 cm', weight: '2.3–4.5 kg', conservationStatus: 'Least Concern',
    description: 'A large, striking bird with white plumage, black flight feathers, and a long red bill and legs. White Storks are a symbol of good luck in many European cultures and are famous for nesting on rooftops and chimneys.',
    habitat: 'Inhabits open farmland, meadows, and wetland margins across Europe, North Africa, and western Asia. Strongly associated with human settlements, where they build enormous stick nests on buildings and utility poles.',
    diet: 'Feeds on frogs, fish, insects, earthworms, and small mammals. Forages by walking slowly through shallow water or grassland.',
    funFact: 'Portugal has one of the largest White Stork populations in Europe, with many nesting year-round rather than migrating to Africa.',
  },
  {
    id: '4', name: 'Eurasian Blue Tit', species: 'Cyanistes caeruleus', rarity: 'common', latitude: 38.7300, longitude: -9.1450, image: require('@/assets/birds/eurasian-blue-tit.jpg'), sightings: 38,
    family: 'Paridae', length: '10.5–12 cm', wingspan: '17.5–20 cm', weight: '11 g', conservationStatus: 'Least Concern',
    description: 'A small, colorful bird with a bright blue cap, yellow underparts, and white face with a dark eye-stripe. Agile and acrobatic, Blue Tits are frequent visitors to garden feeders and readily use nest boxes.',
    habitat: 'Common in deciduous and mixed woodlands, parks, gardens, and hedgerows throughout Europe. Prefers oak woodlands where caterpillar prey is abundant during the breeding season.',
    diet: 'Primarily insectivorous during breeding season, especially caterpillars. In winter, supplements with seeds, nuts, and fat from bird feeders.',
    funFact: 'In the 1920s, Blue Tits in Britain learned to pierce the foil caps of milk bottles to drink the cream — a famous example of cultural learning in birds.',
  },
  {
    id: '5', name: 'Sardinian Warbler', species: 'Curruca melanocephala', rarity: 'common', latitude: 38.7180, longitude: -9.1280, image: require('@/assets/birds/sardinian-warbler.jpg'), sightings: 22,
    family: 'Sylviidae', length: '13–14 cm', wingspan: '15–18 cm', weight: '10–14 g', conservationStatus: 'Least Concern',
    description: 'A lively warbler with a distinctive black cap on males, a bright red eye-ring, and grey-brown upperparts. Females have a grey head. Known for its scolding, rattling call often heard from dense scrub.',
    habitat: 'A Mediterranean specialist, found in maquis, garigue, and dense scrubby habitats. Also occurs in gardens, olive groves, and parks across southern Europe and North Africa.',
    diet: 'Feeds mainly on insects and spiders, gleaning prey from low bushes and undergrowth. Also takes berries and small fruits, especially in autumn.',
    funFact: 'Unlike most warblers, the Sardinian Warbler is largely resident and does not undertake long-distance migration.',
  },
  {
    id: '6', name: 'House Sparrow', species: 'Passer domesticus', rarity: 'common', latitude: 38.7260, longitude: -9.1420, image: require('@/assets/birds/house-sparrow.jpg'), sightings: 89,
    family: 'Passeridae', length: '16 cm', wingspan: '19–25 cm', weight: '24–39.5 g', conservationStatus: 'Least Concern',
    description: 'One of the most familiar and widespread birds on Earth, closely associated with human habitation. Males have a grey crown, black bib, and chestnut nape, while females are streaky brown. Their cheerful chirping is a constant soundtrack to urban life.',
    habitat: 'Almost exclusively found near human settlements — cities, towns, farms, and villages. Nests in cavities in buildings, under roof tiles, and in nest boxes. Rare in undisturbed natural habitats.',
    diet: 'Primarily granivorous, feeding on seeds and grains. Also takes insects during breeding season and readily scavenges food scraps from human sources.',
    funFact: 'House Sparrows have followed humans to every continent except Antarctica, making them one of the most widely distributed birds in the world.',
  },
  {
    id: '7', name: 'Common Swift', species: 'Apus apus', rarity: 'common', latitude: 38.7200, longitude: -9.1550, image: require('@/assets/birds/common-swift.jpg'), sightings: 41,
    family: 'Apodidae', length: '16–17 cm', wingspan: '38–40 cm', weight: '36–50 g', conservationStatus: 'Least Concern',
    description: 'A supremely aerial bird with dark, sickle-shaped wings and a screaming call. The Common Swift spends almost its entire life on the wing — eating, sleeping, and even mating in flight. It only lands to nest.',
    habitat: 'Breeds in towns and cities across Europe, nesting in crevices in old buildings and under roof eaves. Spends winters in sub-Saharan Africa. Feeds over a wide range of aerial habitats.',
    diet: 'Exclusively insectivorous, catching flying insects and airborne spiders (ballooning spiders) on the wing. A single swift can consume thousands of insects per day.',
    funFact: 'Young Swifts can spend up to three consecutive years in the air after fledging, never landing until they return to breed.',
  },
  {
    id: '8', name: 'Serin', species: 'Serinus serinus', rarity: 'common', latitude: 38.7150, longitude: -9.1600, image: require('@/assets/birds/serin.jpg'), sightings: 29,
    family: 'Fringillidae', length: '11–12 cm', wingspan: '18–20 cm', weight: '11–13 g', conservationStatus: 'Least Concern',
    description: 'A tiny finch with a yellow-green body, streaked flanks, and a stubby bill. Males have a bright yellow forehead and breast. The Serin delivers its rapid, jingling song from exposed perches, often in towns and gardens.',
    habitat: 'Found in parks, gardens, orchards, and woodland edges across southern and central Europe. Prefers warm, open areas with scattered trees and is particularly common in Mediterranean countries.',
    diet: 'Feeds almost entirely on small seeds, especially from weeds and grasses. Occasionally takes small insects during the breeding season.',
    funFact: 'The Serin is the wild ancestor of the domestic canary, which was first bred from the closely related Atlantic Canary.',
  },
  {
    id: '9', name: 'Goldfinch', species: 'Carduelis carduelis', rarity: 'common', latitude: 38.7280, longitude: -9.1320, image: require('@/assets/birds/goldfinch.jpg'), sightings: 35,
    family: 'Fringillidae', length: '12–13 cm', wingspan: '21–25 cm', weight: '14–19 g', conservationStatus: 'Least Concern',
    description: 'A strikingly beautiful finch with a crimson-red face, black and white head, and broad golden-yellow wing bars that flash in flight. Its tinkling, liquid song and charming appearance have made it a favourite of artists for centuries.',
    habitat: 'Favors open and semi-open areas with scattered trees, including orchards, gardens, roadsides, and wasteland. Found across Europe, North Africa, and western Asia.',
    diet: 'Specializes in small seeds, particularly those of thistles, teasels, and dandelions. Its slender, pointed bill is perfectly adapted for extracting seeds from seed heads.',
    funFact: 'A group of Goldfinches is called a "charm" — a name that dates back to the Middle Ages and refers to their delightful song.',
  },
  {
    id: '10', name: 'Grey Heron', species: 'Ardea cinerea', rarity: 'uncommon', latitude: 38.7120, longitude: -9.1250, image: require('@/assets/birds/grey-heron.jpg'), sightings: 12,
    family: 'Ardeidae', length: '84–102 cm', wingspan: '155–195 cm', weight: '1–2 kg', conservationStatus: 'Least Concern',
    description: 'A tall, elegant wading bird with blue-grey plumage, a white head with a black eye-stripe extending into long plumes, and a powerful yellowish dagger-like bill. Often seen standing motionless at the water\'s edge, waiting to strike at prey.',
    habitat: 'Found near all types of water — rivers, lakes, estuaries, marshes, and coastal shores. Nests colonially in tall trees (heronries). Widespread across Europe, Asia, and Africa.',
    diet: 'Feeds mainly on fish, but also takes amphibians, small mammals, insects, and even other birds. Hunts by standing still or wading slowly, then striking with a lightning-fast thrust of its bill.',
    funFact: 'Grey Herons can swallow fish up to 25 cm long whole, thanks to their expandable throat and neck.',
  },
  {
    id: '11', name: 'Peregrine Falcon', species: 'Falco peregrinus', rarity: 'uncommon', latitude: 38.7350, longitude: -9.1380, image: require('@/assets/birds/peregrine-falcon.jpg'), sightings: 8,
    family: 'Falconidae', length: '34–50 cm', wingspan: '74–120 cm', weight: '330–1,500 g', conservationStatus: 'Least Concern',
    description: 'The fastest animal on Earth, capable of reaching speeds over 320 km/h in its hunting stoop. A powerful raptor with a blue-grey back, barred white underparts, and a distinctive dark moustache mark. Its piercing eyes and streamlined body make it a supreme aerial predator.',
    habitat: 'Found on every continent except Antarctica. Nests on cliff ledges and increasingly on tall buildings and bridges in cities. Hunts over open terrain, coasts, and urban areas.',
    diet: 'Feeds almost exclusively on medium-sized birds such as pigeons, doves, and shorebirds, caught in spectacular high-speed aerial pursuits.',
    funFact: 'During a hunting stoop, a Peregrine Falcon experiences forces of up to 25 G — more than astronauts during a rocket launch.',
  },
  {
    id: '12', name: 'Common Kingfisher', species: 'Alcedo atthis', rarity: 'uncommon', latitude: 38.7080, longitude: -9.1480, image: require('@/assets/birds/common-kingfisher.jpg'), sightings: 15,
    family: 'Alcedinidae', length: '16 cm', wingspan: '25 cm', weight: '34–46 g', conservationStatus: 'Least Concern',
    description: 'A dazzling jewel of European waterways, with electric cobalt-blue upperparts and vivid orange underparts. Despite its brilliant colors, it can be surprisingly hard to spot as it perches motionless on a branch overhanging the water.',
    habitat: 'Found along slow-moving rivers, streams, lakes, and canals with clear water and overhanging vegetation. Nests in burrows dug into sandy or earth banks along waterways.',
    diet: 'Feeds primarily on small fish, caught by plunge-diving headfirst from a perch or hovering position. Also takes aquatic insects and small crustaceans.',
    funFact: 'The Kingfisher\'s beak inspired the design of the Japanese Shinkansen bullet train nose, which reduced noise and improved efficiency.',
  },
  {
    id: '13', name: 'Hoopoe', species: 'Upupa epops', rarity: 'uncommon', latitude: 38.7190, longitude: -9.1180, image: require('@/assets/birds/hoopoe.jpg'), sightings: 11,
    family: 'Upupidae', length: '25–32 cm', wingspan: '44–48 cm', weight: '46–89 g', conservationStatus: 'Least Concern',
    description: 'An unmistakable bird with a spectacular fan-shaped crest tipped with black, pinkish-brown plumage, and boldly barred black-and-white wings. Its undulating, butterfly-like flight and distinctive "hoo-poo-poo" call make it one of the most charismatic birds in Europe.',
    habitat: 'Prefers warm, dry, open habitats such as pastures, vineyards, orchards, and olive groves. Found across southern Europe, Africa, and Asia. Nests in tree holes, wall cavities, and nest boxes.',
    diet: 'Probes the ground with its long, curved bill for insects, larvae, and grubs. Also takes small lizards, frogs, and seeds.',
    funFact: 'Hoopoe chicks can spray a foul-smelling liquid at intruders from their preen gland — an effective defense that smells like rotting meat.',
  },
  {
    id: '14', name: 'Little Egret', species: 'Egretta garzetta', rarity: 'uncommon', latitude: 38.7050, longitude: -9.1350, image: require('@/assets/birds/little-egret.jpg'), sightings: 18,
    family: 'Ardeidae', length: '55–65 cm', wingspan: '88–106 cm', weight: '350–550 g', conservationStatus: 'Least Concern',
    description: 'An elegant, slender white heron with a black bill, black legs, and distinctive bright yellow feet. In breeding plumage, it develops two long, delicate plumes on the back of the head. Its graceful hunting dances in shallow water are a delight to watch.',
    habitat: 'Found in shallow coastal and freshwater wetlands, including estuaries, marshes, rice paddies, and lake margins. Widespread across southern Europe, Africa, Asia, and Australia.',
    diet: 'Feeds on small fish, amphibians, crustaceans, and aquatic insects. Uses an active hunting style, stirring up prey by shuffling its bright yellow feet in the mud.',
    funFact: 'Little Egrets were nearly hunted to extinction in the 19th century for their beautiful breeding plumes, which were used to decorate fashionable hats.',
  },
  {
    id: '15', name: 'Eurasian Spoonbill', species: 'Platalea leucorodia', rarity: 'rare', latitude: 38.7000, longitude: -9.1300, image: require('@/assets/birds/eurasian-spoonbill.jpg'), sightings: 3,
    family: 'Threskiornithidae', length: '80–93 cm', wingspan: '115–135 cm', weight: '1.1–1.9 kg', conservationStatus: 'Least Concern',
    description: 'A large, striking white bird with a unique spatula-shaped bill that it sweeps side to side through shallow water. In breeding plumage, adults develop a yellowish breast patch and a shaggy crest. Its unusual feeding method makes it one of Europe\'s most distinctive waterbirds.',
    habitat: 'Breeds in shallow freshwater and brackish wetlands, reed beds, and lagoons. Winters in coastal estuaries and mudflats. Found patchily across Europe, with strongholds in the Netherlands, Spain, and Portugal.',
    diet: 'Feeds by sweeping its bill through shallow water to catch small fish, crustaceans, insects, and molluscs. The sensitive bill tip detects prey by touch.',
    funFact: 'The Spoonbill\'s bill is actually straight when it hatches — the distinctive spoon shape only develops as the chick grows.',
  },
  {
    id: '16', name: 'Black Stork', species: 'Ciconia nigra', rarity: 'rare', latitude: 38.7400, longitude: -9.1200, image: require('@/assets/birds/black-stork.jpg'), sightings: 2,
    family: 'Ciconiidae', length: '95–100 cm', wingspan: '145–155 cm', weight: '2.7–3 kg', conservationStatus: 'Least Concern',
    description: 'A shy, forest-dwelling stork with glossy black plumage that shimmers with green and purple iridescence in sunlight. The underparts are white, and the bill and legs are bright red. Far more elusive than its white cousin, it is a prized sighting for any birdwatcher.',
    habitat: 'Nests in dense, undisturbed forests near rivers, streams, and wetlands. Requires large territories of old-growth forest. Found across Europe and Asia, wintering in Africa and southern Asia.',
    diet: 'Feeds on fish, amphibians, small reptiles, and aquatic insects. Forages along forest streams and in shallow pools, wading carefully through the water.',
    funFact: 'Unlike the sociable White Stork, Black Storks are solitary and secretive — a single breeding pair may require over 100 km² of forest territory.',
  },
  {
    id: '17', name: 'Eagle Owl', species: 'Bubo bubo', rarity: 'rare', latitude: 38.7380, longitude: -9.1100, image: require('@/assets/birds/eagle-owl.jpg'), sightings: 4,
    family: 'Strigidae', length: '56–75 cm', wingspan: '131–188 cm', weight: '1.2–4.2 kg', conservationStatus: 'Least Concern',
    description: 'One of the world\'s largest owls, with a massive barrel-shaped body, prominent ear tufts, and piercing deep-orange eyes. Its deep, booming "ooh-hu" call carries over several kilometres at dusk and is one of the most evocative sounds of the European wilderness.',
    habitat: 'Inhabits rocky gorges, cliff faces, quarries, and forested mountainsides. Also found in semi-desert areas and, increasingly, in urban environments across Europe and Asia.',
    diet: 'A powerful apex predator that takes a wide variety of prey including rats, rabbits, hares, hedgehogs, and other birds — even other raptors and owls up to the size of buzzards.',
    funFact: 'Eagle Owls are capable of taking prey as large as young deer fawns, and they are one of the few predators of other birds of prey.',
  },
  {
    id: '18', name: 'Flamingo', species: 'Phoenicopterus roseus', rarity: 'rare', latitude: 38.6950, longitude: -9.1400, image: require('@/assets/birds/flamingo.jpg'), sightings: 6,
    family: 'Phoenicopteridae', length: '110–150 cm', wingspan: '140–170 cm', weight: '2–4 kg', conservationStatus: 'Least Concern',
    description: 'A tall, unmistakable wading bird with pale pink plumage, strikingly long legs and neck, and a unique downward-bending bill. Flocks of flamingos create one of nature\'s most spectacular sights, turning salt lakes and lagoons into seas of pink.',
    habitat: 'Found in shallow, saline or alkaline lakes, lagoons, estuaries, and coastal mudflats. Breeds colonially in large numbers. In Portugal, regularly seen in the Tagus Estuary and the Algarve.',
    diet: 'Filter-feeds on tiny crustaceans (especially brine shrimp), algae, and diatoms. The carotenoid pigments in its crustacean diet give the flamingo its famous pink color.',
    funFact: 'Flamingos are actually born grey-white — their iconic pink color develops gradually from the carotenoid pigments in their diet of shrimp and algae.',
  },
  {
    id: '19', name: 'Bee-eater', species: 'Merops apiaster', rarity: 'uncommon', latitude: 38.7320, longitude: -9.1550, image: require('@/assets/birds/bee-eater.jpg'), sightings: 14,
    family: 'Meropidae', length: '27–29 cm', wingspan: '36–40 cm', weight: '44–78 g', conservationStatus: 'Least Concern',
    description: 'One of the most colorful birds in Europe, with a rainbow palette of chestnut and golden-yellow back, turquoise-blue underparts, and a distinctive black eye-stripe. Its graceful, swooping flight as it catches insects on the wing is a highlight of Mediterranean summers.',
    habitat: 'Breeds in open, warm habitats such as river valleys, sandy plains, and farmland across southern Europe, North Africa, and western Asia. Nests in colonies in burrows dug into sandy banks and earth cliffs.',
    diet: 'Specializes in catching flying insects, especially bees, wasps, and dragonflies. Catches prey in acrobatic aerial sallies from an exposed perch.',
    funFact: 'Before eating a bee, the Bee-eater removes the sting by repeatedly bashing the insect against a hard surface and squeezing out the venom.',
  },
  {
    id: '20', name: 'Iberian Magpie', species: 'Cyanopica cooki', rarity: 'uncommon', latitude: 38.7160, longitude: -9.1650, image: require('@/assets/birds/iberian-magpie.jpg'), sightings: 19,
    family: 'Corvidae', length: '31–35 cm', wingspan: '38–42 cm', weight: '65–76 g', conservationStatus: 'Least Concern',
    description: 'A beautiful, slender corvid with a black cap, pale blue wings and long tail, and a creamy-white throat and underparts. Found only in the Iberian Peninsula, it moves through woodlands in noisy, sociable flocks that chatter constantly.',
    habitat: 'Inhabits open cork oak and stone pine woodlands, olive groves, and parkland in Portugal and central-western Spain. Highly social, always found in groups. One of only two places in the world where this species occurs.',
    diet: 'Omnivorous, eating insects, berries, seeds, acorns, and scraps. Often forages on the ground in groups, and caches food for later use like other corvids.',
    funFact: 'The Iberian Magpie and its only relative, the Asian Azure-winged Magpie, are separated by over 9,000 km — a biogeographic mystery that puzzled scientists for decades.',
  },
]
