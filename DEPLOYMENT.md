# Deploy Animal Name Generator

## Prerequisites

- Node.js >= 18
- npm >= 9
- Git
- Vercel account (https://vercel.com)
- GitHub account (https://github.com)

---

## 1. Install dependencies

```bash
cd animal-name-generator
npm install
```

## 2. Build locally

```bash
npm run build
```

Generates 2,346 static pages. Output goes to `.next/`.

## 3. Local preview

```bash
npm run build && npm start
```

Open http://localhost:3000 in your browser.

**Test these routes:**
- http://localhost:3000 — Homepage
- http://localhost:3000/animals/ — All animals
- http://localhost:3000/animal/dog/ — Dog page
- http://localhost:3000/animal/cat/ — Cat page
- http://localhost:3000/dog-names — Dog names
- http://localhost:3000/cute-dog-names — Cute dog names
- http://localhost:3000/sitemap.xml — Sitemap

## 4. Push to GitHub

```bash
cd animal-name-generator
git init
git add .
git commit -m "Initial commit: Animal Name Generator v2.0"
```

```bash
gh repo create animal-name-generator --public --push --source .
```

Or manually:

```bash
git remote add origin git@github.com:YOUR_USERNAME/animal-name-generator.git
git branch -M main
git push -u origin main
```

## 5. Deploy to Vercel

### Option A: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

Follow the prompts. Accept defaults — Next.js is auto-detected.

```bash
vercel --prod
```

### Option B: Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repo `animal-name-generator`
3. Framework: **Next.js** (auto-detected)
4. Build Command: `npm run build`
5. Output Directory: `.next`
6. Click **Deploy**

### Option C: Vercel + GitHub auto-deploy

After first deployment via Dashboard, every `git push` to `main` triggers a rebuild.

## 6. Post-deployment

```bash
# Preview deployment
vercel

# Promote to production
vercel --prod

# Open production URL
vercel open
```

### Verify

```bash
# Check sitemap
curl https://yourdomain.vercel.app/sitemap.xml

# Check robots.txt
curl https://yourdomain.vercel.app/robots.txt

# Test a page
curl -I https://yourdomain.vercel.app/animal/dog/
```

### Set custom domain

```bash
vercel domains add yourdomain.com
```

Then update `siteUrl` in `next-sitemap.config.js` and `metadataBase` in `src/app/layout.tsx` to `https://yourdomain.com`.

## 7. Adding new animals

```bash
# Add animal entry to scripts/generate-data.mjs (animals array)
# Then regenerate data and rebuild:
node scripts/generate-data.mjs
npm run build
```

Or manually:

```bash
# Create a JSON file directly
cat > src/data/animals/new-animal.json << 'EOF'
{
  "slug": "new-animal",
  "displayName": "New Animal",
  "icon": "🦊",
  "description": "Description here.",
  "maleNames": [...],
  "femaleNames": [...],
  ...
}
EOF

# Add to index.json
# Rebuild
npm run build
```

New pages auto-generate via `generateStaticParams`.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails with memory error | `NODE_OPTIONS="--max-old-space-size=4096" npm run build` |
| Missing pages after build | Check slug in `index.json` matches filename |
| Vercel deploy fails | Verify `vercel.json` is valid JSON |
| 404 on name-type pages | Ensure `parseNameTypeSlug` matches URL pattern |
