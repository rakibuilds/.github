# Rakibul Labs: 3D AI Portfolio Template

A fast, interactive 3D portfolio template built with vanilla JavaScript. It features a custom chrome-style 3D avatar, smooth scrolling, scroll-driven animations, and a dark aesthetic designed for developers, AI engineers, and creators.

**Live demo:** [rakibul-labs.vercel.app](https://rakibul-labs.vercel.app/)

---

## Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [How the 3D Scene Works](#how-the-3d-scene-works)
- [License](#license)
- [Credits](#credits)

---

## Tech Stack

No React, no Next.js. Just Vite and a small set of focused libraries.

| Technology | Purpose |
| :--- | :--- |
| [Vite](https://vitejs.dev/guide/) | Dev server and production bundler |
| [Three.js](https://threejs.org/docs/) | WebGL rendering and scene management |
| [GLTFLoader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader) | Loads the `.glb` avatar model |
| [DRACOLoader](https://threejs.org/docs/#examples/en/loaders/DRACOLoader) | Decodes Draco-compressed geometry |
| [GSAP](https://gsap.com/docs/v3/) | Animations and ScrollTrigger |
| [Lenis](https://github.com/darkroomengineering/lenis) | Smooth scrolling |

---

## Features

- **Interactive 3D avatar:** A custom `.glb` model that floats gently and follows the cursor.
- **Responsive layout:** The avatar sits beside the text on desktop and centers below it on mobile.
- **Scroll animations:** GSAP ScrollTrigger fades in content and moves the camera as you scroll.
- **Optimized loading:** Draco compression shrinks a 37 MB model to about 1.1 MB.
- **Dark visual style:** Gradient text, grid backgrounds, and AI-inspired typography (Space Grotesk and Inter).

---

## Project Structure

```text
rakibuilds-dot-github/
├── public/
│   ├── assets/
│   │   ├── avatar.glb            # Compressed 3D model
│   │   ├── favicon.ico           # Site icon
│   │   ├── rakibul-ai-labs.webp  # Project image
│   │   └── ...
│   ├── llms.txt                  # Metadata for AI agents
│   ├── sitemap.xml               # Sitemap for search engines
│   └── robots.txt                # Crawler rules
├── hero-3d.js                    # Three.js, GSAP, and Lenis logic
├── index.html                    # Page structure and content
├── main.js                       # UI interactions (menu, FAQ accordion)
├── styles.css                    # Theme, layout, and typography
├── vite.config.js                # Vite configuration
└── package.json                  # Dependencies and scripts
```

---

## Getting Started

Both paths start the same way: clone the repo and install dependencies. You need [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) (or `npm`).

```bash
git clone https://github.com/rakibuilds/.github.git
cd .github
pnpm install
```

Then choose one:

- **Quick publish:** Build the template as-is and put it online. Skip to [Deployment](#deployment).
- **Make it your own:** Follow the customization steps below.

### 1. Add your 3D model

1. Create or generate a `.glb` model with [Meshy.ai](https://www.meshy.ai/) or [Blender](https://www.blender.org/).
2. Save it as `avatar.glb` in `public/assets/`, replacing the existing file.
3. If the file is larger than 5 MB, compress it first with [glTF Transform](https://gltf-transform.dev/) so it loads quickly on mobile:

   ```bash
   npx @gltf-transform/cli optimize input.glb output.glb --compress draco --texture-compress webp
   ```

### 2. Customize the content

| What to change | Where |
| :--- | :--- |
| Hero text, about section, projects, contact details, social links | `index.html` |
| Colors (`--cyan`, `--ink`, etc.) and fonts | `styles.css` |
| Avatar position, via `wrapper.position.set(x, y, z)` | `hero-3d.js` |

### 3. Preview locally

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) to see your changes live.

---

## Deployment

Build the production files first:

```bash
pnpm build
```

This generates a `dist` folder. Publish it with any of the options below.

### Netlify: drag and drop

The fastest option, and no GitHub account is needed. Drag the `dist` folder onto [Netlify Drop](https://app.netlify.com/drop).

### Netlify: GitHub integration

Push your code to your own GitHub repository and connect it to Netlify. Set the build command to `pnpm build` and the publish directory to `dist`.

### Vercel

Push your code to GitHub, import the repository in [Vercel](https://vercel.com/), and select Vite as the framework. Vercel detects the build settings automatically.

### GitHub Pages

1. Set `base: '/your-repo-name/'` in `vite.config.js`.
2. Run `pnpm build`.
3. Deploy the `dist` folder to the `gh-pages` branch.

---

## How the 3D Scene Works

The scene uses plain Three.js with no React Three Fiber.

- **Scene and camera:** Configured in `hero-3d.js`, with the camera framed on the avatar.
- **Lighting:** Directional lights with cyan and purple tints give the chrome material a futuristic glow.
- **Loading:** `GLTFLoader` fetches `avatar.glb` and `DRACOLoader` decompresses it.
- **Idle motion:** Three.js `Timer` drives a per-frame update that makes the model float.
- **Cursor tracking:** A `pointermove` listener rotates the avatar toward the cursor.
- **Scroll zoom:** GSAP ScrollTrigger binds the camera's Z position to scroll progress.

---

## License

Released under the [MIT License](LICENSE).

## Credits

- 3D avatar generated with [Meshy.ai](https://www.meshy.ai/).
- Fonts from [Google Fonts](https://fonts.google.com/): Space Grotesk and Inter.
- Built by [Rakibul](https://rakibul-labs.vercel.app/).