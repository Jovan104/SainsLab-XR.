/* ===================== Chemistry: electrolysis of copper(II) sulphate ===================== */
ENGINES.electro={
  id:"electro",subject:"Chemistry",vehicle:"Electrolysis",name:"Electrolysis of copper(II) sulphate",short:"electrolytic cell",specs:["Foundation Chemistry","Redox: electrolytic cell","Ions and electrons","Carbon or copper electrodes"],
  intro:"Electrolysis uses electricity to break down a compound. In this cell, a current passes through copper(II) sulphate solution. Watch the ions move, copper build up on one electrode, and gas bubble from the other. It is the same chemistry used to electroplate jewellery and purify copper.",
  how:["The solution contains Cu²⁺, SO₄²⁻, H⁺ and OH⁻ ions that move freely.","When the switch is closed, positive ions (cations) move to the cathode (−) and negative ions (anions) move to the anode (+).","At the cathode, Cu²⁺ ions gain electrons and become copper atoms: Cu²⁺ + 2e⁻ → Cu. A brown layer of copper forms.","With carbon electrodes, OH⁻ ions lose electrons at the anode: 4OH⁻ → O₂ + 2H₂O + 4e⁻. Oxygen bubbles off and the blue colour fades as Cu²⁺ is used up.","With copper electrodes, the copper anode dissolves instead: Cu → Cu²⁺ + 2e⁻. No gas forms and the blue colour stays the same.","Electrons flow through the wires from the anode to the cathode, pushed by the power supply. Ions carry the charge through the solution."],
  layers:{electrons:["Electrons in the wire","#F4D35E"],ions:["Ions in solution","#3A86FF"],gas:["Oxygen gas","#E8FBFF"]},
  S:{V:6,elec:"carbon",conc:1,sw:1,slow:60,paused:false,Q:0,t:0},
  controls:[{k:"sw",type:"seg",label:"Switch",options:[[0,"Open (off)"],[1,"Closed (on)"]]},{k:"V",label:"Voltage",min:0,max:12,unit:" V"},{k:"elec",type:"seg",label:"Electrodes",options:[["carbon","Carbon"],["copper","Copper"]],hint:S=>S.elec==="carbon"?"<b>Carbon (inert):</b> the electrodes do not react. Oxygen forms at the anode and the solution slowly turns paler.":"<b>Copper (active):</b> the anode dissolves and replaces the Cu²⁺ used at the cathode, so the colour stays the same. This is how copper is purified and objects are electroplated."},{k:"conc",type:"seg",label:"Concentration",options:[[.5,"0.5 mol/dm³"],[1,"1.0 mol/dm³"]]},{k:"slow",type:"seg",label:"Speed",options:[[1,"Real time"],[60,"Time-lapse ×60"]]}],
  onControl(S,k){if(k==="elec"){S.Q=0;S.t=0;toast("New electrodes fitted and solution replaced")}},
  camera:{pos:[1.2,2.4,5.4],tgt:[.4,1.0,0]},flowSlow:()=>1,
  sim(S,dt){const Ed=S.elec==="carbon"?1.3:.05,R=6/S.conc;S.I=S.sw?Math.max(0,(S.V-Ed)/R):0;if(!S.paused){S.Q+=S.I*dt*S.slow;S.t+=dt*S.slow}
    const F=96485;S.cu=S.Q*63.5/(2*F)*1000;S.o2=S.elec==="carbon"?S.Q/(4*F)*24000:0;S.blue=S.elec==="carbon"?Math.max(.05,1-(S.Q/(2*F))/(S.conc*.1)*5):1},
  gauges(S){return[["Voltage",S.sw?S.V:0,"V",S.V/12,"#14213D"],["Current",S.I.toFixed(2),"A",S.I/2,"#F4B400"],["Copper on cathode",Math.round(S.cu),"mg",Math.min(1,S.cu/400),"#B87333"],S.elec==="carbon"?["Oxygen at anode",S.o2.toFixed(1),"cm³",Math.min(1,S.o2/80),"#3A86FF"]:["Anode lost",Math.round(S.cu),"mg",Math.min(1,S.cu/400),"#B87333"],["Blue colour",Math.round(S.blue*100),"%",S.blue,"#3A86FF"],["Time",Math.floor(S.t/60)+":"+String(Math.floor(S.t%60)).padStart(2,"0"),"min",(S.t%3600)/3600,"#7B4FD6"]]},
  phase:{title:"What happens at each electrode",svg:()=>`<svg viewBox="0 0 340 132" width="100%" role="img" aria-label="Half equations"><rect x="0" y="4" width="166" height="124" rx="10" fill="#EEF1F6"/><rect x="174" y="4" width="166" height="124" rx="10" fill="#EEF1F6"/>
      <text x="83" y="24" font-size="12" font-weight="800" text-anchor="middle" fill="#14213D">Cathode (−)</text><text x="83" y="40" font-size="10.5" text-anchor="middle" fill="#586676">reduction: gains electrons</text><text x="83" y="70" font-size="14" font-weight="700" text-anchor="middle" fill="#B87333">Cu²⁺ + 2e⁻ → Cu</text><text x="83" y="96" font-size="10.5" text-anchor="middle" fill="#586676">brown copper forms</text>
      <text x="257" y="24" font-size="12" font-weight="800" text-anchor="middle" fill="#14213D">Anode (+)</text><text x="257" y="40" font-size="10.5" text-anchor="middle" fill="#586676">oxidation: loses electrons</text><text class="aeq" x="257" y="70" font-size="12.5" font-weight="700" text-anchor="middle" fill="#3A86FF"></text><text class="aob" x="257" y="96" font-size="10.5" text-anchor="middle" fill="#586676"></text><text class="on" x="170" y="122" font-size="10.5" text-anchor="middle" font-weight="700" fill="#EE5A24"></text></svg>`,
    note:"Cations go to the cathode, anions to the anode. Which ion is discharged depends on the electrode and on the ions' positions in the electrochemical series.",
    update(el,S){const c=S.elec==="carbon";el.querySelector(".aeq").textContent=c?"4OH⁻ → O₂ + 2H₂O + 4e⁻":"Cu → Cu²⁺ + 2e⁻";el.querySelector(".aob").textContent=c?"oxygen bubbles; colour fades":"anode gets thinner; colour stays";el.querySelector(".on").textContent=S.I>0?"":"Switch is open: no current, no reaction"}},
  sound:{type:"water",params:S=>({flow:S.elec==="carbon"?Math.min(1,S.I*.7):0,hum:S.I>0?.5:0,vol:.4})},
  vbottom:S=>`<span class="chip glass">${S.sw?S.I.toFixed(2)+" A":"Switch open"} · ${S.elec==="carbon"?"Carbon":"Copper"} electrodes</span>`,
  build(B){
    const {T}=B,S=this.S,e=this,glass={transparent:true,opacity:.2,roughness:.05,depthWrite:false,side:2},Y0=.12,Y1=1.05,R=.66,CX=-.3,AX=.3;
    B.box(null,5.6,.08,2.4,0x6B5544,.8,-.04,0,0,0,0,{roughness:.85});
    const bk=B.part("BK",{n:"Beaker of copper(II) sulphate solution",d:"The electrolyte. Its blue colour comes from Cu²⁺ ions, so the colour tells you how many are left.",at:[-.65,1.4,.4],dir:[0,0,.6]});
    B.cyl(bk,R,R-.03,1.3,0xCFE8F2,0,.65,0,0,0,0,glass,44,true);const liq=B.cyl(bk,R-.02,R-.05,Y1-Y0,0x2F7BE0,0,(Y0+Y1)/2,0,0,0,0,{transparent:true,opacity:.32,depthWrite:false},44);
    const ca=B.part("CA",{n:"Cathode (−)",d:"Connected to the negative terminal. Cu²⁺ ions gain electrons here and copper is deposited.",at:[-.55,2.0,0],dir:[-.25,.3,0]});
    B.cyl(ca,.045,.045,1.5,0x444B55,CX,.95,0,0,0,0,{roughness:.6});const coat=B.cyl(ca,1,1,Y1-.3,0xB87333,CX,(.3+Y1)/2,0,0,0,0,{roughness:.35,metalness:.6},20);
    const an=B.part("AN",{n:"Anode (+)",d:"Connected to the positive terminal. Here ions or the electrode itself lose electrons.",at:[.55,2.0,0],dir:[.25,.3,0]});
    const anC=B.cyl(an,.045,.045,1.5,0x444B55,AX,.95,0,0,0,0,{roughness:.6}),anCu=B.cyl(an,1,1,1.5,0xC27A3A,AX,.95,0,0,0,0,{roughness:.3,metalness:.7},20);
    const ps=B.part("PS",{n:"Power supply",d:"Pushes electrons round the circuit: out of the negative terminal to the cathode, and back into the positive terminal from the anode.",at:[2.1,.95,0],dir:[.4,0,0]});
    B.box(ps,.9,.6,.6,0x2B3445,2.1,.3,0,0,0,0,{roughness:.5});B.box(ps,.5,.18,.02,0x8EF0B0,2.1,.42,.31,0,0,0,{emissive:0x2E9D5A,emissiveIntensity:.6});const vtxt=B.box(ps,.3,.08,.02,0x14213D,2.1,.42,.32);
    B.cyl(ps,.05,.05,.08,0xD93A2E,2.4,.65,.15);B.cyl(ps,.05,.05,.08,0x14213D,1.8,.65,.15);
    const am=B.part("AM",{n:"Ammeter",d:"Connected in series to measure the current. More current means faster electrolysis.",at:[.95,2.55,0],dir:[0,.3,0]});
    const amg=B.grp(am);amg.position.set(.95,2.18,0);B.cyl(amg,.25,.25,.1,0xF2F4F6,0,0,0,Math.PI/2,0,0);B.torus(amg,.25,.025,0x2B3445,0,0,.05,0,0,0);const needle=B.box(amg,.01,.2,.01,0xD93A2E,0,.1,.06);needle.geometry.translate(0,0,0);const nd=B.grp(amg);nd.position.set(0,-.08,.06);nd.add(needle);needle.position.set(0,.1,0);
    const sw=B.part("SW",{n:"Switch",d:"Completes the circuit. With the switch open, no current flows and nothing happens.",at:[1.55,2.35,0],dir:[0,.3,0]});
    B.box(sw,.3,.05,.14,0x2B3445,1.55,2.05,0);const lever=B.box(sw,.28,.025,.04,0xC9D0D8,1.55,2.1,0,0,0,0,{metalness:.7});lever.geometry.translate(.14,0,0);lever.position.x=1.41;
    const wr=B.part("WR",{n:"Connecting wires",d:"Carry electrons between the electrodes and the power supply.",at:[.0,2.3,0],dir:[0,.3,0]});
    const WA=[[AX,1.7,0],[AX,2.05,0],[.7,2.18,0]],WB=[[1.2,2.18,0],[1.38,2.08,0]],WC=[[1.72,2.08,0],[2.0,2.0,0],[2.4,1.3,.15],[2.4,.7,.15]],WD=[[1.8,.7,.15],[1.75,1.4,.1],[1.0,2.55,.05],[-.3,2.55,0],[CX,2.0,0],[CX,1.7,0]];
    [WA,WB,WC,WD].forEach((w,i)=>B.tube(wr,w,.018,i===3?0x14213D:0xD93A2E,{},false,30));
    const io=B.part("IO",{n:"Ions in the solution",d:"Blue = Cu²⁺, yellow = SO₄²⁻, red = OH⁻, white = H⁺. Watch them drift towards the electrodes when the current flows.",at:[0,.55,.75],off:[0,8]});
    // electron flow: anode -> + terminal -> - terminal -> cathode
    const on=()=>S.I>0?Math.min(1,.35+S.I*.6):0,sp=()=>.08+S.I*.12;
    B.flow({layer:"electrons",pts:[[AX,1.05,0],...WA,[.95,2.18,.08],...WB,[1.55,2.1,.04],...WC],grad:[[0,"#FFE680"],[1,"#F4D35E"]],n:46,size:.06,spread:.012,speed:sp,active:on,normal:true});
    B.flow({layer:"electrons",pts:[...WD.slice().reverse().reverse(),[CX,1.05,0]],grad:[[0,"#FFE680"],[1,"#F4D35E"]],n:46,size:.06,spread:.012,speed:sp,active:on,normal:true});
    // ions (custom points)
    const N=170,pos=new Float32Array(N*3),col=new Float32Array(N*3),kind=new Uint8Array(N),cols=[[.23,.53,1],[.96,.83,.37],[.9,.22,.27],[1,1,1]];
    const spawn=(i,x)=>{const a=Math.random()*6.283,r=Math.sqrt(Math.random())*(R-.1);pos[i*3]=x??Math.cos(a)*r;pos[i*3+1]=Y0+.08+Math.random()*(Y1-Y0-.14);pos[i*3+2]=Math.sin(a)*r*.9};
    for(let i=0;i<N;i++){kind[i]=i<55?0:i<100?1:i<135?2:3;spawn(i);const c=cols[kind[i]];col.set(c,i*3)}
    const g=new T.BufferGeometry();g.setAttribute("position",new T.BufferAttribute(pos,3));g.setAttribute("color",new T.BufferAttribute(col,3));
    const pm=new T.PointsMaterial({size:.075,map:new T.CanvasTexture(DOT_TEX),vertexColors:true,transparent:true,depthWrite:false,alphaTest:.15});const ions=new T.Points(g,pm);ions.frustumCulled=false;ions.renderOrder=6;io.add(ions);
    const bub=[],bm=new T.MeshStandardMaterial({color:0xF2FBFF,transparent:true,opacity:.85,roughness:.05});for(let i=0;i<30;i++){const m=new T.Mesh(new T.SphereGeometry(.02,8,6),bm);m.visible=false;an.add(m);bub.push({m,on:false})}
    let gasAcc=0,popT=0;
    return{update(dt,S,V){e.sim(S,dt);const sdt=S.paused?0:dt,drift=S.I*.25,cu=S.elec==="copper";
      liq.material.color.setRGB(.18+.6*(1-S.blue),.48+.35*(1-S.blue),.88);liq.material.opacity=.14+.24*S.blue;
      const dep=Math.min(.035,S.cu/400*.035);coat.scale.set(.046+dep,1,.046+dep);coat.visible=S.cu>1;
      anC.visible=!cu;anCu.visible=cu;const thin=Math.max(.02,.05-Math.min(.03,S.cu/400*.03));anCu.scale.set(thin,1,thin);
      lever.rotation.z=S.sw?0:.5;nd.rotation.z=-Math.min(1.2,S.I*.9)+.6;
      const show=V.layers.ions!==false&&V.explode<.05&&!V.parts.BK.removed;ions.visible=show;
      for(let i=0;i<N;i++){const k=kind[i],j=i*3;let x=pos[j],y=pos[j+1],z=pos[j+2];x+=(Math.random()-.5)*.012;y+=(Math.random()-.5)*.012;z+=(Math.random()-.5)*.012;
        const tgt=(k===0||k===3)?CX:AX;x+=Math.sign(tgt-x)*drift*sdt*(k===3?.6:1);z*=1-drift*sdt*.6;
        if(Math.hypot(x,z)>R-.08){x*=.97;z*=.97}y=clamp(y,Y0+.04,Y1-.04);
        if(S.I>0&&Math.abs(x-tgt)<.06&&Math.abs(z)<.12){if(k===0){spawn(i,cu?AX+(Math.random()-.5)*.05:undefined)}else if(k===2&&!cu){spawn(i);gasAcc+=.5}else{x=tgt+Math.sign(x-tgt||1)*.07}}
        if(!S.I||k===1||k===3){} pos[j]=x;pos[j+1]=y;pos[j+2]=z;
        if(k===0){const b=.35+.65*S.blue;col[j]=.23*b+(1-b)*.6;col[j+1]=.53*b+(1-b)*.7;col[j+2]=1}}
      g.attributes.position.needsUpdate=true;g.attributes.color.needsUpdate=true;
      if(!cu&&S.I>0&&!S.paused){gasAcc+=dt*S.I*6;while(gasAcc>=1){gasAcc-=1;const b=bub.find(x=>!x.on);if(b&&V.layers.gas!==false){b.on=true;b.m.visible=true;b.m.position.set(AX+(Math.random()-.5)*.1,.35+Math.random()*.6,(Math.random()-.5)*.1);if(S._snd&&popT<=0){pop(.06);popT=.09}}}}
      popT-=dt;bub.forEach(b=>{if(!b.on)return;b.m.position.y+=dt*.5;if(b.m.position.y>Y1){b.on=false;b.m.visible=false}});
    }};
  },
  lab:{mode:"build",title:"VR lab: build the electrolytic cell",intro:"Build the cell in the right order with the right safety steps, then switch it on in Simulate. In a VR headset you pick up and connect the apparatus with your hands; on a phone or laptop, tap the items in the tray.",start:"Start building",verb:"Set up",doneTitle:"Cell ready",doneText:"Your electrolytic cell is built and connected correctly. Go to Simulate and close the switch."},
  workshop:[["BK","Put on goggles and gloves, then half-fill the beaker with copper(II) sulphate solution","Copper(II) sulphate is harmful: avoid skin contact"],["CA","Clean the cathode with sandpaper, weigh it and clamp it in the solution","Electronic balance"],["AN","Clamp the anode in the solution so the electrodes do not touch","Retort stand and clamp"],["PS","Place the power supply and set it to 0 V","Switch off at the mains first"],["WR","Connect the cathode to the negative (−) terminal and the anode to the positive (+) terminal","Crocodile clips"],["AM","Connect the ammeter in series","Red to +, black to −"],["SW","Add the switch, close it and set the supply to 6 V","Watch the ammeter reading"]],
  faults:[{id:"elec",kind:"Investigation",title:"The blue colour is fading",story:"Mei Ling's lecturer asked for copper electrodes, but after 20 minutes her solution is paler and gas bubbles are coming off one electrode. She thinks the solution was too weak. Run tests to find out what is really going on.",
    apply:S=>{S.elec="carbon";S.sw=1;S.V=6;S.slow=60;S.Q=2600;S.t=1200},clear:S=>{S.elec="copper";S.Q=0;S.t=0},symptoms:["Solution paler","Bubbles at the anode","Cathode turning brown"],
    tests:[["Look closely at the anode","It is grey and is not getting any thinner."],["Test the gas with a glowing wooden splint","The splint relights: the gas is oxygen."],["Weigh the cathode","It has gained about 0.9 g: copper is still being deposited."],["Check the concentration label","1.0 mol/dm³, as the worksheet says."]],
    q:"What explains her results?",options:["The anode is carbon, not copper, so OH⁻ ions are discharged and Cu²⁺ is used up","The voltage is too high","The solution is too dilute","The cathode is connected to the positive terminal"],answer:0,explain:"An inert carbon anode does not dissolve, so hydroxide ions are discharged to give oxygen, and the Cu²⁺ ions removed at the cathode are not replaced, so the colour fades. With a copper anode, copper atoms dissolve as Cu²⁺ and the colour stays the same."}],
  quiz:[{q:"What forms on the cathode?",o:["Oxygen","Hydrogen","Copper","Sulphur"],a:2,e:"Cu²⁺ ions gain two electrons each and become copper atoms: Cu²⁺ + 2e⁻ → Cu.",focus:"CA"},
    {q:"With carbon electrodes, which gas is given off at the anode?",o:["Oxygen","Hydrogen","Chlorine","Carbon dioxide"],a:0,e:"Hydroxide ions lose electrons: 4OH⁻ → O₂ + 2H₂O + 4e⁻.",focus:"AN"},
    {q:"Why does the blue colour stay the same with copper electrodes?",o:["No current flows","The copper anode dissolves and replaces the Cu²⁺ ions","Sulphate ions turn blue","The cathode dissolves"],a:1,e:"Copper atoms at the anode become Cu²⁺ ions as fast as Cu²⁺ is removed at the cathode.",focus:"AN"},
    {q:"Which ions move towards the cathode?",o:["SO₄²⁻ and OH⁻","Cu²⁺ and H⁺","Only OH⁻","Only SO₄²⁻"],a:1,e:"Positive ions (cations) are attracted to the negative electrode.",focus:"IO"},
    {q:"Which everyday process uses this kind of cell with a copper anode?",o:["Making plastic","Electroplating and purifying copper","Burning fuel","Making salt"],a:1,e:"Copper is moved from the anode to the cathode, so it can coat an object or purify copper.",focus:"CA"}]
};
