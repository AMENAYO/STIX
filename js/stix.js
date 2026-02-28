// ======= Simple User System =========
function hash(str){ let h=0; for(let i=0;i<str.length;i++){h=(h<<5)-h+str.charCodeAt(i);h=h&h;} return h.toString(); }
function getUsers(){return JSON.parse(localStorage.getItem('stix_users')||'{}');}
function saveUsers(u){localStorage.setItem('stix_users',JSON.stringify(u));}

function getData(){return JSON.parse(localStorage.getItem('stix_data')||'{}');}
function saveData(d){localStorage.setItem('stix_data',JSON.stringify(d));}

let loggedUser=null;

// ===== Register =====
function register(){
  const u=document.getElementById('regUser').value.trim();
  const p=document.getElementById('regPass').value;
  if(!u||!p){ alert("Fill all / Remplir tout"); return; }
  let users=getUsers();
  if(users[u]){ alert("User exists / Utilisateur existe"); return; }
  users[u]=hash(p); saveUsers(users);
  document.getElementById('output').innerText="Registered / Inscrit";
}

// ===== Login =====
function login(){
  const u=document.getElementById('username').value.trim();
  const p=document.getElementById('password').value;
  let users=getUsers();
  if(users[u]!==hash(p)){ document.getElementById('output').innerText="Invalid / Invalide"; return; }
  loggedUser=u;
  document.getElementById('output').innerText="Logged in / Connecté";
}

// ===== Object System =========
function createObject(){
  if(!loggedUser){ alert("Login first / Connectez-vous d'abord"); return; }
  const shape=document.getElementById('shape').value;
  const size=parseInt(document.getElementById('size').value)||50;
  let data=getData();
  if(!data[loggedUser]) data[loggedUser]={};
  const id='obj_'+Date.now();
  data[loggedUser][id]={shape,size};
  saveData(data);
  document.getElementById('output').innerText="Object created / Objet créé: "+id;
  drawWorld();
}

// ===== List Objects =====
function listObjects(){
  if(!loggedUser){ alert("Login first / Connectez-vous d'abord"); return; }
  let data=getData();
  const objs=data[loggedUser]||{};
  let text='';
  for(const id in objs){ text+=id+' : '+objs[id].shape+' / '+objs[id].size+'\n'; }
  document.getElementById('output').innerText=text||"No objects / Aucun objet";
  drawWorld();
}

// ===== Draw World on Canvas =====
function drawWorld(){
  if(!loggedUser) return;
  let data=getData();
  const objs=data[loggedUser]||{};
  const canvas=document.getElementById('world');
  const ctx=canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  let x=50, y=50;
  for(const id in objs){
    const o=objs[id];
    ctx.fillStyle='yellow';
    if(o.shape==='cube') ctx.fillRect(x,y,o.size,o.size);
    else if(o.shape==='sphere') ctx.beginPath(),ctx.arc(x+o.size/2,y+o.size/2,o.size/2,0,2*Math.PI),ctx.fill();
    x+=o.size+20; if(x>canvas.width-100){ x=50; y+=100; }
  }
}
