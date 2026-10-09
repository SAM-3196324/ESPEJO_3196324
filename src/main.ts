import './estilo.css';

import {
  CONFIG,
  avanzarPulso,
  crearEstadoInicial,
  generarPareja,
  moverFichas,
  reiniciarPartida,
  type Direccion,
  type EstadoJuego,
  type FaseInversion,
} from './logica';

let estado: EstadoJuego | undefined;
let temporizador: number | undefined;
let ultimoMovimientoPorPuntero = 0;

const raiz = document.querySelector<HTMLDivElement>('#app');
if (!raiz) throw new Error('Falta el contenedor principal de ESPEJO.');

const nombreFase: Record<FaseInversion, string> = {
  horizontal: 'HORIZONTAL',
  vertical: 'VERTICAL',
  cruzada: 'CRUZADO',
};

function representarCelda(matriz: 'normal' | 'reflejo', fila: number, carril: number): string {
  if (!estado) return '';

  const ficha = matriz === 'normal' ? estado.fichaNormal : estado.fichaReflejo;
  const entidad = estado.entidades.find((actual) =>
    actual.matriz === matriz && actual.fila === fila && actual.carril === carril,
  );
  const contieneFicha = ficha.fila === fila && ficha.carril === carril;
  const contenidoEntidad = entidad
    ? `<span class="entidad ${entidad.clase}" aria-hidden="true">${entidad.clase === 'gema' ? '✦' : ''}</span>`
    : '';
  const contenidoFicha = contieneFicha
    ? `<span class="ficha ${matriz}" aria-hidden="true"></span>`
    : '';
  const descripcion = contieneFicha
    ? matriz === 'normal' ? 'ficha normal' : 'ficha reflejada'
    : entidad?.clase === 'gema' ? 'gema rúnica' : entidad ? 'obstáculo' : 'vacía';

  return `<div class="celda" role="gridcell" aria-label="Fila ${fila + 1}, carril ${carril + 1}: ${descripcion}">${contenidoEntidad}${contenidoFicha}</div>`;
}

function representarMatriz(matriz: 'normal' | 'reflejo', titulo: string): string {
  const celdas = Array.from({ length: CONFIG.FILAS }, (_, fila) =>
    Array.from({ length: CONFIG.CARRILES }, (_, carril) => representarCelda(matriz, fila, carril)).join(''),
  ).join('');

  return `<section class="matriz ${matriz}" aria-label="${titulo}">
    <h2 class="etiqueta">${titulo}</h2>
    <div class="cuadricula" role="grid" aria-rowcount="${CONFIG.FILAS}" aria-colcount="${CONFIG.CARRILES}">${celdas}</div>
  </section>`;
}

function representarControles(): string {
  return `<nav class="controles" aria-label="Controles de movimiento">
    <button class="boton-movimiento" type="button" data-movimiento="-1" aria-label="Mover a la izquierda">
      <span aria-hidden="true">←</span><span>IZQUIERDA</span><kbd>A</kbd>
    </button>
    <button class="boton-movimiento" type="button" data-movimiento="1" aria-label="Mover a la derecha">
      <kbd>D</kbd><span>DERECHA</span><span aria-hidden="true">→</span>
    </button>
  </nav>`;
}

function representarInicio(): string {
  return `<main class="marco pantalla-inicio">
    <header class="cabecera">
      <p class="sobrelinea">PROTOCOLO DE SINCRONÍA <span>///</span> 01</p>
      <h1>ESPEJO<span class="dos-puntos">:</span><br><span class="titulo-secundario">REFLEJO INVERTIDO</span></h1>
      <p class="subtitulo">Coordinación dual cyber-rúnica</p>
    </header>
    <section class="intro" aria-label="Inicio del juego">
      <div class="sello" aria-hidden="true"><span>✧</span><i></i></div>
      <p>Dos matrices. Un solo pulso.</p>
      <button class="boton-principal" type="button" data-accion="iniciar">INICIAR SINCRONÍA <span aria-hidden="true">↗</span></button>
    </section>
    <footer class="ayuda">
      <span>CONTROLES</span><p><kbd>A</kbd> <kbd>←</kbd> MOVER <kbd>D</kbd> <kbd>→</kbd> MOVER</p>
      <p>ESQUIVA ROJO <b class="punto-rojo">●</b> <span class="separador">/</span> RECOLECTA ÁMBAR <b class="punto-ambar">✦</b></p>
    </footer>
  </main>`;
}

function representarPartida(): string {
  if (!estado) return representarInicio();
  const finalizada = estado.estado !== 'en_curso';
  const resultado = estado.estado === 'victoria';

  return `<main class="marco pantalla-juego">
    <header class="cabecera cabecera-juego">
      <p class="sobrelinea">ESPEJO <span>///</span> SINCRONÍA EN CURSO</p>
      <h1>REFLEJO <span class="dos-puntos">:</span> <span class="titulo-secundario">INVERTIDO</span></h1>
      <div class="marcadores" aria-label="Estado de la partida">
        <div class="marcador"><span>PUNTUACIÓN</span><strong>${estado.puntuacion}</strong></div>
        <div class="marcador combo"><span>COMBO</span><strong>×${estado.multiplicadorCombo}</strong></div>
        <div class="marcador fase"><span>FASE</span><strong>${nombreFase[estado.fase]}</strong></div>
      </div>
    </header>
    <div class="matrices">
      ${representarMatriz('normal', 'MATRIZ A · NORMAL')}
      <div class="eje" aria-hidden="true"><span>↕</span><i></i><span>↕</span></div>
      ${representarMatriz('reflejo', 'MATRIZ B · REFLEJO')}
    </div>
    ${representarControles()}
    <p class="estado-vivo" aria-live="polite">${finalizada ? 'Partida finalizada.' : 'Sincronía activa.'}</p>
    ${finalizada ? `<section class="velo" role="dialog" aria-modal="true" aria-labelledby="titulo-resultado">
      <div class="resultado ${resultado ? 'victoria' : 'derrota'}">
        <p class="sobrelinea">${resultado ? 'PROTOCOLO COMPLETADO' : 'CONEXIÓN INTERRUMPIDA'}</p>
        <h2 id="titulo-resultado">${resultado ? 'SINCRONÍA PERFECTA' : 'SINCRONÍA ROTA'}</h2>
        <dl class="resumen">
          <div><dt>PUNTUACIÓN FINAL</dt><dd>${estado.puntuacion}</dd></div>
          <div><dt>COMBO FINAL</dt><dd>×${estado.multiplicadorCombo}</dd></div>
          <div><dt>FASE FINAL</dt><dd>${nombreFase[estado.fase]}</dd></div>
        </dl>
        <button class="boton-principal" type="button" data-accion="reiniciar">REINICIAR ESPEJO <span aria-hidden="true">↻</span></button>
      </div>
    </section>` : ''}
  </main>`;
}

function renderizar(): void {
  raiz.innerHTML = estado ? representarPartida() : representarInicio();
}

function iniciarPartida(): void {
  if (temporizador !== undefined) window.clearInterval(temporizador);
  if (estado) {
    reiniciarPartida(estado, Date.now() >>> 0);
  } else {
    estado = crearEstadoInicial(Date.now() >>> 0);
  }
  if (estado) generarPareja(estado);
  renderizar();
  temporizador = window.setInterval(avanzarPartida, CONFIG.INTERVALO_CAIDA);
}

function accionar(direccion: Direccion): void {
  if (estado && moverFichas(estado, direccion)) renderizar();
}

function avanzarPartida(): void {
  if (!estado || estado.estado !== 'en_curso') {
    if (temporizador !== undefined) window.clearInterval(temporizador);
    temporizador = undefined;
    return;
  }

  const huboAvance = avanzarPulso(estado);
  const seGeneroPareja = estado.estado === 'en_curso' && generarPareja(estado);
  if (huboAvance || seGeneroPareja) renderizar();
  if (estado.estado !== 'en_curso' && temporizador !== undefined) {
    window.clearInterval(temporizador);
    temporizador = undefined;
  }
}

raiz.addEventListener('click', (evento) => {
  if (!(evento.target instanceof Element)) return;
  const boton = evento.target.closest<HTMLButtonElement>('button');
  if (!boton) return;

  if (boton.dataset.accion === 'iniciar' || boton.dataset.accion === 'reiniciar') {
    iniciarPartida();
    return;
  }

  if (boton.dataset.movimiento === '-1' || boton.dataset.movimiento === '1') {
    if (evento.detail === 0 || Date.now() - ultimoMovimientoPorPuntero > 800) {
      accionar(Number(boton.dataset.movimiento) as Direccion);
    }
  }
});

raiz.addEventListener('pointerdown', (evento) => {
  if (!(evento.target instanceof Element)) return;
  const boton = evento.target.closest<HTMLButtonElement>('button[data-movimiento]');
  if (!boton || (boton.dataset.movimiento !== '-1' && boton.dataset.movimiento !== '1')) return;

  evento.preventDefault();
  ultimoMovimientoPorPuntero = Date.now();
  accionar(Number(boton.dataset.movimiento) as Direccion);
});

window.addEventListener('keydown', (evento) => {
  if (!estado || estado.estado !== 'en_curso') return;
  const tecla = evento.key.toLowerCase();
  if (tecla === 'arrowleft' || tecla === 'a') {
    evento.preventDefault();
    accionar(-1);
  } else if (tecla === 'arrowright' || tecla === 'd') {
    evento.preventDefault();
    accionar(1);
  }
});

renderizar();
