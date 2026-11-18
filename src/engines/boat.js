/* ===================== Boat: 4-stroke inline-3 outboard motor ===================== */
ENGINES.boat={
  lab:{title:"VR workshop: strip down the outboard",intro:"Take it apart in the right order, then build it back up. In a VR headset you grab each part with your hands; on a phone or laptop, tap it.",start:"Start strip-down",verb:"Remove",doneTitle:"Rebuilt",doneText:"You stripped and rebuilt it in the right order."},
  id:"boat",subject:"Engineering",vehicle:"Boat outboard",name:"Four-stroke outboard motor",short:"Outboard",specs:["Engineering extension","3 cylinders","Vertical crank","Water-cooled","F-N-R gears","Through-hub exhaust"],
  intro:"Outboards power most of Malaysia's fishing and passenger boats, from Langkawi to Sabah. The whole engine, gearbox and propeller clamp onto the back (transom) of the boat.",
  how:["The three-cylinder powerhead lies on its side: the crankshaft is vertical, so it can drive a long driveshaft straight down the leg.","At the bottom, a small pinion gear turns two bevel gears. A sliding dog clutch locks one of them to the propeller shaft: forward, neutral or reverse.","A rubber impeller on the driveshaft pumps sea water up the leg to cool the engine. Some comes out of the small 'tell-tale' hole so you can see it working.","Exhaust gas is sent down the leg and out through the hollow propeller hub, under water, which keeps the boat quiet.","Tilting the motor (trim) changes the propeller's angle to lift the bow and help the boat plane."],
  layers:{cool:["Cooling water","#3C8DFF"],exhaust:["Exhaust gas","#FF7A3D"],wake:["Propeller wash","#9FE7FF"]},
  S:{thr:30,gear:1,slow:.05,paused:false,A:0,rpm:2400,imp:1,temp:62},
  controls:[{k:"thr",label:"Throttle",min:0,max:100,unit:"%"},{k:"gear",type:"seg",label:"Gear",options:[[-1,"Reverse"],[0,"Neutral"],[1,"Forward"]]},{k:"slow",type:"seg",label:"Speed",options:[[.05,"Slow motion"],[.25,"×0.25"],[1,"Real time"]]}],
  camera:{pos:[3.4,2.7,5.2],tgt:[.1,1.55,0]},flowSlow:S=>Math.max(.35,S.slow),RATIO:2.0,
  onControl(S,k){if(k==="gear"){if(S.thr>15){S.thr=12;toast("Throttle back to idle before shifting, then shift.")}else toast(["Reverse","Neutral","Forward"][S.gear+1]+" selected")}},
  sim(S,dt){const tgt=750+S.thr/100*5250;S.rpm+=(tgt-S.rpm)*Math.min(1,dt*1.4);const prop=S.gear*S.rpm/this.RATIO;S.prop=prop;const kn=S.gear>0?prop/3000*31:S.gear<0?prop/3000*8:0;S.kn=(S.kn||0)+(kn-(S.kn||0))*Math.min(1,dt*.5);
    const flow=S.imp*(.3+.7*Math.min(1,S.rpm/2500));S.flow=flow;const target=flow>.6?72:72+(1-flow/.6)*40*(.4+S.rpm/6000);S.temp+=(target-S.temp)*dt*.25;
    if(!S.paused)S.A=(S.A+S.rpm/60*360*dt*S.slow)%1440;S.sh=(S.sh||0)+(S.gear-(S.sh||0))*Math.min(1,dt*4)},
  gauges(S){return[["Engine speed",Math.round(S.rpm),"rpm",S.rpm/6000,"#0F1B2A"],["Propeller",Math.round(Math.abs(S.prop)),"rpm",Math.abs(S.prop)/3000,"#0AA5B5"],["Boat speed",(S.kn||0).toFixed(1),"knots",Math.abs(S.kn||0)/32,"#FF5A1F"],["Gear",["R","N","F"][S.gear+1],"",(S.gear+1)/2,"#7C83E8"],["Water temp",Math.round(S.temp),"°C",S.temp/110,S.temp>85?"#D93A2E":"#3C8DFF"],["Tell-tale flow",Math.round(S.flow*100),"%",S.flow,S.flow<.5?"#D93A2E":"#3C8DFF"]]},
  phase:{title:"Three cylinders, one firing every 240°",svg:()=>cycleSVG(["Cyl 1","Cyl 2","Cyl 3"],[0,480,240],"Four-stroke timing for the three cylinders"),note:"Firing order 1-3-2. Each cylinder fires 240° of crank rotation after the last one.",
    update(el,S){const l=el.querySelector(".cur");if(!l)return;const x=70+(S.A%720)/720*262;l.setAttribute("x1",x);l.setAttribute("x2",x)}},
  sound:{type:"outboard",params:S=>({f:S.rpm/60*1.5,load:S.thr/100,water:.04+Math.abs(S.kn||0)/32*.25,vol:.5})},
  vbottom:S=>`<span class="chip glass">${["Reverse","Neutral","Forward"][S.gear+1]} · ${(S.kn||0).toFixed(1)} knots</span>${S.temp>85?`<span class="chip" style="background:var(--bad);color:#fff">Overheat alarm</span>`:""}`,
  build(B){
    const {T}=B,RC=.09,L=.3,OFF=[0,480,240],XL=[-.25,0,.25],steel=0x8D99A6;
    // context: boat hull + water
    B.box(null,2.6,.7,2.2,0xF2F4F6,-1.78,1.32,0,0,0,0,{roughness:.6});B.box(null,2.6,.16,2.25,0x0F4C75,-1.78,1.0,0);B.box(null,.06,.9,2.0,0xDDE3E8,-.47,1.4,0);
    const water=new T.Mesh(new T.PlaneGeometry(14,10,40,30),new T.MeshStandardMaterial({color:0x1F7FA6,transparent:true,opacity:.32,depthWrite:false,roughness:.2,metalness:.1,side:2}));water.rotation.x=-Math.PI/2;water.position.y=1.15;B.V.root.add(water);
    const wp0=water.geometry.attributes.position.array.slice();
    // transom bracket
    const tb=B.part("TB",{n:"Transom bracket and trim",d:"Clamps the motor to the boat. The trim/tilt ram changes the motor's angle, and lifts it out of the water for trailering.",at:[-.36,1.95,.2],dir:[-.4,0,0]});
    B.box(tb,.14,.4,.5,0x4A5562,-.37,1.78,0,0,0,0,{metalness:.5});B.cyl(tb,.05,.05,.5,0x9AA6B2,-.3,1.55,0,0,0,.4,{metalness:.7});
    // cowling
    const cw=B.part("CW",{n:"Cowling",d:"The lightweight top cover. It keeps spray off the powerhead and has a ducted air intake.",at:[.1,2.98,.0],dir:[0,.95,0],housing:true});
    const cmo={housing:true,roughness:.35,metalness:.2};B.box(cw,1.0,.62,.64,0x1C2733,.12,2.42,0,0,0,0,cmo);B.sph(cw,.5,0x1C2733,.12,2.73,0,cmo,1.0,.32,.64);B.box(cw,.06,.62,.66,0xC8D0D8,-.38,2.42,0,0,0,0,cmo);B.box(cw,.5,.05,.3,0xC8D0D8,.1,2.9,0,0,0,0,{housing:true});
    // powerhead block (rotated: local y = world +x, local x = world -y)
    const ph=B.part("PH",{n:"Powerhead (cylinder block)",d:"Three cylinders lying on their side. Sea water flows through passages around them to carry the heat away.",at:[.42,2.66,.25],housing:true});
    const phA=B.grp(ph);phA.position.set(-.12,2.4,0);phA.rotation.z=-Math.PI/2;
    B.box(phA,.82,.62,.42,0x8C97A3,0,.34,0,0,0,0,{housing:true,metalness:.35});XL.forEach(x=>B.cyl(phA,.125,.125,.4,0xB7C0C9,x,.4,0,0,0,0,{housing:true,metalness:.6},24,true));
    B.box(phA,.82,.14,.42,0x9AA6B2,0,.72,0,0,0,0,{housing:true});
    const cs=B.part("CS",{n:"Vertical crankshaft",d:"Runs up and down instead of across, so it can drive the driveshaft directly.",at:[-.28,2.15,.15],dir:[-.45,0,0]});
    const csA=B.grp(cs);csA.position.set(-.12,2.4,0);csA.rotation.z=-Math.PI/2;B.cyl(csA,.04,.04,.86,steel,0,0,0,0,0,Math.PI/2,{metalness:.8});
    const throws=XL.map(x=>{const g=B.grp(csA);g.position.x=x;[-.06,.06].forEach(dx=>B.box(g,.035,.24,.15,0x7E8A96,dx,.04,0,0,0,0,{metalness:.7}));B.cyl(g,.04,.04,.12,0xA9B4BF,0,RC,0,0,0,Math.PI/2,{metalness:.85});return g});
    const fw=B.part("FW",{n:"Flywheel and starter gear",d:"On top of the crank. It smooths the power pulses and the electric starter turns it to start the engine.",at:[-.12,2.95,.25],dir:[0,.6,0]});
    const fwg=B.grp(fw);fwg.position.set(-.12,2.86,0);B.cyl(fwg,.3,.3,.06,0x5E6A76,0,0,0,0,0,0,{metalness:.7});B.torus(fwg,.3,.018,0xA9B4BF,0,0,0,Math.PI/2,0,0,{metalness:.8});for(let k=0;k<5;k++){const a=k/5*6.283;B.cyl(fwg,.03,.03,.07,0x20262D,Math.cos(a)*.18,0,Math.sin(a)*.18)}
    const ps=B.part("PS",{n:"Pistons",d:"Three pistons slide horizontally, firing in the order 1-3-2.",at:[.2,2.62,.18],dir:[.55,0,.4]});
    const psA=B.grp(ps);psA.position.set(-.12,2.4,0);psA.rotation.z=-Math.PI/2;
    const pist=XL.map(x=>{const g=B.grp(psA);g.position.x=x;B.cyl(g,.118,.118,.12,0xC6CED6,0,.05,0,0,0,0,{metalness:.55});B.torus(g,.118,.005,0x3B434C,0,.09,0,Math.PI/2,0,0);return g});
    const cr=B.part("CR",{n:"Connecting rods",d:"Link each piston to the vertical crankshaft.",at:[0,2.2,.15],dir:[.2,0,.55]});
    const crA=B.grp(cr);crA.position.set(-.12,2.4,0);crA.rotation.z=-Math.PI/2;const rods=XL.map(x=>{const g=B.grp(crA);g.position.x=x;B.box(g,.04,L-.04,.03,0x7A8692,0,0,0,0,0,0,{metalness:.7});return g});
    const gas=XL.map(x=>{const m=new T.Mesh(new T.CylinderGeometry(.115,.115,1,20),new T.MeshBasicMaterial({color:0x4FC3D9,transparent:true,opacity:.5,depthWrite:false}));m.position.x=x;psA.add(m);return m});
    // midsection + water pump + driveshaft
    const ms=B.part("MS",{n:"Midsection (leg)",d:"The streamlined leg. Inside run the driveshaft, the cooling water tube and the exhaust passage.",at:[.2,1.3,.12],housing:true});
    const leg=B.cyl(ms,.2,.17,1.32,0x26313D,-.06,1.22,0,0,0,0,{housing:true,roughness:.35});leg.scale.z=.45;
    const avp=B.box(ms,.62,.02,.36,0x26313D,.06,.8,0,0,0,0,{housing:true});
    const ds=B.part("DS",{n:"Driveshaft",d:"Carries the engine's turning force about a metre down the leg to the gears.",at:[-.12,1.5,.1],dir:[0,0,.5]});
    const dsg=B.grp(ds);dsg.position.set(-.12,0,0);B.cyl(dsg,.022,.022,1.58,0xA9B4BF,0,1.22,0,0,0,0,{metalness:.85});for(let k=0;k<3;k++)B.box(dsg,.012,1.5,.05,0x5E6A76,0,1.22,0,0,k*1.05,0);
    const wpP=B.part("WP",{n:"Water pump impeller",d:"A rubber impeller on the driveshaft. Its flexible vanes squeeze sea water up to the engine. It wears out and is usually replaced every year.",at:[.05,.72,.15],dir:[0,0,.6]});
    const imp=B.grp(wpP);imp.position.set(-.12,.68,0);B.cyl(imp,.07,.07,.05,0x15191E,0,0,0);const vanes=[];for(let k=0;k<6;k++){vanes.push(B.box(imp,.05,.04,.012,0x15191E,Math.cos(k*1.047)*.075,0,Math.sin(k*1.047)*.075,0,-k*1.047,0))}
    B.cyl(wpP,.09,.09,.07,0x8E99A5,-.12,.68,0,0,0,0,{transparent:true,opacity:.35});
    // lower unit
    const lu=B.part("LU",{n:"Gearcase (lower unit)",d:"The torpedo-shaped bottom of the leg holds the gears in oil. Water intakes on its sides feed the pump.",at:[.3,.25,.12],housing:true});
    const gc=B.cyl(lu,.105,.105,.72,0x26313D,-.04,.42,0,0,0,Math.PI/2,{housing:true,roughness:.35});B.sph(lu,.105,0x26313D,-.4,.42,0,{housing:true});B.box(lu,.42,.26,.03,0x26313D,.08,.2,0,0,0,0,{housing:true});
    for(let k=0;k<4;k++)B.box(lu,.012,.06,.005,0x7A8692,-.05+k*.03,.47,.105,0,0,0,{housing:true});
    const gr=B.part("GR",{n:"Forward, reverse and pinion gears",d:"The pinion on the driveshaft spins a forward gear and a reverse gear the opposite way. The dog clutch locks one of them to the propeller shaft.",at:[-.12,.62,.18],dir:[0,-.5,.5]});
    const pin=B.grp(gr);pin.position.set(-.12,.53,0);B.cyl(pin,.035,.06,.05,0xC9A447,0,0,0,Math.PI,0,0,{metalness:.7});
    const fg=B.grp(gr),rg=B.grp(gr);fg.position.set(-.21,.42,0);rg.position.set(-.03,.42,0);B.cyl(fg,.075,.045,.04,0xC9A447,0,0,0,0,0,-Math.PI/2,{metalness:.7});B.cyl(rg,.045,.075,.04,0xC9A447,0,0,0,0,0,-Math.PI/2,{metalness:.7});
    [fg,rg].forEach(g=>{for(let k=0;k<6;k++)B.box(g,.04,.012,.012,0x8A6E2F,0,Math.cos(k*1.047)*.06,Math.sin(k*1.047)*.06)});
    const dog=B.box(gr,.04,.05,.05,0x9AA6B2,-.12,.42,0,0,0,0,{metalness:.7});
    // propeller + shaft
    const pr=B.part("PR",{n:"Propeller",d:"Three blades screw through the water. The hub is hollow so exhaust escapes through it, under water.",at:[.6,.85,.15],dir:[.6,0,0]});
    const prop=B.grp(pr);prop.position.set(.48,.42,0);B.cyl(prop,.012,.012,.7,0xA9B4BF,-.3,0,0,0,0,Math.PI/2,{metalness:.85});B.cyl(prop,.06,.05,.22,0x7E8A96,0,0,0,0,0,Math.PI/2,{metalness:.7,side:2},20,true);
    for(let k=0;k<3;k++){const bl=B.box(prop,.1,.34,.018,0xB7C0C9,.0,0,0,k*2.094,0,0,{metalness:.75,roughness:.25});bl.geometry.translate(0,.2,0);bl.rotateY(.5)}
    // camshaft + valves (simplified, on the head)
    const ca=B.part("CA",{n:"Camshaft and valves",d:"A belt-driven camshaft at the back of the powerhead opens two valves per cylinder.",at:[.6,2.1,.22],dir:[.55,-.2,0]});
    B.cyl(ca,.022,.022,.86,0xA9B4BF,.55,2.4,-.08,0,0,0,{metalness:.8});const lobes=XL.map((x,i)=>{const g=B.grp(ca);g.position.set(.55,2.4-x,-.08);const m=B.cyl(g,.035,.035,.03,0xC0C9D2,.016,0,0,0,0,0,{metalness:.85});m.scale.set(1.45,1,1);return g});
    // flows
    const S=this.S,sp=()=>.4+S.rpm/2200;
    B.flow({layer:"cool",pts:[[.0,.48,.12],[-.12,.6,.05],[-.12,.68,0],[-.02,.9,0],[-.02,1.6,0],[-.05,1.95,.05],[.05,2.1,.2],[.35,2.25,.22],[.4,2.5,.22],[.15,2.7,.2],[-.05,2.55,.22],[.15,2.0,.14],[.42,1.85,.05],[.75,1.82,.05],[1.0,1.7,.05]],
      grad:[[0,"#2A7BFF"],[.5,"#5FA0FF"],[.8,"#FF9A5C"],[1,"#FFC08A"]],n:80,size:.05,spread:.025,speed:()=>(.15+S.rpm/9000)*S.imp,active:()=>S.flow});
    B.flow({layer:"exhaust",pts:[[.45,2.4,-.1],[.2,2.0,-.06],[.05,1.6,-.04],[.04,1.0,-.03],[.12,.55,0],[.4,.43,0],[.62,.42,0],[1.1,.46,0],[1.6,.6,0]],grad:[[0,"#FF7A3D"],[.5,"#B08A7A"],[.75,"#D9E2EA"],[1,"#FFFFFF"]],n:70,size:.06,spread:.04,speed:sp,active:()=>.4+S.thr/100*.6});
    for(let k=0;k<6;k++){const a=k/6*6.283;B.flow({layer:"wake",pts:[[.55,.42+Math.cos(a)*.12,Math.sin(a)*.12],[.9,.42+Math.cos(a+1)*.16,Math.sin(a+1)*.16],[1.4,.44+Math.cos(a+2)*.2,Math.sin(a+2)*.2],[2.1,.48+Math.cos(a+3)*.24,Math.sin(a+3)*.24],[2.9,.52,Math.sin(a+4)*.26]],grad:[[0,"#FFFFFF"],[1,"#7FD8F2"]],n:22,size:.05,spread:.04,speed:()=>.2+Math.abs(S.prop||0)/1500,active:()=>S.gear>0?Math.min(1,Math.abs(S.prop||0)/1200):0})}
    for(let k=0;k<6;k++){const a=k/6*6.283;B.flow({layer:"wake",pts:[[.55,.42+Math.cos(a)*.12,Math.sin(a)*.12],[.3,.45+Math.cos(a+1)*.2,Math.sin(a+1)*.22],[-.2,.5+Math.cos(a+2)*.26,Math.sin(a+2)*.3],[-.9,.55,Math.sin(a+3)*.34]],grad:[[0,"#FFFFFF"],[1,"#7FD8F2"]],n:16,size:.05,spread:.04,speed:()=>.2+Math.abs(S.prop||0)/1500,active:()=>S.gear<0?Math.min(1,Math.abs(S.prop||0)/900):0})}
    const col=new T.Color();let wt=0;
    return{update(dt,S,V){ENGINES.boat.sim(S,dt);const A=S.A,cr_=(A%360)*Math.PI/180,show=V.explode<.05&&!V.parts.PS.removed&&!V.parts.PH.removed;
      throws.forEach((g,i)=>g.rotation.x=cr_-OFF[i]*Math.PI/180);fwg.rotation.y=-cr_;dsg.rotation.y=-cr_;imp.rotation.y=-cr_;pin.rotation.y=-cr_;
      fg.rotation.x=cr_/ENGINES.boat.RATIO;rg.rotation.x=-cr_/ENGINES.boat.RATIO;dog.position.x=-.12-(S.sh||0)*.03;prop.rotation.x=(S.gear===1?1:S.gear===-1?-1:0)*cr_/ENGINES.boat.RATIO+ (S._pa||0);
      vanes.forEach((v,k)=>{v.scale.x=S.imp<1?.45:1;v.rotation.y=-k*1.047+(S.imp<1?.6:0)});
      lobes.forEach((g,i)=>g.rotation.y=(A-OFF[i])/2*Math.PI/180);
      XL.forEach((x,i)=>{const a=cr_-OFF[i]*Math.PI/180,yp=RC*Math.cos(a)+Math.sqrt(L*L-Math.pow(RC*Math.sin(a),2)),pyc=RC*Math.cos(a),pzc=RC*Math.sin(a);pist[i].position.y=yp;const r=rods[i];r.position.set(x,(yp+pyc)/2,pzc/2);r.rotation.x=Math.atan2(-pzc,yp-pyc);
        const ph=((A-OFF[i])%720+720)%720,crown=yp+.11,gh=Math.max(.02,.52-crown),g=gas[i];g.visible=show;g.scale.y=gh;g.position.y=crown+gh/2;
        let c=0x4FC3D9,op=.5;if(ph>=180&&ph<360){c=col.set(0x4FC3D9).lerp(new T.Color(0x7C83E8),(ph-180)/180).getHex();op=.6}else if(ph>=360&&ph<540){const k=(ph-360)/180;c=col.set(0xFFE08A).lerp(new T.Color(0xFF5A1F),Math.min(1,k*2)).lerp(new T.Color(0x9A4A2A),Math.max(0,k*2-1)).getHex();op=.85-.3*k}else if(ph>=540){c=0x8C939B;op=.45}g.material.color.setHex(c);g.material.opacity=op});
      wt+=dt;const p=water.geometry.attributes.position.array;for(let i=0;i<p.length;i+=3){const x=wp0[i],y=wp0[i+1];p[i+2]=Math.sin(x*1.6+wt*1.4)*.025+Math.cos(y*1.3+wt)*.02}water.geometry.attributes.position.needsUpdate=true;
      const hot=clamp((S.temp-75)/30,0,1);if(V.sel!=="PH"&&hot>0)ph.traverse(o=>{if(o.isMesh){o.material.emissive.setHex(0xFF2A00);o.material.emissiveIntensity=hot*.5}});else if(V.sel!=="PH")ph.traverse(o=>{if(o.isMesh){o.material.emissive.setHex(0);o.material.emissiveIntensity=1}});
    }};
  },
  workshop:[["PR","Remove the propeller first, so it cannot turn","Wooden block, 24 mm socket"],["CW","Unlatch and lift off the cowling","Hands only"],["FW","Pull the flywheel","Flywheel puller"],["CA","Remove the timing belt and camshaft","Mark the timing"],["LU","Drop the gearcase from the leg","Shift to neutral first"],["GR","Remove the forward, reverse and pinion gears","Bearing puller"],["WP","Remove the water pump and impeller","Replace the impeller on refit"],["DS","Pull out the driveshaft","Keep the shims"],["PH","Unbolt the powerhead from the midsection","Engine hoist"],["PS","Remove the three pistons","Ring compressor on refit"],["CR","Remove the connecting rods","Keep caps with rods"],["CS","Lift out the crankshaft","Check the seals"],["MS","Remove the midsection from the bracket","Support the leg"],["TB","Unclamp the bracket from the transom","Two people"]],
  faults:[{kind:"Fault finding",q:"What is the cause?",id:"imp",title:"Overheat alarm at speed",story:"A fisherman in Kuala Terengganu says the overheat buzzer sounds after a few minutes at speed, and the little stream of water from the back of the motor is weak.",
    apply:S=>{S.imp=.35;S.thr=60;S.gear=1},clear:S=>{S.imp=1;S.temp=74},symptoms:["Overheat alarm","Weak tell-tale stream","Engine power drops"],
    tests:[["Look at the tell-tale","Only a weak, spluttering stream. The cooling layer in the simulation shows very little water reaching the powerhead."],["Check the water intakes on the gearcase","Intakes are clear: no plastic bag or weed."],["Test the thermostat in hot water","It opens at the correct temperature."],["Inspect the water pump impeller","Three vanes are cracked and the others are bent over and stiff."]],
    options:["Blocked water intake","Worn water pump impeller","Faulty thermostat","Wrong propeller size"],answer:1,explain:"The intakes and thermostat are fine, but the impeller vanes are damaged, so the pump cannot push enough water. Replacing the impeller (usually every year) fixes it."}],
  quiz:[{q:"Why is the crankshaft vertical in an outboard?",o:["To save fuel","So it can drive a driveshaft straight down the leg","To keep the oil cool","Because the boat is tilted"],a:1,e:"A vertical crank feeds the driveshaft directly, with no extra gears at the top.",focus:"CS"},
    {q:"How does the motor select forward or reverse?",o:["The engine spins backwards","A dog clutch locks either the forward or reverse gear to the propeller shaft","The propeller blades twist","The driveshaft moves up and down"],a:1,e:"The pinion always turns both bevel gears; the dog clutch picks which one drives the prop.",focus:"GR"},
    {q:"What is the tell-tale for?",o:["It shows the engine is being cooled by water","It shows the fuel level","It lets exhaust out at speed","It drains the gearcase oil"],a:0,e:"A steady stream means the water pump is working."},
    {q:"Where does most of the exhaust leave at speed?",o:["Out of the cowling","Through the hollow propeller hub, under water","Out of the tell-tale","Through the transom"],a:1,e:"Through-hub exhaust keeps the boat quiet and the gas away from people.",focus:"PR"},
    {q:"Which part is a common yearly service item?",o:["Crankshaft","Water pump impeller","Flywheel","Cowling"],a:1,e:"The rubber impeller wears and loses its grip on the water.",focus:"WP"}]
};
