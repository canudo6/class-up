
const KEY="classup_v2";
const defaults={
  tasks:[
    {id:1,title:"Pesquisa: Impactos ambientais",subject:"Ciências",date:"2026-08-31",points:150,teacher:"Xavier",description:"Pesquise os principais impactos ambientais causados pelas atividades humanas e apresente pelo menos três soluções possíveis.",icon:"🔬",completed:[]},
    {id:2,title:"Folha de Matemática",subject:"Matemática",date:"2026-09-02",points:100,teacher:"Prof. Carla",description:"Resolva os exercícios da folha entregue em sala.",icon:"√x",completed:[]},
    {id:3,title:"Leitura de capítulo 3",subject:"Português",date:"2026-09-04",points:80,teacher:"Prof. Ana",description:"Leia o capítulo 3 e responda às questões propostas.",icon:"📖",completed:[]}
  ],
  students:[
    {name:"Lucas",points:3240,avatar:"🧑‍🎓"},
    {name:"Mariana",points:2980,avatar:"👩‍🎓"},
    {name:"Gustavo",points:2850,avatar:"🧑‍💻"},
    {name:"Ana Clara",points:2610,avatar:"👩‍🔬"},
    {name:"Pedro",points:2430,avatar:"🧑‍🚀"}
  ],
  profile:{role:"student",name:"Lucas",avatar:"🧑‍🎓",className:"7B"}
};
function load(){
  const raw=localStorage.getItem(KEY);
  if(!raw){localStorage.setItem(KEY,JSON.stringify(defaults));return structuredClone(defaults)}
  try{return JSON.parse(raw)}catch(e){return structuredClone(defaults)}
}
function save(db){localStorage.setItem(KEY,JSON.stringify(db))}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function fmtDate(iso){const [y,m,d]=iso.split("-");return `${d}/${m}/${y}`}
function todayISO(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function taskForDate(db,date){return db.tasks.filter(t=>t.date===date)}
function currentStudent(db){return db.students.find(s=>s.name===db.profile.name)||db.students[0]}
function nav(active,role){
 const items=role==="student"
 ? [["home","🏠","Início"],["calendar","📅","Calendário"],["ranking","🏆","Ranking"],["profile","👤","Perfil"]]
 : [["classes","🏫","Turmas"],["calendar","📅","Calendário"],["tasks","📝","Tarefas"],["ranking","🏆","Ranking"]];
 return `<aside class="side">${items.map(x=>`<button class="nav ${active===x[0]?"active":""}" onclick="go('${x[0]}')">${x[1]}<br>${x[2]}</button>`).join("")}</aside>`
}
function shell(active,role,body){
 const db=load(), p=db.profile, avatar=p.avatar.startsWith("data:")?`<img src="${p.avatar}">`:p.avatar;
 document.body.innerHTML=`<div class="top"><div class="brand"><div class="logo"><img src="logo.png"></div><span>Class<span style="color:#a78bfa">Up</span></span></div><div class="user"><span>${role==="student"?"Aluno":"Professor"} • ${esc(p.name)}</span><div class="avatar">${avatar}</div></div></div><div class="layout">${nav(active,role)}<main class="main">${body}</main></div><div class="modal" id="modal"><div class="modalbox" id="modalbox"></div></div><div class="toast" id="toast"></div>`;
}
function toast(msg){const x=document.getElementById("toast");if(!x)return;x.textContent=msg;x.style.display="block";setTimeout(()=>x.style.display="none",2200)}
function taskHTML(t,action=true){
 return `<div class="task"><div class="icon">${t.icon}</div><div class="taskmain"><b>${esc(t.title)}</b><div class="label">${esc(t.subject)} • ${fmtDate(t.date)} • Prof. ${esc(t.teacher)}</div></div><span class="points">+${t.points} pts</span>${action?`<button class="btn secondary" onclick="openTask(${t.id})">Abrir</button>`:""}</div>`
}
function openTask(id){
 const db=load(),t=db.tasks.find(x=>x.id===id);if(!t)return;
 const role=db.profile.role, done=t.completed.includes(db.profile.name);
 document.getElementById("modalbox").innerHTML=`<h2>${esc(t.title)}</h2><p><span class="badge">${esc(t.subject)}</span> <span class="points">+${t.points} pts</span></p><p class="muted"><b>Professor:</b> ${esc(t.teacher)}<br><b>Entrega:</b> ${fmtDate(t.date)}</p><hr style="border:0;border-top:1px solid var(--border)"><p>${esc(t.description)}</p>${role==="student"?`<div class="actions"><button class="btn secondary" onclick="closeModal()">Fechar</button>${done?'<span class="badge">✓ Confirmada</span>':`<button class="btn primary" onclick="submitTask(${id})">Enviar tarefa</button>`}</div>`:`<div class="actions"><button class="btn secondary" onclick="closeModal()">Fechar</button><button class="btn primary" onclick="markTask(${id})">Marcar alunos</button></div>`}`;
 document.getElementById("modal").classList.add("show");
}
function closeModal(){document.getElementById("modal")?.classList.remove("show")}
function submitTask(id){
 const db=load(),t=db.tasks.find(x=>x.id===id),s=currentStudent(db);
 if(!t.completed.includes(s.name)){t.submitted=t.submitted||[];if(!t.submitted.includes(s.name))t.submitted.push(s.name)}
 save(db);closeModal();toast("Tarefa enviada! Aguarde a confirmação do professor.");go("home")
}
function markTask(id){
 const db=load(),t=db.tasks.find(x=>x.id===id);
 document.getElementById("modalbox").innerHTML=`<h2>${esc(t.title)}</h2><p class="muted">Marque quem concluiu. Cada aluno recebe os pontos uma única vez.</p>${db.students.map(s=>`<div class="task"><input class="check" type="checkbox" data-name="${esc(s.name)}" ${t.completed.includes(s.name)?"checked":""}><div class="taskmain"><b>${esc(s.name)}</b><div class="label">${s.points} pts</div></div><span class="points">+${t.points}</span></div>`).join("")}<button class="btn primary" onclick="saveMarks(${id})">Salvar</button>`;
}
function saveMarks(id){
 const db=load(),t=db.tasks.find(x=>x.id===id),checked=[...document.querySelectorAll(".check:checked")].map(x=>x.dataset.name),old=t.completed||[];
 checked.filter(n=>!old.includes(n)).forEach(n=>{const s=db.students.find(x=>x.name===n);if(s)s.points+=t.points});
 old.filter(n=>!checked.includes(n)).forEach(n=>{const s=db.students.find(x=>x.name===n);if(s)s.points=Math.max(0,s.points-t.points)});
 t.completed=checked;save(db);closeModal();toast("Pontos atualizados!");go("tasks")
}
function monthName(y,m){return new Intl.DateTimeFormat("pt-BR",{month:"long",year:"numeric"}).format(new Date(y,m,1)).replace(/^./,c=>c.toUpperCase())}
function calendarHTML(db,role,y,m,selected){
 const first=new Date(y,m,1),last=new Date(y,m+1,0),start=first.getDay(),days=last.getDate(),prev=new Date(y,m,0).getDate();
 let html=`<div class="monthbar"><div class="monthbuttons"><button class="btn secondary" onclick="changeMonth(-1)">‹</button><button class="btn secondary" onclick="goToday()">Hoje</button><button class="btn secondary" onclick="changeMonth(1)">›</button></div><h2>${monthName(y,m)}</h2><div>${role==="teacher"?'<button class="btn primary" onclick="createTask(selectedDate || todayISO())">+ Tarefa</button>':""}</div></div><div class="calendar">${["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map(x=>`<div class="dow">${x}</div>`).join("")}`;
 for(let i=0;i<42;i++){
   const n=i-start+1;let date,day,muted=false;
   if(n<1){day=prev+n;date=new Date(y,m-1,day);muted=true}
   else if(n>days){day=n-days;date=new Date(y,m+1,day);muted=true}
   else {day=n;date=new Date(y,m,day)}
   const iso=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
   const tasks=taskForDate(db,iso),today=iso===todayISO(),sel=iso===selected;
   html+=`<div class="day ${muted?"mutedday":""} ${today?"today":""} ${sel?"selected":""}" onclick="selectDate('${iso}')"><div class="daynum">${day}</div>${tasks.slice(0,3).map(t=>`<div class="event">${esc(t.title)}</div>`).join("")}${tasks.length>3?`<div class="label">+${tasks.length-3} mais</div>`:""}</div>`;
 }
 return html+`</div><br><div class="card"><h3>${selected?`Atividades de ${fmtDate(selected)}`:"Selecione uma data"}</h3>${selected?(taskForDate(db,selected).length?taskForDate(db,selected).map(t=>taskHTML(t)).join(""):'<div class="empty">Nenhuma tarefa para esta data.</div>'):'<div class="empty">Toque em uma data para ver as tarefas.</div>'}</div>`;
}
let calY,calM,selectedDate;
function setupCalendar(){
 const d=new Date();calY=d.getFullYear();calM=d.getMonth();selectedDate=todayISO();
}
function selectDate(iso){selectedDate=iso;renderCalendar()}
function changeMonth(delta){calM+=delta;if(calM<0){calM=11;calY--}if(calM>11){calM=0;calY++}renderCalendar()}
function goToday(){const d=new Date();calY=d.getFullYear();calM=d.getMonth();selectedDate=todayISO();renderCalendar()}
function renderCalendar(){const db=load();document.querySelector(".calendar-wrap").innerHTML=calendarHTML(db,db.profile.role,calY,calM,selectedDate)}
