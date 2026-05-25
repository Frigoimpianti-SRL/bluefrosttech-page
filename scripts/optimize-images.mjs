import { mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const photosSrc = path.join(root, 'photos');
const photosOut = path.join(root, 'public', 'photos');
const logoSrc = path.join(root, 'logo.png');
const logoOut = path.join(root, 'public', 'logo.png');
const logoWebpOut = path.join(root, 'public', 'logo.webp');

const WIDTHS = [480, 800, 1200];

async function optimizePhoto(filename) {
  const base = path.parse(filename).name;
  const input = path.join(photosSrc, filename);

  for (const width of WIDTHS) {
    const pipeline = sharp(input).resize(width, null, { withoutEnlargement: true });

    await pipeline
      .clone()
      .avif({ quality: 50 })
      .toFile(path.join(photosOut, `${base}-${width}w.avif`));

    await pipeline
      .clone()
      .webp({ quality: 80 })
      .toFile(path.join(photosOut, `${base}-${width}w.webp`));

    await pipeline
      .clone()
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(photosOut, `${base}-${width}w.jpg`));
  }

  console.log(`  ${filename}`);
}

async function optimizeLogo() {
  await sharp(logoSrc)
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(logoOut);

  await sharp(logoSrc).webp({ quality: 85 }).toFile(logoWebpOut);

  console.log('  logo.png → public/logo.png + logo.webp');
}

async function main() {
  await rm(photosOut, { recursive: true, force: true });
  await mkdir(photosOut, { recursive: true });

  const files = (await readdir(photosSrc)).filter((f) => /\.jpe?g$/i.test(f));

  console.log(`Optimizing ${files.length} photos…`);
  for (const file of files) {
    await optimizePhoto(file);
  }

  await optimizeLogo();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
