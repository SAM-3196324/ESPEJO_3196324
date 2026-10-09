(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={CARRILES:5,FILAS:10,FILA_INICIAL_JUGADOR:9,PUNTUACION_META:1200,UMBRAL_FASE_VERTICAL:400,UMBRAL_FASE_CRUZADA:800,PUNTOS_ESQUIVA:25,PUNTOS_GEMA:50,AMBAR_POR_GEMA:8,AMBAR_POR_ESQUIVA:2,COMBO_MINIMO:1,COMBO_MAXIMO:5,PASOS_PARA_COMBO:2,INTERVALO_CAIDA:550,PROBABILIDAD_GEMA:.28,MAXIMO_ENTIDADES:16,PRECIO_ASPECTO_SOLAR:60,PRECIO_ASPECTO_PRISMA:120,PRECIO_ASPECTO_CELESTE:220},t=[{id:`cian`,nombre:`Cian original`,precio:0},{id:`solar`,nombre:`Pulso solar`,precio:e.PRECIO_ASPECTO_SOLAR},{id:`prisma`,nombre:`Prisma rúnico`,precio:e.PRECIO_ASPECTO_PRISMA},{id:`celeste`,nombre:`Cometa celeste`,precio:e.PRECIO_ASPECTO_CELESTE}];function n(e){let t=e>>>0,n=()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296};return{semilla:e>>>0,siguiente:n,entero:(e,t)=>e+Math.floor(n()*(t-e+1))}}function r(t,n=0){let r=Math.floor(e.CARRILES/2);return{estado:`en_curso`,puntuacion:0,record:Math.max(0,n),multiplicadorCombo:e.COMBO_MINIMO,accionesSincronizadas:0,fase:`horizontal`,fichaNormal:{matriz:`normal`,carril:r,fila:e.FILA_INICIAL_JUGADOR},fichaReflejo:{matriz:`reflejo`,carril:r,fila:e.FILA_INICIAL_JUGADOR},entidades:[],semilla:t>>>0,siguienteId:1,esquivas:0,gemasRecolectadas:0,impactos:0,ambar:0,aspecto:`cian`,aspectosDesbloqueados:[`cian`]}}function i(t){return t>=e.UMBRAL_FASE_CRUZADA?`cruzada`:t>=e.UMBRAL_FASE_VERTICAL?`vertical`:`horizontal`}function a(e,t){return t===`vertical`?e:e*-1}function o(t){return Number.isInteger(t)&&t>=0&&t<e.CARRILES}function s(e,t){return e.puntuacion+=t*e.multiplicadorCombo,e.record=Math.max(e.record,e.puntuacion),e.fase=i(e.puntuacion),!0}function c(t){return t.accionesSincronizadas+=1,t.accionesSincronizadas%e.PASOS_PARA_COMBO===0&&t.multiplicadorCombo<e.COMBO_MAXIMO&&(t.multiplicadorCombo+=1),!0}function l(e,t){if(e.estado!==`en_curso`||t!==-1&&t!==1)return!1;let n=e.fichaNormal.carril+t,r=e.fichaReflejo.carril+a(t,e.fase);return!o(n)||!o(r)?!1:(e.fichaNormal.carril=n,e.fichaReflejo.carril=r,!0)}function u(t,n){return t.estado!==`en_curso`||t.entidades.length>=e.MAXIMO_ENTIDADES||!o(n.carril)||!Number.isInteger(n.fila)||n.fila<0||n.fila>=e.FILAS?!1:(t.entidades.push({...n,id:t.siguienteId++}),!0)}function d(t){if(t.estado!==`en_curso`||t.entidades.length>e.MAXIMO_ENTIDADES-2)return!1;let r=n(t.semilla),i=r.entero(0,e.CARRILES-1),a=r.siguiente()<e.PROBABILIDAD_GEMA?`gema`:`obstaculo`;t.semilla=r.entero(0,4294967295);let o=e.CARRILES-1-i,s=u(t,{matriz:`normal`,carril:i,fila:0,clase:a}),c=u(t,{matriz:`reflejo`,carril:o,fila:0,clase:a});return s&&c}function f(e,t){return e.matriz===t.matriz&&e.carril===t.carril&&e.fila===t.fila}function p(t){if(t.estado!==`en_curso`)return!1;let n=!1,r=[],i=t.entidades.map(e=>({...e,fila:e.fila+1})),a=i.filter(e=>{let n=e.matriz===`normal`?t.fichaNormal:t.fichaReflejo;return e.clase===`obstaculo`&&f(e,n)}),o=new Set(a.map(e=>e.id));if(a.length>0)return t.impactos+=a.length,t.multiplicadorCombo=e.COMBO_MINIMO,t.accionesSincronizadas=0,t.estado=`derrota`,!0;for(let a of i)o.has(a.id)?n=!0:t.estado===`en_curso`?f(a,a.matriz===`normal`?t.fichaNormal:t.fichaReflejo)?(n=!0,t.gemasRecolectadas+=1,t.ambar+=e.AMBAR_POR_GEMA,c(t),s(t,e.PUNTOS_GEMA)):a.fila>=e.FILAS?(n=!0,a.clase===`obstaculo`&&(t.esquivas+=1,t.ambar+=e.AMBAR_POR_ESQUIVA,c(t),s(t,e.PUNTOS_ESQUIVA))):(n=!0,r.push(a)):a.fila<e.FILAS&&r.push(a);return t.entidades=r,n}function m(e,n){let r=t.find(e=>e.id===n);return e.estado!==`en_curso`||!r||e.aspectosDesbloqueados.includes(n)||e.ambar<r.precio?!1:(e.ambar-=r.precio,e.aspectosDesbloqueados.push(n),e.aspecto=n,!0)}function h(e,t){return e.estado!==`en_curso`||!e.aspectosDesbloqueados.includes(t)?!1:(e.aspecto=t,!0)}function g(e,t){let n=e.record,i=r(t,n);return Object.assign(e,i,{ambar:e.ambar,aspecto:e.aspecto,aspectosDesbloqueados:[...e.aspectosDesbloqueados]}),!0}var _=r(Date.now()>>>0),v,y=0,b=`inicio`,x=document.querySelector(`#app`);if(!x)throw Error(`Falta el contenedor principal de ESPEJO.`);function S(){try{let e=localStorage.getItem(`espejo-progreso-v1`);if(!e)return;let n=JSON.parse(e);if(typeof n.ambar==`number`&&Number.isFinite(n.ambar)&&(_.ambar=Math.max(0,Math.floor(n.ambar))),Array.isArray(n.aspectosDesbloqueados)){let e=n.aspectosDesbloqueados.filter(e=>t.some(t=>t.id===e));_.aspectosDesbloqueados=Array.from(new Set([`cian`,...e]))}n.aspecto&&_.aspectosDesbloqueados.includes(n.aspecto)&&t.some(e=>e.id===n.aspecto)&&(_.aspecto=n.aspecto)}catch{_.aspectosDesbloqueados=[`cian`]}}function C(){try{let e={ambar:_.ambar,aspecto:_.aspecto,aspectosDesbloqueados:[..._.aspectosDesbloqueados]};localStorage.setItem(`espejo-progreso-v1`,JSON.stringify(e))}catch{return}}var w={horizontal:`HORIZONTAL`,vertical:`VERTICAL`,cruzada:`CRUZADO`};function T(t,n){let r=Array.from({length:e.FILAS},(n,r)=>Array.from({length:e.CARRILES},(e,n)=>`<div class="celda" data-matriz="${t}" data-fila="${r}" data-carril="${n}" role="gridcell"><span class="token" aria-hidden="true"></span></div>`).join(``)).join(``);return`<section class="matriz ${t}" aria-label="${n}">
    <h2 class="etiqueta">${n}</h2>
    <div class="cuadricula" role="grid" aria-rowcount="${e.FILAS}" aria-colcount="${e.CARRILES}">${r}</div>
  </section>`}function E(){return`<nav class="controles" aria-label="Controles de movimiento">
    <button class="boton-movimiento" type="button" data-movimiento="-1" aria-label="Mover a la izquierda">
      <span aria-hidden="true">←</span><span>IZQUIERDA</span><kbd>A</kbd>
    </button>
    <button class="boton-movimiento" type="button" data-movimiento="1" aria-label="Mover a la derecha">
      <kbd>D</kbd><span>DERECHA</span><span aria-hidden="true">→</span>
    </button>
  </nav>`}function D(){return`<main class="marco pantalla-inicio">
    <header class="cabecera">
      <p class="sobrelinea">PROTOCOLO DE SINCRONÍA <span>///</span> PARTIDA RÚNICA</p>
      <h1>ESPEJO<span class="dos-puntos">:</span><br><span class="titulo-secundario">REFLEJO INVERTIDO</span></h1>
      <p class="subtitulo">Coordinación dual cyber-rúnica</p>
    </header>
    <div class="inicio-layout">
      <section class="intro" aria-label="Reglas del juego">
        <div class="sello" aria-hidden="true"><span>✧</span><i></i></div>
        <p class="frase-inicio">Dos matrices. Un solo pulso.</p>
        <ol class="reglas">
          <li><b>01</b><span>Muévete con <kbd>A</kbd> <kbd>D</kbd> o las flechas; el reflejo responde al mismo tiempo.</span></li>
          <li><b>02</b><span>Esquiva los bloques rojos: un impacto termina la partida.</span></li>
          <li><b>03</b><span>Recoge gemas ámbar para puntuar, aumentar el combo y comprar aspectos.</span></li>
        </ol>
        <button class="boton-principal" type="button" data-accion="iniciar">INICIAR <span aria-hidden="true">↗</span></button>
      </section>
      <aside class="arsenal" aria-label="Tienda de aspectos">
        <header class="arsenal-cabecera"><div><p class="sobrelinea">COLECCIÓN</p><h2>ARSENAL RÚNICO</h2></div><strong class="monedero"><span aria-hidden="true">✦</span> <span data-ambar>${_.ambar}</span></strong></header>
        <p class="nota-arsenal">El ámbar y los aspectos se guardan en este dispositivo.</p>
        <div class="aspectos">${O()}</div>
      </aside>
    </div>
    <footer class="ayuda"><span>CADA INTENTO CUENTA</span><p>Esquiva los bloques rojos y mantén viva la sincronía.</p></footer>
  </main>`}function O(){return t.map(e=>`<button class="aspecto-opcion" type="button" data-aspecto="${e.id}" data-estado-opcion="" aria-pressed="false">
    <span class="muestra-aspecto aspecto-${e.id}" aria-hidden="true"></span>
    <span class="aspecto-info"><strong>${e.nombre}</strong><span class="estado-opcion"></span></span>
  </button>`).join(``)}function k(){return`<aside class="arsenal arsenal-compacto" aria-label="Tienda de aspectos">
    <header class="arsenal-cabecera"><div><p class="sobrelinea">ARSENAL</p><h2>ASPECTOS</h2></div><strong class="monedero"><span aria-hidden="true">✦</span> <span data-ambar>${_.ambar}</span></strong></header>
    <div class="aspectos">${O()}</div>
  </aside>`}function A(){let e=_.estado===`derrota`;return`<main class="marco pantalla-juego">
    <header class="cabecera cabecera-juego">
      <p class="sobrelinea">ESPEJO <span>///</span> SESIÓN ACTIVA</p>
      <h1>REFLEJO <span class="dos-puntos">:</span> <span class="titulo-secundario">INVERTIDO</span></h1>
      ${P()}
    </header>
    <div class="ritmo-combo" aria-label="Progreso al siguiente nivel de combo"><span>CADENA RÚNICA</span><div><i id="progreso-combo"></i></div></div>
    <div class="arena-layout">
      <div class="zona-juego">
        <div class="matrices">
          ${T(`normal`,`MATRIZ A · NORMAL`)}
          <div class="eje" aria-hidden="true"><span>↕</span><i></i><span>↕</span></div>
          ${T(`reflejo`,`MATRIZ B · REFLEJO`)}
        </div>
        ${E()}
      </div>
      ${k()}
    </div>
    <p class="estado-vivo" aria-live="polite">Esquiva los bloques y recoge gemas para ganar ámbar.</p>
    <section class="modal-perdiste" data-resultado role="dialog" aria-modal="true" aria-labelledby="titulo-perdiste" ${e?``:`hidden`}>
      <div class="panel-perdiste">
        <p class="sobrelinea">IMPACTO REGISTRADO · ${_.impactos}</p>
        <h2 id="titulo-perdiste">PERDISTE</h2>
        <p>La sincronía se rompió. Tu ámbar y aspectos siguen guardados.</p>
        <div class="acciones-finales">
          <button class="boton-principal" type="button" data-accion="reiniciar">REINICIAR JUEGO</button>
          <button class="boton-secundario" type="button" data-accion="volver-inicio">VOLVER AL INICIO</button>
        </div>
      </div>
    </section>
  </main>`}function j(){x.querySelectorAll(`[data-aspecto]`).forEach(e=>{let n=e.dataset.aspecto,r=t.find(e=>e.id===n);if(!r)return;let i=_.aspectosDesbloqueados.includes(n),a=_.aspecto===n,o=a?`EQUIPADO`:i?`EQUIPAR`:`${r.precio} ÁMBAR`,s=e.querySelector(`.estado-opcion`);e.dataset.estadoOpcion!==o&&(s&&(s.textContent=o),e.dataset.estadoOpcion=o),e.setAttribute(`aria-pressed`,String(a)),e.disabled=!i&&_.ambar<r.precio}),x.querySelectorAll(`[data-ambar]`).forEach(e=>{e.textContent=String(_.ambar)})}function M(){let e=new Map(_.entidades.map(e=>[`${e.matriz}-${e.fila}-${e.carril}`,e]));x.querySelectorAll(`.celda`).forEach(t=>{let n=t.dataset.matriz,r=Number(t.dataset.fila),i=Number(t.dataset.carril),a=n===`normal`?_.fichaNormal:_.fichaReflejo,o=a.fila===r&&a.carril===i,s=e.get(`${n}-${r}-${i}`),c=t.firstElementChild;c&&(t.setAttribute(`aria-label`,`Fila ${r+1}, carril ${i+1}`),c.className=`token`,o?(c.classList.add(`activo`,`ficha`,n,`aspecto-${_.aspecto}`),t.setAttribute(`aria-label`,`Fila ${r+1}, carril ${i+1}: ficha ${n}`)):s?(c.classList.add(`activo`,`entidad`,s.clase),s.clase===`gema`&&(c.textContent=`✦`),t.setAttribute(`aria-label`,`Fila ${r+1}, carril ${i+1}: ${s.clase===`gema`?`gema rúnica`:`obstáculo`}`)):c.textContent=``)})}function N(){if(b!==`juego`)return;let t={puntuacion:String(_.puntuacion),combo:`×${_.multiplicadorCombo}`,fase:w[_.fase],impactos:String(_.impactos)};Object.entries(t).forEach(([e,t])=>{let n=x.querySelector(`[data-valor="${e}"]`);n&&n.textContent!==t&&(n.textContent=t)});let n=x.querySelector(`#progreso-combo`);if(n){let t=_.accionesSincronizadas%e.PASOS_PARA_COMBO/e.PASOS_PARA_COMBO*100;n.style.width=`${t}%`}let r=x.querySelector(`[data-resultado]`);if(r){r.hidden=_.estado!==`derrota`;let e=r.querySelector(`.sobrelinea`);e&&(e.textContent=`IMPACTO REGISTRADO · ${_.impactos}`)}let i=x.querySelector(`.estado-vivo`);i&&_.estado===`derrota`&&(i.textContent=`Partida finalizada por colisión.`),M()}function P(){return`<div class="marcadores" aria-label="Estado de la partida">
    <div class="marcador"><span>PUNTUACIÓN</span><strong data-valor="puntuacion">${_.puntuacion}</strong></div>
    <div class="marcador combo"><span>COMBO</span><strong data-valor="combo">×${_.multiplicadorCombo}</strong></div>
    <div class="marcador fase"><span>FASE</span><strong data-valor="fase">${w[_.fase]}</strong></div>
    <div class="marcador impactos"><span>IMPACTOS</span><strong data-valor="impactos">${_.impactos}</strong></div>
  </div>`}function F(){let e=b;x.dataset.pantalla!==e&&(x.innerHTML=e===`juego`?A():D(),x.dataset.pantalla=e),j(),N()}function I(){v!==void 0&&window.clearInterval(v),g(_,Date.now()>>>0),d(_),b=`juego`,F(),v=window.setInterval(z,e.INTERVALO_CAIDA)}function L(){v!==void 0&&window.clearInterval(v),v=void 0,g(_,Date.now()>>>0),b=`inicio`,F()}function R(e){l(_,e)&&N()}function z(){if(!_||_.estado!==`en_curso`){v!==void 0&&window.clearInterval(v),v=void 0;return}let t=_.ambar,n=_.siguienteId;p(_),_.estado===`en_curso`&&_.entidades.length<e.MAXIMO_ENTIDADES-1&&d(_),_.ambar!==t&&C(),(_.siguienteId!==n||_.ambar!==t)&&j(),N(),_.estado!==`en_curso`&&v!==void 0&&(window.clearInterval(v),v=void 0)}x.addEventListener(`click`,e=>{if(!(e.target instanceof Element))return;let t=e.target.closest(`button`);if(t){if(t.dataset.accion===`iniciar`||t.dataset.accion===`reiniciar`)I();else if(t.dataset.accion===`volver-inicio`)L();else if(t.dataset.aspecto){let e=t.dataset.aspecto;(_.aspectosDesbloqueados.includes(e)?h(_,e):m(_,e))&&(C(),j(),N())}else(t.dataset.movimiento===`-1`||t.dataset.movimiento===`1`)&&(e.detail===0||Date.now()-y>800)&&R(Number(t.dataset.movimiento))}}),x.addEventListener(`pointerdown`,e=>{if(!(e.target instanceof Element))return;let t=e.target.closest(`button[data-movimiento]`);!t||t.dataset.movimiento!==`-1`&&t.dataset.movimiento!==`1`||(e.preventDefault(),y=Date.now(),R(Number(t.dataset.movimiento)))}),window.addEventListener(`keydown`,e=>{if(b!==`juego`||_.estado!==`en_curso`)return;let t=e.key.toLowerCase();t===`arrowleft`||t===`a`?(e.preventDefault(),R(-1)):(t===`arrowright`||t===`d`)&&(e.preventDefault(),R(1))}),S(),F();