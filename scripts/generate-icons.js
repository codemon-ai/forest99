import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '..', 'public', 'icons');
const svgPath = join(iconsDir, 'icon.svg');

const sizes = [192, 512];

async function generateIcons() {
  const svgBuffer = readFileSync(svgPath);
  
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(iconsDir, `icon-${size}.png`));
    
    console.log(`Generated icon-${size}.png`);
  }
  
  console.log('Icon generation complete!');
}

generateIcons().catch(console.error);
