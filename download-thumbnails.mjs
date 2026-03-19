import fs from 'fs';
import https from 'https';
import { resolve } from 'path';

const TIKTOK_URL = 'https://www.tiktok.com/oembed?url=https://www.tiktok.com/@skidoctor_/video/7593316113019194646';
const IG_URL = 'https://www.instagram.com/_skidoctor/reel/DTI4I-WDgDc/';

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  try {
    // TikTok
    console.log('Fetching TikTok oEmbed...');
    const ttRes = await fetch(TIKTOK_URL);
    const ttData = await ttRes.json();
    if (ttData.thumbnail_url) {
      console.log('Got TikTok thumb:', ttData.thumbnail_url);
      await download(ttData.thumbnail_url, './public/tiktok-thumb.jpg');
      console.log('Saved tiktok-thumb.jpg');
    }

    // Instagram (hacky OG image fetch)
    console.log('Fetching IG HTML...');
    const igRes = await fetch(IG_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const igHtml = await igRes.text();
    const ogMatch = igHtml.match(/<meta property="og:image" content="([^"]+)"/i);
    if (ogMatch && ogMatch[1]) {
        let cleanUrl = ogMatch[1].replace(/&amp;/g, '&');
        console.log('Got IG thumb:', cleanUrl);
        await download(cleanUrl, './public/ig-thumb.jpg');
        console.log('Saved ig-thumb.jpg');
    } else {
        console.log('Could not find IG thumbnail in meta tags');
    }
  } catch (err) {
    console.error(err);
  }
}

run();
