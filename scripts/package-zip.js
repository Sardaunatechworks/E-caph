const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

class SimpleZip {
  constructor() {
    this.entries = [];
  }

  addFile(zipPath, data, isDir = false) {
    const normPath = zipPath.split(path.sep).join('/').replace(/^\/+/, '');
    this.entries.push({
      path: normPath,
      data: isDir ? Buffer.alloc(0) : (Buffer.isBuffer(data) ? data : Buffer.from(data)),
      isDir
    });
  }

  addLocalFolder(localDir, baseInZip = '') {
    const items = fs.readdirSync(localDir);
    for (const item of items) {
      const fullPath = path.join(localDir, item);
      const stat = fs.statSync(fullPath);
      const zipPath = baseInZip ? `${baseInZip}/${item}` : item;
      if (stat.isDirectory()) {
        this.addFile(`${zipPath}/`, Buffer.alloc(0), true);
        this.addLocalFolder(fullPath, zipPath);
      } else {
        this.addFile(zipPath, fs.readFileSync(fullPath), false);
      }
    }
  }

  build() {
    const localHeaders = [];
    const centralHeaders = [];
    let offset = 0;

    for (const entry of this.entries) {
      const nameBuf = Buffer.from(entry.path, 'utf8');
      const uncompressedData = entry.data;
      const crc = this.crc32(uncompressedData);
      
      let finalData = uncompressedData;
      let compMethod = 0;

      if (!entry.isDir && uncompressedData.length > 0) {
        try {
          const deflated = zlib.deflateRawSync(uncompressedData, { level: 9 });
          if (deflated.length < uncompressedData.length) {
            finalData = deflated;
            compMethod = 8;
          }
        } catch {}
      }

      const compSize = finalData.length;
      const uncompSize = uncompressedData.length;

      // Local file header (30 bytes + name)
      const localHdr = Buffer.alloc(30 + nameBuf.length);
      localHdr.writeUInt32LE(0x04034b50, 0);
      localHdr.writeUInt16LE(20, 4);
      localHdr.writeUInt16LE(0x0800, 6); // UTF-8 name
      localHdr.writeUInt16LE(compMethod, 8);
      localHdr.writeUInt16LE(0, 10);
      localHdr.writeUInt16LE(0, 12);
      localHdr.writeUInt32LE(crc, 14);
      localHdr.writeUInt32LE(compSize, 18);
      localHdr.writeUInt32LE(uncompSize, 22);
      localHdr.writeUInt16LE(nameBuf.length, 26);
      localHdr.writeUInt16LE(0, 28);
      nameBuf.copy(localHdr, 30);

      // Central directory header (46 bytes + name)
      const centralHdr = Buffer.alloc(46 + nameBuf.length);
      centralHdr.writeUInt32LE(0x02014b50, 0);
      centralHdr.writeUInt16LE(0x0314, 4); // UNIX 2.0 (ensures cPanel unzips as proper Linux folders)
      centralHdr.writeUInt16LE(20, 6);
      centralHdr.writeUInt16LE(0x0800, 8);
      centralHdr.writeUInt16LE(compMethod, 10);
      centralHdr.writeUInt16LE(0, 12);
      centralHdr.writeUInt16LE(0, 14);
      centralHdr.writeUInt32LE(crc, 16);
      centralHdr.writeUInt32LE(compSize, 20);
      centralHdr.writeUInt32LE(uncompSize, 24);
      centralHdr.writeUInt16LE(nameBuf.length, 28);
      centralHdr.writeUInt16LE(0, 30);
      centralHdr.writeUInt16LE(0, 32);
      centralHdr.writeUInt16LE(0, 34);
      centralHdr.writeUInt16LE(0, 36);
      centralHdr.writeUInt32LE(entry.isDir ? 0x41ed0010 : 0x81a40000, 38); // Linux permissions 0755 dir, 0644 file
      centralHdr.writeUInt32LE(offset, 42);
      nameBuf.copy(centralHdr, 46);

      localHeaders.push(Buffer.concat([localHdr, finalData]));
      centralHeaders.push(centralHdr);

      offset += localHdr.length + finalData.length;
    }

    const centralDirBuffer = Buffer.concat(centralHeaders);
    const endRecord = Buffer.alloc(22);
    endRecord.writeUInt32LE(0x06054b50, 0);
    endRecord.writeUInt16LE(0, 4);
    endRecord.writeUInt16LE(0, 6);
    endRecord.writeUInt16LE(this.entries.length, 8);
    endRecord.writeUInt16LE(this.entries.length, 10);
    endRecord.writeUInt32LE(centralDirBuffer.length, 12);
    endRecord.writeUInt32LE(offset, 16);
    endRecord.writeUInt16LE(0, 20);

    return Buffer.concat([...localHeaders, centralDirBuffer, endRecord]);
  }

  crc32(buf) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ this.crcTable[(crc ^ buf[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }
}

SimpleZip.prototype.crcTable = (() => {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }
  return table;
})();

// 1. Ensure latest .htaccess is copied to out
if (fs.existsSync('public/.htaccess')) {
  fs.copyFileSync('public/.htaccess', 'out/.htaccess');
}

// 1b. Write legacy chunk fallbacks to prevent 404s for any client with cached references
const chunksDir = path.join('out', '_next', 'static', 'chunks');
if (fs.existsSync(chunksDir)) {
  fs.writeFileSync(
    path.join(chunksDir, '2puv0rx1z5p61.js'),
    '(globalThis.__turbopack_load__=globalThis.__turbopack_load__||[]).push(["static/chunks/2puv0rx1z5p61.js",{64893:(e)=>{e.s({});}}]);'
  );
  fs.writeFileSync(path.join(chunksDir, '2lt03smjhj35o.css'), '/* fallback */');
}

// 1c. Create dual font aliases (.p. and non-.p.) to prevent font 404s for any cached browser preloads
const mediaDir = path.join('out', '_next', 'static', 'media');
if (fs.existsSync(mediaDir)) {
  const mediaFiles = fs.readdirSync(mediaDir);
  for (const file of mediaFiles) {
    if (file.endsWith('.woff2')) {
      if (file.includes('-s.p.')) {
        const altFile = file.replace('-s.p.', '-s.');
        const altPath = path.join(mediaDir, altFile);
        if (!fs.existsSync(altPath)) {
          fs.copyFileSync(path.join(mediaDir, file), altPath);
          console.log(`Created font alias: ${altFile} <- ${file}`);
        }
      } else if (file.includes('-s.')) {
        const altFile = file.replace('-s.', '-s.p.');
        const altPath = path.join(mediaDir, altFile);
        if (!fs.existsSync(altPath)) {
          fs.copyFileSync(path.join(mediaDir, file), altPath);
          console.log(`Created font alias: ${altFile} <- ${file}`);
        }
      }
    }
  }
}

// 2. Create flat alias files for Next.js App Router RSC prefetch queries
function createRscAliases(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (item.startsWith('__next.')) {
        copyRscPageFiles(fullPath, dir, item);
      } else {
        createRscAliases(fullPath);
      }
    }
  }
}

function copyRscPageFiles(currentDir, parentDir, nextDirName) {
  const items = fs.readdirSync(currentDir);
  for (const item of items) {
    const full = path.join(currentDir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      copyRscPageFiles(full, parentDir, nextDirName + '.' + item);
    } else if (item === '__PAGE__.txt') {
      const aliasName = nextDirName + '.__PAGE__.txt';
      const targetPath = path.join(parentDir, aliasName);
      try {
        fs.copyFileSync(full, targetPath);
      } catch {}
    }
  }
}

createRscAliases('out');

// 3. Sync out directory to dist (ensures dist folder is completely fresh if uploaded directly)
function syncDir(src, dest) {
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.cpSync(src, dest, { recursive: true });
}

try {
  syncDir('out', 'dist');
  console.log('Synchronized fresh build to dist/ directory.');
} catch (e) {
  console.warn('Could not sync to dist/:', e.message);
}

// 4. Build zip from out folder
const zip = new SimpleZip();
zip.addLocalFolder('out');
const zipBuffer = zip.build();
fs.writeFileSync('dist.zip', zipBuffer);
console.log(`Generated Linux & cPanel-compatible dist.zip: ${(zipBuffer.length / (1024 * 1024)).toFixed(2)} MB (${zip.entries.length} entries including .htaccess, _next/* and all RSC prefetch files)`);

