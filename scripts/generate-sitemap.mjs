// Build-time sitemap generator — chunked sitemaps ≤800 URLs each + sitemap index
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = "https://bestanimalnames.com";
const TODAY = new Date().toISOString().split("T")[0];
const MAX_PER_SITEMAP = 800;

// Load animal index
const dataDir = path.join(__dirname, "..", "src", "data", "animals");
const animals = JSON.parse(
  fs.readFileSync(path.join(dataDir, "index.json"), "utf-8")
);

function esc(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEl(url, changefreq, priority) {
  return `  <url>
    <loc>${esc(url)}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function wrapSitemap(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.join("\n")}
</urlset>`;
}

function writeChunkedSitemap(baseName, urls, sitemapRefs) {
  if (urls.length === 0) return;
  const chunks = [];
  for (let i = 0; i < urls.length; i += MAX_PER_SITEMAP) {
    chunks.push(urls.slice(i, i + MAX_PER_SITEMAP));
  }
  
  if (chunks.length === 1) {
    const fname = `${baseName}.xml`;
    fs.writeFileSync(path.join(publicDir, fname), wrapSitemap(chunks[0]));
    sitemapRefs.push({ loc: `${BASE}/${fname}`, lastmod: TODAY });
    return;
  }
  
  chunks.forEach((chunk, idx) => {
    const fname = `${baseName}-${idx + 1}.xml`;
    fs.writeFileSync(path.join(publicDir, fname), wrapSitemap(chunk));
    sitemapRefs.push({ loc: `${BASE}/${fname}`, lastmod: TODAY });
  });
}

const publicDir = path.join(__dirname, "..", "public");
fs.mkdirSync(publicDir, { recursive: true });

const sitemapRefs = []; // for the sitemap index

// ─── 1. CORE SITEMAP: static pages + guides + categories + blog ───
const coreUrls = [];

// Static pages
coreUrls.push(urlEl(BASE, "daily", "1.0"));
coreUrls.push(urlEl(`${BASE}/animals/`, "weekly", "0.8"));
coreUrls.push(urlEl(`${BASE}/blog/`, "weekly", "0.7"));
coreUrls.push(urlEl(`${BASE}/about/`, "monthly", "0.6"));
coreUrls.push(urlEl(`${BASE}/contact/`, "monthly", "0.6"));
coreUrls.push(urlEl(`${BASE}/privacy-policy/`, "monthly", "0.5"));
coreUrls.push(urlEl(`${BASE}/terms/`, "monthly", "0.5"));
coreUrls.push(urlEl(`${BASE}/disclaimer/`, "monthly", "0.5"));
coreUrls.push(urlEl(`${BASE}/cookie-policy/`, "monthly", "0.5"));
coreUrls.push(urlEl(`${BASE}/faq/`, "monthly", "0.6"));
coreUrls.push(urlEl(`${BASE}/editorial-policy/`, "monthly", "0.6"));
coreUrls.push(urlEl(`${BASE}/how-we-create-content/`, "monthly", "0.6"));

// Guide pages
const guideDir = path.join(__dirname, "..", "src", "data", "guides");
try {
  const guides = JSON.parse(fs.readFileSync(path.join(guideDir, "index.json"), "utf-8"));
  for (const g of guides) {
    coreUrls.push(urlEl(`${BASE}/guide/${g.slug}/`, "weekly", "0.8"));
  }
} catch (_) {}

// Category pages
const nameTypeKeys = ["names", "male", "female", "cute", "funny", "fantasy", "unique", "cool", "baby"];
const catDir = path.join(__dirname, "..", "src", "data", "categories");
try {
  const categories = JSON.parse(fs.readFileSync(path.join(catDir, "index.json"), "utf-8"));
  for (const c of categories) {
    coreUrls.push(urlEl(`${BASE}/category/${c.slug}/`, "weekly", "0.8"));
    for (const key of nameTypeKeys) {
      coreUrls.push(urlEl(`${BASE}/category/${c.slug}/${key}/`, "weekly", "0.7"));
    }
  }
} catch (_) {}

// Blog posts (small enough to fit in core)
const blogDir = path.join(__dirname, "..", "src", "data", "blog");
try {
  const blogPosts = JSON.parse(fs.readFileSync(path.join(blogDir, "index.json"), "utf-8"));
  for (const p of blogPosts) {
    coreUrls.push(urlEl(`${BASE}/blog/${p.slug}/`, "weekly", "0.7"));
  }
} catch (_) {}

writeChunkedSitemap("sitemap-core", coreUrls, sitemapRefs);
console.log(`   sitemap-core: ${coreUrls.length} URLs`);

// ─── 2. ANIMALS SITEMAP: all animal main pages ───
const animalUrls = [];
for (const a of animals) {
  animalUrls.push(urlEl(`${BASE}/animal/${a.slug}/`, "weekly", "0.9"));
}
writeChunkedSitemap("sitemap-animals", animalUrls, sitemapRefs);
console.log(`   sitemap-animals: ${animalUrls.length} URLs`);

// ─── 3. ANIMAL FACTS SITEMAP ───
const factsUrls = [];
for (const a of animals) {
  factsUrls.push(urlEl(`${BASE}/animal/${a.slug}/facts/`, "weekly", "0.8"));
}
writeChunkedSitemap("sitemap-animal-facts", factsUrls, sitemapRefs);
console.log(`   sitemap-animal-facts: ${factsUrls.length} URLs`);

// ─── 4. ANIMAL NAME TYPES SITEMAP ───
const nameTypeUrls = [];
for (const a of animals) {
  for (const key of nameTypeKeys) {
    const s = key === "names" ? `${a.slug}-names` : `${key}-${a.slug}-names`;
    nameTypeUrls.push(urlEl(`${BASE}/${s}/`, "weekly", "0.7"));
  }
}
writeChunkedSitemap("sitemap-name-types", nameTypeUrls, sitemapRefs);
console.log(`   sitemap-name-types: ${nameTypeUrls.length} URLs`);

// ─── 5. IDEAS SITEMAP ───
const ideasDir = path.join(__dirname, "..", "src", "data", "ideas");
const ideasUrls = [];
try {
  const ideas = JSON.parse(fs.readFileSync(path.join(ideasDir, "index.json"), "utf-8"));
  for (const idea of ideas) {
    ideasUrls.push(urlEl(`${BASE}/ideas/${idea.slug}/`, "weekly", "0.6"));
  }
} catch (_) {}
writeChunkedSitemap("sitemap-ideas", ideasUrls, sitemapRefs);
console.log(`   sitemap-ideas: ${ideasUrls.length} URLs`);

// ─── 6. STARTSWITH SITEMAP ───
const startswithAnimals = [
  "aardvark","albatross","alligator","alpaca","anaconda","angelfish","anglerfish","ant",
  "anteater","antelope","arctic-fox","armadillo","axolotl","baboon","badger","bald-eagle",
  "ball-python","bandicoot","barn-owl","bass","bat","bear","bearded-dragon","beaver",
  "bee","beetle","beluga","betta","betta-fish","bighorn-sheep","bilby","bird","bison",
  "blue-jay","blue-tongued-skink","blue-whale","bobcat","bongo","budgie","buffalo",
  "bumblebee","butterfly","camel","canary","capuchin-monkey","capybara","caracal",
  "cardinal","caribou","carp","cassowary","cat","caterpillar","catfish","centipede",
  "chameleon","cheetah","chicken","chimpanzee","chinchilla","chipmunk","cichlid",
  "clownfish","cobra","cockatiel","cockatoo","cockroach","condor","cormorant",
  "corn-snake","cougar","cow","coyote","crab","crane","crested-gecko","cricket",
  "crocodile","crow","cuckoo","deer","dingo","discus","dog","dolphin","donkey",
  "dragon","dragonfly","duck","dugong","eagle","earthworm","echidna","elephant",
  "elk","emu","ermine","falcon","fennec-fox","ferret","finch","fire-bellied-toad",
  "firefly","fish","fisher","flamingo","flying-fish","flying-squirrel","fossa","fox",
  "frog","gazelle","gecko","gerbil","giant-clam","gibbon","giraffe","goat","golden-retriever",
  "goldfish","goose","gorilla","grasshopper","greyhound","grizzly-bear","groundhog",
  "guinea-fowl","guinea-pig","guppy","hamster","hare","hawk","hedgehog","heron",
  "hippopotamus","hoatzin","honey-bee","hornbill","horse","hummingbird","husky",
  "hyena","ibex","iguana","impala","jackal","jaguar","jellyfish","kangaroo","kestrel",
  "kingfisher","kiwi","koala","koi","komodo-dragon","kookaburra","kudu","ladybug",
  "lemur","leopard","leopard-gecko","lion","lizard","llama","lobster","lovebird",
  "lynx","macaque","macaw","manatee","mandrill","manta-ray","margay","marlin",
  "marmoset","marmot","marten","meerkat","mermaid","milk-snake","millipede","mink",
  "mockingbird","molly","mongoose","monitor-lizard","monkey","moose","mosquito",
  "mountain-goat","mouse","musk-ox","narwhal","newt","nightingale","numbat","ocelot",
  "octopus","okapi","orangutan","orca","oryx","osprey","ostrich","otter","owl","ox",
  "pacman-frog","painted-turtle","panda","pangolin","parakeet","parrot","peacock",
  "pegasus","pelican","penguin","perch","phoenix","pig","pigeon","platypus",
  "poison-dart-frog","polar-bear","porcupine","prairie-dog","praying-mantis",
  "proboscis-monkey","pronghorn","pufferfish","puffin","puma","python","quail",
  "quokka","rabbit","raccoon","raccoon-dog","rat","rattlesnake","raven",
  "red-eared-slider","red-panda","reindeer","rhino","rhinoceros","robin","salamander",
  "salmon","scorpion","sea-lion","sea-turtle","seagull","seahorse","seal",
  "secretary-bird","serval","shark","sheep","shrimp","skink","skunk","sloth","snail",
  "snake","snow-leopard","snowy-owl","sparrow","sperm-whale","spider","spider-monkey",
  "springbok","squirrel","squirrel-monkey","starfish","stick-insect","stingray",
  "stoat","stork","swan","swordfish","tamarin","tapir","tarantula","tasmanian-devil",
  "termite","tetra","tiger","tiger-shark","toad","tortoise","toucan","tree-frog",
  "trout","tuna","turkey","turtle","unicorn","vulture","walrus","warthog","wasp",
  "waterbuck","weasel","werewolf","whale","wild-boar","wildebeest","wolf","wolverine",
  "wombat","woodpecker","yak","zebra"
];
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const startswithUrls = [];
for (const animal of startswithAnimals) {
  if (!animals.find(a => a.slug === animal)) continue;
  for (const letter of letters) {
    startswithUrls.push(urlEl(`${BASE}/startswith/${letter}/${animal}/`, "weekly", "0.6"));
  }
}
writeChunkedSitemap("sitemap-startswith", startswithUrls, sitemapRefs);
console.log(`   sitemap-startswith: ${startswithUrls.length} URLs`);

// ─── 7. LENGTH SITEMAP ───
const lengthAnimals = startswithAnimals;
const validLengths = [3, 4, 5, 6, 7, 8, 9, 10];
const lengthUrls = [];
for (const animal of lengthAnimals) {
  if (!animals.find(a => a.slug === animal)) continue;
  for (const len of validLengths) {
    lengthUrls.push(urlEl(`${BASE}/length/${len}/${animal}/`, "weekly", "0.6"));
  }
}
writeChunkedSitemap("sitemap-length", lengthUrls, sitemapRefs);
console.log(`   sitemap-length: ${lengthUrls.length} URLs`);

// ─── 8. WRITE SITEMAP INDEX ───
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRefs.map(ref => `  <sitemap>
    <loc>${esc(ref.loc)}</loc>
    <lastmod>${ref.lastmod}</lastmod>
  </sitemap>`).join("\n")}
</sitemapindex>`;

fs.writeFileSync(path.join(publicDir, "sitemap-index.xml"), sitemapIndex);

// Also write the legacy main sitemap.xml for backward compatibility (all URLs combined)
const allUrls = [...coreUrls, ...animalUrls, ...factsUrls, ...nameTypeUrls, ...ideasUrls, ...startswithUrls, ...lengthUrls];
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), wrapSitemap(allUrls));

const totalUrls = allUrls.length;
const sitemapCount = sitemapRefs.length;
console.log(`\n✅ Generated sitemap-index.xml referencing ${sitemapCount} sitemap files`);
console.log(`   Total URLs across all sitemaps: ${totalUrls}`);
console.log(`   Legacy sitemap.xml preserved with ${totalUrls} URLs`);
