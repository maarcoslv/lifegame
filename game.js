/* ============================================================
   MI VIDA — simulador de vida
   ============================================================ */
const R=Math.random;
const cl=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
const F=n=>{const v=Math.round(n)||0;return v.toLocaleString('es-ES',{useGrouping:'always'})+' €'};
const pc=(v,d=1)=>(isFinite(v)?v:0).toFixed(d).replace('.',',');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- mundo ---------- */
const JB=[['Dependiente',0,1250,0],['Repartidor',0,1350,0],['Administrativo',1,1800,0],['Técnico especialista',1,2200,6],['Ingeniero',2,3000,0],['Abogado',2,3300,0],['Médico',3,4200,0],['Directivo',3,6500,60]];
const LV=['ESO','Bachillerato o FP','Grado','Máster'];
const ED=[['bach','Bachillerato',24,0,1],['fp','FP de grado superior',24,0,1],['gr','Grado universitario',48,250,2],['ma','Máster',12,700,3]];
const H=[['Casa de tus padres',0],['Habitación compartida',350],['Piso de alquiler',800],['Ático de alquiler',2000]];
const SH=[['c1','Utilitario',12000,-.008,1,120],['c2','Deportivo',65000,-.005,4,350],['c3','Superdeportivo',280000,.001,8,900],['w1','Reloj Casio',80,0,0,0],['w2','Rolex',14000,.004,3,0],['w3','Patek Philippe',90000,.006,6,0],['h1','Piso céntrico',190000,.003,3,250],['h2','Villa con piscina',950000,.0035,8,1200]];
const AS=['Depósito','Bonos','Oro','Fondo','Acciones','Cripto'];
const ASSETS=[['dep','🏦',.0021,0,'Depósito','Garantizado, 2,5 % anual','Riesgo bajo'],['bon','📜',.0035,.012,'Bonos del Estado','Estables, unos 4 % anual','Riesgo bajo'],['gold','🥇',.003,.04,'Oro','Refugio en las crisis, unos 3,6 % anual','Riesgo medio'],['fund','📊',.006,.05,'Fondo indexado','Mercado global, unos 7 % anual','Riesgo medio'],['acc','🚀',.009,.12,'Acciones tecnológicas','Gran potencial y caídas fuertes','Riesgo alto'],['cr','🪙',.01,.3,'Criptomonedas','Oscilaciones brutales','Riesgo muy alto']];

/* ---------- tipos de empresa ---------- */
const BIZ=[
 {id:'cafe',ic:'☕',n:'Cafetería',sec:'Hostelería',cap:12000,base:800,rev:2600,cost:1900,oh:300,max:8,edu:0,exp:0,risk:2,d:'Trato directo, márgenes ajustados y mucha clientela de barrio.'},
 {id:'pan',ic:'🍞',n:'Panadería',sec:'Hostelería',cap:15000,base:900,rev:2800,cost:1900,oh:350,max:6,edu:0,exp:0,risk:2,d:'Producto fresco, horarios duros y clientes fieles de proximidad.'},
 {id:'shop',ic:'🛍️',n:'Tienda online',sec:'Comercio',cap:8000,base:500,rev:3000,cost:2000,oh:400,max:15,edu:0,exp:0,risk:3,d:'Poco capital inicial, mucha competencia y logística.'},
 {id:'design',ic:'🎨',n:'Estudio de diseño',sec:'Servicios',cap:12000,base:700,rev:4200,cost:2800,oh:500,max:20,edu:1,exp:0,risk:3,d:'Proyectos creativos; depende del talento y la reputación.'},
 {id:'mkt',ic:'📣',n:'Agencia de marketing',sec:'Servicios',cap:18000,base:900,rev:5200,cost:3400,oh:700,max:25,edu:1,exp:12,risk:3,d:'Clientes exigentes y campañas que se renuevan cada mes.'},
 {id:'consult',ic:'🧾',n:'Consultoría',sec:'Servicios',cap:15000,base:1200,rev:5000,cost:3200,oh:600,max:30,edu:2,exp:12,risk:2,d:'Vender experiencia; márgenes altos si tienes cartera.'},
 {id:'startup',ic:'🚀',n:'Startup tecnológica',sec:'Tecnología',cap:30000,base:0,rev:7000,cost:4200,oh:1200,max:50,edu:2,exp:0,risk:5,d:'Crece rápido o muere: mucha inversión y riesgo.'},
 {id:'games',ic:'🎮',n:'Estudio de videojuegos',sec:'Tecnología',cap:40000,base:500,rev:6500,cost:4000,oh:1000,max:40,edu:2,exp:12,risk:4,d:'Lanzamientos irregulares y comunidades muy fieles.'},
 {id:'dental',ic:'🦷',n:'Clínica dental',sec:'Salud',cap:80000,base:2000,rev:9000,cost:7600,oh:1500,max:20,edu:3,exp:24,risk:2,d:'Inversión alta en equipo, demanda estable.'},
 {id:'academy',ic:'🎓',n:'Academia',sec:'Educación',cap:20000,base:700,rev:3800,cost:2400,oh:500,max:15,edu:2,exp:0,risk:2,d:'Cursos y clases; ingresos recurrentes por matrícula.'},
 {id:'gym',ic:'🏋️',n:'Gimnasio',sec:'Ocio',cap:60000,base:1200,rev:5000,cost:3000,oh:900,max:20,edu:0,exp:0,risk:3,d:'Cuotas mensuales, pero el equipamiento pesa.'},
 {id:'rest',ic:'🍽️',n:'Restaurante',sec:'Hostelería',cap:45000,base:1500,rev:6000,cost:3800,oh:1000,max:25,edu:0,exp:0,risk:3,d:'Cocina, sala y reputación: negocio de detalle.'},
 {id:'real',ic:'🏠',n:'Inmobiliaria',sec:'Inmobiliaria',cap:25000,base:1000,rev:5500,cost:3200,oh:700,max:30,edu:1,exp:12,risk:3,d:'Comisiones grandes y mercado cíclico.'},
 {id:'garage',ic:'🔧',n:'Taller mecánico',sec:'Servicios',cap:35000,base:900,rev:4800,cost:2900,oh:700,max:15,edu:1,exp:0,risk:2,d:'Oficio estable, utillaje caro y clientes recurrentes.'},
 {id:'pharma',ic:'💊',n:'Farmacia',sec:'Salud',cap:100000,base:2200,rev:8000,cost:6800,oh:1200,max:10,edu:3,exp:12,risk:1,d:'Muy regulada, ingresos previsibles y capital alto.'},
 {id:'hotel',ic:'🏨',n:'Hotel boutique',sec:'Hostelería',cap:250000,base:5000,rev:15000,cost:12500,oh:3000,max:60,edu:1,exp:24,risk:4,d:'Temporada, ocupación y una inversión enorme.'},
 {id:'build',ic:'🏗️',n:'Constructora',sec:'Industria',cap:120000,base:2500,rev:12000,cost:10500,oh:2000,max:80,edu:1,exp:24,risk:4,d:'Grandes contratos y riesgos de obra y impagos.'},
 {id:'log',ic:'🚚',n:'Logística',sec:'Logística',cap:80000,base:1800,rev:10000,cost:8800,oh:1500,max:60,edu:0,exp:12,risk:3,d:'Flota, almacén y márgenes por volumen.'},
 {id:'edit',ic:'📚',n:'Editorial',sec:'Ocio',cap:30000,base:800,rev:4500,cost:3000,oh:600,max:20,edu:2,exp:0,risk:3,d:'Apuestas editoriales y derechos de autor.'},
 {id:'vet',ic:'🐕',n:'Clínica veterinaria',sec:'Salud',cap:70000,base:1500,rev:7000,cost:5900,oh:1000,max:15,edu:3,exp:12,risk:2,d:'Cuidado animal, clientes fieles y urgencias.'},
 {id:'kids',ic:'🧸',n:'Escuela infantil',sec:'Educación',cap:60000,base:1200,rev:5000,cost:3200,oh:800,max:15,edu:2,exp:0,risk:2,d:'Ratio de niños, personal y confianza de las familias.'},
 {id:'cowork',ic:'🖥️',n:'Coworking',sec:'Servicios',cap:120000,base:2000,rev:8000,cost:6800,oh:1500,max:20,edu:1,exp:12,risk:3,d:'Espacios y comunidad; depende de la ocupación.'},
 {id:'market',ic:'📦',n:'Marketplace',sec:'Tecnología',cap:150000,base:2500,rev:12000,cost:10500,oh:2500,max:50,edu:2,exp:24,risk:5,d:'Escalar una plataforma exige mucha caja y talento.'},
 {id:'factory',ic:'🏭',n:'Fábrica',sec:'Industria',cap:300000,base:5000,rev:25000,cost:22500,oh:5000,max:100,edu:1,exp:24,risk:4,d:'Economías de escala, inversión y convenios.'},
 {id:'ai',ic:'🤖',n:'Startup de IA',sec:'Tecnología',cap:100000,base:0,rev:15000,cost:13000,oh:4000,max:60,edu:3,exp:24,risk:5,d:'Talento carísimo y un mercado que cambia cada mes.'},
 {id:'film',ic:'🎬',n:'Estudio de cine',sec:'Ocio',cap:250000,base:3000,rev:18000,cost:15800,oh:4000,max:80,edu:2,exp:24,risk:5,d:'Proyectos largos; un éxito paga varios fracasos.'},
 {id:'wine',ic:'🍷',n:'Bodega',sec:'Industria',cap:150000,base:2000,rev:9000,cost:5500,oh:2000,max:30,edu:0,exp:12,risk:3,d:'Añadas, exportación y reputación de marca.'},
 {id:'solar',ic:'🌱',n:'Energía solar',sec:'Industria',cap:200000,base:3000,rev:20000,cost:17500,oh:3000,max:50,edu:2,exp:24,risk:3,d:'Contratos largos y fuerte inversión inicial.'},
 {id:'hair',ic:'💇',n:'Peluquería',sec:'Servicios',cap:12000,base:600,rev:3000,cost:1800,oh:300,max:8,edu:0,exp:0,risk:2,d:'Cercanía, agenda y clientela fiel.'},
 {id:'gest',ic:'🧾',n:'Gestoría',sec:'Servicios',cap:20000,base:900,rev:4000,cost:2500,oh:500,max:12,edu:2,exp:12,risk:1,d:'Trabajo recurrente y cumplimiento normativo.'}
];
const BIZCAT=['Todos',...new Set(BIZ.map(b=>b.sec))];
const MAXCO=5;
const biz=id=>BIZ.find(b=>b.id==id)||BIZ[0];
const coValOne=c=>Math.max(0,c.lp)*18+c.e*1200;
const coVal=()=>S.cos.reduce((a,c)=>a+coValOne(c),0);
const coProfit=()=>S.cos.reduce((a,c)=>a+c.lp,0);
const hireCost=c=>1000+c.e*250;
const curCo=()=>S.cos[S.cosel]||null;

const NMM=['Marcos','Diego','Pablo','Hugo','Álvaro','Javier','Sergio','Adrián','Iván','Rubén'];
const NMF=['Lucía','Sofía','Alba','Elena','Marta','Paula','Carmen','Laura','Irene','Claudia'];
const LIFE=[.62,1,1.55],LNAME=['Austero','Normal','Alto'];

/* ---------- estado ---------- */
let S,tab='dash',QTY=1,AMT=1000,MODE='mort',TMP={n:'',sx:'',or:''};
const fresh=()=>({m:0,cash:200,hp:95,joy:70,edu:0,st:null,exp:0,job:null,grade:0,perf:50,part:false,paro:0,sal:0,bonus:0,rz:0,pen:0,cos:[],cosel:0,bizf:'Todos',co:null,pa:null,kids:[],it:[],pf:{dep:0,bon:0,fund:0,gold:0,acc:0,cr:0},cb:{dep:0,bon:0,fund:0,gold:0,acc:0,cr:0},auto:null,pl:null,hI:[],hE:[],px:{dep:[100],bon:[100],gold:[100],fund:[100],acc:[100],cr:[100]},hist:[],inc:0,ex:0,home:0,inf:1,ir:.025,rec:0,last:0,lvl:1,ins:false,gym:false,ev:null,warnDebt:false,stats:{joySum:0,peak:0,work:0,study:0},log:['Tienes 16 años, 200 € y terminas la ESO. Decide qué estudiar o ponte a trabajar.'],over:null});
try{const raw=localStorage.getItem('mivida7')||localStorage.getItem('mivida6');if(raw){const o=JSON.parse(raw);S=Object.assign(fresh(),o);S.pf=Object.assign(fresh().pf,o.pf||{});S.cb=Object.assign(fresh().cb,o.cb||{});S.px=Object.assign(fresh().px,o.px||{});S.stats=Object.assign({joySum:0,peak:0,work:0,study:0},o.stats||{})}else S=fresh()}catch(e){S=fresh()}
if(!S.px||!S.hI||!S.pf)S=fresh();
if(!Array.isArray(S.hist))S.hist=[];
if(S.pa){if(!isFinite(S.pa.inc))S.pa.inc=1000;if(!isFinite(S.pa.l))S.pa.l=50}
if(!isFinite(S.lvl))S.lvl=1;if(!isFinite(S.grade))S.grade=0;if(!isFinite(S.perf))S.perf=50;
if(!Array.isArray(S.kids))S.kids=[];if(!Array.isArray(S.it))S.it=[];if(!Array.isArray(S.log))S.log=[];
if(S.auto&&(!S.pf[S.auto.f]||!isFinite(S.auto.n)))S.auto=null;
/* migración: una sola empresa -> varias */
if(!Array.isArray(S.cos))S.cos=[];
if(S.co&&!S.cos.length)S.cos.push({t:'consult',e:Math.max(0,S.co.e|0),rep:Math.max(.5,S.co.rep||1),lp:S.co.lp||0,inv:10000});
S.co=null;
S.cos=S.cos.filter(c=>c&&BIZ.some(b=>b.id==c.t)).map(c=>({t:c.t,e:Math.max(0,Math.min(biz(c.t).max,c.e|0)),rep:Math.max(.5,Math.min(5,+c.rep||1)),lp:isFinite(c.lp)?c.lp:0,inv:+c.inv||biz(c.t).cap}));
if(S.cos.length>MAXCO)S.cos.length=MAXCO;
if(!isFinite(S.cosel))S.cosel=0;
S.cosel=Math.max(0,Math.min(S.cos.length-1,S.cosel|0));
if(!BIZCAT.includes(S.bizf))S.bizf='Todos';
if(S.cos.length&&S.job!=null){S.job=null;S.part=false}
const age=()=>16+Math.floor(S.m/12);

/* ---------- dinero ---------- */
const IRPF=[[12450,.19],[20200,.24],[35200,.30],[60000,.37],[300000,.45],[Infinity,.47]];
function irpf(g){const annual=Math.max(0,g)*12,ss=annual*.0635,base=Math.max(0,annual-ss-5550);let t=0,prev=0;for(const[cap,rate]of IRPF){const part=Math.min(base,cap)-prev;if(part>0)t+=part*rate;prev=cap;if(base<=cap)break}return t/12}
const netPay=g=>Math.max(0,g-g*.0635-irpf(g));
const salary=()=>{if(S.job==null)return 0;const b=JB[S.job][2];return b*(1+Math.min(S.exp/12,20)*.015)*(1+S.bonus)*(1+S.grade*.08)*(1+(S.inf-1)*.8)};
const pfv=()=>Object.values(S.pf).reduce((a,b)=>a+b,0);
const shock=(id,f)=>{S.pf[id]*=f;const p=S.px[id];p[p.length-1]*=f};
const net=()=>S.cash+pfv()+coVal()+S.it.reduce((a,x)=>a+x.v-x.d,0);
const sd=id=>SH.find(s=>s[0]==id);
const charm=()=>S.it.reduce((a,x)=>a+sd(x.id)[4]*Math.min(x.q,3),0);
const say=t=>{S.log.unshift(t);S.log.length=Math.min(S.log.length,40)};
const pay=c=>{if(S.cash+1e-9<c){say('No tienes suficiente dinero ('+F(c)+').');return false}S.cash-=c;return true};
const BASE=380;
function livingCost(){let c=BASE*LIFE[S.lvl]*S.inf;if(S.home==0)c*=age()<18?.22:age()<25?.38:.65;else if(S.home>0)c+=H[S.home][1]*S.inf;return c}

/* ---------- sucesos aleatorios ---------- */
const EV=[
 ()=>{const x=3000+R()*15000;S.cash+=x;return'Recibes una herencia de '+F(x)+'.'},
 ()=>{const x=(800+R()*2500)*(S.ins?.4:1);S.cash-=x;return'Hacienda te reclama '+F(x)+' tras una revisión.'},
 ()=>{S.hp-=S.ins?4:9;const x=(S.ins?250:800)*S.inf;S.cash-=x;return'Caes enfermo: pierdes salud y pagas '+F(x)+' de gastos médicos.'+(S.ins?' Tu seguro cubre la mayor parte.':'')},
 ()=>{shock('fund',.7);shock('acc',.6);shock('cr',.4);shock('gold',1.1);return'Crisis bursátil: fondo −30 %, acciones −40 %, criptos −60 %. El oro aguanta.'},
 ()=>{shock('fund',1.15);shock('acc',1.3);shock('cr',1.8);return'Rally en los mercados: fondo +15 %, acciones +30 %, criptos +80 %.'},
 ()=>{if(!S.cos.length)return'Un mes tranquilo.';const c=S.cos[Math.floor(R()*S.cos.length)];const x=15000*c.rep;S.cash+=x;return biz(c.t).n+' cierra un contrato enorme: '+F(x)+'.'},
 ()=>{S.rec=12;return'Recesión económica: las empresas facturan menos durante un año y suben los despidos.'},
 ()=>{S.joy=cl(S.joy+15);return'Gran fin de semana con amigos: ganas ánimo.'},
 ()=>{const car=S.it.find(x=>x.id[0]=='c');if(!car)return'Un mes tranquilo.';const x=600*S.inf;S.cash-=x;return'Tu coche necesita una reparación: '+F(x)+'.'},
 ()=>{const x=250*S.inf;S.cash-=x;return'Suben los suministros y gastos imprevistos: '+F(x)+'.'},
 ()=>{S.joy=cl(S.joy+8);return'Ganas un pequeño premio en un sorteo local.'},
 ()=>{if(!S.pa)return'Un mes tranquilo.';S.pa.l=cl(S.pa.l+8);return'Un plan especial con '+S.pa.n+' fortalece la relación.'}
];

/* ---------- decisiones ---------- */
const CEV=[
 {id:'promo',ok:()=>S.job!=null&&S.exp>=12,title:'Oferta de ascenso',txt:'Tu jefe te ofrece más responsabilidad y un 15 % más de sueldo, pero también más horas.',opts:[
  {t:'Aceptar',d:'+12 % de sueldo · −8 ánimo',f:()=>{S.bonus=Math.min(.6,S.bonus+.12);S.joy=cl(S.joy-8);S.perf=cl(S.perf+6);say('Aceptas el ascenso. Tu sueldo sube un 12 %.')}},
  {t:'Rechazar',d:'+3 ánimo',f:()=>{S.joy=cl(S.joy+3);say('Rechazas el ascenso para cuidar tu tiempo.')}}]},
 {id:'joboffer',ok:()=>S.job!=null&&S.exp>=24,title:'Otra empresa te quiere',txt:'Una competidora te ofrece un 22 % más de sueldo. Empezarías con menos antigüedad.',opts:[
  {t:'Cambiar',d:'+18 % de sueldo · −4 ánimo',f:()=>{S.bonus=Math.min(.6,S.bonus+.18);S.joy=cl(S.joy-4);say('Cambias de empresa: +18 % de sueldo.')}},
  {t:'Quedarte',d:'+2 ánimo',f:()=>{S.joy=cl(S.joy+2);say('Decides quedarte donde estás.')}}]},
 {id:'course',ok:()=>age()<58&&S.cash>=1200,title:'Curso de especialización',txt:'Un curso de 1.200 € puede mejorar tu perfil profesional de forma permanente.',opts:[
  {t:'Matricularte',d:'1.200 € · +6 % de sueldo',f:()=>{if(!pay(1200))return;S.bonus=Math.min(.6,S.bonus+.06);S.joy=cl(S.joy-3);say('Terminas el curso: +6 % de sueldo.')}},
  {t:'Ahora no',d:'Sin cambios',f:()=>say('Dejas el curso para otro momento.')}]},
 {id:'friendloan',ok:()=>S.cash>=500,title:'Un amigo te pide dinero',txt:'Necesita 500 € para salir de un apuro. No hay papeles ni garantías.',opts:[
  {t:'Prestarle',d:'−500 € · puede devolver 700 €',f:()=>{if(!pay(500))return;if(R()<.6){S.cash+=700;S.joy=cl(S.joy+4);say('Tu amigo te devuelve 700 €.')}else{S.joy=cl(S.joy+2);say('Tu amigo no puede devolverte los 500 €.')}}},
  {t:'Negarte',d:'−2 ánimo',f:()=>{S.joy=cl(S.joy-2);say('Prefieres no prestar dinero a un amigo.')}}]},
 {id:'startup',ok:()=>S.cash>=2000,title:'Inversión de un amigo',txt:'Su startup busca 2.000 €. Si funciona, multiplicas por cuatro; si no, lo pierdes todo.',opts:[
  {t:'Invertir',d:'−2.000 € · 25 % de x4',f:()=>{if(!pay(2000))return;if(R()<.25){S.cash+=8000;say('La startup despega: recuperas 8.000 €.')}else say('La startup fracasa: pierdes 2.000 €.')}},
  {t:'Pasar',d:'Sin riesgo',f:()=>say('Prefieres no arriesgar en la startup.')}]},
 {id:'checkup',ok:()=>age()>=35&&S.cash>=350,title:'Revisión médica',txt:'Puedes hacerte un chequeo privado completo por 350 €. Conviene no esperar.',opts:[
  {t:'Hacerte el chequeo',d:'350 € · +10 salud',f:()=>{if(!pay(350))return;S.hp=cl(S.hp+10);say('La revisión detecta a tiempo un problema: ganas salud.')}},
  {t:'Dejarlo',d:'−2 salud',f:()=>{S.hp=cl(S.hp-2);say('Aplazas la revisión.')}}]},
 {id:'sellco',ok:()=>S.cos.length>0,title:'Oferta por una empresa',txt:'Un fondo ofrece comprar una de tus empresas por un 35 % más de su valor contable.',opts:[
  {t:'Vender',d:'+35 % sobre el valor',f:()=>{if(!S.cos.length)return;const i=Math.max(0,Math.min(S.cos.length-1,S.cosel)),c=S.cos[i],v=coValOne(c)*1.35;S.cash+=v;S.cos.splice(i,1);S.cosel=Math.max(0,Math.min(S.cos.length-1,S.cosel));say('Vendes '+biz(c.t).n+' por '+F(v)+'.')}},
  {t:'Seguir',d:'Conservas tus empresas',f:()=>say('Rechazas la oferta y sigues al frente de tus empresas.')}]},
 {id:'wedding',ok:()=>age()>=20&&S.cash>=250,title:'Boda de un amigo',txt:'Tu mejor amigo se casa. La boda, el regalo y el viaje suman unos 250 €.',opts:[
  {t:'Ir',d:'−250 € · +6 ánimo',f:()=>{if(!pay(250))return;S.joy=cl(S.joy+6);say('Disfrutas de la boda de tu amigo.')}},
  {t:'No ir',d:'−4 ánimo',f:()=>{S.joy=cl(S.joy-4);say('Te pierdes la boda de tu amigo.')}}]},
 {id:'baby',ok:()=>S.pa&&S.kids.length<4&&age()>=20&&age()<=45,title:'¿Un hijo?',txt:'Tu pareja y tú habláis de ampliar la familia. La crianza cuesta unos 3.000 € al principio.',opts:[
  {t:'Tenerlo',d:'−3.000 € · +10 ánimo',f:()=>{if(!pay(3000))return;S.kids.push(S.m);S.joy=cl(S.joy+10);say('Nace tu hijo número '+S.kids.length+'.')}},
  {t:'Esperar',d:'Sin cambios',f:()=>say('Decidís esperar un poco más.')}]}
];

function mkPartner(){const sx=S.pl.sx,o=S.pl.or,rd=R()<.5?'m':'f',g=o=='Heterosexual'?(sx=='Hombre'?'f':sx=='Mujer'?'m':rd):o=='Homosexual'?(sx=='Hombre'?'m':sx=='Mujer'?'f':rd):rd,L=g=='m'?NMM:NMF;return{n:L[Math.floor(R()*L.length)],g,l:50,mar:false,warn:false,inc:Math.round(700+R()*1700)}}
function pickChoice(){const o=CEV.filter(e=>e.ok());if(!o.length)return;S.ev={id:o[Math.floor(R()*o.length)].id}}
function runChoice(i){if(!S.ev)return;const e=CEV.find(x=>x.id==S.ev.id);if(!e)return;const o=e.opts[i];if(!o)return;o.f();S.ev=null}
function fix(){['cash','hp','joy','inc','ex','inf','ir'].forEach(k=>{if(!isFinite(S[k]))S[k]=k=='cash'||k=='inc'||k=='ex'?0:k=='inf'?1:k=='ir'?.025:50});for(const k in S.pf)if(!isFinite(S.pf[k]))S.pf[k]=0;for(const k in S.cb)if(!isFinite(S.cb[k]))S.cb[k]=0}

/* ---------- acciones ---------- */
function act(k,a){try{act0(k,a);fix()}catch(err){console.error(err);say('Error interno: '+err.message)}try{localStorage.setItem('mivida7',JSON.stringify(S))}catch(e){}render()}
function act0(k,a){
 if(k=='t1')tick();
 else if(k=='t12'){for(let i=0;i<12&&!S.over&&!S.ev;i++)tick()}
 else if(k=='qty')QTY=+a;
 else if(k=='mode')MODE=MODE=='mort'?'cash':'mort';
 else if(k=='amt')AMT=a=='max'?Math.max(1,Math.floor(S.cash)):+a;
 else if(k=='sx')TMP.sx=a;
 else if(k=='or')TMP.or=a;
 else if(k=='start'){if(!TMP.n.trim()||!TMP.sx||!TMP.or)return;S.pl={n:TMP.n.trim(),sx:TMP.sx,or:TMP.or};S.ex=livingCost();S.inc=0;S.last=0;say('Hola, '+S.pl.n+'. Tienes 16 años y 200 €. Estudiar en casa de tus padres cuesta poco; trabajar pronto también es una opción.')}
 else if(k=='tab')tab=a;
 else if(k=='new'){S=fresh();tab='dash';QTY=1;AMT=1000;MODE='mort';TMP={n:'',sx:'',or:''}}
 else if(k=='study'){const e=ED.find(x=>x[0]==a);const ok=a=='gr'?S.edu==1:a=='ma'?S.edu==2:S.edu==0;
  if(S.st||S.job!=null||S.cos.length)say('Para estudiar a tiempo completo no puedes tener trabajo ni empresa.');
  else if(!ok)say('No cumples el nivel previo.');
  else{S.st={id:a,l:e[2],lv:e[4]};say('Empiezas: '+e[1]+'.')}}
 else if(k=='drop'){S.st=null;say('Abandonas los estudios.')}
 else if(k=='apply'){const j=JB[+a];if(S.st||S.cos.length)return say('No puedes trabajar ahora: termina o abandona lo que haces.');
  if(S.edu<j[1]||S.exp<j[3])say('Requisitos: '+LV[j[1]]+(j[3]?' y '+j[3]+' meses de experiencia':'')+'.');
  else if(R()<.5+S.joy/400+(S.exp>=24?.1:0)+S.perf/1000){S.job=+a;S.bonus=0;S.grade=0;S.perf=50;S.part=false;S.paro=0;say('Consigues el puesto de '+j[0]+'.')}else say('No te seleccionan para '+j[0]+'. Prueba otra vez.')}
 else if(k=='quit'){S.job=null;say('Dejas tu trabajo.')}
 else if(k=='raise'){if(S.job==null||S.rz>0)say('Solo puedes pedir un aumento una vez al año, estando empleado.');else{S.rz=12;if(R()<.28+Math.min(.35,S.exp/300)+S.perf/500){S.bonus=Math.min(.6,S.bonus+.05);S.perf=cl(S.perf+5);say('Te suben el sueldo un 5 %.')}else{S.perf=cl(S.perf-5);say('Te niegan el aumento.')}}}
 else if(k=='part'){if(S.cos.length||S.job!=null)return;S.part=!S.part}
 else if(k=='lvl'){S.lvl=+a;say('Nivel de vida: '+LNAME[S.lvl]+'.')}
 else if(k=='ins'){S.ins=!S.ins;say(S.ins?'Contratas un seguro de salud.':'Cancelas el seguro de salud.')}
 else if(k=='gym'){S.gym=!S.gym;say(S.gym?'Te apuntas al gimnasio.':'Dejas el gimnasio.')}
 else if(k=='home'){if(+a>0&&age()<18)say('Necesitas ser mayor de edad para alquilar.');else if(S.it.some(x=>x.id[0]=='h'))say('Ya tienes casa propia.');else S.home=+a}
 else if(k=='co'){const b=biz(a);
  if(!BIZ.some(x=>x.id==a))return;
  if(age()<18)say('Necesitas ser mayor de edad.');
  else if(S.st)say('Termina tus estudios primero.');
  else if(S.cos.length>=MAXCO)say('Ya tienes '+MAXCO+' empresas, el máximo. Vende alguna para fundar otra.');
  else if(S.edu<b.edu)say('Necesitas '+LV[b.edu]+' para abrir '+b.n+'.');
  else if(S.exp<b.exp)say('Necesitas '+b.exp+' meses de experiencia laboral para abrir '+b.n+'.');
  else if(pay(b.cap)){S.job=null;S.part=false;S.cos.push({t:a,e:0,rep:1,lp:0,inv:b.cap});S.cosel=S.cos.length-1;say('Fundas '+b.n+' por '+F(b.cap)+'.')}}
 else if(k=='cosel'){S.cosel=Math.max(0,Math.min(S.cos.length-1,+a|0))}
 else if(k=='bizf'){S.bizf=a}
 else if(k=='hire'){const c=curCo();if(!c)return;const b=biz(c.t),rem=b.max-c.e;
  if(rem<=0)return say(b.n+' ya tiene el máximo de '+b.max+' empleados.');
  const want=a=='max'?rem:Math.max(1,+a||1);
  let total=0,cnt=0;for(let i=0;i<Math.min(want,rem);i++){const h=hireCost({e:c.e+i});if(total+h>S.cash)break;total+=h;cnt++}
  if(!cnt)say('No tienes caja suficiente para contratar.');
  else{S.cash-=total;c.e+=cnt;say('Contratas '+cnt+' empleado'+(cnt>1?'s':'')+' para '+b.n+' por '+F(total)+'.')}}
 else if(k=='fire'){const c=curCo();if(!c)return;if(c.e>0){c.e--;say('Despides a un empleado de '+biz(c.t).n+'.')}else say(biz(c.t).n+' no tiene empleados que despedir.')}
 else if(k=='mkt'){const c=curCo();if(!c)return;const cost=Math.round(2500*(1+c.rep));
  if(c.rep>=5)say('La reputación de '+biz(c.t).n+' ya es máxima.');
  else if(pay(cost)){c.rep=Math.min(5,c.rep+.25);say('Campaña de marketing en '+biz(c.t).n+': reputación '+pc(c.rep,1)+'/5.')}}
 else if(k=='sellco'){const c=curCo();if(!c)return;const v=coValOne(c);S.cash+=v;S.cos.splice(S.cosel,1);S.cosel=Math.max(0,Math.min(S.cos.length-1,S.cosel));say('Vendes '+biz(c.t).n+' por '+F(v)+'.')}
 else if(k=='date'){if(S.pa)return;if(pay(150)){if(R()<.22+charm()*.05+S.joy/500){S.pa=mkPartner();say('Conoces a '+S.pa.n+'. Empezáis a salir.')}else say('La cita no sale bien.')}}
 else if(k=='gift'){if(S.pa&&pay(250)){S.pa.l=cl(S.pa.l+12);S.joy=cl(S.joy+4);say('Detalle para '+S.pa.n+'.')}}
 else if(k=='plan'){if(S.pa&&pay(200)){S.pa.l=cl(S.pa.l+8);S.joy=cl(S.joy+6);say('Un plan especial con '+S.pa.n+'.')}}
 else if(k=='marry'){if(!S.pa||S.pa.mar)return;if(age()<18)say('Necesitas ser mayor de edad.');else if(S.pa.l<60)say('Necesitas amor de 60 o más para casarte.');else if(pay(8000)){S.pa.mar=true;S.joy=cl(S.joy+15);say('Te casas con '+S.pa.n+'.')}}
 else if(k=='baby'){if(!S.pa)return;if(age()<18)say('Necesitas ser mayor de edad.');else if(S.kids.length<4&&S.pa.l>=40&&pay(3000)){S.kids.push(S.m);S.joy=cl(S.joy+10);say('Nace tu hijo número '+S.kids.length+'.')}}
 else if(k=='doc'){const c=S.ins?80:300;if(pay(c)){S.hp=cl(S.hp+10);say('Vas al médico y ganas salud.')}}
 else if(k=='vac'){if(pay(1500)){S.joy=cl(S.joy+20);S.hp=cl(S.hp+5);say('Unas vacaciones reparadoras.')}}
 else if(k=='ev')runChoice(+a);
 else if(k=='buy'){const d=sd(a),q=Math.max(1,QTY),pr=d[2]*S.inf,h=a[0]=='h',mo=h&&MODE=='mort';let ok=true,down=pr*q,dbt=0,pm=0;
  if(a[0]=='c'&&age()<18){say('Necesitas ser mayor de edad para el carnet.');ok=false}
  else if(h&&age()<(mo?21:18)){say('Necesitas ser mayor de '+(mo?'21 para una hipoteca.':'edad para comprar.'));ok=false}
  else if(h){down=pr*q*(mo?.38:1.08);
   if(mo){const r=(.022+S.ir)/12,np=pr*q*.7*r/(1-Math.pow(1+r,-300)),cu=S.it.reduce((x,y)=>x+y.p,0);dbt=pr*q*.7;pm=np;
    if(cu+np>S.inc*.4){say('El banco rechaza la hipoteca: las cuotas superarían el 40 % de tus ingresos ('+F(S.inc*.4)+'/mes).');ok=false}}}
  if(ok&&pay(down)){let x=S.it.find(y=>y.id==a);if(!x){x={id:a,v:0,d:0,p:0,q:0};S.it.push(x)}x.v+=pr*q;x.d+=dbt;x.p+=pm;x.q+=q;if(h)S.home=-1;S.joy=cl(S.joy+d[4]*1.5*Math.min(q,3));say('Compras '+q+' × '+d[1]+' por '+F(pr*q)+'.')}}
 else if(k=='sell'){const[i,n]=a.split(','),x=S.it[+i];if(!x)return;const m=Math.min(+n,x.q),fr=m/x.q,v=x.v*fr,dd=x.d*fr;S.cash+=v*.97-dd;say('Vendes '+m+' × '+sd(x.id)[1]+' por '+F(v*.97-dd)+' netos.');x.v-=v;x.d-=dd;x.p*=1-fr;x.q-=m;if(x.q<=0)S.it.splice(+i,1);if(!S.it.some(y=>y.id[0]=='h')&&S.home==-1)S.home=2}
 else if(k=='sellp'){const[f,n0]=a.split(','),v=S.pf[f],m=Math.min(n0=='A'?AMT:+n0,v);if(m<=0)return;const fr=m/v,t=Math.max(0,m-S.cb[f]*fr)*.19;S.cash+=m-t;S.pf[f]-=m;S.cb[f]-=S.cb[f]*fr;say('Vendes '+F(m)+(t>0?' y pagas '+F(t)+' de impuestos.':'.'))}
 else if(k=='inv'){const[f,n0]=a.split(','),n=n0=='A'?AMT:+n0;if(n>0&&pay(n)){S.pf[f]+=n;S.cb[f]+=n}}
 else if(k=='auto'){S.auto=S.auto&&S.auto.f==a?null:{f:a,n:AMT};say(S.auto?'Aportación automática: '+F(AMT)+'/mes en '+ASSETS.find(x=>x[0]==a)[4]+'.':'Desactivas la aportación automática.')}
 else if(k=='wd'){const v=S.pf[a],t=Math.max(0,v-S.cb[a])*.19;S.cash+=v-t;S.pf[a]=0;S.cb[a]=0;if(v>0)say('Retiras '+F(v)+(t>0?' y pagas '+F(t)+' de impuestos por las ganancias.':'.'))}
}

/* ---------- paso del tiempo ---------- */
function tick(){
 if(S.over||S.ev)return;
 S.m++;const a=age();
 if(S.m%12==0){S.ir=.01+R()*.05;if(S.pen>0)S.pen*=1+S.ir;say('Cumples '+a+'. Inflación anual: '+pc(S.ir*100)+' %.')}
 S.inf*=Math.pow(1+S.ir,1/12);
 let inc=0,ex=livingCost();

 if(S.st){const e=ED.find(e=>e[0]==S.st.id);ex+=e[3]*S.inf;if(S.home==0&&a<26)inc+=110*S.inf;S.stats.study++;if(--S.st.l<=0){S.edu=S.st.lv;say('Terminas tus estudios: '+LV[S.edu]+'.');S.st=null}}

 if(S.cos.length){let tp=0;S.cos.forEach(c=>{const b=biz(c.t),rep=Math.max(.5,c.rep),rm=.7+.3*rep;const pfac=1-.25*(c.e/b.max);let g=0;for(let i=0;i<c.e;i++)g+=(b.rev*(.8+R()*.4)-b.cost)*rm*pfac*S.inf*(S.rec>0?.65:1);c.lp=b.base*rep*S.inf+g-b.oh*S.inf;tp+=c.lp;if(R()<b.risk*.0035){const loss=(b.cap*.02+R()*b.cap*.03)*S.inf;S.cash-=loss;say('Contratiempo en '+b.n+': '+F(loss)+' de gastos imprevistos.')}});inc+=tp>0?tp*.75:tp}
 else if(S.job!=null){
  S.sal=salary();inc=netPay(S.sal);S.exp++;S.stats.work++;
  S.perf=cl(S.perf+(55+S.joy*.35-S.perf)*.08);
  if(S.grade<3&&S.exp>0&&S.exp%24==0&&R()<.35+S.perf/300){S.grade++;say('Ascenso interno: tu sueldo base sube un 8 %.')}
  if(a>=67&&S.m%12==0){S.pen=netPay(S.sal*.65);S.job=null;say('Te jubilas. Cobras una pensión de '+F(S.pen)+'/mes.')}
  else if(R()<(S.rec>0?.025:.01)){S.job=null;S.paro=S.exp>=12?6:0;say('Te despiden.'+(S.paro?' Cobras el paro durante 6 meses.':' No has cotizado lo suficiente para cobrar paro.'))}
 }
 else if(S.paro>0){inc=netPay(S.sal*.7);S.paro--}
 if(S.part&&S.job==null&&!S.cos.length)inc+=netPay(450*S.inf);
 inc+=S.pen;
 if(S.rec>0)S.rec--;if(S.rz>0)S.rz--;

 if(S.pa){const p=S.pa;if(p.mar){inc+=p.inc*S.inf*.45;ex+=120*S.inf}p.l-=p.mar?.7:1.05;if(p.l<22&&!p.warn){p.warn=true;say(p.n+' se está distanciando. Dedica tiempo a la relación.')}
  if(p.l<=0){const mar=p.mar;if(mar){let loss=(Math.max(0,S.cash)+pfv())*.3;const fc=Math.min(Math.max(0,S.cash),loss);S.cash-=fc;loss-=fc;const tot=pfv();if(loss>0&&tot>0)for(const k in S.pf)S.pf[k]-=Math.min(S.pf[k],loss*S.pf[k]/tot)}say(p.n+' te deja.'+(mar?' El divorcio te cuesta el 30 % de vuestros ahorros.':''));S.pa=null;S.joy=cl(S.joy-20)}}

 S.kids.forEach(b=>{if(S.m-b<216)ex+=450*S.inf});
 if(S.ins)ex+=55*S.inf;
 if(S.gym)ex+=30*S.inf;

 S.it.forEach(x=>{const d=sd(x.id);x.v*=1+d[3]+(R()-.5)*.004;ex+=d[5]*S.inf*x.q;if(x.d>0){ex+=x.p;x.d-=Math.min(x.d,x.p-Math.max(0,x.d)*.035/12);if(x.d<=0){x.d=0;x.p=0;say('Terminas de pagar la hipoteca de tu '+d[1]+'.')}}});
 ASSETS.forEach(x=>{const g=1+x[2]+(R()-.5)*x[3],p=S.px[x[0]];S.pf[x[0]]*=g;p.push(p[p.length-1]*g);if(p.length>240)p.shift()});

 S.cash+=inc-ex;S.last=inc-ex;S.inc=inc;S.ex=ex;
 S.cash*=S.cash>0?1.0005:1.012;
 if(S.auto&&S.auto.n>0&&S.cash>=S.auto.n){S.cash-=S.auto.n;S.pf[S.auto.f]+=S.auto.n;S.cb[S.auto.f]+=S.auto.n}
 if(S.cash>0)S.warnDebt=false;
 if(S.cash<-5000&&!S.warnDebt){S.warnDebt=true;say('Estás en números rojos. Vende activos o recorta gastos antes de que los acreedores actúen.')}
 if(S.cash<-15000&&pfv()>0){const tot=pfv(),need=Math.min(tot,-S.cash+1000);let sold=0;for(const k in S.pf){const take=Math.min(S.pf[k],need*S.pf[k]/tot);S.pf[k]-=take;S.cb[k]=Math.max(0,S.cb[k]-take);sold+=take}S.cash+=sold;say('Vendes parte de tu cartera para pagar deudas: '+F(sold)+'.')}
 if(S.cash<-30000){while(S.cash<-30000&&S.it.some(x=>x.id[0]=='h')){const prop=S.it.find(x=>x.id[0]=='h');S.cash+=prop.v*.9-prop.d;S.it=S.it.filter(x=>x!==prop);if(!S.it.some(x=>x.id[0]=='h')&&S.home==-1)S.home=2;say('El banco ejecuta la hipoteca y vende una de tus viviendas.')}}

 const target=[44,56,68][S.lvl]+(S.pa?4:0)+(S.kids.length?2:0)-(S.cos.length?4:0)-(S.job==null&&!S.pen?4:0);
 S.joy+=(target-S.joy)*.06;
 if(S.cash<0)S.joy-=2.5;
 if(S.st)S.joy-=.15;
 if(a>=26&&S.home==0)S.joy-=.5;
 if(S.gym)S.joy+=.15;
 let decay=a>65?.25:a>50?.14:a>35?.06:.025;
 if(S.gym)decay*=.72;if(S.ins)decay*=.9;if(S.lvl==2)decay*=1.06;
 S.hp-=decay;
 S.hp=cl(S.hp);S.joy=cl(S.joy);

 if(R()<.12)say(EV[Math.floor(R()*EV.length)]());
 if(!S.ev&&S.m>18&&R()<.035)pickChoice();

 S.stats.joySum+=S.joy;S.stats.peak=Math.max(S.stats.peak,net());
 S.hI.push(Math.round(inc));S.hE.push(Math.round(ex));if(S.hI.length>24){S.hI.shift();S.hE.shift()}
 S.hist.push(Math.round(net()));if(S.hist.length>240)S.hist.shift();

 if(S.hp<=0)S.over='Tu salud se agotó.';
 else if(a>=100)S.over='Llegas a los 100 años.';
 else if(S.cash<-30000)S.over='Los acreedores te embargan.';
 else if(a>60&&R()<Math.max(0,(a-60)*(a-60)*.000014)*(1.7-S.hp/100)*(1-Math.min(.35,Math.max(0,net())/2e6*.35)))S.over='Falleces a los '+a+' años.';
}
const UP=[1,1000,70,100,180,45000],UN=['€','bonos','g','part.','acc.','monedas'];
const AC=['#7aa2b8','#9a8fc4','#d4a63a','#6fbf8b','#c47fa0','#d98b5a'],RK=[1,2,2,3,4,5],JI=['🛍️','🛵','🗂️','🔧','⚙️','⚖️','🩺','👔'];
const IC=id=>({c1:'🚗',c2:'🏎️',c3:'🚀',w1:'⌚',w2:'⌚',w3:'💎',h1:'🏙️',h2:'🏡'})[id];
const dA=a=>a!==undefined?` data-a="${a}"`:'';
const A=(t,k,a,c=0,s='')=>`<button class="b ${s}" data-k="${k}"${dA(a)}${c>S.cash?' disabled':''}>${t}</button>`;
const IB=(ic,l,k,a,c=0,cls='')=>`<button class="ib ${cls}" data-k="${k}"${dA(a)}${c>S.cash?' disabled':''}><span>${ic}</span>${l}</button>`;
const TL=(ic,t,sb,k,a,off,c=0)=>`<button class="tile${off?' lock':''}" data-k="${k}"${dA(a)}${c>S.cash?' disabled':''}><span>${ic}</span><b>${t}</b><small>${sb}</small></button>`;
const P=(t,b,c='')=>`<div class="cd ${c}">${t?`<h3>${t}</h3>`:''}${b}</div>`;
const KP=(ic,l,v,sb,c='')=>`<div class="kp"><span>${ic}</span><div><small>${l}</small><b class="${c}">${v}</b>${sb?`<small>${sb}</small>`:''}</div></div>`;
const bar=(ic,label,v,c)=>`<div class="mb"><span>${ic} ${label} <b>${Math.round(v)}</b></span><div><u style="width:${cl(v)}%;background:${c}"></u></div></div>`;
const spark=(arr,col,h=70)=>{if(arr.length<2)return'<small>Pasa unos meses para ver el gráfico</small><br>';const mn=Math.min(...arr),mx=Math.max(...arr),pt=arr.map((v,i)=>`${(i/(arr.length-1)*300).toFixed(1)},${(h-4-(v-mn)/((mx-mn)||1)*(h-8)).toFixed(1)}`).join(' ');return`<svg viewBox="0 0 300 ${h}" preserveAspectRatio="none" class="sv" style="height:${h}px"><polygon points="0,${h} ${pt} 300,${h}" fill="${col}" fill-opacity=".16"/><polyline points="${pt}" fill="none" stroke="${col}" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`};
const donut=(parts)=>{const t=Math.max(1,parts.reduce((a,p)=>a+Math.max(0,p[0]),0));let o=25;return`<svg viewBox="0 0 42 42" class="dn"><circle cx="21" cy="21" r="15.9155" fill="none" stroke="#1c1e22" stroke-width="6"/>${parts.map(p=>{const v=Math.max(0,p[0])/t*100,e=`<circle cx="21" cy="21" r="15.9155" fill="none" stroke="${p[1]}" stroke-width="6" stroke-dasharray="${v} ${100-v}" stroke-dashoffset="${o}"/>`;o-=v;return e}).join('')}</svg>`};
const multi=()=>{const L=ASSETS.map(x=>S.px[x[0]].slice(-120));if(L.every(a=>a.length<2))return'<small>Pasa unos meses para ver el gráfico</small><br>';const all=L.flat(),mn=Math.min(...all),mx=Math.max(...all);return`<svg viewBox="0 0 300 110" preserveAspectRatio="none" class="sv" style="height:110px">${L.map((a,j)=>a.length<2?'':`<polyline points="${a.map((v,i)=>`${(i/(a.length-1)*300).toFixed(1)},${(106-(v-mn)/((mx-mn)||1)*102).toFixed(1)}`).join(' ')}" fill="none" stroke="${AC[j]}" stroke-width="1.8" vector-effect="non-scaling-stroke"/>`).join('')}</svg>`};
const lgd=(c,t)=>`<span><i style="background:${c}"></i>${t}</span>`;
const ICP={car:'M3 15l1.6-5.2a2 2 0 011.9-1.4h11a2 2 0 011.9 1.4L21 15v3H3zM5 12.5h14M7.5 18v1M16.5 18v1M7 15h.01M17 15h.01',watch:'M9 3h6l1 4H8zM9 21h6l1-4H8zM12 7a5 5 0 100 10 5 5 0 000-10zM12 10v2l1.5 1',gem:'M6 3h12l4 6-10 12L2 9zM2 9h20M9 3l3 6 3-6',building:'M5 21V4h9v17M14 9h5v12M8 8h3M8 12h3M8 16h3M3 21h18',home:'M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6',villa:'M2 12l10-8 10 8M5 11v9h14v-9M9 20v-5h6v5M3 20h18',bank:'M3 9l9-5 9 5M5 9v9M9 9v9M15 9v9M19 9v9M3 21h18',chart:'M4 20V4M4 20h16M8 16l4-5 3 3 5-7',bars:'M5 20v-8M12 20V5M19 20v-12',coin:'M12 3a9 9 0 100 18 9 9 0 000-18zM14.5 9c-.5-1.5-5-1.5-5 .5s5 1.5 5 3.5-4.5 2-5 .5M12 6.5v11',wallet:'M3 7h16a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2zM3 7l12-3v3M16 14h2',down:'M12 4v12M7 11l5 5 5-5M4 20h16',up:'M12 20V8M7 13l5-5 5 5M4 4h16',heart:'M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z',smile:'M12 3a9 9 0 100 18 9 9 0 000-18zM8.5 14c1 1.7 5.9 1.7 7 0M9 9.5v.5M15 9.5v.5',plus:'M9 3h6v6h6v6h-6v6H9v-6H3V9h6z',plus2:'M12 5v14M5 12h14',minus:'M5 12h14',user:'M12 4a4 4 0 100 8 4 4 0 000-8zM4 21c0-4.5 3.5-7 8-7s8 2.5 8 7',users:'M9 5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM2 20c0-4 3-6 7-6s7 2 7 6M17 6a3 3 0 010 6M19 14c2 .8 3 2.7 3 6',gift:'M3 9h18v4H3zM5 13v8h14v-8M12 9v12M12 9C9 9 8 5 10 5s2 4 2 4zM12 9c3 0 4-4 2-4s-2 4-2 4z',ring:'M12 21a6 6 0 100-12 6 6 0 000 12zM9 9L7 5h10l-2 4',cap:'M2 9l10-5 10 5-10 5zM6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6',brief:'M3 8h18v12H3zM9 8V5h6v3M3 13h18',wrench:'M15 4a4 4 0 00-3.5 5.5L4 17l3 3 7.5-7.5A4 4 0 0020 9l-2.5 2.5-3-3z',scale:'M12 4v16M6 20h12M5 7h14M5 7l-3 7a3 3 0 006 0zM19 7l-3 7a3 3 0 006 0z',rocket:'M12 3c4 2 6 6 5 11l-3 3h-4l-3-3c-1-5 1-9 5-11zM12 11a1.5 1.5 0 100 .1M9 17l-3 4M15 17l3 4',mega:'M3 10v4l12 5V5zM15 8c3 1 3 7 0 8M6 14v5',refresh:'M20 11a8 8 0 00-14-4M4 4v4h4M4 13a8 8 0 0014 4M20 20v-4h-4',door:'M6 21V3h10v18M6 21h14M13 12h1',flame:'M12 3c1 4 5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z',bed:'M3 18V7M3 14h18v4M21 14v-2a3 3 0 00-3-3h-7v5',clock:'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2',bulb:'M9 18h6M10 21h4M12 3a6 6 0 00-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 00-4-10z',sun:'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2',chip:'M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4',store:'M4 9l1-5h14l1 5M4 9a2.5 2.5 0 005 0 2.5 2.5 0 006 0 2.5 2.5 0 005 0M5 12v8h14v-8',scooter:'M5 18a2 2 0 100-.1M19 18a2 2 0 100-.1M7 18h10M16 18l-2-9h3M12 6h3',folder:'M3 6h7l2 2h9v11H3z',ingot:'M3 17l3-8h12l3 8zM8 13h8',scroll:'M6 3h11a2 2 0 012 2v13a3 3 0 01-3 3H8a3 3 0 01-3-3V4M9 8h6M9 12h6',star:'M12 3l2.7 5.5 6 .9-4.4 4.2 1 6L12 16.800 6.700 19.600l1-6L3.300 9.400l6-.9z',dot:'M12 8a4 4 0 100 8 4 4 0 000-8z'};
const EMO0={'🚗':'car','🏎':'car','🚀':'rocket','⌚':'watch','💎':'gem','🏙':'building','🏡':'villa','🛍':'store','🛵':'scooter','🗂':'folder','🔧':'wrench','⚙':'chip','⚖':'scale','🩺':'plus','👔':'brief','🍔':'clock','🎓':'cap','💼':'brief','🏢':'building','🏠':'home','📈':'chart','📊':'bars','🧍':'user','💶':'wallet','📥':'down','📤':'up','🐷':'coin','🏦':'bank','🔥':'flame','🥇':'ingot','🪙':'coin','📜':'scroll','👨':'users','🛏':'bed','🏘':'home','🌹':'gift','💍':'ring','👶':'user','🏥':'plus','🏖':'sun','🔄':'refresh','💪':'up','🚪':'door','➕':'plus2','➖':'minus','📣':'mega','🤝':'coin','🏗':'building','💹':'chart','💰':'coin','🦉':'bulb','⭐':'star','😊':'smile','💘':'heart','❤':'plus','👤':'user','💑':'users'};
const EMO=Object.fromEntries(Object.entries(EMO0).map(([k,v])=>[k.replace(/\uFE0F/g,''),v]));
const E=h=>h.replace(/\p{Extended_Pictographic}\uFE0F?(?:\u200D\p{Extended_Pictographic}\uFE0F?)*/gu,m=>`<svg class="ic" viewBox="0 0 24 24"><path d="${ICP[EMO[[...m][0]]]||ICP.dot}"/></svg>`);
const gbars=(a,b,h=90)=>{if(!a.length)return'<small>Pasa unos meses para ver el gráfico</small><br>';const mx=Math.max(1,...a,...b.map(x=>x||0)),w=300/a.length,H=v=>Math.max(0,v||0)/mx*(h-4);return`<svg viewBox="0 0 300 ${h}" preserveAspectRatio="none" class="sv" style="height:${h}px">${a.map((v,i)=>`<rect x="${(i*w+w*.1).toFixed(1)}" y="${(h-H(v)).toFixed(1)}" width="${(w*.38).toFixed(1)}" height="${H(v).toFixed(1)}" fill="#6fbf8b"/><rect x="${(i*w+w*.52).toFixed(1)}" y="${(h-H(b[i])).toFixed(1)}" width="${(w*.38).toFixed(1)}" height="${H(b[i]).toFixed(1)}" fill="#d98b5a"/>`).join('')}</svg>`};
const rbars=(vals,cols)=>{const mx=Math.max(1,...vals.map(Math.abs)),h=100,z=h/2,w=300/vals.length;return`<svg viewBox="0 0 300 ${h}" preserveAspectRatio="none" class="sv" style="height:${h}px"><line x1="0" x2="300" y1="${z}" y2="${z}" stroke="#2a2c30"/>${vals.map((v,i)=>{const hh=Math.abs(v)/mx*(z-6);return`<rect x="${(i*w+w*.2).toFixed(1)}" y="${(v>=0?z-hh:z).toFixed(1)}" width="${(w*.6).toFixed(1)}" height="${hh.toFixed(1)}" fill="${cols[i]}"/>`}).join('')}</svg>`};

Object.assign(ICP,{shield:'M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6z',target:'M12 3a9 9 0 100 18 9 9 0 000-18zM12 8a4 4 0 100 8 4 4 0 000-8zM12 11a1 1 0 100 2 1 1 0 000-2',trophy:'M8 4h8v5a4 4 0 01-8 0zM8 6H5v2a3 3 0 003 3M16 6h3v2a3 3 0 01-3 3M12 13v4M8 21h8M9 21v-2h6v2',food:'M4 3v7a2 2 0 002 2h1V3M6 12v9M15 3c-1 3-1 6 0 8v10M18 3v18',brain:'M9 4a3 3 0 00-3 3 3 3 0 00-1 5.8V17a3 3 0 003 3h1V4zM15 4a3 3 0 013 3 3 3 0 011 5.8V17a3 3 0 01-3 3h-1V4z'});
Object.assign(EMO,{'🕰':'clock','🏋':'flame','🛡':'shield','🎯':'target','🏆':'trophy','🍽':'food','🧘':'smile','🎂':'gift','📉':'down','🧾':'scroll','🎁':'gift','🩺':'plus','🏥':'plus','🏖':'sun','🛏':'bed','🏘':'home','🌹':'gift','💍':'ring','👶':'user','💑':'users','👨':'users','👩':'users','👧':'users','👦':'users','🧍':'user','👤':'user','💘':'heart','❤':'plus','⭐':'star','🔥':'flame','💪':'up','🔄':'refresh','🚪':'door','➕':'plus2','➖':'minus','📣':'mega','🤝':'coin','🏗':'building','💹':'chart','💰':'coin','🦉':'bulb','😊':'smile','🍔':'clock','🛵':'scooter','🗂':'folder','🔧':'wrench','⚙':'chip','⚖':'scale','👔':'brief','🎓':'cap','💼':'brief','🏢':'building','🏠':'home','📈':'chart','📊':'bars','💶':'wallet','📥':'down','📤':'up','🐷':'coin','🏦':'bank','🥇':'ingot','🪙':'coin','📜':'scroll','🚗':'car','🏎':'car','🚀':'rocket','⌚':'watch','💎':'gem','🏙':'building','🏡':'villa','🛍':'store','🧠':'brain'});
Object.assign(ICP,{
 coffee:'M4 8h12v5a4 4 0 01-4 4H8a4 4 0 01-4-4zM16 9h2a2 2 0 010 4h-2M4 20h14',
 bread:'M4 10a4 4 0 014-4h8a4 4 0 014 4v2a3 3 0 01-3 3H7a3 3 0 01-3-3zM8 6l1-2M12 6l1-2M16 6l1-2',
 palette:'M12 3a9 9 0 100 18c1.5 0 2-1 1.5-2s0-2 1.5-2h2a3 3 0 003-3c0-6-4-11-8-11zM8 9h.01M7 13h.01M12 7h.01M16 10h.01',
 tooth:'M12 3c-2 0-3 1-5 1S5 5 5 7c0 3 1 5 1.5 8S7 21 8 21s1.5-2 2-5 .5-3 2-3 1.5 0 2 3 1 5 2 5 1-3 1.5-6S19 10 19 7c0-2-1-3-2-3s-3-1-5-1z',
 gamepad:'M7 8h10a5 5 0 015 5v2a3 3 0 01-5 2l-2-2H9l-2 2a3 3 0 01-5-2v-2a5 5 0 015-5zM8 11v3M6.5 12.5h3M16 11h.01M18 13h.01',
 hotel:'M3 21V4M3 9h12a4 4 0 014 4v8M3 21h18M7 6h.01M7 12h.01M11 12h.01M15 12h.01',
 truck:'M3 6h11v9H3zM14 9h4l3 3v3h-7M6 19a2 2 0 100-4 2 2 0 000 4zM18 19a2 2 0 100-4 2 2 0 000 4z',
 book:'M4 4h7a3 3 0 013 3v13a2 2 0 00-2-2H4zM20 4h-7a3 3 0 00-3 3v13a2 2 0 012-2h8z',
 paw:'M8 5a2 2 0 100 4 2 2 0 000-4zM16 5a2 2 0 100 4 2 2 0 000-4zM4 10a2 2 0 100 4 2 2 0 000-4zM20 10a2 2 0 100 4 2 2 0 000-4zM12 11c-3 0-5 3-5 5s2 3 5 3 5-1 5-3-2-5-5-5z',
 teddy:'M8 6a2 2 0 100-4 2 2 0 000 4zM16 6a2 2 0 100-4 2 2 0 000 4zM12 7a5 5 0 015 5v3a4 4 0 01-4 4h-2a4 4 0 01-4-4v-3a5 5 0 015-5zM10 12h.01M14 12h.01M11 15h2',
 laptop:'M5 5h14v9H5zM3 18h18l-2-4H5z',
 box:'M3 8l9-4 9 4v9l-9 4-9-4zM3 8l9 4 9-4M12 12v9',
 factory:'M3 21V9l5 3V9l5 3V9l5 3v9zM3 21h18M7 17h.01M11 17h.01M15 17h.01',
 robot:'M12 3v3M8 6h8a3 3 0 013 3v7a3 3 0 01-3 3H8a3 3 0 01-3-3V9a3 3 0 013-3zM9 11h.01M15 11h.01M9 15h6',
 film:'M3 5h18v14H3zM7 5v14M17 5v14M3 9h4M3 15h4M17 9h4M17 15h4',
 wine:'M8 3h8l-1 7a3 3 0 01-6 0zM12 13v6M8 21h8',
 leaf:'M5 19c0-8 5-13 14-14 0 9-5 14-14 14zM5 19c2-4 5-7 9-9',
 scissors:'M6 4l9 9M18 4l-9 9M6 20a2 2 0 100-4 2 2 0 000 4zM18 20a2 2 0 100-4 2 2 0 000 4z',
 pill:'M8 4l12 12a4 4 0 01-6 6L2 10a4 4 0 016-6zM7 9l8 8',
 hammer:'M14 3l7 7-3 3-7-7zM11 6L3 14v7h7l8-8',
 warning:'M12 3l9 17H3zM12 9v5M12 17h.01',
});
Object.assign(EMO,{'☕':'coffee','🍞':'bread','🎨':'palette','🦷':'tooth','🎮':'gamepad','🏨':'hotel','🚚':'truck','📚':'book','🐕':'paw','🧸':'teddy','🖥':'laptop','📦':'box','🏭':'factory','🤖':'robot','🎬':'film','🍷':'wine','🌱':'leaf','💇':'scissors','💊':'pill','🛠':'hammer','⚠':'warning','🏛':'bank','🛟':'shield','👥':'users','⏫':'up'});

function achievements(){
 const n=net(),A=[];
 if(n>=1e6)A.push(['🏆','Millonario']);if(n>=1e7)A.push(['💎','Magnate']);
 if(S.it.some(x=>x.id[0]=='h'))A.push(['🏠','Casa propia']);
 if(S.kids.length)A.push(['👨‍👩‍👧','Familia']);
 if(S.cos.length)A.push(['🏢','Empresario']);
 if(S.cos.length>=3)A.push(['🏛️','Holding']);
 if(S.pen>0)A.push(['🕰️','Jubilado']);
 if(S.edu>=3)A.push(['🎓','Máster']);
 if(pfv()>=10000)A.push(['📈','Inversor']);
 if(age()>=90)A.push(['🦉','Longevo']);
 if(S.stats.joySum/Math.max(1,S.m)>=70)A.push(['😊','Vida plena']);
 return A;
}
function nextStep(){
 const a=age(),cash=S.cash,pv=pfv(),prof=coProfit();
 if(S.st)return['🎓','Termina tus estudios','Te quedan '+S.st.l+' meses. Estudiar en casa de tus padres cuesta poco.','car'];
 if(cash<0)return['💶','Sal de los números rojos','Vende parte de la cartera o baja el nivel de vida antes de que actúen los acreedores.','inv'];
 if(a<18&&!S.st)return['🎓','Elige qué estudiar','Bachillerato o FP son gratuitos y abren mejores trabajos. También puedes empezar a trabajar.','car'];
 if(S.cos.length&&prof<0)return['🏢','Revisa tus empresas','Alguna pierde dinero. Despide empleados o sube la reputación con marketing.','emp'];
 if(S.job==null&&!S.cos.length&&S.paro<=0&&a>=18)return['💼','Busca trabajo','Ve a Carrera y solicita un puesto acorde a tu formación.','car'];
 if(S.ex>0&&cash+S.pf.dep<S.ex*3)return['🛟','Fondo de emergencia','Reúne 3-6 meses de gastos en efectivo o depósito antes de invertir.','inv'];
 if(S.job!=null&&S.rz==0&&S.exp>=12)return['💪','Pide un aumento','Llevas tiempo rindiendo: puedes intentar subir tu sueldo.','car'];
 if(S.cos.length<MAXCO&&cash>12000&&a>=18&&!S.st)return['🏢','Funda otra empresa','Tienes caja para diversificar en otro sector y sumar ingresos.','emp'];
 if(S.pa&&!S.pa.mar&&S.pa.l>=60&&cash>=8000)return['💍','Da el paso','Tu relación va bien y tienes dinero para la boda.','vid'];
 if(!S.pa&&a>=20&&a<=40&&cash>1000)return['💘','Conoce a alguien','Una cita cuesta 150 € y puede cambiarlo todo.','vid'];
 if(pv>10000&&pv>cash*3)return['📈','Diversifica','Tienes mucho en bolsa: revisa el peso de cada activo.','inv'];
 if(S.joy<45)return['😊','Cuida tu ánimo','Unas vacaciones o un plan con tu pareja suben el ánimo.','vid'];
 return['🌱','Sigue construyendo','Aporta cada mes, cuida tu salud y no pierdas de vista los gastos.','dash'];
}

function draw(n){
 const c=document.getElementById('cv');if(!c)return;
 const w=c.clientWidth,h=c.clientHeight,d=devicePixelRatio||1;if(!w||!h)return;
 c.width=w*d;c.height=h*d;const x=c.getContext('2d');x.scale(d,d);x.clearRect(0,0,w,h);
 const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(217,171,69,.10)');g.addColorStop(1,'rgba(217,171,69,0)');x.fillStyle=g;x.fillRect(0,0,w,h);
 let s=7;const rn=()=>(s=(s*16807)%2147483647)/2147483647;
 for(let i=0;i<44;i++){x.fillStyle=['#7aa2b8','#d9ab45','#9a8fc4'][i%3];x.globalAlpha=.25+rn()*.5;const r=rn()<.15?1.8:1.1;x.fillRect(rn()*w,rn()*h*.5,r,r)}
 const L=Math.log10(Math.max(10,Math.abs(n))),k=Math.min(20,4+Math.floor(Math.max(0,L-2)*3)),bw=w/k,gr=1+Math.min(1,Math.max(0,L-3)/4)*1.1;
 for(let i=0;i<k;i++){const bh=Math.min(h-4,h*(.2+rn()*.25)*gr);x.globalAlpha=1;x.fillStyle=i%2?'#152235':'#1d3049';x.fillRect(i*bw,h-bh,bw-2,bh);x.fillStyle='#d9ab45';for(let yy=h-bh+6;yy<h-4;yy+=9)for(let xx=i*bw+4;xx<i*bw+bw-6;xx+=7)if(rn()<.35){x.globalAlpha=.4+rn()*.6;x.fillRect(xx,yy,2.4,3.4)}}
 x.globalAlpha=1;
}

function modalHTML(){if(!S.ev)return'';const e=CEV.find(x=>x.id==S.ev.id);if(!e){S.ev=null;return''}return`<div class="ov" role="dialog" aria-modal="true"><div class="mdl"><small class="eyebrow">Decisión</small><h2>${e.title}</h2><p>${e.txt}</p><div class="opts">${e.opts.map((o,i)=>`<button class="opt" data-k="ev" data-a="${i}"><b>${o.t}</b><small>${o.d}</small></button>`).join('')}</div></div></div>`}

/* ---------- interfaz ---------- */
function render0(){
 const n=net(),a=age(),Ap=document.getElementById('app'),ht=document.getElementById('ht'),ev=document.getElementById('ev'),tb=document.getElementById('tb'),md=document.getElementById('md');
 document.getElementById('bot').style.display=S.over||!S.pl?'none':'block';
 if(md)md.innerHTML='';
 if(!S.pl){
  const ch=(k,v,c)=>`<button class="tile${c==v?' sel':''}" data-k="${k}" data-a="${v}"><b>${v}</b></button>`,ok=TMP.n.trim()&&TMP.sx&&TMP.or;
  ht.innerHTML=`<div class="in"><span class="chip">Nueva vida</span><div class="net">Mi Vida</div><div class="sub">Decisiones, dinero y tiempo · empiezas a los 16</div></div><canvas id="cv"></canvas>`;
  ev.innerHTML='';tb.innerHTML='';
  Ap.innerHTML=P('Tu personaje',`<div class="qr"><input id="nm" class="nmi" type="text" maxlength="14" placeholder="Tu nombre" value="${esc(TMP.n)}"></div><small>Sexo</small><div class="g3">${['Hombre','Mujer','Otro'].map(v=>ch('sx',v,TMP.sx)).join('')}</div><small>Orientación sexual</small><div class="g3">${['Heterosexual','Homosexual','Bisexual'].map(v=>ch('or',v,TMP.or)).join('')}</div><small>La orientación decide con quién puedes tener pareja.</small><div class="ibs"><button class="b go" data-k="start"${ok?'':' disabled'}>Empezar a vivir</button></div>`)
  +P('Cómo se juega',`<div class="intro"><p><b>1.</b> Cada mes tomas decisiones: estudiar, trabajar, invertir, montar empresas, mudarte o formar una familia.</p><p><b>2.</b> La caja manda. Si gastas más de lo que ingresas, la deuda crece.</p><p><b>3.</b> El tiempo también cuenta: salud, ánimo y relaciones se degradan si no las cuidas.</p><p><b>4.</b> Puedes tener hasta cinco empresas y hacerlas crecer con empleados y reputación.</p><p><b>5.</b> No hay una única forma de ganar. Hay vidas ricas, vidas tranquilas y vidas rotas.</p></div>`);
  return;
 }
 const jb=S.st?'Estudiante':S.cos.length?'Empresario':S.job!=null?JB[S.job][0]:S.pen?'Jubilado':S.paro>0?'En paro':'Sin empleo';
 ht.innerHTML=`<div class="in"><div class="chips"><span class="chip">${esc(S.pl.n)}, ${a} años</span><span class="chip c2">${jb}</span><span class="chip c3">Año ${Math.floor(S.m/12)+1} · Mes ${S.m%12+1}</span></div><div class="net">${F(n)}</div><div class="sub">Patrimonio · <span class="${S.last>=0?'pos':'neg'}">${S.last>=0?'▲':'▼'} ${F(Math.abs(S.last))}/mes</span> · <span class="mu">real ${F(n/S.inf)}</span></div><div class="mbs">${bar('❤️','Salud',S.hp,'var(--ok)')}${bar('😊','Ánimo',S.joy,'var(--sf)')}${bar('💘','Amor',S.pa?S.pa.l:0,'var(--mg)')}</div></div><canvas id="cv"></canvas>`;
 if(S.over){
  const r=n<0?'En números rojos':n<1e5?'Una vida corriente':n<1e6?'Clase acomodada':n<1e7?'Millonario':'Magnate';
  const joyAvg=S.stats.joySum/Math.max(1,S.m),score=Math.round(n/1000+joyAvg*2+S.kids.length*20+S.edu*15+(S.pa&&S.pa.mar?30:0)+(S.cos.length?40+S.cos.length*15:0)),ach=achievements();
  ev.innerHTML='';tb.innerHTML='';
  Ap.innerHTML=P('',`<div class="end"><small class="eyebrow">Fin de la partida</small><h2>${S.over}</h2><p class="mu">${r} · ${a} años · puntuación ${score}</p><div class="kg">${KP('💶','Patrimonio',F(n),'')}${KP('😊','Felicidad media',Math.round(joyAvg),'/100')}${KP('👨‍👩‍👧','Hijos',S.kids.length,'')}${KP('🎓','Estudios',LV[S.edu],'')}${KP('💼','Meses trabajados',S.stats.work,'')}${KP('📈','Cartera',F(pfv()),'')}</div><div class="ach">${ach.length?ach.map(x=>`<span>${x[0]} ${x[1]}</span>`).join(''):'<small>Sin logros destacados.</small>'}</div><div class="ibs">${IB('🔄','Nueva vida','new')}</div></div>`);
  return;
 }
 ev.innerHTML=`<div class="ev">${S.log[0]}</div>`;
 tb.innerHTML=[['dash','📊','Panel'],['vid','🧍','Vida'],['car','🎓','Carrera'],['emp','🏢','Empresas'],['hog','🏠','Hogar'],['inv','📈','Bolsa']].map(t=>`<button class="${tab==t[0]?'on':''}" data-k="tab" data-a="${t[0]}"><span>${t[1]}</span>${t[2]}</button>`).join('');
 const pv=pfv(),inm=S.it.reduce((x,y)=>x+y.v-y.d,0),deb=S.it.reduce((x,y)=>x+y.d,0),cuo=S.it.reduce((x,y)=>x+y.p,0),cb=Object.values(S.cb).reduce((x,y)=>x+y,0);
 let h='';
 if(tab=='dash'){
  const exb=S.ex>0?S.ex:livingCost(),sav=S.inc>0?(S.inc-S.ex)/S.inc*100:0,col=(S.cash+S.pf.dep)/exb,conc=pv>0?Math.max(...Object.values(S.pf))/pv:0,ef=(S.cash+S.pf.dep)/exb;
  const tip=sav<0&&S.inc>0?'Gastas más de lo que ingresas. Recorta gastos o sube ingresos.':col<3&&S.ex>0?'Reserva 3 a 6 meses de gastos antes de arriesgar.':S.cash>S.ex*8&&S.cash>5000?'Tu caja pierde valor por la inflación. Invierte una parte.':conc>.7&&pv>5000?'Casi todo está en un activo. Diversifica.':pv>3000&&S.pf.cr>pv*.3?'Demasiadas criptos: limita su peso.':'Aporta cada mes: el interés compuesto trabaja por ti.';
  const ns=nextStep();
  h+=P('',`<div class="next"><span class="nx">${ns[0]}</span><div><small class="eyebrow">Siguiente paso</small><b>${ns[1]}</b><p>${ns[2]}</p></div><button class="b s" data-k="tab" data-a="${ns[3]}">Ir</button></div>`,'nextcard');
  h+=`<div class="kg">${KP('💶','Caja',F(S.cash),pc(col)+' meses',col<3?'neg':'')}${KP('📥','Ingresos',F(S.inc),'al mes')}${KP('📤','Gastos',F(S.ex),'al mes')}${KP('🐷','Ahorro',Math.round(sav)+' %','',sav<0?'neg':'pos')}${KP('📈','Cartera',F(pv),cb>0?(pv>=cb?'+':'')+F(pv-cb):'')}${KP('🏦','Deuda',F(deb),cuo>0?F(cuo)+'/mes':'')}${KP('🏢','Empresas',S.cos.length?F(coVal()):'—',S.cos.length?F(coProfit())+'/mes · '+S.cos.length+(S.cos.length>1?' empresas':' empresa'):'')}${KP('🔥','Inflación',pc(S.ir*100)+' %','anual')}</div>`
  +P('Patrimonio',spark(S.hist,'#d9ab45',80)+`<small>Poder adquisitivo real: ${F(n/S.inf)}</small>`)
  +P('Ingresos y gastos, 12 meses',gbars(S.hI.slice(-12),S.hE.slice(-12))+`<div class="lg">${lgd('#6fbf8b','Ingresos')}${lgd('#d98b5a','Gastos')}</div>`)
  +P('Dónde está tu dinero',`<div class="dw">${donut([[S.cash,'#7aa2b8'],[pv,'#d9ab45'],[inm,'#6fbf8b'],[coVal(),'#9a8fc4']])}<div class="lg">${lgd('#7aa2b8','Caja '+F(S.cash))}${lgd('#d9ab45','Cartera '+F(pv))}${lgd('#6fbf8b','Bienes '+F(inm))}${lgd('#9a8fc4','Empresas '+F(coVal()))}</div></div>`)
  +P('Fondo de emergencia',`<div class="hb"><small>${pc(Math.min(ef,99),1)} meses</small><div><u style="width:${cl(ef/6*100)}%;background:var(--ok)"></u></div><small>${F(exb*6)}</small></div><small>Objetivo: 6 meses de gastos. Si pierdes el trabajo, este colchón decide cuánto aguantas.</small>`)
  +P('',`<span>🦉</span><p style="margin:0">${tip}</p>`,'tip');
 }
 if(tab=='inv'){
  h+=P('Importe por operación',`<div class="qr"><input id="am" type="number" min="1" value="${AMT}" inputmode="numeric"><small>€</small>${[500,1000,5000,10000].map(v=>A(v>=1000?v/1000+'k':v,'amt',v,0,'mn s')).join('')}${A('Máx','amt','max',0,'mn s')}</div>`)
  +P('Tu cartera',`<div class="dw">${donut(ASSETS.map((x,j)=>[S.pf[x[0]],AC[j]]))}<div><div class="big2">${F(pv)}</div><div class="${pv>=cb?'pos':'neg'}">${pv>=cb?'▲':'▼'} ${F(Math.abs(pv-cb))}</div><small>sobre ${F(cb)} aportados</small></div></div>`)
  +P('Rendimiento de los activos',multi()+`<div class="lg">${ASSETS.map((x,j)=>lgd(AC[j],AS[j])).join('')}</div>`)
  +P('Rentabilidad a 12 meses',rbars(ASSETS.map(x=>{const p=S.px[x[0]];return p.length>13?(p[p.length-1]/p[p.length-13]-1)*100:((1+x[2])**12-1)*100}),AC)+`<div class="bl">${AS.map(x=>`<small>${x}</small>`).join('')}</div><small>Antes del primer año se muestra la rentabilidad esperada</small>`)
  +P('Peso en cartera',ASSETS.map((x,j)=>`<div class="hb"><small>${x[4].split(' ')[0]}</small><div><u style="width:${pv?S.pf[x[0]]/pv*100:0}%;background:${AC[j]}"></u></div><small>${pv?Math.round(S.pf[x[0]]/pv*100):0} %</small></div>`).join(''))
  +`<div class="g2 assets">${ASSETS.map((x,j)=>{const id=x[0],p=S.px[id],up=UP[j]*p[p.length-1]/100,ch=p.length>13?(p[p.length-1]/p[p.length-13]-1)*100:null;return`<div class="cd as"><div class="ah"><span class="ai" style="background:${AC[j]}33;color:${AC[j]}">${x[1]}</span><div><b>${x[4]}</b><small class="rk">${'●'.repeat(RK[j])}${'○'.repeat(5-RK[j])}</small></div></div>${spark(p.slice(-48),AC[j],46)}<div class="av">${F(S.pf[id])}</div><small class="mu">${j?(S.pf[id]/up).toFixed(j==5?4:2).replace('.',',')+' '+UN[j]+' · ':''}${j?(up>=100?F(up):pc(up,2)+' €'):'1 € por unidad'}</small><small class="${ch==null?'':ch>=0?'pos':'neg'}">${ch==null?'~'+pc(((1+x[2])**12-1)*100)+' % al año':(ch>=0?'▲ ':'▼ ')+pc(Math.abs(ch))+' % en 12 meses'}</small><div class="mr">${A('Comprar','inv',id+',A',AMT,'mn')}${A('Vender','sellp',id+',A',0,'mn s')}${A('Todo','wd',id,0,'mn s')}${A('+1 ud','inv',id+','+up,up,'mn s')}${A(S.auto&&S.auto.f==id?'Quitar auto':'Auto','auto',id,0,'mn s')}</div></div>`}).join('')}</div><small class="mu">La aportación automática compra ${F(AMT)} del activo elegido cada mes si hay caja suficiente.</small>`;
 }
 if(tab=='vid'){
  const avg=S.stats.joySum/Math.max(1,S.m);
  h+=P('',`<div class="cp"><div class="av2">${S.pa?(S.kids.length?'👨‍👩‍👧':'💑'):'🧍'}</div><div style="flex:1"><b>${S.pa?esc(S.pa.n):'Sin pareja'}</b><br><small>${S.pa?(S.pa.mar?'Casados':'Pareja')+(S.pa.mar?' · aporta '+F((S.pa.inc||0)*S.inf*.45)+'/mes':''):'Carisma '+charm()}</small>${S.pa?bar('💘','Amor',S.pa.l,'var(--mg)'):''}</div></div><div class="ibs">${S.pa?IB('🌹','Regalo<small>250 €</small>','gift',undefined,250)+IB('🍽️','Plan<small>200 €</small>','plan',undefined,200)+(S.pa.mar?'':IB('💍','Boda<small>8.000 €</small>','marry',undefined,8000))+IB('👶','Hijo<small>3.000 €</small>','baby',undefined,3000):IB('💘','Citas<small>150 €</small>','date',undefined,150)}</div>${S.kids.length?`<div class="kd">${S.kids.map(()=>'👶').join(' ')}</div>`:''}`)
  +P('Nivel de vida',`<div class="g3">${[0,1,2].map(i=>`<button class="tile${S.lvl==i?' sel':''}" data-k="lvl" data-a="${i}"><b>${LNAME[i]}</b><small>${F(BASE*LIFE[i]*S.inf)}/mes</small></button>`).join('')}</div><small>Más nivel de vida sube el ánimo, pero también los gastos. El nivel alto no compensa una caja vacía.</small>`)
  +P('Salud',`<div class="ibs">${IB('🏥','Médico<small>'+(S.ins?'80 €':'300 €')+'</small>','doc',undefined,S.ins?80:300)}${IB('🏋️',S.gym?'Gimnasio: sí':'Gimnasio: no','gym',undefined,0,S.gym?'on':'')}${IB('🛡️',S.ins?'Seguro: sí':'Seguro: no','ins',undefined,0,S.ins?'on':'')}${IB('🏖️','Vacaciones<small>1.500 €</small>','vac',undefined,1500)}</div><small>El gimnasio (30 €/mes) y el seguro (55 €/mes) frenan el deterioro de la salud y abaratan los sustos.</small>`)
  +P('Resumen de vida',`<div class="kg">${KP('💼','Meses trabajados',S.stats.work,'')}${KP('🎓','Meses estudiando',S.stats.study,'')}${KP('😊','Felicidad media',Math.round(avg),'/100')}${KP('📈','Máximo patrimonio',F(S.stats.peak),'')}</div>`)
  +P('Diario',S.log.slice(0,6).map(l=>`<p class="lgp">${l}</p>`).join('')+`<div class="ibs">${IB('🔄','Reiniciar partida','new')}</div>`);
 }
 if(tab=='car'){
  const cur=S.st&&ED.find(e=>e[0]==S.st.id);
  h+=P('Formación',`<div class="stp">${LV.map((l,i)=>`<div class="${i<=S.edu?'on':''}"><i>${i<=S.edu?'✓':i}</i><small>${l.split(' ')[0]}</small></div>`).join('')}</div>`+(S.st?`<b>${cur[1]}</b> <small>${S.st.l} meses</small><div class="pb"><u style="width:${100-S.st.l/cur[2]*100}%"></u></div>${A('Abandonar','drop',undefined,0,'s')}`:`<div class="g2">${ED.filter(e=>e[0]=='gr'?S.edu==1:e[0]=='ma'?S.edu==2:S.edu==0).map(e=>TL('🎓',e[1],e[2]/12+' años · '+(e[3]?F(e[3]*S.inf)+'/mes':'gratis'),'study',e[0])).join('')||'<small>Máximo nivel alcanzado</small>'}</div>`));
  h+=S.job!=null?P('',`<div class="cp"><div class="av2">${JI[S.job]}</div><div><b>${JB[S.job][0]}</b><div class="big2">${F(netPay(S.sal))}</div><small>netos · ${F(S.sal)} brutos · nivel ${S.grade+1}</small></div></div><div class="mb"><span>Rendimiento <b>${Math.round(S.perf)}</b></span><div><u style="width:${S.perf}%;background:var(--sf)"></u></div></div><div class="ibs">${IB('💪','Aumento','raise')}${IB('🚪','Dejar','quit')}</div>`):P('Trabajo',S.cos.length?`<div class="cp"><div class="av2">🏢</div><div><b>Eres empresario</b><br><small>Diriges ${S.cos.length} ${S.cos.length>1?'empresas':'empresa'}. Gestiona empleados y beneficios en Empresas.</small></div></div><div class="ibs">${IB('🏢','Gestionar empresas','tab','emp')}</div>`:S.pen?`<div class="cp"><div class="av2">🕰️</div><div><b>Estás jubilado</b><br><small>Cobras ${F(S.pen)}/mes de pensión.</small></div></div>`:`<div class="g2">${TL('🍔',S.part?'Dejar parcial':'Parcial','unos 450 €/mes','part')}${JB.map((j,i)=>TL(JI[i],j[0],F(j[2]*S.inf)+(j[1]?' · '+LV[j[1]].split(' ')[0]:''),'apply',i,S.edu<j[1]||S.exp<j[3])).join('')}</div>`);
 }
 if(tab=='emp'){
  const c=curCo(),b=c?biz(c.t):null,full=S.cos.length>=MAXCO;
  if(S.cos.length){
   h+=P('Tus empresas',`<div class="kg">${KP('🏢','Empresas',S.cos.length+' / '+MAXCO,'')}${KP('💰','Valor total',F(coVal()),'')}${KP('💹','Beneficio',F(coProfit()),'al mes',coProfit()>=0?'pos':'neg')}${KP('👥','Empleados',S.cos.reduce((a,x)=>a+x.e,0),'en total')}</div>`)
   +P('Elige una empresa',`<div class="cos">${S.cos.map((x,i)=>{const y=biz(x.t);return`<button class="cochip${i==S.cosel?' on':''}" data-k="cosel" data-a="${i}"><span>${y.ic}</span><b>${y.n}</b><small class="${x.lp>=0?'pos':'neg'}">${F(x.lp)}/mes</small></button>`}).join('')}</div>`);
   if(c)h+=P(b.n,`<div class="cp"><div class="av2">${b.ic}</div><div><b>${b.n}</b><br><small>${b.sec} · ${c.e}/${b.max} empleados · riesgo ${'●'.repeat(b.risk)}${'○'.repeat(5-b.risk)}${S.rec>0?' · recesión':''}</small></div></div><div class="kg">${KP('💹','Beneficio',F(c.lp),'al mes',c.lp>=0?'pos':'neg')}${KP('💰','Valor',F(coValOne(c)),'')}</div><div class="hb"><small>Reputación</small><div><u style="width:${c.rep/5*100}%;background:var(--sf)"></u></div><small>${pc(c.rep,1)}/5</small></div><div class="ibs">${IB('➕','Contratar<small>'+F(hireCost(c))+'</small>','hire',undefined,hireCost(c))}${IB('👥','+5<small>'+F([...Array(Math.min(5,b.max-c.e))].reduce((x,_,i)=>x+hireCost({e:c.e+i}),0))+'</small>','hire',5)}${IB('⏫','Máx<small>'+F([...Array(b.max-c.e)].reduce((x,_,i)=>x+hireCost({e:c.e+i}),0))+'</small>','hire','max')}${IB('➖','Despedir','fire')}${IB('📣','Marketing<small>'+F(Math.round(2500*(1+c.rep)))+'</small>','mkt',undefined,Math.round(2500*(1+c.rep)))}${IB('🤝','Vender<small>'+F(coValOne(c))+'</small>','sellco')}</div><small>${b.d} Cada empleado genera ventas menos su sueldo; la reputación multiplica el margen.</small>`);
  }else{
   h+=P('',`<div class="cp"><div class="av2">🚀</div><div><b>Funda tu primera empresa</b><br><small>Desde los 18 años · hasta ${MAXCO} empresas</small></div></div><p class="mu">Elige un sector. Cada negocio tiene un capital inicial, unos requisitos y un límite de empleados distinto.</p>`);
  }
  if(!full){
   const list=BIZ.filter(x=>S.bizf=='Todos'||x.sec==S.bizf);
   h+=P(S.cos.length?'Funda otra empresa':'Elige tu primera empresa',`<div class="cf">${BIZCAT.map(x=>`<button class="chipbtn${S.bizf==x?' on':''}" data-k="bizf" data-a="${x}">${x}</button>`).join('')}</div><div class="g2 bizgrid">${list.map(x=>{const req=[];if(S.edu<x.edu)req.push(LV[x.edu]);if(S.exp<x.exp)req.push(x.exp+' m exp');return TL(x.ic,x.n,F(x.cap)+(req.length?' · ⚠ '+req.join(' + '):' · '+x.sec),'co',x.id,req.length>0,x.cap)}).join('')}</div><small>Capital inicial y requisitos. Los empleados se contratan dentro de cada empresa.</small>`);
  }else h+=P('',`<small>Has alcanzado el máximo de ${MAXCO} empresas. Vende una para poder fundar otra.</small>`);
 }
 if(tab=='hog'){
  h+=P('Hogar',`<div class="g2">${S.home==-1?TL('🏡','Casa propia','Vives aquí','x'):H.map((o,i)=>TL(['👨‍👩‍👦','🛏️','🏘️','🏙️'][i],o[0].replace(' de tus padres',' padres'),o[1]?F(o[1]*S.inf)+'/mes':'Gratis',i==S.home?'x':'home',i,i==S.home)).join('')}</div>`)
  +P('Tienda',`<div class="qr"><small>Cantidad</small><input id="qt" type="number" min="1" value="${QTY}" inputmode="numeric">${[1,5,10,17].map(q=>A(q,'qty',q,0,'mn s')).join('')}</div><div class="qr">${A(MODE=='mort'?'Casas: con hipoteca':'Casas: al contado','mode',undefined,0,'mn s')}</div><div class="g2">${SH.map(d=>{const pr=d[2]*S.inf*QTY,hs=d[0][0]=='h';return TL(IC(d[0]),d[1],F(pr)+(hs&&MODE=='mort'?' · entrada '+F(pr*.38):''),'buy',d[0],0,hs?pr*(MODE=='mort'?.38:1.08):pr)}).join('')}</div><small>Hipoteca: 30 % de entrada + 8 % de gastos, 25 años. Las cuotas no pueden superar el 40 % de tus ingresos. Los coches se deprecian; las casas y los relojes suelen aguantar mejor.</small>`)
  +(S.it.length?P('Tus bienes',`<div class="g2">${S.it.map((x,i)=>`<div class="cd as"><div class="ah"><span class="ai" style="background:#7aa2b833;color:#7aa2b8">${IC(x.id)}</span><div><b>${x.q} × ${sd(x.id)[1]}</b><small>${F(x.v)}</small></div></div>${x.d>0?`<small class="neg">Debes ${F(x.d)} · ${F(x.p)}/mes</small><br>`:''}<div class="mr2">${A('Vender 1','sell',i+',1',0,'mn s')}${x.q>1?A('Vender todo','sell',i+','+x.q,0,'mn s'):''}</div></div>`).join('')}</div>`):'');
 }
 Ap.innerHTML=h;
 if(md)md.innerHTML=modalHTML();
}
function render(){try{render0();['ht','ev','tb','app','md'].forEach(i=>{const e=document.getElementById(i);if(e)e.innerHTML=E(e.innerHTML)});draw(net())}catch(err){console.error(err);document.getElementById('app').innerHTML='<div class="cd"><h3>Error</h3><p>'+esc(err.message)+'</p><button class="b" data-k="new">Reiniciar partida</button></div>'}}
document.addEventListener('click',e=>{const t=e.target.closest('button[data-k]');if(t)act(t.dataset.k,t.dataset.a)});
let rz,lz;const lazy=()=>{clearTimeout(lz);lz=setTimeout(render,350)};
addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>draw(net()),200)});
document.addEventListener('change',e=>{const t=e.target;if(t.id=='qt'){QTY=Math.min(999,Math.max(1,Math.floor(+t.value)||1));lazy()}else if(t.id=='am'){AMT=Math.max(1,Math.floor(+t.value)||1);lazy()}else if(t.id=='nm')TMP.n=t.value});
document.addEventListener('input',e=>{if(e.target.id=='nm'){TMP.n=e.target.value;const b=document.querySelector('[data-k="start"]');if(b)b.disabled=!(TMP.n.trim()&&TMP.sx&&TMP.or)}});
render();
