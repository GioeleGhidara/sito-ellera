import fs from 'fs';

const filePath = 'd:/Users/Gioele/Desktop/ellera.it/sito2/src/pages/GalleriaArte.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// replace the Mini Galleria
content = content.replace(
  /              \{\/\* Mini Galleria Pannelli \*\/\}[\s\S]*?Clicca per ingrandire - Immagini dal catalogo ufficiale 2016\r?\n                <\/p>\r?\n              <\/div>/,
  `              {/* Cubo 3D Pannelli */}
              <div className="flex flex-col items-center lg:items-start w-full">
                <div className="flex items-center gap-2 mb-3 w-full">
                  <Image className="w-4 h-4 text-accent" />
                  <h4 className="font-heading font-semibold text-foreground text-sm">Esplora i Pannelli in 3D</h4>
                </div>
                <div className="w-full max-w-sm">
                  <CeramicCube />
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center lg:text-left italic w-full max-w-sm">
                  Trascina il cubo per ruotarlo, usa scorrimento per lo zoom.
                </p>
              </div>`
);

// remove Lightbox
content = content.replace(
  /      \{\/\* Lightbox \*\/\}[\s\S]*?      <\/AnimatePresence>/,
  ''
);

// remove lightbox state and next/prev Image functions
content = content.replace(/  const \[lightboxIndex[^\n]+\n/g, '');
content = content.replace(/  const openLightbox[^\n]+\n/g, '');
content = content.replace(/  const closeLightbox[^\n]+\n/g, '');
content = content.replace(/  const prevImage[^\n]+\n/g, '');
content = content.replace(/  const nextImage[^\n]+\n/g, '');

// remove galleryImages from import
content = content.replace(/artists, galleryImages/g, 'artists');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Done!');
