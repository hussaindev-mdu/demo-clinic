# CarePlus Medical Centre – immersive 3D clinic website (fictional demo)

React + Vite + Tailwind CSS + Three.js (React Three Fiber / drei) + GSAP.
All clinic details, doctors and testimonials are **fictional**. The appointment form validates input but **sends and books nothing**.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the build locally
```
Requires Node 18+.

## How the 3D storytelling works

| File | Role |
|---|---|
| `src/components/Experience3D.jsx` | Fixed full-screen R3F canvas, studio lighting (Lightformers, no HDR download), camera rig, mouse parallax, hotspots. A GSAP ScrollTrigger timeline writes camera/heart keyframes (`KEYS`) which `useFrame` damps towards. |
| `src/components/Heart3D.jsx` | Loads `/models/heart.glb` if present (auto-centred and scaled), otherwise builds a procedural anatomical heart. |
| `src/hooks/useScrollAnimation.js` | GSAP text/section reveal hook + media-query helper. |
| Hero → About → Specialities | Story beats 1–3, inside `#stage`. The camera moves from far/right → close/left (labelled structure view) → pulled back and faded. |
| Doctors → Facilities → Appointment | Sections 4–6 slide over the canvas as rounded layered panels (DOM transitions; the canvas stops rendering once covered). |

Tune the camera path by editing `KEYS` at the top of `Experience3D.jsx` (`hx/hy` = heart position as a fraction of the screen, `s` scale, `dist`/`az`/`el` camera orbit, `open` = show labels, `fade` = canvas opacity).

**Fallbacks & performance:** no WebGL → static SVG heart; `prefers-reduced-motion` → no spin/beat/reveals/parallax and instant camera; mobile → fewer polygons, DPR ≤ 1.5, no antialiasing, no hotspots/parallax; rendering pauses when the stage is off-screen; 3D code is lazy-loaded in its own chunk.

## Replacing the placeholder with your Blender heart (GLB)

1. Model or buy/licence an anatomical heart in Blender (check the licence permits web use). Keep it under ~100k triangles (decimate or retopologise; bake high-poly detail into a normal map).
2. Use one object per part if you like, apply transforms (`Ctrl+A → All Transforms`), set the origin to the heart's centre, +Y up, facing −Y in Blender (front faces the camera after glTF conversion).
3. Materials: use **Principled BSDF** only – base colour, roughness, normal map, plus *Clearcoat* / *Sheen* for a wet look. Bake textures at 2048² max (1024² is plenty for mobile).
4. **File → Export → glTF 2.0 (.glb)**: Format *glTF Binary*, enable *Apply Modifiers*, *+Y Up*, *Materials: Export*, *Compression: Draco* (optional).
5. Optimise (recommended):
   ```bash
   npx @gltf-transform/cli optimize heart.glb public/models/heart.glb --compress draco --texture-compress webp
   ```
   (Draco files are decoded by drei's `useGLTF`, which fetches the decoder from a CDN by default.)
6. Save as `public/models/heart.glb` and reload. The model is auto-centred and scaled to fit; the rotation, heartbeat pulse and parallax apply to it. The coloured hotspot labels use anchor points defined in `ANCHORS` in `Heart3D.jsx` – adjust them to match your model's anatomy.

## Photography

Doctors and facilities use built-in SVG illustrations (no unlicensed stock images are bundled). To use real photos, put licensed files in `public/images/` and set the paths in `src/assets/images.js`.

## Deploy

**Vercel:** push to GitHub → *Add New Project* → import → framework *Vite* (build `npm run build`, output `dist`). Or `npx vercel --prod`. `vercel.json` sets long-lived caching for hashed assets and models.

**Cloudflare Pages:** *Workers & Pages → Create → Pages → Connect to Git* → build command `npm run build`, output directory `dist`. Or `npm run build && npx wrangler pages deploy dist`. `public/_headers` adds caching rules.

## Accessibility notes
Skip link, semantic landmarks, keyboard-operable menu (focus trap, Esc to close), native `<dialog>` modals, labelled form fields with `aria-invalid`/`aria-describedby`, reduced-motion support, and the decorative 3D canvas is `aria-hidden`.
