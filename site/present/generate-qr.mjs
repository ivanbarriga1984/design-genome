// Local asset preparation only. qrcode-generator is MIT licensed.
// Regenerate with: node site/present/generate-qr.mjs
import qrcode from 'qrcode-generator';
import { writeFileSync } from 'node:fs';
const result={};
for(const [name,url] of Object.entries({workshop:'https://design-genome.com/workshop',gene:'https://design-genome.com/build/gene',home:'https://design-genome.com'})){
  const code=qrcode(0,'M');code.addData(url,'Byte');code.make();
  const count=code.getModuleCount(),border=4;
  let path='';
  for(let y=0;y<count;y++)for(let x=0;x<count;x++)if(code.isDark(y,x))path+=`M${x+border} ${y+border}h1v1h-1z`;
  result[name]={url,size:count+border*2,path};
}
writeFileSync(new URL('./qr.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
