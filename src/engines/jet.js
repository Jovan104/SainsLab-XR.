/* ===================== Plane: high-bypass twin-spool turbofan ===================== */
ENGINES.jet={
  lab:{title:"VR workshop: strip down the turbofan",intro:"Take it apart in the right order, then build it back up. In a VR headset you grab each part with your hands; on a phone or laptop, tap it.",start:"Start strip-down",verb:"Remove",doneTitle:"Rebuilt",doneText:"You stripped and rebuilt it in the right order."},
  id:"jet",subject:"Engineering",vehicle:"Jet engine",name:"High-bypass turbofan",short:"Turbofan",specs:["Engineering extension","Twin-spool","Bypass ratio ~11:1","18-blade fan","10-stage HPC","A320neo class"],
  intro:"The type of engine on the narrow-body jets flown by Malaysian airlines and maintained in Malaysia's aircraft maintenance (MRO) hangars. A huge fan pushes most of the air around the core; the core burns fuel to drive the fan.",
  how:["The big fan at the front sucks in air. About eleven parts out of every twelve go around the outside of the core through the bypass duct; this cool, fast air makes most of the thrust.","The rest enters the core, where the booster and the 10-stage high-pressure compressor squeeze it to about 40 times its starting pressure, heating it as they go.","In the annular combustor, fuel nozzles spray kerosene into the hot air and it burns continuously at well over 1,000 °C.","The hot gas spins the 2-stage high-pressure turbine (which drives the compressor on the inner N2 shaft) and then the 7-stage low-pressure turbine (which drives the fan on the N1 shaft).","After landing, the thrust reverser slides back and redirects the bypass air forwards to help slow the plane."],
  layers:{bypass:["Bypass air","#7FE6F2"],core:["Core gas","#FF7A3D"],fuel:["Fuel","#F5B800"]},
  S:{thr:35,rev:0,slow:.06,paused:false,a1:0,a2:0,n1:48,n2:74,dmg:0},
  controls:[{k:"thr",label:"Thrust lever",min:0,max:100,unit:"%"},{k:"rev",type:"seg",label:"Thrust direction",options:[[0,"Forward"],[1,"Reverse"]]},{k:"slow",type:"seg",label:"Speed",options:[[.06,"Slow motion"],[.25,"×0.25"],[1,"Real time"]]}],
  camera:{pos:[-3.4,2.6,5.4],tgt:[.1,1.3,0]},
  flowSlow:S=>Math.max(.3,S.slow),
  onControl(S,k){if(k==="rev"){toast(S.rev?"Reverser deployed: bypass air now goes forwards":"Reverser stowed");if(S.rev&&S.thr>70)S.thr=70}},
  sim(S,dt){const t=S.thr/100;const n1t=21+79*t*(S.rev?.85:1),n2t=62+38*t;S.n1+=(n1t-S.n1)*Math.min(1,dt*.7);S.n2+=(n2t-S.n2)*Math.min(1,dt*.9);
    if(!S.paused){S.a1+=S.n1/100*40*dt*S.slow;S.a2+=S.n2/100*110*dt*S.slow}S.rv=(S.rv||0)+((S.rev?1:0)-(S.rv||0))*Math.min(1,dt*2.5)},
  vals(S){const n=S.n1/100;return{thrust:143*Math.pow(n,2.4)*(S.rev?-.35:1),egt:420+520*Math.pow((S.n2-60)/40,1.3),ff:250+3100*Math.pow(n,2.2),opr:5+35*Math.pow(n,1.6),vib:S.dmg?2.6+n*2.4:.3+n*.5}},
  gauges(S){const v=this.vals(S);return[["N1 (fan)",S.n1.toFixed(1),"%",S.n1/104,"#0AA5B5"],["N2 (core)",S.n2.toFixed(1),"%",S.n2/104,"#7C83E8"],["Thrust",v.thrust.toFixed(0),"kN",Math.abs(v.thrust)/145,"#FF5A1F"],["EGT",Math.round(v.egt),"°C",v.egt/1050,"#FF7A3D"],["Fuel flow",Math.round(v.ff),"kg/h",v.ff/3400,"#F5B800"],["Vibration",v.vib.toFixed(1),"units",v.vib/5,v.vib>2.5?"#D93A2E":"#1E9E5A"]]},
  phase:{title:"Temperature through the engine (approx.)",svg(){const st=["Inlet","Fan","HPC exit","Combustor","HPT exit","Exhaust"];let s=`<svg class="cycle" viewBox="0 0 340 128" role="img" aria-label="Gas temperature at each station">`;st.forEach((n,i)=>{const x=14+i*54;s+=`<rect class="tb" data-i="${i}" x="${x}" y="100" width="34" height="0" rx="3" fill="#0AA5B5"/><text class="tv" data-i="${i}" x="${x+17}" y="94" text-anchor="middle" font-size="9.5" font-weight="700" fill="#0F1B2A"></text><text x="${x+17}" y="114" text-anchor="middle" font-size="8.6" fill="#586676">${n}</text>`});return s+`<text x="4" y="126" font-size="8.5" fill="#586676">Overall pressure ratio about <tspan class="opr">40</tspan>:1 at take-off</text></svg>`},
    note:"Air is compressed and heated, then burnt; the turbines take energy out, so the gas cools again before it leaves.",
    update(el,S){const n=S.n1/100,T=[15,15+40*n,180+420*Math.pow(n,1.2),600+900*Math.pow(n,1.1),450+600*Math.pow(n,1.2),ENGINES.jet.vals(S).egt],C=["#0AA5B5","#4FC3D9","#F5B800","#FF5A1F","#FF7A3D","#FF9A5C"];
      el.querySelectorAll(".tb").forEach((r,i)=>{const h=T[i]/1600*80;r.setAttribute("y",100-h);r.setAttribute("height",h);r.setAttribute("fill",C[i])});el.querySelectorAll(".tv").forEach((t,i)=>{t.setAttribute("y",96-T[i]/1600*80);t.textContent=Math.round(T[i])+"°"});const o=el.querySelector(".opr");if(o)o.textContent=Math.round(ENGINES.jet.vals(S).opr)}},
  sound:{type:"turbine",params:S=>({n1:S.n1,n2:S.n2,vol:.6})},
  vbottom:S=>`<span class="chip glass">N1 ${S.n1.toFixed(0)}% · N2 ${S.n2.toFixed(0)}%</span><span class="chip glass">${S.rev?"Reverse thrust":"Bypass : core ≈ 11 : 1"}</span>`,
  build(B){
    const {T}=B,AX=1.3,eng=B.grp();eng.position.y=AX;
    const P=(id,meta)=>{if(meta.at)meta.at=[meta.at[0],meta.at[1]+AX,meta.at[2]];return B.part(id,meta,eng)};
    const dummy=new T.Object3D();
    const ring=(par,x,n,r0,r1,chord,twist,color,thick=.012,offset=0)=>{const m=B.inst(par,new T.BoxGeometry(chord,r1-r0,thick),color,{metalness:.7,roughness:.3},n);
      for(let k=0;k<n;k++){const a=k/n*6.283+offset;dummy.position.set(x,Math.cos(a)*(r0+r1)/2,Math.sin(a)*(r0+r1)/2);dummy.rotation.set(a,0,0);dummy.rotateY(twist);dummy.updateMatrix();m.setMatrixAt(k,dummy.matrix)}m.instanceMatrix.needsUpdate=true;return m};
    const lat=(par,pts,c,o)=>B.lathe(par,pts.map(([x,r])=>[r,x]),c,o,0,0,0,0,0,-Math.PI/2,64);
    // nacelle + inlet + fan case + reverser
    const na=P("NA",{n:"Nacelle and inlet",d:"The smooth outer casing. Its rounded lip guides air into the fan evenly, even when the plane is climbing steeply.",at:[-2.1,1.18,0],dir:[-.9,0,0],housing:true});
    lat(na,[[-2.35,1.03],[-2.38,1.1],[-2.3,1.17],[-1.6,1.22],[-.6,1.22],[-.2,1.18]],0xD9DEE3,{housing:true,metalness:.35,roughness:.4});
    lat(na,[[-2.35,1.03],[-2.0,1.0],[-1.6,1.0],[-.6,1.0],[-.2,1.0]],0x8E99A5,{housing:true,metalness:.4});
    const tr=P("TR",{n:"Thrust reverser",d:"The rear sleeve of the nacelle slides back, opening cascades of vanes. Blocker doors then send the bypass air forwards to slow the plane after landing.",at:[.4,1.18,0],dir:[.6,0,0],housing:true});
    const sleeve=B.grp(tr);lat(sleeve,[[-.2,1.18],[.4,1.15],[.9,1.02],[1.05,.96]],0xD9DEE3,{housing:true,metalness:.35,roughness:.4});lat(sleeve,[[-.2,1.0],[.4,1.0],[.9,.95],[1.05,.93]],0x8E99A5,{housing:true});
    const casc=ring(tr,-.05,36,1.0,1.17,.3,.6,0x5C6773,.02);casc.visible=false;
    const fc=P("FC",{n:"Fan case and guide vanes",d:"Fixed outlet guide vanes behind the fan straighten the swirling bypass air so it pushes straight back.",at:[-1.05,1.05,.0],dir:[-.45,0,0],housing:true});
    ring(fc,-1.05,30,.56,.99,.18,.35,0x9AA6B2,.012);
    // spinner + fan
    const sp=P("SP",{n:"Spinner",d:"The pointed nose cone smooths the air onto the fan hub and sheds ice.",at:[-2.0,.3,0],dir:[-.9,0,0]});
    const spin=B.grp(sp);lat(spin,[[-2.12,0.001],[-2.0,.12],[-1.85,.22],[-1.66,.27]],0xE6E9EC,{metalness:.5});B.box(spin,.04,.08,.008,0x15191E,-1.95,.14,0,0,0,.6);
    const fn=P("FN",{n:"Fan (18 blades)",d:"Wide carbon-fibre blades driven by the low-pressure turbine through the N1 shaft. The fan makes most of the engine's thrust.",at:[-1.62,.98,.3],dir:[-.6,0,0]});
    const fan=B.grp(fn);ring(fan,-1.6,18,.27,.98,.28,.62,0x3A4654,.025);B.cyl(fan,.28,.3,.22,0x9AA6B2,-1.6,0,0,0,0,Math.PI/2,{metalness:.6});
    const bad=B.box(fan,.28,.7,.03,0xD93A2E,-1.6,.62,0,0,.62,0,{emissive:0x7A0A00});bad.visible=false;
    // booster (LPC) + HPC
    const lc=P("LC",{n:"Booster (low-pressure compressor)",d:"Three stages on the fan shaft give the core air its first squeeze.",at:[-.9,.6,.2],dir:[-.25,.4,0]});
    const lpc=B.grp(lc);[-1.06,-.92,-.78].forEach((x,i)=>{ring(lpc,x,32,.3,.52-i*.02,.07,.5,0xB7C0C9,.01);ring(lc,x+.065,32,.3,.52-i*.02,.05,-.4,0x6B7581,.01,.1)});B.cyl(lpc,.3,.32,.4,0x7E8A96,-.92,0,0,0,0,Math.PI/2,{metalness:.6});
    const hc=P("HC",{n:"High-pressure compressor (10 stages)",d:"Ten stages of shrinking blades spin on the N2 shaft and squeeze the air to about 40 times inlet pressure, heating it to several hundred °C.",at:[-.05,.48,.2],dir:[0,.65,0]});
    const hpc=B.grp(hc);for(let i=0;i<10;i++){const x=-.48+i*.1,tip=.42-i*.014,hub=.22+i*.006;ring(hpc,x,40,hub,tip,.05,.55,0xC9D1D8,.008);ring(hc,x+.05,40,hub,tip,.035,-.45,0x6B7581,.008,.07)}
    B.cyl(hpc,.24,.27,1.0,0x8D99A6,-.0,0,0,0,0,Math.PI/2,{metalness:.6});
    // combustor
    const cb=P("CB",{n:"Annular combustor",d:"A ring-shaped chamber where 18 fuel nozzles spray kerosene. The flame never goes out while the engine runs.",at:[.75,.5,.2],dir:[0,-.75,0]});
    lat(cb,[[.55,.3],[.6,.26],[.9,.26],[.95,.3],[.95,.42],[.9,.44],[.6,.44],[.55,.4]],0xB5A595,{metalness:.5,side:2});
    const flame=lat(cb,[[.62,.29],[.92,.29],[.92,.41],[.62,.41]],0xFF7A2D,{emissive:0xFF5A10,emissiveIntensity:1,transparent:true,opacity:.75});
    const noz=B.inst(cb,new T.CylinderGeometry(.014,.014,.1,8),0x8D99A6,{metalness:.7},18);for(let k=0;k<18;k++){const a=k/18*6.283;dummy.position.set(.55,Math.cos(a)*.35,Math.sin(a)*.35);dummy.rotation.set(a,0,Math.PI/2);dummy.updateMatrix();noz.setMatrixAt(k,dummy.matrix)}noz.instanceMatrix.needsUpdate=true;
    // turbines
    const ht=P("HT",{n:"High-pressure turbine (2 stages)",d:"The hottest blades in the engine, cooled by air flowing through tiny holes. They drive the compressor through the N2 shaft.",at:[1.07,.55,.25],dir:[.0,.6,.4]});
    const hpt=B.grp(ht);[1.02,1.14].forEach(x=>{ring(hpt,x,46,.25,.42,.06,-.6,0xC79A6B,.01);ring(ht,x-.05,40,.25,.42,.04,.5,0x8A6E55,.01,.07)});
    const lt=P("LT",{n:"Low-pressure turbine (7 stages)",d:"Seven growing stages take more energy from the gas to drive the fan through the long N1 shaft.",at:[1.6,.7,.2],dir:[.65,0,0]});
    const lpt=B.grp(lt);for(let i=0;i<7;i++){const x=1.28+i*.1,tip=.45+i*.016;ring(lpt,x,52,.27,tip,.06,-.55,0xB28A62,.008);ring(lt,x-.045,46,.27,tip,.035,.45,0x7E6650,.008,.07)}
    // shafts
    const sh=P("SH",{n:"N1 and N2 shafts",d:"Two shafts one inside the other: N2 (core) is short and fast, N1 (fan) is long and slower. That is why it is called twin-spool.",at:[.3,.0,.35],dir:[0,-.85,.0]});
    const n1s=B.grp(sh),n2s=B.grp(sh);B.cyl(n1s,.04,.04,3.7,0x5E6A76,.1,0,0,0,0,Math.PI/2,{metalness:.8});B.cyl(n2s,.08,.08,1.7,0x9AA6B2,.3,0,0,0,0,Math.PI/2,{metalness:.8,transparent:true,opacity:.8});
    for(let k=0;k<4;k++)B.box(n2s,1.7,.012,.03,0x2A3038,.3,Math.cos(k*1.57)*.08,Math.sin(k*1.57)*.08,k*1.57,0,0);
    // core cowl + nozzle + plug
    const cc=P("CC",{n:"Core cowl and nozzle",d:"Wraps the core. The core nozzle speeds up the hot gas as it leaves.",at:[1.9,.55,0],dir:[.5,.5,0],housing:true});
    lat(cc,[[-1.22,.56],[-.9,.58],[-.2,.56],[.9,.54],[1.6,.58],[2.1,.47],[2.3,.42]],0xC4CBD2,{housing:true,metalness:.4});lat(cc,[[-1.22,.56],[-1.12,.53],[-.6,.44],[.5,.45],[1.0,.44],[2.0,.45],[2.3,.41]],0x77828E,{housing:true});
    lat(cc,[[1.95,.27],[2.2,.22],[2.45,.1],[2.6,.01]],0x8A7F77,{metalness:.6});
    const ag=P("AG",{n:"Accessory gearbox",d:"Driven off the core; it powers the fuel pump, oil pump and generators for the aircraft's electrics.",at:[-1.0,-1.35,0],dir:[0,-.65,0]});
    B.box(ag,.7,.18,.3,0x6B7581,-1.0,-1.24,0,0,0,0,{metalness:.5});B.cyl(ag,.1,.1,.2,0x9AA6B2,-1.25,-1.38,0);B.cyl(ag,.08,.08,.2,0x9AA6B2,-.8,-1.38,0);B.cyl(ag,.025,.025,1.0,0x5E6A76,-.95,-.7,0,0,0,.2);
    const py=P("PY",{n:"Pylon and wing",d:"The pylon hangs the engine under the wing and carries fuel, electrical and bleed-air lines.",at:[-.2,2.0,0],dir:[0,.7,0]});
    B.box(py,2.6,.18,.34,0xC9CED3,-.1,1.42,0,0,0,-.06,{metalness:.3});B.box(py,3.6,.16,2.6,0xE3E6EA,.3,1.85,-.6,0,0,0,{metalness:.25});
    // flows (relative to the engine axis)
    const S=this.S,v1=()=>.35+S.n1/120,polar=(x,r,a)=>[x,Math.cos(a)*r,Math.sin(a)*r];
    for(let k=0;k<10;k++){const a=k/10*6.283;
      B.flow({layer:"bypass",parent:eng,pts:[polar(-3.2,.85,a),polar(-2.3,.8,a),polar(-1.6,.78,a),polar(-1.0,.8,a),polar(-.2,.8,a),polar(.9,.75,a),polar(1.6,.68,a),polar(2.8,.66,a)],grad:[[0,"#2A9DB5"],[.3,"#7FE6F2"],[1,"#BFF3FF"]],n:30,size:.07,spread:.12,speed:v1,active:()=>1-(S.rv||0)});
      B.flow({layer:"bypass",parent:eng,pts:[polar(-3.2,.85,a),polar(-2.3,.8,a),polar(-1.6,.78,a),polar(-.6,.82,a),polar(-.1,1.05,a),polar(-.5,1.45,a),polar(-1.5,1.75,a)],grad:[[0,"#2A9DB5"],[.5,"#7FE6F2"],[1,"#BFF3FF"]],n:24,size:.07,spread:.1,speed:v1,active:()=>(S.rv||0)})}
    for(let k=0;k<6;k++){const a=k/6*6.283+.3;
      B.flow({layer:"core",parent:eng,pts:[polar(-3.0,.4,a),polar(-1.9,.35,a),polar(-1.2,.42,a),polar(-.9,.4,a),polar(-.4,.33,a),polar(.4,.3,a),polar(.75,.35,a),polar(1.1,.33,a),polar(1.6,.38,a),polar(2.1,.34,a),polar(2.9,.3,a)],
        grad:[[0,"#2A9DB5"],[.32,"#7FE6F2"],[.48,"#E0C35A"],[.55,"#FFE08A"],[.62,"#FF5A1F"],[.78,"#FF7A3D"],[1,"#7A5A50"]],n:26,size:.07,spread:.04,speed:v1,active:()=>.9});
      B.flow({layer:"fuel",parent:eng,pts:[polar(.5,.35,a+.5),polar(.6,.35,a+.5),polar(.72,.35,a+.5)],grad:[[0,"#FFE08A"],[1,"#F59E0B"]],n:8,size:.05,spread:.03,speed:()=>.8,active:()=>.4+S.thr/150})}
    return{update(dt,S,V){ENGINES.jet.sim(S,dt);fan.rotation.x=S.a1+(S.dmg?Math.sin(S.a1)*.0:0);spin.rotation.x=S.a1;lpc.rotation.x=S.a1;lpt.rotation.x=S.a1;n1s.rotation.x=S.a1;hpc.rotation.x=S.a2;hpt.rotation.x=S.a2;n2s.rotation.x=S.a2;
      fan.position.y=S.dmg?Math.sin(S.a1*2)*.006:0;bad.visible=!!S.dmg;
      const th=S.thr/100;flame.material.opacity=.35+.5*th;flame.material.emissiveIntensity=.4+1.2*th;
      sleeve.position.x=(S.rv||0)*.35;casc.visible=(S.rv||0)>.05}};
  },
  workshop:[["TR","Open and remove the thrust reverser halves","Engage the reverser lockout pins"],["PY","Support the engine on a stand and detach it from the pylon","Engine stand, sling"],["NA","Remove the inlet cowl","Protect the lip"],["SP","Unbolt the spinner","Torque-limited driver"],["FN","Remove the fan blades one by one","Number them for rebalancing"],["FC","Remove the fan case and guide vanes","Overhead crane"],["AG","Remove the accessory gearbox","Drain the oil first"],["CC","Remove the core cowl and exhaust plug","Hot-section gloves"],["LT","Pull the low-pressure turbine module","LPT module fixture"],["SH","Withdraw the N1 shaft","Shaft puller"],["HT","Remove the high-pressure turbine","Inspect blades with a borescope first"],["CB","Remove the combustor and fuel nozzles","Cap all fuel lines"],["HC","Separate the high-pressure compressor","Module split fixture"],["LC","Remove the booster","Keep stages in order"]],
  faults:[{kind:"Fault finding",q:"What is the cause?",id:"bird",title:"Vibration after take-off",story:"After a bird strike on take-off from KLIA, the crew report a thump, high vibration on engine 1 and a burning smell. The aircraft returned safely.",
    apply:S=>{S.dmg=1;S.thr=55},clear:S=>{S.dmg=0},symptoms:["N1 vibration high","Loud rumble","EGT normal","Thrust normal"],
    tests:[["Check the engine monitoring data","Vibration is at the N1 frequency (once per fan revolution). N2 vibration is normal."],["Look at the fan in the simulation","One fan blade (shown red) is bent; the whole fan wobbles slightly as it spins."],["Borescope the core","The compressor and turbine blades look normal; no bird remains in the core."],["Check exhaust gas temperature trend","EGT is normal, so the core is still healthy."]],
    options:["Cracked high-pressure turbine blade","Damaged fan blade causing imbalance","Blocked fuel nozzle","Worn accessory gearbox bearing"],answer:1,explain:"The vibration matches the fan's speed (N1) and the core readings are normal. A bent fan blade makes the fan unbalanced, so it is replaced and the fan is rebalanced."}],
  quiz:[{q:"What does a bypass ratio of about 11:1 mean?",o:["The core is 11 times bigger than the fan","For every 1 kg of air through the core, about 11 kg goes around it","The fan spins 11 times faster than the core","Fuel is mixed at 11 parts air to 1 part fuel"],a:1,e:"Most air bypasses the core; this cool, fast air makes most of the thrust very efficiently.",focus:"FN"},
    {q:"What drives the fan?",o:["An electric motor","The high-pressure turbine","The low-pressure turbine through the N1 shaft","The accessory gearbox"],a:2,e:"The LPT and fan are joined by the long inner N1 shaft.",focus:"LT"},
    {q:"Where is the gas hottest?",o:["At the inlet","After the fan","In the combustor and entering the high-pressure turbine","At the exhaust"],a:2,e:"The burning fuel makes the combustor and HPT inlet the hottest place in the engine.",focus:"CB"},
    {q:"Why does the high-pressure compressor get smaller towards the back?",o:["To save weight only","Because the air is squeezed into a smaller volume as pressure rises","Because the blades melt","So the fan can fit"],a:1,e:"As pressure rises the air takes up less space, so the flow path narrows.",focus:"HC"},
    {q:"What does the thrust reverser do?",o:["Makes the engine spin backwards","Sends the bypass air forwards to help slow the plane","Stops fuel flow","Cools the turbine"],a:1,e:"The fan still spins the same way; the air is just redirected forwards.",focus:"TR"}]
};
