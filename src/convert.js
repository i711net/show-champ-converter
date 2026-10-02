export const presets={clear:{crf:23,edge:720},standard:{crf:28,edge:720},small:{crf:32,edge:480}};
export function argumentsFor({start,duration,quality}){
 const preset=presets[quality];
 if(!preset||!Number.isFinite(start)||start<0||!Number.isFinite(duration)||duration<=0||duration>60)throw Error('invalid_settings');
 return ['-ss',String(start),'-i','input','-t',String(duration),'-map','0:v:0','-map','0:a:0?',
 '-vf',`scale=w='min(iw,${preset.edge})':h='min(ih,${Math.round(preset.edge*16/9)})':force_original_aspect_ratio=decrease:force_divisible_by=2,setsar=1`,
 '-c:v','libx264','-preset','ultrafast','-crf',String(preset.crf),'-pix_fmt','yuv420p','-r','30',
 '-c:a','aac','-b:a','96k','-ar','44100','-movflags','+faststart','-map_metadata','-1','output.mp4'];
}
export const trustedParents=new Set(['https://show-champ.pages.dev','http://localhost:5173','http://127.0.0.1:5173']);
export function parentOrigin(value){try{const u=new URL(value);return trustedParents.has(u.origin)?u.origin:null;}catch{return null;}}
