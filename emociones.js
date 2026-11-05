/* =========================================================
   SITUACIÓN «CÓMO SE SIENTE LEO» (emociones del compañero)
   Leo expresa sus emociones; al alumno nunca se le pregunta cómo se siente.
   ========================================================= */
(function(){
const BURLA=AGR.concat(['tonteria','que tonteria','miedica','facilisimo','eso es facil','exagerado','exagerada','llorica','jaja']);
const EMP_KW=['lo siento','pobre','animo','vaya','que pena','que mal','normal','te ayudo','ayudarte','juntos','tranquilo','tranquila','seguro que','no pasa nada','enhorabuena','felicidades','que bien','genial','te lo mereces','bien hecho','muy bien','guay','estoy contigo','a mi tampoco','a mi tambien','te entiendo'];
const PREG_KW=['que te pasa','que le pasa','que tiene','como esta','se pondra','como lo has hecho','como lo hiciste','sabes quien','quien ha sido','que tienes que','que vas a','estas bien','que ha pasado'];

SCEN.splice(Math.max(0,SCEN.findIndex(s=>s.id==='frases')+1),0,
{id:'emociones',icono:'💛',titulo:'Cómo se siente Leo',habilidad:'Darte cuenta de cómo se siente otro y responderle',
 intro:'Hoy {avatar} tiene un día lleno de emociones. Te va a contar cómo se siente. Fíjate en su cara y en lo que dice, y respóndele.',
 tip:'Cuando alguien te cuenta cómo se siente, puedes responder: «Lo siento», «¡Enhorabuena!» o «¿Te ayudo?». No hace falta la frase perfecta: basta con que vea que le has escuchado.',
 inicio:'a',pasos:{
  a:{say:'Hoy no me apetece mucho jugar... Mi perro está malito y lo han llevado al veterinario.',mood:'triste',hint:'{avatar} está triste. ¿Qué le puedes decir?',
     cards:[['Vaya, lo siento mucho','empatico'],['¿Se pondrá bien?','pregunta'],['¿Quieres que juguemos juntos para distraerte?','empatico'],['Pues yo me he comprado un juego nuevo','ignora']],
     kw:{burla:BURLA,ignora:['yo me he comprado','pues yo','a mi me','juego nuevo'],pregunta:PREG_KW,empatico:EMP_KW},
     react:{empatico:{say:'Gracias, {nombre}. Me ayuda mucho que me digas eso.',mood:'contento'},
            pregunta:{say:'El veterinario dice que sí, que en unos días estará mejor. Gracias por preguntarme.',mood:'contento'},
            ignora:{say:'Ah... vale. Es que ahora estoy un poco triste por mi perro.',mood:'triste'},
            burla:{say:'Pues a mí no me hace gracia... Estoy preocupado por él.',mood:'triste'},
            otro:{say:'Gracias por escucharme.',mood:'arrepentido'}},next:'b'},
  b:{say:'¡{nombre}! ¡He sacado un nueve en el examen de mates! ¡Estoy súper contento!',mood:'contento',hint:'{avatar} está muy contento. ¿Qué le puedes decir?',
     cards:[['¡Enhorabuena!','empatico'],['¡Qué bien! Te lo mereces','empatico'],['¿Cómo lo has hecho?','pregunta'],['Yo saqué un diez','ignora']],
     kw:{ignora:['yo saque','yo he sacado','yo tambien','pues yo','yo mas'],burla:BURLA,pregunta:PREG_KW.concat(['como','estudiaste']),empatico:EMP_KW},
     react:{empatico:{say:'¡Gracias! Me alegra mucho que te alegres conmigo.',mood:'contento'},
            pregunta:{say:'Estudié un ratito cada día. ¡Gracias por preguntar!',mood:'contento'},
            ignora:{say:'¡Hala! Bueno... yo estaba muy contento con mi nueve.',mood:'confuso'},
            burla:{say:'Vaya... yo que estaba tan contento.',mood:'triste'},
            otro:{say:'¡Estoy feliz! Gracias por escucharme.',mood:'contento'}},next:'c'},
  c:{say:'¡Uf, qué rabia! Alguien ha roto el dibujo que hice para mi abuela.',mood:'enfadado',hint:'{avatar} está enfadado. ¿Qué le puedes decir?',
     cards:[['Normal que estés enfadado','empatico'],['¿Quieres que te ayude a hacer otro?','empatico'],['¿Sabes quién ha sido?','pregunta'],['Tampoco es para tanto','ignora']],
     kw:{ignora:['tampoco es para tanto','no es para tanto','que mas da','da igual','no pasa nada'],burla:BURLA,pregunta:PREG_KW,empatico:EMP_KW},
     react:{empatico:{say:'Gracias... Ya me estoy calmando. A lo mejor hago otro todavía más bonito.',mood:'contento'},
            pregunta:{say:'No lo sé... Se lo voy a contar a la profe. Gracias por escucharme.',mood:'neutral'},
            ignora:{say:'Para mí sí es importante... Lo hice con mucho cariño.',mood:'triste'},
            burla:{say:'¡No me hace ninguna gracia! Estoy muy enfadado.',mood:'enfadado'},
            otro:{say:'Gracias por escucharme. Ya estoy un poco más tranquilo.',mood:'neutral'}},next:'d'},
  d:{say:'Mañana tengo que salir a la pizarra y estoy muy nervioso. Me tiemblan hasta las manos.',mood:'confuso',hint:'{avatar} está nervioso. ¿Qué le puedes decir?',
     cards:[['Seguro que te sale bien','empatico'],['¿Quieres que practiquemos juntos?','empatico'],['¿Qué tienes que hacer?','pregunta'],['Qué tontería, eso es fácil','burla']],
     kw:{burla:BURLA,pregunta:PREG_KW,empatico:EMP_KW},
     react:{empatico:{say:'Gracias, {nombre}. Me has tranquilizado un montón.',mood:'contento'},
            pregunta:{say:'Tengo que explicar un problema de mates. Si lo practico, seguro que me sale mejor.',mood:'neutral'},
            burla:{say:'Para mí no es fácil... Me sienta mal que me digas eso.',mood:'triste'},
            otro:{say:'Gracias. Me viene bien hablarlo con alguien.',mood:'neutral'}},next:'e'},
  e:{say:'¡Uy! ¿Has oído ese trueno? ¡Me he asustado un montón!',mood:'sorprendido',hint:'{avatar} se ha asustado. ¿Qué le puedes decir?',
     cards:[['Tranquilo, aquí dentro no pasa nada','empatico'],['A mí tampoco me gustan los truenos','empatico'],['¡Jaja, qué miedica!','burla']],
     kw:{burla:BURLA,empatico:EMP_KW.concat(['truenos','no pasa nada','aqui dentro'])},
     react:{empatico:{say:'Gracias, ya se me está pasando el susto.',mood:'contento'},
            burla:{say:'Oye, todos nos asustamos alguna vez...',mood:'triste'},
            otro:{say:'Menos mal que estás aquí. Ya se me pasa.',mood:'neutral'}},next:'f'},
  f:{say:'Oye, {nombre}, gracias por escucharme hoy. ¡Me lo he pasado muy bien contigo!',mood:'contento',hint:'{avatar} está contento de estar contigo.',
     cards:[['De nada'],['Yo también'],['¡Hasta luego!']],
     react:{otro:{say:'¡Hasta luego, {nombre}!',mood:'contento'}},next:null}
 }});

/* añadir la situación nueva a los ajustes ya guardados (sin desordenar lo que haya elegido el profesor) */
const BASE=['conocer','repetir','frases','equivoca','interrumpe','insulta'];
S.vistos=S.vistos||BASE.slice();
SCEN.forEach(s=>{if(!S.vistos.includes(s.id)){S.vistos.push(s.id);
  if(!S.escenarios.includes(s.id)){const i=S.escenarios.indexOf('frases');S.escenarios.splice(i>=0?i+1:S.escenarios.length,0,s.id);}}});
store.set('cp_ajustes',S);

/* nunca se pregunta al alumno cómo se siente: se quita esa parte del cierre */
const feel=$('#feel');if(feel){const q=feel.previousElementSibling;if(q&&/sentido/.test(q.textContent))q.remove();feel.remove();}

renderHome();
})();
