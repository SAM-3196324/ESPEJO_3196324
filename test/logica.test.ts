import { describe, expect, it } from "vitest";
import {
  agregarEntidad,
  avanzarPulso,
  comprarAspecto,
  crearEstadoInicial,
  moverFichas,
  reiniciarPartida,
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

  it("debe registrar los impactos, romper el combo y mantener la partida activa tras un choque", () => {
    const estado = crearEstadoInicial(123);
    estado.multiplicadorCombo = 4;
    expect(agregarEntidad(estado, {
      matriz: "normal",
      carril: estado.fichaNormal.carril,
      fila: estado.fichaNormal.fila - 1,
      clase: "obstaculo",
    })).toBe(true);

    expect(avanzarPulso(estado)).toBe(true);
    expect(estado.estado).toBe("en_curso");
    expect(estado.impactos).toBe(1);
    expect(estado.multiplicadorCombo).toBe(CONFIG.COMBO_MINIMO);
    expect(estado.entidades).toHaveLength(0);
  });

  it("debe permitir una partida infinita que supera la meta y transita las tres fases", () => {
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

    expect(estado.estado).toBe("en_curso");
    expect(estado.puntuacion).toBeGreaterThanOrEqual(CONFIG.PUNTUACION_META);
    expect(estado.multiplicadorCombo).toBe(CONFIG.COMBO_MAXIMO);
    expect(fasesObservadas).toEqual(new Set(["horizontal", "vertical", "cruzada"]));
  });

  it("debe comprar aspectos con ambar y conservar las compras al reiniciar", () => {
    const estado = crearEstadoInicial(123);
    estado.ambar = CONFIG.PRECIO_ASPECTO_SOLAR;

    expect(comprarAspecto(estado, "solar")).toBe(true);
    expect(estado.aspecto).toBe("solar");
    expect(estado.ambar).toBe(0);
    expect(reiniciarPartida(estado, 456)).toBe(true);
    expect(estado.aspecto).toBe("solar");
    expect(estado.aspectosDesbloqueados).toContain("solar");
    expect(estado.ambar).toBe(0);
  });

  it("debe otorgar ambar al recolectar una gema y al esquivar un obstaculo", () => {
    const estadoGema = crearEstadoInicial(123);
    expect(agregarEntidad(estadoGema, {
      matriz: "normal",
      carril: estadoGema.fichaNormal.carril,
      fila: estadoGema.fichaNormal.fila - 1,
      clase: "gema",
    })).toBe(true);
    expect(avanzarPulso(estadoGema)).toBe(true);
    expect(estadoGema.ambar).toBe(CONFIG.AMBAR_POR_GEMA);

    const estadoEsquiva = crearEstadoInicial(456);
    expect(agregarEntidad(estadoEsquiva, {
      matriz: "normal",
      carril: 0,
      fila: CONFIG.FILAS - 1,
      clase: "obstaculo",
    })).toBe(true);
    expect(avanzarPulso(estadoEsquiva)).toBe(true);
    expect(estadoEsquiva.ambar).toBe(CONFIG.AMBAR_POR_ESQUIVA);
  });
});