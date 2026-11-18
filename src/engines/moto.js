/* ===================== Motorcycle: 125 cc single, SOHC, air-cooled, 4-speed, chain ===================== */
ENGINES.moto={
  lab:{title:"VR workshop: strip down the motorcycle engine",intro:"Take it apart in the right order, then build it back up. In a VR headset you grab each part with your hands; on a phone or laptop, tap it.",start:"Start strip-down",verb:"Remove",doneTitle:"Rebuilt",doneText:"You stripped and rebuilt it in the right order."},
  id:"moto",subject:"Engineering",vehicle:"Motorcycle engine",name:"Single-cylinder 125cc engine",short:"125cc single",specs:["Engineering extension","125 cc","1 cylinder","Air-cooled","SOHC 2-valve","4-speed"],
  intro:"The kind of engine found in Malaysia's millions of kapchai and underbone motorcycles. One tilted cylinder, cooled by air flowing over its fins, drives a centrifugal clutch, a 4-speed gearbox and a chain to the rear wheel.",
  how:["The single cylinder runs the same four strokes as a car engine, but only fires once every two crank turns, which is why it sounds 'thumpy'.","Fins around the cylinder and head give a large surface so the air rushing past as you ride carries the heat away; there is no radiator.","A chain from the crankshaft turns one overhead camshaft. Rocker arms pass the cam's push to the two valves.","Above about 2,500 rpm, weights in the centrifugal clutch fly outwards and grip the drum, so the bike moves off without a clutch lever.","The gearbox swaps pairs of gears: 1st gives the most pulling force, 4th the most speed. A chain and sprockets reduce the speed again to turn the rear wheel."],
  layers:{air:["Intake air","#4FD1E3"],exhaust:["Exhaust gas","#FF7A3D"],cool:["Cooling air","#9FE7FF"]},
  S:{thr:25,gear:1,slow:.04,paused:false,A:0,rpm:2600,slip:0,speed:0},
  controls:[{k:"thr",label:"Throttle",min:0,max:100,unit:"%"},{k:"gear",type:"seg",label:"Gear",options:[[0,"N"],[1,"1st"],[2,"2nd"],[3,"3rd"],[4,"4th"]],hint:S=>["<b>Neutral:</b> the gearbox is disconnected, so the engine spins but the wheel doesn't.","<b>1st (2.83 : 1):</b> the most turning force for pulling away and climbing hills. Overall the engine turns about 24 times for each turn of the wheel, so top speed is only about 27 km/h at 6,000 rpm.","<b>2nd (1.71 : 1):</b> less force, more speed, for building up speed in town. About 45 km/h at 6,000 rpm.","<b>3rd (1.24 : 1):</b> for steady riding on normal roads. About 62 km/h at 6,000 rpm.","<b>4th (1.00 : 1):</b> the 'cruising' gear. The gearbox shafts turn at the same speed, so the least force but the most speed: about 77 km/h at 6,000 rpm, and the engine runs quieter and uses less fuel."][S.gear]},{k:"slow",type:"seg",label:"Speed",options:[[.04,"Slow motion"],[.2,"×0.2"],[1,"Real time"]]}],
  camera:{pos:[2.0,1.8,3.6],tgt:[.1,.12,0]},
  GR:[0,2.83,1.71,1.24,1.0],PRI:3.35,FIN:2.57,
  flowSlow:S=>Math.max(.35,S.slow),
  sim(S,dt){const tgt=1400+S.thr/100*7600;S.rpm+=(tgt-S.rpm)*Math.min(1,dt*1.5);const g=S.gear,eng=g>0&&S.rpm>2500;S.clutch=g===0?"Neutral":eng?(S.slip>0?"Slipping":"Engaged"):"Free (below 2,500 rpm)";
    const ideal=eng?S.rpm/this.PRI/this.GR[g]/this.FIN*1.85*60/1000:0;S.speed+=(ideal*(1-S.slip)-S.speed)*Math.min(1,dt*.8);S.wheel=S.speed*1000/60/1.85;
    S.temp=(S.temp||60)+((95+S.thr*.4-S.speed*.25)-(S.temp||60))*dt*.15;if(!S.paused)S.A=(S.A+S.rpm/60*360*dt*S.slow)%1440},
  gauges(S){const kw=Math.max(0,7.4*Math.sin(Math.PI*clamp(S.rpm/9600,0,1))*(.2+.8*S.thr/100));
    return[["Engine speed",Math.round(S.rpm),"rpm",S.rpm/9500,"#0F1B2A"],["Road speed",Math.round(S.speed),"km/h",S.speed/110,"#FF5A1F"],["Gear",S.gear?S.gear:"N","",S.gear/4,"#0AA5B5"],["Clutch",(S.clutch||"Disengaged").split(" ")[0],"",S.clutch==="Engaged"?1:S.clutch==="Slipping"?.5:0,"#1E9E5A"],["Power",kw.toFixed(1),"kW",kw/7.5,"#FF5A1F"],["Cylinder temp",Math.round(S.temp||60),"°C",(S.temp||60)/160,"#F5B800"]]},
  phase:{title:"One cylinder, one power stroke every two turns",svg:()=>cycleSVG(["Cylinder"],[0],"Four-stroke timing for the single cylinder"),note:"With one cylinder there are long gaps between power strokes, so a heavy flywheel keeps the crank turning.",update(el,S){const l=el.querySelector(".cur");if(!l)return;const x=70+(S.A%720)/720*262;l.setAttribute("x1",x);l.setAttribute("x2",x)}},
  sound:{type:"piston",params:S=>({f:S.rpm/120,load:S.thr/100,vol:.5})},
  onControl(S,k){if(k==="gear")toast(S.gear?`Shifted to ${["","1st","2nd","3rd","4th"][S.gear]} gear`:"Neutral")},
  vbottom:S=>`<span class="chip glass">${Math.round(S.speed)} km/h · ${S.gear?["","1st","2nd","3rd","4th"][S.gear]:"N"}</span><span class="chip glass">Clutch: ${S.clutch||""}</span>`,
  build(B){
    const {T}=B,tau=70*Math.PI/180,RC=.12,L=.40,cs=Math.cos(tau),sn=Math.sin(tau);
    const W=(lx,ly,lz=0)=>[lx*cs+ly*sn,-lx*sn+ly*cs,lz];
    const steel=0x8D99A6,alu=0xB9C2CB;
    const ax=(part)=>{const g=B.grp(part);g.rotation.z=-tau;return g};
    // crankcase (with covers)
    const cc=B.part("CC",{n:"Crankcase",d:"Two-piece aluminium case that holds the crankshaft, gearbox and oil. It splits down the middle for an overhaul.",at:[-.15,.3,.27],housing:true});
    B.box(cc,.86,.66,.46,0x7E8995,-.08,-.06,0,0,0,0,{housing:true,metalness:.4,roughness:.55});
    B.cyl(cc,.34,.34,.46,0x7E8995,-.02,-.08,0,Math.PI/2,0,0,{housing:true,metalness:.4,roughness:.55});
    const lc=B.part("LC",{n:"Magneto and left cover",d:"A flywheel with magnets spins around fixed coils, making electricity for the spark and lights.",at:[-.02,-.08,-.38],dir:[0,0,-.75]});
    B.cyl(lc,.26,.24,.1,0x6B7581,0,0,-.3,Math.PI/2,0,0,{metalness:.5});const mag=B.grp(lc);mag.position.set(0,0,-.3);for(let k=0;k<6;k++){const a=k/6*6.283;B.box(mag,.06,.05,.11,0xB7C0C9,Math.cos(a)*.17,Math.sin(a)*.17,0,0,0,a,{metalness:.7})}
    const cl=B.part("CL",{n:"Centrifugal clutch",d:"Three shoes are thrown outward by spinning. Above about 2,500 rpm they press on the drum and take up the drive smoothly.",at:[-.02,.12,.42],dir:[0,0,.8]});
    const clg=B.grp(cl);clg.position.set(0,0,.33);B.cyl(clg,.24,.24,.12,0x9AA6B2,0,0,0,Math.PI/2,0,0,{metalness:.6,side:2});B.torus(clg,.24,.012,0x6B7581,0,0,.06);
    const shoes=[0,1,2].map(k=>{const s=B.grp(clg);s.rotation.z=k/3*6.283;const m=B.arc(s,.17,.07,0xC9A447,0,0,0,0,1.6,Math.PI/2,0,0,{metalness:.4});m.rotation.set(Math.PI/2,0,0);return s});
    // cylinder + head (tilted)
    const cy=B.part("CY",{n:"Cylinder and cooling fins",d:"The fins multiply the surface area so passing air can carry heat away. Look how the cooling air layer flows over them as speed rises.",at:W(.0,.62,.3),dir:W(0,.45),housing:true});
    const cya=ax(cy);B.cyl(cya,.17,.17,.48,0x8C97A3,0,.54,0,0,0,0,{housing:true,metalness:.4},28,true);
    for(let k=0;k<8;k++)B.box(cya,.52,.012,.44,0x9AA5B1,0,.34+k*.055,0,0,0,0,{housing:true,metalness:.3});
    const hd=B.part("HD",{n:"Cylinder head",d:"Holds the valves, camshaft and spark plug, and has its own cooling fins.",at:W(-.05,.98,.28),dir:W(0,.85),housing:true});
    const hda=ax(hd);B.box(hda,.44,.2,.4,0x9AA6B2,0,.88,0,0,0,0,{housing:true,metalness:.35});for(let k=0;k<3;k++)B.box(hda,.5,.012,.46,0xA9B4BF,0,.82+k*.06,0,0,0,0,{housing:true});
    B.box(hda,.36,.1,.32,0x5C6773,0,1.03,0,0,0,0,{housing:true});
    // piston + rod + crank
    const ps=B.part("PS",{n:"Piston",d:"Slides back and forth in the tilted cylinder. Two compression rings and one oil ring seal it.",at:W(.0,.55,.12),dir:W(0,.3,.0).map((v,i)=>i===2?.8:v)});
    const pa=ax(ps);const pist=B.grp(pa);B.cyl(pist,.162,.162,.15,0xC6CED6,0,.06,0,0,0,0,{metalness:.55,roughness:.35});[.11,.08].forEach(y=>B.torus(pist,.162,.005,0x3B434C,0,y,0,Math.PI/2,0,0));B.cyl(pist,.02,.02,.22,0x9AA6B2,0,0,0,Math.PI/2,0,0,{metalness:.8});
    const gas=new T.Mesh(new T.CylinderGeometry(.158,.158,1,24),new T.MeshBasicMaterial({color:0x4FC3D9,transparent:true,opacity:.5,depthWrite:false}));pa.add(gas);
    const spark=new T.Mesh(new T.SphereGeometry(.04,10,8),new T.MeshBasicMaterial({color:0xFFF3B0}));spark.position.set(0,.77,0);pa.add(spark);
    const cr=B.part("CR",{n:"Connecting rod",d:"Links the piston to the crankpin. On a single it also carries the full force of every power stroke.",at:[.12,.08,.1],dir:[0,-.2,.6]});
    const ra=ax(cr);const rod=B.grp(ra);B.box(rod,.05,L-.06,.035,0x7A8692,0,0,0,0,0,0,{metalness:.7});B.torus(rod,.05,.015,0x7A8692,0,-L/2,0,0,0,0,{metalness:.7});
    const csP=B.part("CS",{n:"Crankshaft and flywheels",d:"Two heavy disc-shaped flywheels with the crankpin between them store energy to carry the engine through the three non-power strokes.",at:[-.25,-.25,.08],dir:[0,-.55,0]});
    const crank=B.grp(csP);[-.06,.06].forEach(z=>{const d=B.cyl(crank,.2,.2,.04,0x7E8A96,0,0,z,Math.PI/2,0,0,{metalness:.7});});B.cyl(crank,.045,.045,.16,0xA9B4BF,0,RC,0,Math.PI/2,0,0,{metalness:.85});B.cyl(csP,.04,.04,.7,0xA9B4BF,0,0,0,Math.PI/2,0,0,{metalness:.85});
    for(let k=0;k<4;k++)B.box(crank,.03,.03,.13,0x2A3038,Math.cos(k*1.57)*.13,Math.sin(k*1.57)*.13+0,0);
    // camshaft, rockers, valves, cam chain
    const ca=B.part("CA",{n:"Camshaft (SOHC)",d:"One overhead camshaft with an intake lobe and an exhaust lobe. It turns at half crank speed.",at:W(0,1.12,.12),dir:W(0,1.1).map((v,i)=>i===2?.2:v)});
    const caa=ax(ca);B.cyl(caa,.025,.025,.36,0xA9B4BF,0,.95,0,Math.PI/2,0,0,{metalness:.8});const lobeI=B.grp(caa),lobeE=B.grp(caa);[[lobeI,-.04],[lobeE,.04]].forEach(([g,z])=>{g.position.set(0,.95,z);const m=B.cyl(g,.036,.036,.03,0xC0C9D2,0,.016,0,Math.PI/2,0,0,{metalness:.85});m.scale.set(1,1,1.45)});
    const camSp=B.grp(caa);camSp.position.set(0,.95,.16);B.cyl(camSp,.09,.09,.02,0x3A434E,0,0,0,Math.PI/2,0,0,{metalness:.5});for(let k=0;k<3;k++)B.box(camSp,.15,.02,.025,0xB7C0C9,0,0,0,0,0,k*1.05);
    const rk=B.part("RA",{n:"Rocker arms",d:"Small levers that pivot on a shaft, passing the cam's push to the valve stems.",at:W(-.2,1.02,.0),dir:W(0,.9).map((v,i)=>i===2?-.4:v)});
    const rka=ax(rk);const rockI=B.grp(rka),rockE=B.grp(rka);rockI.position.set(-.06,.98,-.04);rockE.position.set(.06,.98,.04);[rockI,rockE].forEach((g,i)=>{B.box(g,.14,.025,.03,0x7A8692,i?.05:-.05,0,0,0,0,0,{metalness:.7})});B.cyl(rka,.012,.012,.36,0x5E6A76,0,1.0,0,Math.PI/2,0,0);
    const vl=B.part("VL",{n:"Valves",d:"One intake valve and one exhaust valve, closed by springs.",at:W(.15,.86,-.2),dir:W(.1,.7).map((v,i)=>i===2?-.6:v)});
    const vla=ax(vl);const vI=B.grp(vla),vE=B.grp(vla);[[vI,-.07,0x9FD9E3],[vE,.07,0xD9B9A8]].forEach(([g,x,c])=>{g.position.x=x;B.cyl(g,.01,.01,.2,0xD7DDE3,0,.86,0,0,0,0,{metalness:.8});B.cyl(g,.045,.035,.014,c,0,.765,0,0,0,0,{metalness:.6});B.helix(g,.022,.08,5,.004,0x5E6A76,0,.86,0)});
    const ch=B.part("CH",{n:"Cam chain",d:"A chain that links the crankshaft to the camshaft, keeping the valves in time with the piston.",at:W(-.05,.5,.2),dir:[0,0,.55]});
    const cha=ax(ch);B.tube(cha,[[0,-.05,.17],[.05,0,.17],[.1,.5,.17],[.09,.95,.17],[0,1.04,.17],[-.09,.95,.17],[-.1,.5,.17],[-.05,0,.17]],.012,0x30363E,{metalness:.6},true,90);
    // spark plug
    const spk=B.part("SPK",{n:"Spark plug",d:"Screws into the head. It fires once every two crank turns, just before the piston reaches the top.",at:W(-.02,1.18,0),dir:W(0,1.4)});
    const spa=ax(spk);B.cyl(spa,.02,.02,.16,0xF2F2EE,0,1.12,0);B.cyl(spa,.028,.028,.12,0x1A1F25,0,1.24,0);
    // intake, exhaust
    const ip=W(-.15,.86),ep=W(.15,.84);
    const inP=B.part("IN",{n:"Throttle body and air box",d:"Air is filtered in the air box, metered by the throttle and squirted with fuel by the injector before entering the head.",at:[.15,.92,0],dir:[-.2,.6,0]});
    B.tube(inP,[ip,[.6,.62,0],[.36,.76,0]],.045,0x38424E,{roughness:.45});B.cyl(inP,.06,.06,.16,0x9AA6B2,.36,.76,0,0,0,1.25,{metalness:.6});B.box(inP,.42,.26,.32,0x22292F,-.06,.86,0);B.cyl(inP,.016,.012,.12,0x1A1F25,.5,.75,.06,.5,0,0);
    const ex=B.part("EX",{n:"Exhaust header and muffler",d:"Carries hot gas under the engine to the muffler, which quietens it before it leaves at the back.",at:[-.8,-.45,.12],dir:[0,-.35,.3]});
    B.tube(ex,[ep,[1.02,-.08,0],[.85,-.42,.04],[.1,-.5,.08],[-.7,-.42,.12]],.045,0x8A7F77,{metalness:.6,roughness:.4});B.cyl(ex,.1,.1,.7,0x6E737A,-1.05,-.38,.12,0,0,1.48,{metalness:.7});B.cyl(ex,.03,.03,.1,0x3A3F45,-1.43,-.36,.12,0,0,1.48);
    // gearbox
    const gb=B.part("GB",{n:"4-speed gearbox",d:"Pairs of gears on two shafts. A selector slides dogs to lock one pair at a time; the highlighted pair is the gear you are in.",at:[-.36,.1,.0],dir:[-.1,.0,-.0].map((v,i)=>i===1?.6:v)});
    const mainS=B.grp(gb),cntS=B.grp(gb);mainS.position.set(-.32,-.02,0);cntS.position.set(-.32,-.26,0);
    B.cyl(mainS,.02,.02,.5,0xA9B4BF,0,0,0,Math.PI/2,0,0,{metalness:.8});B.cyl(cntS,.02,.02,.66,0xA9B4BF,0,0,.08,Math.PI/2,0,0,{metalness:.8});
    const RM=[.05,.07,.085,.095],RCN=[.14,.12,.105,.095],ZS=[-.16,-.06,.04,.14],gearM=[],gearC=[];
    ZS.forEach((z,i)=>{gearM.push(B.cyl(mainS,RM[i],RM[i],.035,0x8D99A6,0,0,z,Math.PI/2,0,0,{metalness:.7},20));gearC.push(B.cyl(cntS,RCN[i],RCN[i],.035,0x8D99A6,0,0,z,Math.PI/2,0,0,{metalness:.7},24))});
    [...gearM,...gearC].forEach(m=>{for(let k=0;k<8;k++){const t=B.box(m,.012,.02,.045,0x6B7581,0,0,0);t.position.set(Math.cos(k/8*6.283)*(m.geometry.parameters.radiusTop),0,Math.sin(k/8*6.283)*(m.geometry.parameters.radiusTop))}});
    // final drive
    const fd=B.part("FD",{n:"Chain and rear wheel",d:"The front sprocket on the gearbox drives a chain to the bigger rear sprocket, which slows the drive again and turns the rear wheel.",at:[-1.55,.42,.3],dir:[-.4,0,0]});
    const fs=B.grp(fd);fs.position.set(-.32,-.26,.34);B.cyl(fs,.06,.06,.03,0x3A434E,0,0,0,Math.PI/2,0,0,{metalness:.5});for(let k=0;k<3;k++)B.box(fs,.1,.015,.032,0xB7C0C9,0,0,0,0,0,k*1.05);
    const wheel=B.grp(fd);wheel.position.set(-1.55,-.22,.34);B.cyl(wheel,.15,.15,.025,0x3A434E,0,0,0,Math.PI/2,0,0,{metalness:.5});for(let k=0;k<6;k++)B.box(wheel,.03,.6,.012,0xB7C0C9,0,0,-.04,0,0,k*.5236,{metalness:.7});
    B.torus(wheel,.36,.025,0x9AA6B2,0,0,-.04,0,0,0,{metalness:.7});B.torus(wheel,.44,.085,0x15191E,0,0,-.04,0,0,0,{roughness:.9});
    B.tube(fd,[[-.32,-.2,.34],[-.9,-.06,.34],[-1.55,-.07,.34],[-1.71,-.22,.34],[-1.55,-.37,.34],[-.9,-.36,.34],[-.32,-.32,.34],[-.26,-.26,.34]],.012,0x30363E,{metalness:.6},true,100);
    // flows
    const S=this.S,sp_=()=>.5+S.rpm/2600,OFFr=0,phi=()=>((S.A)%720+720)%720;
    B.flow({layer:"air",pts:[[-.25,.9,0],[.15,.86,0],[.36,.76,0],[.6,.62,0],ip,W(-.05,.7)],grad:[[0,"#2A9DB5"],[1,"#7FE6F2"]],n:60,size:.06,spread:.035,speed:sp_,active:()=>vlift(phi(),-10,215)*1.4});
    B.flow({layer:"exhaust",pts:[W(.05,.7),ep,[1.02,-.08,0],[.85,-.42,.04],[.1,-.5,.08],[-.7,-.42,.12],[-1.4,-.36,.12],[-1.8,-.34,.12]],grad:[[0,"#FFE08A"],[.3,"#FF7A3D"],[1,"#6B6F74"]],n:70,size:.07,spread:.04,speed:sp_,active:()=>vlift(phi(),530,215)*1.4});
    [-.18,-.06,.06,.18].forEach((z,i)=>[.15,.32].forEach(y=>B.flow({layer:"cool",pts:[[1.6,y+.12,z],[.9,y+.08,z],[.45,y+.06,z],[0,y,z],[-.6,y-.05,z]],grad:[[0,"#BFF3FF"],[.55,"#9FE7FF"],[.75,"#FFB98A"],[1,"#FF8A50"]],n:14,size:.045,spread:.02,speed:()=>.25+S.speed/40,active:()=>.25+S.speed/90})));
    const col=new T.Color();
    return{update(dt,S,V){ENGINES.moto.sim(S,dt);const A=S.A,a=(A%360)*Math.PI/180,show=V.explode<.05&&!V.parts.PS.removed&&!V.parts.HD.removed;
      crank.rotation.z=-a;mag.rotation.z=-a;const yp=RC*Math.cos(a)+Math.sqrt(L*L-Math.pow(RC*Math.sin(a),2));pist.position.y=yp;
      const pyc=RC*Math.cos(a),pxc=RC*Math.sin(a);rod.position.set(pxc/2,(yp+pyc)/2,0);rod.rotation.z=Math.atan2(pxc,yp-pyc);
      const ph=((A)%720+720)%720,crown=yp+.135,gh=Math.max(.02,.765-crown);gas.visible=show;gas.scale.y=gh;gas.position.y=crown+gh/2;
      let c=0x4FC3D9,op=.5;if(ph>=180&&ph<360){c=col.set(0x4FC3D9).lerp(new T.Color(0x7C83E8),(ph-180)/180).getHex();op=.6}else if(ph>=360&&ph<540){const k=(ph-360)/180;c=col.set(0xFFE08A).lerp(new T.Color(0xFF5A1F),Math.min(1,k*2)).lerp(new T.Color(0x9A4A2A),Math.max(0,k*2-1)).getHex();op=.85-.3*k}else if(ph>=540){c=0x8C939B;op=.45}
      gas.material.color.setHex(c);gas.material.opacity=op;spark.visible=show&&ph>=352&&ph<372;
      const li=vlift(ph,-10,215),le=vlift(ph,530,215);vI.position.y=-li*.05;vE.position.y=-le*.05;rockI.rotation.z=li*.15;rockE.rotation.z=-le*.15;
      lobeI.rotation.z=-((A-107)/2+180)*Math.PI/180;lobeE.rotation.z=-((A-637)/2+180)*Math.PI/180;camSp.rotation.z=-a/2;
      const g=S.gear,eng=S.clutch==="Engaged"||S.clutch==="Slipping",ms=eng?a/ENGINES.moto.PRI:0;
      shoes.forEach((s,k)=>{s.children[0].position.x=Math.min(.03,Math.max(0,(S.rpm-1800)/24000))});clg.rotation.z=-a*(eng?1:1);
      WS_.m+=eng?(S.rpm/ENGINES.moto.PRI/60*6.283*dt*S.slow):0;WS_.c=g?WS_.m/ENGINES.moto.GR[g]:WS_.c;mainS.rotation.z=-WS_.m;cntS.rotation.z=WS_.c;fs.rotation.z=WS_.c;wheel.rotation.z=WS_.c/ENGINES.moto.FIN;
      [...gearM,...gearC].forEach((m,k)=>{const on=g&&(k%4)===g-1&&V.sel!=="GB";m.material.emissive.setHex(on?0x1E9E5A:0);m.material.emissiveIntensity=on?.7:1});
      const hot=clamp(((S.temp||60)-60)/90,0,1);if(V.sel!=="EX")ex.children.slice(0,1).forEach(m=>{m.material.emissive.setHex(0xFF3A00);m.material.emissiveIntensity=hot*.5})
    }};
  },
  workshop:[["EX","Unbolt the exhaust header and muffler","12 mm socket, new gasket on refit"],["IN","Remove the throttle body and air box","Screwdriver, cap the intake"],["SPK","Unscrew the spark plug","Plug spanner"],["HD","Remove the head nuts in a cross pattern and lift off the head","10 mm socket"],["RA","Slide out the rocker shaft and rockers","Note which rocker is which"],["CA","Lift out the camshaft","Tie up the cam chain so it cannot drop"],["CH","Remove the cam chain","Chain tool"],["VL","Compress the springs and remove both valves","Valve spring compressor"],["CY","Slide the cylinder off the piston","Support the piston"],["PS","Remove the circlip and wrist pin, lift off the piston","Circlip pliers"],["LC","Remove the left cover and pull the magneto","Flywheel puller"],["CL","Remove the right cover and the clutch","Clutch holder"],["FD","Remove the chain and rear sprocket","Chain breaker"],["CC","Split the crankcase halves","Soft mallet, never pry"],["GB","Lift out the gearbox shafts","Keep gears in order"],["CR","Free the connecting rod","Check the big-end bearing"],["CS","Lift out the crankshaft","Bearing puller"]],
  faults:[{kind:"Fault finding",q:"What is the cause?",id:"slip",title:"Engine revs, bike is slow",story:"A food-delivery rider says the engine screams when he accelerates but the bike barely goes faster, especially uphill.",
    apply:S=>{S.slip=.38;S.gear=3;S.thr=70},clear:S=>{S.slip=0},symptoms:["High rpm, low speed","Slow acceleration","Burning smell"],
    tests:[["Compare engine and wheel speed","In 3rd gear the engine should turn about 10.9 times for every wheel turn. It is turning about 17.5 times: power is being lost between the crank and gearbox."],["Watch the clutch in the simulation","The clutch reads 'Slipping': the shoes spin but do not fully grip the drum."],["Check the chain slack","Chain slack is 25 mm, within the 20–30 mm limit."],["Inspect the clutch shoes","The friction lining is worn down to 0.5 mm; the service limit is 1.0 mm."]],
    options:["Chain too loose","Worn clutch shoes slipping","Gearbox stuck in 1st","Blocked air filter"],answer:1,explain:"The engine makes plenty of revs but they are not reaching the gearbox. The ratio test and the worn shoe lining point to a slipping centrifugal clutch, not the chain."}],
  quiz:[{q:"How often does a single-cylinder four-stroke fire?",o:["Every crank turn","Once every two crank turns","Four times per turn","Only at high rpm"],a:1,e:"One cylinder, one power stroke per 720° of crank rotation."},
    {q:"What cools this engine?",o:["A radiator and coolant","Air flowing over the fins","Oil spray only","A fan inside the cylinder"],a:1,e:"The fins give a big surface area for passing air to carry heat away."},
    {q:"When does the centrifugal clutch start to grip?",o:["When you pull a lever","As soon as the engine starts","When engine speed rises past about 2,500 rpm","Only in 4th gear"],a:2,e:"The shoes are thrown outward by spinning and grip the drum once engine speed is high enough.",focus:"CL"},
    {q:"Which gear gives the most pulling force but the lowest speed?",o:["1st","2nd","3rd","4th"],a:0,e:"1st has the biggest reduction ratio, multiplying torque the most."},
    {q:"Why does the rear sprocket have more teeth than the front one?",o:["To look balanced","To slow the drive down and increase force at the wheel","To make the chain shorter","To cool the chain"],a:1,e:"The final drive is another reduction: about 2.6 front-sprocket turns per wheel turn here.",focus:"FD"}]
};
const WS_={m:0,c:0};
