#!/usr/bin/env node
/**
 * Daily Blog Content Generator
 * 
 * Generates 5 new SEO blog posts (1400-1800 words each) with unique topics.
 * Updates blog index and sitemap.
 * 
 * Usage: node scripts/generate-daily-blogs.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

// === DATA LOADING ===

function loadJSON(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), "utf-8"));
}

function saveJSON(relPath, data) {
  const fp = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, JSON.stringify(data, null, 2));
}

const animals = loadJSON("src/data/animals/index.json");
const animalSlugs = animals.map(a => a.slug);
const animalNames = animals.map(a => a.name);
const guides = loadJSON("src/data/guides/index.json");
const guideSlugs = guides.map(g => g.slug);
const guideTitles = guides.map(g => g.title);
const existingBlogs = loadJSON("src/data/blog/index.json");
const existingSlugs = new Set(existingBlogs.map(b => b.slug));

// === HELPERS ===

function pick(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function sluggify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function wordCount(blocks) {
  return blocks.reduce((sum, b) => sum + (b.text || "").split(/\s+/).length, 0);
}

// Content block helpers
function h2(text) { return { type: "h2", text }; }
function h3(text) { return { type: "h3", text }; }
function p(text) { return { type: "p", text }; }

// === BLOG TOPIC GENERATION ===

const topicAdjectives = [
  "Best", "Top", "Popular", "Trending", "Creative", "Adorable", "Funny",
  "Unique", "Cool", "Beautiful", "Cute", "Classic", "Modern", "Exotic",
  "Charming", "Majestic", "Brave", "Sweet", "Playful", "Lovable",
  "Famous", "Wild", "Clever", "Quirky", "Royal", "Fluffy", "Gentle",
  "Happy", "Spunky", "Daring", "Mighty", "Elegant", "Loyal", "Cheerful",
];

const topicThemes = [
  "Inspired by Nature", "Inspired by Movies & TV", "Inspired by Food",
  "Inspired by Mythology", "Color-Inspired", "Inspired by Music",
  "Seasonal Favorites", "Inspired by History", "Inspired by Geography",
  "Inspired by Literature", "Inspired by Sports", "Inspired by Celebrities",
  "From Around the World", "Inspired by Art", "Inspired by Science",
  "Breed-Specific", "Size-Specific", "Personality-Based",
  "Inspired by Fantasy", "For Every Coat Color",
];

const blogFormats = [
  // Format 0: "Best {Animal} Names {Theme}: {Number}+ {Adjective} Ideas"
  (adj, theme, animal, num) => ({
    title: `${adj} ${animal} Names ${theme}: ${num}+ ${adj} Ideas for Your ${animal}`,
    description: `Looking for ${adj.toLowerCase()} ${animal.toLowerCase()} names? Discover ${num}+ ${adj.toLowerCase()} ideas ${theme.toLowerCase()} for your beloved ${animal.toLowerCase()} companion.`,
  }),
  // Format 1: "The Ultimate Guide to {Adjective} {Animal} Names"
  (adj, theme, animal, num) => ({
    title: `The Ultimate Guide to ${adj} ${animal} Names: ${num}+ Ideas for Every ${animal} Owner`,
    description: `From ${theme.toLowerCase()} inspirations to classic favorites, discover ${num}+ ${adj.toLowerCase()} ${animal.toLowerCase()} names that capture your ${animal.toLowerCase()}'s unique personality.`,
  }),
  // Format 2: "{Number}+ {Adjective} {Animal} Names That Will Make You Smile"
  (adj, theme, animal, num) => ({
    title: `${num}+ ${adj} ${animal} Names That Will Make You Smile: ${theme} Edition`,
    description: `Discover ${num}+ ${adj.toLowerCase()} ${animal.toLowerCase()} names ${theme.toLowerCase()} that are guaranteed to bring joy. Perfect for ${animal.toLowerCase()} owners seeking something special.`,
  }),
];

function generateTopic() {
  let slug, title, description, tags, category;

  for (let attempt = 0; attempt < 200; attempt++) {
    const animal = randItem(animalNames);
    const adj = randItem(topicAdjectives);
    const theme = randItem(topicThemes);
    const num = randItem([50, 60, 70, 80, 90, 100, 120, 150, 175, 200]);
    const format = randItem(blogFormats);
    const result = format(adj, theme, animal, num);

    slug = sluggify(result.title);
    // Ensure uniqueness
    if (existingSlugs.has(slug)) continue;
    if (slug.length < 10 || slug.length > 120) continue;

    title = result.title;
    description = result.description;
    category = `${animal} Names`;

    const animalSl = sluggify(animal);
    tags = [
      `${animal.toLowerCase()} names`,
      `${adj.toLowerCase()} ${animal.toLowerCase()} names`,
      ...shuffle([
        "pet names",
        "animal names",
        "best pet names",
        `${animal.toLowerCase()} name ideas`,
        `${adj.toLowerCase()} pet names`,
        "naming guide",
        "unique pet names",
      ]).slice(0, 4),
    ];
    existingSlugs.add(slug);
    break;
  }

  if (!slug) {
    // Fallback
    const fallback = `new-${randomString()}-pet-names-${todayStr()}`;
    slug = sluggify(fallback);
    title = `Creative Pet Names: Fresh Ideas for ${todayStr()}`;
    description = `Discover new pet name ideas updated for ${todayStr()}. Browse unique and creative names for every type of animal companion.`;
    category = "Pet Names";
    tags = ["pet names", "animal names", "creative pet names", "naming ideas"];
  }

  return { slug, title, description, category, tags };
}

function randomString() {
  return Math.random().toString(36).substring(2, 8);
}

// === CONTENT GENERATION ===

const introParagraphs = [
  "Naming a pet is one of the most exciting and meaningful moments of pet ownership. The right name captures your companion's essence, reflects their personality, and creates a bond that lasts a lifetime. Whether you've just brought home a new friend or are considering a name change for your beloved pet, choosing the perfect name deserves thoughtful consideration and a bit of creative inspiration.",
  
  "Every pet deserves a name that's as special as they are. A great name does more than identify your companion — it tells a story, sparks conversations, and becomes an integral part of your shared journey. Finding that perfect name, however, can feel overwhelming with so many wonderful options available. This guide is designed to help you navigate the wonderful world of pet naming with confidence and joy.",
  
  "The search for the perfect pet name is a journey filled with excitement, creativity, and sometimes a bit of decision paralysis. After all, this is a name you'll say thousands of times — during morning greetings, afternoon walks, evening cuddles, and everything in between. Getting it right matters. This comprehensive guide brings together our best ideas, expert tips, and practical advice to help you land on a name you'll love for years to come.",
  
  "What's in a name? When it comes to pets — everything. A well-chosen name reflects your companion's unique personality, strengthens your bond, and becomes a cherished part of your family story. Whether you prefer classic names that stand the test of time or creative names that turn heads at the dog park, the perfect name is out there waiting to be discovered.",
];

const namingPhilosophyParagraphs = [
  "Naming a pet isn't just about picking something that sounds nice — it's about finding a name that fits your companion's unique personality, your lifestyle, and the special bond you share. Research in human-animal relationships suggests that the names we choose for our pets often reveal as much about us as they do about our animal companions. A name like 'Shadow' might suggest a loyal, ever-present friend, while 'Luna' evokes mystery and nighttime adventures.",
  
  "The best pet names share common characteristics: they're easy to pronounce, contain clear consonant sounds that pets can distinguish, and carry positive associations for everyone who uses them. Short names — one or two syllables — tend to work best because they're quick to say and easy for pets to recognize. But that doesn't mean longer names can't work; many pets respond beautifully to names like 'Penelope' or 'Alexander,' especially when paired with a shorter nickname.",
  
  "One fascinating aspect of pet naming is how trends evolve over time. A decade ago, 'Bella' and 'Max' dominated the charts. Today, we're seeing a surge in food-inspired names like 'Mochi' and 'Waffles,' nature names like 'River' and 'Willow,' and pop culture references from shows and movies. Understanding these trends can help you decide whether you want to ride the wave or go against the current with something truly unique.",
];

const tipSets = [
  [
    { title: "Say It Out Loud — Repeatedly", body: "Before committing to a name, say it out loud at least 20 times in different tones — happy, stern, questioning, excited. If it starts to feel awkward or you trip over the syllables, keep looking. You'll be saying this name daily for years." },
    { title: "Test the 'Dog Park' Scenario", body: "Picture yourself calling this name across a busy park. Is it comfortable? Distinctive enough that your pet will know it's for them? Names that are too common might cause confusion, while names that are too unusual might draw unwanted attention." },
    { title: "Consider Your Pet's Physical Traits", body: "Your companion's appearance can provide wonderful naming inspiration. A black dog might suit 'Shadow' or 'Midnight.' A fluffy cat could be 'Cloud' or 'Marshmallow.' Let their unique coloring, size, or markings guide you toward something meaningful." },
    { title: "Think About Longevity", body: "A name that's adorable for a puppy or kitten should still suit a full-grown adult. 'Tiny' might work for a Chihuahua but could feel ironic for the Great Dane it grows into. Choose names with staying power." },
    { title: "Avoid Command Confusion", body: "Names that sound like common commands can confuse your pet during training. 'Kit' sounds like 'sit,' 'Bo' like 'no,' and 'Fletch' like 'fetch.' Test your name against your training command list before finalizing." },
  ],
  [
    { title: "Start With Their Personality", body: "Spend your first few days together observing your new companion. Are they brave and adventurous? Timid and gentle? Playful and mischievous? Let their unique personality guide your naming journey rather than rushing into a decision." },
    { title: "Make It Easy to Say", body: "The best pet names roll off the tongue naturally. One to three syllables is ideal — names like Luna, Charlie, or Oliver hit the sweet spot. If you find yourself shortening a longer name automatically, that's a sign to go with the shortened version." },
    { title: "Consider Your Household", body: "If multiple family members will use this name, make sure everyone can pronounce it comfortably. Names that one person struggles with can lead to inconsistent usage, which may confuse your pet." },
    { title: "Check for Unfortunate Rhymes", body: "Say the name alongside words you'll use often. Does it rhyme with anything embarrassing? Will the neighbors raise eyebrows when you call your pet's name? A quick mental check saves awkward moments later." },
    { title: "Trust Your Instincts", body: "After all the research and deliberation, the name that makes you smile every time you say it is probably the right one. Your emotional connection to the name matters more than any trend or convention." },
  ],
  [
    { title: "Involve the Whole Family", body: "If you share your home with family or roommates, make naming a collaborative process. Everyone who will interact with your pet should have a voice. Create a shortlist together and vote on favorites for a democratic approach." },
    { title: "Look to Your Interests", body: "Your hobbies and passions are a goldmine for pet names. Music lovers might name a pet 'Jazz' or 'Lyric.' Bookworms could borrow from beloved characters. Foodies might go with 'Basil' or 'Miso.' Personal meaning makes a name special." },
    { title: "Test Drive Your Top Three", body: "Use your top three name choices for a day each. Notice which one feels most natural, which one gets the best response from your pet, and which one makes you smile the most. This practical test often reveals the clear winner." },
    { title: "Keep the Vet Office in Mind", body: "You'll need to give your pet's name at the vet, on insurance forms, and in various official contexts. A name that's easy to spell and pronounce makes these interactions smoother for everyone involved." },
    { title: "Embrace the Unexpected", body: "Sometimes the best names come from unplanned moments — a funny incident during your first week together, a unique marking you hadn't noticed, or a behavior that defines their personality. Stay open to organic inspiration." },
  ],
];

const mistakeContent = [
  "Rushing the decision is the most common naming mistake. The excitement of bringing home a new companion can create pressure to name them immediately, but the best names often emerge after a few days of observation. Give yourself permission to wait until inspiration strikes naturally.",
  "Choosing names that are too similar to family members or close friends can create awkward situations. A dog named 'Emily' when your niece is also Emily means constant clarification. Similarly, names that sound like common household words can confuse everyone — including your pet.",
  "Trend-chasing without considering longevity is another common pitfall. Naming your pet after the current viral sensation or a character from a show currently airing might feel clever, but will you still love that reference in five years? Timeless names have staying power.",
  "Overcomplicating pronunciation or spelling creates daily friction. You'll need to spell your pet's name for vet records, microchip registration, insurance, and doggy daycare. Names with unconventional spellings or difficult pronunciations add unnecessary complexity to these routine interactions.",
];

const faqSets = [
  [
    { q: "How long should I wait before naming my new pet?", a: "Most experts recommend waiting 2-5 days after bringing your pet home. This observation period lets you understand their personality, habits, and quirks before committing to a name. The name that feels right after a few days of bonding is usually the best choice." },
    { q: "Can I rename an adopted or rescue pet?", a: "Absolutely! Adult pets can learn new names with patience and positive reinforcement. Use lots of treats, enthusiastic praise, and consistent repetition. Most pets adjust to a new name within 2-4 weeks. The key is always associating the new name with positive experiences." },
    { q: "Should my pet's name match their breed heritage?", a: "It's a personal choice with no right or wrong answer. Breed-heritage names (like 'Angus' for a Scottish Terrier or 'Sakura' for a Shiba Inu) add cultural meaning, but countless pets thrive with names that have no connection to their breed origins. Choose what resonates with you." },
    { q: "What if my family can't agree on a name?", a: "Create a democratic process: each person nominates their top three names, create a combined shortlist, and vote. You can also try a tournament bracket where names compete head-to-head until a champion emerges. The key is giving everyone a voice while keeping the process fun." },
    { q: "Are two-word names practical?", a: "Two-word names like 'Luna Mae' or 'Buddy Boo' can work beautifully, especially if you primarily use the first word for everyday calling and save the full name for formal moments. Consider whether both parts together roll off the tongue easily when called at a distance." },
  ],
  [
    { q: "How do I know if a name really fits my pet?", a: "The 'smile test' is remarkably reliable: if you smile every time you say your pet's name, it fits. Also pay attention to whether the name naturally matches how you describe your pet to others. When the name feels like it belongs to them, you've found the right one." },
    { q: "Can pets have middle names?", a: "Yes! Many pet owners give middle names, often used for playful formality ('Sir Barksalot Reginald the Third!') or when your pet is being mischievous. It adds personality and the full name becomes an inside joke between you and your companion." },
    { q: "What should I avoid when choosing a name?", a: "Avoid names that sound like commands (Kit/sit, Bo/no), names too similar to family members, names with negative associations, and names you'd feel uncomfortable shouting in public. Also avoid names that are so common your pet might respond to someone else's call at the park." },
    { q: "Should I pick a name before bringing my pet home?", a: "Having a shortlist is great, but avoid finalizing before meeting your companion. The name that seems perfect on paper might not match the reality of your pet's personality. Arrive with options but stay flexible." },
    { q: "How important is name length for pets?", a: "One to two syllables is ideal for recognition, but consistency matters more than length. Pets learn whatever name you use regularly. If you love a three-syllable name, it will work fine — your pet will likely respond to the first syllable or a natural nickname anyway." },
  ],
];

function generateContent(title, description, animals, guides) {
  const content = [];
  const animalRefs = pick(animalSlugs, 18);
  const guideRefs = pick(guideSlugs, 4);

  // Introduction section
  content.push(h2("🐾 Introduction"));
  content.push(p(randItem(introParagraphs)));
  content.push(p(description));
  content.push(p(`Our comprehensive animal name database spans over 200 species including {${animalRefs[0]}}, {${animalRefs[1]}}, {${animalRefs[2]}}, {${animalRefs[3]}}, {${animalRefs[4]}}, {${animalRefs[5]}}, and many more — each featuring 160+ hand-picked names across multiple categories. This guide brings together our very best ideas in one convenient place.`));

  // Why names matter
  content.push(h2("💭 Why the Right Name Matters"));
  content.push(p(randItem(namingPhilosophyParagraphs)));
  content.push(p(`When you choose a name that truly fits, something magical happens. Your {${animalRefs[7]}} responds more readily to training. Strangers at the park smile when they hear it. Your bond deepens because the name reflects something genuine about who your companion is. At BestAnimalNames.com, we've helped thousands of pet owners find that perfect match through our extensive database of name ideas and expert guidance.`));

  // Tips section
  content.push(h2("🎯 Expert Naming Tips"));
  const tips = randItem(tipSets);
  tips.forEach((tip, i) => {
    content.push(h3(`Tip ${i + 1}: ${tip.title}`));
    content.push(p(tip.body));
  });

  // Categories section
  content.push(h2("📂 Popular Name Categories"));
  const categories = [
    "Classic & Timeless — Names like Max, Bella, Charlie, and Lucy have stood the test of time for good reason. They're easy to say, universally loved, and suit pets of any age or breed. These names never go out of style.",
    "Nature-Inspired — From 'Willow' and 'River' to 'Storm' and 'Daisy,' nature provides endless naming inspiration. These names evoke the outdoors and work beautifully for adventurous, free-spirited companions.",
    "Food & Drink — 'Mochi,' 'Pepper,' 'Olive,' and 'Biscuit' represent the delicious trend in pet naming. Food names are inherently cute, memorable, and often reflect your pet's coloring or personality.",
    "Pop Culture — Whether you're a Marvel fan naming your pet 'Loki' or a Star Wars devotee choosing 'Yoda,' pop culture names create instant recognition and great conversation starters at the dog park.",
    "Mythological & Fantasy — Names like 'Athena,' 'Odin,' 'Phoenix,' and 'Luna' carry deep meaning and epic energy. These names suit pets with dramatic personalities or majestic appearances.",
    "Unique & Creative — For owners who want their pet to stand out, creative names like 'Zephyr,' 'Nyx,' 'Pixel,' or 'Echo' offer one-of-a-kind character that reflects your companion's individuality.",
  ];
  shuffle(categories).slice(0, 4).forEach(cat => {
    const [catTitle, catBody] = cat.split(" — ");
    content.push(h3(catTitle));
    content.push(p(catBody));
  });

  // Common mistakes
  content.push(h2("⚠️ Common Naming Mistakes to Avoid"));
  pick(mistakeContent, 3).forEach(m => content.push(p(m)));

  // Related resources
  content.push(h2("🔗 Explore More Name Ideas"));
  content.push(p(`Looking for even more inspiration? Browse our complete collection of name generators: {${animalRefs[10]}} names, {${animalRefs[11]}} names, {${animalRefs[12]}} names, {${animalRefs[13]}} names, and {${animalRefs[14]}} names. Each generator includes 160+ names across 9 unique categories — male, female, cute, funny, fantasy, unique, cool, baby, and general names.`));

  // Final encouragement
  content.push(h2("✨ Ready to Find the Perfect Name?"));
  content.push(p("The journey to finding your pet's perfect name is a special one. Take your time, enjoy the process, and trust that the right name will feel right when you find it. Whether you're drawn to classic elegance, creative uniqueness, or somewhere in between, the most important thing is choosing a name that makes both you and your companion happy."));
  content.push(p("Remember — at BestAnimalNames.com, we're here to help every step of the way. Our tools are 100% free, updated regularly, and designed to make pet naming joyful rather than stressful. Browse, explore, and discover the name that's been waiting for your special companion."));

  // FAQ
  const faqContent = randItem(faqSets);

  return {
    content,
    faq: faqContent,
    relatedAnimals: pick(animalSlugs, 8),
    relatedGuides: guideRefs,
  };
}

// === EMBELLISH CONTENT TO REACH WORD TARGET ===

function embellishContent(content, title, description) {
  // Add extra paragraphs to ensure 1400-1800 word count
  const extraParagraphs = [
    `Remember that the perfect name is ultimately the one that feels right to you. While trends come and go and advice abounds, your personal connection to your pet's name matters most. Thousands of pet owners have used our tools at BestAnimalNames.com to find names that bring daily joy. You're in good company on this naming journey.`,
    `The bond between humans and animals spans thousands of years of shared history. In every culture and every era, people have named their animal companions with care and creativity. From ancient Egyptian cats with divine names to modern dogs named after favorite foods, the tradition of thoughtful pet naming continues — and you're now part of that wonderful tradition.`,
    `One often overlooked aspect of pet naming is how the name shapes others' perceptions of your companion. A dog named 'Thor' invites expectations of strength and bravery. A cat named 'Mochi' suggests sweetness and softness. While your pet's actual personality matters most, the name you choose contributes to the story others will tell about your companion.`,
    `If you're still undecided after exploring this guide, try the 'name journal' technique: for one week, write down every name that catches your attention — from pets you meet, characters in books, places on maps, or words that simply sound beautiful. At the end of the week, review your list. Patterns will emerge that reveal what you're naturally drawn to in a name.`,
    `Consider also what the name will sound like in five or ten years. Pets are long-term family members, and while 'Baby Yoda' might be hilarious in 2026, consider whether it will still resonate when your companion is a distinguished senior pet. The best names grow with your pet through every life stage.`,
  ];

  let wc = wordCount(content);
  let attempts = 0;

  while (wc < 1400 && attempts < 15) {
    const extra = shuffle(extraParagraphs)[0];
    // Insert before the FAQ or before the last few blocks
    const insertAt = Math.max(1, content.length - 4);
    content.splice(insertAt, 0, p(extra));
    wc = wordCount(content);
    attempts++;
  }

  return content;
}

// === IMAGE EMOJIS ===

const emojiMap = {
  Dog: "🐕", Cat: "🐱", Bird: "🐦", Fish: "🐟", Horse: "🐴",
  Rabbit: "🐰", Hamster: "🐹", Turtle: "🐢", Snake: "🐍", Lizard: "🦎",
  Parrot: "🦜", Frog: "🐸", Chicken: "🐔", Duck: "🦆", Pig: "🐷",
  Cow: "🐮", Sheep: "🐑", Goat: "🐐", Fox: "🦊", Bear: "🐻",
  Panda: "🐼", Lion: "🦁", Tiger: "🐯", Elephant: "🐘", Monkey: "🐒",
  Wolf: "🐺", Deer: "🦌", Hedgehog: "🦔", Otter: "🦦", Penguin: "🐧",
  Dolphin: "🐬", Whale: "🐋", Octopus: "🐙", Butterfly: "🦋", Bee: "🐝",
  Unicorn: "🦄", Dragon: "🐉", Phoenix: "🔥", Ferret: "🐾", GuineaPig: "🐹",
};

function getEmoji(category) {
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (category.toLowerCase().includes(key.toLowerCase())) return emoji;
  }
  return "🐾";
}

// === MAIN ===

function main() {
  console.log("🚀 Daily Blog Generator");
  console.log(`📅 Date: ${todayStr()}`);
  console.log(`📊 Existing blogs: ${existingBlogs.length}`);
  console.log("");

  const newPosts = [];

  for (let i = 0; i < 5; i++) {
    console.log(`📝 Generating blog ${i + 1}/5...`);

    const topic = generateTopic();
    const emoji = getEmoji(topic.category);

    const generated = generateContent(topic.title, topic.description, animals, guides);
    const content = embellishContent(generated.content, topic.title, topic.description);
    const wc = wordCount(content);

    const post = {
      slug: topic.slug,
      title: topic.title,
      description: topic.description,
      date: todayStr(),
      category: topic.category,
      image: emoji,
      tags: topic.tags,
      content,
      faq: generated.faq,
      relatedAnimals: generated.relatedAnimals,
      relatedGuides: generated.relatedGuides,
    };

    // Write blog content file
    const contentPath = `src/data/blog/${topic.slug}.json`;
    saveJSON(contentPath, post);

    // Add to index
    newPosts.push({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      category: post.category,
      image: post.image,
      tags: post.tags,
    });

    console.log(`  ✅ ${post.title}`);
    console.log(`     Words: ${wc} | FAQs: ${post.faq.length} | Animals: ${post.relatedAnimals.length} | Guides: ${post.relatedGuides.length}`);
  }

  // Update blog index (prepend new posts so they appear first)
  const updatedIndex = [...newPosts, ...existingBlogs];
  saveJSON("src/data/blog/index.json", updatedIndex);
  console.log(`\n📋 Blog index updated: ${updatedIndex.length} posts`);

  // Update sitemap
  console.log("🗺️  Regenerating sitemap...");
  try {
    execSync("node scripts/generate-sitemap.mjs", {
      cwd: ROOT,
      stdio: "pipe",
    });
  } catch (e) {
    console.error("Sitemap generation failed:", e.message);
  }

  console.log("\n✅ Daily blog generation complete!");
  console.log(`📈 New posts: ${newPosts.length}`);
  console.log(`📈 Total blog posts: ${updatedIndex.length}`);

  return { newPosts, totalPosts: updatedIndex.length };
}

main();
