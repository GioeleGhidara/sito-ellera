# Image Catalog

All website images are centralized in this folder.

## Folder structure

- `home/`: homepage hero images
- `events/`: event and festival images
- `albi-trail/`: Albi Trail Area images
- `trail-headers/`: header images mapped by trail difficulty color
- `places/`: borgo and trekking images
- `teatro/`: Teatro Balomà images
- `comitato/`: immagini della pagina Comitato

## Usage

Use imports from `@/assets/images` (barrel file: `src/assets/images/index.ts`).

Example:

```ts
import { caruggiEventImage, trailHeroBlueImage } from "@/assets/images";
```

## Add new images

1. Put the file in the right subfolder.
2. Add an export in `src/assets/images/index.ts`.
3. Use the exported symbol in page/component code.
