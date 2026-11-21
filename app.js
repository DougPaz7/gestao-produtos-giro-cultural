"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const main = $("#main");
const dialog = $("#dialog");
const content = $("#dialog-content");
const key = "giro-cultural.demo.v1";
const categories = ["Shows", "Cinema", "Feiras", "Teatro", "Eventos culturais", "Eventos esportivos"];
const cities = ["Recife", "Olinda"];
const profile = "Cine Quintal";
const seeds = [
  ["Som do Cais", 0, 0, "Armazém do Cais", "Rua do Ancoradouro, 42", "19:00", 0, "Bandas autorais abrem a noite no cais com guitarras, percussão e ritmos pernambucanos."],
  ["Cinema no Quintal", 1, 1, "Quintal da Sé", "Ladeira do Quintal, 18", "18:30", 12, "Uma sessão ao ar livre reúne curtas de realizadores locais e uma conversa depois da projeção."],
  ["Feira da Aurora", 2, 0, "Pátio da Aurora", "Travessa da Aurora, 80", "09:00", 0, "Cerâmica, gravura e bordado ocupam as bancas do pátio. Os próprios artesãos apresentam suas peças."],
  ["Entre Atos", 3, 1, "Teatro da Ladeira", "Ladeira das Cores, 36", "19:30", 25, "Uma companhia de teatro encena histórias de vizinhança com música e humor."],
  ["Passos de Frevo", 4, 0, "Pátio do Passo", "Rua dos Estandartes, 51", "15:00", 0, "Passistas apresentam o frevo e convidam o público a experimentar seus primeiros passos."],
  ["Corrida das Ladeirinhas", 5, 1, "Praça dos Ventos", "Largo dos Ventos, 14", "07:00", 35, "Um circuito recreativo pelas ladeiras reúne corredores e caminhantes da cidade."],
  ["Seresta na Varanda", 0, 1, "Casa da Varanda", "Rua das Cantigas, 25", "20:00", 30, "Violões e vozes revisitam o repertório de serestas em um encontro intimista na varanda."],
  ["Mostra Tela do Rio", 1, 0, "Sala Beira-Rio", "Rua do Projetor, 62", "17:30", 0, "Uma mostra de animações e curtas de ficção inspirados nas águas e nas pontes da cidade."],
  ["Feira do Alto", 2, 1, "Terreiro do Alto", "Rua da Oficina, 11", "10:00", 0, "Um encontro de ateliês com xilogravuras, brinquedos artesanais e peças de barro."],
  ["O Avesso da Ponte", 3, 0, "Galpão da Cena", "Rua do Tabuleiro, 93", "20:00", 45, "Dois atores transformam objetos cotidianos em cenários para contar as travessias de uma cidade."],
  ["Roda de Maracatu", 4, 1, "Pátio do Tambor", "Beco do Batuque, 17", "16:00", 0, "Alfaias e ganzás marcam o encontro de batuqueiros com apresentação aberta ao público."],
  ["Vôlei no Parque", 5, 0, "Quadra do Poente", "Alameda do Poente, 54", "08:30", 15, "Duplas amadoras se encontram para uma manhã de jogos em quadra aberta."]
];
const icons = {
  agenda: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18"/>',
  heart: '<path d="M20.3 4.9a5.5 5.5 0 0 0-7.8 0l-.5.5-.5-.5a5.5 5.5 0 0 0-7.8 7.8L12 21l8.3-8.3a5.5 5.5 0 0 0 0-7.8Z"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2"/>',
  pin: '<path d="M19 9c0 5-7 12-7 12S5 14 5 9a7 7 0 0 1 14 0Z"/><circle cx="12" cy="9" r="2.2"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  ticket: '<path d="M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4Zm12 0v2m0 3v2m0 3v2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  reset: '<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m9 11 6-4m-6 6 6 4"/>'
};
function icon(name) {
  return '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + icons[name] + '</svg>';
}
function esc(value) {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"}[c]));
}
function day(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return [d.getFullYear(), String(d.getMonth()+1).padStart(2,"0"), String(d.getDate()).padStart(2,"0")].join("-");
}
function dateLabel(date, options = {day:"numeric", month:"long", year:"numeric"}) {
  return new Date(date + "T12:00").toLocaleDateString("pt-BR", options);
}
function initialData() {
  const events = seeds.map(([name, category, city, venue, address, time, price, description], i) => ({
    id: "demo-" + (i + 1), name, category: categories[category], city: cities[city], venue, address, time, price, description,
    date: day(1 + i * 2), organizer: ["Coletivo do Cais", "Cine Quintal", "Rede de Artesãos", "Companhia da Cena", "Coletivo do Passo", "Circuito Aberto"][category],
    status:"ativo", notice:"", verified:day(), reference:"https://giro.example.invalid/" + (i + 1)
  }));
  return {anchor:day(), events, favorites:[], profiles:[...new Set(events.map(e => e.organizer))], profile, entered:false};
}
function readData() {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    if (data && Array.isArray(data.events) && Array.isArray(data.favorites)) {
      if (!data.profiles) {
        data.profiles = [...new Set([data.profile, ...data.events.map(e => e.organizer)])];
        for (const event of data.events) {
          if (["aprovado", "pendente"].includes(event.status)) event.status = "ativo";
          if (["rejeitado", "encerrado"].includes(event.status)) event.status = "arquivado";
          event.notice = event.status === "cancelado" ? "Motivo não registrado na versão anterior." : "";
        }
      }
      return data;
    }
  } catch { /* O navegador pode bloquear o armazenamento em arquivos locais. */ }
  return initialData();
}
let state = readData();
function persist() {
  try { localStorage.setItem(key, JSON.stringify(state)); }
  catch { toast("Armazenamento indisponível. Os dados ficarão apenas nesta sessão."); }
}
function refreshDates() {
  if (state.anchor !== day()) {
    seeds.forEach((_, i) => {
      const event = state.events.find(e => e.id === "demo-" + (i+1));
      if (event && event.status === "ativo") event.date = day(1 + i * 2);
    });
    state.anchor = day();
  }
}
function future(event) { return new Date(event.date + "T" + event.time) > new Date(); }
function published(event) { return ["ativo", "cancelado"].includes(event.status) && future(event); }
function money(price) { return Number(price) ? Number(price).toLocaleString("pt-BR", {style:"currency", currency:"BRL"}) : "Gratuito"; }
let toastTimer;
function toast(message) {
  const notice = $("#notice");
  notice.textContent = message;
  notice.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => notice.classList.remove("visible"), 4600);
}
const defaultFilters = () => ({city:"", date:"", exact:"", category:"", price:""});
let filters = defaultFilters();
let page = "";
function opts(items, selected) {
  return items.map(([value, label]) => `<option value="${esc(value)}" ${selected === value ? "selected" : ""}>${esc(label)}</option>`).join("");
}
function filterSelect(name, symbol, label, values) {
  return `<label class="filter">${icon(symbol)}<select aria-label="${label}" data-filter="${name}">${opts(values, filters[name])}</select></label>`;
}
function hero() {
  return `<section class="hero"><div class="wrap hero-inner"><div class="hero-copy"><span class="hero-location">${icon("pin")} RECIFE &amp; OLINDA</span><h1>Seu próximo<br><em>rolê cultural.</em></h1><p>Descubra o que acontece em Recife e Olinda.</p></div><img src="assets/pernambuco.jpg" class="hero-art" alt="" fetchpriority="high"></div></section>`;
}
function catalog() {
  const fav = page === "favoritos";
  main.innerHTML = (fav ? "" : hero()) + `<section class="wrap catalog"><div class="section-head"><div><span class="eyebrow"><i></i>${fav ? "SUA SELEÇÃO" : "PROGRAMAÇÃO"}</span><${fav ? "h1" : "h2"}>${fav ? "Meus favoritos" : "Explore a agenda"}</${fav ? "h1" : "h2"}></div>${fav ? "" : `<div class="cities" role="group" aria-label="Filtrar por cidade">${["", ...cities].map(c => `<button data-city="${c}" aria-pressed="${c === filters.city}">${c || "Todas as cidades"}</button>`).join("")}</div>`}</div>
  ${fav ? '<p class="muted">Eventos salvos neste navegador e dispositivo.</p>' : `<div class="filters">${filterSelect("date","agenda","Filtrar por data",[["","Todas as datas"],["week","Próximos 7 dias"],["month","Próximos 30 dias"],["exact","Escolher uma data"]])}<input type="date" aria-label="Data específica" data-filter="exact" value="${esc(filters.exact)}" ${filters.date === "exact" ? "" : "hidden"}>
  ${filterSelect("category","grid","Filtrar por categoria",[["","Categorias"],...categories.map(c=>[c,c])])}
  ${filterSelect("price","ticket","Filtrar por preço",[["","Qualquer preço"],["free","Gratuitos"],["paid","Todos os pagos"],["low","Até R$ 25 (pagos)"],["high","Acima de R$ 25"]])}
  <button id="clear" class="clear">${icon("reset")} Limpar filtros</button><span id="count" class="count" role="status"></span></div>`}
  <div class="cards" id="cards"></div></section>`;
  results();
}
function matches(e) {
  const f = filters;
  return (!f.city || e.city === f.city) && (!f.category || e.category === f.category) &&
    (f.date !== "exact" || !f.exact || e.date === f.exact) &&
    (f.date !== "week" || e.date <= day(7)) && (f.date !== "month" || e.date <= day(30)) &&
    (!f.price || ({free:e.price === 0, paid:e.price > 0, low:e.price > 0 && e.price <= 25, high:e.price > 25})[f.price]);
}
function empty(title, detail) {
  return `<div class="empty"><h3>${title}</h3><p>${detail}</p></div>`;
}
function card(e) {
  const id = esc(e.id), saved = state.favorites.includes(e.id);
  const cat = categories.indexOf(e.category);
  return `<article class="card"><div class="poster art-${cat}"><img src="assets/arte-${cat}.jpg" alt="" loading="lazy"><span class="date-tile"><strong>${e.date.slice(-2)}</strong>${dateLabel(e.date,{month:"short"}).replace(".","")}</span><button class="heart" data-fav="${id}" aria-label="Favoritar ${esc(e.name)}" aria-pressed="${saved}">${icon("heart")}</button></div>
  <div class="card-body"><span class="category cat-${cat}"><i></i>${esc(e.category)}</span>${e.status === "cancelado" ? statusBadge(e) : ""}<h3><button class="card-open" data-detail="${id}">${esc(e.name)}</button></h3>
  <span class="meta">${icon("clock")}${dateLabel(e.date,{weekday:"long"})} · ${esc(e.time)}</span><span class="meta">${icon("pin")}${esc(e.venue)} · ${esc(e.city)}</span>
  <div class="card-foot"><span class="price ${!e.price ? "free" : ""}">${icon("ticket")}${money(e.price)}</span><span class="detail-hint" aria-hidden="true">Ver detalhes</span></div></div></article>`;
}
function results() {
  const fav = page === "favoritos";
  const events = state.events.filter(e => published(e) && (fav ? state.favorites.includes(e.id) : matches(e)))
    .sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time));
  $("#cards").innerHTML = events.length ? events.map(card).join("") : empty(fav ? "Nenhum favorito na agenda" : "Nenhum evento encontrado", fav ? 'Toque no coração de um evento para salvá-lo. <a href="#agenda">Explorar a agenda</a>' : "Tente outra cidade, data ou categoria, ou limpe os filtros.");
  if (!fav) {
    $("#count").textContent = events.length + (events.length === 1 ? " evento fictício" : " eventos fictícios");
    $("#clear").disabled = !Object.values(filters).some(Boolean);
  }
}
function show(html) {
  content.innerHTML = html;
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  $(".close",dialog).focus();
}
const statusLabels = {ativo:"Ativo", cancelado:"Cancelado", arquivado:"Arquivado"};
function statusBadge(e) {
  return `<span class="status status-${esc(e.status)}">${statusLabels[e.status]}</span>`;
}
function statusInfo(e) {
  const label = e.status === "cancelado" ? "Motivo do cancelamento" : "Aviso do organizador";
  return `<div class="event-status"><strong>Situação</strong> ${statusBadge(e)}
    ${e.notice ? `<p><b>${label}</b><br>${esc(e.notice)}</p>` : ""}</div>`;
}
function info(e) {
  const rows = [["Data e horário", dateLabel(e.date) + " às " + e.time],["Local",e.venue + " · " + e.city],["Endereço",e.address],["Entrada",money(e.price)],["Organizador",e.organizer]];
  const destination = e.status === "ativo"
    ? "Ao continuar, você será encaminhado ao site do organizador para comprar seu ingresso ou fazer sua inscrição no evento."
    : "Consulte a situação do evento no site do organizador.";
  return `<p>${esc(e.description)}</p>${statusInfo(e)}<dl>${rows.map(([l,v])=>`<div><dt>${l}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
    ${e.reference ? `<div class="reference"><p>${destination}</p><a href="${esc(e.reference)}" data-preview="${esc(e.id)}">Acessar o site do organizador</a><small>Nesta demonstração, o link abre uma página simulada.</small></div>` : ""}`;
}
function details(e) {
  const saved = state.favorites.includes(e.id);
  show(`<span class="eyebrow">EVENTO FICTÍCIO · ${esc(e.category)}</span><h2 id="dialog-title">${esc(e.name)}</h2>${info(e)}<small>Atualizado em ${dateLabel(e.verified)}.</small><div class="actions"><button class="primary" data-fav="${e.id}" aria-pressed="${saved}">${icon("heart")}${saved ? "Salvo nos favoritos" : "Salvar nos favoritos"}</button><button data-share="${e.id}">${icon("share")}Compartilhar</button></div>`);
}
function areaTitle(label,title,description) {
  return `<div class="section-head"><div><span class="eyebrow"><i></i>${label} · MODO SIMULADO</span><h1>${title}</h1><p class="muted">${description}</p></div></div>`;
}
function organizer() {
  main.innerHTML = `<section class="wrap workspace">${areaTitle("ORGANIZADOR","Área do organizador","Cadastro e acesso simulados neste navegador, sem contas ou senhas.")}
  ${state.entered ? `<div class="profile-row"><strong>${icon("user")} ${esc(state.profile)}</strong><button class="link-btn" id="leave">Sair do modo organizador</button></div>${eventForm()}<h2 class="subhead">Meus eventos</h2>${organizerEvents()}`
  : `<div class="panel narrow"><h2>Entrar como organizador</h2><form id="enter-form"><label>Perfil demonstrativo<select name="profile">${opts(state.profiles.map(name=>[name,name]),state.profile)}</select></label><button class="primary">Entrar com este perfil</button></form><details class="signup"><summary>Simular novo cadastro</summary><form id="signup"><label>Nome do organizador<input name="profile" required maxlength="80"></label><button>Cadastrar e entrar</button></form></details></div>`}</section>`;
}
function eventForm() {
  return `<form class="panel form-grid" id="event-form"><h2 class="full">Publicar um evento</h2>
  <label class="full">Nome do evento<input name="name" required maxlength="100"></label><label>Cidade<select name="city">${opts(cities.map(c=>[c,c]),"Recife")}</select></label><label>Categoria<select name="category">${opts(categories.map(c=>[c,c]),"Shows")}</select></label>
  <label>Data<input name="date" type="date" min="${day()}" required></label><label>Horário<input name="time" type="time" required></label>
  <label>Local<input name="venue" maxlength="100" required></label><label>Endereço<input name="address" maxlength="180" required></label>
  <label class="full">Preço em reais (0 para gratuito)<input name="price" type="number" min="0" max="100000" step="0.01" value="0" required></label>
  <label class="full">Descrição<textarea name="description" rows="3" required maxlength="1200"></textarea></label>
  <div class="full"><button class="primary">Publicar evento</button></div></form>`;
}
function organizerEvents() {
  const events = state.events.filter(e => e.organizer === state.profile).reverse();
  if (!events.length) return '<p class="row-empty">Os eventos que você publicar aparecerão aqui.</p>';
  return events.map(e => `<details class="review"><summary><span><strong>${esc(e.name)}</strong><small>${esc(e.city)} · ${dateLabel(e.date)}</small></span>${statusBadge(e)}</summary>
    ${info(e)}${published(e) ? `<button data-update="${esc(e.id)}">Atualizar situação</button>` : ""}</details>`).join("");
}
function ownEvent(id) {
  return state.entered && state.events.find(e => e.id === id && e.organizer === state.profile && published(e));
}
function editStatus(e) {
  show(`<h2 id="dialog-title">Atualizar situação</h2><p>${esc(e.name)}</p>
    <form id="status-form" data-event="${esc(e.id)}"><label>Situação do evento<select name="status">${opts([["ativo","Ativo"],["cancelado","Cancelado"]],e.status)}</select></label>
    <label><span id="notice-label"></span><textarea name="notice" rows="4" maxlength="600">${esc(e.notice)}</textarea></label>
    <button class="primary">Salvar alteração</button></form>`);
  updateNoticeLabel($("#status-form"));
}
function updateNoticeLabel(form) {
  const canceled = form.elements.status.value === "cancelado";
  $("#notice-label").textContent = canceled ? "Motivo do cancelamento (obrigatório)" : "Aviso do organizador (opcional)";
  form.elements.notice.required = canceled;
  form.elements.notice.setCustomValidity("");
}
function render() {
  page = location.hash.slice(1);
  if (!["agenda","favoritos","organizador"].includes(page)) page = "agenda";
  document.querySelectorAll("[data-nav]").forEach(a=>{
    if(a.dataset.nav === page) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current");
  });
  if (page === "organizador") organizer(); else catalog();
}
async function share(e) {
  const text = `Giro Cultural · Evento fictício\n${e.name}\n${dateLabel(e.date)}, ${e.time}\n${e.venue}, ${e.address} · ${e.city}\n${money(e.price)}\nSituação: ${statusLabels[e.status]}${e.notice ? "\n" + e.notice : ""}`;
  if (navigator.share) {
    try { await navigator.share({title:e.name,text}); return; }
    catch (err) { if (err.name === "AbortError") return; }
  }
  try { await navigator.clipboard.writeText(text); toast("Detalhes copiados para compartilhar."); }
  catch {
    show(`<h2 id="dialog-title">Compartilhar evento</h2><label>Selecione e copie os detalhes<textarea id="share-text" rows="6" readonly>${esc(text)}</textarea></label>`);
    $("#share-text").select();
  }
}
document.addEventListener("click", event => {
  const reference = event.target.closest("a[data-preview]");
  if (reference) {
    event.preventDefault();
    const e = state.events.find(item => item.id === reference.dataset.preview);
    if (e) show(`<span class="eyebrow">SITE DO ORGANIZADOR · SIMULAÇÃO</span><h2 id="dialog-title">${esc(e.name)}</h2>${statusInfo(e)}<p>${esc(e.description)}</p><p><strong>${esc(e.organizer)}</strong><br>${esc(e.venue)} · ${esc(e.city)}<br>${dateLabel(e.date)} · ${esc(e.time)}</p>${page !== "organizador" && published(e) ? `<button data-detail="${esc(e.id)}">Ver detalhes do evento</button>` : ""}`);
    return;
  }
  const btn = event.target.closest("button");
  if (!btn) return;
  const d = btn.dataset;
  const get = id => state.events.find(e=>e.id === id);
  if (btn.matches(".close, #cancel-reset")) dialog.close();
  else if (btn.id === "reset") show('<h2 id="dialog-title">Restaurar a demonstração?</h2><p>Os perfis cadastrados, favoritos e alterações serão apagados. Os 12 eventos iniciais voltarão à agenda com datas futuras.</p><div class="actions"><button id="cancel-reset">Voltar</button><button id="confirm-reset" class="primary">Restaurar dados</button></div>');
  else if (btn.id === "confirm-reset") {
    state = initialData(); persist(); filters = defaultFilters(); dialog.close(); location.hash = "agenda"; render(); window.scrollTo(0,0); toast("Demonstração restaurada.");
  } else if ("city" in d) {
    filters.city = d.city;
    document.querySelectorAll("[data-city]").forEach(b=>b.setAttribute("aria-pressed", b.dataset.city === d.city));
    results();
  } else if (btn.id === "clear") { filters = defaultFilters(); catalog(); $('[data-filter="date"]').focus(); }
  else if (d.detail) details(get(d.detail));
  else if (d.fav) {
    const saved = state.favorites.includes(d.fav);
    state.favorites = saved ? state.favorites.filter(id=>id !== d.fav) : [...state.favorites,d.fav];
    persist(); results();
    if (dialog.open) { details(get(d.fav)); $("[data-fav]",content).focus(); }
    else if (page === "favoritos" && saved) ($(".heart",main) || $("a",$("#cards"))).focus();
    else $(`[data-fav="${d.fav}"]`,main).focus({preventScroll:true});
    toast(saved ? "Evento removido dos favoritos." : "Evento salvo nos favoritos.");
  } else if (d.share) share(get(d.share));
  else if (btn.id === "leave") { state.entered = false; persist(); organizer(); }
  else if (d.update) {
    const e = ownEvent(d.update);
    if (e) editStatus(e);
  }
});
document.addEventListener("change", event => {
  if (event.target.matches('#status-form [name="status"]')) {
    const form = event.target.form;
    const e = ownEvent(form.dataset.event);
    form.elements.notice.value = e && e.status === event.target.value ? e.notice : "";
    updateNoticeLabel(form);
    return;
  }
  const name = event.target.dataset.filter;
  if (!name) return;
  filters[name] = event.target.value;
  if (name === "date") {
    const exact = $('[data-filter="exact"]');
    exact.hidden = filters.date !== "exact";
    if (exact.hidden) { filters.exact = ""; exact.value = ""; } else exact.focus();
  }
  results();
});
document.addEventListener("submit", event => {
  event.preventDefault();
  const form = event.target;
  const values = Object.fromEntries([...new FormData(form)].map(([k,v])=>[k,v.trim()]));
  for (const field of form.querySelectorAll("[required]")) {
    if (!field.value.trim()) { field.setCustomValidity("Preencha este campo."); field.reportValidity(); return; }
  }
  if (form.id === "enter-form" && state.profiles.includes(values.profile)) {
    state.profile = values.profile; state.entered = true; persist(); organizer();
  } else if (form.id === "signup") {
    if (state.profiles.some(name => name.localeCompare(values.profile,"pt-BR",{sensitivity:"base"}) === 0)) {
      form.elements.profile.setCustomValidity("Este perfil já existe. Selecione-o para entrar.");
      form.elements.profile.reportValidity();
      return;
    }
    state.profiles.push(values.profile);
    state.profile = values.profile; state.entered = true; persist(); organizer(); toast("Perfil demonstrativo cadastrado.");
  } else if (form.id === "event-form" && state.entered) {
    if (!future(values)) { form.elements.time.setCustomValidity("Escolha uma data e um horário futuros."); form.elements.time.reportValidity(); return; }
    state.events.push({...values, id:"envio-" + crypto.randomUUID(), organizer:state.profile, verified:day(), price:Number(values.price), status:"ativo", notice:""});
    persist(); organizer(); toast("Evento publicado na agenda.");
  } else if (form.id === "status-form") {
    const e = ownEvent(form.dataset.event);
    if (!e || !["ativo", "cancelado"].includes(values.status) || (values.status === "cancelado" && !values.notice)) return;
    e.status = values.status;
    e.notice = values.notice;
    e.verified = day();
    persist(); dialog.close(); organizer();
    toast("Situação atualizada na agenda.");
  }
});
document.addEventListener("input",e=>{
  if(e.target.setCustomValidity) e.target.setCustomValidity("");
  if(e.target.name === "date" && e.target.form?.elements.time) e.target.form.elements.time.setCustomValidity("");
});
window.addEventListener("hashchange",()=>{ if(dialog.open) dialog.close(); render(); main.focus({preventScroll:true}); window.scrollTo(0,0); });
window.addEventListener("storage",e=>{ if(e.key === key) { state=readData(); refreshDates(); if(dialog.open) dialog.close(); render(); } });
document.addEventListener("visibilitychange",()=>{ if(!document.hidden && ["agenda","favoritos"].includes(page)) { refreshDates(); persist(); results(); } });
dialog.addEventListener("click",e=>{ if(e.target === dialog) {const box=dialog.getBoundingClientRect(); if(e.clientX<box.left || e.clientX>box.right || e.clientY<box.top || e.clientY>box.bottom) dialog.close();} });
["agenda","heart","user"].forEach((name,i)=>document.querySelectorAll("[data-nav]")[i].insertAdjacentHTML("afterbegin",icon(name)));
refreshDates();
persist();
render();
