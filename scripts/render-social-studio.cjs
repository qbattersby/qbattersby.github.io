#!/usr/bin/env node
/* Layered, deterministic motion companion to the approved blue share artwork.
 * Requires @napi-rs/canvas, Sharp, ffmpeg, and the font paths registered below.
 * --stills exports inspection frames and the poster without encoding the MP4.
 */
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const sharp = require('sharp');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const root = path.resolve(__dirname, '..');
const WIDTH = 1200, HEIGHT = 630, FPS = 30, DURATION = 12;
const output = path.join(root, 'video/social-studio-v2.mp4');
const review = path.join(os.tmpdir(), 'qbattersby-social-studio-v2-review');
const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');
const clamp = n => Math.max(0, Math.min(1, n));
const smooth = n => { n = clamp(n); return n*n*(3-2*n); };
const range = (t,a,b) => clamp((t-a)/(b-a));
const easeOut = n => 1-Math.pow(1-clamp(n),4);
const settle = n => { n=clamp(n)-1; return 1+2.05*n*n*n+1.05*n*n; };
const mix = (a,b,p) => a+(b-a)*p;
const exit = t => smooth(range(t,10.9,12));
let background, intro, gallery;
function rounded(x,y,w,h,r,fill,stroke) {
  ctx.beginPath();ctx.roundRect(x,y,w,h,r);
  if(fill){ctx.fillStyle=fill;ctx.fill();}
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}
}
function gradient(x,y,xx,yy,stops) {
  const g=ctx.createLinearGradient(x,y,xx,yy);stops.forEach(([at,c])=>g.addColorStop(at,c));return g;
}
function text(value,x,y,size,color='#fff',weight=400,family='Montserrat') {
  const face=family==='Montserrat' ? `Montserrat${weight>=650?'Bold':weight>=500?'Semibold':'Regular'}` : family;
  ctx.font=`${size}px "${face}"`;ctx.fillStyle=color;ctx.fillText(value,x,y);
}
function shadow(blur=28,alpha=.3,y=14) {
  ctx.shadowColor=`rgba(0,9,24,${alpha})`;ctx.shadowBlur=blur;ctx.shadowOffsetY=y;
}
function noShadow(){ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;}
function ellipse(x,y,rx,ry,fill){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,2*Math.PI);ctx.fillStyle=fill;ctx.fill();}
// Each object has its own arrival, with a small overshoot and a shared gentle exit.
function object(t,{start,duration=.95,cx,cy,dx=0,dy=100,rotation=0,scale=.9},paint) {
  const p=range(t,start,start+duration);if(p<=0)return;
  const q=settle(p),out=exit(t);
  ctx.save();ctx.globalAlpha=clamp(p*2.6)*(1-out);
  ctx.translate(cx+dx*(1-q),cy+dy*(1-q)+out*70);
  ctx.rotate(rotation*(1-q));const s=mix(scale,1,q);ctx.scale(s,s);ctx.translate(-cx,-cy);
  paint();ctx.restore();
}
function revealLine(t,value,x,y,size,start,weight=700,color='#fff') {
  const p=easeOut(range(t,start,start+.85));if(p<=0)return;
  ctx.save();ctx.globalAlpha=(1-exit(t))*clamp(p*2);
  ctx.beginPath();ctx.rect(x-5,y-size*1.3,530,size*1.6);ctx.clip();
  text(value,x,y+(1-p)*size*1.35-exit(t)*32,size,color,weight);ctx.restore();
}
function brand(t) {
  revealLine(t,'Quinn Battersby',64,92,32,.12,650);
  const underline=easeOut(range(t,.45,1.35));ctx.save();ctx.globalAlpha=1-exit(t);
  rounded(66,112,68*underline,3,1.5,'#8ec3f4');ctx.restore();
  revealLine(t,'Websites.',62,221,64,.65);
  revealLine(t,'Business tools.',62,291,59,1.05);
  revealLine(t,'Built for you.',62,361,64,1.45);
  revealLine(t,'Custom WordPress development',66,415,23,2.35,450,'#eaf3ff');
  revealLine(t,'& practical AI automation',66,449,23,2.65,450,'#eaf3ff');
  const p=easeOut(range(t,7.1,8.1));
  ctx.save();ctx.globalAlpha=1-exit(t);ctx.beginPath();ctx.rect(62,495,400*p,70);ctx.clip();
  text('battersby.ca',64,544+(1-p)*16,36,'#fff',650);ctx.restore();
  ctx.save();ctx.globalAlpha=(1-exit(t))*smooth(range(t,7.5,8.2));
  rounded(65,561,232*easeOut(range(t,7.4,8.4)),3,1.5,gradient(65,561,297,561,[[0,'#acd7ff'],[1,'rgba(172,215,255,0)']]));ctx.restore();
}
function codeEditor(t) {
  object(t,{start:1.05,cx:990,cy:122,dx:90,dy:-80,rotation:.09,scale:.84},()=>{
    const x=814,y=39,w=342,h=177;
    shadow(26,.32,12);rounded(x,y,w,h,12,'#0b213c','#537ca7');noShadow();
    rounded(x+1,y+1,w-2,28,[11,11,0,0],gradient(x,y,x+w,y+30,[[0,'#264a73'],[1,'#16304f']]));
    ['#85a8c9','#6b92b7','#50799f'].forEach((c,i)=>ellipse(x+14+i*12,y+14,3,3,c));
    text('portfolio.php',x+68,y+18,9,'#c3d8ed',500);
    const p=range(t,1.7,5.6);
    const lines=[['<?php get_header(); ?>','#a7c5ea'],['<main class="portfolio">','#78c7e4'],['  <h1>Built for you.</h1>','#e4ecf9'],['  <?php get_template_part(','#9dc0e9'],['    "selected-work"','#e5cba5'],['  ); ?>','#9dc0e9'],['</main>','#78c7e4'],['<?php get_footer(); ?>','#a7c5ea']];
    const total=lines.reduce((n,[line])=>n+line.length,0);let remain=Math.floor(total*p);
    ctx.save();ctx.beginPath();ctx.rect(x+8,y+34,w-16,h-38);ctx.clip();
    lines.forEach(([line,color],i)=>{
      const baseline=y+48+i*15;
      text(String(i+1),x+12,baseline,8,'#617d9b',400,'Menlo');
      const shown=line.slice(0,Math.max(0,remain));text(shown,x+30,baseline,10,color,400,'Menlo');
      if(remain>=0&&remain<line.length){const advance=ctx.measureText(shown).width;rounded(x+31+advance,baseline-9,2,11,0,'#d9efff');}
      remain-=line.length;
    });ctx.restore();
  });
}
function screen(t,x,y,w,h) {
  ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,4);ctx.clip();
  rounded(x,y,w,h,0,'#132940');
  const power=easeOut(range(t,1.15,2));
  ctx.save();ctx.globalAlpha=power;
  rounded(x,y,w,24,0,'#e8eef6');
  ['#8cabc8','#a7bad0','#c4d1df'].forEach((c,i)=>ellipse(x+13+i*9,y+12,2,2,c));
  rounded(x+62,y+5,w-124,14,4,'#f8fbff');text('battersby.ca',x+w/2-28,y+15,8,'#4b6d91',500);
  const vy=y+24,vh=h-24;
  ctx.save();ctx.beginPath();ctx.rect(x,vy,w,vh);ctx.clip();
  rounded(x,vy,w,vh,0,'#f2f4f8');
  const reveal=easeOut(range(t,1.7,2.7));
  ctx.save();ctx.globalAlpha=reveal;ctx.translate(0,(1-reveal)*45);
  // Actual homepage screenshot; the artwork is never replaced by a client homepage.
  const change=smooth(range(t,3.8,4.7));
  const introHeight=w*780/1296;
  ctx.drawImage(intro,72,120,1296,780,x,vy-change*vh,w,introHeight);
  const scroll=smooth(range(t,4.9,8.1))*1400;
  const settleTop=smooth(range(t,8.1,8.9));
  const sourceY=mix(scroll,200,settleTop);
  ctx.drawImage(gallery,0,sourceY,gallery.width,vh*gallery.width/w,x,vy+(1-change)*vh,w,vh);
  ctx.restore();ctx.restore();
  // Small scrollbar makes the portfolio movement legible at thumbnail size.
  const scrollProgress=smooth(range(t,4.9,8.1))*(1-smooth(range(t,8.1,8.9)));
  rounded(x+w-4,vy+8+scrollProgress*(vh-42),2,30,1,'rgba(40,73,111,.4)');
  ctx.restore();
  const shine=gradient(x,y,x+w,y+h,[[0,'rgba(255,255,255,.045)'],[.5,'rgba(255,255,255,0)'],[1,'rgba(119,175,226,.025)']]);
  rounded(x,y,w,h,0,shine);ctx.restore();
}
function monitor(t) {
  const p=easeOut(range(t,.3,1.4));ctx.save();ctx.globalAlpha=p*(1-exit(t));
  ellipse(823,574,205,13,'rgba(1,12,31,.3)');ctx.restore();
  object(t,{start:.28,duration:1.15,cx:827,cy:574,dy:180,rotation:-.045,scale:.82},()=>{
    // Brushed-metal stand and weighted base.
    ctx.beginPath();ctx.moveTo(796,492);ctx.lineTo(850,492);ctx.bezierCurveTo(847,541,850,548,882,563);ctx.lineTo(764,563);ctx.bezierCurveTo(793,550,801,539,796,492);
    ctx.fillStyle=gradient(776,498,859,559,[[0,'#526a88'],[.32,'#b4c3d6'],[.56,'#e0e7ef'],[1,'#607897']]);ctx.fill();
    shadow(9,.2,5);rounded(755,560,137,8,[3,3,5,5],gradient(755,560,892,568,[[0,'#7890ae'],[.5,'#dbe4ed'],[1,'#8c9db5']]));noShadow();
    const x=550,y=161,w=550,h=360;
    shadow(28,.38,16);rounded(x,y,w,h,13,'#0b1728','#7f9ab9');noShadow();
    rounded(x+1,y+1,w-2,h-2,12,gradient(x,y,x+w,y+h,[[0,'#25364e'],[.38,'#081322'],[.82,'#172c46'],[1,'#48617e']]));
    screen(t,x+11,y+12,w-22,h-43);
    rounded(x+2,y+h-29,w-4,27,[0,0,11,11],gradient(x,y+h-29,x,y+h,[[0,'#d2dce8'],[1,'#8297b1']]));
    ellipse(x+w/2,y+h-16,3,3,'#526a86');
    ctx.strokeStyle='rgba(220,237,255,.45)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+14,y+1);ctx.lineTo(x+w-14,y+1);ctx.stroke();
  });
}
function keyboard(t) {
  object(t,{start:1.65,cx:826,cy:588,dy:75,scale:.8},()=>{
    ctx.save();ctx.translate(681,574);ctx.transform(1,0,-.35,.64,0,0);
    shadow(10,.28,8);rounded(0,0,272,42,5,gradient(0,0,0,42,[[0,'#eff4fa'],[1,'#8fabc6']]));noShadow();
    for(let row=0;row<4;row++)for(let col=0;col<22;col++){
      if(row===3&&col>5&&col<15)continue;
      rounded(9+col*11.6,6+row*8,9,6,1,'#a4b7cc');
    }
    rounded(78,30,105,6,1,'#f0f4f8');ctx.restore();
    shadow(10,.22,7);ellipse(1008,591,24,13,gradient(984,578,1030,603,[[0,'#edf4ff'],[1,'#7d9abd']]));noShadow();
    ctx.strokeStyle='#94adc9';ctx.beginPath();ctx.moveTo(1008,580);ctx.lineTo(1008,588);ctx.stroke();
  });
}
function tick(x,y,p) {
  ctx.strokeStyle='#f9fcff';ctx.lineWidth=1.6;ctx.lineCap='round';ctx.lineJoin='round';
  ctx.beginPath();ctx.moveTo(x-3,y);ctx.lineTo(x-1,y+2);ctx.lineTo(x+4*p,y-3*p);ctx.stroke();
}
function operations(t) {
  object(t,{start:2.15,cx:1054,cy:445,dx:110,dy:45,rotation:.06,scale:.88},()=>{
    const x=951,y=353,w=225,h=190;
    shadow(25,.3,14);rounded(x,y,w,h,11,'#f3f7fc','#8facce');noShadow();
    rounded(x+1,y+1,w-2,29,[10,10,0,0],gradient(x,y,x+w,y+29,[[0,'#345f8d'],[1,'#1b3c64']]));
    text('BUSINESS TOOLS',x+15,y+19,9,'#e9f4ff',650);
    const items=[['Client support',3.35],['Daily operations',4.25],['Less busywork',5.15]];
    items.forEach(([label,start],i)=>{
      const yy=y+61+i*43,p=smooth(range(t,start,start+.65));
      ellipse(x+20,yy-4,7,mix(5,7,p),mixColor('#d4e1ef','#377db8',p));
      ctx.save();ctx.globalAlpha=p;tick(x+20,yy-4,p);ctx.restore();
      text(label,x+35,yy,10,'#294c74',550);
      rounded(x+w-59,yy-14,40,20,10,mixColor('#c6d4e5','#3b83c4',p));
      shadow(2,.12,1);ellipse(x+w-49+20*p,yy-4,7,7,'#fff');noShadow();
      if(i<2)rounded(x+15,yy+16,w-30,1,0,'#e0e8f2');
    });
  });
}
function mixColor(a,b,p){const c=s=>s.match(/[0-9a-f]{2}/gi).map(n=>parseInt(n,16));const aa=c(a),bb=c(b);return `rgb(${aa.map((n,i)=>Math.round(mix(n,bb[i],p))).join(',')})`;}
function frame(time) {
  const t=((time%DURATION)+DURATION)%DURATION;
  ctx.clearRect(0,0,WIDTH,HEIGHT);ctx.drawImage(background,0,0,WIDTH,HEIGHT);
  codeEditor(t);monitor(t);keyboard(t);operations(t);brand(t);
}
(async()=>{
  for(const style of ['Regular','Semibold','Bold'])GlobalFonts.registerFromPath(path.join(__dirname,'fonts',`Montserrat-${style}.ttf`),`Montserrat${style}`);
  GlobalFonts.registerFromPath('/System/Library/Fonts/Menlo.ttc','Menlo');
  [background,intro,gallery]=await Promise.all(['empty-desk.jpg','portfolio-intro.jpg','portfolio-work.jpg'].map(file=>loadImage(path.join(root,'img/social-studio',file))));
  await fs.mkdir(review,{recursive:true});await fs.mkdir(path.dirname(output),{recursive:true});
  for(const t of [0,.7,1.4,2.2,3.3,4.7,6.4,8.2,9.5,11.5,12]){frame(t);await fs.writeFile(path.join(review,`frame-${t}.png`),await canvas.encode('png'));}
  frame(9.5);await sharp(await canvas.encode('png')).jpeg({quality:90,mozjpeg:true,chromaSubsampling:'4:4:4'}).toFile(path.join(root,'img/social-studio-poster-v2.jpg'));
  console.log('Keyframes:',review);
  if(process.argv.includes('--stills'))return;
  const ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-framerate',String(FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart','-metadata','title=Quinn Battersby — The working studio',output],{stdio:['pipe','inherit','inherit']});
  const complete=once(ff,'close');let pipeError;ff.stdin.on('error',err=>{pipeError=err;});
  for(let i=0;i<FPS*DURATION;i++){
    if(pipeError)throw pipeError;
    frame(i/FPS);const bytes=await canvas.encode('png');
    if(!ff.stdin.write(bytes))await once(ff.stdin,'drain');
    if(i%60===0)console.log('Rendered',i,'of',FPS*DURATION,'frames');
  }
  ff.stdin.end();const [code]=await complete;if(code!==0)throw Error('ffmpeg failed: '+code);
  console.log('Saved:',output);
})().catch(error=>{console.error(error);process.exitCode=1;});
