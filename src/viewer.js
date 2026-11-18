/* ===================== 3D viewer core (three.js) ===================== */
const DOT_TEX=(()=>{const c=document.createElement("canvas");c.width=c.height=64;const g=c.getContext("2d");const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,"rgba(255,255,255,1)");r.addColorStop(.35,"rgba(255,255,255,.85)");r.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=r;g.fillRect(0,0,64,64);return c})();
const ROOM_SVG=`<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" width="100%" height="100%"><defs><linearGradient id="wl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9CED3"/><stop offset="1" stop-color="#E4E1DA"/></linearGradient><linearGradient id="dk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9C7A55"/><stop offset="1" stop-color="#6E5236"/></linearGradient></defs>
<rect width="400" height="300" fill="url(#wl)"/><rect x="250" y="20" width="110" height="80" fill="#AFC6D6" stroke="#8E9AA4" stroke-width="4"/><path d="M305 20v80M250 60h110" stroke="#8E9AA4" stroke-width="3"/>
<rect x="30" y="40" width="70" height="90" fill="#F2F0EA" stroke="#B9B3A6"/><path d="M40 60h50M40 75h40M40 90h46" stroke="#9A9486" stroke-width="3"/>
<path d="M0 190 L400 175 L400 300 L0 300Z" fill="url(#dk)"/><path d="M0 190 L400 175" stroke="#5B432C" stroke-width="3"/>
<rect x="300" y="150" width="60" height="30" rx="3" fill="#2E3740" transform="skewX(-12)"/><circle cx="80" cy="200" r="10" fill="#E7E2D6"/><rect x="70" y="170" width="20" height="30" rx="3" fill="#F7F5F0"/></svg>`;

class Flow{
  constructor(V,d){this.d=d;const T=THREE;this.layer=d.layer||"air";
    const pts=d.pts.map(p=>p.isVector3?p:new T.Vector3(...p));const curve=new T.CatmullRomCurve3(pts,!!d.closed,"catmullrom",d.tension??.25);
    this.N=96;this.lut=curve.getSpacedPoints(this.N);this.len=curve.getLength();
    const n=this.n=d.n||60;this.t=new Float32Array(n);this.off=new Float32Array(n*3);this.pos=new Float32Array(n*3);this.col=new Float32Array(n*3);
    const sp=d.spread??.04;for(let i=0;i<n;i++){this.t[i]=Math.random();const a=Math.random()*6.283,r=Math.sqrt(Math.random())*sp;this.off[i*3]=Math.cos(a)*r;this.off[i*3+1]=(Math.random()-.5)*sp*1.2;this.off[i*3+2]=Math.sin(a)*r}
    const g=new T.BufferGeometry();g.setAttribute("position",new T.BufferAttribute(this.pos,3));g.setAttribute("color",new T.BufferAttribute(this.col,3));
    const tex=new T.CanvasTexture(DOT_TEX);
    this.mat=new T.PointsMaterial({size:d.size||.05,map:tex,vertexColors:true,transparent:true,depthWrite:false,blending:d.normal?T.NormalBlending:T.AdditiveBlending,sizeAttenuation:true});if(d.normal)this.mat.alphaTest=.2;
    this.pts=new T.Points(g,this.mat);this.pts.frustumCulled=false;this.pts.renderOrder=5;(d.parent||V.root).add(this.pts);
    const stops=(d.grad||[[0,d.color||"#5ad"],[1,d.color2||d.color||"#5ad"]]).map(([t,h])=>[t,new T.Color(h)]);this.stops=stops;this.tmp=new T.Color()}
  colorAt(t){const s=this.stops;if(t<=s[0][0])return this.tmp.copy(s[0][1]);for(let i=1;i<s.length;i++)if(t<=s[i][0]){const a=s[i-1],b=s[i];return this.tmp.copy(a[1]).lerp(b[1],(t-a[0])/(b[0]-a[0]))}return this.tmp.copy(s[s.length-1][1])}
  update(dt,visible){const d=this.d;const act=visible?clamp(d.active?d.active():1,0,1):0;this.pts.visible=act>0.01;if(!this.pts.visible)return;if(d.normal)this.mat.opacity=.5+.5*act;
    const v=(d.speed?(typeof d.speed==="function"?d.speed():d.speed):.3)*dt;const N=this.N,L=this.lut;
    for(let i=0;i<this.n;i++){let t=this.t[i]+v*(0.85+0.3*((i*7919)%13)/13);if(t>1)t-=1;if(t<0)t+=1;this.t[i]=t;
      const f=t*N,k=Math.floor(f),u=f-k,p0=L[k],p1=L[Math.min(N,k+1)];
      this.pos[i*3]=p0.x+(p1.x-p0.x)*u+this.off[i*3];this.pos[i*3+1]=p0.y+(p1.y-p0.y)*u+this.off[i*3+1];this.pos[i*3+2]=p0.z+(p1.z-p0.z)*u+this.off[i*3+2];
      const c=this.colorAt(t),edge=d.normal?1:Math.min(1,t*12,(1-t)*12)*act;this.col[i*3]=c.r*edge;this.col[i*3+1]=c.g*edge;this.col[i*3+2]=c.b*edge}
    this.pts.geometry.attributes.position.needsUpdate=true;this.pts.geometry.attributes.color.needsUpdate=true}
}

class Viewer{
  constructor(el,opt={}){const T=THREE;this.el=el;this.opt=opt;
    try{this.r=new T.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true})}catch(e){el.innerHTML='<p style="color:#fff;padding:24px">The 3D view needs WebGL, which is turned off in this browser.</p>';this.dead=true;return}
    const r=this.r;r.setPixelRatio(Math.min(window.devicePixelRatio||1,2));r.localClippingEnabled=true;
    this.room=document.createElement("div");this.room.className="room";this.room.innerHTML=ROOM_SVG;el.appendChild(this.room);
    el.appendChild(r.domElement);this.labs=document.createElement("div");this.labs.className="labs";el.appendChild(this.labs);
    this.vrui=document.createElement("div");this.vrui.className="vrui";this.vrui.innerHTML=`<div class="eye l"><div class="ret"><i></i></div><div class="vrcard"></div></div><div class="eye r"><div class="ret"><i></i></div><div class="vrcard"></div></div><div class="vrbar"><span class="vrhint">Look at a part for 1 second to select it</span><button class="vrexit" type="button">Exit VR</button></div>`;el.appendChild(this.vrui);
    this.vrui.querySelector(".vrexit").onclick=()=>{this.setVR(false);this.opt.onVR&&this.opt.onVR(false)};
    this.stereo=new T.StereoCamera();this.stereo.eyeSep=.09;this.vr=false;this.xrOn=false;this.gz={id:null,t:0,k:0};this.gray=new T.Raycaster();this.c0=new T.Vector2(0,0);
    this.scene=new T.Scene();this.bg=new T.Color(0x0D1520);this.scene.background=this.bg;this.scene.fog=new T.Fog(0x0D1520,14,30);
    this.cam=new T.PerspectiveCamera(36,1,.05,80);
    this.ctl=new T.OrbitControls(this.cam,r.domElement);this.ctl.enableDamping=true;this.ctl.dampingFactor=.08;this.ctl.minDistance=1.2;this.ctl.maxDistance=16;this.ctl.autoRotateSpeed=1.2;
    this.scene.add(new T.HemisphereLight(0xE9F2FF,0x24303C,.75));
    const sun=new T.DirectionalLight(0xffffff,.95);sun.position.set(4,8,6);this.scene.add(sun);
    const rim=new T.DirectionalLight(0x8FD6E0,.45);rim.position.set(-6,3,-5);this.scene.add(rim);
    const fill=new T.DirectionalLight(0xFFD6C2,.25);fill.position.set(2,-3,6);this.scene.add(fill);
    this.floor=new T.Group();const grid=new T.GridHelper(24,48,0x1F3A52,0x14273A);this.floor.add(grid);
    const disc=new T.Mesh(new T.CircleGeometry(10,60),new T.MeshBasicMaterial({color:0x101C28}));disc.rotation.x=-Math.PI/2;disc.position.y=-.004;this.floor.add(disc);this.scene.add(this.floor);
    this.shadow=new T.Mesh(new T.CircleGeometry(1,40),new T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.28,depthWrite:false}));this.shadow.rotation.x=-Math.PI/2;this.shadow.position.y=.002;this.shadow.visible=false;this.scene.add(this.shadow);
    this.root=new T.Group();this.scene.add(this.root);
    this.plane=new T.Plane(new T.Vector3(0,0,-1),0);
    this.parts={};this.flows=[];this.housing=[];this.explode=0;this.cut=false;this.xray=false;this.showLabels=true;this.layers={};this.only=null;this.sel=null;this.anim=false;
    this.tg=new T.Vector3();this.cg=new T.Vector3();this.v=new T.Vector3();this.lw=0;this.lh=0;this.S={};this.last=performance.now();
    const ray=new T.Raycaster(),m=new T.Vector2();let down=null;
    r.domElement.addEventListener("pointerdown",e=>{down=[e.clientX,e.clientY];this.anim=false});
    r.domElement.addEventListener("wheel",()=>{this.anim=false},{passive:true});
    r.domElement.addEventListener("pointerup",e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;const b=r.domElement.getBoundingClientRect();
      m.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);ray.setFromCamera(m,this.cam);
      const h=ray.intersectObjects(this.root.children,true).find(x=>{let o=x.object;if(!o.visible||o.isPoints)return false;while(o&&!o.userData.part)o=o.parent;return o&&o.visible&&!(this.cut&&o.userData.housing&&x.point.z>0)});
      if(h){let o=h.object;while(o&&!o.userData.part)o=o.parent;if(o&&this.opt.onPick)this.opt.onPick(o.userData.part)}});
    const loop=()=>{requestAnimationFrame(loop);if(!this.xrOn)this.frame()};loop();
    this.ori=null;window.addEventListener("deviceorientation",e=>{if(this.vr&&e.alpha!=null)this.ori=[e.alpha,e.beta,e.gamma]});
  }
  /* ---------- building ---------- */
  load(E){const T=THREE;this.clear();this.E=E;this.S=E.S;const V=this;
    const mk=(c,o={})=>{const m=new T.MeshStandardMaterial(Object.assign({color:c,roughness:.5,metalness:.25},o));if(o.housing){m.side=T.DoubleSide;m.transparent=true;V.housing.push(m)}return m};
    const add=(par,geo,c,o,x,y,z,rx=0,ry=0,rz=0)=>{const mesh=new T.Mesh(geo,c&&c.isMaterial?c:mk(c,o||{}));mesh.position.set(x||0,y||0,z||0);mesh.rotation.set(rx,ry,rz);(par||V.root).add(mesh);if(o&&o.housing)mesh.userData.housing=true;return mesh};
    const B={T,V,
      mat:mk,
      part(id,meta,parent){const g=new T.Group();g.userData.part=id;if(meta.housing)g.userData.housing=true;(parent||V.root).add(g);V.parts[id]={g,meta,base:null};return g},
      grp(parent){const g=new T.Group();(parent||V.root).add(g);return g},
      box:(p,w,h,d,c,x,y,z,rx,ry,rz,o)=>add(p,new T.BoxGeometry(w,h,d),c,o,x,y,z,rx,ry,rz),
      cyl:(p,rt,rb,h,c,x,y,z,rx,ry,rz,o,seg=28,open=false)=>add(p,new T.CylinderGeometry(rt,rb,h,seg,1,open),c,o,x,y,z,rx,ry,rz),
      arc:(p,r,h,c,x,y,z,start,len,rx,ry,rz,o)=>add(p,new T.CylinderGeometry(r,r,h,24,1,false,start,len),c,o,x,y,z,rx,ry,rz),
      sph:(p,r,c,x,y,z,o,sx=1,sy=1,sz=1)=>{const m=add(p,new T.SphereGeometry(r,24,16),c,o,x,y,z);m.scale.set(sx,sy,sz);return m},
      torus:(p,R,r,c,x,y,z,rx,ry,rz,o,arc=Math.PI*2)=>add(p,new T.TorusGeometry(R,r,10,36,arc),c,o,x,y,z,rx,ry,rz),
      tube:(p,pts,r,c,o,closed=false,seg=64)=>{const cv=new T.CatmullRomCurve3(pts.map(q=>q.isVector3?q:new T.Vector3(...q)),closed,"catmullrom",.3);return add(p,new T.TubeGeometry(cv,seg,r,12,closed),c,o)},
      lathe:(p,pts,c,o,x,y,z,rx,ry,rz,seg=48)=>add(p,new T.LatheGeometry(pts.map(([a,b])=>new T.Vector2(a,b)),seg),c,o,x,y,z,rx,ry,rz),
      inst:(p,geo,c,o,count)=>{const m=new T.InstancedMesh(geo,c&&c.isMaterial?c:mk(c,o||{}),count);(p||V.root).add(m);return m},
      flow:(d)=>{const f=new Flow(V,d);V.flows.push(f);V.layers[f.layer]=V.layers[f.layer]??true;return f},
      helix:(p,r,h,turns,wire,c,x,y,z,o)=>{const pts=[];for(let i=0;i<=turns*16;i++){const a=i/16*6.283;pts.push(new T.Vector3(Math.cos(a)*r,i/(turns*16)*h,Math.sin(a)*r))}const cv=new T.CatmullRomCurve3(pts);return add(p,new T.TubeGeometry(cv,turns*16,wire,6),c,o,x,y,z)}
    };
    this.inst=E.build(B)||{};
    Object.values(this.parts).forEach(P=>{P.base=P.g.position.clone();P.g.traverse(o=>{if(o.isMesh&&o.material&&o.material.emissive){o.userData.em=o.material.emissive.getHex();o.userData.ei=o.material.emissiveIntensity}})});
    this.buildLabels();this.home();this.applyLook();
  }
  clear(){const T=THREE;while(this.root.children.length){const c=this.root.children.pop();c.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose())}})}
    this.parts={};this.flows=[];this.housing=[];this.layers={};this.sel=null;this.only=null;this.explode=0;this.labs.innerHTML="";this.labEls={};this.inst=null}
  buildLabels(){this.labs.innerHTML="";this.labEls={};let i=0;Object.entries(this.parts).forEach(([id,P])=>{if(P.meta.nolabel)return;i++;P.n=i;const b=document.createElement("button");b.className="lab3d";b.innerHTML=`<i>${i}</i><span>${P.meta.n}</span>`;b.onclick=()=>this.opt.onPick&&this.opt.onPick(id);this.labs.appendChild(b);this.labEls[id]=b})}
  /* ---------- camera ---------- */
  home(){const c=this.E.camera||{pos:[4,3,5],tgt:[0,.6,0]};this.HP=new THREE.Vector3(...c.pos);this.HT=new THREE.Vector3(...c.tgt);this.fitted=false;this.cam.position.copy(this.HP);this.ctl.target.copy(this.HT);this.cg.copy(this.HP);this.tg.copy(this.HT)}
  reset(){this.cg.copy(this.HP);this.tg.copy(this.HT);this.anim=true}
  focus(id,dist){const P=this.parts[id];if(!P)return;const c=this.anchor(id);this.tg.copy(c);const d=this.cam.position.clone().sub(this.ctl.target).normalize();this.cg.copy(c).addScaledVector(d,dist||Math.max(2.2,this.cam.position.distanceTo(this.ctl.target)*.7));this.anim=true}
  anchor(id){const P=this.parts[id];if(!P.meta.at)return new THREE.Box3().setFromObject(P.g).getCenter(new THREE.Vector3());
    const a=new THREE.Vector3(...P.meta.at);if(P.meta.dir)a.addScaledVector(new THREE.Vector3(...P.meta.dir),this.explode);if(P.removed)a.y+=3;return this.root.localToWorld(a)}
  /* ---------- look ---------- */
  applyLook(){this.housing.forEach(m=>{m.clippingPlanes=this.cut?[this.plane]:[];m.opacity=this.xray?.16:1;m.depthWrite=!this.xray;m.needsUpdate=true})}
  setCut(b){this.cut=b;this.applyLook()} setXray(b){this.xray=b;this.applyLook()}
  setAR(b){this.ar=b;this.el.classList.toggle("ar",b);this.scene.background=b?null:this.bg;this.scene.fog=b?null:new THREE.Fog(0x0D1520,14,30);this.floor.visible=!b;this.shadow.visible=b;
    if(b){const bb=new THREE.Box3().setFromObject(this.root);const s=bb.getSize(new THREE.Vector3());this.shadow.scale.set(s.x*.62,s.z*.62||1,1)}}
  /* ---------- virtual reality ---------- */
  room3d(){const T=THREE;if(this.env)return this.env;const g=new T.Group();
    const c=document.createElement("canvas");c.width=16;c.height=256;const x=c.getContext("2d");const gr=x.createLinearGradient(0,0,0,256);gr.addColorStop(0,"#06101C");gr.addColorStop(.45,"#123049");gr.addColorStop(.52,"#1E5A6B");gr.addColorStop(.56,"#0E1B29");gr.addColorStop(1,"#0A121C");x.fillStyle=gr;x.fillRect(0,0,16,256);
    const dome=new T.Mesh(new T.SphereGeometry(28,32,16),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),side:T.BackSide,fog:false}));g.add(dome);
    const bm=new T.MeshStandardMaterial({color:0x2A3B4C,roughness:.7}),tm=new T.MeshStandardMaterial({color:0xD9E2EA,roughness:.4}),lm=new T.MeshBasicMaterial({color:0x7FE3F0});
    for(let i=0;i<10;i++){const a=i/10*6.283+.3,R=11.5;const b=new T.Group();b.position.set(Math.cos(a)*R,0,Math.sin(a)*R);b.lookAt(0,0,0);
      const k=new T.Mesh(new T.BoxGeometry(2.6,.9,1),bm);k.position.y=.45;b.add(k);const t=new T.Mesh(new T.BoxGeometry(2.7,.06,1.1),tm);t.position.y=.93;b.add(t);
      const f=new T.Mesh(new T.CylinderGeometry(.12,.2,.4,12),new T.MeshStandardMaterial({color:0x9FD8E6,transparent:true,opacity:.6}));f.position.set(-.7,1.16,0);b.add(f);
      const l=new T.Mesh(new T.BoxGeometry(2.2,.04,.04),lm);l.position.set(0,3.4,0);b.add(l);g.add(b)}
    g.visible=false;this.scene.add(g);this.env=g;return g}
  setVR(b){this.vr=b;this.el.classList.toggle("vr",b);const w=this.el.closest(".vwrap");if(w)w.classList.toggle("vron",b);const app=document.getElementById("app");if(app)app.classList.toggle("vrmode",b);
    const hint=this.vrui.querySelector(".vrhint");if(hint)hint.textContent=this.el.clientWidth<this.el.clientHeight?"Turn your phone sideways and look at a part to select it":"Look at a part for 1 second to select it";this.room3d().visible=b;this.scene.fog=b?new THREE.Fog(0x0D1520,18,40):new THREE.Fog(0x0D1520,14,30);this.lw=0;this.ori=null;this.gz={id:null,t:0,k:0};this.gaze(null,0);
    if(b){this.preVR={l:this.showLabels};this.showLabels=false}else if(this.preVR){this.showLabels=this.preVR.l}}
  gaze(id,k){this.vrui.querySelectorAll(".ret i").forEach(i=>i.style.background=`conic-gradient(#FF5A1F ${k*360}deg,rgba(255,255,255,.25) 0)`);
    const P=id&&this.parts[id];this.vrui.querySelectorAll(".vrcard").forEach(c=>{c.style.display=P?"block":"none";if(P)c.innerHTML=`<b>${P.meta.n}</b>${this.sel===id&&P.meta.d?`<span>${P.meta.d}</span>`:""}`})}
  gazeTick(dt){const ray=this.gray;ray.setFromCamera(this.c0,this.cam);
    const h=ray.intersectObjects(this.root.children,true).find(x=>{let o=x.object;if(!o.visible||o.isPoints||o.isSprite)return false;while(o&&!o.userData.part)o=o.parent;return o&&o.visible&&!(this.cut&&o.userData.housing&&x.point.z>0)});
    let id=null;if(h){let o=h.object;while(o&&!o.userData.part)o=o.parent;id=o&&o.userData.part}
    if(id&&this.parts[id]&&this.parts[id].meta.nolabel)id=null;
    if(id!==this.gz.id){this.gz={id,t:0,k:0}}else if(id&&this.sel!==id){this.gz.t+=dt;if(this.gz.t>=1.1){this.opt.onPick&&this.opt.onPick(id)}}
    const k=id&&this.sel!==id?Math.min(1,this.gz.t/1.1):(id?1:0);if(Math.abs(k-this.gz.k)>.02||k===0||k===1){this.gz.k=k;this.gaze(id,k)}}
  async enterXR(){const T=THREE;if(!navigator.xr)throw new Error("no xr");const ses=await navigator.xr.requestSession("immersive-vr",{optionalFeatures:["local-floor"]});
    this.r.xr.enabled=true;this.r.xr.setReferenceSpaceType("local-floor");await this.r.xr.setSession(ses);this.xrOn=true;this.room3d().visible=true;
    this.root.scale.setScalar(.38);this.root.position.set(0,.85,-1.7);this.r.setAnimationLoop(()=>this.frame(true));
    ses.addEventListener("end",()=>{this.r.setAnimationLoop(null);this.r.xr.enabled=false;this.xrOn=false;this.root.scale.setScalar(1);this.root.position.set(0,0,0);this.room3d().visible=this.vr;this.lw=0})}
  select(id){this.sel=id;Object.entries(this.parts).forEach(([k,P])=>P.g.traverse(o=>{if(!o.isMesh||!o.material||!o.material.emissive)return;if(k===id){o.material.emissive.setHex(0xFF5A1F);o.material.emissiveIntensity=.45}else{o.material.emissive.setHex(o.userData.em||0);o.material.emissiveIntensity=o.userData.ei??1}}));
    Object.entries(this.labEls).forEach(([k,b])=>b.classList.toggle("sel",k===id))}
  remove(id,on){const P=this.parts[id];if(P){P.removed=on;P.t0=performance.now()}}
  /* ---------- frame ---------- */
  frame(xr){if(this.dead||!this.E||(!xr&&!this.el.offsetParent))return;const now=performance.now(),dt=Math.min(.05,(now-this.last)/1000);this.last=now;
    const w=this.el.clientWidth,h=this.el.clientHeight;if(!this.xrOn&&w&&h&&(w!==this.lw||h!==this.lh)){this.lw=w;this.lh=h;this.r.setSize(w,h,false);this.cam.aspect=(this.vr?w/2:w)/h;this.cam.updateProjectionMatrix();
      if(!this.fitted){this.fitted=true;const f=this.cam.aspect<1?Math.min(2.1,1/Math.pow(this.cam.aspect,.75)):1;this.HP.sub(this.HT).multiplyScalar(f).add(this.HT);this.cam.position.copy(this.HP);this.cg.copy(this.HP)}}
    Object.values(this.parts).forEach(P=>{if(!P.base)return;P.g.position.copy(P.base);if(P.meta.dir)P.g.position.addScaledVector(this.v.set(...P.meta.dir),this.explode);
      if(P.removed!==undefined){const k=clamp((now-P.t0)/600,0,1),e=P.removed?k:1-k;P.g.position.y+=e*3;P.g.visible=e<.98}});
    if(this.inst&&this.inst.update)this.inst.update(dt,this.S,this);if(this.opt.onFrame)this.opt.onFrame(dt,this);
    const showF=this.explode<.05,fs=this.E&&this.E.flowSlow?this.E.flowSlow(this.S):(this.S.slow??1);this.flows.forEach(f=>f.update(dt*fs,showF&&this.layers[f.layer]!==false&&!this.S.paused));
    if(this.anim){this.ctl.target.lerp(this.tg,.08);this.cam.position.lerp(this.cg,.08);if(this.cam.position.distanceTo(this.cg)<.004)this.anim=false}
    if(this.xrOn){this.r.render(this.scene,this.cam);return}
    if(this.vr&&this.ori){const T=THREE,sp=new T.Spherical().setFromVector3(this.v.copy(this.cam.position).sub(this.ctl.target));sp.theta=-this.ori[0]*Math.PI/180;sp.phi=clamp((180-this.ori[1])*Math.PI/180,.25,2.9);this.cam.position.copy(this.ctl.target).add(this.v.setFromSpherical(sp))}
    this.ctl.update();
    if(this.vr){const r=this.r,hw=Math.floor(w/2);this.cam.updateMatrixWorld();this.stereo.update(this.cam);r.setScissorTest(true);r.setScissor(0,0,hw,h);r.setViewport(0,0,hw,h);r.render(this.scene,this.stereo.cameraL);r.setScissor(hw,0,w-hw,h);r.setViewport(hw,0,w-hw,h);r.render(this.scene,this.stereo.cameraR);r.setScissorTest(false);r.setViewport(0,0,w,h);this.gazeTick(dt)}
    else this.r.render(this.scene,this.cam);
    Object.entries(this.labEls).forEach(([id,b])=>{const P=this.parts[id];if(!this.showLabels||P.removed||!P.g.visible||(this.only&&!this.only.includes(id))){b.style.display="none";return}
      this.v.copy(this.anchor(id)).project(this.cam);if(this.v.z>1||Math.abs(this.v.x)>1.05||Math.abs(this.v.y)>1.05){b.style.display="none";return}
      const o=P.meta.off||[0,0];b.style.display="flex";b.style.left=((this.v.x+1)/2*this.lw+o[0])+"px";b.style.top=((1-this.v.y)/2*this.lh+o[1])+"px"})}
}
