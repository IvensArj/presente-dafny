/* ================================
   FALTA COR AQUI — lógica
   ================================ */

// CONFIGURAÇÃO DO PRESENTE
// Altere os valores abaixo para colocar a chave real.
// Cada número representa o código de um caractere; cada grupo vira um bloco da chave.
// A chave só é reconstruída quando o desafio termina.
const GIFT_KEY_PARTS = [
  [68, 81, 72, 84, 69],
  [73, 80, 80, 53, 50],
  [76, 88, 53, 51, 50]
];

function getGameKey() {
  return GIFT_KEY_PARTS.map((part) =>
    String.fromCharCode(...part)
  ).join("-");
}

// >>> AJUSTES RÁPIDOS <<<
const INK_CAPACITY = 150;            // tinta máxima
const INK_PER_PIXEL = 0.020;         // consumo de tinta por pixel percorrido
const PAINT_RADIUS = 50;             // raio base do pincel (px)
const COMPLETE_THRESHOLD = 100;      // % para considerar a tela "completa"
const PAINT_COLOR = { h: 27, s: 62, l: 56 }; // cor da tinta (HSL) — tom quente inspirado em GRIS

(() => {
  const canvas = document.getElementById("paint-canvas");
  const ctx = canvas.getContext("2d");

  const brush = document.getElementById("brush");
  const bucket = document.getElementById("bucket");
  const intro = document.getElementById("intro");
  const percentEl = document.getElementById("percent");
  const toast = document.getElementById("toast");
  const finale = document.getElementById("finale");
  const finale1 = document.getElementById("finale-1");
  const finale2 = document.getElementById("finale-2");
  const finale3 = document.getElementById("finale-3");
  const keyEl = document.getElementById("key");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- estado ----------
  let ink = INK_CAPACITY;
  let dragging = false;
  let hasPaintedOnce = false;
  let isComplete = false;
  let lastPoint = null;
  let toastTimer = null;
  let sampleScheduled = false;

  // canvas de amostragem, em baixa resolução, usado só para calcular a cobertura
  const SAMPLE_W = 96;
  const SAMPLE_H = 60;
  const sampleCanvas = document.createElement("canvas");
  sampleCanvas.width = SAMPLE_W;
  sampleCanvas.height = SAMPLE_H;
  const sampleCtx = sampleCanvas.getContext("2d");

  // ---------- setup de tela ----------
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // ---------- posicionamento inicial do pincel e do balde ----------
  function randomPositionAvoidingCenter() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 0.1;
    let x, y;
    do {
      x = margin + Math.random() * (1 - margin * 2);
      y = margin + Math.random() * (1 - margin * 2);
    } while (x > 0.32 && x < 0.68 && y > 0.32 && y < 0.68);
    return { left: x * vw, top: y * vh };
  }

  function placeTool(el, size) {
    const pos = randomPositionAvoidingCenter();
    el.style.left = Math.round(pos.left - size / 2) + "px";
    el.style.top = Math.round(pos.top - size / 2) + "px";
  }

  const brushSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--brush-size")) || 64;
  const bucketSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--bucket-size")) || 72;
  placeTool(brush, brushSize);
  placeTool(bucket, bucketSize);

  // ---------- pintura ----------
  function stampAt(x, y, strength) {
    const radius = PAINT_RADIUS * (0.55 + strength * 0.6);
    const alpha = 0.10 + strength * 0.22;
    const hueJitter = (Math.random() - 0.5) * 8;
    const lightJitter = (Math.random() - 0.5) * 6;

    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, `hsla(${PAINT_COLOR.h + hueJitter}, ${PAINT_COLOR.s}%, ${PAINT_COLOR.l + lightJitter}%, ${alpha})`);
    grad.addColorStop(1, `hsla(${PAINT_COLOR.h + hueJitter}, ${PAINT_COLOR.s}%, ${PAINT_COLOR.l + lightJitter}%, 0)`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // versão simplificada e opaca no canvas de amostragem, para medir cobertura
    const sx = (x / window.innerWidth) * SAMPLE_W;
    const sy = (y / window.innerHeight) * SAMPLE_H;
    const sr = (radius / window.innerWidth) * SAMPLE_W;
    sampleCtx.fillStyle = "#000";
    sampleCtx.beginPath();
    sampleCtx.arc(sx, sy, Math.max(sr, 0.6), 0, Math.PI * 2);
    sampleCtx.fill();
  }

  function paintStroke(x, y) {
    if (isComplete) return;
    if (ink <= 0) {
      showToast("A tinta acabou.");
      return;
    }

    const strength = Math.max(ink / INK_CAPACITY, 0.12);

    if (lastPoint) {
      const dx = x - lastPoint.x;
      const dy = y - lastPoint.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(1, Math.floor(dist / 6));
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        stampAt(lastPoint.x + dx * t, lastPoint.y + dy * t, strength);
      }
      ink -= dist * INK_PER_PIXEL;
    } else {
      stampAt(x, y, strength);
      ink -= 2;
    }

    ink = Math.max(ink, 0);
    lastPoint = { x, y };

    if (!hasPaintedOnce) {
      hasPaintedOnce = true;
      intro.classList.add("is-faded");
      percentEl.classList.add("is-shown");
    }
    brush.classList.toggle("is-empty", ink < INK_CAPACITY * 0.18);

    scheduleCoverageSample();
  }

  // ---------- cobertura / porcentagem ----------
  function scheduleCoverageSample() {
    if (sampleScheduled) return;
    sampleScheduled = true;
    requestAnimationFrame(measureCoverage);
  }

  function measureCoverage() {
    sampleScheduled = false;
    const data = sampleCtx.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data;
    let covered = 0;
    const total = SAMPLE_W * SAMPLE_H;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 20) covered++;
    }
    const pct = Math.min(100, Math.round((covered / total) * 100));
    percentEl.textContent = pct + "%";

    if (pct >= COMPLETE_THRESHOLD && !isComplete) {
      completeExperience();
    }
  }

  // ---------- balde / recarga ----------
  function checkBucketCollision(x, y) {
    const rect = bucket.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    const threshold = rect.width * 0.75 + brushSize * 0.35;

    if (dist < threshold && ink < INK_CAPACITY) {
      ink = INK_CAPACITY;
      brush.classList.remove("is-empty");
      bucket.classList.add("is-refilling");
      showToast("Tinta recarregada.");
      window.setTimeout(() => bucket.classList.remove("is-refilling"), 500);
    }
  }

  // ---------- toast ----------
  function showToast(text) {
    if (toast.dataset.current === text && toast.classList.contains("is-shown")) return;
    toast.textContent = text;
    toast.dataset.current = text;
    toast.classList.add("is-shown");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-shown");
    }, 2200);
  }

  // ---------- arraste do pincel (mouse + toque) ----------
  function getEventPoint(event) {
    return { x: event.clientX, y: event.clientY };
  }

  function moveBrushTo(x, y) {
    brush.style.left = Math.round(x - brushSize / 2) + "px";
    brush.style.top = Math.round(y - brushSize / 2) + "px";
  }

  brush.addEventListener("pointerdown", (event) => {
    if (isComplete) return;
    dragging = true;
    lastPoint = null;
    brush.classList.add("is-dragging");
    document.body.classList.add("is-painting");
    brush.setPointerCapture(event.pointerId);
    const { x, y } = getEventPoint(event);
    moveBrushTo(x, y);
    event.preventDefault();
  });

  brush.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const { x, y } = getEventPoint(event);
    moveBrushTo(x, y);
    paintStroke(x, y);
    checkBucketCollision(x, y);
    event.preventDefault();
  });

  function endDrag(event) {
    if (!dragging) return;
    dragging = false;
    lastPoint = null;
    brush.classList.remove("is-dragging");
    document.body.classList.remove("is-painting");
    try { brush.releasePointerCapture(event.pointerId); } catch (e) { /* ignora */ }
  }

  brush.addEventListener("pointerup", endDrag);
  brush.addEventListener("pointercancel", endDrag);

  // ---------- final da experiência ----------
  function completeExperience() {
    isComplete = true;
    percentEl.textContent = "100%";
    brush.classList.add("is-hidden");
    dragging = false;

    const delay = reduceMotion ? 250 : 1400;

    window.setTimeout(() => {
      bucket.classList.add("is-hidden");
      percentEl.style.transition = "opacity 1.6s ease";
      percentEl.style.opacity = "0";
      finale.classList.add("is-shown");

      window.setTimeout(() => finale1.classList.add("is-shown"), 300);
      window.setTimeout(() => finale2.classList.add("is-shown"), reduceMotion ? 600 : 2000);
      window.setTimeout(() => finale3.classList.add("is-shown"), reduceMotion ? 900 : 3600);
      window.setTimeout(() => {
        keyEl.textContent = getGameKey();
        keyEl.classList.add("is-shown");
      }, reduceMotion ? 1100 : 4400);
    }, delay);
  }
})();
