
function go(page){
 const db=load();db.profile.role="teacher";save(db);
 if(page==="classes")teacherClasses();else if(page==="calendar")teacherCalendar();else if(page==="tasks")teacherTasks();else teacherRanking();
}
function teacherClasses(){
 const db=load();shell("classes","teacher",`<h1>Olá, Professor ${esc(db.profile.name)}! 👋</h1><p class="sub">Selecione uma turma para gerenciar.</p><div class="grid">${["7A","7B","8A","9A"].map(c=>`<div class="card"><div style="font-size:34px">👥</div><h2>${c}</h2><p class="sub">Turma • ${db.tasks.length} tarefas no calendário</p><button class="btn primary" onclick="selectClass('${c}')">Abrir turma</button></div>`).join("")}</div><br><div class="card"><h3>Perfil do professor</h3><p class="sub">Foto escolhida no dispositivo.</p><button class="btn secondary" onclick="teacherProfile()">Alterar foto</button></div>`);
}
function selectClass(c){localStorage.setItem("classup_class",c);teacherTasks()}
function teacherCalendar(){setupCalendar();shell("calendar","teacher",`<h1>Calendário — ${esc(localStorage.getItem("classup_class")||"7B")}</h1><p class="sub">Clique em uma data para ver as tarefas ou criar uma nova.</p><div class="card calendar-wrap">${calendarHTML(load(),"teacher",calY,calM,selectedDate)}</div>`)}
function teacherTasks(){
 const db=load(),c=localStorage.getItem("classup_class")||"7B";shell("tasks","teacher",`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><div><h1>Turma ${c}</h1><p class="sub">Editor de tarefas e confirmação de alunos.</p></div><button class="btn primary" onclick="createTask(todayISO())">+ Criar tarefa</button></div><div class="card"><h2>Atividades</h2>${db.tasks.map(t=>taskHTML(t)).join("")}</div>`);
}
function teacherRanking(){const db=load(),rows=[...db.students].sort((a,b)=>b.points-a.points);shell("ranking","teacher",`<h1>Ranking — ${localStorage.getItem("classup_class")||"7B"}</h1><p class="sub">Pontuação acumulada da turma.</p><div class="card">${rows.map((s,i)=>`<div class="rankrow"><div class="rank">${i+1}º</div><div class="rankname"><b>${esc(s.name)}</b></div><b>${s.points.toLocaleString("pt-BR")} pts</b></div>`).join("")}</div>`)}
function teacherProfile(){
 const db=load();
 shell("classes","teacher",`<h1>Perfil do professor</h1><div class="card"><h2>${esc(db.profile.name)}</h2><p class="sub">Escolha uma imagem do dispositivo.</p><div class="avatar" style="width:90px;height:90px;font-size:40px;margin:15px 0">${db.profile.avatar.startsWith("data:")?`<img src="${db.profile.avatar}">`:"👨‍🏫"}</div><input type="file" accept="image/*" onchange="teacherPhoto(event)"><br><br><button class="btn secondary" onclick="teacherClasses()">Voltar</button></div>`);
}
function teacherPhoto(e){
 const f=e.target.files?.[0];if(!f)return;
 const r=new FileReader();r.onload=()=>{const db=load();db.profile.avatar=r.result;save(db);teacherProfile()};r.readAsDataURL(f);
}
function createTask(date){
 const db=load();
 document.getElementById("modalbox").innerHTML=`<h2>Nova tarefa</h2><div class="form">
 <label>Nome da tarefa<input id="title" value=""></label>
 <label>Matéria<input id="subject" value="Ciências"></label>
 <label>Data de entrega<input id="date" type="date" value="${date}"></label>
 <label>Pontos<input id="points" type="number" min="0" value="150"></label>
 <label>Descrição<textarea id="desc">Descreva aqui o que os alunos precisam fazer.</textarea></label>
 <div><button class="btn secondary" onclick="closeModal()">Cancelar</button> <button class="btn primary" onclick="publishTask()">Publicar</button></div></div>`;
 document.getElementById("modal").classList.add("show");
}
function publishTask(){
 const title=document.getElementById("title").value.trim(),subject=document.getElementById("subject").value.trim(),date=document.getElementById("date").value,points=Number(document.getElementById("points").value)||0,description=document.getElementById("desc").value.trim();
 if(!title||!date){toast("Preencha o nome e a data.");return}
 const db=load();db.tasks.push({id:Date.now(),title,subject,date,points,teacher:db.profile.name,description,icon:"📚",completed:[],submitted:[]});save(db);closeModal();toast("Tarefa publicada no calendário!");teacherCalendar()
}
teacherClasses();
