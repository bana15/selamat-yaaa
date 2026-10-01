// ---- gate open ----
  const gate = document.getElementById('gate');
  const wrap = document.getElementById('wrap');
  gate.addEventListener('click', () => {
    gate.classList.add('hidden');
    setTimeout(() => wrap.classList.add('visible'), 150);
    burstConfetti(50);
  });

  // ---- scroll reveal ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); } });
  }, {threshold:0.15});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---- reply feature (shared storage) ----
  const sendBtn = document.getElementById('sendBtn');
  const replyInput = document.getElementById('replyInput');
  replyInput.addEventListener('input', (e) => {
    if(e.inputType && e.inputType.startsWith('delete')) return;
    wrapLastTypedChar();
  });

  function getLastCharLength(text){
    if(typeof Intl !== 'undefined' && Intl.Segmenter){
      try{
        const seg = new Intl.Segmenter(undefined, {granularity:'grapheme'});
        const parts = Array.from(seg.segment(text));
        if(parts.length) return parts[parts.length-1].segment.length;
      }catch(e){}
    }
    const last2 = text.slice(-2);
    if(/[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(last2)) return 2;
    return 1;
  }

  function wrapLastTypedChar(){
    const sel = window.getSelection();
    if(!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    if(!range.collapsed) return;
    const node = range.startContainer;
    const offset = range.startOffset;
    if(node.nodeType !== Node.TEXT_NODE || offset === 0) return;

    const text = node.textContent;
    const charLen = Math.min(getLastCharLength(text.slice(0, offset)), offset);
    const before = text.slice(0, offset - charLen);
    const charText = text.slice(offset - charLen, offset);
    const after = text.slice(offset);

    const span = document.createElement('span');
    span.className = 'pop-letter';
    span.textContent = charText;

    const parent = node.parentNode;
    const afterNode = document.createTextNode(after);
    parent.replaceChild(afterNode, node);
    parent.insertBefore(span, afterNode);
    if(before) parent.insertBefore(document.createTextNode(before), span);

    const newRange = document.createRange();
    newRange.setStart(afterNode, 0);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
  }
  const replyStatus = document.getElementById('replyStatus');
  const existingReplyHolder = document.getElementById('existingReplyHolder');
  const WHATSAPP_NUMBER = '6285166469917';

  sendBtn.addEventListener('click', () => {
    const text = replyInput.textContent.trim();
    if(!text){
      replyStatus.textContent = 'tulis dulu pesannya ya';
      return;
    }
    const waText = encodeURIComponent('Balasan dari Nayla untuk ucapan ulang tahunnya:\n\n"' + text + '"');
    const waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + waText;
    window.open(waUrl, '_blank');
    replyStatus.textContent = 'membuka WhatsApp... 🤍';
    burstConfetti(60);
  });

  // ---- confetti ----
  function burstConfetti(count){
    const colors = ['#e8a3b5','#c9a875','#f7cdd8','#b56377','#fff3ea'];
    for(let i=0;i<count;i++){
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      const size = 5 + Math.random()*6;
      p.style.width = size+'px';
      p.style.height = (size*0.4)+'px';
      p.style.left = Math.random()*100+'vw';
      p.style.background = colors[Math.floor(Math.random()*colors.length)];
      p.style.transform = 'rotate('+(Math.random()*360)+'deg)';
      document.body.appendChild(p);
      const duration = 2200 + Math.random()*1800;
      const drift = (Math.random()-0.5)*160;
      p.animate([
        { transform:p.style.transform+' translate(0,0)', opacity:1 },
        { transform:'rotate('+(Math.random()*720)+'deg) translate('+drift+'px, 100vh)', opacity:0.9 }
      ], { duration, easing:'cubic-bezier(.2,.6,.3,1)' });
      setTimeout(()=>p.remove(), duration+50);
    }
  }

  // ---- ambient sparkles ----
  const canvas = document.getElementById('sparkle');
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  const sparkles = Array.from({length: 36}, () => ({
    x: Math.random()*window.innerWidth,
    y: Math.random()*window.innerHeight,
    r: Math.random()*1.6 + 0.4,
    speed: Math.random()*0.25 + 0.05,
    phase: Math.random()*Math.PI*2
  }));
  let t = 0;
  function loop(){
    t += 0.02;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    sparkles.forEach(s => {
      s.y -= s.speed;
      if(s.y < -5){ s.y = canvas.height + 5; s.x = Math.random()*canvas.width; }
      const alpha = 0.25 + 0.35*Math.sin(t + s.phase);
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,'+Math.max(0,alpha)+')';
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(loop);
  }
  loop();

  // floating heart particles
  const floatWrap = document.createElement('div');
  floatWrap.style.position = 'fixed';
  floatWrap.style.inset = '0';
  floatWrap.style.zIndex = '1';
  floatWrap.style.pointerEvents = 'none';
  floatWrap.style.overflow = 'hidden';
  document.body.appendChild(floatWrap);

  const heartSymbols = ['🤍','✿'];
  function spawnHeart(){
    const h = document.createElement('div');
    h.textContent = heartSymbols[Math.floor(Math.random()*heartSymbols.length)];
    h.style.position = 'absolute';
    h.style.left = Math.random()*100 + 'vw';
    h.style.bottom = '-40px';
    h.style.fontSize = (12 + Math.random()*12) + 'px';
    h.style.opacity = (0.25 + Math.random()*0.35).toString();
    const duration = 9000 + Math.random()*7000;
    const drift = (Math.random()-0.5)*120;
    h.animate([
      { transform:'translate(0,0) rotate(0deg)', opacity:0 },
      { transform:'translate(0,-10vh)', opacity:h.style.opacity, offset:0.1 },
      { transform:'translate('+drift+'px,-110vh) rotate('+(Math.random()*360)+'deg)', opacity:0 }
    ], { duration, easing:'linear' });
    floatWrap.appendChild(h);
    setTimeout(()=>h.remove(), duration+50);
  }
  setInterval(spawnHeart, 1200);
  spawnHeart();