// ======= Users System =========
function hash(str){ let h=0; for(let i=0;i<str.length;i++){h=(h<<5)-h+str.charCodeAt(i);h=h&h;} return h.toString(); }
function getUsers(){return JSON.parse(localStorage.getItem('stix_users')||'{}');}
function saveUsers(u){localStorage.setItem('stix_users',JSON.stringify(u));}
function getData(){return JSON.parse(localStorage.getItem('stix_data')||'{}');}
function saveData(d){localStorage.setItem('stix_data',JSON.stringify(d));}
let loggedUser=null;

// ======= Register/Login =========
function register(){
  const u=document.getElementById('regUser').value.trim();
  const p=document.getElementById('regPass').value;
  if(!u||!p){ alert("Fill all / Remplir tout"); return; }
  let users=getUsers();
  if(users[u]){ alert("User exists / Utilisateur existe"); return; }
  users[u]=hash(p); saveUsers(users);
  document.getElementById('output').innerText="Registered / Inscrit";
}

function login(){
  const u=document.getElementById('username').value.trim();
  const p=document.getElementById('password').value;
  let users=getUsers();
  if(users[u]!==hash(p)){ document.getElementById('output').innerText="Invalid / Invalide"; return; }
  loggedUser=u;
  document.getElementById('output').innerText="Logged in / Connecté";
  loadWorld();
}

// ======= Object System =========
let selectedObject=null;

function createObject(){
  if(!loggedUser){ alert("Login first / Connectez-vous d'abord"); return; }
  const shape=document.getElementById('shape').value;
  const size=parseInt(document.getElementById('size').value)||50;
  const color=document.getElementById('color').value;
  let data=getData();
  if(!data[loggedUser]) data[loggedUser]={};
  const id='obj_'+Date.now();
  data[loggedUser][id]={shape,size,color,x:50,y:50};
  saveData(data);
  document.getElementById('output').innerText="Object created / Objet créé: "+id;
  drawWorld();
}

function listObjects(){
  if(!loggedUser){ alert("Login first / Connectez-vous d'abord"); return; }
  let data=getData();
  const objs=data[loggedUser]||{};
  let text='';
  for(const id in objs){ 
    const o=objs[id];
    text+=id+' : '+o.shape+' / '+o.size+' / '+o.color+' / x:'+o.x+' y:'+o.y+'\n'; 
  }
  document.getElementById('output').innerText=text||"No objects / Aucun objet";
  drawWorld();
}

// ======= Draw World =========
const canvas=document.getElementById('world');
const ctx=canvas.getContext('2d');
canvas.addEventListener('click',selectObject);
canvas.addEventListener('mousemove',moveObject);
let dragging=false;

function drawWorld(){
  if(!loggedUser) return;
  let data=getData();
  const objs=data[loggedUser]||{};
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const id in objs){
    const o=objs[id];
    ctx.fillStyle=o.color;
    if(o.shape==='cube') ctx.fillRect(o.x,o.y,o.size,o.size);
    else if(o.shape==='sphere') ctx.beginPath(),ctx.arc(o.x+o.size/2,o.y+o.size/2,o.size/2,0,2*Math.PI),ctx.fill();
  }
}

function selectObject(e){
  if(!loggedUser) return;
  let data=getData();
  const objs=data[loggedUser]||{};
  const rect=canvas.getBoundingClientRect();
  const mx=e.clientX-rect.left;
  const my=e.clientY-rect.top;
  selectedObject=null;
  for(const id in objs){
    const o=objs[id];
    if(mx>=o.x && mx<=o.x+o.size && my>=o.y && my<=o.y+o.size){
      selectedObject=id;
      dragging=true;
      break;
    }
  }
}

function moveObject(e){
  if(!dragging || !selectedObject) return;
  let data=getData();
  const rect=canvas.getBoundingClientRect();
  const mx=e.clientX-rect.left;
  const my=e.clientY-rect.top;
  data[loggedUser][selectedObject].x=mx- data[loggedUser][selectedObject].size/2;
  data[loggedUser][selectedObject].y=my- data[loggedUser][selectedObject].size/2;
  drawWorld();
}

canvas.addEventListener('mouseup',()=>{ dragging=false; selectedObject=null; });

// ======= Save / Load World =========
function saveWorld(){
  if(!loggedUser){ alert("Login first / Connectez-vous d'abord"); return; }
  document.getElementById('output').innerText="World saved / Monde sauvegardé";
}

function loadWorld(){
  if(!loggedUser) return;
  drawWorld();
  document.getElementById('output').innerText="World loaded / Monde chargé";
}

// ======= Play World (simple animation) =========
function playWorld(){
  if(!loggedUser){ alert("Login first / Connectez-vous d'abord"); return; }
  let data=getData();
  const objs=data[loggedUser]||{};
  let angle=0;
  function animate(){
    angle+=0.05;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const id in objs){
      const o=objs[id];
      const x = o.x + 10*Math.sin(angle + parseInt(id.slice(4)));
      const y = o.y + 10*Math.cos(angle + parseInt(id.slice(4)));
      ctx.fillStyle=o.color;
      if(o.shape==='cube') ctx.fillRect(x,y,o.size,o.size);
      else if(o.shape==='sphere') ctx.beginPath(),ctx.arc(x+o.size/2,y+o.size/2,o.size/2,0,2*Math.PI),ctx.fill();
    }
    requestAnimationFrame(animate);
  }
  animate();
}
