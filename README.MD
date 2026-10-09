# ESPEJO: Reflejo Invertido 🪞

**ESPEJO: Reflejo Invertido** es un juego arcade de precisión desarrollado con TypeScript y tecnologías web. El jugador controla simultáneamente dos fichas en matrices paralelas: una se mueve de forma normal y la otra ejecuta el movimiento reflejado. El objetivo es esquivar obstáculos, recolectar gemas rúnicas y mantener la sincronía para aumentar la puntuación y el combo.

La propuesta visual utiliza una estética **Cyber-Sincronía Rúnica**: un entorno oscuro, cuadrículas de neón y colores de alto contraste para distinguir cada elemento del juego.

> **Objetivo:** superar las tres fases de espejo, alcanzar **1.200 puntos** y lograr la victoria sin destruir ninguna de las dos fichas. Una sola colisión con un obstáculo provoca el fin de la partida.

---

## 📑 Tabla de contenidos

- [Características principales](#-características-principales)
- [Cómo se juega](#-cómo-se-juega)
- [Controles](#-controles)
- [Fases de espejo](#-fases-de-espejo)
- [Puntuación y combo](#-puntuación-y-combo)
- [Interfaz y diseño](#-interfaz-y-diseño)
- [Arquitectura del proyecto](#-arquitectura-del-proyecto)
- [Tecnologías](#-tecnologías)
- [Requisitos previos](#-requisitos-previos)
- [Instalación y ejecución](#-instalación-y-ejecución)
- [Pruebas automatizadas](#-pruebas-automatizadas)
- [Criterios de aceptación](#-criterios-de-aceptación)
- [Alcance y decisiones técnicas](#-alcance-y-decisiones-técnicas)
- [Estado de verificación](#-estado-de-verificación)
- [Autoría y créditos](#-autoría-y-créditos)

---

## ✨ Características principales

- **Control dual:** un único movimiento afecta a la ficha normal y a su reflejo.
- **Dos matrices paralelas:** tablero dual de **5 carriles × 10 filas**.
- **Reflejo invertido:** la segunda ficha responde en sentido opuesto según la fase activa.
- **Tres fases progresivas:** HORIZONTAL, VERTICAL y CRUZADO.
- **Combo de sincronía:** multiplicador que puede aumentar desde **x1 hasta x5**.
- **Obstáculos y gemas:** evita los bloques rojos y recolecta gemas rúnicas ámbar.
- **Final de partida:** pantalla de derrota o victoria con resumen de métricas.
- **Diseño adaptable:** interfaz preparada para computadoras y pantallas móviles.
- **Controles táctiles:** botones grandes para mover las fichas con rapidez.
- **Aleatoriedad reproducible:** generador pseudoaleatorio basado en semilla para poder repetir una secuencia de entidades.
- **Lógica aislada:** reglas y estado separados de la interfaz para facilitar las pruebas y el mantenimiento.
- **Pruebas unitarias:** pruebas automatizadas con Vitest para revisar las reglas principales.

## 🎮 Cómo se juega

La partida se desarrolla en dos cuadrículas situadas una junto a la otra:

- **Matriz Normal:** contiene la ficha principal de color cian.
- **Matriz Reflejo:** contiene la ficha reflejada de color rosa/magenta.

Ambas fichas están relacionadas. Al pulsar una dirección, la ficha normal se desplaza y la ficha reflejo responde de acuerdo con la fase de inversión activa. Durante la partida aparecen obstáculos rojos que deben esquivarse y gemas rúnicas ámbar que ayudan a aumentar la puntuación y mantener el combo.

La dificultad visual y de coordinación aumenta con las transiciones de fase. El objetivo final es alcanzar **1.200 puntos**, superar las fases de espejo y conservar ambas fichas sin colisionar.

### Condiciones de finalización

**Victoria — SINCRONÍA PERFECTA**

- Alcanzar o superar los **1.200 puntos** objetivo.
- Superar las tres fases de inversión.
- Terminar sin destruir el reflejo ni colisionar con obstáculos.

**Derrota — SINCRONÍA ROTA**

- La ficha normal o la ficha reflejo colisiona con un obstáculo rojo.
- La partida termina con un único impacto; no existen vidas múltiples ni barra de salud.

## ⌨️ Controles

| Acción | Control |
|---|---|
| Mover a la izquierda | `←` o `A` |
| Mover a la derecha | `→` o `D` |
| En dispositivos táctiles | Botones en pantalla: **← IZQUIERDA** y **DERECHA →** |
| Iniciar una partida | Botón **INICIAR SINCRONÍA** |
| Empezar otra partida después del resultado | Botón **REINICIAR ESPEJO** |

Los botones táctiles están diseñados con áreas de interacción de al menos **44 × 44 píxeles** para facilitar su uso en pantallas pequeñas.

## 🪞 Fases de espejo

El juego incluye tres fases de distorsión que cambian según la puntuación acumulada:

| Fase | Descripción |
|---|---|
| **HORIZONTAL** | El reflejo invierte el movimiento de izquierda a derecha. |
| **VERTICAL** | Se mantiene el eje horizontal, pero cambia la dirección de entrada según la configuración de la fase. |
| **CRUZADO** | Se aplica la inversión dinámica de ambos ejes. |

La fase activa se muestra en el HUD para que el jugador pueda identificar el modo de reflejo durante la partida.

## 💠 Puntuación y combo

El HUD muestra la puntuación actual y el multiplicador de combo activo. El combo aumenta al realizar esquivas consecutivas o recolectar gemas de sincronía sin sufrir colisiones, con un multiplicador máximo de **x5**.

En la pantalla de resultados se resumen las métricas principales:

- Puntuación final.
- Combo máximo alcanzado.
- Fase de espejo máxima alcanzada.

Las cantidades y constantes numéricas del juego se centralizan en el objeto `CONFIG` de `src/logica.ts` para evitar repartir valores de configuración por el código.

## 🎨 Interfaz y diseño

La interfaz está basada en una estética cyberpunk/rúnica de alto contraste:

| Elemento | Color | Código HEX |
|---|---|---|
| Fondo general | Oscuro cyber | `#0a0e17` |
| Ficha normal y matriz izquierda | Cian | `#22d3ee` |
| Ficha reflejo y matriz derecha | Rosa / magenta | `#f472b6` |
| Obstáculos | Rojo | `#f87171` |
| Gemas, combo y récord | Ámbar | `#fbbf24` |

La interfaz está organizada en tres estados visuales:

1. **Inicio:** nombre del juego, subtítulo, instrucciones de control y botón `INICIAR SINCRONÍA`.
2. **Juego activo:** HUD con puntuación, combo y fase; dos matrices de 5 × 10; fichas, obstáculos y gemas.
3. **Resultados:** mensaje `SINCRONÍA ROTA` o `SINCRONÍA PERFECTA`, resumen de métricas y botón `REINICIAR ESPEJO`.

El diseño utiliza HTML, CSS, SVG dinámico ligero y sistemas de distribución Flexbox/Grid. No requiere imágenes externas ni sprites de archivo. El texto general debe conservar un tamaño mínimo de **16 px**, con contraste alto y sin desplazamiento horizontal en móviles.

## 🧱 Arquitectura del proyecto

El proyecto separa las reglas del juego de la interfaz para evitar que el código visual modifique directamente el comportamiento de la partida.

```text
ESPEJO_3196324/
├── index.html              # Documento HTML y punto de entrada
├── package.json            # Dependencias y scripts npm
├── tsconfig.json            # Configuración de TypeScript (si está incluido)
├── src/
│   ├── logica.ts           # Reglas, estado, configuración y generación aleatoria
│   ├── main.ts             # Eventos de entrada y renderizado de la interfaz
│   └── estilo.css          # Estilos, paleta, cuadrículas y diseño responsive
└── test/
    └── logica.test.ts      # Pruebas automatizadas con Vitest
```

> La estructura anterior describe los archivos contemplados en los prompts. Los archivos de configuración como `package.json` y `tsconfig.json` deben existir en el repositorio para ejecutar los comandos correspondientes.

### Responsabilidades de cada archivo

#### `src/logica.ts`

Contiene la lógica pura del juego. No debe interactuar con el DOM ni utilizar APIs del navegador como `document`, `window` o `alert`.

Entre los elementos documentados se encuentran:

- Tipos e interfaces exportados, como `Posicion`, `Entidad` y `EstadoJuego`.
- Objeto `CONFIG` con constantes numéricas y comentarios de unidades.
- Generador pseudoaleatorio determinista `generarAleatorio`.
- Funciones de gestión del estado, como `crearEstadoInicial`, `moverJugador`, `avanzarPaso` y `reiniciarJuego`.
- Funciones que modifican el estado y devuelven `boolean` para indicar si la acción fue válida y se aplicó.

#### `src/main.ts`

Actúa como capa de interacción y presentación. Importa los estilos, escucha las entradas del teclado y los botones, llama a las funciones exportadas desde `logica.ts` y dibuja la pantalla a partir del estado recibido. No debe contener reglas, cálculos de puntuación ni validaciones de colisión.

La importación del CSS debe aparecer al principio del archivo:

```ts
import './estilo.css';
```

#### `src/estilo.css`

Define la apariencia del juego: fondo oscuro, efectos de neón, colores de las matrices, botones, HUD, pantallas de inicio y resultados y adaptación a móviles.

#### `test/logica.test.ts`

Contiene las pruebas unitarias de las reglas de `logica.ts`. Las pruebas utilizan Vitest y semillas deterministas cuando corresponde, para obtener resultados reproducibles.

#### `index.html`

Contiene el elemento raíz de la aplicación, la configuración de viewport y la carga de `main.ts` como módulo:

```html
<div id="app"></div>
<script type="module" src="/src/main.ts"></script>
```

Para pantallas móviles, la etiqueta viewport especificada para el proyecto es:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

## 🛠️ Tecnologías

- **TypeScript:** implementación de la lógica y de la interfaz.
- **HTML5:** estructura de la aplicación.
- **CSS3:** presentación visual y diseño responsive.
- **SVG dinámico:** representación gráfica ligera cuando sea necesario.
- **Vitest:** pruebas unitarias automatizadas.
- **npm:** ejecución de comandos y gestión de dependencias del proyecto.

No se contemplan motores 3D, imágenes o sprites externos, librerías externas de interfaz/animación ni librerías de física.

## 💻 Requisitos previos

Antes de ejecutar el proyecto, comprueba que el equipo tenga:

- Node.js y npm instalados.
- Un navegador moderno compatible con módulos JavaScript.
- Un editor como Visual Studio Code.
- Los archivos de configuración y dependencias del proyecto, incluyendo `package.json` y la configuración de TypeScript que corresponda.

## 🚀 Instalación y ejecución

1. Clona el repositorio o descarga el proyecto y abre la carpeta `ESPEJO_3196324` en el editor.

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd ESPEJO_3196324
   ```

2. Instala las dependencias declaradas en `package.json`:

   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo usando el script que esté configurado en `package.json`. Si el proyecto utiliza el script habitual `dev`, ejecuta:

   ```bash
   npm run dev
   ```

4. Abre en el navegador la dirección local que indique la terminal.

**Nota:** el comando exacto para iniciar el servidor depende de los scripts del `package.json` del repositorio. No abras `index.html` directamente si la configuración del proyecto necesita un servidor de desarrollo para compilar TypeScript.

## 🧪 Pruebas automatizadas

El proyecto contempla un conjunto de pruebas unitarias con **Vitest**, ubicado en `test/logica.test.ts`. Para ejecutarlas, utiliza:

```bash
npm test
```

Las cinco pruebas documentadas abarcan estos casos:

1. **Estado inicial:** fichas en el carril central, puntuación en cero, combo x1, fase horizontal y partida en ejecución.
2. **Movimiento invertido:** al mover a la izquierda, la ficha normal avanza un carril a la izquierda y el reflejo un carril a la derecha en modo horizontal.
3. **Límites y restricciones:** se rechazan movimientos fuera del tablero y acciones cuando la partida ya terminó.
4. **Derrota y victoria:** se verifica la derrota por colisión y la victoria al alcanzar la puntuación objetivo.
5. **Recorrido completo:** se simula una partida para revisar la progresión del combo, las fases de espejo y la llegada a la victoria.

También se documentó una comprobación de tipos mediante:

```bash
npx tsc --noEmit
```

Según los resultados registrados en el documento de desarrollo, `npm test` terminó con **5 pruebas aprobadas** y la comprobación de TypeScript no presentó errores en esa ejecución. Ejecuta nuevamente los comandos en el estado actual del repositorio para confirmar los resultados.

## ✅ Criterios de aceptación

El proyecto se considera funcional cuando se verifica que:

- La aplicación abre y muestra la pantalla de inicio.
- El botón `INICIAR SINCRONÍA` inicia la partida.
- Las teclas `A`/`D` y las flechas desplazan ambas fichas en direcciones reflejadas según la fase.
- Los controles táctiles responden en pantallas compatibles.
- Las dos matrices se adaptan al ancho del dispositivo sin desplazamiento horizontal.
- Se muestran correctamente la puntuación, el combo y la fase activa.
- Los obstáculos pueden provocar la derrota al producirse una colisión.
- La puntuación y las gemas permiten progresar hacia la meta de victoria.
- La pantalla final muestra el resultado y las métricas, y permite reiniciar la partida.
- Las pruebas automatizadas y la comprobación de TypeScript se ejecutan sin errores.

## 🔍 Alcance y decisiones técnicas

### Incluido

- Juego arcade en dos matrices paralelas de 5 × 10.
- Ficha normal y ficha reflejada.
- Obstáculos rojos y gemas rúnicas ámbar.
- Tres fases de inversión.
- Combo de sincronía de hasta x5.
- Meta de victoria de 1.200 puntos.
- Pantallas de inicio, juego activo y resultados.
- Controles de teclado y táctiles.
- Diseño responsive y alto contraste.
- Generador aleatorio determinista y pruebas unitarias.

### Fuera del alcance

- Gráficos 3D o motores de juego 3D.
- Imágenes o sprites externos.
- Librerías externas de física.
- Barra de salud o sistema de vidas múltiples.
- Librerías externas de interfaz o animación.

### Decisiones de configuración

Las constantes numéricas deben mantenerse en el objeto `CONFIG` de `src/logica.ts`, documentadas con sus unidades. Los detalles numéricos que no estén especificados en la ficha deben quedar definidos y comentados en esa configuración, sin introducir números mágicos en la interfaz.

## 📋 Estado de verificación

En el registro de desarrollo del proyecto se documentaron los siguientes resultados:

- Creación de `src/logica.ts` y comprobación con `npx tsc --noEmit`.
- Cinco pruebas automatizadas reportadas como aprobadas mediante Vitest.
- Creación de `src/main.ts`, `src/estilo.css` e integración con `index.html`.
- Revisión documentada del diseño responsive, botones táctiles, tamaño mínimo de texto y desbordamiento horizontal.
- Auditoría documentada de separación de lógica, constantes, reinicio de estado, código sin uso y cobertura de reglas.

Estos resultados corresponden al informe de desarrollo disponible; no garantizan que una copia posterior o un entorno distinto siga funcionando de la misma manera. Para verificar la versión actual, ejecuta las pruebas y revisa el juego en el navegador.

## 👨‍💻 Autoría y créditos

**Proyecto:** ESPEJO: Reflejo Invertido  
**Carpeta del proyecto:** `ESPEJO_3196324`  
**Temática:** Coordinación Dual Cyber-Rúnica  
**Implementación:** TypeScript, HTML5, CSS3 y Vitest

Este proyecto se centra en la separación entre lógica y presentación, las pruebas de reglas, la accesibilidad táctil y una experiencia arcade basada en la coordinación espacial.

---

**ESPEJO: Reflejo Invertido — sincroniza tus movimientos, domina las fases y no pierdas de vista tu reflejo.**
