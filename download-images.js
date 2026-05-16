const https = require('https');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://centrshtor.ru';
const outputDir = 'c:\\Users\\zivi7\\mebel\\front\\public\\electro';

// All image URLs from the parsed HTML
const images = [
  // Type 1: Раздвижной наклонный (4 images)
  '/upload/iblock/856/zpf541bl644etsvmvqu8x5101f1fwjqf.jpg',
  '/upload/resize_cache/iblock/74c/370_360_0/ucrweeqf3aydzd4q6e2s7zxrsss1fzop.jpg',
  '/upload/resize_cache/iblock/c02/370_360_0/xdl66tsi3wypjza2iupwz8towp9w33qn.jpg',
  '/upload/resize_cache/iblock/9a5/370_360_0/aqbahmdt4eko7zris8pvjou78an0ap37.jpg',
  
  // Type 2: Раздвижной прямой (5 images)
  '/upload/iblock/3b6/s0tmpjhyke5iqz7czh2tf0cjrbh6r9yk.png',
  '/upload/iblock/9c7/fgvpdnynzdek6qsmaaf42bfntfu4ehxz.png',
  '/upload/resize_cache/iblock/a4a/370_360_0/xju8x07rfuqfnkpsbrgjy46n73e3cmgi.jpg',
  '/upload/resize_cache/iblock/00f/370_360_0/2sosr8qbdmmaz4rr1fc49wgzngoej89i.jpg',
  
  // Type 3: Раздвижной угловой (6 images - skip main)
  '/upload/resize_cache/iblock/c1f/370_360_0/kemmemocahks0htm2zd7r9sj3ah0w8ow.jpg',
  '/upload/resize_cache/iblock/169/370_360_0/553kay20tleopff6uwgqj1n0yz5chts9.jpg',
  '/upload/resize_cache/iblock/190/370_360_0/55y1oqx0g0bzi9qnk6fm600712z8tccl.jpg',
  '/upload/resize_cache/iblock/5e4/370_360_0/b28y4hpsde9agyw9j3sgs3okw9piz7wf.jpg',
  '/upload/resize_cache/iblock/03c/370_360_0/djprwx8ee6z2xjg89g6y0x6v4imu7pb5.jpg',
  '/upload/resize_cache/iblock/5a8/370_360_0/wuxcvmjegqnuu0cy0jml31op8ch0n2ep.jpg',
  
  // Type 4: Раздвижной радиальный (5 images - skip main)
  '/upload/resize_cache/iblock/ccd/370_360_0/2dvwfkictbegf0gw28f2ymkmmnfa9jm1.jpg',
  '/upload/resize_cache/iblock/994/370_360_0/vj7ao0zos5pvn020sw3fue9bduavc95m.jpg',
  '/upload/resize_cache/iblock/bf8/370_360_0/yt9xp0a1hc4tuwppub74hhnggke1twiw.jpg',
  '/upload/resize_cache/iblock/f65/370_360_0/29z277rl2uzjdsxv2bylig2sp5p843wi.jpg',
  '/upload/resize_cache/iblock/4b1/370_360_0/58a08px4kjfto3mu11j0j1fmw8br0rmc.jpg',
  
  // Type 5: Раздвижной на люверсах (3 images - skip main)
  '/upload/iblock/f91/akpaguwijo8kw982h6l9ozmd474rwo77.png',
  '/upload/iblock/0b2/ln0xxg0q8nuukcr5ot5j76h6di3wn2zk.png',
  '/upload/resize_cache/iblock/3de/370_360_0/esnz5vmw89dg1nnuvt9rh5686ysa6pmp.jpg',
  
  // Type 6: Римский (4 images - skip main)
  '/upload/iblock/a1f/hk1im3r1pp5z9d4owxe5ewnx5y7xcugq.png',
  '/upload/resize_cache/iblock/f23/370_360_0/8ogp92xt3w3923dda1jp502f16bop1lu.jpg',
  '/upload/resize_cache/iblock/5d8/370_360_0/z8zohx4fyzraa2m99c5g6dwvufqvs591.jpg',
  '/upload/resize_cache/iblock/3a7/370_360_0/4xvyug3efgmppml9cl63c4bcbz3hb2sn.jpg',
  
  // Type 7: Римский день-ночь (3 images - skip main)
  '/upload/resize_cache/iblock/052/370_360_0/s6qiesnhw7sgqxzs299ymk5tbn2zhorp.jpg',
  '/upload/resize_cache/iblock/9e3/370_360_0/umxvm52m4v449b773uhdzrdr7nynm2oi.jpg',
  '/upload/resize_cache/iblock/e3d/370_360_0/n9q34v879e8qt5hfyrosw6wplnczdug8.jpg',
  
  // Type 8: Римский наклонный (4 images - skip main)
  '/upload/resize_cache/iblock/667/370_360_0/o2g4hqiennefkbdrb8ts9e8jxjpf9wbl.jpg',
  '/upload/resize_cache/iblock/10d/370_360_0/ajh32rxq192sa18c7g4jw4raoa7ncy6d.jpg',
  '/upload/resize_cache/iblock/f08/370_360_0/ukln14go30ddf0gd404r1azny53clpr8.jpg',
  '/upload/resize_cache/iblock/ca8/370_360_0/9r7ezvnhivipz6zzmve2o0jdh48y8dxe.jpg',
  
  // Type 9: Рулонный с соединителем (4 images - skip main)
  '/upload/resize_cache/iblock/149/370_360_0/raca1sx808y2c42mpp4in3tn1zuat128.jpg',
  '/upload/resize_cache/iblock/0c3/370_360_0/ncdlt4qbxzaxj9degowam0fq5urhnwbz.jpg',
  '/upload/resize_cache/iblock/117/370_360_0/h9d1fo5ls884lbffbv7gi36da797gi2i.jpg',
  '/upload/resize_cache/iblock/9af/370_360_0/vp3u6ymrchcmcpi8mox8f8zijs32uy13.jpg',
  
  // Type 10: Рулонный UNI2 (3 images - skip main)
  '/upload/resize_cache/iblock/fdf/370_360_0/jyucjbhfiijdszpx03l31u0iw618i2bo.gif',
  '/upload/iblock/665/otdt6n1cf56qeoy02v1drx08piqhk3th.png',
  '/upload/iblock/8f8/vp18hej865v54glscrm0i3gjx2280nt2.png',
  
  // Type 11: Рулонный открытого типа (3 images - skip main)
  '/upload/resize_cache/iblock/dfe/370_360_0/g9t5lidtio9rpd4z4eu1j64ul3x4b5sw.jpg',
  '/upload/resize_cache/iblock/bd3/370_360_0/to54gqfhc3c4qu1bwt5ytuqdrzktc0d4.jpg',
  '/upload/resize_cache/iblock/1ba/370_360_0/t9e0axngi8ma7gs5kgguj9vfa0p0eupi.jpg',
  
  // Type 12: Рулонный день-ночь (5 images - skip main)
  '/upload/resize_cache/iblock/4f9/370_360_0/9s2d6ktpsgovpom7wy3tpi16kyyjbbzw.jpg',
  '/upload/resize_cache/iblock/15e/370_360_0/wvcfslfm1fxq8tgm64zmugif0uxlm3cx.jpg',
  '/upload/resize_cache/iblock/809/370_360_0/610lzxhup72p0bwwuh0doqqigrm1ord7.jpg',
  '/upload/resize_cache/iblock/e1b/370_360_0/2ln9rhvt412v21s683qgh4mfeylwkki1.jpg',
  '/upload/resize_cache/iblock/08d/370_360_0/o9abn0zzk13z35t2b7tobg4u4nzkj16e.jpg',
  
  // Type 13: Рулонный зебра в коробе (3 images - skip main)
  '/upload/resize_cache/iblock/6a3/370_360_0/zz3he1c1qfqd6jzzstlmhi0svns7cjc9.jpg',
  '/upload/resize_cache/iblock/762/370_360_0/dmsavna6scd65247wetpcym7wpmgbcjn.jpg',
  '/upload/resize_cache/iblock/b21/370_360_0/v9q88bylgwu30n7ik9iiq74721iq70as.jpg',
  
  // Type 14: Электрокарниз для горизонтальных жалюзи (2 images - skip main)
  '/upload/iblock/636/6cq4m1cnzogcrr377o67ku1mi5gdg3pv.png',
  '/upload/iblock/871/s8bmeeqjyl3ma0w3b1rrlyfmbdqii2sj.png',
  
  // Type 15: Электрокарниз для вертикальных жалюзи (5 images - skip main)
  '/upload/resize_cache/iblock/ac5/370_360_0/fisx11ulrcj2cguhu7fpau8a39v7x953.jpg',
  '/upload/resize_cache/iblock/bb0/370_360_0/qn7g6pjldaxql8xy84bg21i42h6smy31.jpg',
  '/upload/resize_cache/iblock/69e/370_360_0/3bvqcrdbmb6vw0i98bi1hevb7qve3evk.jpg',
  '/upload/resize_cache/iblock/d42/370_360_0/ibsvrjiu5yenzvfhnc2vgdet4k9ztuz1.jpg',
  '/upload/resize_cache/iblock/0b2/370_360_0/bn7vl7f2d240fjhzy3vqqx9k66ankt2v.jpg',
  
  // Type 16: Электрокарниз для штор плиссе (5 images - skip main)
  '/upload/resize_cache/iblock/094/370_360_0/vzklk0anhxy2a01qv0vn920fgrsmckvn.jpg',
  '/upload/resize_cache/iblock/dc0/370_360_0/pmz1nqksdj547gfohbk4z7emem69jqq8.jpg',
  '/upload/resize_cache/iblock/7b9/370_360_0/r6wk5ijsivijg7zaepyu5z2l1i38x1x6.jpg',
  '/upload/resize_cache/iblock/cbd/370_360_0/tpojh1ni07beb9fu46m9pt1cg9k9jez8.jpg',
  '/upload/resize_cache/iblock/b17/370_360_0/4pbjnd5n2a7qg0kidmgrhsj1quxjbdw6.jpg',
  
  // Type 17: Электрокарниз для пергол (3 images - skip main)
  '/upload/resize_cache/iblock/a76/370_360_0/m8wyhf8x9q9w5bvt52rk6jtowdudzluf.gif',
  '/upload/iblock/6c2/213jio6v9rhod7epkws6e9pcl4jnmf44.png',
  '/upload/iblock/925/xdzbd6xdnprf8w2eunrifcfu8bp6kf37.png',
  
  // Type 18: Подъёмный механизм лифт-система (2 images - skip main)
  '/upload/iblock/e41/5u3qginp4yb2j703c3zmziqa7z6vqqr2.png',
  '/upload/iblock/e4c/yxopxmz17tyh9fk4tzyfa0i6lppts5xl.png',
];

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, { timeout: 30000 }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(outputPath);
        resolve(stats.size);
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

async function downloadAll() {
  let count = 0;
  const total = images.length;
  const failed = [];
  
  for (const img of images) {
    count++;
    const url = baseUrl + img;
    const filename = path.basename(img);
    const outputPath = path.join(outputDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(outputPath)) {
      console.log(`[${count}/${total}] Skip (exists): ${filename}`);
      continue;
    }
    
    console.log(`[${count}/${total}] Downloading: ${filename}`);
    
    try {
      const size = await downloadFile(url, outputPath);
      console.log(`  ✓ Success (${size} bytes)`);
    } catch (err) {
      console.log(`  ✗ Failed: ${err.message}`);
      failed.push(img);
    }
    
    // Small delay to be nice to the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\nDownload complete!`);
  console.log(`Total: ${total}, Success: ${total - failed.length}, Failed: ${failed.length}`);
  if (failed.length > 0) {
    console.log('Failed URLs:', failed);
  }
}

downloadAll().catch(console.error);
