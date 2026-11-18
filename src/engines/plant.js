/* ===================== Biology: photosynthesis (pondweed experiment) ===================== */
ENGINES.plant={
  id:"plant",subject:"Biology",vehicle:"Photosynthesis",name:"Photosynthesis in pondweed",short:"photosynthesis experiment",specs:["Form 4 Biology","Nutrition in plants","Limiting factors","Light, CO₂, temperature"],
  intro:"Green plants make their own food from carbon dioxide and water, using light energy trapped by chlorophyll. Oxygen is given off. Here you can watch it happen in a classic school experiment with Hydrilla pondweed, and zoom into a chloroplast to see where it happens.",
  how:["Light energy is absorbed by chlorophyll inside the chloroplasts.","Water is split; oxygen is released as a by-product and escapes as bubbles from the cut stem.","Carbon dioxide, supplied by the sodium hydrogen carbonate in the water, is fixed to make glucose.","Word equation: carbon dioxide + water → glucose + oxygen (with light energy and chlorophyll).","The rate is limited by whichever factor is in shortest supply: light intensity, carbon dioxide or temperature. That is called the limiting factor.","Counting bubbles per minute, or measuring the gas collected, measures the rate."],
  layers:{light:["Light","#F4D35E"],o2:["Oxygen","#BFF3FA"],co2:["Carbon dioxide","#9AA6B2"],sugar:["Glucose","#F4A261"]},
  S:{d:15,co2:1,temp:28,slow:1,paused:false,gas:0,t:0},
  controls:[{k:"d",label:"Lamp distance",min:10,max:60,unit:" cm"},{k:"co2",type:"seg",label:"Sodium hydrogen carbonate (CO₂ supply)",options:[[0,"0%"],[.5,"0.5%"],[1,"1%"],[2,"2%"]]},{k:"temp",label:"Water temperature",min:15,max:50,unit:" °C"},{k:"slow",type:"seg",label:"Speed",options:[[1,"Real time"],[10,"Time-lapse ×10"]]}],
  camera:{pos:[1.0,2.1,5.6],tgt:[.1,.95,0]},flowSlow:S=>Math.min(3,Math.max(.6,S.slow*.4)),
  sim(S,dt){const I=Math.pow(10/S.d,2),capL=48*I,capC=6+24*S.co2;let fT=Math.exp(-Math.pow((Math.min(S.temp,33)-33)/14,2));if(S.temp>38)fT*=Math.max(0,1-(S.temp-38)/9);
    const raw=Math.min(capL,capC,60);S.rate=raw*fT;S.I=I;S.lim=fT<.6?"Temperature":capL<capC&&capL<60?"Light":capC<60?"Carbon dioxide":"None (maximum rate)";
    if(!S.paused){S.t+=dt*S.slow}},
  gauges(S){return[["Light intensity",Math.round(S.I*100),"%",Math.min(1,S.I),"#F4B400"],["CO₂ supply",S.co2,"% NaHCO₃",S.co2/2,"#8C97A3"],["Temperature",Math.round(S.temp),"°C",S.temp/50,S.temp>40?"#D93A2E":"#2A9D8F"],["Rate",Math.round(S.rate),"bubbles/min",S.rate/60,"#3A86FF"],["Oxygen collected",(S.gas*.03).toFixed(2),"mL",Math.min(1,S.gas*.03/2),"#7CC47F"],["Limiting factor",S.lim.split(" ")[0],"",1,"#EE5A24"]]},
  phase:{title:"Rate against light intensity",svg:()=>`<svg viewBox="0 0 340 150" width="100%" role="img" aria-label="Graph of rate against light intensity"><line x1="40" y1="120" x2="330" y2="120" stroke="#25335A"/><line x1="40" y1="12" x2="40" y2="120" stroke="#25335A"/><text x="185" y="142" font-size="11" text-anchor="middle" fill="#25335A">Light intensity →</text><text x="14" y="70" font-size="11" text-anchor="middle" fill="#25335A" transform="rotate(-90 14 70)">Rate →</text><path class="crv" d="" fill="none" stroke="#2A9D8F" stroke-width="2.5"/><circle class="pt" r="6" fill="#EE5A24" stroke="#fff" stroke-width="2"/><text class="lab" x="320" y="24" font-size="11" text-anchor="end" font-weight="700" fill="#EE5A24"></text></svg>`,
    note:"Carbon dioxide + water → glucose + oxygen. Where the curve goes flat, light is no longer the limiting factor: something else (CO₂ or temperature) is.",
    update(el,S){const e=ENGINES.plant,X=I=>40+Math.min(1,I/2.2)*290,Y=r=>120-r/60*105;let d="";for(let k=0;k<=40;k++){const I=k/40*2.2,T=S.temp;const r=Math.min(48*I,6+24*S.co2,60)*(S.rate/Math.max(.001,Math.min(48*S.I,6+24*S.co2,60)));d+=(k?"L":"M")+X(I).toFixed(1)+" "+Y(isFinite(r)?r:0).toFixed(1)}
      el.querySelector(".crv").setAttribute("d",d);const c=el.querySelector(".pt");c.setAttribute("cx",X(S.I));c.setAttribute("cy",Y(S.rate));el.querySelector(".lab").textContent="Limiting: "+S.lim}},
  sound:{type:"water",params:S=>({flow:Math.min(1,S.rate/60)*.6,hum:.4,vol:.45})},
  vbottom:S=>`<span class="chip glass">Lamp ${S.d} cm · ${Math.round(S.rate)} bubbles/min</span><span class="chip glass">Limiting: ${S.lim}</span>`,
  build(B){
    const {T}=B,S=this.S,e=this,glass={transparent:true,opacity:.18,roughness:.05,metalness:.1,depthWrite:false,side:2};
    B.box(null,6.4,.08,2.4,0x6B5544,.4,-.04,0,0,0,0,{roughness:.85});
    const bk=B.part("BK",{n:"Beaker, water and sodium hydrogen carbonate",d:"The sodium hydrogen carbonate dissolves to give a steady supply of carbon dioxide for the pondweed.",at:[-.5,1.35,.4],dir:[0,0,.6]});
    B.cyl(bk,.56,.52,1.25,0xCFE8F2,0,.63,0,0,0,0,glass,40,true);B.cyl(bk,.53,.5,1.02,0x6FB7D6,0,.52,0,0,0,0,{transparent:true,opacity:.2,depthWrite:false},40);B.torus(bk,.56,.012,0xE8F4F8,0,1.255,0,Math.PI/2,0,0,{transparent:true,opacity:.6});
    for(let k=0;k<5;k++)B.box(bk,.12,.008,.01,0xFFFFFF,.5,.3+k*.18,.15,0,-.3,0,{transparent:true,opacity:.6});
    const pw=B.part("PW",{n:"Pondweed (Hydrilla)",d:"A water plant often used in Malaysian school labs. Oxygen escapes as bubbles from its cut stem.",at:[-.35,.45,.3],dir:[0,0,.5]});
    const tips=[];[[-.08,.05],[.07,-.04],[0,.08]].forEach(([x,z],i)=>{const pts=[[x*2,.08,z*2],[x*1.4,.35,z*1.4],[x,.62+i*.03,z]];B.tube(pw,pts,.012,0x2E7D32,{},false,16);tips.push(pts[2]);
      for(let k=0;k<7;k++){const y=.14+k*.07,f=1-(y-.08)/.6;for(let j=0;j<4;j++){const a=j*1.57+k*.5;B.box(pw,.07,.008,.02,0x43A047,x*2*f+x*(1-f)+Math.cos(a)*.04,y,z*2*f+z*(1-f)+Math.sin(a)*.04,0,-a,.3,{side:2})}}});
    const fn=B.part("FN",{n:"Funnel",d:"Turned upside down over the pondweed to guide the oxygen bubbles into the test tube.",at:[.45,.75,.2],dir:[0,0,.5]});
    B.lathe(fn,[[.4,.12],[.36,.2],[.12,.72],[.065,.82],[.06,1.08]],0xE8F4F8,{transparent:true,opacity:.28,depthWrite:false,side:2,roughness:.05},0,0,0,0,0,0,40);
    const tt=B.part("TT",{n:"Test tube (collects oxygen)",d:"Starts full of water. Oxygen collects at the top and pushes the water down, so you can measure the volume of gas.",at:[.25,1.85,.1],dir:[0,.4,0]});
    B.cyl(tt,.085,.085,.82,0xE8F4F8,0,1.37,0,0,0,0,glass,24,true);B.sph(tt,.085,0xE8F4F8,0,1.78,0,glass,1,.6,1);
    const gasM=B.cyl(tt,.078,.078,1,0xF2FBFF,0,1.7,0,0,0,0,{transparent:true,opacity:.55,depthWrite:false},20);
    for(let k=0;k<8;k++)B.box(tt,.03,.004,.004,0x14213D,.09,1.06+k*.09,0);
    const tm=B.part("TM",{n:"Thermometer",d:"Checks that the temperature stays the same, so that light is the only thing you change (a fair test).",at:[-.7,1.65,0],dir:[-.3,.3,0]});
    B.cyl(tm,.022,.022,1.3,0xF2F4F6,-.38,.85,-.2,0,0,.12,{transparent:true,opacity:.7});B.sph(tm,.035,0xD93A2E,-.3,.23,-.2);const merc=B.cyl(tm,.008,.008,1,0xD93A2E,-.35,.5,-.2,0,0,.12);
    const rl=B.part("RL",{n:"Metre rule",d:"Measures the distance from the lamp to the pondweed. Light intensity is proportional to 1 / distance².",at:[1.5,.15,.75],off:[0,8]});
    B.box(rl,3.0,.012,.12,0xF3E2A9,1.95,.01,.62,0,0,0,{roughness:.7});for(let k=0;k<=12;k++)B.box(rl,.006,.014,k%2?.03:.06,0x14213D,.6+k*.2,.02,.58);
    const lp=B.part("LP",{n:"Lamp",d:"The light source. Moving it closer increases the light intensity reaching the plant.",at:[1.2,1.55,0],dir:[0,.5,0]});
    const lamp=B.grp(lp);B.cyl(lamp,.22,.25,.06,0x2B3445,0,.03,0);B.cyl(lamp,.025,.025,1.1,0x9AA6B2,0,.6,0,0,0,0,{metalness:.7});B.cyl(lamp,.02,.02,.4,0x9AA6B2,-.18,1.12,0,0,0,Math.PI/2,{metalness:.7});
    B.cyl(lamp,.22,.06,.3,0x14213D,-.42,1.0,0,0,0,-Math.PI/2.3,{side:2,metalness:.3},28,true);const bulb=B.sph(lamp,.09,0xFFF4C2,-.5,.98,0,{emissive:0xFFE08A,emissiveIntensity:1.2});
    const glow=new T.PointLight(0xFFE7A8,1.2,4);glow.position.set(-.55,.98,0);lamp.add(glow);
    const ch=B.part("CH",{n:"Inside a chloroplast (zoomed in)",d:"Chloroplasts contain chlorophyll, stacked in grana, which traps light energy. Glucose is made in the fluid around them (the stroma).",at:[-2.25,2.35,0]});
    const chg=B.grp(ch);chg.position.set(-2.3,1.55,0);B.sph(chg,.62,0x6BBF59,0,0,0,{transparent:true,opacity:.3,depthWrite:false},1.45,.8,.8);B.sph(chg,.64,0x2E7D32,0,0,0,{transparent:true,opacity:.18,depthWrite:false,side:1},1.45,.82,.82);
    [[-.5,.05],[-.18,-.12],[.15,.1],[.48,-.05]].forEach(([x,y])=>{for(let k=0;k<5;k++)B.cyl(chg,.13,.13,.035,0x1B5E20,x,y-.1+k*.045,0,0,0,0,{roughness:.4})});
    B.box(null,.02,1.5,.02,0x2B3445,-2.3,.55,0);
    // flows
    const lightOn=()=>Math.min(1,S.I*1.1),flo=()=>.35;
    const rayG=B.grp(null);rayG.position.set(0,.62,0);
    for(let k=0;k<3;k++)B.flow({layer:"light",pts:[[1,.36,(k-1)*.12],[.5,.2+k*.02,(k-1)*.1],[0,k*.06,(k-1)*.06]],grad:[[0,"#FFF1A8"],[1,"#F4D35E"]],n:26,size:.07,spread:.05,speed:()=>.6,active:lightOn,parent:rayG});
    B.flow({layer:"co2",pts:[[.45,.25,-.35],[.2,.3,-.2],[.05,.38,-.05],[0,.45,0]],grad:[[0,"#C5CCD3"],[1,"#8C97A3"]],n:24,size:.06,spread:.12,speed:()=>.12,active:()=>Math.min(1,.2+S.co2*.5)});
    B.flow({layer:"light",pts:[[-1.15,2.2,.2],[-1.6,1.9,.1],[-2.1,1.62,0]],grad:[[0,"#FFF1A8"],[1,"#F4D35E"]],n:24,size:.07,spread:.04,speed:flo,active:lightOn});
    B.flow({layer:"co2",pts:[[-2.3,2.5,.3],[-2.35,2.05,.15],[-2.35,1.62,0]],grad:[[0,"#C5CCD3"],[1,"#8C97A3"]],n:20,size:.06,spread:.04,speed:flo,active:()=>Math.min(1,.2+S.co2*.5)});
    B.flow({layer:"o2",pts:[[-2.1,1.62,0],[-1.6,1.25,.2],[-1.2,1.0,.3]],grad:[[0,"#E8FBFF"],[1,"#BFF3FA"]],n:20,size:.065,spread:.04,speed:flo,active:()=>Math.min(1,S.rate/40)});
    B.flow({layer:"sugar",pts:[[-2.5,1.5,0],[-2.95,1.2,-.1],[-3.3,.9,-.1]],grad:[[0,"#F4A261"],[1,"#EE5A24"]],n:16,size:.075,spread:.03,speed:flo,active:()=>Math.min(1,S.rate/40)});
    // bubbles (custom)
    const bub=[],bm=new T.MeshStandardMaterial({color:0xF2FBFF,transparent:true,opacity:.85,roughness:.05,metalness:.2});for(let i=0;i<40;i++){const m=new T.Mesh(new T.SphereGeometry(.022,10,8),bm);m.visible=false;B.V.root.add(m);bub.push({m,on:false,v:0})}
    let acc=0,popT=0;
    return{update(dt,S,V){e.sim(S,dt);const sdt=S.paused?0:dt*S.slow;
      lamp.position.x=1.05+S.d*.04;rayG.scale.x=lamp.position.x-.5;
      bulb.material.emissiveIntensity=.6+S.I*.8;glow.intensity=.4+Math.min(2,S.I*1.4);
      merc.scale.y=.25+S.temp/50*.75;merc.position.y=.23+merc.scale.y*.5*.95;
      const level=Math.min(.7,S.gas*.006);gasM.scale.y=Math.max(.001,level);gasM.position.y=1.78-level/2;
      const show=V.explode<.05&&!(V.parts.PW.removed||V.parts.FN.removed);
      acc+=sdt*S.rate/60;while(acc>=1&&show){acc-=1;const b=bub.find(x=>!x.on);if(b){const t=tips[Math.floor(Math.random()*tips.length)];b.on=true;b.m.visible=true;b.m.position.set(t[0],t[1],t[2]);b.v=.22+Math.random()*.08;b.s=.6+Math.random()*.7;b.m.scale.setScalar(b.s);if(S._snd&&popT<=0){pop(.08);popT=.06}}}
      if(!show)acc=0;popT-=dt;
      bub.forEach(b=>{if(!b.on)return;const p=b.m.position;p.y+=b.v*Math.min(sdt,.25)*(S.slow>1?3:1);if(p.y>.7){p.x*=.9;p.z*=.9}p.x+=Math.sin(p.y*30+b.s*9)*.0008;
        if(p.y>1.78-level){b.on=false;b.m.visible=false;S.gas+=1}});
      if(!show)bub.forEach(b=>{b.on=false;b.m.visible=false});
      chg.rotation.y+=dt*.15;
    }};
  },
  lab:{mode:"build",title:"VR lab: set up the experiment",intro:"Set up the pondweed experiment in the right order, then run it in Simulate. In a VR headset you pick up the apparatus with your hands; on a phone or laptop, tap the items in the tray.",start:"Start setting up",verb:"Set up",doneTitle:"Apparatus ready",doneText:"Your experiment is set up correctly. Go to Simulate to count the bubbles at different distances."},
  workshop:[["BK","Fill the beaker with water and stir in 1% sodium hydrogen carbonate","Spatula and glass rod"],["PW","Put freshly cut pondweed in the water with the cut end facing up","Cut the stem under water"],["FN","Lower the funnel upside down over the pondweed","Keep the funnel under water"],["TT","Fill a test tube with water and turn it upside down over the funnel stem","Thumb over the end: no air inside"],["TM","Place the thermometer in the water","Keep the temperature the same: a fair test"],["RL","Lay the metre rule from the beaker to the lamp","Measure to the pondweed, not the beaker"],["LP","Put the lamp 10 cm away, switch it on and wait 5 minutes before counting","Do not touch the hot bulb"]],
  faults:[{id:"co2",kind:"Investigation",title:"Moving the lamp closer did nothing",story:"Jovan moved the lamp from 20 cm to 10 cm, but the pondweed still only gave about 6 bubbles a minute. His friend says the lamp is broken. Run tests to find out what is really limiting the rate.",
    apply:S=>{S.co2=0;S.d=10;S.temp=28},clear:S=>{S.co2=1},symptoms:["Lamp at 10 cm","About 6 bubbles/min","No change from 20 cm"],
    tests:[["Measure the light intensity","It went up about 4 times: light intensity ∝ 1/distance². The lamp is fine."],["Check the water for sodium hydrogen carbonate","None was added. The water only has a little dissolved carbon dioxide."],["Read the thermometer","28 °C: a good temperature for the plant's enzymes."],["Add 1% sodium hydrogen carbonate and count again","The rate jumps to about 30 bubbles a minute."]],
    q:"What was limiting the rate?",options:["Carbon dioxide concentration","Light intensity","Temperature","The pondweed was dead"],answer:0,explain:"With no sodium hydrogen carbonate, carbon dioxide is in shortest supply, so it limits the rate. Adding more light does nothing until more CO₂ is given. This is the idea of a limiting factor."}],
  quiz:[{q:"Which gas is in the bubbles?",o:["Carbon dioxide","Oxygen","Nitrogen","Water vapour"],a:1,e:"Oxygen is a by-product of photosynthesis. It relights a glowing wooden splint.",focus:"TT"},
    {q:"Why is sodium hydrogen carbonate added to the water?",o:["To kill bacteria","To supply carbon dioxide","To keep the water warm","To make the water clear"],a:1,e:"It releases carbon dioxide, one of the raw materials for photosynthesis.",focus:"BK"},
    {q:"The lamp is moved from 20 cm to 10 cm. The light intensity becomes…",o:["Half","The same","Twice as bright","Four times as bright"],a:3,e:"Light intensity ∝ 1/d². Halving the distance gives 2² = 4 times the intensity.",focus:"LP"},
    {q:"Why does the rate fall above about 40 °C?",o:["Light is weaker","The enzymes for photosynthesis are denatured","There is too much oxygen","The water evaporates"],a:1,e:"Photosynthesis is controlled by enzymes, which lose their shape at high temperature.",focus:"TM"},
    {q:"Where in a leaf cell does photosynthesis happen?",o:["Nucleus","Mitochondrion","Chloroplast","Cell wall"],a:2,e:"Chloroplasts contain chlorophyll, which traps light energy.",focus:"CH"}]
};
