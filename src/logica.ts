/** Reglas puras de ESPEJO: Reflejo Invertido. No depende de la interfaz. */

export const CONFIG = {
  CARRILES: 5, // [carriles] columnas por cada matriz
  FILAS: 10, // [filas] filas por cada matriz
  FILA_INICIAL_JUGADOR: 9, // [filas] fila inicial de las fichas
  PUNTUACION_META: 1200, // [puntos] puntuacion para completar la partida
  UMBRAL_FASE_VERTICAL: 400, // [puntos] puntuacion que activa la fase vertical
  UMBRAL_FASE_CRUZADA: 800, // [puntos] puntuacion que activa la fase cruzada
  PUNTOS_ESQUIVA: 25, // [puntos] recompensa base por obstaculo esquivado
  PUNTOS_GEMA: 50, // [puntos] recompensa base por gema recolectada
  COMBO_MINIMO: 1, // [multiplicador] combo inicial
  COMBO_MAXIMO: 5, // [multiplicador] limite del combo
  PASOS_PARA_COMBO: 2, // [acciones] acciones sincronizadas necesarias por nivel de combo
  INTERVALO_CAIDA: 550, // [ms] intervalo visual sugerido entre descensos
  PROBABILIDAD_GEMA: 0.28, // [probabilidad] posibilidad de que un elemento sea gema
  MAXIMO_ENTIDADES: 16, // [entidades] limite simultaneo de entidades del tablero
} as const;

export type Direccion = -1 | 1;
export type FaseInversion = "horizontal" | "vertical" | "cruzada";
export type ClaseEntidad = "obstaculo" | "gema";
export type EstadoPartida = "en_curso" | "victoria" | "derrota";

export interface Posicion {
  carril: number;
  fila: number;
}

export interface Ficha extends Posicion {
  matriz: "normal" | "reflejo";
}

export interface EntidadTablero extends Posicion {
  id: number;
  matriz: "normal" | "reflejo";
  clase: ClaseEntidad;
}

export interface GeneradorPseudoaleatorio {
  semilla: number;
  siguiente: () => number;
  entero: (minimo: number, maximo: number) => number;
}

export interface EstadoJuego {
  estado: EstadoPartida;
  puntuacion: number;
  record: number;
  multiplicadorCombo: number;
  accionesSincronizadas: number;
  fase: FaseInversion;
  fichaNormal: Ficha;
  fichaReflejo: Ficha;
  entidades: EntidadTablero[];
  semilla: number;
  siguienteId: number;
  esquivas: number;
  gemasRecolectadas: number;
  impactos: number;
}

/** Generador Mulberry32: misma semilla, misma secuencia en toda plataforma JS. */
export function crearPRNG(semillaInicial: number): GeneradorPseudoaleatorio {
  let estado = semillaInicial >>> 0;
  const siguiente = (): number => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let mezcla = estado;
    mezcla = Math.imul(mezcla ^ (mezcla >>> 15), mezcla | 1);
    mezcla ^= mezcla + Math.imul(mezcla ^ (mezcla >>> 7), mezcla | 61);
    return ((mezcla ^ (mezcla >>> 14)) >>> 0) / 4294967296;
  };
  return {
    semilla: semillaInicial >>> 0,
    siguiente,
    entero: (minimo: number, maximo: number): number =>
      minimo + Math.floor(siguiente() * (maximo - minimo + 1)),
  };
}

export function crearEstadoInicial(semilla: number, record = 0): EstadoJuego {
  const carrilCentral = Math.floor(CONFIG.CARRILES / 2);
  return {
    estado: "en_curso",
    puntuacion: 0,
    record: Math.max(0, record),
    multiplicadorCombo: CONFIG.COMBO_MINIMO,
    accionesSincronizadas: 0,
    fase: "horizontal",
    fichaNormal: { matriz: "normal", carril: carrilCentral, fila: CONFIG.FILA_INICIAL_JUGADOR },
    fichaReflejo: { matriz: "reflejo", carril: carrilCentral, fila: CONFIG.FILA_INICIAL_JUGADOR },
    entidades: [],
    semilla: semilla >>> 0,
    siguienteId: 1,
    esquivas: 0,
    gemasRecolectadas: 0,
    impactos: 0,
  };
}

export function obtenerFase(puntuacion: number): FaseInversion {
  if (puntuacion >= CONFIG.UMBRAL_FASE_CRUZADA) return "cruzada";
  if (puntuacion >= CONFIG.UMBRAL_FASE_VERTICAL) return "vertical";
  return "horizontal";
}

/** Indica la direccion aplicada al reflejo para la fase actual. */
export function direccionReflejada(direccion: Direccion, fase: FaseInversion): Direccion {
  return fase === "vertical" ? direccion : (direccion * -1) as Direccion;
}

function esCarrilValido(carril: number): boolean {
  return Number.isInteger(carril) && carril >= 0 && carril < CONFIG.CARRILES;
}

function sumaPuntos(estado: EstadoJuego, base: number): boolean {
  estado.puntuacion += base * estado.multiplicadorCombo;
  estado.record = Math.max(estado.record, estado.puntuacion);
  estado.fase = obtenerFase(estado.puntuacion);
  if (estado.puntuacion >= CONFIG.PUNTUACION_META) estado.estado = "victoria";
  return true;
}

function registrarSincronia(estado: EstadoJuego): boolean {
  estado.accionesSincronizadas += 1;
  if (
    estado.accionesSincronizadas % CONFIG.PASOS_PARA_COMBO === 0 &&
    estado.multiplicadorCombo < CONFIG.COMBO_MAXIMO
  ) estado.multiplicadorCombo += 1;
  return true;
}

/** Mueve las fichas en direcciones opuestas o segun la distorsion de fase. */
export function moverFichas(estado: EstadoJuego, direccion: Direccion): boolean {
  if (estado.estado !== "en_curso" || (direccion !== -1 && direccion !== 1)) return false;
  const siguienteNormal = estado.fichaNormal.carril + direccion;
  const siguienteReflejo = estado.fichaReflejo.carril + direccionReflejada(direccion, estado.fase);
  if (!esCarrilValido(siguienteNormal) || !esCarrilValido(siguienteReflejo)) return false;
  estado.fichaNormal.carril = siguienteNormal;
  estado.fichaReflejo.carril = siguienteReflejo;
  return true;
}

/** Inserta una entidad. Rechaza posiciones invalidas o el limite de entidades. */
export function agregarEntidad(estado: EstadoJuego, entidad: Omit<EntidadTablero, "id">): boolean {
  if (
    estado.estado !== "en_curso" ||
    estado.entidades.length >= CONFIG.MAXIMO_ENTIDADES ||
    !esCarrilValido(entidad.carril) ||
    !Number.isInteger(entidad.fila) || entidad.fila < 0 || entidad.fila >= CONFIG.FILAS
  ) return false;
  estado.entidades.push({ ...entidad, id: estado.siguienteId++ });
  return true;
}

/** Crea una pareja simetrica determinista de obstaculos o gemas en la fila superior. */
export function generarPareja(estado: EstadoJuego): boolean {
  if (estado.estado !== "en_curso" || estado.entidades.length > CONFIG.MAXIMO_ENTIDADES - 2) return false;
  const prng = crearPRNG(estado.semilla);
  const carril = prng.entero(0, CONFIG.CARRILES - 1);
  const clase: ClaseEntidad = prng.siguiente() < CONFIG.PROBABILIDAD_GEMA ? "gema" : "obstaculo";
  estado.semilla = prng.entero(0, 0xffffffff);
  const espejo = CONFIG.CARRILES - 1 - carril;
  const primera = agregarEntidad(estado, { matriz: "normal", carril, fila: 0, clase });
  const segunda = agregarEntidad(estado, { matriz: "reflejo", carril: espejo, fila: 0, clase });
  return primera && segunda;
}

function coincide(entidad: EntidadTablero, ficha: Ficha): boolean {
  return entidad.matriz === ficha.matriz && entidad.carril === ficha.carril && entidad.fila === ficha.fila;
}

/** Desciende entidades, resuelve colisiones, gemas y esquivas de un pulso. */
export function avanzarPulso(estado: EstadoJuego): boolean {
  if (estado.estado !== "en_curso") return false;
  let huboCambio = false;
  const restantes: EntidadTablero[] = [];
  const descendidas = estado.entidades.map((entidad) => ({ ...entidad, fila: entidad.fila + 1 }));
  const hayImpacto = descendidas.some((entidad) => {
    const ficha = entidad.matriz === "normal" ? estado.fichaNormal : estado.fichaReflejo;
    return entidad.clase === "obstaculo" && coincide(entidad, ficha);
  });
  if (hayImpacto) {
    estado.impactos = 1;
    estado.estado = "derrota";
    return true;
  }
  for (const descendida of descendidas) {
    if (estado.estado !== "en_curso") {
      if (descendida.fila < CONFIG.FILAS) restantes.push(descendida);
      continue;
    }
    const ficha = descendida.matriz === "normal" ? estado.fichaNormal : estado.fichaReflejo;
    if (coincide(descendida, ficha)) {
      huboCambio = true;
      estado.gemasRecolectadas += 1;
      registrarSincronia(estado);
      sumaPuntos(estado, CONFIG.PUNTOS_GEMA);
      continue;
    }
    if (descendida.fila >= CONFIG.FILAS) {
      huboCambio = true;
      if (descendida.clase === "obstaculo") {
        estado.esquivas += 1;
        registrarSincronia(estado);
        sumaPuntos(estado, CONFIG.PUNTOS_ESQUIVA);
      }
      continue;
    }
    if (descendida.fila !== entidad.fila) huboCambio = true;
    restantes.push(descendida);
  }
  estado.entidades = restantes;
  return huboCambio;
}

/** Reinicia una partida conservando el record indicado. */
export function reiniciarPartida(destino: EstadoJuego, semilla: number): boolean {
  const record = destino.record;
  const reiniciado = crearEstadoInicial(semilla, record);
  Object.assign(destino, reiniciado);
  return true;
}

export function obtenerResumen(estado: EstadoJuego): Readonly<Record<string, number | string>> {
  return {
    estado: estado.estado,
    puntuacion: estado.puntuacion,
    record: estado.record,
    multiplicador: estado.multiplicadorCombo,
    fase: estado.fase,
    esquivas: estado.esquivas,
    gemas: estado.gemasRecolectadas,
    impactos: estado.impactos,
  };
}
