/* ===================== core: helpers, i18n, sound, routing ===================== */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lerp=(a,b,t)=>a+(b-a)*t;
const ICON={
 home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
 engine:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10h3l2-3h6v3h2l2 2v5h-2v2H9l-2-2H4z"/><path d="M1 13h3M20 14h3"/></svg>',
 wrench:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8 6.2 21l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/></svg>',
 class:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 10l5-3v10l-5-3z"/><rect x="3" y="6" width="12" height="12" rx="2"/></svg>',
 progress:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
 prefs:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
 car:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 15l2-5 3-3h8l3 3 2 5v3h-2M5 18H3v-3"/><circle cx="7.5" cy="17.5" r="2"/><circle cx="16.5" cy="17.5" r="2"/></svg>',
 moto:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="5" cy="16" r="3.5"/><circle cx="19" cy="16" r="3.5"/><path d="M5 16l4-6h5l2 6M14 10l2-3h3"/></svg>',
 jet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 13l8-2 4-7h2l-2 7 6 1v2l-6 1 2 7h-2l-4-7-8-2z"/></svg>',
 boat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 15h15l3-4H6zM8 11V6h6v5M2 19c2 1.3 4 1.3 6 0s4-1.3 6 0 4 1.3 6 0"/></svg>',
 train:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 15c0-4 4-8 10-8h8a2 2 0 0 1 2 2v6z"/><path d="M2 15h20M6 19l-2 2M18 19l2 2M7 11h4"/></svg>',
 heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/><path d="M9 4.5V2M14 4V2"/></svg>',
 plant:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21V11M12 13c-5 0-7-3-7-8 5 0 7 3 7 8zM12 11c0-4 2-6 7-6 0 4-2 6-7 6z"/></svg>',
 electro:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M9 4v11M15 4v11M9 4h6"/></svg>',
 motor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h5v12H3zM16 6h5v12h-5z"/><rect x="9.5" y="8" width="5" height="8" rx="1"/><path d="M12 3v5M12 16v5"/></svg>',
 orbit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="5"/><circle cx="21" cy="10.5" r="1.4" fill="currentColor"/></svg>',
 flask:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3h6M10 3v6L4.5 19A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.5-2L14 9V3"/><path d="M7 15h10"/></svg>',
 search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>',
 book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/></svg>',
 cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M7 14h3M7 17h6"/></svg>',
 trophy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4.5a3 3 0 0 0 3.5 4M16 6h3.5a3 3 0 0 1-3.5 4M12 13v4M8 21h8M9.5 17h5"/></svg>',
 chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>',
 lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
 check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.6 2.5L16 9.5"/></svg>',
 clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
 star:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
 arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 6l6 6-6 6"/></svg>',
 atom:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-60 12 12)"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>',
 play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z"/></svg>',
 pause:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
 back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 5l-7 7 7 7"/></svg>',
 sound:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>',
 mute:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>',
 mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
 hand:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 13V5a1.5 1.5 0 0 1 3 0v6M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V5.5a1.5 1.5 0 0 1 3 0V14c0 4-2.5 7-6.5 7S5 18 4 15l-1.5-3.5a1.5 1.5 0 0 1 2.6-1.5L8 13"/></svg>',
 phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 15c5-5 13-5 18 0l-2 3-4-1v-3c-2-.6-4-.6-6 0v3l-4 1z"/></svg>'
};

/* ---------- i18n (English + Bahasa Melayu) ---------- */
let lang="en";
const T_MS={tagline:"Jantung, tumbuhan, sel elektrolisis, motor dan sistem suria dalam 3D dan realiti maya. Lihat, cuba dan siasat sendiri.",sid:"ID pelajar",language:"Bahasa",useOn:"Guna SainsLab pada",mPhone:"Telefon",mPhoneS:"VR dengan kotak Cardboard",mDesk:"Komputer riba / PC",mDeskS:"Paparan kelas dan makmal",signIn:"Log masuk",privacy:"Sensor gerakan telefon hanya digunakan untuk VR pada peranti anda. Markah dikongsi dengan pensyarah anda.",morning:"Selamat pagi",library:"Model sains",
 notes:"Nota",explore:"Teroka",sim:"Simulasi",shop:"Makmal",fix:"Siasat",quiz:"Kuiz"};
const T_EN={};$$("[data-i18n]").forEach(e=>T_EN[e.dataset.i18n]=e.textContent);
Object.assign(T_EN,{notes:"Notes",explore:"Explore",sim:"Simulate",shop:"Lab",fix:"Investigate",quiz:"Quiz"});
const tr=k=>(lang==="ms"&&T_MS[k])||T_EN[k]||k;
function applyLang(){document.documentElement.lang=lang;$$("[data-i18n]").forEach(e=>e.textContent=tr(e.dataset.i18n));
  $$("[data-langs]").forEach(b=>b.innerHTML=[["en","English"],["ms","Bahasa Melayu"]].map(([c,n])=>`<button aria-pressed="${c===lang}" data-lang="${c}">${n}</button>`).join(""));
  if(current&&ENG_TABS.includes(curTab)&&current==="engine")renderTabs()}
document.addEventListener("click",e=>{const b=e.target.closest("[data-lang]");if(b){lang=b.dataset.lang;applyLang()}});

/* ---------- toast + dialog ---------- */
let tt;function toast(m){$("#toastTxt").textContent=m;$("#toast").classList.add("show");clearTimeout(tt);tt=setTimeout(()=>$("#toast").classList.remove("show"),2600)}
function dialog(html){$("#dialog").innerHTML=html;$("#scrim").classList.add("show");const f=$("#dialog button");if(f)f.focus()}
function closeDialog(){$("#scrim").classList.remove("show")}
$("#scrim").addEventListener("click",e=>{if(e.target.id==="scrim")closeDialog()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeDialog()});

/* ===================== sound (Web Audio + speech) ===================== */
const SND={ctx:null,master:null,on:true,vol:.55,noiseBuf:null};
function actx(){
  if(!SND.ctx){try{SND.ctx=new (window.AudioContext||window.webkitAudioContext)();SND.master=SND.ctx.createGain();SND.master.gain.value=SND.on?SND.vol:0;SND.master.connect(SND.ctx.destination);
    const n=SND.ctx.sampleRate*2,b=SND.ctx.createBuffer(1,n,SND.ctx.sampleRate),d=b.getChannelData(0);let last=0;for(let i=0;i<n;i++){const w=Math.random()*2-1;last=(last+.02*w)/1.02;d[i]=w*.5+last*3}SND.noiseBuf=b}catch(e){SND.ctx=null}}
  if(SND.ctx&&SND.ctx.state==="suspended")SND.ctx.resume().catch(()=>{});
  return SND.ctx}
document.addEventListener("pointerdown",()=>actx(),{capture:true});
function setSound(on){SND.on=on;if(SND.master)SND.master.gain.setTargetAtTime(on?SND.vol:0,SND.ctx.currentTime,.05);if(!on)try{speechSynthesis.cancel()}catch(e){}
  $$("[data-soundbtn]").forEach(b=>{b.setAttribute("aria-pressed",on);b.innerHTML=(on?ICON.sound:ICON.mute)+(b.dataset.soundbtn==="label"?`<span>${on?"Sound on":"Sound off"}</span>`:"")});
  const st=$("#soundTop");if(st){st.textContent=on?"Sound on":"Sound off";st.setAttribute("aria-pressed",on)}}
$("#soundTop").onclick=()=>setSound(!SND.on);
document.addEventListener("click",e=>{const b=e.target.closest("[data-soundbtn]");if(b){setSound(!SND.on);toast(SND.on?"Sound on":"Sound off")}});

/* procedural engine sound: piston | turbine | electric | outboard */
class EngineSound{
  constructor(type){const c=actx();this.type=type;this.ok=!!c;if(!c)return;this.c=c;const g=this.out=c.createGain();g.gain.value=0;g.connect(SND.master);this.nodes=[];
    const noise=()=>{const s=c.createBufferSource();s.buffer=SND.noiseBuf;s.loop=true;s.start();this.nodes.push(s);return s};
    if(type==="piston"||type==="outboard"){
      this.o1=c.createOscillator();this.o1.type="sawtooth";this.o2=c.createOscillator();this.o2.type="square";const g2=c.createGain();g2.gain.value=.35;
      this.ws=c.createWaveShaper();const k=new Float32Array(256);for(let i=0;i<256;i++){const x=i/128-1;k[i]=Math.tanh(2.2*x)}this.ws.curve=k;
      this.lp=c.createBiquadFilter();this.lp.type="lowpass";this.lp.Q.value=4;
      this.am=c.createGain();this.am.gain.value=1;
      this.o1.connect(this.ws);this.o2.connect(g2).connect(this.ws);this.ws.connect(this.lp).connect(this.am).connect(g);
      const n=noise(),bp=c.createBiquadFilter();bp.type="bandpass";bp.frequency.value=900;bp.Q.value=.7;this.ng=c.createGain();this.ng.gain.value=.05;n.connect(bp).connect(this.ng).connect(g);
      if(type==="outboard"){const n2=noise(),lp2=c.createBiquadFilter();lp2.type="lowpass";lp2.frequency.value=500;this.wg=c.createGain();this.wg.gain.value=.0;n2.connect(lp2).connect(this.wg).connect(g)}
      this.o1.start();this.o2.start();this.nodes.push(this.o1,this.o2);
    }else if(type==="turbine"){
      const n=noise();this.bp=c.createBiquadFilter();this.bp.type="bandpass";this.bp.Q.value=.6;this.ng=c.createGain();n.connect(this.bp).connect(this.ng).connect(g);
      const n2=noise(),lp=c.createBiquadFilter();lp.type="lowpass";lp.frequency.value=140;this.rg=c.createGain();n2.connect(lp).connect(this.rg).connect(g);
      this.w1=c.createOscillator();this.w1.type="sine";this.w2=c.createOscillator();this.w2.type="triangle";this.wg=c.createGain();this.wg.gain.value=.04;
      this.w1.connect(this.wg);this.w2.connect(this.wg);this.wg.connect(g);this.w1.start();this.w2.start();this.nodes.push(this.w1,this.w2);
    }else if(type==="water"){
      const n=noise(),lp=c.createBiquadFilter();lp.type="lowpass";lp.frequency.value=420;this.ng=c.createGain();this.ng.gain.value=.05;n.connect(lp).connect(this.ng).connect(g);
      this.hum=c.createOscillator();this.hum.type="sine";this.hum.frequency.value=50;this.hg=c.createGain();this.hg.gain.value=0;this.hum.connect(this.hg).connect(g);this.hum.start();this.nodes.push(this.hum);
    }else if(type==="whine"){
      this.o1=c.createOscillator();this.o1.type="sawtooth";this.o2=c.createOscillator();this.o2.type="triangle";this.bp=c.createBiquadFilter();this.bp.type="bandpass";this.bp.Q.value=2;this.vg=c.createGain();this.vg.gain.value=.05;
      this.o1.connect(this.bp);this.o2.connect(this.bp);this.bp.connect(this.vg).connect(g);
      const n=noise(),hp=c.createBiquadFilter();hp.type="highpass";hp.frequency.value=2500;this.ng=c.createGain();this.ng.gain.value=0;n.connect(hp).connect(this.ng).connect(g);
      this.o1.start();this.o2.start();this.nodes.push(this.o1,this.o2);
    }else if(type==="space"){
      this.o1=c.createOscillator();this.o1.type="sine";this.o1.frequency.value=55;this.o2=c.createOscillator();this.o2.type="sine";this.o2.frequency.value=82.7;this.o3=c.createOscillator();this.o3.type="triangle";this.o3.frequency.value=110.4;
      this.lfo=c.createOscillator();this.lfo.frequency.value=.08;const lg=c.createGain();lg.gain.value=.03;this.vg=c.createGain();this.vg.gain.value=.06;this.lfo.connect(lg).connect(this.vg.gain);
      [this.o1,this.o2,this.o3].forEach(o=>o.connect(this.vg));this.vg.connect(g);[this.o1,this.o2,this.o3,this.lfo].forEach(o=>{o.start();this.nodes.push(o)});
    }else if(type==="none"){
    }else if(type==="electric"){
      this.o1=c.createOscillator();this.o1.type="square";this.o2=c.createOscillator();this.o2.type="sawtooth";this.vg=c.createGain();this.vg.gain.value=.05;
      const bp=c.createBiquadFilter();bp.type="bandpass";bp.frequency.value=1200;bp.Q.value=.5;this.o1.connect(bp);this.o2.connect(bp);bp.connect(this.vg).connect(g);
      this.hum=c.createOscillator();this.hum.type="sine";this.hum.frequency.value=120;this.hg=c.createGain();this.hg.gain.value=.05;this.hum.connect(this.hg).connect(g);
      const n=noise(),lp=c.createBiquadFilter();lp.type="lowpass";lp.frequency.value=700;this.rg=c.createGain();this.rg.gain.value=0;n.connect(lp).connect(this.rg).connect(g);
      this.o1.start();this.o2.start();this.hum.start();this.nodes.push(this.o1,this.o2,this.hum);
    }
  }
  set(p){if(!this.ok)return;const t=this.c.currentTime,s=(n,v)=>n.setTargetAtTime(v,t,.06);
    s(this.out.gain,p.vol==null?.6:p.vol);
    if(this.type==="piston"||this.type==="outboard"){const f=Math.max(8,p.f);s(this.o1.frequency,f);s(this.o2.frequency,f/2);s(this.lp.frequency,180+f*7+p.load*900);s(this.ng.gain,.03+p.load*.08);
      s(this.am.gain,p.miss?(.55+.45*Math.abs(Math.sin(t*f/4))):1);if(this.wg)s(this.wg.gain,p.water||0)}
    if(this.type==="turbine"){s(this.bp.frequency,250+p.n1*14);s(this.ng.gain,.08+p.n1/100*.5);s(this.rg.gain,.05+p.n1/100*.35);s(this.w1.frequency,300+p.n2*22);s(this.w2.frequency,600+p.n2*41);s(this.wg.gain,.015+p.n2/100*.05)}
    if(this.type==="water"){s(this.ng.gain,.02+(p.flow||0)*.12);s(this.hg.gain,(p.hum||0)*.05)}
    if(this.type==="whine"){const f=Math.max(30,p.f||0);s(this.o1.frequency,f);s(this.o2.frequency,f*2);s(this.bp.frequency,f*2.5+200);s(this.vg.gain,p.on?(.03+.05*Math.min(1,p.load||0)):0);s(this.ng.gain,p.on?.012+(p.spark||0)*.04:0)}
    if(this.type==="space"){s(this.o3.frequency,110+(p.pitch||0)*40)}
    if(this.type==="electric"){const v=p.speed;let f;if(v<45){const steps=[340,382,429,455,510,573,643,681];f=steps[Math.min(7,Math.floor(v/45*8))]}else f=180+v*4.2;
      s(this.o1.frequency,f);s(this.o2.frequency,f*1.5);s(this.vg.gain,p.power>0.02?(.025+.05*p.power):0.004);s(this.hum.frequency,50+v*1.6);s(this.hg.gain,.02+v/320*.06);s(this.rg.gain,v/320*.4)}}
  stop(){if(!this.ok)return;try{this.out.gain.setTargetAtTime(0,this.c.currentTime,.05);setTimeout(()=>{this.nodes.forEach(n=>{try{n.stop()}catch(e){}});this.out.disconnect()},300)}catch(e){}}
}
function beep(f,dur,when=0,type="sine",vol=.18){const c=actx();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=f;g.gain.value=0;o.connect(g).connect(SND.master);const t=c.currentTime+when;g.gain.setTargetAtTime(vol,t,.01);g.gain.setTargetAtTime(0,t+dur,.03);o.start(t);o.stop(t+dur+.3)}
function thump(kind,vol=.5){const c=actx();if(!c||!SND.on)return;const o=c.createOscillator(),g=c.createGain(),lp=c.createBiquadFilter();lp.type="lowpass";lp.frequency.value=kind===2?260:180;o.type="sine";const f=kind===2?72:52,t=c.currentTime;o.frequency.setValueAtTime(f*1.6,t);o.frequency.exponentialRampToValueAtTime(f,t+.06);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol*(kind===2?.7:1),t+.012);g.gain.exponentialRampToValueAtTime(.001,t+(kind===2?.12:.16));o.connect(lp).connect(g).connect(SND.master);o.start(t);o.stop(t+.25)}
function pop(vol=.12){const c=actx();if(!c||!SND.on)return;const o=c.createOscillator(),g=c.createGain(),t=c.currentTime,f=500+Math.random()*700;o.type="sine";o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*2.2,t+.05);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+.07);o.connect(g).connect(SND.master);o.start(t);o.stop(t+.1)}
function ringTone(times){for(let i=0;i<times;i++){const b=i*2.2;[0,.55].forEach(d=>{beep(400,.4,b+d,"sine",.12);beep(450,.4,b+d,"sine",.12)})}}
function chime(){beep(660,.18,0,"sine",.15);beep(880,.25,.18,"sine",.15)}
let VOICES=[];function loadVoices(){try{VOICES=speechSynthesis.getVoices()}catch(e){}}loadVoices();try{speechSynthesis.onvoiceschanged=loadVoices}catch(e){}
function pickVoice(kind){const en=VOICES.filter(v=>/^en/i.test(v.lang));const fem=en.find(v=>/female|samantha|zira|susan|karen|moira|tessa|serena|google uk english female|victoria|fiona/i.test(v.name));const mal=en.find(v=>/male|daniel|alex|david|fred|google uk english male|arthur|rishi/i.test(v.name)&&!/female/i.test(v.name));
  return kind==="f"?(fem||en[0]):(mal||en[1]||en[0])}
function say(text,{who="f",rate=1,lang:l="en-GB",onend}={}){
  if(!SND.on||!("speechSynthesis" in window)){if(onend)setTimeout(onend,Math.max(1800,text.length*55));return false}
  try{const u=new SpeechSynthesisUtterance(text);const v=pickVoice(who);if(v)u.voice=v;u.lang=l;u.rate=rate;u.pitch=who==="f"?1.08:.92;let done=false;const fin=()=>{if(!done){done=true;onend&&onend()}};
    u.onend=fin;u.onerror=fin;setTimeout(fin,Math.max(2500,text.length*95));speechSynthesis.speak(u);return true}catch(e){if(onend)setTimeout(onend,2000);return false}}
function hush(){try{speechSynthesis.cancel()}catch(e){}}

/* ===================== routing ===================== */
const ENGINE_IDS=["heart","plant","electro","motor","orbit","car","moto","jet","boat","train"],ENG_TABS=["notes","explore","sim","shop","fix","quiz"],TABKEY={notes:"notes",explore:"",sim:"sim",shop:"lab",fix:"inv",quiz:"quiz"};
let current="",curEngine="heart",curTab="explore",DESK=false;
const enterHooks={},leaveHooks={};
function parseRoute(r){const [a,b]=(r||"").split("-");if(ENGINE_IDS.includes(a)){const tab=Object.keys(TABKEY).find(k=>TABKEY[k]===(b||""))||"explore";return{view:"engine",eng:a,tab}}return{view:r||"signin"}}
function go(r){const R=parseRoute(r);if(!$("#v-"+R.view)){R.view="signin"}
  if(current&&leaveHooks[current])leaveHooks[current](R);
  $$(".view").forEach(v=>v.classList.toggle("on",v.id==="v-"+R.view));
  const prev=current;current=R.view;if(R.eng){curEngine=R.eng;curTab=R.tab}
  document.body.classList.toggle("at-signin",R.view==="signin");
  const route=R.view==="engine"?(curEngine+(TABKEY[curTab]?"-"+TABKEY[curTab]:"")):R.view;
  if(location.hash!=="#"+route)history.replaceState(null,"","#"+route);
  markNav(route);
  $("#crumb").textContent=R.view==="engine"?ENGINES[curEngine].vehicle+" · "+tr(curTab):({home:"Home",planner:"Planner",quests:"Quests",class:"VR class",progress:"Progress",prefs:"Preferences",signin:"Sign in"})[R.view]||"";
  if(enterHooks[R.view])enterHooks[R.view](R,prev);
}
function markNav(route){const R=parseRoute(route);
  $$("[data-go]").forEach(b=>{if(!b.closest(".tabbar,.nav,.side"))return;const g=b.dataset.go,G=parseRoute(g);let on=g===route;
    if(b.closest(".tabbar")){on=g==="@engine"?R.view==="engine":(G.view===R.view&&!G.eng)}
    if(b.closest(".side")&&G.eng)on=R.view==="engine"&&G.eng===R.eng;
    b.setAttribute("aria-current",on)})}
document.addEventListener("click",e=>{const b=e.target.closest("[data-go]");if(b){e.preventDefault();let g=b.dataset.go;if(g==="@engine")g=curEngine;if(g==="@shop")g=curEngine+"-lab";go(g)}});
window.addEventListener("hashchange",()=>{const h=location.hash.slice(1);const R=parseRoute(h);if(R.view==="engine"?!(R.eng===curEngine&&R.tab===curTab&&current==="engine"):R.view!==current)go(h)});
document.addEventListener("click",e=>{const b=e.target.closest("[data-toast]");if(b)toast(b.dataset.toast)});
document.addEventListener("click",e=>{const s=e.target.closest(".switch");if(s&&!s.dataset.own)s.setAttribute("aria-checked",s.getAttribute("aria-checked")!=="true")});

/* ---------- phone / laptop ---------- */
function setMode(m,silent){DESK=m==="desk";document.body.classList.toggle("desk",DESK);
  $$('[data-mode][role="radio"]').forEach(b=>b.setAttribute("aria-checked",b.dataset.mode===m));
  try{localStorage.setItem("sains-mode",m)}catch(e){}
  if(silent)return;window.dispatchEvent(new Event("resize"));toast(DESK?"Laptop / PC view":"Phone view")}
document.addEventListener("click",e=>{const b=e.target.closest("[data-mode]");if(b)setMode(b.dataset.mode)});
