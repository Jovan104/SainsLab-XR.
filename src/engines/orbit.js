/* ===================== Physics: gravitation and Kepler's laws ===================== */
const PLANETS=[["Mercury",.387,.206,.241,.06,0xA8A39C],["Venus",.723,.007,.615,.09,0xE8C27A],["Earth",1,.017,1,.1,0x3A86FF],["Mars",1.524,.093,1.881,.075,0xD4573A],["Jupiter",5.203,.049,11.86,.24,0xD9B38C],["Saturn",9.537,.057,29.46,.2,0xE6D3A3]];
const PID=["ME","VE","EA","MA","JU","SA"];
ENGINES.orbit={
  id:"orbit",subject:"Physics",vehicle:"Solar system",name:"Gravitation and Kepler's laws",short:"solar system model",specs:["Foundation Physics","Gravitation","Kepler's three laws","Satellites and planets"],
  intro:"Gravity holds the planets in orbit around the Sun, and the Moon and satellites like Malaysia's MEASAT around the Earth. Kepler discovered three simple laws that describe every orbit. Here you can speed up time and test them yourself.",
  how:["Newton's law of gravitation: every mass pulls every other mass. The force gets weaker with the square of the distance.","The Sun's gravity provides the centripetal force that keeps each planet moving in a curved path.","Kepler's 1st law: each planet moves in an ellipse with the Sun at one focus.","Kepler's 2nd law: a line from the Sun to the planet sweeps out equal areas in equal times, so a planet moves fastest when it is closest to the Sun.","Kepler's 3rd law: the square of the orbital period is proportional to the cube of the orbit's radius, T² ∝ r³. Farther planets have much longer years.","Distances and sizes in this model are squashed so everything fits; the numbers in the gauges are real."],
  layers:{orbits:["Orbits","#9AA6B2"],areas:["Equal areas (2nd law)","#2A9D8F"],forces:["Gravity and velocity","#EE5A24"]},
  S:{focus:2,ex:0,rate:20,slow:1,paused:false,days:40},
  controls:[{k:"focus",type:"seg",label:"Planet to study",options:[[0,"Mercury"],[1,"Venus"],[2,"Earth"],[3,"Mars"],[4,"Jupiter"]]},{k:"ex",type:"seg",label:"Orbit shape",options:[[0,"Real"],[1,"Exaggerated"]],hint:S=>S.ex?"The ellipse is stretched so you can clearly see the planet speed up near the Sun and the equal areas.":"Real planet orbits are almost circles. Mercury's is the most stretched."},{k:"rate",type:"seg",label:"Time speed",options:[[5,"5 days/s"],[20,"20 days/s"],[90,"3 months/s"]]}],
  onControl(S,k){if(k==="focus"||k==="ex")S._rebuild=true},
  camera:{pos:[0,5.2,7.2],tgt:[0,.6,0]},flowSlow:()=>1,
  kep(i,S){const p=PLANETS[i],e=(S.ex&&i===S.focus)?.62:p[2],M=((S.days/365.25)/p[3]*6.283+i*1.7)%6.283;let E=M;for(let k=0;k<6;k++)E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));
    const rd=.55+1.05*Math.pow(p[1],.55);return{E,e,rd,x:rd*(Math.cos(E)-e),z:rd*Math.sqrt(1-e*e)*Math.sin(E),r:p[1]*(1-e*Math.cos(E)),a:p[1]}},
  sim(S,dt){if(!S.paused)S.days+=dt*S.rate*S.slow;const k=this.kep(S.focus,S),p=PLANETS[S.focus];S.r=k.r;S.v=29.78*Math.sqrt(2/k.r-1/p[1]);S.T=p[3];S.g=.00593/(k.r*k.r);S.k=k},
  gauges(S){const p=PLANETS[S.focus];return[["Planet",p[0],"",1,"#14213D"],["Distance from Sun",S.r.toFixed(2),"AU",Math.min(1,S.r/6),"#2A9D8F"],["Orbital speed",S.v.toFixed(1),"km/s",S.v/60,"#EE5A24"],["Period (1 year)",S.T<2?Math.round(S.T*365.25):S.T.toFixed(1),S.T<2?"days":"years",Math.min(1,S.T/12),"#7B4FD6"],["T² ÷ r³",(S.T*S.T/Math.pow(p[1],3)).toFixed(2),"yr²/AU³",1,"#3A86FF"],["Sun's pull",(S.g*1000).toFixed(2),"mN/kg",Math.min(1,S.g/.04),"#F4B400"]]},
  phase:{title:"Kepler's 3rd law: T² against r³",svg:()=>{const X=v=>40+(Math.log10(v)+1.5)/5*290,Y=v=>128-(Math.log10(v)+1.5)/5*116;
      return`<svg viewBox="0 0 340 150" width="100%" role="img" aria-label="Log graph of T squared against r cubed"><line x1="40" y1="128" x2="330" y2="128" stroke="#25335A"/><line x1="40" y1="10" x2="40" y2="128" stroke="#25335A"/><line x1="${X(.03)}" y1="${Y(.03)}" x2="${X(3000)}" y2="${Y(3000)}" stroke="#2A9D8F" stroke-width="2" stroke-dasharray="5 4"/>
      ${PLANETS.map((p,i)=>`<circle class="pp" data-i="${i}" cx="${X(Math.pow(p[1],3))}" cy="${Y(p[3]*p[3])}" r="5" fill="#9AA6B2"/><text x="${X(Math.pow(p[1],3))+7}" y="${Y(p[3]*p[3])+4}" font-size="10" fill="#25335A">${p[0]}</text>`).join("")}<text x="185" y="146" font-size="10.5" text-anchor="middle" fill="#25335A">r³ (AU³, log scale)</text><text x="12" y="70" font-size="10.5" text-anchor="middle" fill="#25335A" transform="rotate(-90 12 70)">T² (years², log)</text></svg>`},
    note:"Every planet lies on the same straight line: T² ÷ r³ is the same for all of them. That is Kepler's third law.",
    update(el,S){el.querySelectorAll(".pp").forEach(c=>{const on=+c.dataset.i===S.focus;c.setAttribute("fill",on?"#EE5A24":"#9AA6B2");c.setAttribute("r",on?7:5)})}},
  sound:{type:"space",params:S=>({pitch:Math.min(1,S.v/50),vol:.4})},
  vbottom:S=>`<span class="chip glass">${PLANETS[S.focus][0]} · ${S.v.toFixed(1)} km/s · ${S.r.toFixed(2)} AU</span><span class="chip glass">Day ${Math.floor(S.days)}</span>`,
  build(B){
    const {T}=B,S=this.S,e=this,Y=.8;
    const st=new Float32Array(900);for(let i=0;i<300;i++){const u=Math.random()*2-1,a=Math.random()*6.283,r=11+Math.random()*2;st[i*3]=Math.sqrt(1-u*u)*Math.cos(a)*r;st[i*3+1]=u*r*.6+2;st[i*3+2]=Math.sqrt(1-u*u)*Math.sin(a)*r}
    const sg=new T.BufferGeometry();sg.setAttribute("position",new T.BufferAttribute(st,3));B.V.root.add(new T.Points(sg,new T.PointsMaterial({color:0xFFFFFF,size:.045,transparent:true,opacity:.7,map:new T.CanvasTexture(DOT_TEX),depthWrite:false})));
    const su=B.part("SU",{n:"Sun",d:"A star. It holds 99.8% of the mass of the solar system, so its gravity controls every orbit.",at:[0,1.45,0]});
    B.sph(su,.36,0xFFC94A,0,Y,0,{emissive:0xFF9F1C,emissiveIntensity:1.4,roughness:1});
    const gc=document.createElement("canvas");gc.width=gc.height=128;const gg=gc.getContext("2d"),gr=gg.createRadialGradient(64,64,10,64,64,64);gr.addColorStop(0,"rgba(255,200,90,.9)");gr.addColorStop(.4,"rgba(255,150,40,.35)");gr.addColorStop(1,"rgba(255,120,0,0)");gg.fillStyle=gr;gg.fillRect(0,0,128,128);
    const glow=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(gc),transparent:true,depthWrite:false,blending:T.AdditiveBlending}));glow.scale.set(1.8,1.8,1);glow.position.set(0,Y,0);su.add(glow);
    const pl=new T.PointLight(0xFFF1D0,1.6,30);pl.position.set(0,Y,0);su.add(pl);
    const orb=B.part("OR",{n:"Orbits",d:"Each orbit is an ellipse with the Sun at one focus (Kepler's 1st law). Most are very nearly circles.",at:[2.2,.8,2.0],off:[0,10]});
    const lines=PLANETS.map((p,i)=>{const g=new T.BufferGeometry();g.setAttribute("position",new T.BufferAttribute(new Float32Array(129*3),3));const l=new T.Line(g,new T.LineBasicMaterial({color:0x5B7088,transparent:true,opacity:.7}));orb.add(l);return l});
    const setLine=i=>{const k0=Object.assign({},S),a=lines[i].geometry.attributes.position.array,p=PLANETS[i],ee=(S.ex&&i===S.focus)?.62:p[2],rd=.55+1.05*Math.pow(p[1],.55);for(let j=0;j<=128;j++){const E=j/128*6.283;a[j*3]=rd*(Math.cos(E)-ee);a[j*3+1]=Y;a[j*3+2]=rd*Math.sqrt(1-ee*ee)*Math.sin(E)}lines[i].geometry.attributes.position.needsUpdate=true;lines[i].material.color.setHex(i===S.focus?0xEE5A24:0x5B7088)};
    const meshes=PLANETS.map((p,i)=>{const part=B.part(PID[i],{n:p[0],d:({Mercury:"The closest and fastest planet: one year is only 88 days.",Venus:"The hottest planet, because its thick carbon dioxide atmosphere traps heat.",Earth:"Our planet, with the Moon. One orbit takes 365.25 days.",Mars:"The red planet. Its orbit is noticeably more stretched than Earth's.",Jupiter:"The biggest planet. Its strong gravity holds at least 95 moons.",Saturn:"Famous for its rings of ice and rock. One year lasts about 29 Earth years."})[p[0]]});
      const g=B.grp(part);B.sph(g,p[4],p[5],0,0,0,{roughness:.7});if(p[0]==="Saturn"){B.torus(g,p[4]*1.7,p[4]*.28,0xCDBB8E,0,0,0,Math.PI/2.3,0,0,{roughness:.8,transparent:true,opacity:.85})}
      if(p[0]==="Earth"){const m=B.grp(g);B.sph(m,.035,0xC8CCD2,.22,0,0);g.userData.moon=m}if(p[0]==="Jupiter")for(let k=0;k<3;k++)B.torus(g,p[4]*1.0,.008,0xB08A62,0,(k-1)*.08,0,Math.PI/2,0,0);return g});
    // equal-area wedges
    const wg=B.grp(orb),wedges=[];
    const buildW=()=>{wedges.forEach(m=>{wg.remove(m);m.geometry.dispose()});wedges.length=0;const i=S.focus,p=PLANETS[i],ee=S.ex?.62:p[2],rd=.55+1.05*Math.pow(p[1],.55),NS=12;
      for(let k=0;k<NS;k++){const pos=[];for(let j=0;j<10;j++){const M0=(k+j/10)/NS*6.283,M1=(k+(j+1)/10)/NS*6.283,P=M=>{let E=M;for(let q=0;q<6;q++)E-=(E-ee*Math.sin(E)-M)/(1-ee*Math.cos(E));return[rd*(Math.cos(E)-ee),Y-.005,rd*Math.sqrt(1-ee*ee)*Math.sin(E)]};pos.push(0,Y-.005,0,...P(M0),...P(M1))}
        const g=new T.BufferGeometry();g.setAttribute("position",new T.BufferAttribute(new Float32Array(pos),3));const m=new T.Mesh(g,new T.MeshBasicMaterial({color:k%2?0x2A9D8F:0xF4A261,transparent:true,opacity:.18,side:2,depthWrite:false}));wg.add(m);wedges.push(m)}};
    const fl=B.part("GF",{n:"Gravity and velocity arrows",d:"Orange: the Sun's gravitational pull, always towards the Sun. Blue: the planet's velocity, along the orbit. Gravity bends the path into an orbit.",at:[-2.4,1.6,1.4]});
    const fA=B.grp(fl),vA=B.grp(fl);B.cyl(fA,.018,.018,1,0xEE5A24,0,.5,0,0,0,0,{emissive:0xEE5A24,emissiveIntensity:.6});B.cyl(fA,0,.05,.12,0xEE5A24,0,1.0,0,0,0,0,{emissive:0xEE5A24,emissiveIntensity:.6});
    B.cyl(vA,.018,.018,1,0x3A86FF,0,.5,0,0,0,0,{emissive:0x3A86FF,emissiveIntensity:.6});B.cyl(vA,0,.05,.12,0x3A86FF,0,1.0,0,0,0,0,{emissive:0x3A86FF,emissiveIntensity:.6});
    const up=new T.Vector3(0,1,0),q=new T.Quaternion(),dv=new T.Vector3();
    const point=(g,from,dir,len)=>{g.position.copy(from);dv.copy(dir).normalize();q.setFromUnitVectors(up,dv);g.quaternion.copy(q);g.scale.set(1,Math.max(.05,len),1)};
    let built=false;
    return{update(dt,S,V){e.sim(S,dt);if(S._rebuild||!built){PLANETS.forEach((_,i)=>setLine(i));buildW();S._rebuild=false;built=true}
      PLANETS.forEach((p,i)=>{const k=e.kep(i,S);meshes[i].position.set(k.x,Y,k.z);meshes[i].rotation.y+=dt*.6;if(meshes[i].userData.moon)meshes[i].userData.moon.rotation.y=S.days/27.3*6.283});
      lines.forEach(l=>l.visible=V.layers.orbits!==false);
      const k=S.k,M=(((S.days/365.25)/PLANETS[S.focus][3]*6.283+S.focus*1.7)%6.283+6.283)%6.283,cur=Math.floor(M/6.283*12);
      wg.visible=V.layers.areas!==false&&V.explode<.05;wedges.forEach((w,j)=>w.material.opacity=j===cur?.55:.14);
      const pp=new T.Vector3(k.x,Y,k.z),fv=pp.clone().negate().setY(0),show=V.layers.forces!==false&&V.explode<.05;fA.visible=vA.visible=show;
      point(fA,pp,fv,Math.min(1.4,.08/(S.r*S.r)*(S.focus===4?.5:1)+.15));
      const d=.001,k2=e.kep(S.focus,Object.assign({},S,{days:S.days+d*365})),vel=new T.Vector3(k2.x-k.x,0,k2.z-k.z);point(vA,pp,vel,S.v/45);
    }};
  },
  lab:{mode:"build",title:"VR lab: build the solar system",intro:"Place the Sun and the planets in order, outwards from the Sun. In a VR headset you place each planet with your hands; on a phone or laptop, tap them in the tray.",start:"Start building",verb:"Place",doneTitle:"Solar system complete",doneText:"All planets are in the right order. Go to Simulate to speed up time and test Kepler's laws."},
  workshop:[["SU","Place the Sun at the centre","It contains 99.8% of the solar system's mass"],["ME","Place Mercury, the closest planet","Fastest: 47 km/s"],["VE","Place Venus","Hottest planet: about 465 °C"],["EA","Place the Earth and the Moon","1 AU = 150 million km from the Sun"],["MA","Place Mars","Its year lasts 687 days"],["JU","Place Jupiter, the biggest planet","More than 11 Earth years per orbit"],["SA","Place Saturn","About 29 Earth years per orbit"],["OR","Add the orbit paths","Each is an ellipse with the Sun at one focus"],["GF","Add the gravity and velocity arrows","Gravity always points to the Sun"]],
  faults:[{id:"merc",kind:"Investigation",title:"Why is Mercury's year so short?",story:"Mercury goes round the Sun in only 88 days, but Earth takes 365. Mei Ling thinks it is because Mercury is the smallest planet. Use the model to test her idea.",
    apply:S=>{S.focus=0;S.ex=0;S._rebuild=true},clear:S=>{S.focus=2;S._rebuild=true},symptoms:["Mercury: 88 days","Earth: 365 days","Mercury is small"],
    tests:[["Measure Mercury's distance from the Sun","About 0.39 AU, less than half of Earth's 1 AU."],["Measure its orbital speed","About 47 km/s, compared with Earth's 30 km/s."],["Compare the Sun's pull per kilogram","About 6.6 times stronger than at the Earth."],["Work out T² ÷ r³ for Mercury and Earth","Both are 1.00: the same law fits both, whatever their size."]],
    q:"What is the best explanation?",options:["It is closer to the Sun, where gravity is stronger, so it moves faster around a shorter orbit","It is the smallest planet","It spins fastest on its own axis","It has no moon"],answer:0,explain:"The period depends on the distance from the Sun, not on the planet's size: T² ∝ r³. Closer in, the Sun's pull is stronger, so the planet must move faster to stay in orbit, and its path is shorter too."}],
  quiz:[{q:"What shape is a planet's orbit (Kepler's 1st law)?",o:["A perfect circle with the Sun at the centre","An ellipse with the Sun at one focus","A spiral","A straight line"],a:1,e:"Orbits are ellipses. Most are very close to circles.",focus:"OR"},
    {q:"Where in its orbit does a planet move fastest?",o:["Farthest from the Sun","Closest to the Sun","It always moves at the same speed","Halfway round"],a:1,e:"Equal areas in equal times (2nd law) means it must move faster when it is closer.",focus:"EA"},
    {q:"Kepler's 3rd law says that…",o:["T ∝ r","T² ∝ r³","T ∝ r²","T³ ∝ r²"],a:1,e:"The square of the period is proportional to the cube of the radius.",focus:"MA"},
    {q:"A planet is 4 times farther from the Sun than Earth. How long is its year?",o:["4 years","8 years","16 years","64 years"],a:1,e:"T² ∝ r³: T² = 4³ = 64, so T = 8 years.",focus:"JU"},
    {q:"What provides the centripetal force that keeps the Earth in orbit?",o:["The Earth's spin","The Sun's gravitational pull","Magnetism","Air resistance"],a:1,e:"Gravity from the Sun pulls the Earth towards it, bending its path into an orbit.",focus:"SU"}]
};
