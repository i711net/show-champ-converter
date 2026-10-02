// A deliberately small MP4 container validator, not a transcoder or malware scanner.
// Accepts non-fragmented H.264 MP4; duration is read from the file, never client input.
export function inspectMp4(bytes) {
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 const fail=()=>{throw Object.assign(new Error('invalid_video'),{status:400,code:'invalid_video'});};
 const text=(p,n)=>String.fromCharCode(...bytes.subarray(p,p+n));
 function boxes(start,end){const out=[];for(let p=start;p<end;){if(end-p<8)fail();let size=view.getUint32(p),head=8;if(size===1){if(end-p<16)fail();size=Number(view.getBigUint64(p+8));head=16;}else if(size===0)size=end-p;if(!Number.isSafeInteger(size)||size<head||p+size>end)fail();out.push({type:text(p+4,4),start:p+head,end:p+size});p+=size;if(out.length>10000)fail();}return out;}
 const root=boxes(0,bytes.length),moov=root.find(b=>b.type==='moov');
 if(!root.some(b=>b.type==='ftyp')||!root.some(b=>b.type==='mdat'&&b.end>b.start)||!moov||root.some(b=>b.type==='moof'))fail();
 const children=b=>boxes(b.start,b.end),find=(b,type)=>children(b).find(x=>x.type===type);
 function duration(box){if(!box)fail();const v=bytes[box.start];if(v!==0&&v!==1)fail();const p=box.start+(v?20:12);if(p+(v?12:8)>box.end)fail();const scale=view.getUint32(p),ticks=v?Number(view.getBigUint64(p+4)):view.getUint32(p+4);const seconds=ticks/scale;if(!Number.isFinite(seconds)||seconds<=0||seconds>60)fail();return seconds;}
 const seconds=duration(find(moov,'mvhd'));if(find(moov,'mvex'))fail();let video=false;
 for(const trak of children(moov).filter(b=>b.type==='trak')){
  const mdia=find(trak,'mdia');if(!mdia)fail();duration(find(mdia,'mdhd'));const h=find(mdia,'hdlr');if(!h||h.start+12>h.end)fail();const kind=text(h.start+8,4);if(!['vide','soun'].includes(kind))continue;
  const minf=find(mdia,'minf'),stbl=minf&&find(minf,'stbl'),stsd=stbl&&find(stbl,'stsd');if(!stsd||stsd.start+8>stsd.end)fail();const entries=boxes(stsd.start+8,stsd.end);if(!entries.length||entries.length!==view.getUint32(stsd.start+4))fail();
  if(kind==='vide'){if(entries.some(b=>!['avc1','avc3'].includes(b.type)))fail();video=true;}
  else if(entries.some(b=>b.type!=='mp4a'))fail();
 }
 if(!video)fail();return {duration:seconds};
}
export function videoRange(header,size){
 if(!header)return null;
 const m=/^bytes=(\d*)-(\d*)$/.exec(header);if(!m||(!m[1]&&!m[2]))return false;
 let start,end;if(!m[1]){const suffix=Number(m[2]);if(!Number.isSafeInteger(suffix)||suffix<1)return false;start=Math.max(0,size-suffix);end=size-1;}else{start=Number(m[1]);end=m[2]?Number(m[2]):size-1;}
 if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=size||start<0||end<start)return false;
 end=Math.min(end,size-1);return {offset:start,length:end-start+1};
}
