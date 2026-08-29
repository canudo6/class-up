
function go(page){
 const db=load();db.profile.role="student";save(db);
 if(page==="home")studentHome();else if(page==="calendar")studentCalendar();else if(page==="ranking")studentRanking();else studentProfile();
}
function studentHome(){
 const db=load(),s=currentStudent(db), upcoming=[...db.tasks].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4);
 shell("home","student",`<h1>Olá, ${esc(s.name)}! 👋</h1><p class="sub">Aqui está seu progresso e suas próximas tarefas.</p>
 <div class="grid"><div class="card"><div class="label">⭐ Pontos</div><div class="stat">${s.points.toLocaleString("pt-BR")}</div></div><div class="card"><div class="label">🔥 Sequência</div><div class="stat">7 dias</div></div><div class="card"><div class="label">🏆 Ranking</div><div class="stat">${studentPosition(db)}º</div></div></div>
 <br><div class="card"><h2>Próximas tarefas</h2>${upcoming.map(t=>taskHTML(t)).join("")}</div>`);
}
function studentPosition(db){return [...db.students].sort((a,b)=>b.points-a.points).findIndex(s=>s.name===db.profile.name)+1}
function studentCalendar(){setupCalendar();shell("calendar","student",`<h1>Calendário</h1><p class="sub">O calendário acompanha a data atual e muda de mês.</p><div class="card calendar-wrap">${calendarHTML(load(),"student",calY,calM,selectedDate)}</div>`)}
function studentRanking(){const db=load(),rows=[...db.students].sort((a,b)=>b.points-a.points);shell("ranking","student",`<h1>Ranking — ${esc(db.profile.className)}</h1><p class="sub">Pontos acumulados pelas tarefas confirmadas.</p><div class="card">${rows.map((s,i)=>`<div class="rankrow ${s.name===db.profile.name?"me":""}"><div class="rank">${i+1}º</div><div class="rankname"><b>${esc(s.name)}</b>${s.name===db.profile.name?" <span class='badge'>Você</span>":""}</div><b>${s.points.toLocaleString("pt-BR")} pts</b></div>`).join("")}</div>`)}
function studentProfile(){
 const db=load(),s=currentStudent(db),avatars=["🧑‍🎓","👩‍🎓","🧑‍🚀"];
 shell("profile","student",`<h1>Perfil</h1><div class="card"><div style="display:flex;align-items:center;gap:16px"><div class="avatar" style="width:76px;height:76px;font-size:42px">${s.avatar}</div><div><h2 style="margin:0">${esc(s.name)}</h2><div class="sub">Turma ${esc(db.profile.className)}</div></div></div><hr style="border:0;border-top:1px solid var(--border);margin:18px 0"><h3>Foto de perfil</h3><div class="avatar-options">${avatars.map(a=>`<button class="avatar-choice ${s.avatar===a?"selected":""}" onclick="chooseAvatar('${a}')">${a}</button>`).join("")}</div></div>`);
}
function chooseAvatar(a){const db=load();db.profile.avatar=a;const s=currentStudent(db);s.avatar=a;save(db);studentProfile()}
studentHome();
