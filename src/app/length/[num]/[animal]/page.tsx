import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadAnimalData, loadIndex, type AnimalData } from "@/lib/data";

type Props = { params: Promise<{ num: string; animal: string }> };

const VALID_LENGTHS = [3, 4, 5, 6, 7, 8, 9, 10];

const PRIORITY_ANIMALS = [
  "aardvark",
  "albatross",
  "alligator",
  "alpaca",
  "anaconda",
  "angelfish",
  "anglerfish",
  "ant",
  "anteater",
  "antelope",
  "arctic-fox",
  "armadillo",
  "axolotl",
  "baboon",
  "badger",
  "bald-eagle",
  "ball-python",
  "bandicoot",
  "barn-owl",
  "bass",
  "bat",
  "bear",
  "bearded-dragon",
  "beaver",
  "bee",
  "beetle",
  "beluga",
  "betta",
  "betta-fish",
  "bighorn-sheep",
  "bilby",
  "bird",
  "bison",
  "blue-jay",
  "blue-tongued-skink",
  "blue-whale",
  "bobcat",
  "bongo",
  "budgie",
  "buffalo",
  "bumblebee",
  "butterfly",
  "camel",
  "canary",
  "capuchin-monkey",
  "capybara",
  "caracal",
  "cardinal",
  "caribou",
  "carp",
  "cassowary",
  "cat",
  "caterpillar",
  "catfish",
  "centipede",
  "chameleon",
  "cheetah",
  "chicken",
  "chimpanzee",
  "chinchilla",
  "chipmunk",
  "cichlid",
  "clownfish",
  "cobra",
  "cockatiel",
  "cockatoo",
  "cockroach",
  "condor",
  "cormorant",
  "corn-snake",
  "cougar",
  "cow",
  "coyote",
  "crab",
  "crane",
  "crested-gecko",
  "cricket",
  "crocodile",
  "crow",
  "cuckoo",
  "deer",
  "dingo",
  "discus",
  "dog",
  "dolphin",
  "donkey",
  "dragon",
  "dragonfly",
  "duck",
  "dugong",
  "eagle",
  "earthworm",
  "echidna",
  "elephant",
  "elk",
  "emu",
  "ermine",
  "falcon",
  "fennec-fox",
  "ferret",
  "finch",
  "fire-bellied-toad",
  "firefly",
  "fish",
  "fisher",
  "flamingo",
  "fox",
  "frog",
  "garter-snake",
  "gazelle",
  "gecko",
  "gelada",
  "gerbil",
  "gibbon",
  "giraffe",
  "goat",
  "golden-eagle",
  "goldfish",
  "goose",
  "gorilla",
  "grasshopper",
  "great-horned-owl",
  "great-white-shark",
  "green-tree-python",
  "griffin",
  "groundhog",
  "guinea-pig",
  "guppy",
  "hammerhead-shark",
  "hamster",
  "harpy-eagle",
  "hawk",
  "hedgehog",
  "hermit-crab",
  "heron",
  "hippo",
  "hippopotamus",
  "honey-badger",
  "hornbill",
  "horse",
  "howler-monkey",
  "hummingbird",
  "humpback-whale",
  "hyena",
  "ibex",
  "iguana",
  "impala",
  "jackal",
  "jaguar",
  "jellyfish",
  "kangaroo",
  "kestrel",
  "kingfisher",
  "kiwi",
  "koala",
  "koi",
  "komodo-dragon",
  "kookaburra",
  "kudu",
  "ladybug",
  "lemur",
  "leopard",
  "leopard-gecko",
  "lion",
  "lizard",
  "llama",
  "lobster",
  "lovebird",
  "lynx",
  "macaque",
  "macaw",
  "manatee",
  "mandrill",
  "manta-ray",
  "margay",
  "marlin",
  "marmoset",
  "marmot",
  "marten",
  "meerkat",
  "mermaid",
  "milk-snake",
  "millipede",
  "mink",
  "mockingbird",
  "molly",
  "mongoose",
  "monitor-lizard",
  "monkey",
  "moose",
  "mosquito",
  "mountain-goat",
  "mouse",
  "musk-ox",
  "narwhal",
  "newt",
  "nightingale",
  "numbat",
  "ocelot",
  "octopus",
  "okapi",
  "orangutan",
  "orca",
  "oryx",
  "osprey",
  "ostrich",
  "otter",
  "owl",
  "ox",
  "pacman-frog",
  "painted-turtle",
  "panda",
  "pangolin",
  "parakeet",
  "parrot",
  "peacock",
  "pegasus",
  "pelican",
  "penguin",
  "perch",
  "phoenix",
  "pig",
  "pigeon",
  "platypus",
  "poison-dart-frog",
  "polar-bear",
  "porcupine",
  "prairie-dog",
  "praying-mantis",
  "proboscis-monkey",
  "pronghorn",
  "pufferfish",
  "puffin",
  "puma",
  "python",
  "quail",
  "quokka",
  "rabbit",
  "raccoon",
  "raccoon-dog",
  "rat",
  "rattlesnake",
  "raven",
  "red-eared-slider",
  "red-panda",
  "reindeer",
  "rhino",
  "rhinoceros",
  "robin",
  "salamander",
  "salmon",
  "scorpion",
  "sea-lion",
  "sea-turtle",
  "seagull",
  "seahorse",
  "seal",
  "secretary-bird",
  "serval",
  "shark",
  "sheep",
  "shrimp",
  "skink",
  "skunk",
  "sloth",
  "snail",
  "snake",
  "snow-leopard",
  "snowy-owl",
  "sparrow",
  "sperm-whale",
  "spider",
  "spider-monkey",
  "springbok",
  "squirrel",
  "squirrel-monkey",
  "starfish",
  "stick-insect",
  "stingray",
  "stoat",
  "stork",
  "swan",
  "swordfish",
  "tamarin",
  "tapir",
  "tarantula",
  "tasmanian-devil",
  "termite",
  "tetra",
  "tiger",
  "tiger-shark",
  "toad",
  "tortoise",
  "toucan",
  "tree-frog",
  "trout",
  "tuna",
  "turkey",
  "turtle",
  "unicorn",
  "vulture",
  "walrus",
  "warthog",
  "wasp",
  "waterbuck",
  "weasel",
  "werewolf",
  "whale",
  "wild-boar",
  "wildebeest",
  "wolf",
  "wolverine",
  "wombat",
  "woodpecker",
  "yak",
  "zebra"
];

const NAME_FIELDS: (keyof AnimalData)[] = [
  "maleNames", "femaleNames", "cuteNames", "funnyNames",
  "fantasyNames", "uniqueNames", "coolNames", "babyNames",
];

export async function generateStaticParams() {
  const animals = await loadIndex();
  const animalSet = new Set(PRIORITY_ANIMALS);
  const priorityAnimals = animals.filter(a => animalSet.has(a.slug));
  
  const params: { num: string; animal: string }[] = [];
  for (const a of priorityAnimals) {
    for (const n of VALID_LENGTHS) {
      params.push({ num: String(n), animal: a.slug });
    }
  }
  return params;
}

export const dynamicParams = true;
export const revalidate = 86400;

function getNamesByLength(data: AnimalData, length: number): string[] {
  const seen = new Set<string>();
  const results: string[] = [];
  
  for (const field of NAME_FIELDS) {
    const names = data[field] as string[] | undefined;
    if (!names) continue;
    for (const name of names) {
      if (name.length === length && !seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase());
        results.push(name);
      }
    }
  }
  
  return results.sort((a, b) => a.localeCompare(b));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { num, animal } = await params;
  const length = parseInt(num, 10);
  const data = await loadAnimalData(animal);
  if (!data) return { title: "Not Found" };
  
  const title = `${length} Letter ${data.displayName} Names — ${data.icon}`;
  const description = `Browse ${data.displayName.toLowerCase()} names with exactly ${length} letters. Short, memorable, and perfect for your ${data.displayName.toLowerCase()}. Free and instant.`;
  
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `https://bestanimalnames.com/length/${num}/${animal}/` },
  };
}

export default async function LengthPage({ params }: Props) {
  const { num, animal } = await params;
  const length = parseInt(num, 10);
  
  if (!VALID_LENGTHS.includes(length)) notFound();
  
  const data = await loadAnimalData(animal);
  if (!data) notFound();
  
  const names = getNamesByLength(data, length);
  const allAnimals = await loadIndex();
  
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://bestanimalnames.com/" },
          { "@type": "ListItem", position: 2, name: `${data.displayName} Names`, item: `https://bestanimalnames.com/${animal}-names/` },
          { "@type": "ListItem", position: 3, name: `${length} Letter Names`, item: `https://bestanimalnames.com/length/${num}/${animal}/` },
        ],
      }) }} />
      
      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
        <Link href={`/${animal}-names/`} className="hover:text-primary">{data.displayName} Names</Link><span>/</span>
        <span className="text-gray-800 font-medium">{length} Letter Names</span>
      </nav>
      
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
            {data.icon} {length} Letter {data.displayName} Names
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Browse {names.length} handpicked {data.displayName.toLowerCase()} names with exactly {length} letters. Short, memorable names that are easy to call and remember.
          </p>
        </div>
      </section>
      
      <section className="max-w-4xl mx-auto px-4 py-8">
        {/* Length Navigation */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Browse by Name Length</h2>
          <div className="flex flex-wrap gap-2">
            {VALID_LENGTHS.map(n => (
              <Link
                key={n}
                href={`/length/${n}/${animal}/`}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  n === length
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                {n} Letters
              </Link>
            ))}
          </div>
        </div>
        
        {/* Names Grid */}
        {names.length > 0 ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {data.icon} {length} Letter {data.displayName} Names ({names.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {names.map((name, i) => (
                <Link
                  key={i}
                  href={`/${animal}-names/`}
                  className="bg-emerald-50 hover:bg-emerald-100 rounded-lg px-3 py-2 text-center text-sm font-medium text-gray-800 hover:text-emerald-700 transition-colors border border-emerald-100 hover:border-emerald-300"
                >
                  {name}
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href={`/${animal}-names/`}
                className="text-emerald-600 hover:underline text-sm font-semibold"
              >
                See all {data.displayName} names →
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 rounded-2xl p-8 text-center border border-amber-100 mb-8">
            <p className="text-amber-800 text-lg font-semibold mb-2">
              No {length}-letter names found for {data.displayName}
            </p>
            <p className="text-amber-600">
              Try a different length to find {data.displayName.toLowerCase()} names!
            </p>
          </div>
        )}
        
        {/* Also Browse by Letter */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold mb-4">🔤 Also Browse by Starting Letter</h2>
          <div className="flex flex-wrap gap-1.5">
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l => (
              <Link
                key={l}
                href={`/startswith/${l}/${animal}/`}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Related Animals */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold mb-4">🐾 More {length} Letter Animal Names</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {allAnimals
              .filter(a => a.slug !== animal)
              .slice(0, 12)
              .map(a => (
                <Link
                  key={a.slug}
                  href={`/length/${num}/${a.slug}/`}
                  className="bg-gray-50 hover:bg-emerald-50 rounded-lg p-3 text-center text-sm font-medium text-gray-700 hover:text-emerald-700 transition-colors"
                >
                  <div className="text-xl mb-1">{a.icon}</div>
                  <div className="text-xs">{a.name}</div>
                </Link>
              ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 text-center">
          <p className="text-lg font-semibold mb-2">Ready to find the perfect {data.displayName.toLowerCase()} name?</p>
          <p className="text-gray-600 mb-4">
            Browse our complete collection of {data.displayName.toLowerCase()} names — by length, letter, category, and style.
          </p>
          <Link
            href={`/${animal}-names/`}
            className="inline-block bg-emerald-600 text-white font-bold px-6 py-3 rounded-full hover:bg-emerald-700 transition-colors"
          >
            Browse All {data.displayName} Names →
          </Link>
        </div>
      </section>
    </>
  );
}
