import './estilo.css';

import {
  ASPECTOS,
  CONFIG,
  avanzarPulso,
  comprarAspecto,
  crearEstadoInicial,
  generarPareja,
  moverFichas,
  reiniciarPartida,
  seleccionarAspecto,
  type AspectoFicha,
  type Direccion,
  type EstadoJuego,
  type FaseInversion,
} from './logica';

interface ProgresoGuardado {
  ambar: number;
  aspecto: AspectoFicha;
  aspectosDesbloqueados: AspectoFicha[];
}

let estado: EstadoJuego = crearEstadoInicial(Date.now() >>> 0);
let temporizador: number | undefined;
let ultimoMovimientoPorPuntero = 0;
let pantalla: 'inicio' | 'juego' = 'inicio';

const raiz = document.querySelector<HTMLDivElement>('#app');
if (!raiz) throw new Error('Falta el contenedor principal de ESPEJO.');

function cargarProgreso(): void {
  try {
    const texto = localStorage.getItem('espejo-progreso-v1');
    if (!texto) return;
    const guardado = JSON.parse(texto) as Partial<ProgresoGuardado>;
    if (typeof guardado.ambar === 'number' && Number.isFinite(guardado.ambar)) {
      estado.ambar = Math.max(0, Math.floor(guardado.ambar));
    }
    if (Array.isArray(guardado.aspectosDesbloqueados)) {
      const desbloqueados = guardado.aspectosDesbloqueados.filter((aspecto): aspecto is AspectoFicha =>
        ASPECTOS.some((opcion) => opcion.id === aspecto),
      );
      estado.aspectosDesbloqueados = Array.from(new Set(['cian', ...desbloqueados]));
    }
    if (
      guardado.aspecto &&
      estado.aspectosDesbloqueados.includes(guardado.aspecto) &&
      ASPECTOS.some((opcion) => opcion.id === guardado.aspecto)
    ) estado.aspecto = guardado.aspecto;
  } catch {
    estado.aspectosDesbloqueados = ['cian'];
  }
}

function guardarProgreso(): void {
  try {
    const progreso: ProgresoGuardado = {
      ambar: estado.ambar,
      aspecto: estado.aspecto,
      aspectosDesbloqueados: [...estado.aspectosDesbloqueados],
    };
    localStorage.setItem('espejo-progreso-v1', JSON.stringify(progreso));
  } catch {
    return;
  }
}

const nombreFase: Record<FaseInversion, string> = {
  horizontal: 'HORIZONTAL',
  vertical: 'VERTICAL',
  cruzada: 'CRUZADO',
};

function representarMatriz(matriz: 'normal' | 'reflejo', titulo: string): string {
  const celdas = Array.from({ length: CONFIG.FILAS }, (_, fila) =>
    Array.from({ length: CONFIG.CARRILES }, (_, carril) =>
      `<div class="celda" data-matriz="${matriz}" data-fila="${fila}" data-carril="${carril}" role="gridcell"><span class="token" aria-hidden="true"></span></div>`,
    ).join(''),
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
      <p class="sobrelinea">PROTOCOLO DE SINCRONÍA <span>///</span> MODO INFINITO</p>
      <h1>ESPEJO<span class="dos-puntos">:</span><br><span class="titulo-secundario">REFLEJO INVERTIDO</span></h1>
      <p class="subtitulo">Coordinación dual cyber-rúnica</p>
    </header>
    <div class="inicio-layout">
      <section class="intro" aria-label="Reglas del juego">
        <div class="sello" aria-hidden="true"><span>✧</span><i></i></div>
        <p class="frase-inicio">Dos matrices. Un solo pulso.</p>
        <ol class="reglas">
          <li><b>01</b><span>Muévete con <kbd>A</kbd> <kbd>D</kbd> o las flechas; el reflejo responde al mismo tiempo.</span></li>
          <li><b>02</b><span>Esquiva los bloques rojos. Un impacto rompe tu combo, pero no la partida.</span></li>
          <li><b>03</b><span>Recoge gemas ámbar para puntuar, aumentar el combo y comprar aspectos.</span></li>
        </ol>
        <button class="boton-principal" type="button" data-accion="iniciar">INICIAR <span aria-hidden="true">↗</span></button>
      </section>
      <aside class="arsenal" aria-label="Tienda de aspectos">
        <header class="arsenal-cabecera"><div><p class="sobrelinea">COLECCIÓN</p><h2>ARSENAL RÚNICO</h2></div><strong class="monedero"><span aria-hidden="true">✦</span> <span data-ambar>${estado.ambar}</span></strong></header>
        <p class="nota-arsenal">El ámbar y los aspectos se guardan en este dispositivo.</p>
        <div class="aspectos">${representarAspectos()}</div>
      </aside>
    </div>
    <footer class="ayuda"><span>UNA PARTIDA, SIN FINAL</span><p>Las colisiones cortan el combo; la sincronía continúa.</p></footer>
  </main>`;
}

function representarAspectos(): string {
  return ASPECTOS.map((opcion) => `<button class="aspecto-opcion" type="button" data-aspecto="${opcion.id}" data-estado-opcion="" aria-pressed="false">
    <span class="muestra-aspecto aspecto-${opcion.id}" aria-hidden="true"></span>
    <span class="aspecto-info"><strong>${opcion.nombre}</strong><span class="estado-opcion"></span></span>
  </button>`).join('');
}

function representarTiendaCompacta(): string {
  return `<aside class="arsenal arsenal-compacto" aria-label="Tienda de aspectos">
    <header class="arsenal-cabecera"><div><p class="sobrelinea">ARSENAL</p><h2>ASPECTOS</h2></div><strong class="monedero"><span aria-hidden="true">✦</span> <span data-ambar>${estado.ambar}</span></strong></header>
    <div class="aspectos">${representarAspectos()}</div>
  </aside>`;
}

function representarPartida(): string {
  return `<main class="marco pantalla-juego">
    <header class="cabecera cabecera-juego">
      <p class="sobrelinea">ESPEJO <span>///</span> SESIÓN INFINITA</p>
      <h1>REFLEJO <span class="dos-puntos">:</span> <span class="titulo-secundario">INVERTIDO</span></h1>
      ${representarMarcadores()}
    </header>
    <div class="ritmo-combo" aria-label="Progreso al siguiente nivel de combo"><span>CADENA RÚNICA</span><div><i id="progreso-combo"></i></div></div>
    <div class="arena-layout">
      <div class="zona-juego">
        <div class="matrices">
          ${representarMatriz('normal', 'MATRIZ A · NORMAL')}
          <div class="eje" aria-hidden="true"><span>↕</span><i></i><span>↕</span></div>
          ${representarMatriz('reflejo', 'MATRIZ B · REFLEJO')}
        </div>
        ${representarControles()}
      </div>
      ${representarTiendaCompacta()}
    </div>
    <p class="estado-vivo" aria-live="polite">El pulso continúa. Un impacto reinicia tu combo, no tu partida.</p>
  </main>`;
}

function actualizarTienda(): void {
  raiz.querySelectorAll<HTMLButtonElement>('[data-aspecto]').forEach((boton) => {
    const aspecto = boton.dataset.aspecto as AspectoFicha;
    const opcion = ASPECTOS.find((actual) => actual.id === aspecto);
    if (!opcion) return;
    const desbloqueado = estado.aspectosDesbloqueados.includes(aspecto);
    const equipado = estado.aspecto === aspecto;
    const estadoOpcion = equipado ? 'EQUIPADO' : desbloqueado ? 'EQUIPAR' : `${opcion.precio} ÁMBAR`;
    const referencia = boton.querySelector<HTMLElement>('.estado-opcion');
    if (boton.dataset.estadoOpcion !== estadoOpcion) {
      if (referencia) referencia.textContent = estadoOpcion;
      boton.dataset.estadoOpcion = estadoOpcion;
    }
    boton.setAttribute('aria-pressed', String(equipado));
    boton.disabled = !desbloqueado && estado.ambar < opcion.precio;
  });
  raiz.querySelectorAll<HTMLElement>('[data-ambar]').forEach((elemento) => {
    elemento.textContent = String(estado.ambar);
  });
}

function actualizarTablero(): void {
  const entidades = new Map(estado.entidades.map((entidad) => [
    `${entidad.matriz}-${entidad.fila}-${entidad.carril}`,
    entidad,
  ]));
  raiz.querySelectorAll<HTMLElement>('.celda').forEach((celda) => {
    const matriz = celda.dataset.matriz as 'normal' | 'reflejo';
    const fila = Number(celda.dataset.fila);
    const carril = Number(celda.dataset.carril);
    const ficha = matriz === 'normal' ? estado.fichaNormal : estado.fichaReflejo;
    const contieneFicha = ficha.fila === fila && ficha.carril === carril;
    const entidad = entidades.get(`${matriz}-${fila}-${carril}`);
    const token = celda.firstElementChild as HTMLElement | null;
    if (!token) return;

    celda.setAttribute('aria-label', `Fila ${fila + 1}, carril ${carril + 1}`);
    token.className = 'token';
    if (contieneFicha) {
      token.classList.add('activo', 'ficha', matriz, `aspecto-${estado.aspecto}`);
      celda.setAttribute('aria-label', `Fila ${fila + 1}, carril ${carril + 1}: ficha ${matriz}`);
    } else if (entidad) {
      token.classList.add('activo', 'entidad', entidad.clase);
      if (entidad.clase === 'gema') token.textContent = '✦';
      celda.setAttribute('aria-label', `Fila ${fila + 1}, carril ${carril + 1}: ${entidad.clase === 'gema' ? 'gema rúnica' : 'obstáculo'}`);
    } else {
      token.textContent = '';
    }
  });
}

function actualizarPartida(): void {
  if (pantalla !== 'juego') return;
  const valores: Record<string, string> = {
    puntuacion: String(estado.puntuacion),
    combo: `×${estado.multiplicadorCombo}`,
    fase: nombreFase[estado.fase],
    impactos: String(estado.impactos),
  };
  Object.entries(valores).forEach(([clave, valor]) => {
    const elemento = raiz.querySelector<HTMLElement>(`[data-valor="${clave}"]`);
    if (elemento && elemento.textContent !== valor) elemento.textContent = valor;
  });
  const progreso = raiz.querySelector<HTMLElement>('#progreso-combo');
  if (progreso) {
    const avance = (estado.accionesSincronizadas % CONFIG.PASOS_PARA_COMBO) / CONFIG.PASOS_PARA_COMBO * 100;
    progreso.style.width = `${avance}%`;
  }
  actualizarTablero();
}

function representarMarcadores(): string {
  return `<div class="marcadores" aria-label="Estado de la partida">
    <div class="marcador"><span>PUNTUACIÓN</span><strong data-valor="puntuacion">${estado.puntuacion}</strong></div>
    <div class="marcador combo"><span>COMBO</span><strong data-valor="combo">×${estado.multiplicadorCombo}</strong></div>
    <div class="marcador fase"><span>FASE</span><strong data-valor="fase">${nombreFase[estado.fase]}</strong></div>
    <div class="marcador impactos"><span>IMPACTOS</span><strong data-valor="impactos">${estado.impactos}</strong></div>
  </div>`;
}

function renderizar(): void {
  const nuevaPantalla = pantalla;
  if (raiz.dataset.pantalla !== nuevaPantalla) {
    raiz.innerHTML = nuevaPantalla === 'juego' ? representarPartida() : representarInicio();
    raiz.dataset.pantalla = nuevaPantalla;
  }
  actualizarTienda();
  actualizarPartida();
}

function iniciarPartida(): void {
  if (temporizador !== undefined) window.clearInterval(temporizador);
  reiniciarPartida(estado, Date.now() >>> 0);
  generarPareja(estado);
  pantalla = 'juego';
  renderizar();
  temporizador = window.setInterval(avanzarPartida, CONFIG.INTERVALO_CAIDA);
}

function accionar(direccion: Direccion): void {
  if (moverFichas(estado, direccion)) actualizarPartida();
}

function avanzarPartida(): void {
  if (!estado || estado.estado !== 'en_curso') {
    if (temporizador !== undefined) window.clearInterval(temporizador);
    temporizador = undefined;
    return;
  }

  const ambarAnterior = estado.ambar;
  const ultimoIdAnterior = estado.siguienteId;
  avanzarPulso(estado);
  if (estado.estado === 'en_curso' && estado.entidades.length < CONFIG.MAXIMO_ENTIDADES - 1) generarPareja(estado);
  if (estado.ambar !== ambarAnterior) guardarProgreso();
  if (estado.siguienteId !== ultimoIdAnterior || estado.ambar !== ambarAnterior) actualizarTienda();
  actualizarPartida();
}

raiz.addEventListener('click', (evento) => {
  if (!(evento.target instanceof Element)) return;
  const boton = evento.target.closest<HTMLButtonElement>('button');
  if (!boton) return;

  if (boton.dataset.accion === 'iniciar' || boton.dataset.accion === 'reiniciar') {
    iniciarPartida();
    return;
  }

  if (boton.dataset.aspecto) {
    const aspecto = boton.dataset.aspecto as AspectoFicha;
    const desbloqueado = estado.aspectosDesbloqueados.includes(aspecto);
    const cambioValido = desbloqueado
      ? seleccionarAspecto(estado, aspecto)
      : comprarAspecto(estado, aspecto);
    if (cambioValido) {
      guardarProgreso();
      actualizarTienda();
      actualizarPartida();
    }
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
  if (pantalla !== 'juego' || estado.estado !== 'en_curso') return;
  const tecla = evento.key.toLowerCase();
  if (tecla === 'arrowleft' || tecla === 'a') {
    evento.preventDefault();
    accionar(-1);
  } else if (tecla === 'arrowright' || tecla === 'd') {
    evento.preventDefault();
    accionar(1);
  }
});

cargarProgreso();
renderizar();
