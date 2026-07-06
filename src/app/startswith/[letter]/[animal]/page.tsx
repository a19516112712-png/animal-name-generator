import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadAnimalData, loadIndex, type AnimalData } from "@/lib/data";

type Props = { params: Promise<{ letter: string; animal: string }> };

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

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
  
  const params: { letter: string; animal: string }[] = [];
  for (const a of priorityAnimals) {
    for (const l of ALL_LETTERS) {
      params.push({ letter: l, animal: a.slug });
    }
  }
  return params;
}

export const dynamicParams = true;
export const revalidate = 86400;

function getNamesStartingWith(data: AnimalData, letter: string): string[] {
  const upper = letter.toUpperCase();
  const seen = new Set<string>();
  const results: string[] = [];
  
  for (const field of NAME_FIELDS) {
    const names = data[field] as string[] | undefined;
    if (!names) continue;
    for (const name of names) {
      if (name.charAt(0).toUpperCase() === upper && !seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase());
        results.push(name);
      }
    }
  }
  
  return results.sort((a, b) => a.localeCompare(b));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { letter, animal } = await params;
  const upper = letter.toUpperCase();
  const data = await loadAnimalData(animal);
  if (!data) return { title: "Not Found" };
  
  const title = `${data.displayName} Names That Start With ${upper} — ${data.icon}`;
  const description = `Browse ${data.displayName.toLowerCase()} names starting with ${upper}. Find the perfect name for your ${data.displayName.toLowerCase()} from our handpicked collection. Free and instant.`;
  
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `https://bestanimalnames.com/startswith/${upper}/${animal}/` },
  };
}

export default async function StartWithPage({ params }: Props) {
  const { letter, animal } = await params;
  const upper = letter.toUpperCase();
  
  if (!ALL_LETTERS.includes(upper)) notFound();
  
  const data = await loadAnimalData(animal);
  if (!data) notFound();
  
  const names = getNamesStartingWith(data, upper);
  
  const allAnimals = await loadIndex();
  const otherLetters = ALL_LETTERS.filter(l => l !== upper);
  
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://bestanimalnames.com/" },
          { "@type": "ListItem", position: 2, name: `${data.displayName} Names`, item: `https://bestanimalnames.com/${animal}-names/` },
          { "@type": "ListItem", position: 3, name: `Start With ${upper}`, item: `https://bestanimalnames.com/startswith/${upper}/${animal}/` },
        ],
      }) }} />
      
      <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-1 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
        <Link href={`/${animal}-names/`} className="hover:text-primary">{data.displayName} Names</Link><span>/</span>
        <span className="text-gray-800 font-medium">Start With {upper}</span>
      </nav>
      
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
            {data.icon} {data.displayName} Names That Start With {upper}
          </h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            Browse {names.length} handpicked {data.displayName.toLowerCase()} names beginning with the letter {upper}. Find the perfect name for your {data.displayName.toLowerCase()}.
          </p>
        </div>
      </section>
      
      <section className="max-w-4xl mx-auto px-4 py-8">
        {/* Letter Navigation */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Browse by Letter</h2>
          <div className="flex flex-wrap gap-1.5">
            {ALL_LETTERS.map(l => (
              <Link
                key={l}
                href={`/startswith/${l}/${animal}/`}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                  l === upper
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Names Grid */}
        {names.length > 0 ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {data.icon} {data.displayName} Names Starting With {upper} ({names.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {names.map((name, i) => (
                <Link
                  key={i}
                  href={`/${animal}-names/`}
                  className="bg-gray-50 hover:bg-primary/5 rounded-lg px-3 py-2 text-center text-sm font-medium text-gray-800 hover:text-primary transition-colors border border-gray-100 hover:border-primary/20"
                >
                  {name}
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href={`/${animal}-names/`}
                className="text-primary hover:underline text-sm font-semibold"
              >
                See all {data.displayName} names →
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 rounded-2xl p-8 text-center border border-amber-100 mb-8">
            <p className="text-amber-800 text-lg font-semibold mb-2">No names found for letter &quot;{upper}&quot;</p>
            <p className="text-amber-600">
              Try another letter to find {data.displayName.toLowerCase()} names. We have names for every letter!
            </p>
          </div>
        )}
        
        {/* Related Animals */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold mb-4">🐾 More Animal Names Starting With {upper}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {allAnimals
              .filter(a => a.slug !== animal)
              .slice(0, 12)
              .map(a => (
                <Link
                  key={a.slug}
                  href={`/startswith/${upper}/${a.slug}/`}
                  className="bg-gray-50 hover:bg-primary/5 rounded-lg p-3 text-center text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  <div className="text-xl mb-1">{a.icon}</div>
                  <div className="text-xs">{a.name}</div>
                </Link>
              ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 text-center">
          <p className="text-lg font-semibold mb-2">Ready to find the perfect {data.displayName.toLowerCase()} name?</p>
          <p className="text-gray-600 mb-4">
            Browse our complete collection of {data.displayName.toLowerCase()} names — sorted by letter, category, and style. All 100% free.
          </p>
          <Link
            href={`/${animal}-names/`}
            className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors"
          >
            Browse All {data.displayName} Names →
          </Link>
        </div>
      </section>
    </>
  );
}
