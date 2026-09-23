/* ================================
   BEFORE YOUR EYES — lógica
   ================================ */

// CONFIGURAÇÃO DO PRESENTE
// Altere os valores abaixo para colocar a chave real.
// Cada número representa o código de um caractere; cada grupo vira um bloco da chave.
// A chave só é reconstruída quando o desafio termina.
const GIFT_KEY_PARTS = [
  [74, 69, 66, 55, 48],
  [57, 89, 73, 82, 69],
  [86, 53, 67, 54, 84]
];

function getGameKey() {
  return GIFT_KEY_PARTS.map((part) =>
    String.fromCharCode(...part)
  ).join("-");
}

const keyEl = document.getElementById("key");

// Detecta a preferência real de tema do sistema/navegador
const lightSchemeQuery = window.matchMedia("(prefers-color-scheme: light)");

let unlocked = false;

function applyTheme(isLight) {
  if (isLight && !unlocked) {
    unlocked = true;
    document.body.classList.add("is-light");
    // pequeno atraso para a chave surgir depois do fundo clarear
    window.setTimeout(() => {
      keyEl.textContent = getGameKey();
      keyEl.classList.add("is-shown");
    }, 900);
  }
  // Uma vez desbloqueado nesta visita, permanece revelado
  // mesmo que o usuário volte ao tema escuro — evita frustração.
}

// Detecta mudança de tema em tempo real, sem precisar recarregar
lightSchemeQuery.addEventListener("change", (event) => {
  applyTheme(event.matches);
});
