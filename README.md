# ArtParsa

A simple portfolio website. Each collection — **Art**, **Photos**, and
**AI Images** — is its own page, with a clean 3-per-row image grid. A home page
links to all three. Built with plain HTML, CSS and JavaScript, so it runs on
GitHub Pages with no build step.

---

## Files

```
artparsa/
├── index.html        ← home page (links to the three collections)
├── art.html          ← Art page
├── photos.html       ← Photos page
├── ai.html           ← AI Images page
├── styles.css        ← all styling, shared by every page
├── gallery.js        ← shared script; edit the SECTIONS list to change titles/counts
├── .nojekyll         ← leave as-is (stops GitHub mangling the folders)
├── README.md         ← this file
└── images/
    ├── art/          ← put art-01.jpg ... art-30.jpg here
    ├── photos/       ← put photo-01.jpg ... photo-30.jpg here
    └── ai/           ← put ai-01.jpg ... ai-30.jpg here
```

Every page is fully laid out already. Before you add images, each tile shows a
small number so you can see the grid. As soon as you drop in a correctly-named
image, it replaces the placeholder automatically.

---

## Add your images (the main task)

1. Open the folder for a collection (e.g. `images/art/`).
2. Add images named `art-01.jpg`, `art-02.jpg`, … `art-30.jpg`.
   - Photos use `photo-01.jpg` …, AI images use `ai-01.jpg` …
   - Two-digit numbers (`01`, not `1`).
3. Refresh the page — they appear.

Using `.png` or `.webp`? Open `gallery.js` and change the `ext` value for that
section. Want captions or different file names? See the optional block near the
top of `gallery.js`.

---

## Put it on GitHub Pages (free hosting)

1. Create a new repository on GitHub (any name works).
2. Upload **everything inside the `artparsa` folder** so that `index.html` sits
   at the top level of the repository (*Add file → Upload files*, then drag).
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to *Deploy from a branch*,
   choose branch **main** and folder **/ (root)**, then **Save**.
5. Wait a minute and refresh. The live URL appears at the top of that page
   (like `https://your-username.github.io/your-repo/`).

Tip: name the repo exactly `your-username.github.io` to host at
`https://your-username.github.io/` with no repo name in the URL.

---

## Easy tweaks

In `styles.css`, top `:root` block:

| You want to…                  | Change this |
|-------------------------------|-------------|
| More/fewer images per row     | `--cols`    |
| More/less space between images| `--gap`     |
| The link / focus colour       | `--accent`  |
| Rounded vs sharp corners      | `--radius`  |
| Background colour             | `--bg`      |

In `gallery.js`, the `SECTIONS` list controls each page's title and how many
tiles it has (`count`). If you rename a section there, also update the menu text
in the four HTML files (the `<nav>` links) so they match.

---

## Good to know

- **One script, one stylesheet** are shared by all four pages, so a change in
  `styles.css` or `gallery.js` updates the whole site at once.
- **Image sizes:** tiles are square and crop to fill, so the grid stays tidy
  whatever shapes you upload. Clicking a tile opens the full, uncropped image.
- **File size:** keep images under ~500 KB and ~2000 px wide so pages load fast.
  Free tool: https://squoosh.app
- **Image viewer:** click a tile for full screen; ← → to move between images,
  Esc to close.
- **Mobile:** the grid drops to 2 columns on tablets, 1 on phones.

#Created with Claude
