/* ===================== Biology: the human heart and double circulation ===================== */
const ENGINES={};
function phaseOfHeart(u){return u<.12?0:u<.17?1:u<.5?2:u<.55?3:4}
const HEART_PH=["Atria contract","Ventricles tighten, AV valves shut (lub)","Ventricles pump blood out","Semilunar valves shut (dub)","Heart relaxes and fills"];
ENGINES.heart={
  id:"heart",subject:"Biology",vehicle:"Heart",name:"The human heart",short:"heart",specs:["Form 4 Biology","Transport in humans","4 chambers","4 valves","Double circulation"],
  intro:"Your heart is a muscular pump about the size of your fist. It beats around 100,000 times a day and pushes blood round two loops: one to the lungs to pick up oxygen, and one to the rest of the body.",
  how:["Oxygen-poor blood from the body enters the right atrium through the vena cavae.","The atria contract and push blood through the tricuspid and bicuspid (mitral) valves into the ventricles.","The ventricles contract. The atrioventricular valves snap shut (the first heart sound, 'lub') so blood cannot flow back.","The right ventricle pumps blood to the lungs in the pulmonary artery; the left ventricle pumps blood to the whole body in the aorta. That is why its wall is much thicker.","When the ventricles relax, the semilunar valves shut (the second sound, 'dub') and the heart fills again.","Blood passes through the heart twice for each trip round the body: this is called double circulation."],
  layers:{deoxy:["Oxygen-poor blood","#3A6BD8"],oxy:["Oxygen-rich blood","#E63946"],air:["Air in the lungs","#8FE3F0"]},
  S:{act:72,bpm:72,slow:.35,paused:false,u:.6,br:0,vsd:0},
  controls:[{k:"act",type:"seg",label:"Activity",options:[[55,"Sleeping"],[72,"Resting"],[110,"Walking fast"],[160,"Running"]],hint:S=>({55:"Asleep: the body needs little oxygen, so the heart beats slowly.",72:"At rest: about 72 beats a minute, around 5 litres of blood a minute.",110:"Walking fast: muscles need more oxygen and glucose, so the heart beats faster and harder.",160:"Running: the heart rate more than doubles and each beat pushes out more blood. Breathing gets faster too."})[S.act]},
    {k:"slow",type:"seg",label:"Speed",options:[[.35,"Slow motion"],[1,"Real time"]]}],
  camera:{pos:[1.7,2.7,7.3],tgt:[0,1.85,0]},flowSlow:S=>Math.max(.45,S.slow),
  sim(S,dt){S.bpm+=(S.act-S.bpm)*Math.min(1,dt*.6);const prev=S.u;if(!S.paused)S.u=(S.u+dt*S.bpm/60*S.slow)%1;S.wrap=S.u<prev;
    S.sv=clamp(70+(S.bpm-72)*.32,58,110);S.co=S.bpm*S.sv/1000;S.sys=Math.round(116+(S.bpm-72)*.5);S.dia=Math.round(78+(S.bpm-72)*.08);S.sat=S.vsd?91:98;S.brpm=12+(S.bpm-55)*.17;if(!S.paused)S.br=(S.br+dt*S.brpm/60*S.slow)%1},
  gauges(S){return[["Heart rate",Math.round(S.bpm),"beats/min",S.bpm/180,"#E63946"],["Stroke volume",Math.round(S.sv),"mL",S.sv/120,"#14213D"],["Cardiac output",S.co.toFixed(1),"L/min",S.co/18,"#2A9D8F"],["Blood pressure",S.sys+"/"+S.dia,"mmHg",S.sys/180,"#7B4FD6"],["Blood oxygen",S.sat,"%",S.sat/100,S.sat<95?"#D93A2E":"#3A86FF"],["Breathing",Math.round(S.brpm),"breaths/min",S.brpm/40,"#8FB8C8"]]},
  phase:{title:"One heartbeat (cardiac cycle)",svg:()=>{const x0=86,w=244,L=[["Atria",[[0,.12,"#E8737E","contract"]]],["Ventricles",[[.12,.5,"#C8283A","contract"]]],["AV valves",[[0,.12,"#7CC47F","open"],[.12,.55,"#9AA6B2","shut"],[.55,1,"#7CC47F","open"]]],["SL valves",[[0,.17,"#9AA6B2","shut"],[.17,.5,"#7CC47F","open"],[.5,1,"#9AA6B2","shut"]]]];
      return`<svg viewBox="0 0 340 128" width="100%" role="img" aria-label="Cardiac cycle chart">${L.map(([n,b],i)=>`<text x="0" y="${22+i*24}" font-size="11.5" font-weight="700" fill="#25335A">${n}</text><rect x="${x0}" y="${10+i*24}" width="${w}" height="16" rx="3" fill="#EEF1F6"/>${b.map(([a,c,col,t])=>`<rect x="${x0+a*w}" y="${10+i*24}" width="${(c-a)*w}" height="16" rx="3" fill="${col}" opacity=".85"/><text x="${x0+(a+c)/2*w}" y="${22+i*24}" font-size="9.5" text-anchor="middle" fill="#fff" font-weight="700">${t}</text>`).join("")}`).join("")}
      <text x="${x0+.12*w}" y="124" font-size="10.5" text-anchor="middle" font-weight="800" fill="#14213D">lub</text><text x="${x0+.5*w}" y="124" font-size="10.5" text-anchor="middle" font-weight="800" fill="#14213D">dub</text><line class="cur" x1="${x0}" y1="6" x2="${x0}" y2="108" stroke="#14213D" stroke-width="2"/></svg>`},
    note:"The black line shows where the heart is in each beat. 'Lub' is the AV valves closing; 'dub' is the semilunar valves closing.",
    update(el,S){const l=el.querySelector(".cur");if(l){const x=86+S.u*244;l.setAttribute("x1",x);l.setAttribute("x2",x)}}},
  sound:{type:"none",params:S=>({vol:.6})},
  vbottom:S=>`<span class="chip glass">${HEART_PH[phaseOfHeart(S.u)]}</span><span class="chip glass">${Math.round(S.bpm)} beats/min</span>`,
  build(B){
    const {T}=B,S=this.S,e=this,wall={housing:true,roughness:.55,metalness:.05};
    const chamber=(id,meta,c,r,sc,bc,col)=>{const g=B.part(id,Object.assign({housing:true},meta));g.position.set(...c);B.sph(g,r,col,0,0,0,wall,...sc);B.sph(g,r*.84,bc,0,0,0,{transparent:true,opacity:.32,depthWrite:false},...sc);return g};
    // lungs, trachea
    const lg=B.part("LG",{n:"Lungs",d:"Blood picks up oxygen and gets rid of carbon dioxide in millions of tiny air sacs (alveoli) in the lungs.",at:[1.75,2.9,0],dir:[.5,0,0]});
    [-1,1].forEach(s=>{B.sph(lg,.9,0xE8A0A8,s*1.75,2.05,-.2,{transparent:true,opacity:.28,depthWrite:false,roughness:.8},.58,1.05,.62);for(let k=0;k<5;k++)B.tube(lg,[[s*1.05,2.6,-.5],[s*(1.3+k*.08),2.4-k*.12,-.35],[s*(1.6+k*.05),2.0-k*.25,-.2]],.012,0xD8828E,{transparent:true,opacity:.6},false,12)});
    const tr=B.part("TR",{n:"Trachea and bronchi",d:"The windpipe splits into two bronchi, one to each lung, carrying air in and out as you breathe.",at:[0,3.95,-.6],off:[0,-8]});
    B.cyl(tr,.1,.1,.9,0xE7D9C9,0,3.65,-.6);for(let k=0;k<6;k++)B.torus(tr,.105,.012,0xD8C8B5,0,3.3+k*.13,-.6,Math.PI/2,0,0);
    B.tube(tr,[[0,3.2,-.6],[.4,3.0,-.55],[1.05,2.6,-.5]],.07,0xE7D9C9,{});B.tube(tr,[[0,3.2,-.6],[-.4,3.0,-.55],[-1.05,2.6,-.5]],.07,0xE7D9C9,{});
    // chambers
    const RA=chamber("RA",{n:"Right atrium",d:"Receives oxygen-poor blood from the body through the vena cavae.",at:[-.85,2.25,.35],dir:[-.6,.3,.2]},[-.55,1.95,.15],.42,[1,1,.9],0x3A55B8,0xA8323E);
    const RV=chamber("RV",{n:"Right ventricle",d:"Pumps oxygen-poor blood to the lungs. Its wall is thinner because the lungs are close by.",at:[-.45,1.0,.75],dir:[-.4,-.2,.5]},[-.22,1.3,.3],.5,[1,1.25,.8],0x3A55B8,0xB8414D);
    const LA=chamber("LA",{n:"Left atrium",d:"Receives oxygen-rich blood from the lungs through the pulmonary veins.",at:[.85,2.25,-.2],dir:[.6,.3,-.2]},[.48,2.0,-.25],.4,[1,1,.9],0xC8283A,0xA8323E);
    const LV=chamber("LV",{n:"Left ventricle",d:"Pumps oxygen-rich blood to the whole body. It has the thickest, strongest wall in the heart.",at:[.6,.85,.25],dir:[.5,-.3,0]},[.3,1.2,-.05],.55,[1,1.3,.9],0xC8283A,0xB8414D);
    LV.rotation.z=.25;RV.rotation.z=-.15;
    const sp=B.part("SP",{n:"Septum",d:"A thick wall of muscle that keeps oxygen-rich and oxygen-poor blood apart.",at:[.05,1.55,.75],dir:[0,0,.6]});
    B.box(sp,.08,1.0,.62,0x8E2A35,.05,1.28,.12,0,0,-.12,{roughness:.6});
    // valves
    const leafs=(p,pos,n,R,up,col)=>{const g=B.grp(p);g.position.set(...pos);B.torus(g,R,.018,0xF1E3D0,0,0,0,Math.PI/2,0,0);const L=[];for(let k=0;k<n;k++){const a=k/n*6.283,pv=B.grp(g);pv.position.set(Math.cos(a)*R,0,Math.sin(a)*R);pv.rotation.y=-a;const h=R*1.05,lf=B.box(pv,.012,h,R*1.15,col,0,up?h/2:-h/2,0,0,0,0,{side:2,roughness:.4});L.push(pv)}return L};
    const tv=B.part("TV",{n:"Tricuspid valve",d:"Three flaps between the right atrium and right ventricle. It stops blood flowing back into the atrium.",at:[-.62,1.62,.55],dir:[-.3,0,.5]});
    const mv=B.part("MV",{n:"Bicuspid (mitral) valve",d:"Two flaps between the left atrium and left ventricle. Tendons (heart strings) stop the flaps turning inside out.",at:[.66,1.62,.2],dir:[.3,0,.4]});
    const sl=B.part("SL",{n:"Semilunar valves",d:"Pocket-shaped valves at the start of the pulmonary artery and the aorta. They stop blood flowing back into the ventricles.",at:[-.1,2.15,.75],dir:[0,.4,.4]});
    const TVL=leafs(tv,[-.45,1.66,.22],3,.13,false,0xF1E3D0),MVL=leafs(mv,[.42,1.66,-.13],2,.12,false,0xF1E3D0),PVL=leafs(sl,[-.1,1.95,.45],3,.09,true,0xF1E3D0),AVL=leafs(sl,[.15,1.92,.05],3,.1,true,0xF1E3D0);
    [[-.45,1.4,.24],[.42,1.38,-.13]].forEach(p=>{for(let k=0;k<4;k++)B.tube(tv,[[p[0]+Math.cos(k*1.6)*.08,p[1]+.2,p[2]+Math.sin(k*1.6)*.08],[p[0],p[1]-.2,p[2]]],.006,0xF1E3D0,{},false,6)});
    // vessels
    const vc=B.part("VC",{n:"Vena cavae",d:"The two largest veins. The superior vena cava brings blood from the head and arms; the inferior vena cava from the rest of the body.",at:[-.95,2.95,.1],dir:[-.4,.2,0]});
    B.tube(vc,[[-.62,3.15,.1],[-.6,2.6,.12],[-.58,2.3,.12]],.13,0x4057B5,{roughness:.5});B.tube(vc,[[-.62,.25,-.2],[-.62,.65,-.05],[-.6,1.2,.02],[-.58,1.6,.06]],.14,0x4057B5,{roughness:.5});
    const pa=B.part("PA",{n:"Pulmonary arteries",d:"Carry oxygen-poor blood from the right ventricle to the lungs. They are the only arteries that carry oxygen-poor blood.",at:[-.8,2.95,.35],dir:[0,.4,.3]});
    B.tube(pa,[[-.1,1.95,.45],[-.05,2.45,.5],[.1,2.7,.35]],.12,0x4A65C8,{});B.tube(pa,[[.1,2.7,.35],[.6,2.65,0],[1.25,2.5,-.05],[1.55,2.3,-.05]],.08,0x4A65C8,{});B.tube(pa,[[.1,2.7,.35],[-.2,2.72,.32],[-.6,2.75,.15],[-1.2,2.55,0],[-1.55,2.3,-.05]],.08,0x4A65C8,{});
    const ao=B.part("AO",{n:"Aorta",d:"The largest artery. It carries oxygen-rich blood from the left ventricle to the whole body. Its thick elastic wall copes with high pressure.",at:[.5,3.3,-.1],dir:[0,.5,-.2]});
    const aoP=[[.15,1.92,.05],[.12,2.45,.1],[.1,2.95,0],[.35,3.15,-.2],[.62,2.9,-.42],[.68,2.0,-.55],[.68,.6,-.55],[.5,.3,-.35]];B.tube(ao,aoP,.14,0xD03A45,{roughness:.45},false,80);
    [[.18,3.1,-.1],[.35,3.2,-.22],[.52,3.12,-.32]].forEach(p=>B.tube(ao,[p,[p[0],p[1]+.45,p[2]]],.045,0xD03A45,{}));
    const pv=B.part("PV",{n:"Pulmonary veins",d:"Bring oxygen-rich blood back from the lungs to the left atrium. They are the only veins that carry oxygen-rich blood.",at:[1.15,1.75,-.35],dir:[.4,0,-.2]});
    B.tube(pv,[[1.55,1.95,-.15],[1.0,2.0,-.3],[.72,2.0,-.3]],.07,0xD4505B,{});B.tube(pv,[[-1.55,1.95,-.15],[-1.0,2.15,-.45],[0,2.15,-.55],[.35,2.05,-.4]],.07,0xD4505B,{});
    const ca=B.part("CA",{n:"Coronary arteries",d:"Small arteries on the outside of the heart that supply the heart muscle itself with oxygen. A blockage here causes a heart attack.",at:[-.05,.75,.85],dir:[0,0,.3]});
    B.tube(ca,[[.12,1.85,.25],[0,1.6,.62],[-.05,1.1,.7],[0,.6,.5]],.022,0xE04A55,{},false,24);B.tube(ca,[[.2,1.85,.15],[.55,1.6,.4],[.75,1.2,.35],[.7,.75,.2]],.022,0xE04A55,{},false,24);
    const bc=B.part("BC",{n:"Body capillaries",d:"Tiny vessels in every organ, where oxygen and glucose pass into cells and carbon dioxide passes back into the blood.",at:[0,.1,.2],off:[0,10]});
    for(let k=0;k<7;k++){const z=-.55+k*.08;B.tube(bc,[[.5,.3,-.35],[.25,.12+Math.sin(k)*.04,z],[-.1,.15,z+.05],[-.4,.12,z],[-.62,.25,-.2]],.012,k%2?0xB04A8E:0x9A4FA8,{},false,20)}
    // flows
    const pump=()=>{const p=phaseOfHeart(S.u);return(S.bpm/72)*(p===2?1.5:p===0?.8:.35)};const sp_=()=>.1*pump();
    const RVpath=[[-.55,1.95,.15],[-.47,1.7,.22],[-.3,1.35,.3],[-.2,1.12,.32],[-.12,1.5,.42],[-.1,1.95,.45],[-.05,2.45,.5],[.1,2.7,.35]];
    const deo=[[[-.62,3.15,.1],[-.58,2.4,.12],...RVpath,[.6,2.65,0],[1.25,2.5,-.05],[1.6,2.25,-.05]],[[-.62,.25,-.2],[-.62,.6,-.05],[-.6,1.5,.05],...RVpath,[-.2,2.72,.32],[-.6,2.75,.15],[-1.2,2.55,0],[-1.6,2.25,-.05]]];
    deo.forEach((pts,i)=>B.flow({layer:"deoxy",pts,grad:[[0,"#2E58D0"],[.85,"#3A6BD8"],[1,"#8A5FD0"]],n:90,size:.09,spread:.05,speed:sp_,active:()=>1,normal:true}));
    const LVpath=[[.48,2.0,-.25],[.42,1.65,-.15],[.3,1.15,-.05],[.22,.92,0],[.18,1.4,.05],[.15,1.92,.05],[.12,2.45,.1],[.1,2.95,0]];
    const oxy=[[[1.6,2.0,-.1],[1.0,2.0,-.3],[.72,2.0,-.3],...LVpath,[.35,3.15,-.2],[.62,2.9,-.42],[.68,2.0,-.55],[.68,.6,-.55],[.5,.3,-.35],[.25,.14,-.3],[-.1,.16,-.25],[-.62,.28,-.2]],[[-1.6,2.0,-.1],[-1.0,2.15,-.45],[0,2.15,-.55],[.35,2.05,-.4],...LVpath,[.1,3.2,-.1],[.18,3.6,-.1]]];
    oxy.forEach((pts,i)=>B.flow({layer:"oxy",pts,grad:i?[[0,"#E63946"],[1,"#E63946"]]:[[0,"#E63946"],[.86,"#E63946"],[1,"#5A4FC8"]],n:110,size:.09,spread:.05,speed:sp_,active:()=>1,normal:true}));
    B.flow({layer:"oxy",pts:[[.15,1.6,.6],[.12,1.4,.62],[.02,1.0,.64]],grad:[[0,"#E63946"],[1,"#7B4FD6"]],n:12,size:.06,spread:.02,speed:()=>.25,active:()=>S.vsd?1:0});
    [-1,1].forEach(s=>{B.flow({layer:"air",pts:[[0,4.1,-.6],[0,3.2,-.6],[s*.45,3.0,-.55],[s*1.05,2.6,-.5],[s*1.55,2.1,-.2],[s*1.75,1.6,-.2]],grad:[[0,"#BFF3FA"],[1,"#8FE3F0"]],n:40,size:.06,spread:.05,speed:()=>.25*(S.brpm/12),active:()=>S.br<.45?1:0});
      B.flow({layer:"air",pts:[[s*1.75,1.6,-.2],[s*1.55,2.1,-.2],[s*1.05,2.6,-.5],[s*.45,3.0,-.55],[0,3.2,-.6],[0,4.1,-.6]],grad:[[0,"#B9C3CC"],[1,"#8C97A3"]],n:40,size:.06,spread:.05,speed:()=>.25*(S.brpm/12),active:()=>S.br>=.5&&S.br<.95?1:0})});
    let last=-1;
    return{update(dt,S,V){e.sim(S,dt);const u=S.u,ph=phaseOfHeart(u);
      const as=ph===0?Math.sin(u/.12*Math.PI):0,vs=ph===2?Math.sin((u-.17)/.33*Math.PI):ph===1?.15:0;
      [RA,LA].forEach(g=>g.scale.setScalar(1-.1*as));[RV,LV].forEach(g=>g.scale.set(1-.1*vs,1-.12*vs,1-.1*vs));
      const avOpen=ph===0||ph===4,slOpen=ph===2,ang=(L,open,up)=>L.forEach(pv=>{const lf=pv.children[0];lf.rotation.z+=((up?(open?.12:1.35):(open?-.18:-1.42))-lf.rotation.z)*Math.min(1,dt*18)});
      ang(TVL,avOpen,false);ang(MVL,avOpen,false);ang(PVL,slOpen,true);ang(AVL,slOpen,true);
      if(S._snd&&!S.paused&&last!==ph){if(ph===1)thump(1,S._vol||.6);if(ph===3)thump(2,S._vol||.6)}last=ph;
      [-1,1].forEach(()=>{});const b=.04*Math.sin(S.br*6.283);V.parts.LG&&V.parts.LG.g.scale.set(1+b,1+b*.6,1+b);
    }};
  },
  lab:{title:"VR dissection: the heart",intro:"Dissect the heart layer by layer, the way you would with a goat's heart in the school lab, then put the model back together. In a VR headset you use the scalpel and forceps with your hands; on a phone or laptop, tap each part.",start:"Start dissection",verb:"Remove",doneTitle:"Dissection complete",doneText:"You dissected the heart in a safe order and rebuilt the model."},
  workshop:[["LG","Wear gloves and an apron, then lift the lungs away to expose the heart","Gloves, dissecting board"],["TR","Remove the trachea and bronchi","Forceps"],["BC","Set aside the body capillaries model","Hands"],["AO","Find the aorta (the thickest artery) and cut it near the top","Scalpel: always cut away from you"],["PA","Cut the pulmonary arteries leaving the right ventricle","Scalpel"],["VC","Cut the vena cavae entering the right atrium","Scissors"],["PV","Cut the pulmonary veins entering the left atrium","Scissors"],["CA","Trace the coronary arteries on the surface, then lift them off","Blunt probe"],["RA","Open the right atrium","Scissors"],["TV","Lift out the tricuspid valve and its tendons","Forceps"],["LA","Open the left atrium","Scissors"],["MV","Lift out the bicuspid valve","Forceps"],["SL","Remove the semilunar valves from the arteries","Forceps"],["RV","Open the right ventricle: notice the thin wall","Scalpel"],["LV","Open the left ventricle: compare its thick wall","Scalpel"]],
  faults:[{id:"exercise",kind:"Investigation",title:"Why does my heart race when I run?",story:"In PE, Jovan measured his pulse: 72 beats a minute at rest, 158 right after a 400 m run, and 96 two minutes later. Use the model and the tests to explain what changed.",
    apply:S=>{S.act=160},clear:S=>{S.act=72},symptoms:["Pulse 72 → 158 → 96","Breathing faster","Feels hot"],
    tests:[["Look at the cardiac output gauge","It rises from about 5 L/min at rest to over 14 L/min when running: more blood every minute."],["Measure breathing rate","From about 12 to 30 breaths a minute: more oxygen in and more carbon dioxide out."],["Check blood oxygen","Still about 98%: the lungs keep the blood saturated, the heart just moves it faster."],["Measure pulse after 2 and 5 minutes rest","96, then 75: it falls back as the oxygen debt is repaid."]],
    q:"What is the best explanation?",options:["Running muscles respire faster, so they need more oxygen and glucose and make more CO₂; the heart pumps faster and harder to supply them","The heart beats faster because the blood gets thinner","Running makes the lungs smaller, so the heart must work harder","The heart rate rises only because the body is hot"],answer:0,explain:"Muscles respire faster during exercise. The heart rate and stroke volume rise to deliver more oxygen and glucose and remove more carbon dioxide; breathing rate rises for the same reason. Afterwards the rate stays high for a while to repay the oxygen debt."}],
  quiz:[{q:"Which chamber has the thickest wall?",o:["Right atrium","Left atrium","Right ventricle","Left ventricle"],a:3,e:"The left ventricle must pump blood all round the body, so it needs the most muscle.",focus:"LV"},
    {q:"What causes the 'lub' sound of the heartbeat?",o:["The atria contracting","The atrioventricular (tricuspid and bicuspid) valves closing","Blood entering the aorta","The semilunar valves opening"],a:1,e:"'Lub' is the AV valves snapping shut as the ventricles start to contract.",focus:"TV"},
    {q:"Which blood vessel carries oxygen-poor blood away from the heart?",o:["Aorta","Pulmonary vein","Pulmonary artery","Vena cava"],a:2,e:"The pulmonary artery takes oxygen-poor blood from the right ventricle to the lungs.",focus:"PA"},
    {q:"Why is it called double circulation?",o:["The heart has two sides","Blood passes through the heart twice for each complete trip round the body","There are two lungs","Blood flows in two directions"],a:1,e:"Heart → lungs → heart → body → heart: two loops, two passes through the heart.",focus:"LG"},
    {q:"What is the job of the septum?",o:["Pumps blood to the lungs","Keeps oxygen-rich and oxygen-poor blood apart","Makes the heart sounds","Supplies the heart muscle with blood"],a:1,e:"The septum separates the left and right sides so the two kinds of blood never mix.",focus:"SP"}]
};
