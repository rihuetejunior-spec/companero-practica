/* =========================================================
   CHEQUES DE RECOMPENSA (dinero de juego del colegio)
   Se carga después del script principal y amplía sus funciones.
   ========================================================= */
(function(){
const CDEF={moneda:'cheques',voz:2,otro:1,asertivo:1,situacion:3};
S.cheques=Object.assign({},CDEF,S.cheques||{});
let hucha=store.get('cp_hucha',{ganado:0,entregado:0,numero:0});
let sesionCheques=0;
const BUENAS=['asertivo','preguntar','entiende','perdona','saludo','gesto','adulto','alejarse'];
const C=()=>S.cheques;
const mon=()=>C().moneda||'cheques';

/* ---------- estilos ---------- */
const css=document.createElement('style');
css.textContent=`
.chq-fly{position:absolute;left:50%;top:38%;transform:translate(-50%,0);z-index:20;pointer-events:none;animation:chqfly 1.9s ease-out forwards}
.chq-mini{background:linear-gradient(135deg,#e9f6ee,#cfe9d9);border:2px dashed #3f7d6b;border-radius:10px;padding:10px 18px;font-weight:800;color:#2d5e50;font-size:26px;box-shadow:0 6px 18px rgba(0,0,0,.15);white-space:nowrap}
.chq-mini small{display:block;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.75}
@keyframes chqfly{0%{opacity:0;transform:translate(-50%,30px) scale(.6) rotate(-6deg)}15%{opacity:1;transform:translate(-50%,0) scale(1.1) rotate(2deg)}70%{opacity:1;transform:translate(-50%,-40px) scale(1) rotate(-2deg)}100%{opacity:0;transform:translate(-50%,-140px) scale(.7)}}
#counters .wallet{background:#e9f6ee;color:#2d5e50;border-radius:999px;padding:4px 12px;margin-right:6px}
#counters .wallet.bump{animation:bump .5s}
@keyframes bump{50%{transform:scale(1.25)}}
.chq-big{position:relative;background:repeating-linear-gradient(135deg,#f3faf5 0 14px,#eaf5ee 14px 28px);border:3px solid #3f7d6b;border-radius:14px;padding:20px 24px;font-size:19px;color:#23312b;box-shadow:0 6px 20px rgba(0,0,0,.08);max-width:560px}
.chq-big:before{content:"";position:absolute;inset:6px;border:1.5px dashed #7fb8a6;border-radius:10px;pointer-events:none}
.chq-top{display:flex;justify-content:space-between;align-items:baseline;font-weight:800;letter-spacing:.14em;color:#3f7d6b;margin-bottom:12px}
.chq-top b{font-size:26px}
.chq-row{border-bottom:1.5px solid #9cc7b8;padding:6px 0;margin:6px 0}
.chq-amt{font-size:30px;color:#2d5e50}
.chq-foot{display:flex;justify-content:space-between;align-items:flex-end;margin-top:14px;font-size:16px}
.chq-sign{font-family:"Segoe Script","Bradley Hand","Comic Sans MS",cursive;font-size:26px;border-top:1.5px solid #23312b;padding:0 12px}
.tgrid input[type=number]{font:inherit;padding:8px 10px;border:2px solid var(--line);border-radius:10px;font-weight:400;width:100%}
@media print{body *{visibility:hidden!important}.chq-big,.chq-big *{visibility:visible!important}.chq-big{position:fixed;left:10mm;top:10mm;box-shadow:none}}
`;
document.head.appendChild(css);

/* ---------- sonido ---------- */
let actx=null;
function chime(){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();const t=actx.currentTime;
  [[880,0],[1318.5,.12]].forEach(([f,d])=>{const o=actx.createOscillator(),g=actx.createGain();o.type='sine';o.frequency.value=f;
    g.gain.setValueAtTime(0,t+d);g.gain.linearRampToValueAtTime(.18,t+d+.02);g.gain.exponentialRampToValueAtTime(.001,t+d+.45);
    o.connect(g).connect(actx.destination);o.start(t+d);o.stop(t+d+.5);});}catch(e){}}

/* ---------- pagar ---------- */
function pay(n,motivo){n=Math.max(0,Math.round(+n||0));if(!n)return;
  sesionCheques+=n;hucha.ganado+=n;store.set('cp_hucha',hucha);
  const f=document.createElement('div');f.className='chq-fly';
  f.innerHTML=`<div class="chq-mini"><small>${motivo||'¡Cheque!'}</small>+${n} ${n===1?mon().replace(/s$/,''):mon()} 💵</div>`;
  $('#stage').appendChild(f);setTimeout(()=>f.remove(),2000);chime();
  renderCounters();const w=document.querySelector('#counters .wallet');if(w){w.classList.remove('bump');void w.offsetWidth;w.classList.add('bump');}
}
window.payCheques=pay;

/* ---------- ampliar funciones del motor ---------- */
const _respond=respond;
respond=function(text,canal,forced){
  if(!awaiting)return _respond(text,canal,forced);
  const st=curStep();let n=0,motivo='';
  if(forced!=='pasar'){
    n=canal==='voz'?+C().voz:+C().otro;motivo=canal==='voz'?'¡Has hablado!':'¡Has respondido!';
    if(st&&!st.interrupt){const cat=(forced&&forced!=='__int')?forced:classify(text,st);
      if(BUENAS.includes(cat)&&+C().asertivo){n+=+C().asertivo;motivo='¡Muy buena respuesta!';}}
  }
  const p=_respond(text,canal,forced);
  if(n>0&&session&&session.entradas.length){session.entradas[session.entradas.length-1].cheques=n;saveSession();}
  pay(n,motivo);
  return p;
};
const _debrief=debrief;
debrief=function(){const n=+C().situacion;
  if(n>0){log({avatar:'(situación terminada)',respuesta:'',canal:'',tipo:'cheques',seg:'',cheques:n});setTimeout(()=>pay(n,'¡Situación superada!'),300);}
  return _debrief();};
const _startSession=startSession;
startSession=function(){sesionCheques=0;return _startSession();};
$('#btnStart').onclick=startSession;
renderCounters=function(){
  const c=$('#counters');if(!session){c.innerHTML='';return;}
  c.innerHTML=`<span class="wallet">💵 ${sesionCheques} ${mon()}</span>`+(S.contadores?`<span>🎤 ${cnt.voz}</span>`:'');};
const _endSession=endSession;
endSession=async function(){
  const p=_endSession();
  hucha.numero=(hucha.numero||0)+1;store.set('cp_hucha',hucha);
  if(session){session.cheques=sesionCheques;saveSession();}
  const old=document.getElementById('chqWrap');if(old)old.remove();
  const w=document.createElement('div');w.id='chqWrap';w.style.cssText='display:flex;flex-direction:column;gap:10px';
  const fecha=new Date().toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'});
  w.innerHTML=`<div class="chq-big">
      <div class="chq-top"><b>CHEQUE</b><span>Nº ${String(hucha.numero).padStart(4,'0')}</span></div>
      <div class="chq-row">Páguese a: <b>${(S.nombre||'mi compañero').replace(/</g,'&lt;')}</b></div>
      <div class="chq-row">La cantidad de: <b class="chq-amt">${sesionCheques} ${mon()}</b></div>
      <div class="chq-row" style="font-size:16px">Por: practicar conversaciones con valentía</div>
      <div class="chq-foot"><span>${fecha}</span><span class="chq-sign">${(S.avatar||'Leo').replace(/</g,'&lt;')}</span></div>
    </div>
    <div class="row" style="margin-top:0"><button class="soft" id="chqPrint">🖨️ Imprimir cheque</button></div>`;
  $('#btnHome').before(w);
  $('#chqPrint').onclick=()=>{try{window.print()}catch(e){toast('No se puede imprimir desde aquí')}};
  return p;};

/* ---------- registro (CSV y resumen) ---------- */
csv=function(s){const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
  return ['fecha;alumno;hora;situacion;dijo_compañero;respuesta;canal;tipo;segundos;cheques'].concat(s.entradas.map(e=>[s.fecha.slice(0,10),s.alumno,e.hora,e.situacion,e.avatar,e.respuesta,e.canal,e.tipo,String(e.seg||'').replace('.',','),e.cheques||''].map(q).join(';'))).join('\r\n');};
const _renderLog=renderLog;
renderLog=function(){_renderLog();const s=selSession();if(!s)return;
  const tot=s.entradas.reduce((a,e)=>a+(+e.cheques||0),0);$('#tStats').textContent+=` · ${mon()} ganados: ${tot}`;};

$('#tSess').onchange=renderLog;

/* ---------- panel del profesor ---------- */
function hstate(){const p=hucha.ganado-hucha.entregado;
  $('#cHucha').innerHTML=`🐷 Hucha de ${(S.nombre||'el alumno').replace(/</g,'&lt;')}: <b>${hucha.ganado}</b> ${mon()} ganados en total · <b>${hucha.entregado}</b> ya entregados · <b>${p}</b> pendientes de entregar`;}
function buildPanel(){if(document.getElementById('tChq'))return;
  const fs=document.createElement('fieldset');fs.id='tChq';
  fs.innerHTML=`<legend>💵 Cheques de recompensa</legend>
    <div class="tgrid" style="margin:6px 0 10px">
      <label>Nombre de la moneda<input type="text" id="cMoneda"><small>Como se llame el dinero de juego del colegio.</small></label>
      <label>Por responder hablando<input type="number" min="0" max="50" id="cVoz"></label>
      <label>Por responder con tarjeta o escribiendo<input type="number" min="0" max="50" id="cOtro"></label>
      <label>Extra si la respuesta es adecuada<input type="number" min="0" max="50" id="cAsert"><small>Asertiva, pregunta lo que no entiende, acepta una disculpa…</small></label>
      <label>Por terminar cada situación<input type="number" min="0" max="50" id="cSit"></label>
    </div>
    <div class="note" id="cHucha"></div>
    <div class="tbtns"><button type="button" id="cEntregar">✅ Marcar los pendientes como entregados</button><button type="button" class="danger" id="cReset">Poner la hucha a cero</button></div>`;
  document.querySelector('.tpanel fieldset').before(fs);
  $('#cEntregar').onclick=()=>{hucha.entregado=hucha.ganado;store.set('cp_hucha',hucha);hstate();toast('Cheques marcados como entregados');};
  $('#cReset').onclick=()=>{const b=$('#cReset');if(b.dataset.c!=='1'){b.dataset.c='1';b.textContent='¿Seguro? Pulsa otra vez';setTimeout(()=>{b.dataset.c='';b.textContent='Poner la hucha a cero';},4000);return;}
    hucha={ganado:0,entregado:0,numero:hucha.numero||0};store.set('cp_hucha',hucha);b.dataset.c='';b.textContent='Poner la hucha a cero';hstate();toast('Hucha a cero');};
}
const _openTeacher=openTeacher;
openTeacher=function(){_openTeacher();buildPanel();
  $('#cMoneda').value=C().moneda;$('#cVoz').value=C().voz;$('#cOtro').value=C().otro;$('#cAsert').value=C().asertivo;$('#cSit').value=C().situacion;hstate();};
$('#tSave').addEventListener('click',()=>{if(!document.getElementById('tChq'))return;
  const num=id=>Math.max(0,Math.min(50,Math.round(+$(id).value||0)));
  S.cheques={moneda:$('#cMoneda').value.trim()||'cheques',voz:num('#cVoz'),otro:num('#cOtro'),asertivo:num('#cAsert'),situacion:num('#cSit')};
  store.set('cp_ajustes',S);renderCounters();hstate();});
})();
