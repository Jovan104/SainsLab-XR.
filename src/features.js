/* ===================== app features ===================== */
const ART={ // small line drawings for the library cards
 heart:`<svg viewBox="0 0 250 132"><g fill="none" stroke-width="2.2"><path d="M125 112s-44-26-44-58a24 24 0 0 1 44-13 24 24 0 0 1 44 13c0 32-44 58-44 58z" stroke="#E63946" fill="#E63946" fill-opacity=".14"/><path d="M125 41v66" stroke="#B8414D"/><path d="M110 30V12M140 30V8c0-6 14-6 14 4" stroke="#E63946"/><path d="M96 30V14" stroke="#3A6BD8"/><path d="M30 70h40l8-18 10 34 8-16h18" stroke="#2A9D8F"/><path d="M154 70h18l8-14 10 26 8-12h22" stroke="#2A9D8F"/></g></svg>`,
 plant:`<svg viewBox="0 0 250 132"><g fill="none" stroke-width="2"><path d="M86 30h56v86a6 6 0 0 1-6 6H92a6 6 0 0 1-6-6z" stroke="#5B7088"/><path d="M88 54h52" stroke="#3A86FF" stroke-dasharray="4 3"/><path d="M98 100l16-38 16 38z" stroke="#9AA6B2"/><rect x="109" y="22" width="10" height="42" rx="5" stroke="#9AA6B2"/><path d="M114 116c-4-12 4-20 0-34M110 100l-8-6M118 92l8-6M112 108l-8-4" stroke="#43A047"/>${[0,1,2,3].map(i=>`<circle cx="${114+(i%2?2:-2)}" cy="${60-i*9}" r="2.6" stroke="#2A9D8F"/>`).join("")}<circle cx="200" cy="44" r="12" stroke="#F4B400"/>${[0,1,2,3,4].map(i=>`<path d="M${186-i*1} ${48+i*8}L${150} ${60+i*6}" stroke="#F4D35E" stroke-dasharray="3 4"/>`).join("")}<path d="M200 56v58M186 114h28" stroke="#5B7088"/></g></svg>`,
 electro:`<svg viewBox="0 0 250 132"><g fill="none" stroke-width="2"><path d="M70 50h110v60a8 8 0 0 1-8 8H78a8 8 0 0 1-8-8z" stroke="#5B7088"/><rect x="72" y="66" width="106" height="50" fill="#3A86FF" fill-opacity=".2" stroke="none"/><rect x="98" y="30" width="10" height="72" stroke="#B87333" fill="#B87333" fill-opacity=".3"/><rect x="142" y="30" width="10" height="72" stroke="#9AA6B2"/><path d="M103 30V14h90v20M147 30V20h30" stroke="#F4B400"/><rect x="186" y="34" width="26" height="18" stroke="#5B7088"/>${[0,1,2,3].map(i=>`<circle cx="${156+(i%2)*4}" cy="${92-i*10}" r="2.5" stroke="#BFF3FA"/>`).join("")}<circle cx="120" cy="88" r="3" fill="#3A86FF" stroke="none"/><circle cx="130" cy="76" r="3" fill="#F4D35E" stroke="none"/></g></svg>`,
 motor:`<svg viewBox="0 0 250 132"><g fill="none" stroke-width="2"><rect x="56" y="34" width="26" height="60" fill="#D93A2E" fill-opacity=".25" stroke="#D93A2E"/><rect x="168" y="34" width="26" height="60" fill="#3A6BD8" fill-opacity=".25" stroke="#3A6BD8"/><path d="M104 40h42v48h-42z" stroke="#C27A3A" stroke-width="3"/>${[0,1,2].map(i=>`<path d="M86 ${46+i*18}h78" stroke="#C77DFF" stroke-dasharray="3 5"/>`).join("")}<path d="M104 64v-26M146 64v26" stroke="#52B788" stroke-width="3"/><path d="M98 44l6-8 6 8M140 84l6 8 6-8" stroke="#52B788"/><path d="M125 88v20" stroke="#9AA6B2"/><circle cx="125" cy="112" r="7" stroke="#D8A24A"/></g></svg>`,
 orbit:`<svg viewBox="0 0 250 132"><g fill="none" stroke-width="2"><ellipse cx="125" cy="66" rx="100" ry="40" stroke="#5B7088" stroke-dasharray="4 4"/><ellipse cx="125" cy="66" rx="62" ry="24" stroke="#5B7088"/><path d="M110 66L172 58A62 24 0 0 1 180 76z" fill="#2A9D8F" fill-opacity=".25" stroke="none"/><circle cx="110" cy="66" r="13" fill="#FFC94A" stroke="#F4A261"/><circle cx="182" cy="76" r="6" fill="#3A86FF" stroke="none"/><circle cx="34" cy="58" r="9" fill="#D9B38C" stroke="none"/></g></svg>`,
 car:`<svg viewBox="0 0 250 132"><g fill="none" stroke-width="2"><rect x="60" y="40" width="120" height="58" rx="6" stroke="#5B7088"/><rect x="66" y="22" width="108" height="20" rx="4" stroke="#5B7088"/>${[0,1,2,3].map(i=>`<rect x="${74+i*25}" y="${52+(i%3?18:0)}" width="18" height="14" rx="2" stroke="#0AA5B5" fill="#0AA5B5" fill-opacity=".25"/><line x1="${83+i*25}" y1="${66+(i%3?18:0)}" x2="${83+i*25}" y2="104" stroke="#8BA0B5"/>`).join("")}<path d="M66 110h108" stroke="#8BA0B5" stroke-width="5"/><path d="M180 60c20 0 26 10 40 10" stroke="#FF5A1F"/><path d="M60 50c-20 0-26-8-40-8" stroke="#0AA5B5"/></g></svg>`,
 moto:`<svg viewBox="0 0 250 132"><g fill="none" stroke-width="2"><g transform="rotate(-70 118 74)"><rect x="98" y="30" width="40" height="52" stroke="#5B7088"/>${[0,1,2,3,4,5].map(i=>`<line x1="88" x2="148" y1="${36+i*8}" y2="${36+i*8}" stroke="#5B7088"/>`).join("")}<rect x="104" y="58" width="28" height="16" fill="#0AA5B5" fill-opacity=".3" stroke="#0AA5B5"/></g><circle cx="120" cy="96" r="22" stroke="#8BA0B5"/><circle cx="168" cy="98" r="12" stroke="#FF5A1F"/><circle cx="200" cy="98" r="9" stroke="#FF5A1F"/><path d="M168 86l32 3M168 110l32-3" stroke="#FF5A1F"/></g></svg>`,
 jet:`<svg viewBox="0 0 250 132"><g fill="none" stroke-width="2"><path d="M30 34h120l50 18v28l-50 18H30z" stroke="#5B7088"/><path d="M40 34v64" stroke="#0AA5B5" stroke-width="5"/>${[0,1,2,3,4,5,6].map(i=>`<line x1="${62+i*9}" x2="${62+i*9}" y1="${50+i*1.2}" y2="${82-i*1.2}" stroke="#0AA5B5"/>`).join("")}<rect x="128" y="54" width="18" height="24" fill="#FF5A1F" fill-opacity=".35" stroke="#FF5A1F"/>${[0,1,2,3].map(i=>`<line x1="${156+i*9}" x2="${156+i*9}" y1="${50-i}" y2="${82+i}" stroke="#FF5A1F"/>`).join("")}<path d="M50 42h150M50 90h150" stroke="#2A4A66" stroke-dasharray="4 4"/></g></svg>`,
 boat:`<svg viewBox="0 0 250 132"><g fill="none" stroke-width="2"><rect x="96" y="14" width="56" height="40" rx="10" stroke="#5B7088"/><path d="M116 54v50h16V54" stroke="#5B7088"/><path d="M104 104h44l-6 12h-32z" stroke="#5B7088"/><path d="M148 110l18-12v24z" stroke="#FF5A1F"/><path d="M118 100v-46" stroke="#0AA5B5" stroke-dasharray="3 3"/><path d="M20 78c15 6 30 6 45 0s30-6 45 0 30 6 45 0 30-6 45 0 30 6 45 0" stroke="#3C8DFF"/></g></svg>`,
 train:`<svg viewBox="0 0 250 132"><g fill="none" stroke-width="2"><path d="M20 26h210M120 26v12" stroke="#F5B800"/><path d="M110 38l10-10 10 10" stroke="#8BA0B5"/><path d="M30 92c0-30 30-50 70-50h120v50z" stroke="#5B7088"/><rect x="70" y="96" width="34" height="14" stroke="#F5B800"/><rect x="140" y="96" width="34" height="14" stroke="#F5B800"/><circle cx="80" cy="114" r="8" stroke="#8BA0B5"/><circle cx="104" cy="114" r="8" stroke="#8BA0B5"/><circle cx="150" cy="114" r="8" stroke="#8BA0B5"/><circle cx="174" cy="114" r="8" stroke="#8BA0B5"/><path d="M10 124h230" stroke="#5B7088"/></g></svg>`
};
const PROG={heart:{explore:1,sim:1,shop:0,fix:0,quiz:1},plant:{explore:1,sim:1,shop:1,fix:0,quiz:0},electro:{explore:1,sim:0,shop:0,fix:0,quiz:0},motor:{explore:1,sim:1,shop:0,fix:0,quiz:1},orbit:{explore:0,sim:0,shop:0,fix:0,quiz:0},car:{explore:1,sim:0,shop:0,fix:0,quiz:0},moto:{explore:0,sim:0,shop:0,fix:0,quiz:0},jet:{explore:1,sim:0,shop:0,fix:0,quiz:0},boat:{explore:0,sim:0,shop:0,fix:0,quiz:0},train:{explore:0,sim:0,shop:0,fix:0,quiz:0}};
const NSK=ENGINE_IDS.length*5;
const SUBJ=[["Biology","#2E9E5B","heart"],["Chemistry","#3A86FF","electro"],["Physics","#7B4FD6","atom"],["Engineering","#EE5A24","engine"]];
const SCOL=Object.fromEntries(SUBJ.map(([n,c])=>[n,c]));
const idsOf=sb=>ENGINE_IDS.filter(id=>ENGINES[id].subject===sb);
const QBEST={heart:100,motor:80};
const pct=id=>Math.round(Object.values(PROG[id]).reduce((a,b)=>a+b,0)/5*100);
function mark(id,k){if(!PROG[id][k]){PROG[id][k]=1;renderHome()}}

/* ---------- navigation lists ---------- */
$("#navlist").innerHTML=[["Start",[["signin","Sign in"],["home","Home and science models"],["planner","Study planner"]]],["Models",[["heart-notes","Heart · textbook notes"],["heart","Heart · explore in 3D"],["heart-sim","Heart · live simulation"],["plant-sim","Photosynthesis · simulation"],["electro-sim","Electrolysis · simulation"],["motor-sim","Electric motor · simulation"],["orbit-sim","Solar system · simulation"],["car-sim","Car engine · simulation"],["jet-sim","Jet engine · simulation"],["train-sim","Bullet train · simulation"]]],["Features",[["electro-lab","VR lab (set up apparatus)"],["heart-lab","VR dissection"],["plant-inv","Investigation"],["class","Live class with sound"],["quests","Quests, XP and badges"],["motor-quiz","Quiz"]]],["Support",[["progress","Progress passport"],["prefs","Preferences and privacy"]]]]
  .map(([g,l])=>`<li class="grp">${g}</li>`+l.map(([r,n])=>`<li><button data-go="${r}">${n}</button></li>`).join("")).join("");
$$("[data-tabs]").forEach(n=>n.innerHTML=[["home","Home","home"],["@engine","Models","book"],["planner","Planner","cal"],["quests","Quests","trophy"],["progress","Progress","progress"]].map(([g,l,i])=>`<button data-go="${g}">${ICON[i]}<span>${l}</span></button>`).join(""));
function renderSide(){const open=window.SIDEOPEN||(window.SIDEOPEN={Biology:true});
  $("#sidenav").innerHTML=`<p class="sg">Workspace</p>`+[["home","Home","home"],["planner","Study planner","cal"],["quests","Quests","trophy"],["class","Live class","class"],["progress","Progress","progress"]].map(([g,l,i])=>`<button data-go="${g}">${ICON[i]}<span>${l}</span></button>`).join("")
  +`<p class="sg">Subjects</p>`+SUBJ.map(([sb,col,ic])=>`<button class="sgrp" data-sgrp="${sb}" aria-expanded="${!!open[sb]}"><i class="dotc" style="background:${col}"></i><span>${sb}</span><span class="n">${idsOf(sb).length}</span>${ICON.chev.replace("<svg",'<svg class="cv"')}</button><div class="sgl" ${open[sb]?"":"hidden"}>${idsOf(sb).map(id=>`<button data-go="${id}">${ICON[id]}<span>${ENGINES[id].vehicle}</span></button>`).join("")}</div>`).join("")
  +`<p class="sg">You</p><button data-go="prefs">${ICON.prefs}<span>Preferences</span></button>`;
  if(typeof current!=="undefined"&&current)markNav(location.hash.slice(1))}
function openSub(sb){window.SIDEOPEN=window.SIDEOPEN||{};if(!SIDEOPEN[sb]){SIDEOPEN[sb]=true;renderSide()}}
$("#sidenav").addEventListener("click",e=>{const b=e.target.closest("[data-sgrp]");if(!b)return;const sb=b.dataset.sgrp;SIDEOPEN[sb]=!SIDEOPEN[sb];b.setAttribute("aria-expanded",SIDEOPEN[sb]);b.nextElementSibling.hidden=!SIDEOPEN[sb]});
renderSide();

/* ---------- sign in ---------- */
$("#signinBtn").onclick=()=>{toast("Signed in as M-0417");go("home")};
$("#ssoBtn").onclick=()=>{toast("DELIMa account: Jovan Maurelio");setTimeout(()=>go("home"),500)};

/* ---------- home ---------- */
function renderHome(){
  const card=id=>{const E=ENGINES[id];return `<button class="ecard" data-go="${id}"><div class="art">${ART[id]}<span class="veh">${E.subject}</span></div><div class="body"><h4 class="disp">${E.name}</h4><div class="specs">${E.specs.slice(0,3).map(s=>`<span>${s}</span>`).join("")}</div><span class="sub small">${pct(id)}% complete</span><div class="meter"><i style="width:${pct(id)}%"></i></div></div></button>`};
  $("#lib").innerHTML=["Biology","Chemistry","Physics","Engineering"].map(sb=>`<p class="libsub">${sb}</p><div class="lib">${ENGINE_IDS.filter(id=>ENGINES[id].subject===sb).map(card).join("")}</div>`).join("");
  $("#continueCards").innerHTML=[["heart-sim","The heart","Simulation · cardiac cycle","heart","var(--bad-soft)","var(--bad)"],["electro-lab","Electrolysis","VR lab · build the cell","flask","var(--cool-soft)","#1C6E64"],["plant-inv","Investigation","Photosynthesis · limiting factor","search","var(--good-soft)","var(--good)"],["quests","Quests","Earn XP and unlock badges","trophy","var(--elec-soft)","#8A6400"]]
    .map(([g,t,s,i,bg,c])=>`<button class="card mini" data-go="${g}"><span class="ic" style="background:${bg};color:${c}">${ICON[i]}</span><b>${t}</b><span class="sub small">${s}</span></button>`).join("");
  const done=ENGINE_IDS.reduce((a,id)=>a+Object.values(PROG[id]).reduce((x,y)=>x+y,0),0);$("#homeProg").textContent=`${done} of ${NSK} skills · ${XP()} XP · ${ENGINE_IDS.filter(qDone).length}/${ENGINE_IDS.length} quests`;
}
enterHooks.home=()=>renderHome();

/* ===================== model view ===================== */
const V=new Viewer($("#v3d"),{onPick:id=>onPick(id)});
const STATES={};ENGINE_IDS.forEach(id=>{if(ENGINES[id])STATES[id]=JSON.parse(JSON.stringify(ENGINES[id].S))});
let snd=null,sndTimer=null,selPart=null,panelTimer=null,AR=false;
function E(){return ENGINES[curEngine]}
function ensureLoaded(){const e=E();if(V.E!==e){e.S=STATES[curEngine];V.load(e);selPart=null;V.select(null);V.showLabels=true;$("#tLabels").setAttribute("aria-pressed","true");["tCut","tXray","tAR"].forEach(i=>$("#"+i).setAttribute("aria-pressed","false"));if(AR){AR=false;V.setAR(false)}}}
enterHooks.engine=()=>{ensureLoaded();const e=E();openSub(e.subject);$("#eTitle").textContent=e.name;$("#eSub").textContent=e.specs.join(" · ");$("#eStatusR").textContent=e.subject;
  $("#vinfo").innerHTML=`<span class="chip">${ICON[curEngine].replace("<svg",'<svg width="14" height="14"')} ${e.subject} · ${e.vehicle}</span>`;renderTabs();renderPanel();if(curTab==="explore"||curTab==="sim")mark(curEngine,curTab)};
leaveHooks.engine=(R)=>{stopSound();clearInterval(panelTimer);if(curTab==="shop")resetShop(true);if(curTab==="fix"&&FX.f)FX.f.clear(E().S)};
function renderTabs(){$("#etabs").innerHTML=ENG_TABS.map(t=>`<button role="tab" aria-selected="${t===curTab}" data-tab="${t}">${tr(t)}</button>`).join("")}
$("#etabs").addEventListener("click",e=>{const b=e.target.closest("[data-tab]");if(!b)return;if(curTab==="shop")resetShop(true);if(curTab==="fix"&&FX.f){FX.f.clear(E().S);FX.f=null}curTab=b.dataset.tab;go(curEngine+(TABKEY[curTab]?"-"+TABKEY[curTab]:""))});
$("#engPick").onclick=()=>dialog(`<h3 class="disp">Choose a model</h3><div class="plist" style="margin:8px 0 16px;max-height:60vh;overflow:auto">${SUBJ.map(([sb,col])=>`<p class="psub"><i style="width:9px;height:9px;border-radius:50%;background:${col}"></i>${sb}</p>`+idsOf(sb).map(id=>`<button data-go="${id+(TABKEY[curTab]?"-"+TABKEY[curTab]:"")}" onclick="closeDialog()" aria-current="${id===curEngine}"><i>${ICON[id].replace("<svg",'<svg width="18" height="18"')}</i><span><b>${ENGINES[id].vehicle}</b></span><span class="sub small">${pct(id)}%</span></button>`).join("")).join("")}</div><div class="row"><button class="btn line" onclick="closeDialog()">Close</button></div>`);
// viewer tools
$("#tLabels").onclick=function(){V.showLabels=this.getAttribute("aria-pressed")!=="true";this.setAttribute("aria-pressed",V.showLabels)};
$("#tCut").onclick=function(){const on=this.getAttribute("aria-pressed")!=="true";this.setAttribute("aria-pressed",on);V.setCut(on);toast(on?"Cutaway: front half removed":"Cutaway off")};
$("#tXray").onclick=function(){const on=this.getAttribute("aria-pressed")!=="true";this.setAttribute("aria-pressed",on);V.setXray(on)};
$("#tReset").onclick=()=>{V.reset();V.explode=0;const r=$("#explode");if(r)r.value=0};
$("#tAR").onclick=async function(){const want=!AR;
  if(want&&navigator.xr&&navigator.xr.isSessionSupported){try{if(await navigator.xr.isSessionSupported("immersive-ar")){toast("Starting AR: point your phone at a flat surface");}}catch(e){}}
  AR=want;this.setAttribute("aria-pressed",AR);V.setAR(AR);
  if(AR)dialog(`<h3 class="disp">AR preview</h3><p>On an Android phone with Chrome (or a headset), this places the model on your real desk using WebXR, so you can walk around it. This preview shows the model on a desk because the browser here cannot use the camera.</p><div class="row"><button class="btn primary" onclick="closeDialog()">Got it</button></div>`)};
function onPick(id){if(curTab==="shop")return shopPick(id);selPart=id;V.select(id);if(curTab!=="explore"){curTab="explore";go(curEngine)}else renderPanel()}

/* ---------- sound for the open model ---------- */
function startSound(){stopSound();const e=E();e.S._snd=true;e.S._vol=.6;if(!e.sound||!SND.on)return;snd=new EngineSound(e.sound.type);sndTimer=setInterval(()=>{if(!snd)return;const p=e.sound.params(e.S);if(e.S.paused)p.vol=0;snd.set(p)},90)}
function stopSound(){clearInterval(sndTimer);try{E().S._snd=false}catch(e){}if(snd){snd.stop();snd=null}}

/* ---------- panels ---------- */
function renderPanel(){clearInterval(panelTimer);stopSound();const e=E(),S=e.S;$("#vbottom").innerHTML="";V.only=null;
  if(curTab!=="shop")Object.values(V.parts).forEach(P=>{if(P.removed){P.removed=undefined;P.g.visible=true}});
  const inside=curTab==="sim"||curTab==="fix";if(curTab==="notes"){V.only=null}V.setCut(inside);$("#tCut").setAttribute("aria-pressed",inside);V.showLabels=!inside;$("#tLabels").setAttribute("aria-pressed",!inside);
  ({notes:panelNotes,explore:panelExplore,sim:panelSim,shop:panelShop,fix:panelFix,quiz:panelQuiz})[curTab](e,S)}
function partInfo(e){if(!selPart)return `<div class="pcard"><span class="k">Tip</span><h4>Tap any part of the model</h4><p class="sub small">Drag to rotate, pinch or scroll to zoom. Use the tools on the right to cut the model in half, see through it or place it on your desk in AR.</p></div>`;
  const P=V.parts[selPart];return `<div class="pcard" style="border-color:var(--hot)"><span class="k" style="color:var(--hot-ink)">Part ${P.n} of ${Object.keys(V.parts).length}</span><h4 class="disp" style="font-size:20px">${P.meta.n}</h4><p class="sub" style="font-size:14px">${P.meta.d}</p><div style="display:flex;gap:8px;margin-top:8px"><button class="btn line sm" id="focusBtn">Zoom to part</button><button class="btn line sm" id="soloBtn">Show only this</button></div></div>`}
function panelExplore(e){
  $("#panel").innerHTML=partInfo(e)+`<div class="pcard"><div style="display:flex;justify-content:space-between;align-items:center"><h4>Exploded view</h4><span class="sub small">Pull the parts apart</span></div><input type="range" id="explode" min="0" max="1" step=".01" value="${V.explode}" style="width:100%;accent-color:var(--hot)" aria-label="Explode parts"></div>
  <div class="pcard"><h4>What it is</h4><p class="sub" style="font-size:14px">${e.intro}</p></div>
  <div class="pcard"><h4>Parts (${Object.keys(V.parts).length})</h4><div class="plist">${Object.entries(V.parts).map(([id,P])=>`<button data-part="${id}" aria-current="${id===selPart}"><i>${String(P.n).padStart(2,"0")}</i><span>${P.meta.n}</span><span class="sub small">›</span></button>`).join("")}</div></div>
  <div class="pcard"><h4>How it works</h4><ol class="steplist">${e.how.map(h=>`<li><span>${h}</span></li>`).join("")}</ol><button class="btn hot" style="width:100%;margin-top:10px" data-go="${curEngine}-sim">${ICON.play.replace("<svg",'<svg width="18" height="18"')}Run the simulation</button></div>`;
  $("#explode").oninput=ev=>{V.explode=+ev.target.value*1.0};
  const fb=$("#focusBtn");if(fb)fb.onclick=()=>V.focus(selPart);const so=$("#soloBtn");if(so)so.onclick=function(){if(V.only){V.only=null;this.textContent="Show only this"}else{V.only=[selPart];this.textContent="Show all labels"}};
  $("#panel").querySelectorAll("[data-part]").forEach(b=>b.onclick=()=>{selPart=b.dataset.part;V.select(selPart);V.focus(selPart);renderPanel()});
}
function panelSim(e,S){if(e.sim)try{e.sim(S,1e-4)}catch(err){}
  const lay=Object.entries(e.layers);
  $("#panel").innerHTML=`<div class="pcard"><div class="playbar"><button class="btn primary sm" id="playBtn">${S.paused?ICON.play:ICON.pause}<span>${S.paused?"Play":"Pause"}</span></button>${e.step?`<button class="btn line sm" id="stepBtn">Step ${e.step}°</button>`:""}<span style="flex:1"></span><button class="btn line sm" data-soundbtn="label" aria-pressed="${SND.on}">${SND.on?ICON.sound:ICON.mute}<span>${SND.on?"Sound on":"Sound off"}</span></button></div>
    <div class="ctl" style="margin-top:12px">${e.controls.map(c=>c.type==="seg"?`<div><span class="sub small" style="font-weight:600">${c.label}</span><div class="segs" style="margin-top:4px" data-seg="${c.k}">${c.options.map(([v,l])=>`<button data-v="${v}" aria-pressed="${S[c.k]==v}">${l}</button>`).join("")}</div>${c.hint?`<p class="sub small" style="margin-top:6px" data-hint="${c.k}">${c.hint(S)}</p>`:""}</div>`
      :`<div class="row"><span>${c.label}</span><input type="range" min="${c.min}" max="${c.max}" step="${c.step||1}" value="${S[c.k]}" data-k="${c.k}" aria-label="${c.label}"><b><span data-v="${c.k}">${S[c.k]}</span>${c.unit||""}</b></div>`).join("")}</div>
    ${e.simNote?`<p class="sub small" style="margin-top:8px">${e.simNote}</p>`:""}</div>
  <div class="gauges" id="gauges"></div>
  ${e.phase?`<div class="pcard" style="margin-top:10px"><h4>${e.phase.title||"Where each cylinder is in its cycle"}</h4><div id="phase">${e.phase.svg()}</div><p class="sub small">${e.phase.note}</p></div>`:""}
  <div class="pcard" style="margin-top:10px"><h4>Flow layers</h4><div class="legend" id="legend">${lay.map(([k,[n,c]])=>`<button data-layer="${k}" aria-pressed="${V.layers[k]!==false}"><i style="background:${c}"></i>${n}</button>`).join("")}</div><p class="sub small" style="margin-top:8px">Tap a layer to hide or show it.</p></div>`;
  $("#panel").querySelectorAll("input[data-k]").forEach(r=>r.oninput=()=>{S[r.dataset.k]=+r.value;$(`[data-v="${r.dataset.k}"]`).textContent=r.value;if(e.onControl)e.onControl(S,r.dataset.k)});
  $("#panel").querySelectorAll("[data-seg]").forEach(g=>g.onclick=ev=>{const b=ev.target.closest("button");if(!b)return;const k=g.dataset.seg,v=isNaN(+b.dataset.v)?b.dataset.v:+b.dataset.v;S[k]=v;g.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));if(e.onControl)e.onControl(S,k);const c=e.controls.find(c=>c.k===k),h=$(`[data-hint="${k}"]`);if(c&&c.hint&&h)h.innerHTML=c.hint(S)});
  $("#legend").onclick=ev=>{const b=ev.target.closest("[data-layer]");if(!b)return;const k=b.dataset.layer;V.layers[k]=V.layers[k]===false;b.setAttribute("aria-pressed",V.layers[k]!==false)};
  $("#playBtn").onclick=function(){S.paused=!S.paused;this.innerHTML=(S.paused?ICON.play:ICON.pause)+`<span>${S.paused?"Play":"Pause"}</span>`};
  const sb=$("#stepBtn");if(sb)sb.onclick=()=>{S.paused=true;$("#playBtn").innerHTML=ICON.play+"<span>Play</span>";e.stepFn(S)};
  const drawG=()=>{$("#gauges").innerHTML=e.gauges(S).map(([l,v,u,f,c])=>`<div class="gauge"><span>${l}</span><b>${v}<small>${u}</small></b><div class="bar"><i style="width:${clamp(f,0,1)*100}%;background:${c}"></i></div></div>`).join("");
    const ph=$("#phase");if(ph&&e.phase.update)e.phase.update(ph,S);if(e.vbottom)$("#vbottom").innerHTML=e.vbottom(S)};
  drawG();panelTimer=setInterval(drawG,120);startSound();
}

/* ---------- VR lab: strip-down / dissection, or build-up of apparatus ---------- */
const WS={mode:"off",i:0,err:0,t0:0,timer:null,tray:[]};
function labOf(e){return Object.assign({mode:"strip",title:"VR lab",intro:"",start:"Start",verb:"Remove",doneTitle:"Done",doneText:""},e.lab||{})}
function resetShop(silent){clearInterval(WS.timer);Object.values(V.parts).forEach(P=>{P.removed=undefined;P.g.visible=true});WS.mode="off";WS.i=0;WS.err=0;V.select(null);if(E())E().S.paused=false}
function panelShop(e,S){resetShop();S.paused=true;const L=labOf(e),build=L.mode==="build";
  if(build){e.workshop.forEach(([id])=>{const P=V.parts[id];if(P){P.removed=true;P.t0=0}})}
  $("#panel").innerHTML=`<div class="pcard"><span class="k">${build?"VR lab":"VR lab"}</span><h4 class="disp" style="font-size:20px">${L.title}</h4><p class="sub" style="font-size:14px">${L.intro}</p>
    <div style="display:flex;gap:8px;margin-top:10px"><button class="btn hot" id="shopStart" style="flex:1">${L.start}</button><button class="btn line" id="shopHint">Hint</button></div></div>
    <div class="pcard" id="shopNow" style="display:none"></div>
    ${build?`<div class="pcard" id="trayCard" style="display:none"><h4>Apparatus tray</h4><p class="sub small" style="margin-bottom:8px">Tap the item you need next.</p><div class="tray" id="tray"></div></div>`:""}
    <div class="gauges" style="margin-bottom:10px"><div class="gauge"><span>Step</span><b id="wsStep">0/${e.workshop.length}</b></div><div class="gauge"><span>Time</span><b id="wsTime">0:00</b></div><div class="gauge"><span>Mistakes</span><b id="wsErr">0</b></div></div>
    <div class="pcard"><h4>${build?"Method":"Order of work"}</h4><ol class="steplist" id="wsList">${e.workshop.map(([id,t])=>`<li data-ws="${id}"><span>${t}</span></li>`).join("")}</ol></div>`;
  $("#shopStart").onclick=()=>{if(build){e.workshop.forEach(([id])=>{const P=V.parts[id];if(P){P.removed=true;P.t0=0}});WS.mode="build";WS.tray=e.workshop.map(w=>w[0]).sort(()=>Math.random()-.5);$("#trayCard").style.display="block"}else{resetShop();WS.mode="out"}
    WS.i=0;WS.err=0;WS.t0=Date.now();clearInterval(WS.timer);WS.timer=setInterval(()=>{const s=Math.round((Date.now()-WS.t0)/1000);$("#wsTime").textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`},500);$("#shopStart").textContent="Restart";shopShow()};
  $("#shopHint").onclick=()=>{if(WS.mode==="off"){toast("Tap "+L.start+" first");return}const st=curStep();if(WS.mode==="build"){const b=$(`#tray [data-tray="${st[0]}"]`);if(b){b.classList.add("hint");setTimeout(()=>b.classList.remove("hint"),1400)}toast("Next: "+V.parts[st[0]].meta.n)}else{V.select(st[0]);V.focus(st[0]);toast("Look for the highlighted part")}};
}
function curStep(){const w=E().workshop;return WS.mode==="in"?w[w.length-1-WS.i]:w[WS.i]}
function drawTray(){const t=$("#tray");if(!t)return;t.innerHTML=WS.tray.map(id=>{const done=E().workshop.findIndex(w=>w[0]===id)<WS.i;return `<button data-tray="${id}" ${done?"disabled":""}>${ICON.flask.replace("<svg",'<svg width="16" height="16"')}<span>${V.parts[id].meta.n}</span></button>`}).join("");
  t.querySelectorAll("[data-tray]").forEach(b=>b.onclick=()=>shopPick(b.dataset.tray))}
function shopShow(){const L=labOf(E()),w=E().workshop,st=curStep(),n=$("#shopNow");n.style.display="block";
  n.innerHTML=`<span class="k" style="color:var(--hot-ink)">${WS.mode==="in"?"Put back":L.verb} · step ${WS.i+1} of ${w.length}</span><h4 class="disp" style="font-size:19px;margin-top:2px">${WS.mode==="in"?"Put back: "+V.parts[st[0]].meta.n:st[1]}</h4><p class="sub small">Tool or safety: ${st[2]}</p>`;
  $("#wsStep").textContent=`${WS.i}/${w.length}`;$("#wsErr").textContent=WS.err;
  $$("#wsList li").forEach(li=>{const k=w.findIndex(x=>x[0]===li.dataset.ws);const done=WS.mode==="in"?k>w.length-1-WS.i:k<WS.i;li.className=done?"done":(li.dataset.ws===st[0]?"now":"")});
  if(WS.mode==="build")drawTray()}
function shopPick(id){const L=labOf(E());if(WS.mode==="off"){toast("Tap "+L.start+" first");return}if(WS.mode==="build"&&!E().workshop.find(w=>w[0]===id)){return}const st=curStep(),w=E().workshop;
  if(id!==st[0]){WS.err++;$("#wsErr").textContent=WS.err;if(WS.mode!=="build"){V.select(id);setTimeout(()=>V.select(null),500)}beep(180,.15,0,"square",.08);toast(V.parts[id]?`Not yet: ${V.parts[id].meta.n} comes ${WS.mode==="in"?"earlier":"later"}`:"Not that one");return}
  beep(880,.08,0,"sine",.1);V.select(null);V.remove(id,WS.mode==="out");WS.i++;
  if(WS.i>=w.length){if(WS.mode==="out"){WS.mode="in";WS.i=0;toast("All parts removed. Now put it back together.");shopShow()}else{clearInterval(WS.timer);const s=Math.round((Date.now()-WS.t0)/1000),score=Math.max(0,100-WS.err*5);mark(curEngine,"shop");
      dialog(`<h3 class="disp">${score>=80?L.doneTitle:L.doneTitle+", keep practising"}</h3><p>${L.doneText} Your result goes to your progress passport.</p><div class="facts"><div><b>${score}%</b>score</div><div><b>${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}</b>time</div><div><b>${WS.err}</b>mistakes</div></div><div class="row"><button class="btn line" onclick="closeDialog();renderPanel()">Again</button><button class="btn primary" onclick="closeDialog();go('${curEngine}-sim')">Run it in Simulate</button></div>`);WS.mode="off"}}
  else shopShow()}

/* ---------- fault diagnosis ---------- */
const FX={f:null,tests:{},ans:null};
function panelFix(e,S){const f=FX.f=e.faults[0];FX.tests={};FX.ans=null;f.apply(S);S.paused=false;if(e.sim)try{e.sim(S,1e-4)}catch(err){}
  const draw=()=>{$("#panel").innerHTML=`<div class="pcard" style="border-color:var(--bad)"><span class="k" style="color:var(--bad)">${f.kind||"Investigation"} · case 1</span><h4 class="disp" style="font-size:20px">${f.title}</h4><p class="sub" style="font-size:14px">${f.story}</p><div class="symp" style="margin-top:8px">${f.symptoms.map(s=>`<span>${s}</span>`).join("")}</div></div>
    <div class="gauges" id="gauges" style="margin-bottom:10px"></div>
    <div class="pcard"><h4>Run tests (${Object.keys(FX.tests).length} of ${f.tests.length})</h4><div class="tests">${f.tests.map(([n,r],i)=>`<div><button data-test="${i}">${n}<span>${FX.tests[i]?"✓":"Run"}</span></button>${FX.tests[i]?`<div class="res">${r}</div>`:""}</div>`).join("")}</div></div>
    <div class="pcard"><h4>${f.q||"What is the cause?"}</h4><div class="opts">${f.options.map((o,i)=>`<button data-ans="${i}" ${FX.ans!==null?"disabled":""} class="${FX.ans!==null?(i===f.answer?"right":i===FX.ans?"wrong":""):""}"><i>${"ABCD"[i]}</i><span>${o}</span><span>${FX.ans!==null&&i===f.answer?"✓":FX.ans===i?"✗":""}</span></button>`).join("")}</div>
    ${FX.ans!==null?`<div class="note" style="margin-top:10px;background:${FX.ans===f.answer?"var(--good-soft)":"var(--bad-soft)"}"><b>${FX.ans===f.answer?"Correct.":"Not quite."}</b> ${f.explain}</div><button class="btn primary" style="width:100%;margin-top:10px" id="fixRepair">${f.kind==="Fault finding"?"Repair it and run again":"Apply the fix and run again"}</button>`:`<p class="sub small" style="margin-top:8px">Tip: run at least two tests and use the evidence before you decide.</p>`}</div>`;
    $("#panel").querySelectorAll("[data-test]").forEach(b=>b.onclick=()=>{FX.tests[b.dataset.test]=1;beep(520,.06);draw()});
    $("#panel").querySelectorAll("[data-ans]").forEach(b=>b.onclick=()=>{if(!Object.keys(FX.tests).length){toast("Run at least one test first, so your answer is based on evidence");return}FX.ans=+b.dataset.ans;if(FX.ans===f.answer){mark(curEngine,"fix");beep(660,.1);beep(880,.15,.1)}else beep(200,.2,0,"square",.08);draw()});
    const rp=$("#fixRepair");if(rp)rp.onclick=()=>{f.clear(S);toast("Changed: watch the model now");$("#panel .pcard").style.borderColor="var(--good)"};
    drawG()};
  const drawG=()=>{const g=$("#gauges");if(g)g.innerHTML=e.gauges(S).slice(0,6).map(([l,v,u,fr,c])=>`<div class="gauge"><span>${l}</span><b>${v}<small>${u}</small></b><div class="bar"><i style="width:${clamp(fr,0,1)*100}%;background:${c}"></i></div></div>`).join("")};
  draw();panelTimer=setInterval(drawG,150);startSound();
}

/* ---------- quiz ---------- */
const QZ={i:0,score:0,ans:[]};
function panelQuiz(e,S){QZ.i=0;QZ.score=0;QZ.ans=[];S.paused=false;drawQuiz()}
function drawQuiz(){const e=E(),Q=e.quiz;
  if(QZ.i>=Q.length){const p=Math.round(QZ.score/Q.length*100),first=p>=80&&!PROG[curEngine].quiz;QBEST[curEngine]=Math.max(QBEST[curEngine]||0,p);if(p>=80)mark(curEngine,"quiz");
    $("#panel").innerHTML=`<div class="pcard" style="text-align:center"><span class="k">${e.vehicle} quest</span><div class="disp" style="font-size:64px;color:${p>=80?"var(--good)":"var(--bad)"}">${QZ.score}/${Q.length}</div><p class="sub">${p}% · pass mark 80%</p>${p>=80?`<div class="xpnote">${ICON.star.replace("<svg",'<svg width="20" height="20"')}${first?"+100 XP · quest complete":"Quest already complete · best "+QBEST[curEngine]+"%"}</div>`:`<p class="sub small" style="margin-top:8px">Score 80% or more to complete the quest and earn 100 XP.</p>`}</div>
      <div class="pcard"><h4>Review</h4><ol class="steplist">${Q.map((q,i)=>`<li class="${QZ.ans[i]===q.a?"done":""}"><span><b>${q.q}</b><br><span class="sub small">Answer: ${q.o[q.a]}</span></span></li>`).join("")}</ol></div>
      <div style="display:flex;gap:8px"><button class="btn line" style="flex:1" id="qAgain">Retake</button><button class="btn primary" style="flex:1" data-go="quests">Back to quests</button></div>`;
    if(first){chime();const nb=BADGES.filter(b=>b.ok()&&!BADGES_SEEN[b.id]);nb.forEach(b=>BADGES_SEEN[b.id]=1);if(nb.length)setTimeout(()=>toast("Badge unlocked: "+nb.map(b=>b.n).join(", ")),400)}
    $("#qAgain").onclick=()=>panelQuiz(e,e.S);return}
  const q=Q[QZ.i];
  $("#panel").innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span class="k">${e.vehicle} quest</span><span class="chip" style="background:#fff;border:1px solid var(--line)">${QZ.i+1} of ${Q.length}</span></div>
    <div style="display:flex;gap:4px;margin-bottom:12px">${Q.map((_,j)=>`<i style="flex:1;height:6px;border-radius:3px;background:${j<QZ.i?"var(--thermal)":j===QZ.i?"var(--ink)":"var(--line)"}"></i>`).join("")}</div>
    <p style="font-size:19px;font-weight:700;line-height:1.3;margin-bottom:12px">${q.q}</p>
    <div class="opts">${q.o.map((o,j)=>`<button data-qa="${j}"><i>${"ABCD"[j]}</i><span>${o}</span><span class="mk"></span></button>`).join("")}</div>
    <div class="note" id="qExp" style="display:none;margin-top:10px"></div><button class="btn primary" id="qNext" style="width:100%;margin-top:10px;display:none">${QZ.i===Q.length-1?"See my score":"Next question"}</button>`;
  $("#panel").querySelectorAll("[data-qa]").forEach(b=>b.onclick=()=>{const j=+b.dataset.qa,ok=j===q.a;QZ.ans[QZ.i]=j;if(ok){QZ.score++;beep(760,.1)}else beep(200,.18,0,"square",.07);
    $("#panel").querySelectorAll("[data-qa]").forEach(x=>{x.disabled=true;const k=+x.dataset.qa;if(k===q.a){x.classList.add("right");x.querySelector(".mk").textContent="✓"}else if(k===j){x.classList.add("wrong");x.querySelector(".mk").textContent="✗"}});
    const ex=$("#qExp");ex.style.display="block";ex.style.background=ok?"var(--good-soft)":"var(--bad-soft)";ex.innerHTML=`<b>${ok?"Correct.":"Not quite."}</b> ${q.e}`;$("#qNext").style.display="flex";
    if(q.focus){V.select(q.focus);V.focus(q.focus)}});
  $("#qNext").onclick=()=>{QZ.i++;drawQuiz();$("#panel").scrollTop=0}}

/* ===================== quests, XP and badges ===================== */
const QMETA={heart:["Follow the blood","Valves, chambers and the lub-dub of the cardiac cycle.",6],plant:["Light up the leaf","Limiting factors and what the bubbles really are.",6],electro:["Ions on the move","Cathodes, anodes and why the blue colour fades.",7],motor:["Make it spin","Fleming's left-hand rule and the split-ring commutator.",6],orbit:["Laws of the planets","Kepler's three laws and what keeps the Earth in orbit.",7],car:["Heat into motion","The four strokes and the gas laws inside a car engine.",6],moto:["Shift through the gears","Single-cylinder engines, clutches and gear ratios.",6],jet:["Thrust from air","Fans, spools and turbines in a jet engine.",7],boat:["Power on the water","Outboards: cooling water, gears and propellers.",6],train:["Ride the lightning","25 kV, inverters and regenerative braking.",7]};
const qDone=id=>!!PROG[id].quiz,XP=()=>ENGINE_IDS.filter(qDone).length*100;
const RANKS=[[0,"Lab Rookie"],[200,"Lab Assistant"],[400,"Junior Scientist"],[700,"Senior Scientist"],[1000,"SainsLab Master"]];
const BADGES=[{id:"beat",n:"Steady Beat",d:"Complete the heart quest",ic:"heart",c:"#E63946",ok:()=>qDone("heart")},{id:"green",n:"Green Machine",d:"Complete the photosynthesis quest",ic:"plant",c:"#2E9E5B",ok:()=>qDone("plant")},{id:"ion",n:"Ion Tamer",d:"Complete the electrolysis quest",ic:"electro",c:"#3A86FF",ok:()=>qDone("electro")},{id:"left",n:"Left-Hand Legend",d:"Complete the electric motor quest",ic:"motor",c:"#7B4FD6",ok:()=>qDone("motor")},{id:"orbit",n:"Orbit Keeper",d:"Complete the solar system quest",ic:"orbit",c:"#14213D",ok:()=>qDone("orbit")},{id:"bio",n:"Biologist",d:"Complete every Biology quest",ic:"book",c:"#2E9E5B",ok:()=>idsOf("Biology").every(qDone)},{id:"gear",n:"Gearhead",d:"Complete every Engineering quest",ic:"engine",c:"#EE5A24",ok:()=>idsOf("Engineering").every(qDone)},{id:"round",n:"All-Rounder",d:"Complete a quest in every subject",ic:"star",c:"#F4B400",ok:()=>SUBJ.every(([sb])=>idsOf(sb).some(qDone))},{id:"master",n:"SainsLab Master",d:"Complete all ten quests",ic:"trophy",c:"#14213D",ok:()=>ENGINE_IDS.every(qDone)}];
const BADGES_SEEN={};BADGES.forEach(b=>{if(b.ok())BADGES_SEEN[b.id]=1});
let QF="All";
function renderQuests(){const xp=XP(),done=ENGINE_IDS.filter(qDone).length,ri=RANKS.filter(r=>xp>=r[0]).length-1,rank=RANKS[ri][1],next=RANKS[ri+1],pctN=next?Math.round((xp-RANKS[ri][0])/(next[0]-RANKS[ri][0])*100):100,ub=BADGES.filter(b=>b.ok()).length;
  const list=ENGINE_IDS.filter(id=>QF==="All"||ENGINES[id].subject===QF);
  $("#questBody").innerHTML=`<h2 class="h1 disp">Science quests</h2><p class="sub" style="margin-bottom:14px">Pass a model's quiz with 80% or more to complete its quest, earn 100 XP and unlock badges.</p>
  <div class="rankcard"><div class="top"><span class="badge">${ICON.trophy}</span><div><small>Your rank</small><h3 class="disp">${rank}</h3></div><div class="nums"><div><small>Total XP</small><b class="xp">${xp} XP</b></div><div><small>Quests</small><b>${done}/${ENGINE_IDS.length}</b></div></div></div>
    <div class="barrow"><span>${next?`${next[0]-xp} XP to ${next[1]}`:"Top rank reached"}</span><b style="color:#fff">${pctN}%</b></div><div class="bar"><i style="width:${pctN}%"></i></div></div>
  <div class="twocol"><div>
    <div class="qhead"><h3 class="h2 disp" style="margin:0">Quests</h3><small>+100 XP each</small></div>
    <div class="qfilter" role="group" aria-label="Filter by subject">${["All",...SUBJ.map(x=>x[0])].map(sb=>`<button data-qf="${sb}" aria-pressed="${QF===sb}">${sb!=="All"?`<i style="background:${SCOL[sb]}"></i>`:""}${sb}</button>`).join("")}</div>
    ${list.map(id=>{const E=ENGINES[id],[t,d,m]=QMETA[id],ok=qDone(id),n=ENGINE_IDS.indexOf(id)+1;return `<div class="quest${ok?" done":""}"><div class="meta"><b>${String(n).padStart(2,"0")}</b><span>+100 XP</span><span>${ICON.clock} ${m} min</span>${ok?`<span class="st ok">${ICON.check} Completed${QBEST[id]?" · best "+QBEST[id]+"%":""}</span>`:`<span class="st av">Available</span>`}</div>
      <div><h4 class="disp"><span class="sub2" style="background:${SCOL[E.subject]}22;color:${SCOL[E.subject]}">${E.vehicle}</span>${t}</h4><p>${d}</p></div>
      <button class="go ${ok?"replay":"start"}" data-go="${id}-quiz">${ok?"Replay":"Start quest"}${ICON.arrow}</button></div>`}).join("")}
  </div><div>
    <div class="qhead"><h3 class="h2 disp" style="margin:0">Badges</h3><small>${ub}/${BADGES.length} unlocked</small></div>
    <div class="badges">${BADGES.map(b=>{const on=b.ok();return `<div class="bdg${on?"":" off"}">${on?"":`<span class="lk">${ICON.lock}</span>`}<span class="ic" style="background:${b.c}">${ICON[b.ic]}</span><b>${b.n}</b><span>${b.d}</span></div>`}).join("")}</div>
    <div class="pcard" style="margin-top:12px"><h4>How XP works</h4><p class="sub small">Each quest is the five-question quiz for one model. Score 80% or more to complete it. Replays can raise your best score but do not give extra XP. Your teacher sees quests in your progress passport.</p></div>
  </div></div>`;
  $("#questBody").querySelectorAll("[data-qf]").forEach(b=>b.onclick=()=>{QF=b.dataset.qf;renderQuests()})}
enterHooks.quests=()=>renderQuests();

/* ===================== progress + preferences ===================== */
function qr(seed){let s=seed,h="";const n=21,c=72/n;for(let y=0;y<n;y++)for(let x=0;x<n;x++){s=(s*9301+49297)%233280;const fx=x>13?x-14:x,fy=y>13?y-14:y,fin=(x<7&&y<7)||(x>13&&y<7)||(x<7&&y>13);const on=fin?((fx===0||fx===6||fy===0||fy===6)||(fx>1&&fx<5&&fy>1&&fy<5)):s/233280>.52;if(on)h+=`<rect x="${x*c}" y="${y*c}" width="${c+.2}" height="${c+.2}"/>`}return `<svg viewBox="0 0 72 72" width="72" height="72"><g fill="#0F1B2A">${h}</g></svg>`}
enterHooks.progress=()=>{const cols=["explore","sim","shop","fix","quiz"],done=ENGINE_IDS.reduce((a,id)=>a+Object.values(PROG[id]).reduce((x,y)=>x+y,0),0);
  $("#progBody").innerHTML=`<h2 class="h1 disp">Progress passport</h2><p class="sub" style="margin-bottom:14px">Your record of science practical work (kerja amali) for classroom assessment. Your teacher scans the code to sign it off.</p>
  <div class="twocol"><div><div class="passcard"><div><h3 class="disp">Jovan Maurelio</h3><span style="font-size:13px;color:#B6C3D0">M-0417 · Form 4 Bestari · SMK Seri Bayu</span><div style="margin-top:12px;font-size:13px;color:#B6C3D0">${done} of ${NSK} skills · ${Math.round(done/NSK*100)}%</div><div style="height:8px;background:rgba(255,255,255,.15);border-radius:4px;margin-top:6px;overflow:hidden"><i style="display:block;height:100%;width:${done/NSK*100}%;background:var(--thermal)"></i></div></div><div class="qr">${qr(24417)}</div><div class="thermal"></div></div>
  <h3 class="h2 disp">Skills by model</h3><table class="matrix"><thead><tr><th>Model</th>${cols.map(c=>`<th>${tr(c)}</th>`).join("")}</tr></thead><tbody>${ENGINE_IDS.map(id=>`<tr><td><b>${ENGINES[id].vehicle}</b></td>${cols.map(c=>`<td><i style="background:${PROG[id][c]?"var(--good)":"var(--line)"}" title="${PROG[id][c]?"Done":"Not yet"}"></i></td>`).join("")}</tr>`).join("")}</tbody></table>
  <p class="sub small" style="margin-top:6px">Green = done. Lab and investigation count when you finish with 80% or more.</p></div><div>
  <h3 class="h2 disp">Practical time this term</h3><div class="pcard">${[["VR labs · photosynthesis set-up, heart dissection","1.6 h"],["Simulations · heart, motor, photosynthesis","2.2 h"],["Live classes · 5 sessions","3.5 h"],["Investigations · 2 completed","0.8 h"]].map(([a,b])=>`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--line);font-size:14px"><span>${a}</span><b>${b}</b></div>`).join("")}<p class="sub small" style="margin-top:8px">Shared with your teacher for classroom-based assessment (PBD).</p></div>
  <button class="btn primary" style="width:100%;margin-bottom:8px" data-toast="Progress sent to Cikgu Farah Hanim">Send to my teacher</button><button class="btn line" style="width:100%" data-toast="Practical record saved to your downloads">Download my record</button></div></div>`};
enterHooks.prefs=()=>{
  $("#prefsBody").innerHTML=`<div style="display:flex;align-items:center;gap:6px;margin-left:-10px"><button class="iconbtn" data-go="home" aria-label="Back">${ICON.back}</button><h2 class="h1 disp">Preferences</h2></div>
  <h3 class="h2 disp">Language</h3><div class="langs" data-langs style="margin-bottom:14px"></div>
  <h3 class="h2 disp">Sound</h3><div class="toggles"><div class="tg"><span>Model and class sound<small>Heartbeat, motor and bubble sounds, class audio and voice</small></span><button class="switch" data-own="1" id="pSound" role="switch" aria-checked="${SND.on}" aria-label="Sound"></button></div>
    <div class="tg"><span style="flex:1">Volume<input type="range" min="0" max="1" step=".05" value="${SND.vol}" id="pVol" style="width:100%;accent-color:var(--hot);margin-top:6px" aria-label="Volume"></span></div>
    <div class="tg"><span>Captions in live class<small>Show what the teacher says, with a Bahasa Melayu translation</small></span><button class="switch" role="switch" aria-checked="true" aria-label="Captions"></button></div></div>
  <h3 class="h2 disp">Comfort and access</h3><div class="toggles"><div class="tg"><span>Bigger buttons and text<small>For gloves in the lab or low vision</small></span><button class="switch" data-own="1" id="pBig" role="switch" aria-checked="${$("#app").classList.contains("glove")}" aria-label="Bigger buttons"></button></div>
    <div class="tg"><span>High contrast</span><button class="switch" data-own="1" id="pHC" role="switch" aria-checked="${$("#app").classList.contains("contrast")}" aria-label="High contrast"></button></div>
    <div class="tg"><span>VR comfort mode<small>Seated play, snap turning and a vignette when moving</small></span><button class="switch" role="switch" aria-checked="true" aria-label="VR comfort mode"></button></div>
    <div class="tg"><span>Start simulations in slow motion</span><button class="switch" role="switch" aria-checked="true" aria-label="Slow motion by default"></button></div></div>
  <h3 class="h2 disp">Your data</h3><div class="toggles"><div class="tg"><span>Share scores with my teacher<small>Lab, investigation and quiz results</small></span><button class="switch" role="switch" aria-checked="true" aria-label="Share scores"></button></div>
    <div class="tg"><span>Record my voice in live classes<small>Off: only the teacher is recorded</small></span><button class="switch" role="switch" aria-checked="false" aria-label="Record my voice"></button></div>
    <div class="tg"><span>Camera for AR<small>Processed on this device only, never uploaded</small></span><button class="switch" role="switch" aria-checked="true" aria-label="Camera for AR"></button></div></div>
  <div style="display:flex;gap:10px"><button class="btn line" style="flex:1" data-toast="Your data file will be ready within 24 hours">Download my data</button><button class="btn line" style="flex:1;color:var(--bad)" id="pDel">Delete my recordings</button></div>
  <p class="sub small" style="margin-top:12px">Handled under Malaysia's Personal Data Protection Act 2010 (amended 2024). Students under 18 use SainsLab with a parent's or guardian's consent, collected by the school. Data protection officer: dpo@sainslab.example</p>
  <button class="btn line" style="width:100%;margin-top:14px" data-go="signin">Sign out</button>`;
  applyLang();
  $("#pSound").onclick=function(){setSound(!SND.on);this.setAttribute("aria-checked",SND.on)};
  $("#pVol").oninput=e=>{SND.vol=+e.target.value;if(SND.master&&SND.on)SND.master.gain.value=SND.vol};
  $("#pBig").onclick=function(){const on=!$("#app").classList.contains("glove");$("#app").classList.toggle("glove",on);this.setAttribute("aria-checked",on)};
  $("#pHC").onclick=function(){const on=!$("#app").classList.contains("contrast");$("#app").classList.toggle("contrast",on);this.setAttribute("aria-checked",on)};
  $("#pDel").onclick=()=>dialog(`<h3 class="disp">Delete your recordings?</h3><p>This removes your 2 voice questions from past live classes. Your scores stay, because your teacher needs them for classroom assessment.</p><div class="row"><button class="btn line" onclick="closeDialog()">Keep them</button><button class="btn danger" onclick="closeDialog();toast('2 recordings deleted')">Delete recordings</button></div>`)};
