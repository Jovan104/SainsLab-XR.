/* ===================== Bullet train: 25 kV AC electric traction ===================== */
ENGINES.train={
  lab:{title:"VR workshop: strip down the traction system",intro:"Take it apart in the right order, then build it back up. In a VR headset you grab each part with your hands; on a phone or laptop, tap it.",start:"Start strip-down",verb:"Remove",doneTitle:"Rebuilt",doneText:"You stripped and rebuilt it in the right order."},
  id:"train",subject:"Engineering",vehicle:"Bullet train",name:"High-speed electric traction",short:"Traction",specs:["Engineering extension","25 kV 50 Hz AC","VVVF IGBT inverters","4 × 305 kW induction motors per car","Regenerative braking","320 km/h"],
  intro:"High-speed trains have no engine on board. They take electricity from an overhead wire, the same 25 kV supply used on Malaysia's ETS line, and turn it into motion with electric motors hidden in the bogies.",
  how:["The pantograph on the roof slides along the overhead contact wire and collects 25,000 volt AC electricity.","The main transformer under the floor steps the voltage down to about 1,500 volts so it is safe to handle.","A converter turns the AC into steady DC. Then the VVVF inverter (variable voltage, variable frequency) chops that DC back into three-phase AC at whatever frequency the motors need.","In each traction motor the three-phase current makes a magnetic field that spins around the stator. It drags the rotor round slightly slower than itself. That difference is called slip.","A small gear on the motor drives a big gear on the axle (about 2.79 : 1), so the wheels turn. The current returns to the substation through the wheels and rails.","When the driver brakes, the inverter makes the field turn slower than the rotor. The motors become generators and push power back into the overhead wire for other trains to use."],
  layers:{power:["Electric power (motoring)","#F5B800"],regen:["Power returned (regen braking)","#2ED47A"],air:["Cooling air","#9FD8FF"]},
  S:{mc:2,pan:1,slow:.05,ts:1,v:33.3,paused:false,inv2:1,blk:0,ph:0,fa:0,ra:0,wa:0,tx:0},
  controls:[{k:"mc",label:"Brake ◂ notch ▸ power",min:-5,max:5,unit:""},{k:"pan",type:"seg",label:"Pantograph",options:[[1,"Raised"],[0,"Lowered"]]},{k:"ts",type:"seg",label:"Journey time",options:[[1,"Real time"],[10,"Fast forward ×10"]]},{k:"slow",type:"seg",label:"Moving parts",options:[[.05,"Slow motion"],[.25,"×0.25"],[1,"Real speed"]]}],
  camera:{pos:[5.4,4.0,10.4],tgt:[.3,1.5,0]},flowSlow:()=>.8,
  M:756e3,PMAX:17e6,FMAX:504e3,D:.86,G:2.79,
  onControl(S,k){if(k==="pan")toast(S.pan?"Pantograph raised: 25 kV available":"Pantograph lowered: no power, air brakes only");if(k==="mc"&&S.mc<0&&!S.pan)toast("No overhead power: braking with air brakes only, no regeneration")},
  sim(S,dt){const e=this,v=S.v,h=dt*S.ts,half=S.inv2?1:.5,Pm=e.PMAX*half,Fm=e.FMAX*half,lim=320/3.6;
    const R=v>.05?(10+.3*v+.012*v*v)*1e3:0;let F=0,Fe=0,Fa=0;
    if(S.mc>0&&S.pan){F=Math.min(Fm*S.mc/5,Pm*S.mc/5/Math.max(v,1));if(v>=lim)F=Math.min(F,R)}
    if(S.mc<0&&v>.05){const Fb=600e3*(-S.mc/5);Fe=S.pan&&v>1.4?Math.min(Fb,Pm/Math.max(v,1)):0;Fa=Fb-Fe}
    const a=(F-Fe-Fa-R)/(e.M*1.08);S.v=Math.max(0,v+a*h);S.acc=a;S.F=F-Fe-Fa;S.P=F>0?F*v:-Fe*v;S.Fe=Fe;S.Fa=Fa;
    const rps=S.v/(Math.PI*e.D)*e.G;S.rpm=rps*60;const fs=2*rps;S.slip=F>0?1.2+1.6*S.mc/5:Fe>0?-(1.2+1.6*Fe/600e3):0;S.f=Math.max(0,fs+S.slip);
    S.wa+=S.v/(e.D/2)*dt*S.slow;S.tx+=S.v*dt*S.slow;S.fa+=S.f*dt*S.slow*6.283;S.ra+=(S.f-S.slip)*dt*S.slow*6.283;S.ph=(S.ph+S.f*dt*Math.min(1,S.slow*4))%2;
    S.heat=(S.heat||0)+((S.blk?Math.min(1,Math.abs(S.P)/8e6):0)-(S.heat||0))*dt*.5},
  gauges(S){const kmh=S.v*3.6;return[["Speed",Math.round(kmh),"km/h",kmh/330,"#0F1B2A"],["Line voltage",S.pan?"25.0":"0","kV",S.pan?1:0,"#F5B800"],["Power from wire",(S.P/1e6).toFixed(1),"MW",Math.abs(S.P)/this.PMAX,S.P<0?"#2ED47A":"#F5B800"],["Tractive force",Math.round(S.F/1e3),"kN",Math.abs(S.F)/600e3,S.F<0?"#2ED47A":"#FF5A1F"],["Inverter output",S.f.toFixed(1),"Hz",S.f/180,"#E040FB"],["Motor slip",S.slip.toFixed(1),"Hz",Math.abs(S.slip)/3,"#7C83E8"]]},
  phase:{title:"Inverter output: three-phase AC",svg:()=>{const W=340,H=112,x0=18,w=310,mid=56,amp=36,cols=["#FF5A1F","#F5B800","#3C8DFF"];
      const path=k=>{let d="";for(let i=0;i<=120;i++){const x=x0+i/120*w,y=mid-amp*Math.sin(i/120*2*6.283-k*2.094);d+=(i?"L":"M")+x.toFixed(1)+" "+y.toFixed(1)}return d};
      return`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Three phase waves U V W"><line x1="${x0}" y1="${mid}" x2="${x0+w}" y2="${mid}" stroke="#C9D2DB"/>${[0,1,2].map(k=>`<path d="${path(k)}" fill="none" stroke="${cols[k]}" stroke-width="2.2"/>`).join("")}
      ${["U","V","W"].map((n,k)=>`<text x="${x0+4+k*22}" y="${H-4}" font-size="11" font-weight="700" fill="${cols[k]}">${n}</text>`).join("")}<text class="fq" x="${W-6}" y="${H-4}" font-size="11" text-anchor="end" fill="#41505F">0 Hz</text><line class="cur" x1="${x0}" y1="10" x2="${x0}" y2="${H-18}" stroke="#0F1B2A" stroke-width="2"/></svg>`},
    note:"Three currents 120° apart. As the train speeds up the inverter raises the frequency (and voltage), so the magnetic field spins faster. At low speed you hear it change in steps.",
    update(el,S){const l=el.querySelector(".cur");if(l){const x=18+S.ph/2*310;l.setAttribute("x1",x);l.setAttribute("x2",x)}const t=el.querySelector(".fq");if(t)t.textContent=S.f.toFixed(1)+" Hz · "+(S.P<0?"regen":S.P>0?"motoring":"coasting")}},
  sound:{type:"electric",params:S=>({speed:S.v*3.6,power:Math.min(1,Math.abs(S.P)/ENGINES.train.PMAX*1.6),vol:.55})},
  vbottom:S=>`<span class="chip glass">${S.mc>0?"Power P"+S.mc:S.mc<0?"Brake B"+(-S.mc):"Coast"} · ${Math.round(S.v*3.6)} km/h</span>${S.v*3.6>=319?`<span class="chip glass">ATC limit 320</span>`:""}${S.P<-1e5?`<span class="chip" style="background:#2ED47A;color:#062">Regenerating ${(-S.P/1e6).toFixed(1)} MW</span>`:""}${!S.pan?`<span class="chip" style="background:var(--elec);color:#000">Pantograph down</span>`:""}${!S.inv2?`<span class="chip" style="background:var(--bad);color:#fff">CI 2 cut out</span>`:""}`,
  build(B){
    const {T}=B,S=this.S,WR=.43,WY=.61,BX=[-2.3,2.6],AX=[],e=this;
    BX.forEach(b=>AX.push(b-.62,b+.62));
    const link=(m,p,q)=>{const dx=q[0]-p[0],dy=q[1]-p[1];m.position.set((p[0]+q[0])/2,(p[1]+q[1])/2,m.position.z);m.scale.x=Math.hypot(dx,dy);m.rotation.z=Math.atan2(dy,dx)};
    // ---- track
    const tr=B.part("TR",{n:"Rails (return current path)",d:"Standard-gauge rails. Current goes back to the substation through the wheels and the rails.",at:[-4.6,.2,.72],off:[0,10]});
    B.box(tr,20,.16,2.6,0x55606B,0,.0,0,0,0,0,{roughness:.95});[-.72,.72].forEach(z=>{B.box(tr,20,.1,.07,0xB7C0C9,0,.15,z,0,0,0,{metalness:.8,roughness:.3})});
    const sl=B.inst(tr,new T.BoxGeometry(.22,.07,1.9),0x6E655C,{roughness:.9},34),M4=new T.Matrix4();
    const masts=[0,1,2].map(i=>{const g=B.grp(tr);B.cyl(g,.06,.07,4.3,0x8E99A5,0,2.15,-1.7);B.box(g,.06,.06,1.75,0x8E99A5,0,4.25,-.85,0,0,0);B.box(g,.03,.5,.03,0x8E99A5,0,4.0,-.05);return g});
    // ---- overhead line
    const oc=B.part("OC",{n:"Overhead contact wire",d:"Carries 25 kV 50 Hz AC from the substation. A messenger wire above holds it level with droppers.",at:[1.2,3.78,0],off:[0,-12]});
    B.cyl(oc,.014,.014,20,0xC9A447,0,3.76,0,0,0,Math.PI/2,{metalness:.8});B.cyl(oc,.012,.012,20,0x9AA6B2,0,4.25,0,0,0,Math.PI/2,{metalness:.7});
    const drop=[];for(let i=0;i<22;i++)drop.push(B.box(oc,.008,.49,.008,0x9AA6B2,-10+i,4.0,0));
    // ---- car body (housing)
    const cb=B.part("CB",{n:"Car body",d:"A light aluminium shell. The long nose cuts air resistance and the 'tunnel boom' when entering tunnels.",at:[-2.8,2.95,.6],housing:true});
    const white={housing:true,roughness:.3,metalness:.15};
    B.box(cb,5.4,1.64,1.7,0xF4F6F8,-.5,2.07,0,0,0,0,white);
    const prof=[];for(let i=0;i<=24;i++){const y=i/24*2.45;prof.push([Math.max(.001,Math.pow(Math.max(0,1-Math.pow(y/2.45,1.7)),.62)),y])}
    const nose=B.lathe(cb,prof,0xF4F6F8,white,2.2,2.07,0,0,0,-Math.PI/2);nose.scale.set(.82,1,.85);
    B.box(cb,5.4,.1,1.72,0x1F4E9E,-.5,1.55,0,0,0,0,white);
    [-.86,.86].forEach(z=>B.box(cb,4.9,.3,.02,0x23303C,-.6,2.3,z,0,0,0,{housing:true,roughness:.2}));
    [-.84,.84].forEach(z=>{B.box(cb,1.75,.5,.02,0xDCE1E6,-.25,1.0,z,0,0,0,{housing:true});B.box(cb,.3,.5,.02,0xDCE1E6,3.35,1.0,z,0,0,0,{housing:true})});
    B.box(cb,.3,.3,.4,0x55606B,-3.3,1.25,0,0,0,0,{metalness:.5});
    for(let i=0;i<6;i++)[-.45,.45].forEach(z=>{B.box(cb,.08,.5,.6,0x2F5FB3,-2.6+i*.75,1.6,z);B.box(cb,.4,.08,.6,0x2F5FB3,-2.42+i*.75,1.4,z)});
    // ---- pantograph
    const pg=B.part("PG",{n:"Pantograph",d:"A spring-loaded arm on the roof that presses a carbon strip against the contact wire to collect current. Only one is raised per unit.",at:[-1.6,3.5,.3],dir:[0,.6,0]});
    B.box(pg,.7,.06,.6,0x55606B,-1.75,2.94,0);[-.2,.2].forEach(z=>B.cyl(pg,.04,.05,.14,0xA0522D,-1.75,3.0,z));
    const arm1=B.box(pg,1,.035,.035,0x9AA6B2,0,0,0,0,0,0,{metalness:.7}),arm2=B.box(pg,1,.03,.03,0x9AA6B2,0,0,0,0,0,0,{metalness:.7});
    const head=B.grp(pg);B.box(head,.06,.04,.9,0x3B434C,0,0,0);B.box(head,.04,.03,.8,0x222,0,.03,0);const arc=B.sph(head,.05,0xFFFFFF,0,.07,0,{emissive:0x9FD8FF,emissiveIntensity:2});
    // ---- roof HV + VCB
    const hv=B.part("HV",{n:"Roof cable and circuit breaker",d:"A thick insulated cable takes 25 kV from the pantograph to the transformer. The vacuum circuit breaker (VCB) can cut the supply in milliseconds.",at:[-.6,3.15,.3],dir:[0,.4,0]});
    B.box(hv,.4,.22,.34,0x8E99A5,-.85,3.0,0);[-.85].forEach(x=>{for(let k=0;k<4;k++)B.cyl(hv,.06,.06,.03,0xA0522D,x,3.14+k*.035,0)});
    B.tube(hv,[[-1.6,2.98,.12],[-1.2,2.99,.12],[-.85,3.0,.12],[0,2.99,.12],[.6,2.95,.4],[.85,2.6,.78],[.85,1.7,.78],[.85,1.2,.55]],.03,0x1B1F24,{});
    // ---- underfloor: transformer + converter/inverter
    const mt=B.part("MT",{n:"Main transformer",d:"Steps 25 kV down to about 1.5 kV for the converters. It is oil-cooled and is the heaviest single item on the train.",at:[1.0,.68,.62],dir:[0,-.6,0]});
    B.box(mt,1.1,.44,1.2,0x4A5562,.85,.96,0,0,0,0,{metalness:.4});for(let k=0;k<8;k++)B.box(mt,.04,.36,.2,0x6B7784,.38+k*.13,.96,.66);
    const coils=[-.25,.25].map(z=>B.cyl(mt,.14,.14,.38,0xC97B2E,.85,.96,z,0,0,0,{metalness:.6,transparent:true,opacity:.0}));
    const ci=B.part("CI",{n:"Converter and VVVF inverter",d:"IGBT power electronics. The converter makes DC; the inverter switches it thousands of times a second to build three-phase AC at the frequency the motors need.",at:[-.55,.66,.62],dir:[0,-.6,0]});
    const cib=B.box(ci,1.05,.44,1.2,0x37414C,-.55,.96,0,0,0,0,{metalness:.4});for(let k=0;k<6;k++)B.box(ci,.12,.3,.02,0xC8D0D8,-.95+k*.16,.96,.61);
    const fan=B.grp(ci);fan.position.set(-.55,.96,-.61);for(let k=0;k<5;k++)B.box(fan,.3,.05,.01,0x9AA6B2,0,0,0,0,0,k*1.256);B.torus(ci,.18,.012,0x9AA6B2,-.55,.96,-.61,0,0,0);
    // skirts (housing) hide the underfloor kit
    [-.85,.85].forEach(z=>B.box(cb,2.55,.48,.02,0xE8ECF0,.15,.98,z,0,0,0,{housing:true}));
    // ---- bogies
    const bg=B.part("BG",{n:"Bogie frames and air springs",d:"Each car rides on two bogies. Air springs give a smooth ride and keep the floor at the same height whatever the load.",at:[-2.3,1.1,.95],dir:[0,0,.9]});
    const ws=B.part("WS",{n:"Wheelsets",d:"Steel wheels pressed onto axles, 860 mm across. Their coned treads steer the train round curves.",at:[-1.68,.25,.95],dir:[0,-.35,0],off:[0,8]});
    const tm=B.part("TM",{n:"Traction motors",d:"Three-phase induction motors, about 305 kW each, one per axle. No brushes and no commutator, so very little maintenance.",at:[2.39,.61,.5],dir:[0,0,1.2]});
    const gb=B.part("GB",{n:"Gearboxes",d:"A pinion on the motor drives a large gear on the axle. The ratio is about 2.79 : 1.",at:[-2.51,.61,.62],dir:[0,0,1.6]});
    const wheels=[],pins=[],rotors=[];
    BX.forEach(b=>{B.box(bg,2.1,.16,.3,0x4A5562,b,.82,.55,0,0,0,{metalness:.4});B.box(bg,2.1,.16,.3,0x4A5562,b,.82,-.55);B.box(bg,.3,.14,1.1,0x4A5562,b,.82,0);
      [-.5,.5].forEach(z=>{B.cyl(bg,.2,.2,.22,0x1B1F24,b,1.02,z);});[-1,1].forEach(s=>[-.72,.72].forEach(z=>B.helix(bg,.07,.18,4,.016,0x8E99A5,b+s*.62,.72,z)))});
    AX.forEach((x,i)=>{const g=B.grp(ws);g.position.set(x,WY,0);B.cyl(g,.06,.06,1.62,0xA9B4BF,0,0,0,Math.PI/2,0,0,{metalness:.8});
      [-.72,.72].forEach(z=>{B.cyl(g,WR,WR,.09,0x9AA6B2,0,0,z,Math.PI/2,0,0,{metalness:.75,roughness:.3});B.cyl(g,WR+.025,WR+.025,.025,0x7E8A96,0,0,z*.94,Math.PI/2,0,0,{metalness:.7});B.box(g,.06,.32,.03,0x3B434C,0,.18,z*1.07);B.cyl(g,.18,.18,.04,0x3B434C,0,0,z*1.07,Math.PI/2,0,0)});
      wheels.push(g);
      const bgc=BX[Math.floor(i/2)],s=x<bgc?1:-1,mx=x+s*.41;
      const gg=B.grp(gb);gg.position.set(x,WY,.42);B.cyl(gg,.3,.3,.07,0xC9A447,0,0,0,Math.PI/2,0,0,{metalness:.7});for(let k=0;k<12;k++)B.box(gg,.05,.04,.075,0x8A6E2F,Math.cos(k*.5236)*.3,Math.sin(k*.5236)*.3,0,0,0,k*.5236);wheels.push(gg);
      const pn=B.grp(gb);pn.position.set(mx,WY,.42);B.cyl(pn,.107,.107,.08,0xD8B65A,0,0,0,Math.PI/2,0,0,{metalness:.7});for(let k=0;k<6;k++)B.box(pn,.04,.03,.085,0x8A6E2F,Math.cos(k*1.047)*.107,Math.sin(k*1.047)*.107,0,0,0,k*1.047);pins.push(pn);
      B.box(gb,.85,.7,.04,0x8E99A5,(x+mx)/2,WY,.5,0,0,0,{transparent:true,opacity:.28});
      B.cyl(tm,.2,.2,.62,0x5E6A76,mx,WY,-.04,Math.PI/2,0,0,{metalness:.55});for(let k=0;k<8;k++)B.box(tm,.02,.03,.6,0x3B434C,mx+Math.cos(k*.785)*.2,WY+Math.sin(k*.785)*.2,-.04,0,0,k*.785);
      const rf=B.grp(tm);rf.position.set(mx,WY,-.37);for(let k=0;k<6;k++)B.box(rf,.32,.04,.01,0xC8D0D8,0,0,0,0,0,k*1.047);rotors.push(rf)});
    // ---- rotating magnetic field model (inside each motor)
    const rm=B.part("RM",{n:"Inside a traction motor: rotating field",d:"Three-phase current in the stator coils makes a magnetic field that turns. It induces current in the rotor bars, so the rotor is dragged round just behind the field. Watch the rotor lag (slip) when you apply power, and lead when you brake.",at:[-4.4,1.65,1.5],off:[0,-6]});
    const rg=B.grp(rm);rg.position.set(-4.4,.95,1.5);B.box(rm,1.2,.08,.5,0x2A3542,-4.4,.08,1.5);B.box(rm,.12,.82,.12,0x2A3542,-4.4,.48,1.35);
    B.torus(rg,.5,.07,0x6B7784,0,0,0,0,0,0,{metalness:.6});const PC=[0xFF5A1F,0xF5B800,0x3C8DFF],coilM=[];
    [0,2,1,0,2,1].forEach((p,k)=>{const a=k*Math.PI/3,m=B.box(rg,.16,.2,.18,PC[p],Math.cos(a)*.38,Math.sin(a)*.38,0,0,0,a,{metalness:.3,emissive:PC[p],emissiveIntensity:0});coilM.push([m,p,k<3?1:-1,a])});
    const rotor=B.grp(rg);B.cyl(rotor,.24,.24,.24,0x8E99A5,0,0,0,Math.PI/2,0,0,{metalness:.7});for(let k=0;k<10;k++)B.box(rotor,.03,.03,.27,0xC97B2E,Math.cos(k*.628)*.22,Math.sin(k*.628)*.22,0,0,0,0,{metalness:.8});B.box(rotor,.4,.04,.02,0xFFFFFF,0,0,.13);
    const field=B.grp(rg);B.box(field,.62,.03,.02,0xE040FB,0,0,.16,0,0,0,{emissive:0xE040FB,emissiveIntensity:.8});B.cyl(field,0,.05,.12,0xE040FB,.33,0,.16,0,0,-Math.PI/2,{emissive:0xE040FB,emissiveIntensity:.8});
    // ---- flows
    const P=()=>Math.abs(S.P)/e.PMAX,mot=()=>S.pan&&S.P>1e4?.35+.65*Math.min(1,P()*1.5):0,reg=()=>S.pan&&S.P<-1e4?.35+.65*Math.min(1,P()*1.5):0,spd=()=>.25+P()*.7;
    const MOT=AX.map((x,i)=>{const b=BX[Math.floor(i/2)];return x+(x<b?1:-1)*.41});
    const seg=[{pts:[[-1.6,3.76,0],[-1.62,3.45,.05],[-1.75,3.1,.1],[-1.6,2.98,.12],[-.85,3.0,.12],[0,2.99,.12],[.6,2.95,.4],[.85,2.6,.78],[.85,1.7,.78],[.85,1.2,.55],[.85,.96,.2]],g:[[0,"#FFE680"],[1,"#F5B800"]]},
      {pts:[[.85,.96,.2],[.6,.96,0],[.15,.98,-.1],[-.3,.96,0],[-.55,.96,.1]],g:[[0,"#F5B800"],[1,"#FF9F1C"]]}];
    MOT.forEach((mx,i)=>seg.push({pts:[[-.55,.96,0],[-.55,1.12,-.3],[(mx-.55)/2,1.15,-.3],[mx,1.0,-.25],[mx,WY+.05,-.1]],g:[[0,"#FF9F1C"],[1,"#E040FB"]]}));
    AX.forEach(x=>seg.push({pts:[[x,WY,.72],[x,.38,.72],[x,.2,.72],[x-2,.18,.72],[x-5,.18,.72],[-9.5,.18,.72]],g:[[0,"#E040FB"],[1,"#8C939B"]],n:20}));
    seg.forEach(s=>{B.flow({layer:"power",pts:s.pts,grad:s.g,n:s.n||40,size:.24,spread:.04,speed:spd,active:mot,normal:true});B.flow({layer:"regen",pts:s.pts.slice().reverse(),grad:[[0,"#7CF2B0"],[1,"#2ED47A"]],n:s.n||36,size:.24,spread:.04,speed:spd,active:reg,normal:true})});
    B.flow({layer:"air",pts:[[-.55,.75,1.3],[-.55,.9,.7],[-.55,.96,.2],[-.55,.96,-.4],[-.55,.96,-.75],[-.6,.8,-1.3],[-.7,.55,-1.8]],grad:[[0,"#9FD8FF"],[.6,"#BFE6FF"],[1,"#FFB08A"]],n:50,size:.2,spread:.08,speed:()=>.3+P()*.4,active:()=>(S.blk?.15:.35+.65*P())});
    let t=0;const col=new T.Color();
    return{update(dt,S,V){e.sim(S,dt);t+=dt;
      wheels.forEach(g=>g.rotation.z=-S.wa);pins.forEach(g=>g.rotation.z=S.wa*e.G);rotors.forEach(g=>g.rotation.z=S.wa*e.G);
      for(let i=0;i<34;i++){const x=((i*.6-S.tx)%20.4+20.4)%20.4-10.2;M4.makeTranslation(x,.1,0);sl.setMatrixAt(i,M4)}sl.instanceMatrix.needsUpdate=true;
      masts.forEach((g,i)=>g.position.x=((i*8-S.tx)%24+24)%24-12);drop.forEach((d,i)=>d.position.x=((i-S.tx)%22+22)%22-11);
      const hy=S.pan?3.74:3.12,hk=(S._hy??hy)+(hy-(S._hy??hy))*Math.min(1,dt*3);S._hy=hk;const A=[-2.05,3.0],H=[-1.55,hk],K=[-1.18,(3.0+hk)/2+.05];
      link(arm1,A,K);link(arm2,K,H);head.position.set(H[0],hk+.01,0);arc.visible=S.pan&&hk>3.7&&Math.abs(S.P)>2e6&&Math.random()<.35;
      fan.rotation.z+=dt*(S.blk?4:30);
      rotor.rotation.z=S.ra;field.rotation.z=S.fa;coilM.forEach(([m,p,s,a])=>{const c=Math.sin(S.fa-p*2.094)*s;m.material.emissiveIntensity=Math.max(0,c)*1.1*(S.f>.05?1:0)});
      if(V.sel!=="CI")cib.material.emissive.setHex(S.heat>.05?col.setRGB(S.heat*.9,S.heat*.12,0).getHex():0);
    }};
  },
  workshop:[["PG","Lower and earth the pantograph, lock out the VCB","Earthing pole, lock-out tag"],["HV","Disconnect the roof cable and remove the circuit breaker","Insulated tools, 25 kV gloves"],["CI","Lower the converter-inverter onto a lift table","Under-floor lift table"],["MT","Drain the oil and lower the main transformer","Oil pump, lift table"],["CB","Raise the car body on depot jacks","4 synchronised jacks"],["GB","Unbolt the gearboxes and check gear backlash","Feeler gauge"],["TM","Remove the traction motors from the bogie frames","Motor sling"],["WS","Drop the wheelsets out of the bogies","Wheel drop pit"],["BG","Roll the bogie frames out for overhaul","Bogie turntable"],["RM","Strip a motor: stator and rotor out","Rotor extraction tool"]],
  faults:[{kind:"Fault finding",q:"What is the cause?",id:"ci",title:"Train slow to reach line speed",story:"On a test run the driver reports the train takes much longer than normal to accelerate, and the cab screen flashes 'CI 2 cut out' after a few minutes on full power.",
    apply:S=>{S.inv2=0;S.blk=1;S.mc=5;S.v=25;S.pan=1},clear:S=>{S.inv2=1;S.blk=0;S.heat=0},symptoms:["Weak acceleration","'CI 2 cut out' warning","Inverter box very hot"],
    tests:[["Read the line voltage","25.1 kV: normal, so the supply is fine."],["Inspect the pantograph carbon strip","4 mm of carbon left, within limits, and no arc marks."],["Download the inverter fault log","IGBT over-temperature trip on inverter 2, six times today. Each time the inverter shuts itself down to protect the IGBTs."],["Check the inverter cooling blower","The intake filter is packed with dust and leaves. Air flow is about 30% of normal."]],
    options:["Low overhead line voltage","Worn pantograph strip","Blocked inverter cooling","Shorted traction motor"],answer:2,explain:"The supply and pantograph are fine. The fault log shows over-temperature trips, and the blower filter is clogged, so the IGBTs overheat and inverter 2 cuts out, leaving only half the motors working. Clean or replace the filter."}],
  quiz:[{q:"Why is the overhead wire 25,000 volts?",o:["Because motors need 25 kV","High voltage means less current for the same power, so thinner wires and smaller losses","It makes the train lighter","It is safer for passengers"],a:1,e:"Power = voltage × current. Raising the voltage cuts the current, and losses go with current squared.",focus:"OC"},
    {q:"What does the VVVF inverter do?",o:["Stores energy for braking","Changes the frequency and voltage of the three-phase AC to control motor speed","Cools the motors","Raises the pantograph"],a:1,e:"Variable Voltage, Variable Frequency: higher frequency makes the field, and so the motor, turn faster.",focus:"CI"},
    {q:"In an induction motor, why does the rotor turn?",o:["It is pushed by brushes","The rotating field induces currents in the rotor bars and drags the rotor round, slightly slower than the field","Permanent magnets on the rotor","Air from the blower"],a:1,e:"That speed difference is the slip. Without slip there is no induced current and no torque.",focus:"RM"},
    {q:"What happens in regenerative braking?",o:["The air brakes push power to the wire","The motors work as generators and send power back to the overhead line","The pantograph is lowered","The transformer stores the energy"],a:1,e:"The inverter makes the field turn slower than the rotor, so the motors generate instead of consume.",focus:"TM"},
    {q:"How does current get back to the substation?",o:["Through a second overhead wire","Through the wheels and the rails","Through the air","It does not return"],a:1,e:"The rails are the return conductor, so wheel-to-rail contact is part of the circuit.",focus:"WS"}]
};
