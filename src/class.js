/* ===================== Live MR class with real sound ===================== */
const AV_FARAH=`<svg viewBox="0 0 120 150" aria-hidden="true"><rect width="120" height="150" fill="#1C3A4F"/><rect y="105" width="120" height="45" fill="#0AA5B5" opacity=".25"/>
<path d="M14 150c2-30 20-46 46-46s44 16 46 46z" fill="#2B4C7E"/><path d="M26 150c4-20 16-30 34-30s30 10 34 30z" fill="#F4F1EC"/>
<path d="M60 22c-24 0-38 18-38 42 0 22 10 36 18 44 6 6 14 9 20 9s14-3 20-9c8-8 18-22 18-44 0-24-14-42-38-42z" fill="#2E6F73"/>
<ellipse cx="60" cy="66" rx="21" ry="25" fill="#C98E6B"/><path d="M38 52c4-14 14-20 22-20s18 6 22 20c-6-6-14-9-22-9s-16 3-22 9z" fill="#2E6F73"/>
<ellipse cx="52" cy="64" rx="2.6" ry="3" fill="#2A1C14"/><ellipse cx="68" cy="64" rx="2.6" ry="3" fill="#2A1C14"/><path d="M47 58q5-3 9 0M64 58q5-3 9 0" stroke="#3A2A20" stroke-width="1.6" fill="none"/>
<path d="M60 66v8" stroke="#A86F52" stroke-width="1.6" fill="none"/><g class="mouth"><path class="m0" d="M53 80q7 5 14 0" stroke="#7A3B2E" stroke-width="2.2" fill="none" stroke-linecap="round"/><ellipse class="m1" cx="60" cy="81" rx="5.5" ry="3.6" fill="#7A3B2E" style="display:none"/></g>
<rect x="44" y="60" width="13" height="9" rx="3" fill="none" stroke="#1B1F24" stroke-width="1.4"/><rect x="63" y="60" width="13" height="9" rx="3" fill="none" stroke="#1B1F24" stroke-width="1.4"/><path d="M57 64h6" stroke="#1B1F24" stroke-width="1.4"/></svg>`;
const AV_JOVAN=`<svg viewBox="0 0 120 150" aria-hidden="true"><rect width="120" height="150" fill="#2A2F45"/><path d="M14 150c2-30 20-46 46-46s44 16 46 46z" fill="#FF5A1F"/><rect x="52" y="92" width="16" height="16" fill="#D7A27F"/>
<ellipse cx="60" cy="66" rx="22" ry="26" fill="#E2B48F"/><path d="M37 60c0-20 10-30 23-30s24 8 24 28c-4-8-12-12-24-12s-19 6-23 14z" fill="#1E1A18"/>
<ellipse cx="51" cy="66" rx="2.6" ry="3" fill="#2A1C14"/><ellipse cx="69" cy="66" rx="2.6" ry="3" fill="#2A1C14"/><path d="M53 82q7 4 14 0" stroke="#8A4B3E" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`;
const CLS_PEOPLE=[["FH","Cikgu Farah","#2E6F73"],["JM","Jovan (you)","#FF5A1F"],["AR","Arjun R.","#7C83E8"],["ML","Mei Ling","#1E9E5A"],["HZ","Hafiz Z.","#C9A447"],["NS","Nurul S.","#D94F8C"]];
const CLS_SCRIPT=[
 {t:"Good morning, Form 4 Bestari. Today we look at how the heart pumps blood. You should all see the same heart on your screens, and I'll move it as I talk. Listen: that lub-dub is the valves closing.",bm:"Selamat pagi, 4 Bestari. Hari ini kita lihat bagaimana jantung mengepam darah. Semua patut nampak jantung yang sama di skrin. Dengar: bunyi lub-dub itu ialah injap yang tertutup.",act:c=>{c.V.reset();c.lay(["deoxy","oxy","air"]);c.S.act=72}},
 {t:"Let's follow the blood. Oxygen-poor blood, shown in blue, comes back from the body through the vena cavae into the right atrium.",bm:"Mari ikut aliran darah. Darah kurang oksigen, berwarna biru, kembali dari badan melalui vena kava ke dalam atrium kanan.",act:c=>{c.lay(["deoxy"]);c.show("VC")}},
 {t:"The right ventricle pumps it up the pulmonary arteries to the lungs. In the lungs it picks up oxygen and gets rid of carbon dioxide.",bm:"Ventrikel kanan mengepamnya melalui arteri pulmonari ke peparu. Di peparu, darah menerima oksigen dan membebaskan karbon dioksida.",act:c=>{c.lay(["deoxy","air"]);c.show("PA")}},
 {t:"Oxygen-rich blood, shown in red, comes back through the pulmonary veins to the left atrium, and then down into the left ventricle.",bm:"Darah kaya oksigen, berwarna merah, kembali melalui vena pulmonari ke atrium kiri, kemudian turun ke ventrikel kiri.",act:c=>{c.lay(["oxy"]);c.show("PV")}},
 {t:"Now look at the wall of the left ventricle. It is much thicker than the right, because it has to pump blood all the way round the body through the aorta.",bm:"Sekarang lihat dinding ventrikel kiri. Ia jauh lebih tebal daripada yang kanan kerana ia perlu mengepam darah ke seluruh badan melalui aorta.",act:c=>{c.lay(["oxy"]);c.show("LV")}},
 {poll:{q:"Quick poll: which valves closing make the first sound, 'lub'?",o:["The semilunar valves","The tricuspid and bicuspid valves","The aorta closing"],a:1,res:[21,68,11]},t:"Quick poll. Which valves closing make the first sound, lub? Answer on your screen.",bm:"Undian pantas. Injap manakah yang tertutup dan menghasilkan bunyi pertama, lub? Jawab di skrin anda.",act:c=>{c.lay(["deoxy","oxy"]);c.show("TV")}},
 {t:"Well done, most of you got it. Lub is the tricuspid and bicuspid valves snapping shut. Dub is the semilunar valves closing.",bm:"Bagus, kebanyakan anda betul. Lub ialah injap trikuspid dan bikuspid tertutup. Dub ialah injap sabit tertutup.",act:c=>c.show("SL")},
 {t:"Now imagine you are running. Watch how much faster the heart beats and how quickly the blood moves.",bm:"Sekarang bayangkan anda sedang berlari. Lihat betapa lajunya jantung berdegup dan darah mengalir.",act:c=>{c.show(null);c.lay(["deoxy","oxy","air"]);c.S.act=160}},
 {t:"Remember: blood passes through the heart twice for every trip round the body. That is double circulation. For homework, try the exercise investigation before Thursday. Any questions, raise your hand now.",bm:"Ingat: darah melalui jantung dua kali bagi setiap pusingan badan. Itulah peredaran ganda dua. Kerja rumah: cuba siasatan senaman sebelum Khamis. Jika ada soalan, angkat tangan sekarang.",act:c=>{c.S.act=72;c.show(null);c.V.reset()}}];
const CLS_Q=[["Why is the left ventricle wall thicker?","Because it pumps blood to the whole body, which needs a much higher pressure. The right ventricle only pumps to the lungs, which are very close.","Kerana ia mengepam darah ke seluruh badan, yang memerlukan tekanan lebih tinggi. Ventrikel kanan hanya mengepam ke peparu yang sangat dekat.","LV"],
 ["Why don't the valves turn inside out?","Tough cords called tendons, or heart strings, tie the valve flaps to the ventricle wall, so they shut but cannot flip back into the atria.","Tali kuat yang dipanggil tendon menyambung injap ke dinding ventrikel, jadi injap tertutup tetapi tidak terbalik ke atrium.","TV"],
 ["What happens in a heart attack?","A coronary artery on the surface of the heart gets blocked, so part of the heart muscle gets no oxygen and stops working properly.","Arteri koronari pada permukaan jantung tersumbat, jadi sebahagian otot jantung tidak mendapat oksigen.","CA"]];

const CLS={V:null,S:null,run:0,i:0,t0:0,timer:null,snd:null,mic:false,hand:false,bm:true,poll:null,ans:null,waiting:false,busy:false,qmode:false};
function clsSetup(){if(CLS.V)return;CLS.V=new Viewer($("#c3d"),{onPick:id=>{const P=CLS.V.parts[id];if(P)toast(P.meta.n)}});if(CLS.V.dead)return;
  const e=ENGINES.heart,keep=e.S;CLS.S=JSON.parse(JSON.stringify(e.S));CLS.S.slow=.5;e.S=CLS.S;CLS.V.load(e);e.S=keep;CLS.V.showLabels=false;CLS.V.setCut(true);CLS.V.ctl.autoRotate=false}
const clsCtx={get V(){return CLS.V},get S(){return CLS.S},
  show(id){const V=CLS.V;if(!V)return;V.select(id);V.only=id?[id]:null;V.showLabels=!!id;if(id)V.focus(id,3.6);else V.reset()},
  lay(on){const V=CLS.V;if(!V)return;Object.keys(V.layers).forEach(k=>V.layers[k]=on.includes(k))},
  loud(v){if(CLS.S)CLS.S._vol=v}};
function clsSpeak(line,who,onend){const run=CLS.run;$("#capWho").textContent=who==="m"?"Jovan Maurelio (you)":"Cikgu Farah Hanim";$("#capTxt").textContent=line.t;$("#capTr").textContent=CLS.bm&&line.bm?"BM: "+line.bm:"";
  const pip=$("#pip");pip.classList.toggle("talk",who!=="m");let mo=null;if(who!=="m"){let k=0;mo=setInterval(()=>{k++;const o=pip.querySelector(".m1"),c=pip.querySelector(".m0");if(o&&c){const open=k%3!==0&&Math.random()>.25;o.style.display=open?"":"none";c.style.display=open?"none":""}},140)}
  say(line.t,{who:who==="m"?"m":"f",rate:who==="m"?1.05:.98,onend:()=>{clearInterval(mo);const o=pip.querySelector(".m1"),c=pip.querySelector(".m0");if(o){o.style.display="none";c.style.display=""}pip.classList.remove("talk");if(run===CLS.run)setTimeout(()=>{if(run===CLS.run)onend&&onend()},650)}})}
function clsNext(){const run=CLS.run;if(CLS.hand&&!CLS.qmode){clsHand();return}
  if(CLS.i>=CLS_SCRIPT.length){CLS.busy=false;$("#capTxt").textContent="Class has ended. Cikgu Farah is still online if you raise your hand.";$("#capTr").textContent="";mark("heart","class");return}
  const L=CLS_SCRIPT[CLS.i++];CLS.busy=true;if(L.act)L.act(clsCtx);
  if(L.poll){CLS.poll=L.poll;CLS.ans=null;clsPanel();clsSpeak(L,"f",()=>{CLS.waiting=true;let left=12;const tick=()=>{if(run!==CLS.run)return;if(CLS.ans!=null||left<=0){CLS.waiting=false;CLS.poll.done=true;clsPanel();setTimeout(()=>run===CLS.run&&clsNext(),900);return}left--;const el=$("#pollLeft");if(el)el.textContent=left+" s left";setTimeout(tick,1000)};tick()});return}
  clsSpeak(L,"f",clsNext)}
function clsHand(){CLS.qmode=true;clsPanel();clsSpeak({t:"Yes Jovan, I see your hand. Go ahead.",bm:"Ya Jovan, saya nampak tangan anda. Silakan."},"f",()=>{})}
function clsAsk(k){const run=CLS.run,[q,a,bm,part]=CLS_Q[k];CLS.hand=false;$("#cHand").setAttribute("aria-pressed","false");CLS.qmode="asked";clsPanel();
  clsSpeak({t:q,bm:""},"m",()=>{clsCtx.show(part);clsSpeak({t:a,bm},"f",()=>{CLS.qmode=false;clsPanel();if(run===CLS.run&&CLS.busy!==false)clsNext()})})}
function clsPanel(){const p=CLS.poll;
  $("#cpanel").innerHTML=`<div class="callbar">
   <button id="cMic" aria-pressed="${CLS.mic}"><span class="iconbtn">${ICON.mic}</span>${CLS.mic?"Mic on":"Mic off"}</button>
   <button id="cSpk" aria-pressed="${!SND.on}"><span class="iconbtn">${SND.on?ICON.sound:ICON.mute}</span>${SND.on?"Speaker":"Muted"}</button>
   <button id="cHand" aria-pressed="${CLS.hand}"><span class="iconbtn">${ICON.hand}</span>${CLS.hand?"Hand up":"Raise hand"}</button>
   <button id="cBM" aria-pressed="${CLS.bm}"><span class="iconbtn" style="font-weight:800;font-size:13px">BM</span>Captions</button>
   <button class="end" id="cEnd"><span class="iconbtn">${ICON.phone}</span>Leave</button></div>
  ${CLS.qmode===true?`<div class="pcard" style="border-color:var(--cool)"><h4>Ask Cikgu Farah</h4><p class="sub small">Pick your question. It is read out to the class.</p><div class="opts">${CLS_Q.map(([q],k)=>`<button data-q="${k}"><i>?</i><span>${q}</span><span></span></button>`).join("")}</div></div>`:""}
  ${p&&!p.hidden?`<div class="pcard" id="pollCard"><span class="k">Live poll</span><h4 class="disp" style="font-size:17px">${p.q}</h4>${p.done?p.o.map((o,k)=>`<div class="pollres"><div style="display:flex;justify-content:space-between;font-size:13.5px;font-weight:${k===p.a?800:500}"><span>${o}${k===p.a?" ✓":""}${CLS.ans===k?" (you)":""}</span><span>${p.res[k]}%</span></div><div class="meter"><i style="width:${p.res[k]}%;background:${k===p.a?"var(--good)":"var(--ink3,#9AA6B2)"}"></i></div></div>`).join(""):`<div class="opts">${p.o.map((o,k)=>`<button data-p="${k}" style="${CLS.ans===k?"border-color:var(--ink);background:var(--soft)":""}"><i>${"ABC"[k]}</i><span>${o}</span><span>${CLS.ans===k?"✓":""}</span></button>`).join("")}</div><p class="sub small" id="pollLeft">${CLS.waiting?"12 s left":"Opens when Dr Farah asks"}</p>`}</div>`:""}
  <div class="pcard"><h4>In class · 29</h4><div class="people">${CLS_PEOPLE.map(([i,n,c])=>`<span><i style="background:${c}">${i}</i>${n}</span>`).join("")}<span><i style="background:#55606B">+23</i>more</span></div></div>
  <div class="pcard"><h4>What you are seeing</h4><p class="sub small">Cikgu Farah controls the shared heart model. Each student sees it in 3D on a phone or laptop, or in mixed reality on a headset in the science lab, all in sync. Her voice plays through your speaker, with live English and Bahasa Melayu captions. Tap a part to see its name.</p></div>`;
  $("#cMic").onclick=()=>{CLS.mic=!CLS.mic;clsPanel();toast(CLS.mic?"Microphone on. The class can hear you.":"Microphone off")};
  $("#cSpk").onclick=()=>{actx();setSound(!SND.on);clsPanel();toast(SND.on?"Speaker on":"Speaker muted. Captions keep going.")};
  $("#cHand").onclick=()=>{CLS.hand=!CLS.hand;if(!CLS.hand&&CLS.qmode===true){CLS.qmode=false;clsPanel();if(CLS.busy&&CLS.i<CLS_SCRIPT.length)clsNext();return}clsPanel();if(CLS.hand){chime();toast("Hand raised. Cikgu Farah will come to you after this point.");if(!CLS.busy)clsHand()}};
  $("#cBM").onclick=()=>{CLS.bm=!CLS.bm;clsPanel()};
  $("#cEnd").onclick=()=>go("home");
  $("#cpanel").querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>{if(!CLS.waiting&&CLS.ans==null&&!p.done){toast("Wait for Cikgu Farah to open the poll");return}CLS.ans=+b.dataset.p;beep(720,.08,0,"sine",.12);clsPanel()});
  $("#cpanel").querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>clsAsk(+b.dataset.q))}
enterHooks.class=()=>{clsSetup();CLS.run++;const run=CLS.run;CLS.i=0;CLS.poll=null;CLS.ans=null;CLS.hand=false;CLS.qmode=false;CLS.busy=true;CLS.vol=.12;
  $("#pip").innerHTML=AV_FARAH+`<div class="nm">Cikgu Farah Hanim</div>`;$("#ringAv").innerHTML=AV_FARAH;$("#ringTxt").textContent="Joining live class…";$("#ringing").classList.add("show");
  $("#capTxt").textContent="Connecting…";$("#capTr").textContent="";clsPanel();actx();ringTone(1);
  setTimeout(()=>{if(run!==CLS.run)return;$("#ringTxt").textContent="Connected · audio on";},1600);
  setTimeout(()=>{if(run!==CLS.run)return;$("#ringing").classList.remove("show");chime();CLS.t0=Date.now();
    clearInterval(CLS.timer);CLS.timer=setInterval(()=>{const s=Math.floor((Date.now()-CLS.t0)/1000)+754;$("#clsTime").textContent=String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
      },150);
    if(CLS.S){CLS.S._snd=true;CLS.S._vol=.3}setTimeout(()=>run===CLS.run&&clsNext(),700)},2600)};
leaveHooks.class=()=>{CLS.run++;hush();clearInterval(CLS.timer);if(CLS.S)CLS.S._snd=false;if(CLS.snd){CLS.snd.stop();CLS.snd=null}$("#ringing").classList.remove("show")};
