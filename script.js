/* --- GALAXIA MEJORADA --- */
const canvas = document.getElementById('galaxia');
const ctx = canvas.getContext('2d');
let w,h,stars=[],comets=[],meteors=[];

function resize(){
  w=canvas.width=innerWidth;
  h=canvas.height=innerHeight;
  
  // Estrellas con diferentes tamaños y colores
  stars = Array.from({length:400},()=>({
    x:Math.random()*w,
    y:Math.random()*h,
    r:Math.random()*2.5,
    twinkle:Math.random()*100,
    color:Math.random() > 0.9 ? 
      `rgba(255,200,255,${0.3+Math.random()*0.7})` : 
      `rgba(255,255,255,${0.3+Math.random()*0.7})`
  }));
  
  // Cometas
  comets = Array.from({length:3},()=>({
    x:-100,
    y:Math.random()*h/2,
    speed:2+Math.random()*3,
    length:50+Math.random()*100,
    angle:Math.random()*0.5+0.2,
    active:false,
    delay:Math.random()*300
  }));
  
  // Meteoritos
  meteors = Array.from({length:8},()=>({
    x:Math.random()*w,
    y:Math.random()*h,
    speed:0.2+Math.random()*0.5,
    size:1+Math.random()*3,
    angle:Math.random()*Math.PI*2
  }));
}
resize();
window.addEventListener('resize',resize);

function drawNebula() {
  // Nebulosa central
  const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
  gradient.addColorStop(0, 'rgba(80, 20, 120, 0.1)');
  gradient.addColorStop(0.5, 'rgba(40, 10, 80, 0.05)');
  gradient.addColorStop(1, 'rgba(10, 5, 30, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
  
  // Nebulosas pequeñas
  for(let i = 0; i < 5; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const radius = 50 + Math.random() * 150;
    
    const nebulaGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    nebulaGradient.addColorStop(0, `rgba(${100+Math.random()*50}, ${20+Math.random()*30}, ${100+Math.random()*100}, 0.1)`);
    nebulaGradient.addColorStop(1, 'rgba(10, 5, 30, 0)');
    
    ctx.fillStyle = nebulaGradient;
    ctx.fillRect(x-radius, y-radius, radius*2, radius*2);
  }
}

function animate(t){
  ctx.fillStyle='rgba(5,0,20,0.2)';
  ctx.fillRect(0,0,w,h);
  
  // Dibujar nebulosas
  drawNebula();
  
  // Dibujar estrellas
  for(let s of stars){
    s.twinkle += 0.05;
    let alpha = 0.5 + Math.sin(s.twinkle)*0.5;
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    
    // Aplicar color con parpadeo
    if(s.color.includes('255,200,255')) {
      ctx.fillStyle = s.color.replace(/[\d.]+\)$/, `${alpha})`);
    } else {
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    }
    
    ctx.fill();
  }
  
  // Dibujar y actualizar cometas
  for(let comet of comets){
    if(!comet.active) {
      comet.delay--;
      if(comet.delay <= 0) comet.active = true;
      continue;
    }
    
    comet.x += comet.speed * Math.cos(comet.angle);
    comet.y += comet.speed * Math.sin(comet.angle);
    
    // Dibujar cola del cometa
    const gradient = ctx.createLinearGradient(
      comet.x, comet.y, 
      comet.x - comet.length * Math.cos(comet.angle), 
      comet.y - comet.length * Math.sin(comet.angle)
    );
    gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(1, 'rgba(100,150,255,0)');
    
    ctx.beginPath();
    ctx.moveTo(comet.x, comet.y);
    ctx.lineTo(
      comet.x - comet.length * Math.cos(comet.angle), 
      comet.y - comet.length * Math.sin(comet.angle)
    );
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Dibujar cabeza del cometa
    ctx.beginPath();
    ctx.arc(comet.x, comet.y, 3, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fill();
    
    // Reiniciar cometa si sale de la pantalla
    if(comet.x > w + 100 || comet.y > h + 100) {
      comet.x = -100;
      comet.y = Math.random() * h/2;
      comet.delay = Math.random() * 300;
      comet.active = false;
    }
  }
  
  // Dibujar y actualizar meteoritos
  for(let meteor of meteors){
    meteor.x += Math.cos(meteor.angle) * meteor.speed;
    meteor.y += Math.sin(meteor.angle) * meteor.speed;
    
    // Rebote en los bordes
    if(meteor.x < 0 || meteor.x > w) meteor.angle = Math.PI - meteor.angle;
    if(meteor.y < 0 || meteor.y > h) meteor.angle = -meteor.angle;
    
    // Dibujar meteorito
    ctx.beginPath();
    ctx.arc(meteor.x, meteor.y, meteor.size, 0, Math.PI*2);
    ctx.fillStyle = `rgba(200,200,255,${0.5+Math.random()*0.5})`;
    ctx.fill();
  }
  
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

/* --- FOTOS ORBITANDO --- */
const photos=document.querySelectorAll('.photo');
let start=performance.now();
function orbit(t){
  const time=(t-start)/1000;
  const cx=innerWidth/2, cy=innerHeight/2;
  photos.forEach((p,i)=>{
    const r=parseFloat(p.dataset.radius);
    const s=parseFloat(p.dataset.speed);
    const x=cx+Math.cos(time*s+i)*r;
    const y=cy+Math.sin(time*s+i)*r*0.6;
    p.style.left=`${x}px`;
    p.style.top=`${y}px`;
  });
  requestAnimationFrame(orbit);
}
requestAnimationFrame(orbit);

/* --- CARTA Y MENSAJE --- */
const letter=document.getElementById('letter');
const card=document.getElementById('card');
const letterPaper=document.getElementById('letterPaper');
const letterMessage=document.getElementById('letterMessage');
const closeLetter=document.getElementById('closeLetter');
const modal=document.getElementById('modal');
const modalText=document.getElementById('modalText');
const closeBtn=document.getElementById('closeBtn');

let currentPhrase="";
photos.forEach(p=>{
  p.addEventListener('click',()=>{
    currentPhrase=p.querySelector('img').dataset.phrase;
    letter.classList.add('open');
  });
});

card.addEventListener('click',()=>{
  letterMessage.textContent = currentPhrase;
  letterPaper.classList.add('open');
});

closeLetter.addEventListener('click',()=>{
  letterPaper.classList.remove('open');
  letter.classList.remove('open');
});

closeBtn.addEventListener('click',()=>modal.classList.remove('open'));
modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});