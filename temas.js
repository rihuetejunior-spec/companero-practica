/* =========================================================
   TEMAS: Leo sigue lo que saca el alumno
   - Si el alumno habla o escribe de algo concreto (fútbol, Minecraft, su perro…),
     Leo se interesa, le pregunta por ello y después vuelve a la situación.
   - Si el alumno le hace una pregunta a Leo («¿y tú?», «¿tienes mascota?»), Leo contesta.
   Solo con voz o texto escrito (las tarjetas siguen el guion).
   ========================================================= */
(function(){
const NO_TEMAS=['repetir','insulta'];   // aquí Leo no se desvía
const MAX_POR_PASO=2;

/* ---------- preguntas que el alumno le hace a Leo ---------- */
const PREGUNTAS=[
 {kw:['eres un robot','eres real','eres de verdad','eres una persona','eres una maquina','eres un ordenador','eres una ia','inteligencia artificial'],
  say:'Soy un compañero de mentira, hecho con el ordenador para practicar conversaciones. ¡Pero me encanta hablar contigo!'},
 {kw:['como te llamas','tu nombre'],say:'Me llamo {avatar}.'},
 {kw:['cuantos anos tienes','que edad tienes','cuantos anos'],say:'Tengo los mismos años que tú. ¡Somos de la misma clase!'},
 {kw:['donde vives'],say:'Vivo cerca del cole. Vengo andando todos los días.'},
 {kw:['tienes hermanos','tienes hermana','tienes hermano'],say:'Tengo una hermana pequeña. ¡Es un terremoto!'},
 {kw:['tienes mascota','tienes perro','tienes gato','tienes animales'],say:'Tengo un perro que se llama Toby. Es muy juguetón.'},
 {kw:['cual es tu equipo','de que equipo eres','eres del madrid','eres del barca','eres del atleti'],say:'Yo soy del equipo que gane... ¡es broma! Me gusta ver jugar a todos.'},
 {kw:['cual es tu comida favorita','que te gusta comer'],say:'Mi comida favorita es la pizza. ¡Con mucho queso!'},
 {kw:['que asignatura','tu asignatura','asignatura favorita'],say:'Mi asignatura favorita es Educación Física. ¡Me encanta correr!'},
 {kw:['que te gusta','que te gusta hacer','cual es tu favorito','cual es tu favorita','y a ti','y tu'],say:'¿A mí? Me encanta el fútbol, dibujar cómics y comer pizza.'},
 {kw:['quieres jugar','jugamos','juegas conmigo','vamos a jugar'],say:'¡Claro que sí! En el recreo jugamos juntos.'},
 {kw:['como estas','que tal estas','estas bien'],say:'¡Muy bien, gracias por preguntar!'}
];

/* ---------- temas que puede sacar el alumno ---------- */
const TEMAS=[
 {id:'minecraft',kw:['minecraft'],q:'¡Minecraft! ¿Qué te gusta más: construir o explorar?',cards:['Construir','Explorar','Luchar contra zombis'],a:'¡Qué guay! Yo una vez construí una casa en un árbol enorme.'},
 {id:'videojuegos',kw:['videojuego','videojuegos','consola','play','playstation','nintendo','switch','xbox','fortnite','roblox','mario','pokemon','jugar a la','la tablet','el movil'],q:'¡Videojuegos! ¿A cuál juegas más?',cards:['Minecraft','Roblox','Mario Kart','Fortnite'],a:'¡Ese mola mucho! A mí se me da un poco mal, ¿me enseñarás algún día?'},
 {id:'futbol',kw:['futbol','balon','gol','goles','madrid','real madrid','barca','barcelona','atleti','atletico','partido','portero','delantero','messi','mbappe'],q:'¡Anda, el fútbol! A mí me encanta. ¿De qué equipo eres?',cards:['Del Madrid','Del Atleti','Del Barça','!No me gusta el fútbol'],a:'¡Muy bien! Un día jugamos un partido en el recreo.'},
 {id:'deporte',kw:['baloncesto','natacion','nadar','piscina','tenis','padel','bici','bicicleta','patinar','patines','correr','karate','judo','taekwondo','gimnasia','deporte','balonmano','voley','escalada'],q:'¡Qué bien! ¿Y lo haces muchas veces a la semana?',cards:['Sí, varias veces','Solo los fines de semana','A veces'],a:'¡Qué deportista! Así se hace.'},
 {id:'animales',kw:['perro','perra','perrito','gato','gata','gatito','mascota','animal','animales','hamster','conejo','pez','peces','tortuga','caballo','pajaro','loro'],q:'¡Me encantan los animales! Cuéntame más: ¿cómo es?',cards:['Es muy juguetón','Es muy pequeño','Es grande','Duerme mucho'],a:'¡Qué bonito! Me encantaría conocerlo algún día.'},
 {id:'dinosaurios',kw:['dinosaurio','dinosaurios','t rex','tiranosaurio','velociraptor','triceratops','diplodocus','jurasico','fosil','fosiles'],q:'¡Dinosaurios! ¿Cuál es tu favorito?',cards:['El tiranosaurio','El triceratops','El velociraptor','El diplodocus'],a:'¡Ese es buenísimo! Sabes un montón de dinosaurios.'},
 {id:'espacio',kw:['planeta','planetas','espacio','cohete','cohetes','astronauta','estrellas','luna','marte','galaxia','sistema solar'],q:'¡El espacio! ¿Te gustaría ser astronauta?',cards:['¡Sí!','!No, me daría miedo','Prefiero mirar las estrellas'],a:'¡Qué interesante! A mí me encantaría ver la Tierra desde arriba.'},
 {id:'musica',kw:['musica','cancion','canciones','cantar','guitarra','piano','bateria','violin','flauta','tocar un instrumento'],q:'¡Música! ¿Tocas algún instrumento o te gusta más escuchar?',cards:['Toco un instrumento','Me gusta escuchar','Me gusta cantar'],a:'¡Qué bonito! La música me pone de buen humor.'},
 {id:'dibujo',kw:['dibujar','dibujo','dibujos','pintar','colorear','manga','comic','comics'],q:'¡Qué chulo! ¿Qué te gusta dibujar?',cards:['Animales','Personajes','Paisajes','Coches'],a:'Me encantaría ver tus dibujos algún día.'},
 {id:'leer',kw:['leer','libro','libros','lectura','novela','cuento','cuentos'],q:'¡A mí también me gusta leer! ¿De qué va el libro que más te gusta?',cards:['De aventuras','De misterio','De animales','De humor'],a:'¡Suena genial! Me lo apunto para leerlo.'},
 {id:'lego',kw:['lego','legos','construir','construcciones','piezas','robot','robots','robotica'],q:'¡Qué guay! ¿Qué es lo último que has construido?',cards:['Una nave','Una casa','Un coche','Un robot'],a:'¡Hala! Tienes mucha imaginación.'},
 {id:'vehiculos',kw:['coche','coches','tren','trenes','moto','motos','avion','aviones','camion','formula 1','metro','autobus','barco'],q:'¡Me encantan! ¿Cuál es tu favorito?',cards:['Los trenes','Los coches','Los aviones','Las motos'],a:'¡Qué guay! Sabes mucho de eso.'},
 {id:'comida',kw:['comida','comer','pizza','hamburguesa','macarrones','pasta','tortilla','chuches','helado','chocolate','hambre','bocadillo','patatas','croquetas'],q:'¡Mmm! ¿Cuál es tu comida favorita?',cards:['La pizza','Los macarrones','La hamburguesa','La tortilla'],a:'¡Qué rico! Ahora me ha entrado hambre.'},
 {id:'familia',kw:['mama','madre','papa','padre','hermano','hermana','hermanos','abuelo','abuela','abuelos','primo','prima','primos','familia','tio','tia'],q:'¿Ah, sí? Cuéntame un poco más de tu familia.',cards:['Tengo hermanos','Soy hijo único','Tengo muchos primos'],a:'¡Qué bien! Yo tengo una hermana pequeña que es un terremoto.'},
 {id:'pelis',kw:['pelicula','peliculas','peli','pelis','serie','series','tele','television','youtube','youtuber','dibujos animados','netflix','cine'],q:'¡Me encanta ver pelis! ¿Qué es lo último que has visto?',cards:['Una peli de dibujos','Una serie','Vídeos de YouTube'],a:'¡Me lo apunto para verlo!'},
 {id:'viajes',kw:['playa','montana','campo','viaje','viajar','vacaciones','pueblo','excursion','parque de atracciones'],q:'¡Qué bien suena! ¿Qué es lo que más te gusta de allí?',cards:['Bañarme','Jugar fuera','Estar con mi familia'],a:'¡Qué ganas de vacaciones me están entrando!'},
 {id:'cumple',kw:['cumpleanos','cumple','fiesta','regalo','regalos','tarta'],q:'¡Un cumpleaños! ¿Qué te gustaría que te regalaran?',cards:['Un videojuego','Un libro','Un juguete','Una sorpresa'],a:'¡Buena elección! Yo pediría una bici nueva.'},
 {id:'navidad',kw:['navidad','reyes','reyes magos','papa noel','belen','arbol de navidad','turron'],q:'¡Ya queda poco para Navidad! ¿Qué vas a pedir a los Reyes?',cards:['Un videojuego','Un libro','Lego','Todavía no lo sé'],a:'¡Seguro que te traen algo muy chulo!'},
 {id:'tiempo',kw:['lluvia','llueve','frio','calor','nieve','nieva','tormenta','paraguas'],q:'¿Qué te gusta más: cuando hace frío o cuando hace calor?',cards:['Frío','Calor','Me da igual'],a:'¡Yo igual! Aunque cuando nieva es lo mejor.'},
 {id:'cole',kw:['matematicas','mates','ciencias','ingles','historia','lengua','educacion fisica','plastica','recreo','examen','deberes','profe','profesor','profesora','clase'],q:'¿Y qué asignatura se te da mejor?',cards:['Matemáticas','Ciencias','Inglés','Educación Física'],a:'¡Qué bien! Si un día tengo dudas, te pregunto a ti.'}
];

const has=(t,list)=>list.some(k=>t.includes(norm(k)));
const usados=new Set();let cuenta={},n=0;

function bridge(ret,same){
  if(ret===null)return ' Me ha encantado que me lo cuentes.';
  return same?' Bueno, volviendo a lo de antes...':'';
}
function retorno(st){
  if(st._topic)return {ret:st._ret,same:st._same};
  if(st.kw)return {ret:cur.key,same:true};         // no ha contestado a lo que tocaba: se vuelve a preguntar
  return {ret:st.next===undefined?null:st.next,same:false};  // pregunta libre: su respuesta vale y se sigue
}

const _respond=respond;
respond=function(text,canal,forced){
  if(!awaiting||forced||!(canal==='voz'||canal==='texto'))return _respond(text,canal,forced);
  const st=curStep();
  if(!st||st.interrupt||NO_TEMAS.includes(cur.sc.id))return _respond(text,canal,forced);
  if(!st._topic&&classify(text,st)!=='otro')return _respond(text,canal,forced);  // ha respondido a lo que tocaba
  const key=cur.sc.id+':'+(st._topic?st._from:cur.key);
  if((cuenta[key]||0)>=MAX_POR_PASO)return _respond(text,canal,forced);
  const t=norm(text);
  const {ret,same}=retorno(st);

  // 1) el alumno le pregunta algo a Leo
  const p=PREGUNTAS.find(x=>has(t,x.kw));
  if(p){cuenta[key]=(cuenta[key]||0)+1;
    st.react=Object.assign({},st.react,{tema:{say:p.say+bridge(ret,same),mood:'contento',next:ret}});
    return _respond(text,canal,'tema');}

  // 2) el alumno saca un tema concreto
  const tema=st._topic?null:TEMAS.find(x=>has(t,x.kw));  // dentro de una charla no salta a otro tema
  if(!tema)return _respond(text,canal,forced);
  cuenta[key]=(cuenta[key]||0)+1;
  if(usados.has(tema.id)){
    st.react=Object.assign({},st.react,{tema:{say:'¡Se nota que eso te gusta mucho!'+bridge(ret,same),mood:'contento',next:ret}});
    return _respond(text,canal,'tema');}
  usados.add(tema.id);
  const k='__t'+(++n);
  cur.sc.pasos[k]={say:'',hint:'Cuéntaselo a {avatar}.',cards:tema.cards.map(c=>c[0]==='!'?[c.slice(1),'no']:[c]),
    kw:{no:['no me gusta','no me gustan','odio','no mucho','para nada']},
    react:{otro:{say:tema.a+bridge(ret,same),mood:'contento',next:ret},no:{say:'¡Vale, lo entiendo! A cada uno le gustan cosas distintas.'+bridge(ret,same),mood:'neutral',next:ret}},
    _topic:true,_tema:tema.id,_ret:ret,_same:same,_from:st._topic?st._from:cur.key};
  st.react=Object.assign({},st.react,{tema:{say:tema.q,mood:'contento',next:k}});
  return _respond(text,canal,'tema');
};

const _startSession=startSession;
startSession=function(){usados.clear();cuenta={};return _startSession();};
$('#btnStart').onclick=startSession;
})();
