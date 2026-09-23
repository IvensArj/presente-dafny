/* ================================
   HOME — lógica
   ================================ */

// >>> ALTERE OS LINKS DOS DOIS DESAFIOS AQUI <<<
const FIRST_CHALLENGE_URL = "desafio1/index.html";
const SECOND_CHALLENGE_URL = "desafio2/index.html";

const card1 = document.getElementById("card-1");
const card2 = document.getElementById("card-2");

card1.href = FIRST_CHALLENGE_URL;
card2.href = SECOND_CHALLENGE_URL;

// Navegação direta, sem nova aba e sem pop-up
[card1, card2].forEach((card) => {
  card.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = card.href;
  });
});

// ---------- animação de entrada ----------
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const body = document.body;

if (reduceMotion) {
  body.classList.add("is-ready");
} else {
  window.requestAnimationFrame(() => {
    window.setTimeout(() => body.classList.add("is-ready"), 150);
  });
}
