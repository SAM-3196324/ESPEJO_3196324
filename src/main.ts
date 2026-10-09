import { CONFIG, avanzarPulso, crearEstadoInicial, generarPareja, moverFichas, type Direccion, type EstadoJuego } from "./logica";
import "./estilos.css";

let estado: EstadoJuego = crearEstadoInicial(20261009);
let temporizador: number | undefined;

const raizEncontrada = document.querySelector<HTMLDivElement>("#aplicacion");
if (!raizEncontrada) throw new Error("No se encontro el contenedor de ESPEJO.");
const raiz: HTMLDivElement = raizEncontrada;

function celda(entidades: EstadoJuego["entidades"], matriz: "normal" | "reflejo", fila: number, carril: number): string {
  const entidad = entidades.find((actual) => actual.matriz === matriz && actual.fila === fila && actual.carril === carril);
  const ficha = matriz === "normal" ? estado.fichaNormal : estado.fichaReflejo;
  if (ficha.fila === fila && ficha.carril === carril) return `<i class="ficha ${matriz}"></i>`;
  if (!entidad) return "";
  return `<i class="entidad ${entidad.clase}">${entidad.clase === "gema" ? "✦" : ""}</i>`;
}
function tablero(matriz: "normal" | "reflejo", titulo: string): string {
  let celdas = "";
  for (let fila = 0; fila < CONFIG.FILAS; fila += 1) for (let carril = 0; carril < CONFIG.CARRILES; carril += 1) celdas += `<div class="celda">${celda(estado.entidades, matriz, fila, carril)}</div>`;
  return `<section class="matriz ${matriz}"><div class="etiqueta">${titulo}</div><div class="cuadricula">${celdas}</div></section>`;
}
function renderizar(): void {
  const finalizada = estado.estado !== "en_curso";
  raiz.innerHTML = `<main><header><p class="ceja">ARCADE // CYBER-SINCRONIA RUNICA</p><h1>ESPEJO <span>:</span> REFLEJO INVERTIDO</h1><div class="metricas"><b>PUNTOS <em>${estado.puntuacion}</em></b><b>COMBO <em>x${estado.multiplicadorCombo}</em></b><b>FASE <em>${estado.fase.toUpperCase()}</em></b></div></header><div class="tableros">${tablero("normal", "MATRIZ A · NORMAL")}${tablero("reflejo", "MATRIZ B · REFLEJO")}</div><nav><button data-mover="-1" aria-label="Mover a la izquierda">← <small>IZQUIERDA</small></button><button data-mover="1" aria-label="Mover a la derecha"><small>DERECHA</small> →</button></nav>${finalizada ? `<div class="velo"><article><p>${estado.estado === "victoria" ? "SINCRONIA TOTAL" : "REFLEJO DESTRUIDO"}</p><h2>${estado.estado === "victoria" ? "META ALCANZADA" : "GAME OVER"}</h2><dl><div><dt>Puntuacion</dt><dd>${estado.puntuacion}</dd></div><div><dt>Gemas</dt><dd>${estado.gemasRecolectadas}</dd></div><div><dt>Esquivas</dt><dd>${estado.esquivas}</dd></div></dl><button id="reiniciar">REINICIAR MATRICES</button></article></div>` : ""}</main>`;
  raiz.querySelectorAll<HTMLButtonElement>("[data-mover]").forEach((boton) => boton.addEventListener("click", () => accionar(Number(boton.dataset.mover) as Direccion)));
  raiz.querySelector<HTMLButtonElement>("#reiniciar")?.addEventListener("click", iniciar);
}
function accionar(direccion: Direccion): void { if (moverFichas(estado, direccion)) renderizar(); }
function pulso(): void {
  if (estado.estado !== "en_curso") return;
  avanzarPulso(estado);
  if (estado.estado === "en_curso" && estado.entidades.length < 8) generarPareja(estado);
  renderizar();
}
function iniciar(): void {
  if (temporizador !== undefined) window.clearInterval(temporizador);
  estado = crearEstadoInicial((Date.now() >>> 0));
  generarPareja(estado);
  renderizar();
  temporizador = window.setInterval(pulso, CONFIG.INTERVALO_CAIDA);
}
window.addEventListener("keydown", (evento) => {
  if (evento.key === "ArrowLeft" || evento.key.toLowerCase() === "a") accionar(-1);
  if (evento.key === "ArrowRight" || evento.key.toLowerCase() === "d") accionar(1);
});
iniciar();
