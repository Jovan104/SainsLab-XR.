/* ===================== study planner ===================== */
const ACTS={notes:["Read notes",15,"book"],explore:["Explore in 3D",15,"atom"],sim:["Simulate",20,"play"],shop:["VR lab",20,"flask"],fix:["Investigate",15,"search"],quiz:["Quest quiz",10,"trophy"]};
const DAYN=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],DAYL=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const TODAY=(new Date().getDay()+6)%7;
const ses=(id,act,done)=>({id,act,min:ACTS[act][1],done:!!done,k:Math.random().toString(36).slice(2,8)});
const PLAN={goal:240,sel:TODAY,remind:true,time:"20:30",f:"All",days:[[],[],[],[],[],[],[]]};
(()=>{const d=PLAN.days,t=TODAY;d[(t+5)%7].push(ses("heart","notes",1),ses("heart","sim",1));d[(t+6)%7].push(ses("motor","quiz",1));d[t].push(ses("plant","notes"),ses("plant","sim"),ses("plant","fix"));d[(t+1)%7].push(ses("electro","shop"),ses("electro","quiz"));d[(t+3)%7].push(ses("orbit","explore"),ses("orbit","sim"))})();
function dayDate(i){const now=new Date(),d=new Date(now);d.setDate(now.getDate()+(i-TODAY));return d}
const mins=a=>a.reduce((x,s)=>x+s.min,0),fmt=m=>m>=60?`${Math.floor(m/60)} h${m%60?" "+m%60+" min":""}`:`${m} min`;
function sesRoute(s){return s.id+(s.act==="explore"?"":"-"+({notes:"notes",sim:"sim",shop:"lab",fix:"inv",quiz:"quiz"})[s.act])}
function autoPlan(){const todo=[];ENGINE_IDS.forEach(id=>{["notes","sim","shop","fix","quiz"].forEach(a=>{const k=a==="notes"?"explore":a;if(!PROG[id][k])todo.push([id,a])})});
  let planned=PLAN.days.reduce((x,d)=>x+mins(d.filter(s=>!s.done)),0)+PLAN.days.reduce((x,d)=>x+mins(d.filter(s=>s.done)),0);let i=0,added=0;
  for(let off=0;off<7&&planned<PLAN.goal;off++){const di=(TODAY+off)%7;if(di<TODAY)continue;let n=PLAN.days[di].filter(s=>!s.done).length;while(n<3&&planned<PLAN.goal&&i<todo.length){const [id,a]=todo[i++];if(PLAN.days.some(d=>d.some(s=>s.id===id&&s.act===a)))continue;const s=ses(id,a);PLAN.days[di].push(s);planned+=s.min;n++;added++}}
  toast(added?`Added ${added} sessions to reach your weekly goal`:"Your week already meets your goal");renderPlanner()}
function renderPlanner(){const P=PLAN,day=P.days[P.sel],planned=P.days.reduce((x,d)=>x+mins(d),0),done=P.days.reduce((x,d)=>x+mins(d.filter(s=>s.done)),0),maxd=Math.max(60,...P.days.map(mins));
  const nextS=day.find(s=>!s.done);
  $("#planBody").innerHTML=`<div class="planhead"><div><h2 class="h1 disp">Study planner</h2><p class="sub">Plan your week, adjust your study time and jump straight into each session.</p></div><button class="btn line sm" id="pRemind" aria-pressed="${P.remind}">${ICON.clock.replace("<svg",'<svg width="16" height="16"')}${P.remind?"Reminder "+P.time:"Reminder off"}</button></div>
  <div class="week" role="tablist" aria-label="Days of the week">${P.days.map((d,i)=>{const dt=dayDate(i),m=mins(d),dn=mins(d.filter(s=>s.done));return `<button role="tab" data-day="${i}" aria-selected="${i===P.sel}" class="${i===TODAY?"today":""}"><span>${DAYN[i]}</span><b>${dt.getDate()}</b><i class="wbar"><i style="height:${m/maxd*100}%"></i><i class="dn" style="height:${dn/maxd*100}%"></i></i><small>${m?fmt(m):"–"}</small></button>`}).join("")}</div>
  <div class="twocol"><div>
    <div class="pcard goalcard"><div style="display:flex;justify-content:space-between;align-items:baseline"><h4>Weekly goal</h4><b>${fmt(P.goal)}</b></div>
      <input type="range" id="pGoal" min="60" max="600" step="30" value="${P.goal}" aria-label="Weekly study goal" style="width:100%;accent-color:var(--hot)">
      <div class="gbar"><i class="pl" style="width:${Math.min(100,planned/P.goal*100)}%"></i><i class="dn" style="width:${Math.min(100,done/P.goal*100)}%"></i></div>
      <div class="glegend"><span><i style="background:var(--good)"></i>Done ${fmt(done)}</span><span><i style="background:#9EC9F5"></i>Planned ${fmt(planned)}</span><span>${planned>=P.goal?"Goal covered":fmt(P.goal-planned)+" to plan"}</span></div>
      <button class="btn hot" id="pAuto" style="width:100%;margin-top:10px">${ICON.star.replace("<svg",'<svg width="18" height="18"')}Auto-plan my week</button></div>
    <div class="qhead"><h3 class="h2 disp" style="margin:0">Add a session</h3><small>to ${DAYL[P.sel]}</small></div>
    <div class="qfilter">${["All",...SUBJ.map(x=>x[0])].map(sb=>`<button data-pf="${sb}" aria-pressed="${P.f===sb}">${sb!=="All"?`<i style="background:${SCOL[sb]}"></i>`:""}${sb}</button>`).join("")}</div>
    ${ENGINE_IDS.filter(id=>P.f==="All"||ENGINES[id].subject===P.f).map(id=>{const E=ENGINES[id];return `<div class="addrow"><span class="ai" style="background:${SCOL[E.subject]}1F;color:${SCOL[E.subject]}">${ICON[id]}</span><span class="an"><b>${E.vehicle}</b><small>${E.subject} · ${pct(id)}% done</small></span><select data-act="${id}" aria-label="Activity for ${E.vehicle}">${Object.entries(ACTS).map(([k,[n,m]])=>`<option value="${k}">${n} · ${m} min</option>`).join("")}</select><button class="btn line sm" data-add="${id}">Add</button></div>`}).join("")}
  </div><div>
    <div class="pcard daycard"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div><h4 class="disp" style="font-size:20px">${DAYL[P.sel]}${P.sel===TODAY?" · today":""}</h4><span class="sub small">${dayDate(P.sel).toLocaleDateString("en-GB",{day:"numeric",month:"long"})}</span></div><span class="chip" style="background:var(--soft)">${day.length} session${day.length===1?"":"s"}</span></div>
      <div class="dstats"><div><span>Study time</span><b>${fmt(mins(day))}</b></div><div><span>Done</span><b>${day.filter(s=>s.done).length}/${day.length}</b></div><div><span>XP on offer</span><b>${day.filter(s=>s.act==="quiz"&&!PROG[s.id].quiz).length*100}</b></div></div>
      ${day.length?day.map((s,i)=>{const E=ENGINES[s.id],[an,,ai]=ACTS[s.act];return `<div class="sess${s.done?" done":""}"><span class="sn">${s.done?ICON.check:i+1}</span><span class="si" style="color:${SCOL[E.subject]}">${ICON[ai]}</span><span class="st2"><b>${E.vehicle} · ${an}</b><span class="dur"><button data-dur="${s.k}" data-d="-5" aria-label="5 minutes less" ${s.min<=5?"disabled":""}>−</button><em>${s.min} min</em><button data-dur="${s.k}" data-d="5" aria-label="5 minutes more">+</button></span></span>
        <span class="ctl3"><button data-mv="${s.k}" data-d="-1" aria-label="Move up" ${i===0?"disabled":""}>↑</button><button data-mv="${s.k}" data-d="1" aria-label="Move down" ${i===day.length-1?"disabled":""}>↓</button><button data-del="${s.k}" aria-label="Remove" class="del">✕</button></span>
        <button class="go ${s.done?"replay":"start"}" data-start="${s.k}">${s.done?"Again":"Start"}${ICON.arrow}</button></div>`}).join(""):`<div class="empty"><b>Nothing planned yet.</b><span>Add a session from the list, or tap Auto-plan my week.</span></div>`}
      ${nextS?`<button class="btn primary" style="width:100%;margin-top:6px" data-start="${nextS.k}">${ICON.play.replace("<svg",'<svg width="16" height="16"')}Start next: ${ENGINES[nextS.id].vehicle} · ${ACTS[nextS.act][0]}</button>`:""}
      ${day.length?`<button class="btn line" style="width:100%;margin-top:8px" id="pClear">Clear ${DAYN[P.sel]}</button>`:""}</div>
    <div class="pcard"><h4>Study tips</h4><p class="sub small">Short sessions of 15–25 minutes with a break in between help you remember more than one long session. Mix subjects across the week, and finish each topic with its quest quiz to check what you know.</p></div>
  </div></div>`;
  const b=$("#planBody"),find=k=>{for(const d of P.days){const i=d.findIndex(s=>s.k===k);if(i>=0)return[d,i]}return[null,-1]};
  b.querySelectorAll("[data-day]").forEach(x=>x.onclick=()=>{P.sel=+x.dataset.day;renderPlanner()});
  b.querySelectorAll("[data-pf]").forEach(x=>x.onclick=()=>{P.f=x.dataset.pf;renderPlanner()});
  b.querySelectorAll("[data-add]").forEach(x=>x.onclick=()=>{const id=x.dataset.add,a=b.querySelector(`[data-act="${id}"]`).value;day.push(ses(id,a));toast(`Added ${ENGINES[id].vehicle} · ${ACTS[a][0]} to ${DAYL[P.sel]}`);renderPlanner()});
  b.querySelectorAll("[data-dur]").forEach(x=>x.onclick=()=>{const [d,i]=find(x.dataset.dur);d[i].min=Math.max(5,d[i].min+ +x.dataset.d);renderPlanner()});
  b.querySelectorAll("[data-mv]").forEach(x=>x.onclick=()=>{const [d,i]=find(x.dataset.mv),j=i+ +x.dataset.d;[d[i],d[j]]=[d[j],d[i]];renderPlanner()});
  b.querySelectorAll("[data-del]").forEach(x=>x.onclick=()=>{const [d,i]=find(x.dataset.del);const s=d.splice(i,1)[0];toast(`Removed ${ENGINES[s.id].vehicle} · ${ACTS[s.act][0]}`);renderPlanner()});
  b.querySelectorAll("[data-start]").forEach(x=>x.onclick=()=>{const [d,i]=find(x.dataset.start);d[i].done=true;go(sesRoute(d[i]))});
  $("#pGoal").oninput=e=>{P.goal=+e.target.value;renderPlanner()};
  $("#pAuto").onclick=autoPlan;const c=$("#pClear");if(c)c.onclick=()=>{P.days[P.sel]=[];renderPlanner()};
  $("#pRemind").onclick=()=>{P.remind=!P.remind;toast(P.remind?"Reminder on: 8:30 pm on days with sessions":"Reminders off");renderPlanner()}}
enterHooks.planner=()=>renderPlanner();
