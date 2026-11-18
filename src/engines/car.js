/* ===================== Car: inline-4 petrol, DOHC 16 valves ===================== */
const STROKE=[["Intake","#4FC3D9"],["Compression","#7C83E8"],["Power","#FF5A1F"],["Exhaust","#8C939B"]];
const vlift=(phi,start,dur)=>{const u=(((phi-start)%720)+720)%720/dur;return u<=1?Math.sin(Math.PI*u):0};
function cycleSVG(rows,offs,label){ // 720-degree four-stroke chart; rows = names, offs = phase offsets in degrees
  const W=340,H=26+rows.length*24,x0=70,w=W-x0-8,seg=w/4;let s=`<svg class="cycle" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">`;
  [0,180,360,540,720].forEach((d,i)=>s+=`<text x="${x0+i*seg}" y="12" text-anchor="middle" font-size="9.5" fill="#586676">${d}°</text>`);
  rows.forEach((r,ri)=>{const y=18+ri*24;s+=`<text x="4" y="${y+14}" font-size="11" font-weight="700" fill="#0F1B2A">${r}</text>`;
    for(let k=0;k<4;k++){const st=(((k*180+offs[ri])%720)+720)%720;const a=x0+st/720*w;const segs=st+180>720?[[a,x0+w],[x0,x0+(st+180-720)/720*w]]:[[a,a+seg]];
      segs.forEach(([p,q])=>s+=`<rect x="${p}" y="${y}" width="${q-p}" height="18" fill="${STROKE[k][1]}" opacity=".85"/>`);
      const mid=st+90>=720?st+90-720:st+90;s+=`<text x="${x0+mid/720*w}" y="${y+13}" text-anchor="middle" font-size="9" font-weight="700" fill="#fff">${STROKE[k][0][0]}</text>`}
    s+=`<rect class="rowhl" data-row="${ri}" x="${x0}" y="${y}" width="${w}" height="18" fill="none" stroke="#0F1B2A" stroke-width="0" rx="2"/>`});
  s+=`<line class="cur" x1="${x0}" x2="${x0}" y1="16" y2="${H-2}" stroke="#0F1B2A" stroke-width="2.5"/></svg>`;return s}

ENGINES.car={
  id:"car",subject:"Physics",vehicle:"Car engine",name:"The four-stroke petrol engine",short:"engine",specs:["Form 4 Physics","Heat and gas laws","Energy changes","4 cylinders, 1-3-4-2"],
  intro:"A car engine is a heat engine: it turns the chemical energy in petrol into heat, then into motion. It is a good place to see the gas laws at work. Squeezing a gas raises its pressure and temperature; burning fuel makes the hot gas push the piston down.",
  lab:{title:"VR workshop: strip down the engine",intro:"Take the engine apart in the right order, then build it back up. In a VR headset you grab each part with your hands; on a phone or laptop, tap it.",start:"Start strip-down",verb:"Remove",doneTitle:"Engine rebuilt",doneText:"You stripped and rebuilt the engine in the right order."},
  how:["Intake: the piston moves down and the intake valves open, pulling in air mixed with injected petrol.","Compression: both valves close and the piston squeezes the mixture to about a tenth of its volume.","Power: the spark plug fires, the mixture burns and the hot gas pushes the piston down. This is the only stroke that makes power.","Exhaust: the exhaust valves open and the piston pushes the burnt gas out into the exhaust manifold.","Four cylinders are offset by 180° of crank rotation, so one of them is always on its power stroke, giving smooth power.","Physics link: in compression the gas is squeezed to about a tenth of its volume, so its pressure and temperature rise (the gas laws). After the spark, the very hot, high-pressure gas does work on the piston. Energy changes: chemical → heat → kinetic."],
  layers:{air:["Intake air","#4FD1E3"],fuel:["Fuel spray","#F5B800"],exhaust:["Exhaust gas","#FF7A3D"],cool:["Coolant","#3C8DFF"]},
  S:{thr:12,slow:.04,paused:false,A:0,rpm:800,miss:-1},
  controls:[{k:"thr",label:"Throttle",min:0,max:100,unit:"%"},{k:"slow",type:"seg",label:"Speed",options:[[.04,"Slow motion"],[.2,"×0.2"],[1,"Real time"]]}],
  camera:{pos:[3.7,2.5,4.6],tgt:[0,.45,0]},
  gauges(S){const thr=S.thr/100,tq=Math.max(0,145*(1-Math.pow((S.rpm-4200)/5200,2)))*(.22+.78*thr),kw=tq*S.rpm/9549,af=1.5e-3*S.rpm/120*1.18*(.25+.7*thr)*1000;
    return[["Engine speed",Math.round(S.rpm),"rpm",S.rpm/6500,"#0F1B2A"],["Torque",Math.round(tq),"Nm",tq/150,"#FF5A1F"],["Power",kw.toFixed(1),"kW",kw/85,"#FF5A1F"],["Air flow",af.toFixed(1),"g/s",af/85,"#0AA5B5"],["Coolant",Math.round(S.cool||88),"°C",(S.cool||88)/120,"#3C8DFF"],["Exhaust gas",Math.round(300+thr*520+S.rpm/30),"°C",(300+thr*520)/900,"#FF7A3D"]]},
  phase:{svg:()=>cycleSVG(["Cyl 1","Cyl 2","Cyl 3","Cyl 4"],[0,540,180,360],"Four-stroke timing for cylinders 1 to 4"),note:"Firing order 1-3-4-2. The black line is where the engine is in its 720° cycle.",
    update(el,S){const l=el.querySelector(".cur");if(!l)return;const x=70+(S.A%720)/720*262;l.setAttribute("x1",x);l.setAttribute("x2",x);
      el.querySelectorAll(".rowhl").forEach((r,i)=>{const off=[0,540,180,360][i];const ph=((S.A-off)%720+720)%720;r.setAttribute("stroke-width",ph>=360&&ph<540?2.5:0)})}},
  flowSlow:S=>Math.max(.35,S.slow),
  sound:{type:"piston",params:S=>({f:S.rpm/60*2,load:S.thr/100,miss:S.miss>=0,vol:.55})},
  sim(S,dt){const tgt=800+S.thr/100*5600;S.rpm+=(tgt-S.rpm)*Math.min(1,dt*1.6);if(S.miss>=0)S.rpm+=Math.sin(performance.now()/90)*9;S.cool=(S.cool||70)+(88-(S.cool||70))*dt*.2;
    if(!S.paused)S.A=(S.A+S.rpm/60*360*dt*S.slow)%1440},
  build(B){
    const {T}=B,XS=[-.78,-.26,.26,.78],RC=.16,L=.52,OFF=[0,540,180,360];
    const alu=0xC6CED6,steel=0x8D99A6,dark=0x29313B;
    // block, head, cover, sump (housings)
    const bk=B.part("BK",{n:"Engine block",d:"Cast-aluminium block that holds the four cylinders and the crankshaft bearings. Coolant flows through passages around each cylinder.",at:[-1.05,.55,.34],housing:true});
    B.box(bk,2.36,1.16,.66,0x8C97A3,0,.28,0,0,0,0,{housing:true,metalness:.35,roughness:.6});
    XS.forEach(x=>B.cyl(bk,.195,.195,.56,0xB7C0C9,x,.58,0,0,0,0,{housing:true,metalness:.6,roughness:.3},28,true));
    [-1.04,-.52,0,.52,1.04].forEach(x=>B.box(bk,.1,.12,.5,0x77838F,x,.02,0,0,0,0,{housing:true}));
    const hd=B.part("HD",{n:"Cylinder head",d:"Sits on top of the block and holds the valves, camshafts and spark plugs. Its shaped combustion chambers close off each cylinder.",at:[-.85,1.08,.38],dir:[0,.55,0],housing:true});
    B.box(hd,2.36,.32,.72,0x9AA6B2,0,1.02,0,0,0,0,{housing:true,metalness:.35,roughness:.5});
    const vc=B.part("VC",{n:"Valve cover",d:"Keeps oil in and dirt out of the valve train. Removed first when servicing the top of the engine.",at:[.3,1.36,.0],dir:[0,1.15,0],housing:true});
    B.box(vc,2.28,.14,.62,0x26303B,0,1.25,0,0,0,0,{housing:true,roughness:.4});
    B.box(vc,1.9,.06,.3,0x323D49,0,1.34,0,0,0,0,{housing:true});
    const os=B.part("OS",{n:"Oil sump",d:"Holds the engine oil. The oil pump draws from here and sends oil to the bearings and camshafts.",at:[-.55,-.5,.3],dir:[0,-.65,0],housing:true});
    B.box(os,2.1,.32,.56,0x59636E,0,-.46,0,0,0,0,{housing:true});
    // crankshaft
    const cs=B.part("CS",{n:"Crankshaft",d:"Turns the up-and-down motion of the pistons into rotation. Its four crankpins are set so cylinders 1 and 4 move together, and 2 and 3 move together.",at:[1.0,-.05,.2],dir:[0,-.5,.55]});
    [-1.04,-.52,0,.52,1.04].forEach(x=>B.cyl(cs,.065,.065,.14,steel,x,0,0,0,0,Math.PI/2,{metalness:.8,roughness:.25}));
    B.cyl(cs,.05,.05,.3,steel,1.22,0,0,0,0,Math.PI/2,{metalness:.8});
    const throws=XS.map(x=>{const g=B.grp(cs);g.position.x=x;
      [-.09,.09].forEach(dx=>{B.box(g,.05,.3,.2,0x7E8A96,dx,.06,0,0,0,0,{metalness:.7,roughness:.35});const cw=B.arc(g,.2,.05,0x6E7A86,dx,0,0,Math.PI/2,Math.PI,0,0,Math.PI/2,{metalness:.7});cw.position.y=-.02;cw.rotation.set(Math.PI,0,Math.PI/2)});
      B.cyl(g,.055,.055,.16,0xA9B4BF,0,RC,0,0,0,Math.PI/2,{metalness:.85,roughness:.2});return g});
    // flywheel + timing
    const fw=B.part("FW",{n:"Flywheel",d:"A heavy disc that smooths out the power pulses and connects the engine to the clutch and gearbox.",at:[-1.32,.5,0],dir:[-.75,0,0]});
    const fwg=B.grp(fw);fwg.position.x=-1.31;B.cyl(fwg,.44,.44,.06,0x6B7581,0,0,0,0,0,Math.PI/2,{metalness:.7});B.torus(fwg,.44,.022,0xA9B4BF,0,0,0,0,Math.PI/2,0,{metalness:.8});
    for(let k=0;k<6;k++){const a=k/6*6.283;B.cyl(fwg,.035,.035,.07,0x20262D,-.001,Math.cos(a)*.28,Math.sin(a)*.28,0,0,Math.PI/2)}
    const tb=B.part("TB",{n:"Timing belt and pulleys",d:"A toothed belt that turns the camshafts at exactly half crankshaft speed, keeping the valves in time with the pistons.",at:[1.36,1.35,.0],dir:[.75,0,0]});
    const pul=(r,y,z,w)=>{const g=B.grp(tb);g.position.set(1.32,y,z);B.cyl(g,r,r,w,0x3A434E,0,0,0,0,0,Math.PI/2,{metalness:.5});for(let k=0;k<4;k++)B.box(g,w+.01,r*1.6,.025,0xB7C0C9,0,0,0,k*Math.PI/4);return g};
    const pc=pul(.1,0,0,.08),pi=pul(.13,1.12,-.15,.06),pe=pul(.13,1.12,.15,.06);pul(.06,.6,.22,.05);
    B.tube(tb,[[1.32,-.11,0],[1.32,-.04,.1],[1.32,.6,.29],[1.32,1.1,.29],[1.32,1.26,.17],[1.32,1.27,-.15],[1.32,1.1,-.29],[1.32,.5,-.15],[1.32,-.04,-.1]],.016,0x14181D,{roughness:.8},true,120);
    // pistons, rods
    const ps=B.part("PS",{n:"Pistons and rings",d:"Aluminium pistons slide in the cylinders. Rings seal the gap so gas cannot leak past (blow-by) and oil stays below.",at:[.26,.92,.05],dir:[0,.2,1.05]});
    const pist=XS.map(x=>{const g=B.grp(ps);g.position.x=x;B.cyl(g,.182,.182,.16,alu,0,.06,0,0,0,0,{metalness:.55,roughness:.35});
      [.115,.085].forEach(y=>B.torus(g,.182,.006,0x3B434C,0,y,0,Math.PI/2,0,0));B.cyl(g,.022,.022,.3,0x9AA6B2,0,0,0,Math.PI/2,0,0,{metalness:.8});return g});
    const cr=B.part("CR",{n:"Connecting rods",d:"Forged steel rods that link each piston to the crankshaft. They carry the full force of combustion.",at:[-.26,.25,.12],dir:[0,-.1,.8]});
    const rods=XS.map(x=>{const g=B.grp(cr);g.position.x=x;B.box(g,.055,L-.06,.04,0x7A8692,0,0,0,0,0,0,{metalness:.7,roughness:.35});B.torus(g,.06,.018,0x7A8692,0,-L/2,0,0,Math.PI/2,0,{metalness:.7});B.torus(g,.035,.014,0x7A8692,0,L/2,0,0,Math.PI/2,0,{metalness:.7});return g});
    // camshafts + valves
    const ca=B.part("CA",{n:"Camshafts (DOHC)",d:"Two overhead camshafts: one opens the intake valves, the other the exhaust valves. Each egg-shaped lobe pushes a valve open once every two crank turns.",at:[-.3,1.2,-.15],dir:[0,.85,0]});
    [-.13,.13].forEach(z=>B.cyl(ca,.028,.028,2.36,0xA9B4BF,0,1.12,z,0,0,Math.PI/2,{metalness:.8,roughness:.25}));
    const lobes=[];XS.forEach((x,i)=>[-.13,.13].forEach(z=>[-.08,.08].forEach(dx=>{const g=B.grp(ca);g.position.set(x+dx,1.12,z);const m=B.cyl(g,.04,.04,.03,0xC0C9D2,0,.018,0,0,0,Math.PI/2,{metalness:.85,roughness:.2});m.scale.set(1,1,1.45);lobes.push({g,i,ex:z>0})})));
    const vl=B.part("VL",{n:"Valves and springs",d:"Sixteen valves, four per cylinder: two let air in, two let exhaust out. Springs snap each valve shut when the cam lobe passes.",at:[.78,1.0,-.36],dir:[0,.62,0]});
    const valves=[];XS.forEach((x,i)=>[-.1,.1].forEach(z=>[-.08,.08].forEach(dx=>{const g=B.grp(vl);g.position.set(x+dx,0,z);B.cyl(g,.012,.012,.24,0xD7DDE3,0,.975,0,0,0,0,{metalness:.8});B.cyl(g,.052,.04,.016,z<0?0x9FD9E3:0xD9B9A8,0,.862,0,0,0,0,{metalness:.6});B.helix(g,.026,.09,5,.004,0x5E6A76,0,.98,0);valves.push({g,i,ex:z>0})})));
    // spark plugs + coils
    const sp=B.part("SP",{n:"Spark plugs and coils",d:"Each coil makes a high-voltage pulse; the plug's spark lights the compressed mixture just before the piston reaches the top.",at:[-.26,1.62,0],dir:[0,1.55,0]});
    XS.forEach(x=>{B.cyl(sp,.022,.022,.2,0xF2F2EE,x,.98,0);B.cyl(sp,.03,.03,.3,0x1A1F25,x,1.2,0);B.box(sp,.13,.1,.13,0x15191E,x,1.42,0,0,0,0,{roughness:.4});B.box(sp,.05,.06,.05,0x2F6FDE,x+.05,1.42,.08)});
    // intake + injectors
    const im=B.part("IM",{n:"Intake manifold and throttle",d:"The throttle valve controls how much air enters. The plenum and four runners share it out evenly to each cylinder.",at:[-1.3,1.15,-.95],dir:[0,.25,-.85]});
    B.cyl(im,.14,.14,2.2,0x38424E,0,.95,-.95,0,0,Math.PI/2,{roughness:.45});
    XS.forEach(x=>B.tube(im,[[x,.95,-.84],[x,1.2,-.72],[x,1.12,-.48],[x,.98,-.37]],.062,0x3F4A57,{roughness:.45}));
    const thb=B.grp(im);thb.position.set(-1.24,.95,-.95);B.cyl(thb,.115,.115,.16,0x9AA6B2,0,0,0,0,0,Math.PI/2,{metalness:.6});const plate=B.cyl(thb,.1,.1,.01,0x6B7581,0,0,0,0,0,Math.PI/2,{metalness:.6});
    B.box(im,.36,.3,.34,0x22292F,-1.55,.95,-.95);
    const fi=B.part("FI",{n:"Fuel injectors",d:"Spray a fine mist of petrol into each intake port just before the valve opens. The engine computer sets exactly how much.",at:[.26,1.32,-.6],dir:[0,.45,-.55]});
    B.cyl(fi,.024,.024,2.0,0xA9B4BF,0,1.26,-.6,0,0,Math.PI/2,{metalness:.8});
    XS.forEach(x=>B.cyl(fi,.02,.014,.16,0x1A1F25,x,1.17,-.53,-.6));
    // exhaust
    const em=B.part("EM",{n:"Exhaust manifold",d:"Collects hot exhaust from the four cylinders and sends it to the catalytic converter. It can glow at full load.",at:[.6,.95,.7],dir:[0,0,.95],housing:true});
    const emm=[];XS.forEach(x=>emm.push(B.tube(em,[[x,.98,.37],[x,.95,.56],[x*.45+.1,.72,.8],[.15,.45,.88]],.058,0x7C726B,{metalness:.6,roughness:.45,housing:true})));
    emm.push(B.tube(em,[[.15,.45,.88],[.2,.05,.96],[.3,-.45,1.02]],.085,0x7C726B,{metalness:.6,roughness:.45,housing:true}));
    B.cyl(em,.14,.14,.42,0x8E949A,.3,-.62,1.02,0,0,0,{metalness:.7});
    const al=B.part("AL",{n:"Alternator",d:"Driven by a belt from the crankshaft; it charges the battery and powers the car's electrics.",at:[1.05,.45,-.62],dir:[.45,0,-.5]});
    B.cyl(al,.14,.14,.24,0xA9B4BF,1.02,.28,-.6,0,0,Math.PI/2,{metalness:.7});const alp=B.cyl(al,.06,.06,.05,0x2A3038,1.18,.28,-.6,0,0,Math.PI/2);
    // gas charge, spark flashes (not parts)
    const gas=XS.map(x=>{const m=new T.Mesh(new T.CylinderGeometry(.178,.178,1,28),new T.MeshBasicMaterial({color:0x4FC3D9,transparent:true,opacity:.5,depthWrite:false}));m.position.x=x;B.V.root.add(m);return m});
    const sparks=XS.map(x=>{const m=new T.Mesh(new T.SphereGeometry(.05,12,8),new T.MeshBasicMaterial({color:0xFFF3B0,transparent:true,opacity:.95}));m.position.set(x,.84,0);B.V.root.add(m);return m});
    // flows
    const S=this.S,sp_=()=>.5+S.rpm/1800;
    const phiOf=i=>((S.A-OFF[i])%720+720)%720;
    XS.forEach((x,i)=>{
      B.flow({layer:"air",pts:[[-1.85,.95,-.95],[-1.2,.95,-.95],[x,.95,-.95],[x,1.2,-.72],[x,1.12,-.48],[x,.98,-.36],[x,.82,-.08]],grad:[[0,"#2A9DB5"],[1,"#7FE6F2"]],n:60,size:.09,spread:.05,speed:sp_,active:()=>vlift(phiOf(i),-10,215)*1.4});
      B.flow({layer:"fuel",pts:[[x,1.12,-.52],[x,1.04,-.42],[x,.98,-.34],[x,.86,-.12]],grad:[[0,"#FFD54F"],[1,"#F59E0B"]],n:22,size:.07,spread:.03,speed:()=>sp_()*1.4,active:()=>vlift(phiOf(i),-10,215)*1.2});
      B.flow({layer:"exhaust",pts:[[x,.82,.08],[x,.98,.36],[x,.95,.56],[x*.45+.1,.72,.8],[.15,.45,.88],[.2,.05,.96],[.3,-.45,1.02],[.3,-.95,1.05]],grad:[[0,"#FFE08A"],[.3,"#FF7A3D"],[1,"#6B6F74"]],n:64,size:.1,spread:.06,speed:sp_,active:()=>vlift(phiOf(i),530,215)*1.4})});
    B.flow({layer:"cool",closed:true,pts:[[1.25,.3,-.42],[.6,.55,-.4],[-.6,.55,-.4],[-1.12,.6,-.36],[-1.12,1.0,-.38],[-.4,1.06,-.4],[.6,1.06,.4],[1.15,1.05,.38],[1.5,.95,.5],[1.6,.4,.2]],grad:[[0,"#3C8DFF"],[.6,"#7FB3FF"],[1,"#3C8DFF"]],n:80,size:.07,spread:.03,speed:()=>.08+S.rpm/30000,active:()=>.85});
    const tmpE=new T.Color();
    return{update(dt,S,V){ENGINES.car.sim(S,dt);const A=S.A,cr_=(A%360)*Math.PI/180,showGas=V.explode<.05&&!V.parts.PS.removed&&!V.parts.HD.removed;
      throws.forEach((g,i)=>{g.rotation.x=cr_-OFF[i]*Math.PI/180});fwg.rotation.x=cr_;pc.rotation.x=cr_;pi.rotation.x=pe.rotation.x=cr_/2;alp.rotation.x=cr_*2.3;
      plate.rotation.set(0,(S.thr/100)*Math.PI*.45,Math.PI/2);
      XS.forEach((x,i)=>{const a=cr_-OFF[i]*Math.PI/180,yp=RC*Math.cos(a)+Math.sqrt(L*L-Math.pow(RC*Math.sin(a),2)),pyc=RC*Math.cos(a),pzc=RC*Math.sin(a);
        pist[i].position.y=yp;const r=rods[i];r.position.set(x,(yp+pyc)/2,pzc/2);r.rotation.x=Math.atan2(-pzc,yp-pyc);r.children[0].scale.y=1;
        const ph=((A-OFF[i])%720+720)%720,crown=yp+.14,gh=Math.max(.02,.86-crown),g=gas[i];g.visible=showGas;g.scale.y=gh;g.position.y=crown+gh/2;
        let col,op=.5;if(ph<180){col=0x4FC3D9}else if(ph<360){col=tmpE.set(0x4FC3D9).lerp(new T.Color(0x7C83E8),(ph-180)/180).getHex();op=.6}
        else if(ph<540){const k=(ph-360)/180;if(S.miss===i){col=0x7C83E8;op=.55}else{col=tmpE.set(0xFFE08A).lerp(new T.Color(0xFF5A1F),Math.min(1,k*2)).lerp(new T.Color(0x9A4A2A),Math.max(0,k*2-1)).getHex();op=.85-.3*k}}
        else{col=0x8C939B;op=.45}g.material.color.setHex(col);g.material.opacity=op;
        sparks[i].visible=showGas&&ph>=352&&ph<372&&S.miss!==i;});
      lobes.forEach(L_=>{const peak=L_.ex?530+107:-10+107;L_.g.rotation.x=((A-OFF[L_.i]-peak)/2+180)*Math.PI/180});
      valves.forEach(v=>{const ph=((A-OFF[v.i])%720+720)%720,l=v.ex?vlift(ph,530,215):vlift(ph,-10,215);v.g.position.y=-l*.055});
      const heat=.12+S.thr/100*.7;if(V.sel!=="EM")emm.forEach(m=>{m.material.emissive.setHex(0xFF3A00);m.material.emissiveIntensity=heat*.6});
    }};
  },
  workshop:[["SP","Unplug and lift out the four ignition coils, then unscrew the spark plugs","Spark plug socket"],["VC","Undo the bolts and lift off the valve cover","10 mm socket"],["IM","Remove the intake manifold and throttle body","12 mm socket"],["FI","Release the fuel rail and pull out the injectors","Depressurise the fuel system first"],["EM","Unbolt the exhaust manifold from the head","14 mm socket, penetrating oil"],["TB","Line up the timing marks, then remove the timing belt","Mark the belt direction"],["CA","Lift out both camshafts","Loosen caps in sequence"],["VL","Compress each spring and remove the valves","Valve spring compressor"],["HD","Undo the head bolts in a spiral, outside to inside","Torque wrench, new gasket on refit"],["AL","Remove the alternator","Disconnect the battery first"],["OS","Drain the oil and remove the oil sump","Drain pan"],["CR","Remove the con-rod caps and push out the rods","Keep caps with their rods"],["PS","Slide the pistons out of the bores","Ring compressor on refit"],["FW","Unbolt the flywheel","Flywheel lock"],["CS","Lift out the crankshaft","Check bearing shells"]],
  faults:[{id:"mis3",kind:"Fault finding",q:"What is the cause?",title:"Engine shakes at idle",story:"A Perodua owner says the engine shakes at traffic lights and the check-engine light is on.",
    apply:S=>{S.miss=2;S.thr=8},clear:S=>{S.miss=-1},symptoms:["Rough idle","Check-engine light on","Fault code P0303","Loss of power"],
    tests:[["Read live data with the scan tool","Misfire counter: cylinder 3 = 47, cylinders 1, 2 and 4 = 0."],["Watch cylinder 3 in the simulation","Cylinder 3 gets air and fuel but never turns orange: the mixture is not burning."],["Compression test","All four cylinders read about 13 bar. The rings and valves are fine."],["Swap coils 3 and 2","The misfire moves to cylinder 2. The fault follows the coil."]],
    options:["Worn piston rings on cylinder 3","Faulty ignition coil on cylinder 3","Blocked fuel filter","Timing belt has jumped a tooth"],answer:1,explain:"Compression is good and fuel is arriving, so the missing ingredient is the spark. When the coil was swapped, the misfire followed it, which proves the coil is faulty."}],
  quiz:[{q:"In what order do the cylinders of this inline-4 fire?",o:["1-2-3-4","1-3-4-2","1-4-2-3","All at once"],a:1,e:"1-3-4-2 spreads the power strokes evenly along the crankshaft."},
    {q:"Which stroke actually produces power?",o:["Intake","Compression","Power (combustion)","Exhaust"],a:2,e:"Only the burning mixture pushes the piston down; the other strokes use energy."},
    {q:"How fast does the camshaft turn compared with the crankshaft?",o:["Twice as fast","The same speed","Half as fast","A quarter as fast"],a:2,e:"Each valve opens once per four-stroke cycle, which takes two crank turns."},
    {q:"What does the timing belt do?",o:["Drives the alternator","Keeps the camshafts in step with the crankshaft","Cools the pistons","Pumps the oil"],a:1,e:"If the belt slips, valves and pistons fall out of time and can even collide."},
    {q:"What do the piston rings stop?",o:["Gas leaking past the piston","The spark plug firing","Coolant boiling","The valves opening"],a:0,e:"Rings seal the cylinder so compression and power are not lost, and keep oil out of the chamber."}]
};
