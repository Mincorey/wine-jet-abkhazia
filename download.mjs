import fs from 'fs';
import { Buffer } from 'buffer';

const images = [
  { url: 'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&q=80&w=2672', name: 'public/images/cellars.jpg' },
  { url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3', name: 'public/images/hero.jpg' },
  { url: 'https://images.unsplash.com/photo-1504221507732-5246c045949b?auto=format&fit=crop&q=80&w=2000', name: 'public/images/tasting.jpg' },
  { url: 'https://images.unsplash.com/photo-1423483641154-5411ec9c0ddf?auto=format&fit=crop&q=80&w=2670', name: 'public/images/terroir.jpg' },
  { url: 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?auto=format&fit=crop&q=80&w=2000', name: 'public/images/story1.jpg' },
  { url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=2000', name: 'public/images/story2.jpg' },
  { url: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?auto=format&fit=crop&q=80&w=2000', name: 'public/images/vineyards1.jpg' },
  { url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=2000', name: 'public/images/vineyards2.jpg' },
  { url: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=1000', name: 'public/images/wine1.jpg' },
  { url: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&q=80&w=1000', name: 'public/images/wine2.jpg' },
  { url: 'https://images.unsplash.com/photo-1569919659476-f0852f6834b7?auto=format&fit=crop&q=80&w=1000', name: 'public/images/wine3.jpg' },
  { url: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?auto=format&fit=crop&q=80&w=1000', name: 'public/images/wine4.jpg' },
  { url: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?auto=format&fit=crop&q=80&w=1000', name: 'public/images/news1.jpg' },
  { url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=1000', name: 'public/images/news2.jpg' },
  { url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=1000', name: 'public/images/news3.jpg' }
];

async function main() {
  if (!fs.existsSync('public/images')) {
    fs.mkdirSync('public/images', { recursive: true });
  }
  for (const img of images) {
    console.log('Downloading ' + img.name + '...');
    try {
      const response = await fetch(img.url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(img.name, buffer);
      console.log('Downloaded ' + img.name + ' size: ' + buffer.length);
    } catch (e) {
      console.error('Failed to download ' + img.name, e);
    }
  }
}

main();
