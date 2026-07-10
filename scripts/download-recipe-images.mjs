import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'recipes');

const RECIPE_IMAGES = [
  { id: 'jollof-rice',            filename: 'jollof-rice.jpg',            url: 'https://images.unsplash.com/photo-1699362170822-3498a6b0dad1?w=700&q=85&auto=format&fit=crop' },
  { id: 'egusi-soup',             filename: 'egusi-soup.jpg',             url: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=700&q=85&auto=format&fit=crop' },
  { id: 'moi-moi',                filename: 'moi-moi.jpg',                url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=700&q=85&auto=format&fit=crop' },
  { id: 'efo-riro',               filename: 'efo-riro.jpg',               url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=700&q=85&auto=format&fit=crop' },
  { id: 'akara',                  filename: 'akara.jpg',                  url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=700&q=85&auto=format&fit=crop' },
  { id: 'beans-plantain',         filename: 'beans-plantain.jpg',         url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=700&q=85&auto=format&fit=crop' },
  { id: 'chicken-peppersoup',     filename: 'chicken-peppersoup.jpg',     url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=700&q=85&auto=format&fit=crop' },
  { id: 'beef-suya',              filename: 'beef-suya.jpg',              url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&q=85&auto=format&fit=crop' },
  { id: 'ofada-rice',             filename: 'ofada-rice.jpg',             url: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=700&q=85&auto=format&fit=crop' },
  { id: 'pounded-yam-okra',       filename: 'pounded-yam-okra.jpg',       url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=700&q=85&auto=format&fit=crop' },
  { id: 'fried-plantain',         filename: 'fried-plantain.jpg',         url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=700&q=85&auto=format&fit=crop' },
  { id: 'puff-puff',              filename: 'puff-puff.jpg',              url: 'https://images.unsplash.com/photo-1575853121743-60c24f0a7502?w=700&q=85&auto=format&fit=crop' },
  { id: 'chin-chin',              filename: 'chin-chin.jpg',              url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=700&q=85&auto=format&fit=crop' },
  { id: 'abacha',                 filename: 'abacha.jpg',                 url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=85&auto=format&fit=crop' },
  { id: 'asaro',                  filename: 'asaro.jpg',                  url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&q=85&auto=format&fit=crop' },
  { id: 'roasted-plantain-fish',  filename: 'roasted-plantain-fish.jpg',  url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=700&q=85&auto=format&fit=crop' },
  { id: 'gizdodo',                filename: 'gizdodo.jpg',                url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=700&q=85&auto=format&fit=crop' },
  { id: 'coconut-rice',           filename: 'coconut-rice.jpg',           url: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=700&q=85&auto=format&fit=crop' },
  { id: 'masa-rice-cakes',        filename: 'masa-rice-cakes.jpg',        url: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=700&q=85&auto=format&fit=crop' },
  { id: 'miyan-kuka',             filename: 'miyan-kuka.jpg',             url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=700&q=85&auto=format&fit=crop' },
  { id: 'spaghetti-carbonara',    filename: 'spaghetti-carbonara.jpg',    url: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=700&q=85&auto=format&fit=crop' },
  { id: 'margherita-pizza',       filename: 'margherita-pizza.jpg',       url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=700&q=85&auto=format&fit=crop' },
  { id: 'chicken-tikka-masala',   filename: 'chicken-tikka-masala.jpg',   url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=700&q=85&auto=format&fit=crop' },
  { id: 'chana-masala',           filename: 'chana-masala.jpg',           url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700&q=85&auto=format&fit=crop' },
  { id: 'greek-salad',            filename: 'greek-salad.jpg',            url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&q=85&auto=format&fit=crop' },
  { id: 'falafel-wrap',           filename: 'falafel-wrap.jpg',           url: 'https://images.unsplash.com/photo-1592415486689-125cbbfcdfb3?w=700&q=85&auto=format&fit=crop' },
  { id: 'hummus-pita',            filename: 'hummus-pita.jpg',            url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=700&q=85&auto=format&fit=crop' },
  { id: 'beef-burger',            filename: 'beef-burger.jpg',            url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=85&auto=format&fit=crop' },
  { id: 'chocolate-chip-cookies', filename: 'chocolate-chip-cookies.jpg', url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=700&q=85&auto=format&fit=crop' },
  { id: 'chicken-stirfry',        filename: 'chicken-stirfry.jpg',        url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=700&q=85&auto=format&fit=crop' },
  { id: 'egg-fried-rice',         filename: 'egg-fried-rice.jpg',         url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=700&q=85&auto=format&fit=crop' },
  { id: 'miso-soup',              filename: 'miso-soup.jpg',              url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&q=85&auto=format&fit=crop' },
  { id: 'avocado-toast',          filename: 'avocado-toast.jpg',          url: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=700&q=85&auto=format&fit=crop' },
  { id: 'oatmeal-bowl',           filename: 'oatmeal-bowl.jpg',           url: 'https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?w=700&q=85&auto=format&fit=crop' },
  { id: 'french-toast',           filename: 'french-toast.jpg',           url: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=700&q=85&auto=format&fit=crop' },
  { id: 'caesar-salad',           filename: 'caesar-salad.jpg',           url: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=700&q=85&auto=format&fit=crop' },
  { id: 'lentil-soup',            filename: 'lentil-soup.jpg',            url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=700&q=85&auto=format&fit=crop' },
  { id: 'baked-salmon',           filename: 'baked-salmon.jpg',           url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=700&q=85&auto=format&fit=crop' },
  { id: 'taco-salad',             filename: 'taco-salad.jpg',             url: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=700&q=85&auto=format&fit=crop' },
  { id: 'veggie-quesadilla',      filename: 'veggie-quesadilla.jpg',      url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700&q=85&auto=format&fit=crop' },
];

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);
    const request = protocol.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close(); fs.unlink(destPath, () => {});
        downloadImage(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        file.close(); fs.unlink(destPath, () => {});
        reject(new Error('HTTP ' + response.statusCode)); return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    });
    request.on('error', (err) => { file.close(); fs.unlink(destPath, () => {}); reject(err); });
    request.setTimeout(30000, () => { request.destroy(); reject(new Error('Timeout')); });
  });
}

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
const results = { success: [], failed: [] };
for (const recipe of RECIPE_IMAGES) {
  const destPath = path.join(OUTPUT_DIR, recipe.filename);
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 5000) {
    console.log('SKIP: ' + recipe.filename); results.success.push(recipe.id); continue;
  }
  try {
    process.stdout.write('DL:   ' + recipe.filename + ' ... ');
    await downloadImage(recipe.url, destPath);
    const sz = Math.round(fs.statSync(destPath).size / 1024);
    console.log('OK (' + sz + 'KB)');
    results.success.push(recipe.id);
  } catch (err) {
    console.log('FAIL: ' + err.message);
    results.failed.push({ id: recipe.id, error: err.message });
  }
  await new Promise(r => setTimeout(r, 200));
}
console.log('\n=== DONE: ' + results.success.length + '/' + RECIPE_IMAGES.length + ' ===');
if (results.failed.length) { console.log('Failed:'); results.failed.forEach(f => console.log('  ' + f.id + ': ' + f.error)); }
fs.writeFileSync(path.join(OUTPUT_DIR, '_results.json'), JSON.stringify(results, null, 2));
