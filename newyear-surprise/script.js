let step = 1;
const app = document.getElementById("app");
const bgMusic = document.getElementById("bgMusic");
const fireSound = document.getElementById("fireSound");

function haptic(p){
  if(navigator.vibrate) navigator.vibrate(p);
}

function render(){

/* 1️⃣ HEART HOLD */
if(step === 1){
  app.innerHTML = `
    <div class="center card">
      <h2>A little surprise for you</h2>
      <p>Tap and hold</p>
      <div class="hold-wrap">
        <div class="ring" id="ring"></div>
        <div class="heart">💗</div>
      </div>
    </div>
  `;

  let prog = 0, timer;
  const ring = document.getElementById("ring");
  const heart = document.querySelector(".heart");

  heart.onpointerdown = () => {
    haptic(15);
    timer = setInterval(() => {
      prog += 2;
      ring.style.background =
        `conic-gradient(#ff6fae ${prog}%, rgba(255,255,255,0.2) 0%)`;

      if(prog >= 100){
        clearInterval(timer);
        haptic([30,20,30]);
        bgMusic.play();
        step = 2;
        render();
      }
    }, 20);
  };

  heart.onpointerup = heart.onpointerleave = () => {
    clearInterval(timer);
    prog = 0;
    ring.style.background =
      "conic-gradient(#ff6fae 0%, rgba(255,255,255,0.2) 0%)";
  };
}

/* 2️⃣ DISTRACTION */
if(step === 2){
  app.innerHTML = `
    <div class="center">
      <h2>Move distractions away</h2>
      <div class="distractions">
        <div class="dcard card1">Work</div>
        <div class="dcard card2">Stress</div>
        <div class="dcard card3">Bad Days</div>
      </div>
    </div>
  `;

  let removed = 0;
  document.querySelectorAll(".dcard").forEach(card=>{
    let sx, sy;

    card.onpointerdown = e=>{
      haptic(10);
      sx = e.clientX;
      sy = e.clientY;
      card.setPointerCapture(e.pointerId);
    };

    card.onpointermove = e=>{
      if(sx != null){
        card.style.transform =
          `translate(${e.clientX-sx}px, ${e.clientY-sy}px)
           rotate(${(e.clientX-sx)/10}deg)`;
      }
    };

    card.onpointerup = e=>{
      if(Math.abs(e.clientX-sx) > 80 || Math.abs(e.clientY-sy) > 80){
        haptic(20);
        card.remove();
        removed++;
        if(removed === 3){
          setTimeout(()=>{ step = 3; render(); },400);
        }
      } else {
        card.style.transform = "";
      }
      sx = null;
    };
  });
}

/* 3️⃣ GOLDEN TICKET → FINAL */
if(step === 3){
  app.innerHTML = `
    <div class="center card" onclick="step=5;render()">
      <h2>GOLDEN TICKET</h2>
      <p>Unlimited Love & Smiles</p>
      <strong>CLAIM →</strong>
    </div>
  `;
}

/* 5️⃣ FINAL SCREEN */
if(step === 5){
  fireSound.play();
  haptic([40,30,40,30,40]);

  app.innerHTML = `
    <div class="center">
      <h2>Happy New Year 🎆</h2>
      <p>Swipe left</p>

      <div class="book">
        <div class="page top" id="page1">
          <img src="photo1.jpg">
        </div>
        <div class="page">
          <img src="photo2.jpg">
        </div>
      </div>
    </div>
  `;

  // Fireworks ONLY here
  setInterval(()=>{
    for(let i=0;i<12;i++){
      const f = document.createElement("div");
      f.className = "firework";
      f.style.left = "50%";
      f.style.top = "50%";
      f.style.background = `hsl(${Math.random()*360},100%,70%)`;
      f.style.setProperty("--x",(Math.random()*400-200)+"px");
      f.style.setProperty("--y",(Math.random()*400-200)+"px");
      document.body.appendChild(f);
      setTimeout(()=>f.remove(),1200);
    }
  },1000);

  // Swipe book
  const page = document.getElementById("page1");
  let startX = 0, opened = false;

  page.onpointerdown = e => {
    startX = e.clientX;
    page.setPointerCapture(e.pointerId);
  };

  page.onpointermove = e => {
    const dx = e.clientX - startX;
    if(dx < -40 && !opened){
      page.classList.add("open");
      opened = true;
      haptic([30,20,30]);
    }
  };
}

}

render();
