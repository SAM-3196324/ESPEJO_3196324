import { describe, expect, it } from "vitest";
import {
  agregarEntidad,
  avanzarPulso,
  crearEstadoInicial,
  moverFichas,
  CONFIG,
} from "../src/logica";

describe("Reglas de ESPEJO", () => {
  it("debe inicializar correctamente el estado del juego con las fichas centradas, modo espejo horizontal y puntuacion en cero", () => {
    const estado = crearEstadoInicial(123);
    const carrilCentral = Math.floor(CONFIG.CARRILES / 2);

    expect(estado.fichaNormal.carril).toBe(carrilCentral);
    expect(estado.fichaReflejo.carril).toBe(carrilCentral);
    expect(estado.fichaNormal.fila).toBe(CONFIG.FILA_INICIAL_JUGADOR);
    expect(estado.fichaReflejo.fila).toBe(CONFIG.FILA_INICIAL_JUGADOR);
    expect(estado.fase).toBe("horizontal");
    expect(estado.puntuacion).toBe(0);
    expect(estado.multiplicadorCombo).toBe(1);
  });

  it("debe ejecutar movimientos validos alterando las posiciones de ambas fichas en direcciones opuestas", () => {
    const estado = crearEstadoInicial(123);

    expect(moverFichas(estado, -1)).toBe(true);
    expect(estado.fichaNormal.carril).toBe(1);
    expect(estado.fichaReflejo.carril).toBe(3);
  });

  it("debe rechazar movimientos fuera de los limites del tablero o cuando el juego ha terminado", () => {
    const estado = crearEstadoInicial(123);
    estado.fichaNormal.carril = 0;
    estado.fichaReflejo.carril = CONFIG.CARRILES - 1;

    expect(moverFichas(estado, -1)).toBe(false);
    expect(estado.fichaNormal.carril).toBe(0);
    expect(estado.fichaReflejo.carril).toBe(CONFIG.CARRILES - 1);

    estado.estado = "derrota";
    expect(moverFichas(estado, 1)).toBe(false);
  });

  it("debe evaluar la condicion de derrota por colision contra obstaculo y la condicion de victoria al alcanzar el puntaje objetivo", () => {
    const estadoDerrota = crearEstadoInicial(123);
    expect(agregarEntidad(estadoDerrota, {
      matriz: "normal",
      carril: estadoDerrota.fichaNormal.carril,
      fila: estadoDerrota.fichaNormal.fila - 1,
      clase: "obstaculo",
    })).toBe(true);

    expect(avanzarPulso(estadoDerrota)).toBe(true);
    expect(estadoDerrota.estado).toBe("derrota");
    expect(estadoDerrota.impactos).toBe(1);

    const estadoVictoria = crearEstadoInicial(123);
    estadoVictoria.puntuacion = CONFIG.PUNTUACION_META - CONFIG.PUNTOS_GEMA;
    expect(agregarEntidad(estadoVictoria, {
      matriz: "normal",
      carril: estadoVictoria.fichaNormal.carril,
      fila: estadoVictoria.fichaNormal.fila - 1,
      clase: "gema",
    })).toBe(true);

    expect(avanzarPulso(estadoVictoria)).toBe(true);
    expect(estadoVictoria.estado).toBe("victoria");
    expect(estadoVictoria.puntuacion).toBeGreaterThanOrEqual(CONFIG.PUNTUACION_META);
  });

  it("debe simular una partida completa desde el inicio, avanzando pasos, acumulando combo de sincronia, transitando las fases de espejo y alcanzando la victoria", () => {
    const estado = crearEstadoInicial(123);
    const fasesObservadas = new Set([estado.fase]);

    expect(moverFichas(estado, -1)).toBe(true);
    fasesObservadas.add(estado.fase);

    for (let paso = 0; paso < 100 && estado.estado === "en_curso"; paso += 1) {
      expect(agregarEntidad(estado, {
        matriz: "normal",
        carril: estado.fichaNormal.carril,
        fila: estado.fichaNormal.fila - 1,
        clase: "gema",
      })).toBe(true);
      expect(agregarEntidad(estado, {
        matriz: "reflejo",
        carril: estado.fichaReflejo.carril,
        fila: estado.fichaReflejo.fila - 1,
        clase: "gema",
      })).toBe(true);

      expect(avanzarPulso(estado)).toBe(true);
      fasesObservadas.add(estado.fase);
    }

    expect(estado.estado).toBe("victoria");
    expect(estado.puntuacion).toBeGreaterThanOrEqual(CONFIG.PUNTUACION_META);
    expect(estado.multiplicadorCombo).toBe(CONFIG.COMBO_MAXIMO);
    expect(fasesObservadas).toEqual(new Set(["horizontal", "vertical", "cruzada"]));
  });
});