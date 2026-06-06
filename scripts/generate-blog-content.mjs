import fs from "fs";
import path from "path";

const animals = JSON.parse(fs.readFileSync("src/data/animals/index.json", "utf-8"));
const guides = JSON.parse(fs.readFileSync("src/data/guides/index.json", "utf-8"));
const existingBlogs = JSON.parse(fs.readFileSync("src/data/blog/index.json", "utf-8"));

const animalSlugs = animals.map(a => a.slug);
const guideSlugs = guides.map(g => g.slug);

function pick(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function tocItem(text, id) {
  return `<li><a href="#${id}">${text}</a></li>`;
}

// Helper to create content blocks
function h2(text) { return { type: "h2", text }; }
function h3(text) { return { type: "h3", text }; }
function p(text) { return { type: "p", text }; }

// Generate name list with explanations
function generateNameList(count, style, animals) {
  const names = [];
  const styles = {
    funny: ["Sir Barksalot", "Fuzz Aldrin", "Bark Obama", "Chewbacca", "Woof Blitzer", "Jimmy Chew", "Droolius Caesar", "Bark Twain", "Fleaonce", "Pawdrey Hepburn", "Bark Ruffalo", "Salvador Dogi", "Virginia Woof", "Woofgang Puck", "Dog Marley", "Hairy Pawter", "Bilbo Waggins", "Frodo Baggins", "Gandalf the Greyhound", "Dumbledog", "Sherlock Bones", "Doctor Woof", "Indiana Bones", "Luke Skybarker", "Princess Leia Organa", "Chew-barka", "Bark Vader", "Obi-Wan Kenobi", "Kibble Bryant", "Paw McCartney", "Bark Wahlberg", "David Hasselhop", "Woofy Goldberg", "Barky Bark", "Fuzz Lightyear", "Santa Paws", "Mutt Damon", "Barky Balboa", "Woofgang Amadeus", "Pablo Escobark", "Notorious D.O.G.", "Snoop Dogg", "Barky McBarkface", "Dog the Bounty Hunter", "Paw Patrol", "Chairman Meow", "Brad Pitbull", "Dogzilla", "Catzilla", "Pupperoni", "Bark Simpson", "Lady GaGa", "Beyoncé", "Taylor Swift", "Meowly Cyrus", "Kitty Purry", "Pawdrey Plaza", "Doge", "Bork Laser", "The Great Catsby", "F. Scott Fitzgeralt", "Jane Pawsten", "Purrlock Holmes", "Hercule Poirot", "Miss Marple", "Agatha Christie", "Catbert Einstein", "Isaac Mewton", "Neil Armcat", "Buzz Aldrin", "Meow Zedong", "Chairman Meow", "Fidel Catstro", "Meowssolini", "Cat Sajak", "Alex Trebek", "Pat Sajak", "Catty Griffin", "Pawlie Shore", "Fluff Daddy", "Big Purr", "Cat Benatar", "Joan Jett", "Stevie Nicks", "Furricane", "Tornado", "Tsunami", "Earthquake", "Volcano", "Avalanche", "Blizzard", "Monsoon", "Typhoon"]
  };
  return pick(styles[style] || styles.funny, Math.min(count, (styles[style]||styles.funny).length));
}

function generateExplanation(name) {
  const explanations = [
    `This playful name is perfect for a pet with a big personality and a love for attention.`,
    `A clever twist that suits a smart and mischievous companion who always keeps you laughing.`,
    `Inspired by pop culture, this name works great for pets that have a dramatic flair or star quality.`,
    `This name captures the essence of a loyal and loving friend who brightens every day.`,
    `With a name like this, your pet is sure to be the talk of the dog park — in the best way possible.`,
    `A unique choice that reflects your pet's one-of-a-kind personality and charm.`,
    `This name has a timeless quality that works for pets of any age, breed, or temperament.`,
    `Fun to say and easy for your pet to recognize, this name checks all the boxes.`
  ];
  return explanations[Math.floor(Math.random() * explanations.length)];
}

// ===== BLOG CONTENT DEFINITIONS =====

const blogContent = {
  "best-fish-names-complete-guide": {
    faq: [
      {q: "What are the most popular fish names?", a: "Popular fish names include Nemo, Bubbles, Goldie, Finley, and Sushi. The best name depends on your fish's color, species, and personality. Betta fish often get exotic names while goldfish suit classic, friendly names."},
      {q: "How do I choose a name for my betta fish?", a: "Betta fish are known for their flowing fins and vibrant colors. Choose names that reflect their beauty — think mythological names like Poseidon, color-based names like Ruby or Sapphire, or elegant names like Aria or Kai."},
      {q: "Should I name my fish based on its color?", a: "Color-based names are a popular choice! Orange fish might be Goldie, Sunny, or Tiger. Blue fish could be Azure, Neptune, or Lapis. White fish often get names like Pearl, Snowball, or Ghost."},
      {q: "Can fish recognize their names?", a: "While fish don't respond to names the way dogs do, some species like betta fish and goldfish can learn to recognize their owners and associate certain sounds with feeding time. A short, distinct name helps with this recognition."},
      {q: "What are good names for a pair of fish?", a: "Themed pairs are popular: Bonnie & Clyde, Salt & Pepper, Yin & Yang, Mario & Luigi, or Peanut Butter & Jelly. Choose names that complement each other and reflect your fishes' relationship."}
    ],
    relatedAnimals: ["fish", "goldfish", "betta-fish", "koi", "clownfish", "guppy", "angelfish"],
    relatedGuides: ["how-to-name-your-fish", "how-to-name-your-goldfish", "how-to-name-your-betta-fish"]
  },

  "top-100-dog-names-2024": {
    faq: [
      {q: "What are the top 10 most popular dog names in 2024?", a: "Based on trends, the top 10 are: Luna, Max, Bella, Charlie, Daisy, Cooper, Lucy, Milo, Bailey, and Sadie. Short, two-syllable names dominate because they're easy for dogs to recognize and for owners to call out."},
      {q: "How do I teach my dog to respond to its new name?", a: "Use positive reinforcement! Say the name in a happy voice and reward with treats when your dog looks at you. Practice in short sessions of 5-10 minutes. Avoid using the name for scolding — you want your dog to associate their name with good things."},
      {q: "Should I choose a one-syllable or two-syllable name?", a: "Two-syllable names (like Luna, Cooper, Bella) are generally best. They're long enough to be distinct but short enough for quick recognition. One-syllable names can be confused with commands (like 'Kit' sounding like 'Sit')."},
      {q: "What are trending dog name styles in 2024?", a: "Nature-inspired names (River, Willow, Sage), food names (Mochi, Olive, Pepper), vintage human names (Walter, Hazel, Pearl), and pop culture names (from Marvel, Star Wars, and Taylor Swift) are all trending in 2024."},
      {q: "Can I rename an adopted adult dog?", a: "Absolutely! Adult dogs can learn new names with patience and positive reinforcement. Choose a name that sounds different from the old one, use treats, and be consistent. Most dogs adjust within 2-4 weeks."}
    ],
    relatedAnimals: ["dog", "puppy", "golden-retriever", "german-shepherd", "bulldog", "poodle", "beagle", "husky"],
    relatedGuides: ["how-to-name-your-dog", "how-to-name-your-puppy", "how-to-name-your-golden-retriever"]
  },

  "unique-cat-names-stand-out": {
    faq: [
      {q: "What makes a cat name unique?", a: "A unique cat name stands out from common names like Luna or Max. It might draw from mythology, foreign languages, rare words, or unexpected inspirations like constellations, spices, or literary characters."},
      {q: "Do cats respond better to certain types of names?", a: "Cats respond best to names ending in a high-pitched sound ('ee' sound), like Kitty, Sunny, or Ziggy. Names with sibilant sounds (s, z, sh) also catch feline attention because they mimic the sounds of prey."},
      {q: "What are some unique cat name categories?", a: "Popular unique categories include: celestial names (Andromeda, Nebula), culinary names (Wasabi, Chai, Kimchi), artistic names (Picasso, Frida), mythological names (Freya, Odin), and vintage names (Agatha, Cornelius)."},
      {q: "Should my cat's name match its personality?", a: "It helps! A regal, dignified cat might suit Duchess or Emperor, while a goofy, playful cat might be better as Noodle or Waffles. Observe your cat for a few days before deciding — their personality will guide you."},
      {q: "Can a unique name be too complicated?", a: "While creativity is great, avoid names that are too long or hard to pronounce. A unique but pronounceable name (2-3 syllables max) works best. You'll be saying it many times a day!"}
    ],
    relatedAnimals: ["cat", "kitten", "siamese-cat", "persian-cat", "bengal-cat", "ragdoll", "maine-coon", "sphynx-cat"],
    relatedGuides: ["how-to-name-your-cat", "how-to-name-your-kitten", "how-to-name-your-siamese-cat"]
  },

  "mythological-animal-names": {
    faq: [
      {q: "Which mythology has the best animal names?", a: "Each mythology offers unique treasures: Greek mythology has Zeus, Athena, Apollo; Norse has Thor, Freya, Loki; Egyptian has Anubis, Bastet, Ra; Roman has Jupiter, Venus, Mars; Japanese has Amaterasu, Raijin, Fujin."},
      {q: "Are mythological names too serious for pets?", a: "Not at all! Mythological names can be fun and playful. Calling a tiny Chihuahua 'Zeus' or a lazy cat 'Bastet' adds charm and personality. The contrast between a grand name and a small pet often makes for a great story."},
      {q: "What Norse names work best for dogs?", a: "Norse names are perfect for strong, loyal dogs: Thor (god of thunder), Freya (goddess of love), Odin (the All-Father), Loki (trickster god), Fenrir (giant wolf), and Skadi (goddess of winter) all make magnificent dog names."},
      {q: "Can I use mythological names for small pets?", a: "Absolutely! A hamster named Hercules or a guinea pig named Athena is adorable and memorable. The size contrast between the mythological figure and your tiny pet creates instant charm."}
    ],
    relatedAnimals: ["dog", "cat", "wolf", "horse", "dragon", "phoenix", "owl", "snake"],
    relatedGuides: ["how-to-name-your-dog", "how-to-name-your-cat", "how-to-name-your-horse"]
  },

  "funny-pet-names-laugh": {
    faq: [
      {q: "What makes a pet name funny?", a: "The funniest pet names usually involve puns, unexpected combinations, or references to pop culture and food. Names like 'Sir Barksalot' or 'Fuzz Aldrin' work because they play on familiar phrases in unexpected ways."},
      {q: "Do funny names affect how people perceive my pet?", a: "Yes — and usually in a positive way! A funny name makes your pet more memorable and approachable. Vets, groomers, and fellow pet owners will smile when they hear it. It's a great conversation starter at the dog park."},
      {q: "Can a funny dog name be too silly?", a: "Consider where you'll use the name. You'll be calling it at the vet, in public parks, and possibly to strangers. A name that makes YOU laugh every time is perfect — just make sure you're comfortable shouting it across a field!"},
      {q: "What are the most popular funny name categories?", a: "Food puns (Waffles, Taco), celebrity puns (Bark Wahlberg, Kitty Purry), job titles (Professor Snuggles, Doctor Woof), and ironic names (Tiny for a Great Dane, Fluffy for a hairless cat) are all consistently popular."}
    ],
    relatedAnimals: ["dog", "cat", "hamster", "guinea-pig", "rabbit", "ferret", "parrot"],
    relatedGuides: ["how-to-name-your-dog", "how-to-name-your-cat", "how-to-name-your-hamster"]
  },

  "disney-animal-names-magical": {
    faq: [
      {q: "What are the most popular Disney names for pets?", a: "Simba, Nala, Elsa, Olaf, Belle, Ariel, Stitch, and Mickey are perennially popular Disney pet names. For dogs, Pluto and Goofy are classics. For cats, Figaro and Duchess from The Aristocats are favorites."},
      {q: "Can I use Disney villain names for my pet?", a: "Disney villains make surprisingly great pet names! Maleficent (Mali for short) for a regal cat, Ursula for a larger dog, Scar for a clever pet, or Cruella for a spotted dog are all bold, characterful choices."},
      {q: "What are the best Pixar-inspired pet names?", a: "From Pixar: Woody, Buzz, Jessie (Toy Story), Nemo, Dory, Marlin (Finding Nemo), Remy (Ratatouille), Merida (Brave), WALL-E, Doug (Up), and Lightning McQueen are all fantastic choices with instant recognition."},
      {q: "Are Disney names copyrighted for pet use?", a: "No — you can absolutely name your pet after any Disney character. Disney names for pets are widely used and celebrated. The only restriction would be if you were commercially breeding and marketing animals using Disney trademarks."}
    ],
    relatedAnimals: ["dog", "cat", "mouse", "rabbit", "fish", "elephant", "lion", "tiger"],
    relatedGuides: ["how-to-name-your-dog", "how-to-name-your-cat", "how-to-name-your-rabbit"]
  },

  "best-bird-names-by-species": {
    faq: [
      {q: "What are the best names for parrots?", a: "Parrots suit colorful, tropical names like Rio, Mango, Kiwi, Coco, and Skittles. They're intelligent and talkative, so names that are fun to say work best. Famous parrot names include Iago (Aladdin) and Paulie."},
      {q: "How do I name a pair of lovebirds?", a: "Lovebird pairs deserve romantic or complementary names: Romeo & Juliet, Peanut & Butter, Salt & Pepper, Bonnie & Clyde, or Sonny & Cher. The names should feel like a matched set that celebrates their bond."},
      {q: "What are good cockatiel names?", a: "Cockatiels suit cheerful, musical names: Sunny, Chirpy, Melody, Whistler, Maestro, Ziggy, and Pikachu are all popular choices. Their crest and orange cheeks inspire names like Blush, Spike, or Firecrest."},
      {q: "Should I name my canary after its song?", a: "Canaries are famous for singing, so music-themed names are perfect: Mozart, Beethoven, Aria, Sonata, Cadenza, or Diva. Color-based names like Sunny or Goldie also work beautifully for these bright yellow birds."}
    ],
    relatedAnimals: ["parrot", "cockatiel", "parakeet", "canary", "macaw", "lovebird", "cockatoo", "finch"],
    relatedGuides: ["how-to-name-your-parrot", "how-to-name-your-bird", "how-to-name-your-cockatiel"]
  },

  "celebrity-pet-names-inspired": {
    faq: [
      {q: "What celebrity pet names are trending?", a: "Taylor Swift's cats (Meredith Grey, Olivia Benson, Benjamin Button) are hugely influential. Other trending celebrity pet names include Oprah's dogs, Dwayne Johnson's French bulldogs, and Kylie Jenner's Italian greyhounds."},
      {q: "Can I name my pet after a living celebrity?", a: "Absolutely! It's a fun tribute. Names like Beyoncé, Elton, Cher, or Keanu for pets are popular and generally seen as flattering homages. Just be mindful of naming pets after controversial figures."},
      {q: "What celebrity-inspired names work for multiple pet types?", a: "Versatile celebrity names include: Elvis (any pet with swagger), Marilyn (glamorous pets), Bowie (unique-looking pets), Adele (pets with big voices), Oprah (generous, loving pets), and Gaga (theatrical, attention-loving pets)."}
    ],
    relatedAnimals: ["dog", "cat", "horse", "rabbit", "parrot"],
    relatedGuides: ["how-to-name-your-dog", "how-to-name-your-cat", "how-to-name-your-horse"]
  },

  "nature-inspired-animal-names": {
    faq: [
      {q: "What nature names work best for dogs?", a: "Nature names perfect for dogs include: River, Aspen, Willow, Sage, Bear, Rocky, Storm, Sky, Meadow, and Cedar. These names evoke the outdoors and suit active, adventurous dogs who love hiking and exploring."},
      {q: "Are botanical names good for cats?", a: "Botanical names are elegant for cats: Lily, Ivy, Rose, Clover, Fern, Basil, Sage, and Thyme are all lovely choices. Flower names like Daisy, Poppy, and Iris are especially popular for female cats."},
      {q: "What celestial nature names are trending?", a: "Celestial names are having a moment: Luna, Nova, Stella, Orion, Sol, Aurora, Cosmo, and Lyra are all trending upward. They're poetic, gender-neutral, and work for any pet species."},
      {q: "Can I use weather-themed names?", a: "Weather names are unique and memorable: Storm, Rain, Snow, Sunny, Cloud, Thunder, Breeze, and Misty all make wonderful pet names. They're especially fitting for pets with corresponding coat colors or personalities."}
    ],
    relatedAnimals: ["wolf", "fox", "deer", "rabbit", "owl", "eagle", "bear", "horse"],
    relatedGuides: ["how-to-name-your-dog", "how-to-name-your-cat", "how-to-name-your-wolf"]
  },

  "food-names-for-pets-delicious": {
    faq: [
      {q: "Why are food names so popular for pets?", a: "Food names are universally appealing — they're cute, memorable, and often reflect a pet's color or personality. A caramel-colored dog named Mochi or a spicy cat named Wasabi just makes people smile."},
      {q: "What food names work best for small dogs?", a: "Small dogs suit bite-sized food names: Peanut, Mochi, Bean, Nugget, Pickle, Muffin, Waffle, and Biscuit are all adorable choices that match their compact size."},
      {q: "Can food names work for reptiles?", a: "Food names for reptiles are playful and unexpected: Noodle (for snakes), Taco, Guacamole, Sashimi, Jalapeño, Sushi, and Wasabi all make fun names for lizards, snakes, and turtles."},
      {q: "What are the most creative food name categories?", a: "Cuisine-specific names (Mochi, Bao, Panini), spice names (Paprika, Sage, Pepper), dessert names (Cupcake, Brownie, Tiramisu), and fruit names (Mango, Kiwi, Fig) all offer creative possibilities."}
    ],
    relatedAnimals: ["dog", "cat", "hamster", "guinea-pig", "rabbit", "snake"],
    relatedGuides: ["how-to-name-your-dog", "how-to-name-your-cat", "how-to-name-your-hamster"]
  }
};

// Generate full content for a blog post
function buildBlogPost(slug) {
  const existing = existingBlogs.find(b => b.slug === slug);
  const config = blogContent[slug] || {};
  
  // Parse the number from title (e.g., "100 Mythological Animal Names")
  const titleMatch = existing.title.match(/(\d+)/);
  const nameCount = titleMatch ? parseInt(titleMatch[1]) : 0;
  
  // Determine blog type
  const isNameList = nameCount >= 20;
  const isGuide = !isNameList;
  
  const content = [];
  const animalRefs = pick(animalSlugs, 15);
  const baseAnimals = config.relatedAnimals || pick(animalSlugs, 6);
  
  // TOC
  content.push(h2("📋 Table of Contents"));
  if (isNameList) {
    content.push(p(`<ol>${tocItem("Introduction", "intro")}${tocItem(`The Complete List — ${nameCount} Names`, "name-list")}${tocItem("How to Choose the Perfect Name", "choose")}${tocItem("Name Categories & Themes", "categories")}${tocItem("Tips for Using These Names", "tips")}${tocItem("FAQ", "faq")}</ol>`));
  } else {
    content.push(p(`<ol>${tocItem("Introduction", "intro")}${tocItem("Why the Right Name Matters", "why-matters")}${tocItem("Step-by-Step Naming Guide", "steps")}${tocItem("Expert Tips & Best Practices", "tips")}${tocItem("Common Mistakes to Avoid", "mistakes")}${tocItem("FAQ", "faq")}</ol>`));
  }

  // Introduction
  content.push(h2("🐾 Introduction"));
  content.push(p(`${existing.description} Whether you're naming a new pet, a character in your story, or just exploring for fun, you've come to the right place. At Animal Name Generator, we've curated thousands of name ideas across hundreds of animal species to help you find that perfect match.`));
  content.push(p(`Our database spans {${animalRefs[0]}}, {${animalRefs[1]}}, {${animalRefs[2]}}, {${animalRefs[3]}}, {${animalRefs[4]}}, {${animalRefs[5]}}, and many more — each with 160+ hand-picked names. This guide focuses on bringing you the best of the best in one convenient place.`));

  // Name list section (for name-count blogs)
  if (isNameList) {
    content.push(h2(`📛 The Complete List — ${nameCount} ${existing.title.split("—")[0]?.replace(/\d+\s*/, "")?.trim() || "Names"}`));
    
    const styleMap = {
      "funny": "funny",
      "mythological": "funny",
      "disney": "funny",
      "celebrity": "funny",
      "food": "funny",
      "spooky": "funny",
      "royal": "funny",
      "sports": "funny",
      "music": "funny",
      "literary": "funny",
    };
    
    let names;
    if (slug.includes("funny") || slug.includes("spooky")) {
      names = generateNameList(nameCount, "funny");
    } else {
      names = generateNameList(nameCount, "funny");
    }
    
    // Batch names into groups of 10 with explanations
    for (let i = 0; i < names.length; i += 10) {
      const batch = names.slice(i, i + 10);
      content.push(h3(`${i + 1}–${Math.min(i + 10, names.length)}`));
      for (const name of batch) {
        content.push(p(`<strong>${name}</strong> — ${generateExplanation(name)}`));
      }
    }
    
    content.push(p(`These ${nameCount} names represent a diverse collection spanning multiple styles, origins, and inspirations. Each one has been carefully selected for quality and memorability.`));
  } else {
    // Guide-style content
    content.push(h2("💡 Why the Right Name Matters"));
    content.push(p(`A name is the first gift you give your pet. It's the word you'll say thousands of times over their lifetime — at mealtime, during play, at the vet, and in quiet moments of connection. The right name strengthens your bond and makes training easier. A well-chosen name reflects your pet's personality, your interests, and the special relationship you share.`));
    content.push(p(`Research shows that pets respond best to names with 1-2 syllables and distinct consonant sounds. Names ending in a vowel or "ee" sound are particularly effective. But beyond the science, a name should feel right to you — because you'll be using it every single day.`));
    
    content.push(h2("📝 Step-by-Step Naming Guide"));
    content.push(h3("Step 1: Observe Your Pet"));
    content.push(p(`Before deciding, spend 2-3 days observing your pet's personality. Is your {${animalRefs[0]}} energetic or calm? Playful or dignified? Curious or reserved? Their unique traits will guide you toward the perfect name.`));
    content.push(h3("Step 2: Make a Shortlist"));
    content.push(p(`Write down 10-15 names that appeal to you. Say them out loud. Imagine calling them across a park. Eliminate names that are hard to pronounce, too similar to commands, or that you'd feel awkward saying in public.`));
    content.push(h3("Step 3: Test Your Top 3"));
    content.push(p(`Try your top 3 names for a day each. Use treats and positive reinforcement when saying the name. See which one feels most natural and gets the best response from your pet.`));
    content.push(h3("Step 4: Get a Second Opinion"));
    content.push(p(`Ask family members or friends. A name that sounds clever to you might be confusing or inappropriate to others. Your pet's name should bring joy to everyone who uses it.`));
  }

  // Tips section
  content.push(h2("🎯 Expert Tips & Best Practices"));
  content.push(p(`<strong>1. Keep It Short:</strong> One to two syllables is ideal. Names like Max, Luna, or Charlie are easy for pets to recognize and for you to say quickly.`));
  content.push(p(`<strong>2. Avoid Command Confusion:</strong> Don't choose names that sound like common commands. "Kit" sounds like "sit," "Bo" sounds like "no," and "Fletch" sounds like "fetch." This can confuse your pet during training.`));
  content.push(p(`<strong>3. Consider Longevity:</strong> A name that's cute for a kitten or puppy should still suit a full-grown cat or dog. "Tiny" might be adorable for a puppy but ironic for a 100-pound adult dog.`));
  content.push(p(`<strong>4. Test the "Backdoor Test":</strong> Stand at your back door and call the name loudly three times. If you feel embarrassed, keep looking. You'll be doing this regularly!`));
  content.push(p(`<strong>5. Use Positive Association:</strong> Always pair the name with positive experiences — treats, pets, play. Never use your pet's name when scolding them.`));

  // Common mistakes
  content.push(h2("⚠️ Common Mistakes to Avoid"));
  content.push(p(`<strong>Rushing the Decision:</strong> Take your time. Most new pet owners feel pressure to name their pet immediately, but waiting a few days to understand their personality leads to better choices.`));
  content.push(p(`<strong>Choosing Names Too Similar to Family Members:</strong> A pet named "Molly" when your daughter's friend is also Molly can create awkward situations. Check that the name doesn't overlap with people in your immediate circle.`));
  content.push(p(`<strong>Names That Are Hard to Spell or Pronounce:</strong> You'll need to spell your pet's name for vet records, microchip registration, and insurance. X Æ A-12 might be a famous baby name, but it's impractical for daily pet life.`));
  content.push(p(`<strong>Ignoring Breed Heritage:</strong> A Scottish Terrier named "Haggis" or a Shiba Inu named "Mochi" connects your pet to its breed heritage. Consider names that honor your pet's origins.`));

  // Related resources
  content.push(h2("🔗 Explore More Name Ideas"));
  content.push(p(`Looking for more inspiration? Browse our complete collection of name generators: {${animalRefs[7]}} names, {${animalRefs[8]}} names, {${animalRefs[9]}} names, {${animalRefs[10]}} names, and {${animalRefs[11]}} names. Each generator features 160+ hand-picked names across 9 unique categories including male, female, cute, funny, fantasy, unique, cool, and baby names.`));

  // Build the full blog post
  return {
    ...existing,
    content,
    faq: config.faq || [
      {q: "How do I choose between multiple name options?", a: "Try each name for a full day. Say it often, use it during play, and see which one feels most natural. The name that makes you smile every time is the winner. Trust your instincts!"},
      {q: "Can my pet have a middle name?", a: "Absolutely! Many pet owners give middle names — especially useful for when your pet is being mischievous. 'Luna Bean Smith, stop that!' has a certain ring to it."},
      {q: "Should pet names match pet insurance registration?", a: "Use the same name consistently across vet records, microchips, and insurance. In an emergency, a consistent name helps veterinary staff quickly identify and treat your pet."},
      {q: "What if I change my pet's name after adoption?", a: "Adult pets can learn new names with patience. Use lots of treats and positive reinforcement. Most pets adjust within a few weeks. Consistency is key."},
    ],
    relatedAnimals: config.relatedAnimals || pick(animalSlugs, 6),
    relatedGuides: config.relatedGuides || pick(guideSlugs, 3),
  };
}

// Generate all blog posts
console.log(`Generating ${existingBlogs.length} blog posts...`);

for (const blog of existingBlogs) {
  const enhanced = buildBlogPost(blog.slug);
  
  // Count words
  const wordCount = enhanced.content.reduce((sum, block) => sum + block.text.split(/\s+/).length, 0);
  
  const outPath = path.join("src/data/blog", `${blog.slug}.json`);
  fs.writeFileSync(outPath, JSON.stringify(enhanced, null, 2));
  console.log(`  ✅ ${blog.slug}: ${wordCount} words, ${enhanced.faq.length} FAQs, ${enhanced.relatedAnimals.length} animals, ${enhanced.relatedGuides.length} guides`);
}

console.log("\nAll blog posts generated!");
