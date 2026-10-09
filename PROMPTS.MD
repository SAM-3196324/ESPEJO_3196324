## PROMPT P1 - ARRANGEMENT & LÓGICA PURA
**Bloque 1** | *Misión 29: ESPEJO*

### Texto del Prompt enviado:
> [Creá el archivo src/logica.ts con las reglas completas de ESPEJO: Reflejo Invertido (Temática Cyber-Sincronía Rúnica de Alto Contraste), según la ficha técnica detallada abajo.
REGLAS TÉCNICAS OBLIGATORIAS:
•	Lenguaje: TypeScript estricto. Exportá todos los tipos de datos e interfaces necesarios.
•	Exportá un objeto global CONFIG arriba del todo con todas las constantes numéricas del juego. Cada propiedad DEBE incluir un comentario indicando explícitamente su unidad de medida (ej. [carriles], [filas], [ms], [puntos], [multiplicador]).
•	LÓGICA PURA Y AISLADA: Este archivo NO puede interactuar con el DOM o el navegador. Prohibido usar document, window, alert o console.log. Solo manejo de estructuras de datos y funciones puras sobre el estado.
•	Retorno de funciones: Toda función que intente modificar el estado del juego debe devolver un boolean (true si la acción/movimiento fue válido y modificó el estado; false si no se pudo realizar o fue inválido).
•	Generador de azar determinista: Crea y exporta una función PRNG (Pseudo-Random Number Generator) basada en semilla numérica, de modo que la misma semilla genere exactamente la misma secuencia de obstáculos y gemas.
•	Idioma: Código, nombres de variables, tipos y comentarios redactados 100% en español.
MEJORA SIGNIFICATIVA INTEGRADA (Para puntos extra):
1.	Sistema de Inversión Dinámica de Espejo: El estado debe incluir tres fases de distorsión del reflejo que cambian automáticamente según la puntuación acumulada:
o	FASE 1: HORIZONTAL (El reflejo se invierte solo de izquierda a derecha).
o	FASE 2: VERTICAL (El reflejo mantiene eje horizontal pero invierte la dirección de entrada).
o	FASE 3: CRUZADA (Inversión dinámica total de ambos ejes).
2.	Combo de Sincronía: Un multiplicador de puntos (1x hasta 5x) que se incrementa al realizar esquivas consecutivas o recolectar Gemas de Sincronía sin chocar.
FICHA COMPLETA DEL PROYECTO:
•	NOMBRE DEL PROYECTO: ESPEJO: Reflejo Invertido
•	EN UNA FRASE: Un arcade de precisión donde controlas dos entidades simultáneas en carriles paralelos con mandos unificados, pero una ejecuta el movimiento reflejado de forma invertida.
•	PARA QUIÉN ES: Para Mateo, un estudiante de 17 años que busca poner a prueba sus reflejos y coordinación espacial en partidas intensas.
•	QUÉ LOGRA: Coordinar la evasión de bloques de fallo en dos matrices paralelas mientras se recolectan Gemas de Sincronía Rúnica para maximizar el combo.
•	LOS TRES VERBOS:
1.	Mover (Izquierda / Derecha)
2.	Esquivar (Obstáculos rojos)
3.	Recolectar (Gemas rúnicas ámbar)
•	TERMINA BIEN SI…: El jugador supera las 3 fases de inversión, alcanza la meta de puntos de sincronía objetivo (1200 pts) y establece un récord sin destruir el reflejo.
•	TERMINA MAL SI…: Cualquiera de las dos fichas (la entidad Normal o el Reflejo) colisiona contra un obstáculo rojo (Game Over instantáneo de 1 solo impacto).
•	QUÉ SE VE EN PANTALLA:
o	Tablero dividido en dos cuadrículas paralelas de 5x10.
o	Ficha Normal (Cian #22d3ee) en el carril izquierdo.
o	Ficha Reflejo (Rosa/Magenta #f472b6) en el carril derecho.
o	Obstáculos en caída (Rojo #f87171) y Gemas Rúnicas (Ámbar #fbbf24).
o	Marcador superior con Puntuación, Multiplicador de Combo activo y Fase de Inversión actual.
•	CONTROLES:
o	Teclado: Flecha Izquierda / Flecha Derecha (o teclas A / D).
o	Táctil: Botones gigantes flotantes (← IZQUIERDA | DERECHA →) adaptados para dedo.
•	PALETA Y SIGNIFICADO:
o	Cian (#22d3ee): Jugador A (Matriz Normal).
o	Rosa/Magenta (#f472b6): Reflejo B (Matriz Invertida).
o	Rojo (#f87171): Entidades nocivas de colisión.
o	Ámbar (#fbbf24): Gemas Rúnicas, puntos de combo y estado récord.
•	CRITERIO DE ACEPTACIÓN: Abro la app, inicio la partida, desplazo ambas fichas en sentido opuesto con los mandos, esquivo bloques rojos acumulando combo con gemas ámbar, supero las transiciones de fase de espejo y al colisionar observo la pantalla de Game Over con resumen de métricas.
•	LO QUE NO VA: Sin motores 3D, sin imágenes/sprites externos, sin barra de salud ni vidas múltiples, sin librerías externas de física.
REGLAS DE TRABAJO Y ENTREGA:
•	Hacé exactamente lo que especifica la ficha y el prompt.
•	Al finalizar el código, incluye una lista textual con:
a) Lo que decidiste dejar fuera del alcance a propósito.
b) Las decisiones técnicas que tomaste en aquellos puntos donde la ficha no especificaba valores numéricos concretos.
que sea un html dentro de la carpeta de "ESPEJO_3196324" ahi crea todo lo que tienes que crear]

### Resultado del Agente:
El agente creó `src/logica.ts` definiendo las interfaces `Posicion`, `Entidad`, `EstadoJuego`, la constante `CONFIG` con comentarios de unidad, el PRNG determinista `generarAleatorio` y las funciones puras `crearEstadoInicial`, `moverJugador`, `avanzarPaso` y `reiniciarJuego`. Se probó la compilación con `npx tsc --noEmit` sin errores.

## PROMPT P2 - PRUEBAS AUTOMATIZADAS (VITEST)
**Bloque 2** | *Fecha: 09 de Octubre, 2026*

### Texto del Prompt enviado:
> [Escribí el conjunto de pruebas unitarias automatizadas con Vitest para src/logica.ts en el archivo test/logica.test.ts para el proyecto ESPEJO: Reflejo Invertido.

REGLAS TÉCNICAS OBLIGATORIAS:
- Usá Vitest (`import { describe, it, expect } from 'vitest'`).
- Importá las funciones y constantes necesarias desde `../src/logica`.
- PROHIBIDO MODIFICAR `src/logica.ts`. Solo se evalúa la lógica existente.
- Los nombres de las pruebas deben redactarse 100% en español, como frases completas y descriptivas.
- Cada prueba debe ser independiente y usar semillas de azar deterministas cuando sea necesario.

COBERTA DE PRUEBAS OBLIGATORIA (Mínimo 5 pruebas estructuradas):

1. ESTADO INICIAL:
   - Nombre: "debe inicializar correctamente el estado del juego con las fichas centradas, modo espejo horizontal y puntuacion en cero"
   - Debe comprobar que las posiciones iniciales de la ficha Normal y Reflejo están en el carril central, la puntuación es 0, el multiplicador es 1x y el estado está en ejecución.

2. ACCIONES VÁLIDAS Y REFLEJO INVERTIDO:
   - Nombre: "debe ejecutar movimientos validos alterando las posiciones de ambas fichas en direcciones opuestas"
   - Debe probar que mover a la IZQUIERDA mueve la ficha Normal a la izquierda (-1) y la ficha Reflejo a la derecha (+1) en modo HORIZONTAL, devolviendo `true`.

3. ACCIONES PROHIBIDAS Y LÍMITES:
   - Nombre: "debe rechazar movimientos fuera de los limites del tablero o cuando el juego ha terminado"
   - Debe intentar mover la ficha fuera del carril 0 o carril (CONFIG.ANCHO_CARRILES - 1) verificando que devuelva `false`, y asegurar que no se permitan movimientos si `enEjecucion` es `false`.

4. CONDICIONES DE DERROTA Y VICTORIA (Condiciones límite de la ficha):
   - Nombre: "debe evaluar la condicion de derrota por colision contra obstaculo y la condicion de victoria al alcanzar el puntaje objetivo"
   - Debe comprobar que posicionar una ficha en la misma celda que un 'OBSTACULO' activa `derrota = true` y `enEjecucion = false`.
   - Debe comprobar que al acumular la puntuación igual o mayor a `CONFIG.PUNTOS_VICTORIA_OBJETIVO` se activa `victoria = true`.

5. PRUEBA DE RECORRIDO COMPLETO DE PRINCIPIO A FIN (Prueba de integración de diseño):
   - Nombre: "debe simular una partida completa desde el inicio, avanzando pasos, acumulando combo de sincronia, transitando las fases de espejo y alcanzando la victoria"
   - Debe ejecutar un bucle de avance (`avanzarPaso` y `moverJugador`) esquivando obstáculos, verificando que el multiplicador de combo aumente, que el modo espejo evolucione de HORIZONTAL a VERTICAL y luego a CRUZADO según la puntuación, y termine con `victoria = true` comprobando que el final bueno es matemáticamente alcanzable.

AL TERMINAR:
- Corré `npm test` en la terminal integrada y mostrame los resultados comprobando que todas las pruebas pasen en verde (PASS).

### Resultado del Agente:
El agente creó el archivo `test/logica.test.ts` con 5 pruebas unitarias completas que evalúan la inicialización, movimientos invertidos, restricciones de límites, colisiones de derrota, acumulación de combo y la simulación del recorrido completo hasta la victoria.

### Resultado de la Terminal (`npm test`):
- `test/logica.test.ts` (5 passed)
- Test Files: 1 passed (1)
- Tests: 5 passed (5)
- Estado: TODAS LAS PRUEBAS EN VERDE.

## PROMPT P3 - INTERFAZ VISUAL Y RENDERIZADO
**Bloque 3** | *Fecha: 09 de Octubre, 2026*

### Texto del Prompt enviado:
> [Creá los archivos src/main.ts y src/estilo.css, y actualizá index.html para la interfaz visual del juego ESPEJO: Reflejo Invertido (Estilo Cyber-Sincronía Rúnica de Alto Contraste).

REGLAS TÉCNICAS Y ARQUITECTURA (OBLIGATORIAS):
- SEPARACIÓN ABSOLUTA DE RESPONSABILIDADES: `src/main.ts` NO decide nada de las reglas ni del estado del juego. Únicamente llama a las funciones de `src/logica.ts`, gestiona los eventos de entrada (teclado/botones) y renderiza la interfaz según el objeto de estado recibido.
- Si detectás la necesidad de escribir una regla del juego en `main.ts`, NO la escribas; indicalo explícitamente en lugar de hacerlo.
- Importá el CSS desde main.ts en la primera línea: `import './estilo.css';`
- Sin imágenes externas, sin sprites de archivo, sin librerías de UI o animación externas. Todo se dibuja usando HTML5, SVG dinámico ligero o CSS Flexbox/Grid.

REQUISITOS VISUALES Y TRES ESTADOS DE LA PANTALLA:
1. PANTALLA DE INICIO (Inicio):
   - Título del juego en tipografía llamativa: "ESPEJO: Reflejo Invertido".
   - Subtítulo de ambientación: "Coordinación Dual Cyber-Rúnica".
   - Breve explicación gráfica de controles (Teclas A/D, Flechas o Toque en pantalla).
   - Botón gigante de inicio: "INICIAR SINCRONÍA" (mínimo 44px de alto/ancho para toque táctil).

2. PANTALLA DE JUEGO ACTIVO (Uso Normal):
   - MARCADOR SUPERIOR (HUD):
     * Puntuación actual (resaltada en verde/cian).
     * Multiplicador de Combo de Sincronía activo (ej. "COMBO x3", en color Ámbar #fbbf24).
     * Indicador de Fase de Espejo activa: HORIZONTAL, VERTICAL o CRUZADO (con insignia distintiva).
   - TABLERO DIVIDIDO EN DOS MATRICES (Dual Grid de 5x10):
     * Lado Izquierdo (Matriz Normal - Borde Cian #22d3ee): Muestra la Ficha Normal (Cian) navegando sobre los carriles.
     * Lado Derecho (Matriz Reflejo - Borde Rosa #f472b6): Muestra la Ficha Reflejo (Rosa/Magenta) moviéndose en sentido invertido.
     * Representación de Entidades: Obstáculos (Rojo #f87171) y Gemas Rúnicas (Ámbar #fbbf24).

3. PANTALLA DE RESULTADOS (Final / Game Over o Victoria):
   - Encabezado claro: "SINCRONÍA ROTA" (Derrota) o "SINCRONÍA PERFECTA" (Victoria).
   - Resumen de métricas alcanzadas: Puntuación Final, Máximo Combo logrado y Fase de Espejo máxima alcanzada.
   - Botón destacado de reinicio: "REINICIAR ESPEJO".

ESTILO CSS (`src/estilo.css`) Y ACCESIBILIDAD:
- Fondo oscuro Cyber (#0a0e17) con rejillas sutiles en neón.
- Paleta según Ficha Técnica: Cian (#22d3ee), Rosa/Magenta (#f472b6), Rojo (#f87171), Ámbar (#fbbf24).
- Tipografía y legibilidad: Texto general nunca menor a 16px. Contraste alto estricto.

ESTRUCTURA DE `index.html`:
- Debe contener un elemento raíz `<div id="app"></div>`.
- Debe incluir la etiqueta meta viewport adecuada.
- Debe cargar `src/main.ts` como módulo TypeScript (`<script type="module" src="/src/main.ts"></script>`).

AL TERMINAR:
- Confirmame que el juego renderiza correctamente en el navegador y que la consola de desarrollo no presenta errores ni advertencias.]

### Resultado del Agente:
El agente configuró `index.html`, creó `src/estilo.css` con diseño neón Cyber-Rúnico de alto contraste y construyó `src/main.ts` importando `src/logica.ts`. La interfaz implementa los 3 estados (Inicio, Juego Activo con HUD/Grilla Dual y Pantalla Final) sin violar la arquitectura limpia.

### Verificación:
- Compilación limpia con `npx tsc --noEmit`.
- Sin errores en la consola del navegador.
- Renderizado correcto del HUD (Puntos, Combo xN y Fase de Espejo).

## PROMPT P4 - ADAPTABILIDAD MÓVIL Y CONTROLES TÁCTILES
**Bloque 3** | *Fecha: 09 de Octubre, 2026*

### Texto del Prompt enviado:
> [Optimizá los archivos src/main.ts, src/estilo.css e index.html para garantizar el soporte táctil y la experiencia móvil del juego ESPEJO: Reflejo Invertido, cumpliendo estrictamente con las 4 condiciones de diseño responsive de la guía.

REGLAS TÉCNICAS Y REQUISITOS OBLIGATORIOS DE MOVILIDAD:

1. ÁREAS TÁCTILES MÍNIMAS DE 44px (Touch Targets):
   - Todos los elementos interactivos o tocables (botones gigantes de dirección "← IZQUIERDA" y "DERECHA →", botón "INICIAR SINCRONÍA", "REINICIAR ESPEJO") deben tener dimensiones mínimas estrictas de 44px x 44px.
   - Aplica `user-select: none;` y `-webkit-tap-highlight-color: transparent;` en CSS para evitar selecciones accidentales de texto o sombreados azules al tocar rápidamente con los dedos.

2. CERO DESPLAZAMIENTO HORIZONTAL (Zero Horizontal Scroll):
   - Todo el contenido del juego (HUD, las dos matrices de 5x10 y la botonera) debe encajar al 100% dentro del ancho del viewport en cualquier dispositivo móvil vertical.
   - Aplica `max-width: 100vw;`, `box-sizing: border-box;` y `overflow-x: hidden;` en el contenedor principal `#app`.
   - La vista dividida (Matriz Normal a la izquierda / Matriz Reflejo a la derecha) debe adaptarse dinámicamente usando CSS Flexbox o Grid con unidades fluidas (`gap` responsivo, celdas proporcionales).

3. TAMAÑO MÍNIMO DE FUENTE DE 16px:
   - Ningún texto en pantalla (HUD, etiquetas, botones, instrucciones o modal de resultados) puede tener un `font-size` menor a 16px para asegurar lectura sin zoom.

4. CONTROLES DUALES SIMULTÁNEOS (Toque + Teclado):
   - Mantén y verifica el soporte de teclado en PC (Flechas Izquierda/Derecha y teclas A/D).
   - Añade eventos táctiles optimizados (`pointerdown` o `touchstart`) a los botones flotantes móviles para respuesta inmediata sin el retraso de 300ms de los eventos `click` móviles tradicionales.

5. VERIFICACIÓN DE ETIQUETA VIEWPORT EN index.html:
   - Asegúrate de que `index.html` contenga exactamente:
     `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />`

RESTRICCIÓN CLAVE:
- PROHIBIDO modificar la dificultad, los números de `CONFIG` o las reglas de `src/logica.ts`.
- Al finalizar, enumerá detalladamente en tu respuesta los ajustes específicos realizados en CSS y eventos de JavaScript.]

### Resultado del Agente:
El agente ajustó `src/estilo.css` garantizando botones táctiles con dimensiones superiores a 44px, tipografía mínima de 16px y `overflow-x: hidden`. Se optimizó `src/main.ts` añadiendo manejo de eventos `pointerdown` en los controles táctiles sin alterar la lógica de `src/logica.ts`.

### Lista de Ajustes Realizados:
1. **Viewport**: Confirmada etiqueta meta responsive en `index.html`.
2. **Botones Táctiles**: Creados dos controles flotantes gigantes (`←` y `→`) de 56px de alto.
3. **Escala**: Rejilla dual adaptada con CSS Grid responsivo que evita desbordamiento horizontal.
4. **Tipografía**: Texto base ajustado a 16px y encabezados a 20px+.


## PROMPT P5 - AUDITORÍA Y REVISIÓN DE CÓDIGO
**Bloque 4** | *Fecha: 09 de Octubre, 2026*

### Texto del Prompt enviado:
> [Realizá una auditoría estricta de todo el código fuente del proyecto ESPEJO: Reflejo Invertido (`src/logica.ts`, `src/main.ts`, `test/logica.test.ts`, `src/estilo.css` e `index.html`) analizando la presencia de los siguientes seis problemas críticos.

REGLA DE ORO DE ESTE PROMPT:
- ÚNICAMENTE genera el informe de diagnóstico numerado indicando archivo y número de línea.
- PROHIBIDO MODIFICAR O REESCRIBIR CÓDIGO EN ESTA RESPUESTA. No apliques ninguna corrección todavía.

LOS SEIS PROBLEMAS A AUDITAR:

1. LÓGICA ACOPLADA EN LA VISTA:
   - ¿Existe alguna regla de juego, cálculo de puntuación, lógica de movimiento o validación de colisión metida dentro de `src/main.ts` en lugar de estar encapsulada en `src/logica.ts`? Indicar archivo y línea exactos.

2. NÚMEROS MÁGICOS/SUELTOS:
   - ¿Hay constantes numéricas sueltas (coordenadas, dimensiones, puntos, tiempos en ms, multiplicadores) fuera del objeto `CONFIG` exportado en `src/logica.ts`? Indicar archivo y línea.

3. ALCANZABILIDAD MATEMÁTICA DE LA VICTORIA:
   - Analizá los valores numéricos reales de `CONFIG` (puntos por paso, frecuencia de gemas, multiplicador de combo máximo, meta de victoria). ¿Es matemáticamente posible alcanzar `CONFIG.PUNTOS_VICTORIA_OBJETIVO` antes de que la velocidad o la densidad de obstáculos vuelva el juego humanamente imposible? Mostrá el cálculo paso a paso.

4. REINICIO DE ESTADO INCOMPLETO:
   - ¿Al llamar a `reiniciarJuego()` o iniciar una nueva partida desde el modal/pantalla final, queda alguna variable global o propiedad del estado sin limpiar (ej. puntuación, combo, modo espejo, arrays de entidades o semilla)?

5. CÓDIGO MUERTO O SIN USO:
   - ¿Existen variables, funciones, tipos exportados, imports o reglas CSS declaradas en los archivos que no se estén utilizando en ningún lugar del proyecto? Indicar archivo y línea.

6. COBERTURA DE REGLAS DE LA FICHA EN PRUEBAS:
   - ¿Hay alguna regla especificada en la ficha (movimiento invertido, fases de espejo HORIZONTAL/VERTICAL/CRUZADO, combo de sincronía, derrota por choque) que `test/logica.test.ts` NO esté verificando explícitamente?

Devolvé ÚNICAMENTE el informe numerado del 1 al 6 con las líneas detectadas o confirmando "Sín problemas detectados" en cada punto.]

### Resultado del Diagnóstico del Agente:
1. **Lógica en main.ts**: Sin problemas (main.ts únicamente delega a logica.ts y renderiza).
2. **Números sueltos**: Sin problemas (todas las métricas residen en CONFIG).
3. **Alcanzabilidad de Victoria**: Verificado. Con `CONFIG.PUNTOS_VICTORIA_OBJETIVO` (1200 pts) y combo x5, se requieren aproximadamente 180 pasos limpios/gemas, lo cual es alcanzable en ~70 segundos de partida.
4. **Reinicio de Estado**: Confirmado. `crearEstadoInicial` resetea todas las propiedades del objeto de estado.
5. **Código Muerto**: Sin variables ni funciones huérfanas.
6. **Cobertura de Pruebas**: Cobertura completa del 100% de los criterios de aceptación en Vitest.



PROMPT
P6
README · la documentación
Bloque 4 · el último prompt
Las partes 5 y 6 las escribe el estudiante a mano: son suyas.

Escribí el archivo README.md en español con estas seis partes:

1. Nombre y la frase de mi ficha.
2. Qué hace y cómo se usa, en tres líneas.
3. El enlace para abrirlo.
4. Cómo correrlo en otra máquina: los comandos exactos.
5. Dejá este espacio en blanco con un comentario para que lo llene yo:
   «Qué dirigí yo y qué error encontré probando».
6. Declaración de autoría: qué herramienta usé, que el código lo generó un
   agente de IA bajo mi dirección, y qué partes puedo explicar.

No inventes nada en las partes 5 y 6: dejalas para que las complete yo.
PROMPT
R1
RESCATE · cuando algo falla
En cualquier momento
Pedir el diagnóstico antes que el arreglo ahorra la mitad del tiempo.

Cuando hago [ACCIÓN EXACTA], pasa [LO QUE PASA]. Esperaba [LO CORRECTO].

Mensaje de error, textual:
[PEGALO COMPLETO, CON EL NÚMERO DE LÍNEA]

Decime las tres causas más probables, de la más a la menos probable.
No modifiques archivos todavía.
PROMPT
R2
RESCATE · ponerle límites
Cuando el agente toca de más
Se pega una vez y vale para el resto de la sesión.

De ahora en adelante en esta sesión:
- No modifiques ningún archivo sin mostrarme antes el cambio.
- No instales librerías ni crees archivos nuevos sin preguntarme.
- Si creés que hay que cambiar algo que no te pedí, decímelo en lugar de hacerlo.
- Si no estás seguro de poder hacer algo bien, decímelo antes de intentarlo.