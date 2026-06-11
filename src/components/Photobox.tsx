"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { ImagePlus, Download, X, Sparkles, ChevronLeft, ChevronRight, Palette, LayoutGrid, Frame, Pen, Sticker, Pointer } from "lucide-react";
import { FILTERS } from "@/lib/photo-filters";
import { FRAMES, DEFAULT_CUSTOM, renderCustomBackground, drawTextBadge, drawEmojis, EMOJI_CATEGORIES } from "@/lib/photo-frames";
import type { CustomFrameOptions, TextPosition, FontStyle, BadgeShape, PlacedEmoji } from "@/lib/photo-frames";
import CreditGate from "./CreditGate";
import { isLimitReached, incrementUsage } from "@/lib/credits";
import toast from "react-hot-toast";

const GRID_LAYOUTS = [
  { id:"1x1", cols:1, rows:1, cells:1, label:"1" }, { id:"2x1", cols:2, rows:1, cells:2, label:"2" },
  { id:"3x1", cols:3, rows:1, cells:3, label:"3" }, { id:"2x2", cols:2, rows:2, cells:4, label:"4" },
  { id:"3x2", cols:3, rows:2, cells:6, label:"6 A" }, { id:"2x3", cols:2, rows:3, cells:6, label:"6 B" },
];
const SPECIAL_LAYOUTS = [
  { id:"filmstrip", cols:1, rows:4, cells:4, label:"Film Strip" },
  { id:"photostrip", cols:1, rows:4, cells:4, label:"Photo Strip" },
];
const ALL_LAYOUTS = [...GRID_LAYOUTS, ...SPECIAL_LAYOUTS];
const FILTER_CATEGORIES = [
  { name:"Trending", ids:["original","warmfilm","cinematic","softpastel","y2kflash","noirgrain","grunge"] },
  { name:"Classic", ids:["vintage","popart","comic","neon","cartoon","lomo","bw-hc","halftone","sketch","rgbsplit","pixelate"] },
];
const COLOR_SWATCHES = [
  "#111","#fff","#ef4444","#f97316","#eab308","#22c55e","#06b6d4","#3b82f6","#8b5cf6","#ec4899",
  "#fdf2f8","#fef3c7","#dbeafe","#bbf7d0","#fce7f3","#e0f2fe","#f8fafc","#020617",
];
const DECORATIONS = [
  { id:"none", label:"None", emoji:"⬜" }, { id:"stars", label:"Stars", emoji:"⭐" },
  { id:"hearts", label:"Hearts", emoji:"❤️" }, { id:"dots", label:"Dots", emoji:"🔵" },
  { id:"circles", label:"Circles", emoji:"⭕" }, { id:"lightning", label:"Bolt", emoji:"⚡" },
  { id:"confetti", label:"Confetti", emoji:"🎊" }, { id:"sparkles", label:"Sparkles", emoji:"✨" },
  { id:"waves", label:"Waves", emoji:"〰️" }, { id:"grid", label:"Grid", emoji:"#️⃣" },
  { id:"music", label:"Music", emoji:"🎵" }, { id:"stripes", label:"Stripes", emoji:"〽️" },
];
const TRENDY_TEXTS = [
  "MY MOMENTS","BESTIES","FOREVER","VIBES","LIT","SLAY","ICONIC",
  "GOALS","FAMILY","SQUAD","DREAM","BLESSED","LOVE","PEACE",
  "WILD","FREE","BOSS","CHILL","FIRE","LIT AF",
];
const FONT_OPTIONS: { id:FontStyle; label:string; preview:string }[] = [
  { id:"bold", label:"Bold", preview:"Bold" }, { id:"playful", label:"Playful", preview:"Playful" },
  { id:"elegant", label:"Elegant", preview:"Elegant" }, { id:"compact", label:"Compact", preview:"Compact" },
  { id:"classic", label:"Classic", preview:"Classic" }, { id:"funky", label:"Funky", preview:"Funky" },
  { id:"cute", label:"Cute", preview:"Cute" }, { id:"retro", label:"Retro", preview:"Retro" },
  { id:"graffiti", label:"Graffiti", preview:"Graffiti" }, { id:"minimal", label:"Minimal", preview:"Minimal" },
];
const TEXT_POSITIONS: { id:TextPosition; label:string }[] = [
  { id:"top-left", label:"Kiri Atas" }, { id:"top-center", label:"Tengah Atas" }, { id:"top-right", label:"Kanan Atas" },
  { id:"bottom-left", label:"Kiri Bawah" }, { id:"bottom-center", label:"Tengah Bawah" }, { id:"bottom-right", label:"Kanan Bawah" },
];
const SHAPE_OPTIONS: { id:BadgeShape; label:string; emoji:string }[] = [
  { id:"rounded", label:"Rounded", emoji:"⬛" }, { id:"pill", label:"Pill", emoji:"💊" },
  { id:"flag", label:"Flag", emoji:"🚩" }, { id:"underline", label:"Underline", emoji:"__" },
  { id:"outline", label:"Outline", emoji:"◻️" },
];

const TEMPLATES = [
  { id:"comic-strip", label:"Comic Strip", emoji:"💥", layout:"2x2", frameId:"comic-boom", filter:"popart" },
  { id:"photo-strip", label:"Photo Strip", emoji:"🎞️", layout:"photostrip", frameId:"vintage-sepia", filter:"warmfilm" },
  { id:"film-roll", label:"Film Roll", emoji:"🎬", layout:"filmstrip", frameId:"monochrome", filter:"noirgrain" },
  { id:"neon-grid", label:"Neon Grid", emoji:"💜", layout:"2x2", frameId:"neon-cyber", filter:"neon" },
  { id:"tropical", label:"Tropical", emoji:"🌴", layout:"2x1", frameId:"tropical", filter:"cinematic" },
  { id:"dreamy", label:"Dreamy", emoji:"🌸", layout:"3x1", frameId:"pastel-dream", filter:"softpastel" },
  { id:"midnight", label:"Midnight", emoji:"🌙", layout:"2x2", frameId:"midnight", filter:"noirgrain" },
];

let emojiIdCounter = 0;
function nextEmojiId() { return `emoji_${++emojiIdCounter}`; }

function applyFilterToCanvas(canvas: HTMLCanvasElement, filterId: string) {
  if (filterId === "original") return;
  const f = FILTERS.find((x) => x.id === filterId);
  if (f?.fn) f.fn(canvas);
}
function drawFilmPerforations(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const holeW=8,holeH=6,gap=20,margin=6;ctx.fillStyle="#1a1a1a";
  for(let y=margin;y<h-margin;y+=gap){ctx.fillRect(margin,y,holeW,holeH);ctx.fillRect(w-margin-holeW,y,holeW,holeH);}
}

export default function Photobox() {
  const [images,setImages]=useState<string[]>([]);
  const [layout,setLayout]=useState("2x2");
  const [filter,setFilter]=useState("original");
  const [frameId,setFrameId]=useState("comic-boom");
  const [filterTab,setFilterTab]=useState<"Trending"|"Classic">("Trending");
  const [customOpts,setCustomOpts]=useState<CustomFrameOptions>(DEFAULT_CUSTOM);
  const [emojiTab,setEmojiTab]=useState(0);
  const [editEmojiIdx,setEditEmojiIdx]=useState<number|null>(null);
  const [ready,setReady]=useState(0);
  const [dragOver,setDragOver]=useState(false);
  const [showTrendy,setShowTrendy]=useState(false);
  const [limitHit, setLimitHit] = useState(isLimitReached("photobox"));
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const offRef=useRef<HTMLCanvasElement>(null);
  const fileRef=useRef<HTMLInputElement>(null);
  const loadedImgs=useRef<HTMLImageElement[]>([]);
  const canvasWrapRef=useRef<HTMLDivElement>(null);

  const isCustom=frameId==="custom";
  const cur=ALL_LAYOUTS.find((l)=>l.id===layout)||GRID_LAYOUTS[3];
  const isFilmstrip=layout==="filmstrip";const isPhotostrip=layout==="photostrip";const isSpecial=isFilmstrip||isPhotostrip;
  const frame=!isCustom?FRAMES.find((f)=>f.id===frameId)||FRAMES[0]:null;
  const maxCells=cur.cells;const visible=Math.min(images.length,maxCells);
  const cols=isSpecial?1:cur.cols;const rows=isSpecial?visible:cur.rows;
  const gap=isSpecial?4:8;const pad=isSpecial?14:16;const maxLogicalW=isSpecial?360:540;
  const cellGapTotal=(cols-1)*gap;
  const cellW=Math.floor((maxLogicalW-pad*2-cellGapTotal)/cols);
  const cellH=Math.floor(cellW*(isFilmstrip?0.85:0.75));
  const totalW=cols*cellW+cellGapTotal+pad*2;
  const totalH=(isSpecial?rows*cellH+(rows-1)*gap:cur.rows*cellH+(cur.rows-1)*gap)+pad*2;

  useEffect(()=>{if(images.length===0){loadedImgs.current=[];setReady(0);return;}
    const count=Math.min(images.length,maxCells);loadedImgs.current=[];let loaded=0;
    for(let i=0;i<count;i++){const img=new Image();img.onload=()=>{loaded++;if(loaded===count)setReady((n)=>n+1);};img.onerror=()=>{loaded++;if(loaded===count)setReady((n)=>n+1);};img.crossOrigin="anonymous";img.src=images[i];loadedImgs.current.push(img);}
  },[images,layout,maxCells]);

  const renderCanvas=useCallback(()=>{
    const canvas=canvasRef.current;const off=offRef.current;
    if(!canvas||!off||loadedImgs.current.length===0)return;const ctx=canvas.getContext("2d")!;
    canvas.width=totalW;canvas.height=totalH;
    if(isFilmstrip){ctx.fillStyle="#1a1a1a";ctx.fillRect(0,0,totalW,totalH);drawFilmPerforations(ctx,totalW,totalH);}
    else if(isPhotostrip){const g=ctx.createLinearGradient(0,0,0,totalH);g.addColorStop(0,"#fef9c3");g.addColorStop(0.5,"#fef3c7");g.addColorStop(1,"#fde68a");ctx.fillStyle=g;ctx.fillRect(0,0,totalW,totalH);ctx.strokeStyle="#111";ctx.lineWidth=4;ctx.strokeRect(4,4,totalW-8,totalH-8);}
    else if(isCustom){renderCustomBackground(ctx,totalW,totalH,customOpts);const bw=customOpts.borderWidth;ctx.strokeStyle=customOpts.borderColor;ctx.lineWidth=bw;ctx.strokeRect(bw/2,bw/2,totalW-bw,totalH-bw);}
    else if(frame){frame.render(ctx,totalW,totalH);const bw=frame.borderWidth;ctx.strokeStyle=frame.borderColor;ctx.lineWidth=bw;ctx.strokeRect(bw/2,bw/2,totalW-bw,totalH-bw);}
    for(let i=0;i<visible;i++){const col=isSpecial?0:i%cur.cols;const row=isSpecial?i:Math.floor(i/cur.cols);const x=pad+col*(cellW+gap);const y=pad+row*(cellH+gap);
      off.width=cellW;off.height=cellH;const octx=off.getContext("2d")!;octx.clearRect(0,0,cellW,cellH);
      const img=loadedImgs.current[i];const s=Math.min(img.naturalWidth,img.naturalHeight);const sx=(img.naturalWidth-s)/2;const sy=(img.naturalHeight-s)/2;
      const cellBw=isSpecial?(isFilmstrip?0:2):isCustom?customOpts.cellBorderWidth:(frame?.cellBorderWidth??2);
      octx.drawImage(img,sx,sy,s,s,cellBw,cellBw,cellW-cellBw*2,cellH-cellBw*2);applyFilterToCanvas(off,filter);ctx.drawImage(off,x,y);
      if(!isFilmstrip){const cellBc=isPhotostrip?"#111":isCustom?customOpts.cellBorderColor:(frame?.cellBorderColor??"#111");ctx.strokeStyle=cellBc;ctx.lineWidth=isPhotostrip?2:isCustom?customOpts.cellBorderWidth:(frame?.cellBorderWidth??2);ctx.strokeRect(x-1,y-1,cellW+2,cellH+2);
        const showNums=isCustom?true:(frame?.showNumbers??true);if(showNums&&!isPhotostrip){ctx.fillStyle="rgba(0,0,0,0.65)";ctx.font='bold 11px "Inter","Arial",sans-serif';ctx.textAlign="left";ctx.textBaseline="top";ctx.fillRect(x+4,y+4,18,18);ctx.fillStyle="#fff";ctx.fillText(`${i+1}`,x+6,y+6);}}}
    if(isFilmstrip){ctx.strokeStyle="#333";ctx.lineWidth=1;ctx.strokeRect(2,2,totalW-4,totalH-4);}
    if(isCustom&&customOpts.textEnabled&&customOpts.text.trim()){drawTextBadge(ctx,totalW,totalH,customOpts.text,customOpts.textColor,customOpts.textBg,customOpts.textBg2,customOpts.textBgGrad,customOpts.textOpacity,customOpts.textShape,customOpts.textShadow,customOpts.textPosition,20,customOpts.textFont);drawEmojis(ctx,totalW,totalH,customOpts.emojis);}
    else if(frame?.text&&!isSpecial){drawTextBadge(ctx,totalW,totalH,frame.text.text,frame.text.color,frame.text.bgColor,frame.text.bgColor2,false,frame.text.opacity??100,frame.text.shape,frame.text.shadowColor,frame.text.position,frame.text.fontSize,frame.text.fontStyle);}
    const showWm=isCustom?false:(frame?.watermark??false);if(showWm&&!isSpecial){ctx.fillStyle="rgba(0,0,0,0.06)";ctx.font='8px "Inter","Arial",sans-serif';ctx.textAlign="center";ctx.textBaseline="bottom";ctx.fillText("photobox by socialtoolsbyza",totalW/2,totalH-5);}
  },[filter,frameId,customOpts,totalW,totalH,cur,cellW,cellH,visible,isFilmstrip,isPhotostrip,isSpecial,frame,isCustom]);

  useEffect(()=>{if(images.length>0)renderCanvas();},[renderCanvas,ready,images.length]);

  const handleUpload=(files:FileList|File[])=>{const remaining=6-images.length;
    Promise.all(Array.from(files).slice(0,remaining).map((f)=>new Promise<string>((resolve)=>{const r=new FileReader();r.onload=()=>resolve(r.result as string);r.readAsDataURL(f);}))).then((results)=>setImages((prev)=>[...prev,...results].slice(0,6)));if(fileRef.current)fileRef.current.value="";};
  const handleFileChange=(e:React.ChangeEvent<HTMLInputElement>)=>{if(e.target.files)handleUpload(e.target.files);};
  const handleDrop=(e:React.DragEvent)=>{e.preventDefault();setDragOver(false);if(e.dataTransfer.files)handleUpload(e.dataTransfer.files);};
  const removeImage=(idx:number)=>setImages((prev)=>prev.filter((_,i)=>i!==idx));
  const moveImage=(idx:number,dir:-1|1)=>{const to=idx+dir;if(to<0||to>=images.length)return;setImages((prev)=>{const next=[...prev];[next[idx],next[to]]=[next[to],next[idx]];return next;});};
  const downloadPng=()=>{const c=canvasRef.current;if(!c)return;incrementUsage("photobox");if(isLimitReached("photobox"))setLimitHit(true);const l=document.createElement("a");l.download=`photobox-${layout}-${filter}-${frameId}.png`;l.href=c.toDataURL("image/png");l.click();toast.success("Gambar berhasil di download!");};
  const updateCustom=<K extends keyof CustomFrameOptions>(key:K,value:CustomFrameOptions[K])=>{setCustomOpts((prev)=>({...prev,[key]:value}));};

  const handleCanvasClick=(e:React.MouseEvent<HTMLCanvasElement>)=>{
    if(!isCustom||!customOpts.selectedEmoji)return;
    const canvas=canvasRef.current;if(!canvas)return;
    const rect=canvas.getBoundingClientRect();
    const xPct=((e.clientX-rect.left)/rect.width)*100;
    const yPct=((e.clientY-rect.top)/rect.height)*100;
    const newEmoji:PlacedEmoji={id:nextEmojiId(),emoji:customOpts.selectedEmoji,x:Math.round(xPct*10)/10,y:Math.round(yPct*10)/10,size:28};
    setCustomOpts((prev)=>({...prev,emojis:[...prev.emojis,newEmoji],selectedEmoji:null}));
  };

  const handleCanvasTouchEnd=(e:React.TouchEvent<HTMLCanvasElement>)=>{
    if(!isCustom||!customOpts.selectedEmoji)return;
    const canvas=canvasRef.current;if(!canvas)return;
    const rect=canvas.getBoundingClientRect();
    const touch=e.changedTouches[0];if(!touch)return;
    const xPct=((touch.clientX-rect.left)/rect.width)*100;
    const yPct=((touch.clientY-rect.top)/rect.height)*100;
    const newEmoji:PlacedEmoji={id:nextEmojiId(),emoji:customOpts.selectedEmoji,x:Math.round(xPct*10)/10,y:Math.round(yPct*10)/10,size:28};
    setCustomOpts((prev)=>({...prev,emojis:[...prev.emojis,newEmoji],selectedEmoji:null}));
  };

  const selectEmojiForPlacement=(emoji:string)=>{
    setCustomOpts((prev)=>({...prev,selectedEmoji:prev.selectedEmoji===emoji?null:emoji}));
  };

  const updateEmojiPos=(idx:number,key:"x"|"y"|"size",val:number)=>{
    setCustomOpts((prev)=>{const next=[...prev.emojis];next[idx]={...next[idx],[key]:Math.max(0,Math.min(100,val))};return{...prev,emojis:next};});
  };

  const removeEmoji=(idx:number)=>{setCustomOpts((prev)=>({...prev,emojis:prev.emojis.filter((_,i)=>i!==idx)}));};

  const currentFilters=FILTER_CATEGORIES.find((c)=>c.name===filterTab)?.ids||[];
  const isFull=images.length>=6;

  if (limitHit) {
    return <CreditGate toolId="photobox" toolName="Photobox Comic Studio" limitReached={true}><div /></CreditGate>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-[2px_2px_0_#000] border-2 border-black"><Sparkles className="w-5 h-5 text-white"/></div>
          <div className="min-w-0"><h2 className="font-display text-headline-md uppercase italic leading-tight">Photobox Studio</h2><p className="font-body text-xs text-gray-500">Bikin collage foto dengan berbagai tema</p></div>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange}/>

      {images.length===0?(
        <div onDragOver={(e)=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={handleDrop} onClick={()=>fileRef.current?.click()}
          className={`relative border-4 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 py-16 px-6 cursor-pointer transition-all ${dragOver?"border-pink-500 bg-pink-50 scale-[1.02]":"border-black bg-white hover:bg-gray-50 hover:border-pink-400"}`}
          style={{boxShadow:dragOver?"4px 4px 0 rgba(236,72,153,0.3)":"4px 4px 0 rgba(0,0,0,1)"}}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-2 border-black -rotate-3" style={{boxShadow:"3px 3px 0 rgba(0,0,0,1)"}}><ImagePlus className="w-8 h-8 text-white"/></div>
          <div className="text-center"><p className="font-display text-xl uppercase italic">Upload Foto</p><p className="font-body text-sm text-gray-500 mt-1">Klik atau drag & drop foto di sini</p></div>
          <span className="font-body text-[10px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">Maksimal 6 foto &bull; JPG, PNG, WebP</span>
        </div>
      ):(
        <div className="flex flex-col lg:flex-row gap-5">
          {/* LEFT — Tools Panel */}
          <div className="lg:w-96 xl:w-[28rem] space-y-5 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto lg:sticky lg:top-4 lg:shrink-0">
            {/* FOTO */}
            <div className="bg-white border-2 border-black rounded-2xl p-4 space-y-4" style={{boxShadow:"4px 4px 0 rgba(0,0,0,1)"}}>
              <div className="flex items-center justify-between">
                <p className="font-display text-sm uppercase italic">Foto ({images.length}/6)</p>
                <button onClick={()=>{setImages([]);loadedImgs.current=[];setReady(0);}} className="font-body text-[10px] uppercase font-bold text-red-500 hover:text-red-600 flex items-center gap-1"><X className="w-3 h-3"/> Hapus semua</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {images.map((src,i)=>(
                  <div key={i} className="group relative w-16 h-16 border-2 border-black rounded-lg overflow-hidden shrink-0">
                    <img src={src} alt="" className="w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"/>
                    <button onClick={()=>removeImage(i)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 border-2 border-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 max-sm:opacity-100"><X className="w-3 h-3 text-white"/></button>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0 max-sm:opacity-100 opacity-0 group-hover:opacity-100 transition-opacity">
                      {i>0&&<button onClick={()=>moveImage(i,-1)} className="w-7 h-7 sm:w-5 sm:h-5 bg-black/70 flex items-center justify-center hover:bg-black active:bg-black"><ChevronLeft className="w-4 h-4 sm:w-3 sm:h-3 text-white"/></button>}
                      {i<images.length-1&&<button onClick={()=>moveImage(i,1)} className="w-7 h-7 sm:w-5 sm:h-5 bg-black/70 flex items-center justify-center hover:bg-black active:bg-black"><ChevronRight className="w-4 h-4 sm:w-3 sm:h-3 text-white"/></button>}
                    </div>
                    <span className="absolute top-1 left-1 w-4 h-4 bg-black/70 text-white text-[8px] font-bold flex items-center justify-center rounded">{i+1}</span>
                  </div>
                ))}
                {!isFull&&<button onClick={()=>fileRef.current?.click()} className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center text-2xl hover:bg-gray-100 hover:border-gray-400 transition-colors shrink-0">+</button>}
              </div>
            </div>

            {/* TEMPLATE */}
            <div className="bg-white border-2 border-black rounded-2xl p-4 space-y-3" style={{boxShadow:"4px 4px 0 rgba(0,0,0,1)"}}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Sparkles className="w-4 h-4"/><p className="font-display text-sm uppercase italic">Template Cepat</p></div>
                <span className="font-body text-[9px] font-bold text-gray-400">{images.length}/{maxCells} foto</span>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {TEMPLATES.map((t)=>(<button key={t.id} onClick={()=>{setLayout(t.layout);setFrameId(t.frameId);setFilter(t.filter);}} className="flex flex-col items-center gap-0.5 px-3 py-2 border-2 border-black rounded-xl bg-white hover:bg-gray-50 transition-all shrink-0" style={{boxShadow:"2px 2px 0 rgba(0,0,0,1)"}}><span className="text-lg">{t.emoji}</span><span className="font-body text-[8px] font-bold uppercase whitespace-nowrap">{t.label}</span></button>))}
              </div>
            </div>

            {/* LAYOUT */}
            <div className="bg-white border-2 border-black rounded-2xl p-4 space-y-3" style={{boxShadow:"4px 4px 0 rgba(0,0,0,1)"}}>
              <div className="flex items-center gap-2"><LayoutGrid className="w-4 h-4"/><p className="font-display text-sm uppercase italic">Layout</p></div>
              <div className="flex flex-wrap gap-2">
                {GRID_LAYOUTS.map((l)=>{const disabled=images.length>l.cells;const active=layout===l.id;return(
                  <button key={l.id} onClick={()=>setLayout(l.id)} disabled={disabled}
                    className={`p-2 border-2 rounded-lg transition-all ${active?"border-pink-500 bg-pink-50":"border-gray-300 bg-white hover:border-gray-400"} ${disabled?"opacity-30 cursor-not-allowed":"cursor-pointer"}`}
                    style={active?{boxShadow:"2px 2px 0 rgba(236,72,153,0.5)"}:{}}>
                    <div className="grid gap-0.5" style={{gridTemplateColumns:`repeat(${l.cols},1fr)`}}>{Array.from({length:l.cells}).map((_,ci)=><div key={ci} className={`w-4 h-4 rounded-sm ${active?"bg-pink-400":"bg-gray-300"}`}/>)}</div>
                    <p className={`font-body text-[9px] mt-1 font-bold uppercase ${active?"text-pink-600":"text-gray-400"}`}>{l.label}</p>
                  </button>
                );})}
                {SPECIAL_LAYOUTS.map((l)=>{const disabled=images.length>l.cells||images.length<2;const active=layout===l.id;return(
                  <button key={l.id} onClick={()=>setLayout(l.id)} disabled={disabled}
                    className={`p-2 border-2 rounded-lg transition-all ${active?"border-pink-500 bg-pink-50":"border-gray-300 bg-white hover:border-gray-400"} ${disabled?"opacity-30 cursor-not-allowed":"cursor-pointer"}`}
                    style={active?{boxShadow:"2px 2px 0 rgba(236,72,153,0.5)"}:{}}>
                    <div className="flex flex-col gap-0.5 items-center">{Array.from({length:4}).map((_,ci)=><div key={ci} className={`w-5 h-3 rounded-sm ${active?"bg-pink-400":"bg-gray-300"}`}/>)}</div>
                    <p className={`font-body text-[9px] mt-1 font-bold uppercase ${active?"text-pink-600":"text-gray-400"}`}>{l.label}</p>
                  </button>
                );})}
              </div>
            </div>

            {/* BINGKAI */}
            <div className="bg-white border-2 border-black rounded-2xl p-4 space-y-3" style={{boxShadow:"4px 4px 0 rgba(0,0,0,1)"}}>
              <div className="flex items-center gap-2"><Frame className="w-4 h-4"/><p className="font-display text-sm uppercase italic">Bingkai</p></div>
              <div className="flex gap-2 flex-wrap">
                {FRAMES.map((f)=>{const active=frameId===f.id;return(
                  <button key={f.id} onClick={()=>setFrameId(f.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border-2 rounded-lg font-display font-bold transition-all ${active?"bg-gradient-to-r from-purple-500 to-pink-500 text-white border-black":"bg-white text-black border-gray-300 hover:border-gray-400 hover:bg-gray-50"}`}
                    style={active?{boxShadow:"2px 2px 0 rgba(0,0,0,1)"}:{}}><span className="text-sm">{f.emoji}</span><span>{f.name}</span></button>
                );})}
                <button onClick={()=>setFrameId("custom")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border-2 rounded-lg font-display font-bold transition-all ${frameId==="custom"?"bg-gradient-to-r from-purple-500 to-pink-500 text-white border-black":"bg-white text-black border-gray-300 hover:border-gray-400 hover:bg-gray-50"}`}
                  style={frameId==="custom"?{boxShadow:"2px 2px 0 rgba(0,0,0,1)"}:{}}><Pen className="w-3.5 h-3.5"/><span>Custom</span></button>
              </div>
            </div>

            {/* CUSTOM EDITOR */}
            {isCustom&&(
              <div className="bg-white border-2 border-black rounded-2xl p-4 space-y-5" style={{boxShadow:"4px 4px 0 rgba(0,0,0,1)"}}>
                <div className="flex items-center gap-2"><Pen className="w-4 h-4"/><p className="font-display text-sm uppercase italic">Edit Bingkai Custom</p></div>

                <div className="space-y-1">
                  <p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Tipe Background</p>
                  <div className="flex gap-2">
                    <button onClick={()=>updateCustom("bgType","gradient")} className={`px-3 py-1.5 text-xs border-2 rounded-lg font-bold transition-all ${customOpts.bgType==="gradient"?"bg-black text-white border-black":"bg-white text-gray-600 border-gray-300 hover:border-gray-400"}`}>Gradient</button>
                    <button onClick={()=>updateCustom("bgType","solid")} className={`px-3 py-1.5 text-xs border-2 rounded-lg font-bold transition-all ${customOpts.bgType==="solid"?"bg-black text-white border-black":"bg-white text-gray-600 border-gray-300 hover:border-gray-400"}`}>Solid</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1"><p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Warna 1</p><div className="flex gap-1 flex-wrap">{COLOR_SWATCHES.map((c)=>(<button key={c} onClick={()=>updateCustom("bgColor1",c)} className={`sm:w-6 sm:h-6 w-7 h-7 rounded-full border-2 transition-all ${customOpts.bgColor1===c?"border-black scale-110":"border-gray-200"}`} style={{backgroundColor:c}}/>))}</div></div>
                  {customOpts.bgType==="gradient"&&<div className="space-y-1"><p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Warna 2</p><div className="flex gap-1 flex-wrap">{COLOR_SWATCHES.map((c)=>(<button key={c} onClick={()=>updateCustom("bgColor2",c)} className={`sm:w-6 sm:h-6 w-7 h-7 rounded-full border-2 transition-all ${customOpts.bgColor2===c?"border-black scale-110":"border-gray-200"}`} style={{backgroundColor:c}}/>))}</div></div>}
                </div>

                <div className="space-y-1"><p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Dekorasi</p><div className="flex gap-1.5 flex-wrap">{DECORATIONS.map((d)=>(<button key={d.id} onClick={()=>updateCustom("decoration",d.id as CustomFrameOptions["decoration"])} className={`px-2.5 py-1 text-xs border-2 rounded-lg font-bold transition-all ${customOpts.decoration===d.id?"bg-black text-white border-black":"bg-white text-gray-600 border-gray-300 hover:border-gray-400"}`}>{d.emoji} {d.label}</button>))}</div></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1"><p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Border Luar</p><div className="flex gap-1 flex-wrap">{COLOR_SWATCHES.slice(0,10).map((c)=>(<button key={c} onClick={()=>updateCustom("borderColor",c)} className={`sm:w-6 sm:h-6 w-7 h-7 rounded-full border-2 transition-all ${customOpts.borderColor===c?"border-black scale-110":"border-gray-200"}`} style={{backgroundColor:c}}/>))}</div></div>
                  <div className="space-y-1"><p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Border Foto</p><div className="flex gap-1 flex-wrap">{COLOR_SWATCHES.slice(0,10).map((c)=>(<button key={c} onClick={()=>updateCustom("cellBorderColor",c)} className={`sm:w-6 sm:h-6 w-7 h-7 rounded-full border-2 transition-all ${customOpts.cellBorderColor===c?"border-black scale-110":"border-gray-200"}`} style={{backgroundColor:c}}/>))}</div></div>
                </div>

                {/* TEKS */}
                <div className="border-t-2 border-gray-200 pt-4 space-y-3">
                  <div className="flex items-center justify-between"><p className="font-display text-sm uppercase italic">Teks</p><label className="flex items-center gap-2 cursor-pointer"><span className="font-body text-[10px] font-bold text-gray-500">Tampilkan</span><input type="checkbox" checked={customOpts.textEnabled} onChange={(e)=>updateCustom("textEnabled",e.target.checked)} className="w-4 h-4 accent-pink-500"/></label></div>
                  {customOpts.textEnabled&&(<div className="space-y-3">
                    <div className="flex gap-2"><input type="text" value={customOpts.text} onChange={(e)=>updateCustom("text",e.target.value)} placeholder="Ketik teks..." className="flex-1 px-3 py-1.5 text-xs border-2 border-black rounded-lg font-display font-bold uppercase outline-none"/>
                      <div className="relative"><button onClick={()=>setShowTrendy((p)=>!p)} className="px-3 py-1.5 text-xs border-2 border-black rounded-lg font-bold bg-white hover:bg-gray-100">💡</button>{showTrendy&&<div className="absolute right-0 top-full mt-1 w-56 bg-white border-2 border-black rounded-xl p-2 grid grid-cols-3 gap-1 z-20 shadow-[4px_4px_0_#000]">{TRENDY_TEXTS.map((t)=>(<button key={t} onClick={()=>{updateCustom("text",t);setShowTrendy(false);}} className="text-[8px] font-bold px-1 py-1 bg-gray-100 rounded hover:bg-pink-100 transition-colors uppercase">{t}</button>))}<button onClick={()=>setShowTrendy(false)} className="col-span-3 text-[9px] font-bold text-gray-400 hover:text-gray-600 pt-1 border-t border-gray-200 mt-1">✕ Tutup</button></div>}</div>
                    </div>

                    <div className="space-y-1"><p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Font</p>
                      <div className="flex gap-1.5 flex-wrap">{FONT_OPTIONS.map((fo)=>{const active=customOpts.textFont===fo.id;const s:Record<string,string>={bold:"font-bold",playful:"font-display italic",elegant:"italic font-serif",compact:"font-semibold tracking-tight",classic:"font-serif",funky:"font-black uppercase",cute:"font-display",retro:"font-mono",graffiti:"font-black italic uppercase",minimal:"font-light"};return(
                        <button key={fo.id} onClick={()=>updateCustom("textFont",fo.id)}
                          className={`px-2.5 py-1 text-[10px] border-2 rounded-lg font-bold transition-all ${active?"bg-black text-white border-black":"bg-white text-gray-600 border-gray-300 hover:border-gray-400"} ${s[fo.id]}`}>{fo.label}</button>
                      );})}</div>
                    </div>

                    <div className="space-y-1"><p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Bentuk Badge</p>
                      <div className="flex gap-1.5 flex-wrap">{SHAPE_OPTIONS.map((so)=>{const active=customOpts.textShape===so.id;return(
                        <button key={so.id} onClick={()=>updateCustom("textShape",so.id)}
                          className={`px-2.5 py-1 text-xs border-2 rounded-lg font-bold transition-all ${active?"bg-black text-white border-black":"bg-white text-gray-600 border-gray-300 hover:border-gray-400"}`}>{so.emoji} {so.label}</button>
                      );})}</div>
                    </div>

                    <div className="space-y-1"><p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Posisi Teks</p>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">{TEXT_POSITIONS.map((tp)=>{const active=customOpts.textPosition===tp.id;return(
                        <button key={tp.id} onClick={()=>updateCustom("textPosition",tp.id)} className={`px-2 py-1 text-[9px] border-2 rounded-lg font-bold transition-all ${active?"bg-black text-white border-black":"bg-white text-gray-600 border-gray-300 hover:border-gray-400"}`}>{tp.label}</button>
                      );})}</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="space-y-1"><p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Warna Teks</p><div className="flex gap-1 flex-wrap">{["#fff","#000","#ef4444","#f97316","#eab308","#22c55e","#06b6d4","#3b82f6","#8b5cf6","#ec4899"].map((c)=>(<button key={c} onClick={()=>updateCustom("textColor",c)} className={`sm:w-6 sm:h-6 w-7 h-7 rounded-full border-2 transition-all ${customOpts.textColor===c?"border-black scale-110":"border-gray-200"}`} style={{backgroundColor:c}}/>))}</div></div>
                      <div className="space-y-1"><p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">BG Teks</p><div className="flex gap-1 flex-wrap">{["#fff","#000","#ef4444","#f97316","#eab308","#22c55e","#06b6d4","#3b82f6","#8b5cf6","#ec4899"].map((c)=>(<button key={c} onClick={()=>updateCustom("textBg",c)} className={`sm:w-6 sm:h-6 w-7 h-7 rounded-full border-2 transition-all ${customOpts.textBg===c?"border-black scale-110":"border-gray-200"}`} style={{backgroundColor:c}}/>))}</div></div>
                      <div className="space-y-1"><p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Shadow</p><div className="flex gap-1 flex-wrap">{["#000","#fff","#ef4444","#3b82f6","#8b5cf6","#ec4899","transparent"].map((c)=>(<button key={c} onClick={()=>updateCustom("textShadow",c)} className={`sm:w-6 sm:h-6 w-7 h-7 rounded-full border-2 transition-all ${customOpts.textShadow===c?"border-black scale-110":"border-gray-200"}`} style={{backgroundColor:c==="transparent"?"#ccc":c}}/>))}</div></div>
                      <div className="space-y-1"><p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Opacity {customOpts.textOpacity}%</p><input type="range" min={20} max={100} value={customOpts.textOpacity} onChange={(e)=>updateCustom("textOpacity",Number(e.target.value))} className="w-full accent-pink-500"/></div>
                    </div>

                    {(customOpts.textShape==="rounded"||customOpts.textShape==="pill")&&(
                      <div className="flex items-center gap-3 flex-wrap">
                        <label className="flex items-center gap-2 cursor-pointer"><span className="font-body text-[10px] font-bold text-gray-500">Gradient BG</span><input type="checkbox" checked={customOpts.textBgGrad} onChange={(e)=>updateCustom("textBgGrad",e.target.checked)} className="w-4 h-4 accent-pink-500"/></label>
                        {customOpts.textBgGrad&&<div className="flex items-center gap-2"><span className="font-body text-[9px] font-bold text-gray-400">Warna 2:</span><div className="flex gap-1 flex-wrap">{["#333","#fff","#ef4444","#f97316","#eab308","#22c55e","#06b6d4","#3b82f6","#8b5cf6","#ec4899"].map((c)=>(<button key={c} onClick={()=>updateCustom("textBg2",c)} className={`sm:w-5 sm:h-5 w-6 h-6 rounded-full border-2 transition-all ${customOpts.textBg2===c?"border-black scale-110":"border-gray-200"}`} style={{backgroundColor:c}}/>))}</div></div>}
                      </div>
                    )}
                  </div>)}
                </div>

                {/* EMOJI / STIKER */}
                <div className="border-t-2 border-gray-200 pt-4 space-y-3">
                  <div className="flex items-center gap-2"><Sticker className="w-4 h-4"/><p className="font-display text-sm uppercase italic">Emoji / Stiker</p></div>

                  {customOpts.selectedEmoji&&(
                    <div className="bg-pink-50 border-2 border-pink-400 rounded-xl p-3 text-center">
                      <p className="font-body text-xs font-bold text-pink-700 flex items-center justify-center gap-1"><Pointer className="w-3.5 h-3.5"/> Klik di canvas untuk tempatkan {customOpts.selectedEmoji}</p>
                      <button onClick={()=>updateCustom("selectedEmoji",null)} className="mt-1 text-[10px] font-bold text-pink-500 hover:text-pink-600 underline">Batal</button>
                    </div>
                  )}

                  {customOpts.emojis.length>0&&(
                    <div className="space-y-2">
                      <div className="flex items-center justify-between"><p className="font-body text-[9px] font-bold text-gray-400 uppercase">Dipasang ({customOpts.emojis.length})</p><button onClick={()=>{updateCustom("emojis",[]);setEditEmojiIdx(null);}} className="text-[9px] font-bold text-red-500 hover:text-red-600 uppercase">Hapus semua</button></div>
                      <div className="flex flex-col gap-2">
                        {customOpts.emojis.map((e,i)=>(
                          <div key={e.id} className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 p-2">
                            <span className="text-xl w-8 text-center">{e.emoji}</span>
                            <button onClick={()=>setEditEmojiIdx(editEmojiIdx===i?null:i)} className="text-[9px] font-bold text-gray-500 hover:text-black underline">{editEmojiIdx===i?"Sembunyi":"Atur"}</button>
                            <button onClick={()=>removeEmoji(i)} className="ml-auto text-red-400 hover:text-red-600"><X className="w-3.5 h-3.5"/></button>
                          </div>
                        ))}
                      </div>
                      {editEmojiIdx!==null&&customOpts.emojis[editEmojiIdx]&&(
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2">
                          <p className="font-body text-[9px] font-bold text-gray-500 uppercase">Posisi: {customOpts.emojis[editEmojiIdx].emoji}</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2"><span className="text-[10px] font-bold text-gray-500 w-4">X:</span><input type="range" min={0} max={100} value={customOpts.emojis[editEmojiIdx].x} onChange={(e)=>updateEmojiPos(editEmojiIdx,"x",Number(e.target.value))} className="flex-1 accent-pink-500"/><span className="text-[10px] font-bold text-gray-400 w-8 text-right">{customOpts.emojis[editEmojiIdx].x}%</span></div>
                            <div className="flex items-center gap-2"><span className="text-[10px] font-bold text-gray-500 w-4">Y:</span><input type="range" min={0} max={100} value={customOpts.emojis[editEmojiIdx].y} onChange={(e)=>updateEmojiPos(editEmojiIdx,"y",Number(e.target.value))} className="flex-1 accent-pink-500"/><span className="text-[10px] font-bold text-gray-400 w-8 text-right">{customOpts.emojis[editEmojiIdx].y}%</span></div>
                            <div className="flex items-center gap-2 col-span-2"><span className="text-[10px] font-bold text-gray-500">Ukuran:</span><input type="range" min={12} max={64} value={customOpts.emojis[editEmojiIdx].size} onChange={(e)=>updateEmojiPos(editEmojiIdx,"size",Number(e.target.value))} className="flex-1 accent-pink-500"/><span className="text-[10px] font-bold text-gray-400 w-8 text-right">{customOpts.emojis[editEmojiIdx].size}px</span></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-1"><p className="font-body text-[10px] font-bold uppercase tracking-wider text-gray-500">Pilih & klik di canvas</p>
                    <div className="flex gap-1 border-b-2 border-gray-200 pb-1 overflow-x-auto">{EMOJI_CATEGORIES.map((cat,ci)=>(<button key={cat.name} onClick={()=>setEmojiTab(ci)} className={`px-2 py-0.5 text-xs font-bold whitespace-nowrap transition-all rounded-t ${emojiTab===ci?"text-pink-600 border-b-2 border-pink-500 -mb-[6px]":"text-gray-400 hover:text-gray-600"}`}>{cat.name}</button>))}</div>
                    <div className="flex gap-1.5 flex-wrap max-h-28 overflow-y-auto p-1">{EMOJI_CATEGORIES[emojiTab]?.items.map((em)=>(
                      <button key={em} onClick={()=>selectEmojiForPlacement(em)}
                        className={`w-9 h-9 flex items-center justify-center text-lg rounded-lg transition-colors border ${customOpts.selectedEmoji===em?"border-pink-500 bg-pink-50 ring-2 ring-pink-300":"border-gray-200 hover:bg-gray-100"}`}
                        title={em}>{em}</button>
                    ))}</div>
                  </div>
                </div>
              </div>
            )}

            {/* FILTER */}
            <div className="bg-white border-2 border-black rounded-2xl p-4 space-y-3" style={{boxShadow:"4px 4px 0 rgba(0,0,0,1)"}}>
              <div className="flex items-center gap-2"><Palette className="w-4 h-4"/><p className="font-display text-sm uppercase italic">Filter</p></div>
              <div className="flex gap-1 border-b-2 border-gray-200 pb-2">{FILTER_CATEGORIES.map((cat)=>(<button key={cat.name} onClick={()=>setFilterTab(cat.name as "Trending"|"Classic")} className={`px-3 py-1 font-body text-[10px] font-bold uppercase tracking-wider transition-all rounded-t-lg ${filterTab===cat.name?"text-pink-600 border-b-2 border-pink-500 -mb-[10px]":"text-gray-400 hover:text-gray-600"}`}>{cat.name}</button>))}</div>
              <div className="flex gap-1.5 flex-wrap">{currentFilters.map((fid)=>{const f=FILTERS.find((x)=>x.id===fid);if(!f)return null;const active=filter===f.id;return(
                <button key={f.id} onClick={()=>setFilter(f.id)} className={`px-3 py-1.5 text-xs border-2 rounded-lg font-display font-bold transition-all ${active?"bg-gradient-to-r from-purple-500 to-pink-500 text-white border-black":"bg-white text-black border-gray-300 hover:border-gray-400 hover:bg-gray-50"}`}
                  style={active?{boxShadow:"2px 2px 0 rgba(0,0,0,1)"}:{}}>{f.name}</button>
              );})}</div>
            </div>

            {(isFilmstrip&&images.length<2)&&<div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-3 text-center"><p className="font-body text-xs text-amber-700 font-bold">Film Strip butuh minimal 2 foto</p></div>}
          </div>

          {/* RIGHT — Canvas Preview */}
          <div className="flex-1 min-w-0 space-y-5 lg:sticky lg:top-4 lg:self-start">
            {/* CANVAS PREVIEW */}
            <div ref={canvasWrapRef} className="flex justify-center">
              <div className="relative inline-block" style={{boxShadow:"6px 6px 0 rgba(0,0,0,1)",cursor:customOpts.selectedEmoji?"crosshair":"default"}}>
                <canvas ref={canvasRef} onClick={handleCanvasClick} onTouchEnd={handleCanvasTouchEnd} className="w-full max-w-full h-auto border-2 border-black" style={{touchAction:customOpts.selectedEmoji?"none":"auto"}} />
              </div>
            </div>

            <button onClick={downloadPng} className="comic-btn bg-gradient-to-r from-purple-600 to-pink-600 text-white w-full text-sm flex items-center justify-center gap-2 py-3 text-base font-bold tracking-wider" style={{boxShadow:"4px 4px 0 rgba(0,0,0,1)"}}><Download className="w-5 h-5"/> DOWNLOAD PNG</button>
          </div>
        </div>
      )}

      <canvas ref={offRef} className="hidden" />
    </div>
  );
}
