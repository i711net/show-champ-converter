import {readFile,mkdir,writeFile,copyFile} from 'node:fs/promises';
const directory=new URL('../public/core/',import.meta.url);
await mkdir(directory,{recursive:true});
await copyFile(new URL('../node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.js',import.meta.url),new URL('ffmpeg-core.js',directory));
const wasm=await readFile(new URL('../node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.wasm',import.meta.url));
const parts=[];
for(let offset=0,index=0;offset<wasm.length;offset+=8*1024*1024,index++){
 const name=`wasm-${index}.bin`;parts.push(name);await writeFile(new URL(name,directory),wasm.subarray(offset,offset+8*1024*1024));
}
await writeFile(new URL('manifest.json',directory),JSON.stringify({parts,size:wasm.length}));
console.log('Prepared single-thread FFmpeg core in '+parts.length+' static parts.');
