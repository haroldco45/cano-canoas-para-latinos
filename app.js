/* =========================================================
   Caño Canoas para Latinos — Vibras Positivas HM
   PWA bilingüe (ES/EN) sobre Caño Canoas, Serranía de La Macarena (Meta, Colombia):
   estado oficial, seguridad, cómo llegar, presupuesto y la ruta legal por Caño Cristales.
   Sin emojis ni íconos: fotos reales de Wikipedia / Wikimedia Commons.
   ========================================================= */
'use strict';

/* ---------- Utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const store = {
  get(k, d) { try { const v = localStorage.getItem('ccn_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('ccn_' + k, JSON.stringify(v)); } catch (e) {} }
};
let LANG = store.get('lang', (navigator.language || 'es').slice(0, 2) === 'en' ? 'en' : 'es');
const L = o => (o == null ? '' : typeof o === 'string' ? o : (o[LANG] ?? o.es ?? ''));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n, d = 2) => new Intl.NumberFormat(LANG === 'es' ? 'es-CO' : 'en-US', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
const cop = n => (n < 0 ? '-$' : '$') + fmt(Math.abs(Math.round(n)), 0);
async function getJSON(url) { const r = await fetch(url); if (!r.ok) throw new Error(r.status); return r.json(); }
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2400); }
const gmaps = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
const ZONE = 'America/Bogota';
const PALETTE = ['#14653A', '#0E7C86', '#B30715', '#3BAA5C', '#F28C28', '#2D7FF9', '#8E5CD9'];
const num = (b, i) => `<b style="color:var(--red);font-family:'Barlow Condensed';font-size:1.3rem;margin-right:8px">${String(i + 1).padStart(2, '0')}</b>${b}`;
const linkBtn = (href, txt, cls = '') => `<a class="btn ${cls}" href="${href}" target="_blank" rel="noopener">${txt}</a>`;

/* ---------- Textos de interfaz ---------- */
const T = {
  appName: { es: 'Caño Canoas para Latinos', en: 'Caño Canoas for Latinos' },
  tagline: { es: 'La verdad antes de ir a la cascada de la Macarena', en: 'The truth before you visit the Macarena waterfall' },
  nHome: { es: 'Inicio', en: 'Home' }, nStatus: { es: 'Estado', en: 'Status' }, nMap: { es: 'Mapa', en: 'Map' }, nTalk: { es: 'Hablar', en: 'Talk' },
  cxT: { es: 'Más destinos para latinos', en: 'More places for Latinos' },
  cxS: { es: 'La misma guía en otras ciudades y destinos. Toca uno para abrirlo.', en: 'The same guide for other cities and places. Tap one to open it.' },
  footNote: {
    es: 'Información de referencia. El estado de Caño Canoas lo define Parques Nacionales Naturales de Colombia y el de Caño Cristales, Cormacarena y Parques: confírmalo siempre en parquesnacionales.gov.co y cormacarena.gov.co antes de viajar. Los precios de operadores son reportes de prensa y viajeros, no tarifas oficiales. Mapa © colaboradores de OpenStreetMap, © CARTO. Fotos: Wikipedia / Wikimedia Commons. Clima: Open-Meteo.',
    en: 'Reference information. Caño Canoas\' status is set by Colombia\'s National Natural Parks and Caño Cristales\' by Cormacarena and the Parks service: always confirm at parquesnacionales.gov.co and cormacarena.gov.co before travelling. Operator prices come from press and traveller reports, not official fees. Map © OpenStreetMap contributors, © CARTO. Photos: Wikipedia / Wikimedia Commons. Weather: Open-Meteo.'
  },
  updated: { es: 'Información verificada', en: 'Information checked' },
  installT: { es: 'Instala la app: en la selva casi no hay señal y así la usas sin internet.', en: 'Install the app: there\'s almost no signal in the jungle, so you can use it offline.' },
  install: { es: 'Instalar', en: 'Install' },
  tapClose: { es: '(Toca para cerrar)', en: '(Tap to close)' },
  back: { es: '‹ Volver al inicio', en: '‹ Back to home' }
};
const VERIFIED = '27 oct 2026';

/* ---------- Fotos reales (Wikipedia / Commons) ---------- */
// key: [título en en.wikipedia, búsquedas de respaldo en Commons en orden]
const PH = {
  canoas: ['', 'Caño Canoas', 'Caño Canoas Meta', 'cascada Serranía de la Macarena', 'waterfall Meta Colombia'],
  cristales: ['Caño Cristales', 'Caño Cristales'],
  macarenia: ['Macarenia clavigera', 'Macarenia clavigera'],
  sierra: ['Serranía de la Macarena', 'Serranía de la Macarena'],
  pueblo: ['La Macarena, Meta', 'La Macarena Meta'],
  guayabero: ['Guayabero River', 'Río Guayabero'],
  raudal: ['', 'Raudal Angosturas Guayabero', 'Guayabero river rapids', 'river rapids Meta Colombia'],
  sietemachos: ['', 'Caño Siete Machos', 'Caño Cristales red river', 'Caño Cristales rocks'],
  indio: ['', 'Caño Indio Macarena', 'Caño Cristales pool', 'natural pool Meta Colombia'],
  yarumales: ['', 'Caño Yarumales', 'jungle stream Meta Colombia', 'selva Meta Colombia'],
  selva: ['', 'selva Meta Colombia', 'tropical rainforest Colombia trail'],
  crecida: ['', 'río crecido Colombia', 'flash flood river jungle', 'muddy river rainforest'],
  hoatzin: ['Hoatzin', 'Hoatzin'],
  villavo: ['Villavicencio', 'Villavicencio'],
  avion: ['Satena', 'Satena aircraft'],
  vacuna: ['Yellow fever vaccine', 'yellow fever vaccine'],
  peso: ['Colombian peso', 'billetes pesos colombianos'],
  llanero: ['Joropo', 'joropo llanero'],
  mamona: ['', 'mamona carne a la llanera', 'carne a la llanera'],
  morichal: ['Mauritia flexuosa', 'morichal Meta'],
  botas: ['', 'hiking boots trail mud', 'trekking boots'],
  mesetas: ['Mesetas', 'Mesetas Meta'],
  vistahermosa: ['Vista Hermosa, Meta', 'Vista Hermosa Meta'],
  guaviare: ['San José del Guaviare', 'San José del Guaviare'],
  caguan: ['San Vicente del Caguán', 'San Vicente del Caguán'],
  lancha: ['', 'lancha río Guayabero', 'river boat Colombia Llanos'],
  tormenta: ['', 'storm clouds Llanos Colombia', 'tropical storm clouds'],
  mapa: ['Meta Department', 'Meta Colombia landscape']
};
const CAPS = {
  canoas: { es: 'Zona de Caño Canoas', en: 'Caño Canoas area' }, cristales: { es: 'Caño Cristales', en: 'Caño Cristales' },
  macarenia: { es: 'Macarenia clavigera, la planta de los colores', en: 'Macarenia clavigera, the colour plant' },
  sierra: { es: 'Serranía de La Macarena', en: 'Serranía de La Macarena' }, guayabero: { es: 'Río Guayabero', en: 'Guayabero River' },
  hoatzin: { es: 'Pava hedionda (hoatzín)', en: 'Hoatzin' }, sietemachos: { es: 'Caños de la Macarena', en: 'Macarena streams' },
  pueblo: { es: 'La Macarena, Meta', en: 'La Macarena, Meta' }
};
const PHOTO_CACHE = store.get('photos1', {});
function fbColor(key) { let h = 0; for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0; return PALETTE[h % PALETTE.length]; }
const photo = key => `data-ph="${key}" style="--fb:${fbColor(key)}"`;

async function wikiBatch(titles) {
  const out = {};
  for (let i = 0; i < titles.length; i += 40) {
    const chunk = titles.slice(i, i + 40);
    const url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=900&titles=' + encodeURIComponent(chunk.join('|'));
    try {
      const j = await getJSON(url);
      const back = {};
      (j.query.normalized || []).forEach(n => back[n.to] = n.from);
      (j.query.redirects || []).forEach(r => back[r.to] = back[r.from] || r.from);
      (j.query.pages || []).forEach(p => { if (p.thumbnail) out[back[p.title] || p.title] = p.thumbnail.source; });
    } catch (e) {}
  }
  return out;
}
async function commonsSearch(q) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&generator=search&gsrnamespace=6&gsrlimit=4&gsrsearch=' + encodeURIComponent(q + ' filetype:bitmap') + '&prop=imageinfo&iiprop=url&iiurlwidth=900';
  try {
    const j = await getJSON(url);
    const pages = (j.query && j.query.pages || []).sort((a, b) => (a.index || 0) - (b.index || 0));
    for (const p of pages) { const ii = p.imageinfo && p.imageinfo[0]; if (ii && (ii.thumburl || ii.url)) return ii.thumburl || ii.url; }
  } catch (e) {}
  return null;
}
let photosLoading = null;
async function loadPhotos() {
  if (photosLoading) return photosLoading;
  photosLoading = (async () => {
    const need = Object.keys(PH).filter(k => !PHOTO_CACHE[k]);
    const titles = need.map(k => PH[k][0]).filter(Boolean);
    if (titles.length) {
      const got = await wikiBatch(titles);
      need.forEach(k => { if (PH[k][0] && got[PH[k][0]]) PHOTO_CACHE[k] = got[PH[k][0]]; });
    }
    const rest = Object.keys(PH).filter(k => !PHOTO_CACHE[k]);
    const firsts = rest.filter(k => PH[k].length <= 2), multi = rest.filter(k => PH[k].length > 2);
    await Promise.all(firsts.map(async k => { const u = await commonsSearch(PH[k][1]); if (u) PHOTO_CACHE[k] = u; }));
    for (const k of multi) {
      for (const q of PH[k].slice(1)) {
        const u = await commonsSearch(q);
        if (u && !Object.values(PHOTO_CACHE).includes(u)) { PHOTO_CACHE[k] = u; break; }
      }
    }
    store.set('photos1', PHOTO_CACHE);
  })();
  return photosLoading;
}
function paintPhotos(root = document) {
  $$('[data-ph]', root).forEach(el => {
    const u = PHOTO_CACHE[el.dataset.ph];
    if (u && !el._painted) {
      const img = new Image();
      img.onload = () => { el.style.backgroundImage = `url("${u}")`; el._painted = true; };
      img.src = u;
    }
  });
  heroSetup();
}

/* ---------- Temporada de Caño Cristales (verificada el 27 oct 2026) ----------
   El Tiempo: abrió el 29 de mayo de 2026 y se puede visitar "hasta inicios de diciembre".
   La fecha exacta de cierre la fija Cormacarena: la cuenta regresiva usa el 30 de noviembre como referencia. */
const SEASON = { open: new Date('2026-05-29T00:00:00-05:00'), end: new Date('2026-11-30T23:59:59-05:00') };
const seasonOpen = () => Date.now() >= SEASON.open && Date.now() <= SEASON.end;

/* ---------- Estado oficial de Caño Canoas ---------- */
const TIMELINE = [
  { d: { es: '7 sep 2025', en: '7 Sep 2025' }, t: { es: 'Muere una joven turista en Caño Canoas', en: 'A young tourist dies at Caño Canoas' }, s: { es: 'La arrastró la corriente durante una excursión de agencia de unas treinta personas. Según su familia, había un solo guía y el rescate fue lento; la búsqueda quedó en buena parte en manos de habitantes de la zona.', en: 'She was swept away by the current on an agency trip of about thirty people. Her family says there was a single guide and the rescue was slow; the search was largely left to local residents.' } },
  { d: { es: '10 sep 2025', en: '10 Sep 2025' }, t: { es: 'Parques Nacionales: "Caño Canoas no está habilitado"', en: 'National Parks: "Caño Canoas is not authorized"' }, s: { es: 'El único sector habilitado para ecoturismo en el Parque Sierra de La Macarena es Caño Cristales. El Sendero Ecológico por la Paz, donde está Canoas, no tiene reglamentación, la zona tiene problemas de orden público y los prestadores que operan allí no están registrados ante la entidad.', en: 'The only area authorized for ecotourism in the Sierra de La Macarena park is Caño Cristales. The Peace Ecological Trail, where Canoas is, has no regulations, the area has security problems and the operators working there aren\'t registered with the agency.' } },
  { d: { es: '19 nov 2025', en: '19 Nov 2025' }, t: { es: 'Actuación contra la agencia', en: 'Action against the agency' }, s: { es: 'Parques Nacionales expidió el Auto 156 dentro de una actuación frente a la agencia que organizó la excursión.', en: 'National Parks issued Order 156 in proceedings against the agency that ran the trip.' } },
  { d: { es: 'Dic 2025', en: 'Dec 2025' }, t: { es: 'Nuevo plan de ecoturismo, sin Canoas', en: 'New ecotourism plan, without Canoas' }, s: { es: 'Se aprobó el plan de ordenamiento ecoturístico actualizado del parque: regula 14 de 42 escenarios identificados. El Sendero Ecológico por la Paz no quedó incluido.', en: 'The park\'s updated ecotourism plan was approved: it regulates 14 of 42 identified sites. The Peace Ecological Trail was not included.' } },
  { d: { es: '15 jul 2026', en: '15 Jul 2026' }, t: { es: 'Parques lo reitera: sigue sin reglamentar', en: 'Parks repeats it: still unregulated' }, s: { es: 'En respuesta oficial, el parque dice que Caño Canoas y Siete Machos siguen sin reglamentar, que advirtió por escrito a las empresas que venden paquetes sin su aval y pide denunciar a operadores irregulares. Hay un proyecto para ordenar el sendero, pero sin fecha ni recursos confirmados.', en: 'In an official reply, the park says Caño Canoas and Siete Machos are still unregulated, that it formally warned companies selling packages without its approval, and asks people to report irregular operators. There\'s a project to regulate the trail, but no confirmed date or funding.' } },
  { d: { es: '29 may 2026', en: '29 May 2026' }, t: { es: 'Abre la temporada 2026 de Caño Cristales', en: 'Caño Cristales 2026 season opens' }, s: { es: 'Caño Cristales sí está habilitado y se puede visitar hasta inicios de diciembre, con permiso tramitado por agencia certificada o guía local.', en: 'Caño Cristales is authorized and can be visited until early December, with a permit arranged by a certified agency or local guide.' } }
];

/* ---------- Datos de Caño Canoas ---------- */
const CANOAS = {
  stats: [['70 m', { es: 'de alto tiene la pared de agua', en: 'tall water wall' }], ['~200 m', { es: 'de frente de cascadas', en: 'wide curtain of falls' }], ['3–4 km', { es: 'de caminata en circuito', en: 'loop walk' }], ['~3 h', { es: 'dura el recorrido con guía', en: 'guided walk time' }]],
  what: [
    { es: 'Una pared de roca cubierta de selva de unos 70 metros de alto y casi 200 de frente, de la que caen varias cascadas que forman una piscina natural muy honda.', en: 'A jungle-covered rock wall about 70 metres high and nearly 200 wide, with several waterfalls dropping into a very deep natural pool.' },
    { es: 'Está dentro del Parque Nacional Natural Sierra de La Macarena, en jurisdicción de La Macarena (Meta), en el llamado Sendero Ecológico por la Paz, que va de Piñalito (Vistahermosa) a La Macarena.', en: 'It\'s inside Sierra de La Macarena National Natural Park, in La Macarena (Meta), on the so-called Peace Ecological Trail running from Piñalito (Vistahermosa) to La Macarena.' },
    { es: 'Se hizo famosa en redes como "la cascada más bonita de Colombia" y "la hermana de Caño Cristales". Por eso aparecen muchas agencias vendiéndola.', en: 'It went viral as "Colombia\'s most beautiful waterfall" and "Caño Cristales\' sister". That\'s why so many agencies sell it.' },
    { es: 'Está a unos 250 a 300 metros sobre el nivel del mar: hace calor húmedo, llueve fuerte y los caños pueden crecer en minutos.', en: 'It sits around 250 to 300 metres above sea level: hot and humid, with heavy rain, and streams can rise within minutes.' }
  ],
  prices: [
    [{ es: 'Manilla o entrada', en: 'Entry wristband' }, '$60.000 – $100.000', { es: 'por persona', en: 'per person' }],
    [{ es: 'Guía local', en: 'Local guide' }, '$90.000 – $100.000', { es: 'por grupo de 7 u 8', en: 'per group of 7 or 8' }],
    [{ es: 'Moto desde La Macarena', en: 'Motorbike from La Macarena' }, '$180.000 – $200.000', { es: 'ida y vuelta', en: 'round trip' }],
    [{ es: 'Plan 2 días con Siete Machos', en: '2-day plan with Siete Machos' }, '≈ $1.300.000', { es: 'por persona, desde Mesetas', en: 'per person, from Mesetas' }],
    [{ es: 'Plan 3 días con Cristales', en: '3-day plan with Cristales' }, '$1.850.000 – $2.500.000', { es: 'por persona', en: 'per person' }]
  ],
  ifgo: [
    { es: 'Antes de pagar, pregúntale a Parques Nacionales si hay novedades: el estado puede cambiar si reglamentan el sendero.', en: 'Before paying, ask National Parks for updates: the status could change if the trail gets regulated.' },
    { es: 'Pide a la agencia su Registro Nacional de Turismo (RNT) y la póliza de seguro que cubre ese recorrido. Si no te la muestran, no vayas.', en: 'Ask the agency for its National Tourism Registry (RNT) number and the insurance policy covering that route. If they won\'t show it, don\'t go.' },
    { es: 'Grupos pequeños y con más de un guía. Treinta personas con un solo guía no es seguro.', en: 'Small groups with more than one guide. Thirty people with one guide isn\'t safe.' },
    { es: 'No te metas al agua si está lloviendo, si llovió en la sierra o si el agua se ve turbia o subiendo. Las crecientes llegan sin aviso.', en: 'Don\'t get in the water if it\'s raining, if it rained up in the hills, or if the water looks muddy or is rising. Flash floods come without warning.' },
    { es: 'Nunca nades en la base de la cascada ni en corrientes, aunque sepas nadar. Lleva chaleco salvavidas si te vas a bañar.', en: 'Never swim at the foot of the waterfall or in currents, even if you can swim. Wear a life jacket if you\'re going in.' },
    { es: 'Casi no hay señal: deja con tu familia la ruta, el nombre de la agencia y la hora de regreso.', en: 'There\'s almost no signal: leave your route, the agency\'s name and your return time with family.' }
  ]
};

/* ---------- Caño Cristales: la vía legal ---------- */
const CRISTALES = {
  fees: [[{ es: 'Menores de 25 años', en: 'Under 25' }, 28000], [{ es: 'Mayores de 25 años', en: '25 and over' }, 51500], [{ es: 'Turistas extranjeros', en: 'Foreign tourists' }, 78500]],
  reqs: [
    { es: '<b>Permiso previo:</b> se tramita solo con una agencia operadora certificada o un guía local habilitado. No se venden entradas sueltas.', en: '<b>Prior permit:</b> arranged only through a certified operator or authorized local guide. Individual tickets aren\'t sold.' },
    { es: '<b>Vacuna contra la fiebre amarilla</b> aplicada al menos 10 días antes del viaje. Lleva el carné.', en: '<b>Yellow fever vaccine</b> at least 10 days before the trip. Bring the card.' },
    { es: '<b>Charla de inducción</b> obligatoria con Parques y Cormacarena al llegar a La Macarena.', en: '<b>Mandatory induction talk</b> with the Parks service and Cormacarena on arrival in La Macarena.' },
    { es: '<b>Guía local</b> todo el tiempo en los senderos.', en: '<b>Local guide</b> at all times on the trails.' },
    { es: '<b>Documentos:</b> cédula o pasaporte, seguridad social o seguro, y seguro contra accidentes vigente.', en: '<b>Documents:</b> ID or passport, health cover and valid accident insurance.' },
    { es: '<b>Prohibido:</b> sandalias o chanclas, plásticos de un solo uso, botellas plásticas y latas.', en: '<b>Banned:</b> sandals or flip-flops, single-use plastics, plastic bottles and cans.' }
  ]
};

/* ---------- Cómo llegar ---------- */
const ROUTES = [
  { ph: 'avion', t: { es: 'En avión a La Macarena', en: 'Flying to La Macarena' }, time: { es: '≈ 50 min desde Bogotá', en: '≈ 50 min from Bogotá' },
    d: { es: 'Satena vuela Bogotá–La Macarena en temporada. Operadores reportan salidas miércoles, viernes y domingo, con un costo aproximado de $450.000 ida y vuelta. Satena también ha operado Medellín–La Macarena los martes y jueves. Confirma días y precios en satena.com: cambian cada temporada.', en: 'Satena flies Bogotá–La Macarena in season. Operators report Wednesday, Friday and Sunday departures for about COP 450,000 return. Satena has also run Medellín–La Macarena on Tuesdays and Thursdays. Check days and fares at satena.com: they change every season.' } },
  { ph: 'vistahermosa', t: { es: 'Bus, campero y lancha por Vistahermosa', en: 'Bus, jeep and boat via Vistahermosa' }, time: { es: '≈ 12 h desde Bogotá', en: '≈ 12 h from Bogotá' },
    d: { es: 'Bus de Bogotá a Vistahermosa pasando por Villavicencio, campero hasta Yarumales y lancha hasta La Macarena. Es la ruta que usan muchas agencias por tierra.', en: 'Bus from Bogotá to Vistahermosa via Villavicencio, jeep to Yarumales and boat to La Macarena. It\'s the overland route many agencies use.' } },
  { ph: 'guaviare', t: { es: 'Por San José del Guaviare', en: 'Via San José del Guaviare' }, time: { es: 'Viaje largo, un día o más', en: 'Long trip, a day or more' },
    d: { es: 'Bus de Villavicencio a San José del Guaviare y de ahí colectivo hasta La Macarena.', en: 'Bus from Villavicencio to San José del Guaviare, then a shared ride to La Macarena.' } },
  { ph: 'caguan', t: { es: 'Por Neiva y San Vicente del Caguán', en: 'Via Neiva and San Vicente del Caguán' }, time: { es: 'Viaje largo, en 4x4', en: 'Long trip, by 4x4' },
    d: { es: 'Bus a Neiva, luego a San Vicente del Caguán (Caquetá) y camionetas 4x4 directas a La Macarena.', en: 'Bus to Neiva, then to San Vicente del Caguán (Caquetá) and direct 4x4 trucks to La Macarena.' } },
  { ph: 'mesetas', t: { es: 'Salida desde Mesetas', en: 'Leaving from Mesetas' }, time: { es: '≈ 7 h por vía destapada', en: '≈ 7 h on dirt roads' },
    d: { es: 'Algunos operadores salen de Mesetas (Meta) de madrugada, entre 4:30 y 5:30 a. m., en moto o 4x4 hacia la serranía.', en: 'Some operators leave Mesetas (Meta) before dawn, between 4:30 and 5:30 am, by motorbike or 4x4 towards the hills.' } }
];

/* ---------- Lista para empacar ---------- */
const PREP = [
  { es: ['Vacuna de fiebre amarilla', 'Mínimo 10 días antes del viaje. Lleva el carné físico o digital.'], en: ['Yellow fever vaccine', 'At least 10 days before travel. Bring the card, paper or digital.'] },
  { es: ['Cédula o pasaporte', 'Si eres extranjero, pasaporte y el Check-MIG de Migración Colombia.'], en: ['ID or passport', 'If you\'re foreign, passport plus Migración Colombia\'s Check-MIG.'] },
  { es: ['Seguro contra accidentes', 'Mejor si cubre evacuación. Pide la póliza a la agencia.'], en: ['Accident insurance', 'Ideally covering evacuation. Ask the agency for the policy.'] },
  { es: ['Efectivo suficiente', 'En La Macarena casi no hay cajeros confiables.'], en: ['Enough cash', 'There are hardly any reliable ATMs in La Macarena.'] },
  { es: ['Zapatos cerrados con buen agarre', 'Las rocas mojadas resbalan. Las chanclas están prohibidas en Cristales.'], en: ['Closed shoes with good grip', 'Wet rocks are slippery. Flip-flops are banned at Cristales.'] },
  { es: ['Ropa liviana de manga larga e impermeable', 'Sol fuerte, mosquitos y aguaceros.'], en: ['Light long sleeves and a rain jacket', 'Strong sun, mosquitoes and downpours.'] },
  { es: ['Termo o botella reutilizable', 'No dejan entrar plásticos de un solo uso.'], en: ['Reusable bottle', 'Single-use plastics aren\'t allowed in.'] },
  { es: ['Bolsa seca para el celular', 'Para cruces de agua y lluvia.'], en: ['Dry bag for your phone', 'For water crossings and rain.'] },
  { es: ['Batería externa y linterna', 'En los senderos no hay señal ni luz.'], en: ['Power bank and torch', 'No signal or light on the trails.'] },
  { es: ['Botiquín y tus medicinas', 'El centro de salud más cercano queda lejos.'], en: ['First-aid kit and your medicines', 'The nearest health post is far away.'] },
  { es: ['Chaleco salvavidas si te vas a bañar', 'Pídelo a la agencia antes de entrar al agua.'], en: ['Life jacket if you\'ll swim', 'Ask the agency for one before getting in.'] },
  { es: ['Ruta compartida con tu familia', 'Agencia, guía, lugar y hora de regreso.'], en: ['Route shared with family', 'Agency, guide, place and return time.'] }
];

/* ---------- Caños vecinos ---------- */
const NEAR = [
  { ph: 'cristales', ok: true, n: { es: 'Caño Cristales', en: 'Caño Cristales' }, d: { es: 'El "río de los cinco colores". Es el único sector habilitado para ecoturismo en el parque. Temporada 2026 abierta.', en: 'The "river of five colours". The only area authorized for ecotourism in the park. 2026 season open.' } },
  { ph: 'sietemachos', ok: false, n: { es: 'Caño Siete Machos', en: 'Caño Siete Machos' }, d: { es: 'Caño de colores que venden junto con Canoas. Parques confirmó en julio de 2026 que sigue sin reglamentar.', en: 'Colourful stream sold together with Canoas. The Parks service confirmed in July 2026 that it\'s still unregulated.' } },
  { ph: 'indio', ok: null, n: { es: 'Caño Indio', en: 'Caño Indio' }, d: { es: 'Otro caño de la zona que mencionan guías y agencias. Pregunta a Parques si está permitido antes de ir.', en: 'Another stream in the area mentioned by guides and agencies. Ask the Parks service whether it\'s allowed before going.' } },
  { ph: 'yarumales', ok: null, n: { es: 'Caño Yarumales', en: 'Caño Yarumales' }, d: { es: 'Queda en la ruta por tierra desde Vistahermosa. Confirma su estado con Parques antes de hacer el recorrido.', en: 'On the overland route from Vistahermosa. Confirm its status with the Parks service before going.' } },
  { ph: 'guayabero', ok: null, n: { es: 'Río Guayabero', en: 'Guayabero River' }, d: { es: 'El gran río de La Macarena, con raudales y lanchas. Es la puerta de entrada al pueblo por la vía de Yarumales.', en: 'La Macarena\'s great river, with rapids and boats. It\'s the gateway to town on the Yarumales route.' } }
];

/* ---------- Mapa ---------- */
const MAP_PTS = [
  { id: 'pueblo', cat: 'base', lat: 2.1808, lon: -73.7864, n: { es: 'La Macarena (pueblo y aeropuerto)', en: 'La Macarena (town and airport)' }, d: { es: 'Base para todos los recorridos. Charla de inducción, agencias y hospedaje.', en: 'Base for every trip. Induction talk, agencies and lodging.' } },
  { id: 'cristales', cat: 'ok', lat: 2.2650, lon: -73.7950, n: { es: 'Caño Cristales (zona aproximada)', en: 'Caño Cristales (approximate area)' }, d: { es: 'Sector habilitado. Solo con permiso y guía.', en: 'Authorized area. Permit and guide only.' } },
  { id: 'vistahermosa', cat: 'route', lat: 3.1245, lon: -73.7517, n: { es: 'Vistahermosa', en: 'Vistahermosa' }, d: { es: 'Paso de la ruta por tierra. Piñalito, inicio del Sendero Ecológico por la Paz, es de este municipio.', en: 'Overland route stop. Piñalito, where the Peace Ecological Trail starts, belongs to this municipality.' } },
  { id: 'mesetas', cat: 'route', lat: 3.3836, lon: -74.0443, n: { es: 'Mesetas', en: 'Mesetas' }, d: { es: 'Algunos operadores salen de aquí de madrugada.', en: 'Some operators leave from here before dawn.' } },
  { id: 'villavo', cat: 'route', lat: 4.1420, lon: -73.6266, n: { es: 'Villavicencio', en: 'Villavicencio' }, d: { es: 'Capital del Meta y punto de encuentro de muchas excursiones.', en: 'Capital of Meta and meeting point for many tours.' } },
  { id: 'guaviare', cat: 'route', lat: 2.5729, lon: -72.6459, n: { es: 'San José del Guaviare', en: 'San José del Guaviare' }, d: { es: 'Ruta alterna por el sur.', en: 'Alternative southern route.' } },
  { id: 'caguan', cat: 'route', lat: 2.1150, lon: -74.7700, n: { es: 'San Vicente del Caguán', en: 'San Vicente del Caguán' }, d: { es: 'Salen camionetas 4x4 hacia La Macarena.', en: '4x4 trucks leave for La Macarena.' } }
];

/* ---------- Hablar llanero ---------- */
const LLANERO = [
  ['Caño', 'Quebrada o arroyo de agua', 'Stream or creek', 'Vamos para el caño a bañarnos.'],
  ['Raudal', 'Tramo de río con rápidos y piedras', 'River rapids', 'En el raudal la lancha va despacio.'],
  ['Creciente', 'Cuando el río sube de golpe', 'Sudden rise of a river', 'Salgan del agua que viene la creciente.'],
  ['Invierno y verano', 'Época de lluvias y época seca', 'Rainy season and dry season', 'En invierno los caños se ponen bravos.'],
  ['Morichal', 'Zona de palmas de moriche junto al agua', 'Moriche palm swamp', 'Allá en el morichal hay mucho pájaro.'],
  ['Chinchorro', 'Hamaca tejida', 'Woven hammock', 'Colgamos el chinchorro y a descansar.'],
  ['Cotizas', 'Sandalias de cuero llaneras', 'Llanero leather sandals', 'Con cotizas no te dejan entrar a Cristales.'],
  ['Mamona', 'Ternera asada a la llanera', 'Llanos-style roast veal', 'Esta noche hay mamona en el pueblo.'],
  ['Guarapo', 'Bebida de panela fermentada', 'Fermented cane-sugar drink', 'Regáleme un guarapo bien frío.'],
  ['Joropo', 'Música y baile del Llano', 'Llanos music and dance', 'El sábado hay joropo en la plaza.'],
  ['Guate', 'Persona que viene del interior del país', 'Someone from inland Colombia', 'Ese guate no aguanta el calor.'],
  ['Baquiano', 'Persona que conoce muy bien el camino', 'Someone who knows the way well', 'Vaya con un baquiano de la zona.']
];
const PHRASES = [
  ['Does the river rise fast when it rains?', '¿El río crece rápido cuando llueve?', 'dəz thə RI-ver raiz fast wen it reinz'],
  ['Do you have a life jacket for me?', '¿Tiene un chaleco salvavidas para mí?', 'du yu hav ə LAIF JA-ket for mi'],
  ['What is your tourism registry number?', '¿Cuál es su número de Registro Nacional de Turismo?', 'wat iz yor TU-ri-zəm RE-jis-tri NAM-ber'],
  ['How many guides come with the group?', '¿Cuántos guías van con el grupo?', 'hau ME-ni gaidz kam wiz thə grup'],
  ['Is there phone signal on the trail?', '¿Hay señal de celular en el sendero?', 'iz zer foun SIG-nəl on thə treil'],
  ['I need a doctor, please.', 'Necesito un médico, por favor.', 'ai nid ə DOK-tor, pliz']
];
const DIALOGS = [
  { t: { es: 'Con la agencia, antes de pagar', en: 'With the agency, before paying' }, l: [
    ['a', '¿Este plan incluye Caño Canoas? ¿Está autorizado por Parques Nacionales?', 'Does this plan include Caño Canoas? Is it authorized by National Parks?'],
    ['b', 'Sí, lo llevamos todas las semanas.', 'Yes, we go every week.'],
    ['a', 'Eso no me dice si está autorizado. ¿Me muestra su RNT y la póliza que cubre ese recorrido?', 'That doesn\'t tell me if it\'s authorized. Can you show me your RNT and the policy covering that route?'],
    ['b', 'Le mando los documentos por WhatsApp.', 'I\'ll send you the documents on WhatsApp.']] },
  { t: { es: 'Con el guía, en el caño', en: 'With the guide, at the stream' }, l: [
    ['a', 'Ayer llovió en la sierra. ¿Es seguro meterse hoy?', 'It rained up in the hills yesterday. Is it safe to go in today?'],
    ['b', 'Mire el color del agua: si viene turbia, nadie se mete.', 'Look at the water colour: if it\'s muddy, nobody goes in.'],
    ['a', '¿Y por dónde salimos si empieza a crecer?', 'And which way do we get out if it starts rising?'],
    ['b', 'Por la piedra alta de la izquierda. Ya les muestro.', 'By the high rock on the left. I\'ll show you.']] }
];

/* ---------- Emergencias ---------- */
const EMERG = [
  { n: '123', cls: '', t: { es: 'Línea única de emergencias', en: 'Emergency line' }, s: { es: 'Policía, ambulancia, bomberos', en: 'Police, ambulance, fire' } },
  { n: '132', cls: 'ink', t: { es: 'Cruz Roja', en: 'Red Cross' }, s: { es: 'Ambulancia y rescate', en: 'Ambulance and rescue' } },
  { n: '119', cls: 'sea', t: { es: 'Bomberos', en: 'Fire brigade' }, s: { es: 'Incendios y rescates', en: 'Fires and rescues' } },
  { n: '165', cls: 'sky', t: { es: 'Gaula', en: 'Gaula' }, s: { es: 'Extorsión y secuestro', en: 'Extortion and kidnapping' } },
  { n: '155', cls: 'ink', t: { es: 'Línea para mujeres', en: 'Women\'s line' }, s: { es: 'Orientación ante violencia', en: 'Help against violence' } },
  { n: '141', cls: 'sea', t: { es: 'ICBF (niños)', en: 'ICBF (children)' }, s: { es: 'Protección de niños y niñas', en: 'Child protection' } }
];

// Festivos de Colombia 2026 y 2027 (Ley Emiliani).
const HOLIDAYS = [
  ['2026-11-02', { es: 'Todos los Santos', en: 'All Saints\' Day' }], ['2026-11-16', { es: 'Independencia de Cartagena', en: 'Cartagena Independence' }],
  ['2026-12-08', { es: 'Inmaculada Concepción', en: 'Immaculate Conception' }], ['2026-12-25', { es: 'Navidad', en: 'Christmas Day' }],
  ['2027-01-01', { es: 'Año Nuevo', en: 'New Year\'s Day' }], ['2027-01-11', { es: 'Reyes Magos', en: 'Epiphany' }],
  ['2027-03-22', { es: 'San José', en: 'Saint Joseph' }], ['2027-03-25', { es: 'Jueves Santo', en: 'Holy Thursday' }],
  ['2027-03-26', { es: 'Viernes Santo', en: 'Good Friday' }], ['2027-05-01', { es: 'Día del Trabajo', en: 'Labour Day' }],
  ['2027-05-10', { es: 'Ascensión', en: 'Ascension' }], ['2027-05-31', { es: 'Corpus Christi', en: 'Corpus Christi' }],
  ['2027-06-07', { es: 'Sagrado Corazón', en: 'Sacred Heart' }], ['2027-07-05', { es: 'San Pedro y San Pablo', en: 'Saints Peter and Paul' }],
  ['2027-07-20', { es: 'Independencia de Colombia', en: 'Colombian Independence' }], ['2027-08-07', { es: 'Batalla de Boyacá', en: 'Battle of Boyacá' }],
  ['2027-08-16', { es: 'Asunción de la Virgen', en: 'Assumption' }], ['2027-10-18', { es: 'Día de la Raza', en: 'Columbus Day' }],
  ['2027-11-01', { es: 'Todos los Santos', en: 'All Saints\' Day' }], ['2027-11-15', { es: 'Independencia de Cartagena', en: 'Cartagena Independence' }],
  ['2027-12-08', { es: 'Inmaculada Concepción', en: 'Immaculate Conception' }], ['2027-12-25', { es: 'Navidad', en: 'Christmas Day' }]
];

const VIDEOS = [
  { ph: 'canoas', q: 'Caño Canoas Meta', t: { es: 'Caño Canoas', en: 'Caño Canoas' }, s: { es: 'Videos de viajeros en YouTube', en: 'Traveller videos on YouTube' } },
  { ph: 'cristales', q: 'Caño Cristales 2026', t: { es: 'Caño Cristales 2026', en: 'Caño Cristales 2026' }, s: { es: 'El río de los cinco colores', en: 'The river of five colours' } },
  { ph: 'macarenia', q: 'Macarenia clavigera', t: { es: 'La planta de los colores', en: 'The colour plant' }, s: { es: 'Por qué el río se pone rojo', en: 'Why the river turns red' } },
  { ph: 'pueblo', q: 'La Macarena Meta pueblo', t: { es: 'La Macarena, el pueblo', en: 'La Macarena town' }, s: { es: 'Cómo es la base del viaje', en: 'What the trip\'s base is like' } }
];

/* ---------- Secciones (vistas) ---------- */
const SECTIONS = [
  { id: 'status', ph: 'crecida', badge: { es: 'Léelo primero', en: 'Read first' }, t: { es: 'Estado oficial y seguridad', en: 'Official status & safety' }, s: { es: 'Lo que dice Parques Nacionales', en: 'What National Parks says' } },
  { id: 'canoas', ph: 'canoas', t: { es: 'Caño Canoas', en: 'Caño Canoas' }, s: { es: 'Qué es y cuánto cobran', en: 'What it is and what it costs' } },
  { id: 'cristales', ph: 'cristales', badge: { es: 'Abierto', en: 'Open' }, t: { es: 'Caño Cristales: la vía legal', en: 'Caño Cristales: the legal way' }, s: { es: 'Tarifas 2026 y requisitos', en: '2026 fees and requirements' } },
  { id: 'route', ph: 'guayabero', t: { es: 'Cómo llegar', en: 'Getting there' }, s: { es: 'Avión, bus, 4x4 y lancha', en: 'Plane, bus, 4x4 and boat' } },
  { id: 'budget', ph: 'peso', t: { es: 'Presupuesto', en: 'Budget' }, s: { es: 'Calcula tu viaje', en: 'Work out your trip' } },
  { id: 'prep', ph: 'botas', t: { es: 'Qué llevar', en: 'What to bring' }, s: { es: 'Lista que se guarda', en: 'Checklist that saves' } },
  { id: 'near', ph: 'sierra', t: { es: 'Caños vecinos', en: 'Nearby streams' }, s: { es: 'Cuáles están permitidos', en: 'Which are allowed' } },
  { id: 'weather', ph: 'tormenta', t: { es: 'Clima y lluvia', en: 'Weather & rain' }, s: { es: 'Pronóstico en La Macarena', en: 'La Macarena forecast' } },
  { id: 'money', ph: 'mamona', t: { es: 'Peso y cambio', en: 'Peso & exchange' }, s: { es: 'Dólar y euro en vivo', en: 'Dollar and euro live' } },
  { id: 'talk', ph: 'llanero', t: { es: 'Hablar llanero', en: 'Speak llanero' }, s: { es: 'Palabras y frases útiles', en: 'Words and useful phrases' } },
  { id: 'map', ph: 'mapa', t: { es: 'Mapa', en: 'Map' }, s: { es: 'Rutas y base del viaje', en: 'Routes and trip base' } },
  { id: 'media', ph: 'macarenia', t: { es: 'Fotos y videos', en: 'Photos & videos' }, s: { es: 'Conoce la serranía', en: 'See the hills' } }
];
const WIDE = ['status', 'cristales', 'media'];

function head(title, sub) {
  return `<button class="back" onclick="go('home')">${L(T.back)}</button>
  <div class="sec-head" style="margin-top:0"><div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div></div>`;
}

const V = {};

V.home = () => `
  <div class="hero" id="hero">
    <div class="dots" id="hero-dots"></div>
    <span class="cap" id="hero-cap"></span>
    <div class="in">
      <span class="kicker">${L({ es: 'Serranía de La Macarena · Meta', en: 'Serranía de La Macarena · Meta' })}</span>
      <h1>${L({ es: 'Caño Canoas sin cuentos', en: 'Caño Canoas, no hype' })}</h1>
      <p>${L({ es: 'La cascada que se volvió famosa en redes: qué es, qué dice la autoridad, cómo cuidarte y cómo conocer la Macarena de forma legal y segura.', en: 'The waterfall that went viral: what it is, what the authorities say, how to stay safe and how to see the Macarena legally and safely.' })}</p>
    </div>
  </div>
  <div class="status" onclick="go('status')">
    <span class="kicker">${L({ es: 'Estado oficial', en: 'Official status' })}</span>
    <b>${L({ es: 'Caño Canoas NO está habilitado para turismo', en: 'Caño Canoas is NOT authorized for tourism' })}</b>
    <div class="small" style="opacity:.94;margin-top:4px">${L({ es: 'Parques Nacionales lo reiteró el 15 de julio de 2026: el sendero sigue sin reglamentar. Toca para ver por qué y qué hacer.', en: 'National Parks repeated it on 15 July 2026: the trail is still unregulated. Tap to see why and what to do.' })}</div>
  </div>
  <div id="alert"></div>
  <div class="live">
    <div class="lc dark"><div class="lab">${L({ es: 'Clima en La Macarena', en: 'Weather in La Macarena' })}</div><div class="big" id="wx-now"><span class="spin"></span></div><div class="sub" id="wx-sub"></div></div>
    <div class="lc sea"><div class="lab">${L({ es: 'Hora en Colombia', en: 'Time in Colombia' })}</div><div class="big" id="clk-co">--:--</div><div class="sub" id="clk-sub"></div></div>
    <div class="lc c3"><div class="lab">${L({ es: '1 dólar hoy', en: '1 US dollar today' })}</div><div class="big" id="fx-usd"><span class="spin"></span></div><div class="sub muted" id="fx-sub"></div></div>
  </div>
  <div id="rain-strip"></div>
  <div class="ptiles">
    ${SECTIONS.map(s => `<button class="pt ${s.badge ? 'hot' : ''} ${WIDE.includes(s.id) ? 'wide' : ''}" ${s.badge ? `data-badge="${esc(L(s.badge))}"` : ''} ${photo(s.ph)} onclick="go('${s.id}')"><b>${L(s.t)}</b><small>${L(s.s)}</small></button>`).join('')}
  </div>`;

V.status = () => `
  ${head(L({ es: 'Estado oficial y seguridad', en: 'Official status & safety' }), L({ es: 'Lo que ha dicho la autoridad ambiental, en orden.', en: 'What the environmental authority has said, in order.' }))}
  <div class="status" style="cursor:default">
    <span class="kicker">${L({ es: 'Verificado el ', en: 'Checked on ' }) + VERIFIED}</span>
    <b>${L({ es: 'No habilitado · Sin reglamentar · Zona con problemas de orden público', en: 'Not authorized · Unregulated · Area with security problems' })}</b>
    <div class="small" style="opacity:.94;margin-top:4px">${L({ es: 'Caño Canoas queda dentro de un Parque Nacional Natural. El único sector del parque habilitado para ecoturismo es Caño Cristales.', en: 'Caño Canoas lies inside a National Natural Park. The only part of the park authorized for ecotourism is Caño Cristales.' })}</div>
  </div>
  <div class="card mt2 reveal"><h3>${L({ es: 'Qué ha pasado', en: 'What has happened' })}</h3>
    <div class="tl mt">${TIMELINE.map(e => `<div class="ev"><small>${L(e.d)}</small><div><b>${L(e.t)}</b></div><div class="small">${L(e.s)}</div></div>`).join('')}</div>
  </div>
  <div class="grid g2 stack mt2">
    <div class="card dark reveal"><h3>${L({ es: 'Qué significa para ti', en: 'What it means for you' })}</h3><ul class="small">
      <li>${L({ es: 'Nadie controla cuántas personas entran, ni exige guías certificados o equipos de rescate.', en: 'Nobody controls how many people go in or requires certified guides or rescue gear.' })}</li>
      <li>${L({ es: 'Si pasa algo, la ayuda puede tardar horas: hay poca presencia de autoridades.', en: 'If something happens, help can take hours: there\'s little official presence.' })}</li>
      <li>${L({ es: 'Los seguros de muchas agencias podrían no cubrir un lugar no autorizado.', en: 'Many agencies\' insurance may not cover an unauthorized site.' })}</li>
      <li>${L({ es: 'La ley ambiental protege los parques nacionales: la actividad no autorizada puede traer sanciones.', en: 'Environmental law protects national parks: unauthorized activity can lead to penalties.' })}</li>
    </ul></div>
    <div class="card reveal"><h3>${L({ es: 'La alternativa segura', en: 'The safe alternative' })}</h3>
      <p class="small">${L({ es: 'Conoce la Serranía de La Macarena por Caño Cristales: está habilitado, con permiso, guía local, charla de inducción y cupos controlados.', en: 'See the Serranía de La Macarena through Caño Cristales: it\'s authorized, with permits, local guides, an induction talk and controlled numbers.' })}</p>
      <div class="btns"><button class="btn red" onclick="go('cristales')">${L({ es: 'Ver Caño Cristales', en: 'See Caño Cristales' })}</button></div>
    </div>
  </div>
  <div class="sec-head"><div><h2>${L({ es: 'Si aun así decides ir', en: 'If you decide to go anyway' })}</h2><p>${L({ es: 'No lo recomendamos. Pero si vas, no te expongas más de la cuenta.', en: 'We don\'t recommend it. But if you go, don\'t take extra risks.' })}</p></div></div>
  <div class="status-list">${CANOAS.ifgo.map((t, i) => `<div class="sl reveal"><div>${num(L(t), i)}</div></div>`).join('')}</div>
  <div class="note red mt2">${L({ es: 'Si alguien cae al agua, <b>no te lances detrás</b>. Lánzale algo que flote, grita para que se aleje de la corriente y llama al 123 apenas tengas señal.', en: 'If someone falls in, <b>don\'t jump in after them</b>. Throw them something that floats, shout for them to move out of the current and call 123 as soon as you have signal.' })}</div>
  <div class="btns mt2">${linkBtn('https://www.parquesnacionales.gov.co/atencion-al-ciudadano/', L({ es: 'Consultar a Parques Nacionales', en: 'Ask National Parks' }), 'red')}${linkBtn('https://www.cormacarena.gov.co/', 'Cormacarena')}</div>`;

V.canoas = () => `
  ${head(L({ es: 'Caño Canoas', en: 'Caño Canoas' }), L({ es: 'La cortina de cascadas de la Serranía de La Macarena.', en: 'The curtain of waterfalls in the Serranía de La Macarena.' }))}
  <div class="hero" style="min-height:260px" ${photo('canoas')}><div class="in"><span class="kicker">${L({ es: 'No habilitado', en: 'Not authorized' })}</span><h1 style="font-size:2.3rem">${L({ es: 'Una pared de agua en la selva', en: 'A wall of water in the jungle' })}</h1></div></div>
  <div class="stat">${CANOAS.stats.map(s => `<div class="reveal"><strong>${s[0]}</strong><small>${L(s[1])}</small></div>`).join('')}</div>
  <div class="card mt2 reveal"><h3>${L({ es: 'Qué es', en: 'What it is' })}</h3><ul class="small">${CANOAS.what.map(x => `<li>${L(x)}</li>`).join('')}</ul></div>
  <div class="card mt2 reveal"><h3>${L({ es: 'Lo que cobran los operadores', en: 'What operators charge' })}</h3>
    <table class="t mt"><tr><th>${L({ es: 'Concepto', en: 'Item' })}</th><th>${L({ es: 'Valor', en: 'Price' })}</th></tr>
    ${CANOAS.prices.map(p => `<tr><td>${L(p[0])}<div class="small muted">${L(p[2])}</div></td><td class="n">${p[1]}</td></tr>`).join('')}</table>
    <div class="note mt">${L({ es: 'Son precios reportados en prensa, rutas de viajeros y páginas de operadores entre 2024 y 2026. <b>No son tarifas oficiales</b>: como el lugar no está reglamentado, ninguna autoridad fija ni respalda esos cobros.', en: 'These prices come from press reports, traveller routes and operator pages between 2024 and 2026. <b>They aren\'t official fees</b>: since the site isn\'t regulated, no authority sets or backs these charges.' })}</div>
  </div>
  <div class="btns mt2"><button class="btn red" onclick="go('status')">${L({ es: 'Leer el estado oficial', en: 'Read the official status' })}</button><button class="btn" onclick="go('near')">${L({ es: 'Caños vecinos', en: 'Nearby streams' })}</button></div>`;

V.cristales = () => `
  ${head(L({ es: 'Caño Cristales: la vía legal', en: 'Caño Cristales: the legal way' }), L({ es: 'El "río de los cinco colores" sí está habilitado. Así se visita en 2026.', en: 'The "river of five colours" is authorized. Here\'s how to visit in 2026.' }))}
  <div class="hero" style="min-height:260px" ${photo('cristales')}><div class="in"><span class="kicker">${L({ es: 'Temporada 2026', en: '2026 season' })}</span><h1 style="font-size:2.3rem">${L({ es: 'Rojo, amarillo, verde, azul y negro', en: 'Red, yellow, green, blue and black' })}</h1><p>${L({ es: 'Los colores los da la Macarenia clavigera, una planta acuática que florece con el agua justa.', en: 'The colours come from Macarenia clavigera, a water plant that blooms when water levels are just right.' })}</p></div></div>
  <div id="alert2"></div>
  <div class="live" style="margin-top:12px">${CRISTALES.fees.map((f, i) => `<div class="lc ${i === 0 ? 'dark' : i === 1 ? 'sea' : 'c3'}"><div class="lab">${L(f[0])}</div><div class="big">${cop(f[1])}</div><div class="sub" ${i === 2 ? 'id="fee-usd"' : ''}>${L({ es: 'Ingreso 2026', en: '2026 entry' })}</div></div>`).join('')}</div>
  <p class="small muted mt">${L({ es: 'Tarifas de ingreso 2026 publicadas por El Espectador. Se pagan solo a través de agencias operadoras habilitadas; el guía y el transporte se cobran aparte.', en: '2026 entry fees as published by El Espectador. Paid only through authorized operators; guide and transport are extra.' })}</p>
  <div class="card mt2 reveal"><h3>${L({ es: 'Requisitos', en: 'Requirements' })}</h3><ul class="small">${CRISTALES.reqs.map(r => `<li>${L(r)}</li>`).join('')}</ul></div>
  <div class="grid g2 stack mt2">
    <div class="card reveal"><h3>${L({ es: 'Cuándo ir', en: 'When to go' })}</h3><p class="small">${L({ es: 'La temporada va de finales de mayo o junio a noviembre, cuando el nivel del agua deja crecer la planta sin dañarla. De diciembre a mayo suele estar cerrado. En 2026 abrió el 29 de mayo y se espera recibir unos 9.000 visitantes.', en: 'The season runs from late May or June to November, when water levels let the plant grow without damage. It\'s usually closed December to May. In 2026 it opened on 29 May, with around 9,000 visitors expected.' })}</p></div>
    <div class="card reveal"><h3>${L({ es: 'Si vienes de otro país', en: 'If you\'re from abroad' })}</h3><ul class="small">
      <li>${L({ es: 'Pagas la tarifa de extranjero.', en: 'You pay the foreign-visitor fee.' })}</li>
      <li>${L({ es: 'Llena el Check-MIG de Migración Colombia antes de entrar al país.', en: 'Fill in Migración Colombia\'s Check-MIG before entering the country.' })}</li>
      <li>${L({ es: 'Trae el certificado internacional de fiebre amarilla y un seguro de viaje que cubra evacuación.', en: 'Bring the international yellow fever certificate and travel insurance covering evacuation.' })}</li>
      <li>${L({ es: 'Lleva pesos en efectivo desde Bogotá o Villavicencio.', en: 'Bring cash pesos from Bogotá or Villavicencio.' })}</li>
    </ul></div>
  </div>
  <div class="btns mt2">${linkBtn('https://www.cormacarena.gov.co/', L({ es: 'Cormacarena', en: 'Cormacarena' }), 'red')}${linkBtn('https://www.parquesnacionales.gov.co/', L({ es: 'Parques Nacionales', en: 'National Parks' }))}<button class="btn ghost" onclick="go('budget')">${L({ es: 'Calcular presupuesto', en: 'Work out budget' })}</button></div>`;

V.route = () => `
  ${head(L({ es: 'Cómo llegar a La Macarena', en: 'Getting to La Macarena' }), L({ es: 'Todo empieza en el pueblo de La Macarena. Desliza para ver las rutas.', en: 'Everything starts in the town of La Macarena. Swipe to see the routes.' }))}
  <div class="rail">${ROUTES.map((r, i) => `<article class="place"><div class="ph" ${photo(r.ph)}><span class="pill">${L({ es: 'Ruta ', en: 'Route ' })}${i + 1}</span></div><div class="bd"><h3>${L(r.t)}</h3><p><b>${L(r.time)}</b></p><p>${L(r.d)}</p></div></article>`).join('')}</div>
  <div class="note mt2">${L({ es: 'Las vías por tierra son destapadas y pasan por zonas con presencia de grupos armados. Viaja de día, con operadores conocidos, y pregunta por la situación de orden público antes de salir.', en: 'Overland roads are unpaved and cross areas where armed groups operate. Travel by day with known operators and ask about the security situation before leaving.' })}</div>
  <div class="btns mt2">${linkBtn('https://www.satena.com/', 'Satena', 'red')}<button class="btn" onclick="go('map')">${L({ es: 'Ver en el mapa', en: 'See on map' })}</button></div>`;

V.budget = () => `
  ${head(L({ es: 'Presupuesto del viaje', en: 'Trip budget' }), L({ es: 'Pon los valores que te coticen. Los que vienen de ejemplo son de referencia.', en: 'Enter the prices you\'re quoted. The sample values are just a reference.' }))}
  <div class="card reveal">
    <div class="grid g3">
      <div><label class="f">${L({ es: 'Personas', en: 'People' })}</label><input id="b-p" type="number" min="1" max="30" value="2" oninput="calcBudget()"></div>
      <div><label class="f">${L({ es: 'Noches', en: 'Nights' })}</label><input id="b-n" type="number" min="0" max="10" value="2" oninput="calcBudget()"></div>
      <div><label class="f">${L({ es: 'Tarifa Cristales', en: 'Cristales fee' })}</label><select id="b-t" onchange="calcBudget()">${CRISTALES.fees.map((f, i) => `<option value="${i}" ${i === 1 ? 'selected' : ''}>${L(f[0])}</option>`).join('')}<option value="-1">${L({ es: 'No voy a Cristales', en: 'Not visiting Cristales' })}</option></select></div>
      <div><label class="f">${L({ es: 'Transporte ida y vuelta (c/u)', en: 'Return transport (each)' })}</label><input id="b-tr" type="number" min="0" step="10000" value="450000" oninput="calcBudget()"></div>
      <div><label class="f">${L({ es: 'Hospedaje por noche (c/u)', en: 'Lodging per night (each)' })}</label><input id="b-h" type="number" min="0" step="5000" value="60000" oninput="calcBudget()"></div>
      <div><label class="f">${L({ es: 'Comida por día (c/u)', en: 'Food per day (each)' })}</label><input id="b-f" type="number" min="0" step="5000" value="75000" oninput="calcBudget()"></div>
      <div><label class="f">${L({ es: 'Guía y transporte interno (grupo)', en: 'Guide & local transport (group)' })}</label><input id="b-g" type="number" min="0" step="10000" value="200000" oninput="calcBudget()"></div>
      <div><label class="f">${L({ es: 'Seguro (c/u)', en: 'Insurance (each)' })}</label><input id="b-s" type="number" min="0" step="5000" value="30000" oninput="calcBudget()"></div>
      <div><label class="f">${L({ es: 'Imprevistos', en: 'Contingency' })}</label><select id="b-x" onchange="calcBudget()"><option value="0">0%</option><option value="0.1">10%</option><option value="0.15" selected>15%</option><option value="0.2">20%</option></select></div>
    </div>
    <div id="b-out" class="mt2"></div>
    <p class="small muted mt">${L({ es: 'Transporte de ejemplo: vuelo de referencia ida y vuelta (≈ $450.000). Comida: en La Macarena se come desde unos $25.000 por plato. Lleva todo en efectivo.', en: 'Sample transport: reference return flight (≈ COP 450,000). Food: meals in La Macarena start around COP 25,000. Bring it all in cash.' })}</p>
  </div>`;

V.prep = () => `
  ${head(L({ es: 'Qué llevar', en: 'What to bring' }), L({ es: 'Marca cada cosa. Tu avance se guarda en el celular.', en: 'Tick each item. Your progress saves on your phone.' }))}
  <div class="progress"><i id="chk-bar"></i></div><p class="small muted mt" id="chk-txt"></p>
  <div class="status-list mt">${PREP.map((f, i) => { const x = L(f); return `<label class="chk" id="chk-${i}"><input type="checkbox" onchange="tick(${i},this.checked)"><div><b>${esc(x[0])}</b><div class="small muted">${esc(x[1])}</div></div></label>`; }).join('')}</div>
  <div class="btns mt2"><button class="btn ghost sm" onclick="resetChecks()">${L({ es: 'Empezar de nuevo', en: 'Start over' })}</button></div>`;

V.near = () => `
  ${head(L({ es: 'Caños vecinos', en: 'Nearby streams' }), L({ es: 'No todo lo que venden las agencias está permitido.', en: 'Not everything agencies sell is allowed.' }))}
  <div class="rail">${NEAR.map(p => `<article class="place"><div class="ph" ${photo(p.ph)}><span class="pill ${p.ok === true ? 'free' : p.ok === false ? 'paid' : ''}">${p.ok === true ? L({ es: 'Habilitado', en: 'Authorized' }) : p.ok === false ? L({ es: 'Sin reglamentar', en: 'Unregulated' }) : L({ es: 'Confirma con Parques', en: 'Check with Parks' })}</span></div><div class="bd"><h3>${L(p.n)}</h3><p>${L(p.d)}</p>${p.ok === true ? `<div class="btns"><button class="btn sm red" onclick="go('cristales')">${L({ es: 'Ver cómo ir', en: 'See how to go' })}</button></div>` : ''}</div></article>`).join('')}</div>
  <div class="card mt2 reveal"><h3>${L({ es: 'Fauna que puedes ver', en: 'Wildlife you may see' })}</h3><p class="small">${L({ es: 'La Serranía de La Macarena junta los Andes, la Orinoquia y la Amazonia. Es fácil ver guacamayas, la pava hedionda (hoatzín) en las orillas, micos y morichales. No alimentes animales y no saques plantas ni piedras.', en: 'The Serranía de La Macarena joins the Andes, the Orinoco plains and the Amazon. Macaws, the hoatzin on riverbanks, monkeys and moriche palm swamps are easy to spot. Don\'t feed animals or take plants or stones.' })}</p></div>`;

V.weather = () => `
  ${head(L({ es: 'Clima y lluvia', en: 'Weather & rain' }), L({ es: 'Calor húmedo todo el año. En los caños, la lluvia es lo que más hay que vigilar.', en: 'Hot and humid all year. At the streams, rain is what you need to watch most.' }))}
  <div class="card dark"><div class="small" style="opacity:.75">${L({ es: 'Pronóstico en La Macarena', en: 'La Macarena forecast' })}</div><div class="big" id="wx-now2" style="font-family:'Barlow Condensed';font-size:2.4rem;font-weight:800"><span class="spin"></span></div><div class="days" id="wx-days"></div><div class="small mt" style="opacity:.75">${L({ es: 'Máxima · mínima · probabilidad de lluvia', en: 'High · low · chance of rain' })}</div></div>
  <div class="card mt2 reveal"><h3>${L({ es: 'Lluvia y caños', en: 'Rain and streams' })}</h3><ul class="small">
    <li>${L({ es: 'Si llueve en la parte alta de la sierra, el caño puede crecer aunque donde tú estás haga sol.', en: 'If it rains higher up in the hills, the stream can rise even if it\'s sunny where you are.' })}</li>
    <li>${L({ es: 'Señales de creciente: el agua se pone turbia, sube el ruido, aparecen ramas y hojas flotando.', en: 'Flood signs: water turns muddy, the roar gets louder, branches and leaves start floating by.' })}</li>
    <li>${L({ es: 'Ante cualquier señal, sal del agua y sube a terreno alto. No esperes a ver qué pasa.', en: 'At any sign, get out of the water and climb to high ground. Don\'t wait to see what happens.' })}</li>
  </ul></div>
  <div class="sec-head"><div><h2>${L({ es: 'Festivos', en: 'Public holidays' })}</h2><p id="next-hol"></p></div></div>
  <div class="status-list" id="hol-list"></div>
  <p class="small muted mt">${L({ es: 'Los puentes festivos llenan los vuelos y el hospedaje en La Macarena. Reserva con tiempo.', en: 'Long holiday weekends fill flights and lodging in La Macarena. Book early.' })}</p>`;

V.money = () => `
  ${head(L({ es: 'Peso colombiano y cambio', en: 'Colombian peso & exchange' }), L({ es: 'En Colombia se paga en pesos (COP). En La Macarena, en efectivo.', en: 'Colombia pays in pesos (COP). In La Macarena, in cash.' }))}
  <div class="live" style="margin-top:0">
    <div class="lc dark"><div class="lab">${L({ es: '1 dólar (USD)', en: '1 US dollar' })}</div><div class="big" id="fx-usd2"><span class="spin"></span></div><div class="sub" id="fx-sub2"></div></div>
    <div class="lc sea"><div class="lab">${L({ es: '1 euro (EUR)', en: '1 euro' })}</div><div class="big" id="fx-eur"><span class="spin"></span></div><div class="sub">${L({ es: 'Tasa del día', en: 'Today\'s rate' })}</div></div>
    <div class="lc c3"><div class="lab">${L({ es: '100 bolívares (VES)', en: '100 bolívars (VES)' })}</div><div class="big" id="fx-ves"><span class="spin"></span></div><div class="sub muted">${L({ es: 'Tasa de referencia', en: 'Reference rate' })}</div></div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Convertidor', en: 'Converter' })}</h3>
    <div class="grid g2"><div><label class="f">${L({ es: 'Cantidad', en: 'Amount' })}</label><input id="fx-amt" type="number" value="100000" min="0" oninput="convert()"></div>
    <div><label class="f">${L({ es: 'Moneda', en: 'Currency' })}</label><select id="fx-from" onchange="convert()"><option value="COP">${L({ es: 'Peso colombiano (COP)', en: 'Colombian peso (COP)' })}</option><option value="USD">${L({ es: 'Dólar (USD)', en: 'US dollar (USD)' })}</option><option value="EUR">Euro (EUR)</option><option value="VES">${L({ es: 'Bolívar (VES)', en: 'Bolívar (VES)' })}</option></select></div></div>
    <div id="fx-out" class="mt"></div>
  </div>
  <div class="card mt2 reveal"><h3>${L({ es: 'Consejos', en: 'Tips' })}</h3><ul class="small">
    <li>${L({ es: 'Saca el efectivo en Bogotá, Villavicencio o Neiva antes de salir.', en: 'Withdraw cash in Bogotá, Villavicencio or Neiva before setting off.' })}</li>
    <li>${L({ es: 'Lleva billetes pequeños: en veredas y lanchas casi nunca hay cambio.', en: 'Carry small notes: in the countryside and on boats there\'s rarely change.' })}</li>
    <li>${L({ es: 'Paga a la agencia por transferencia a nombre de la empresa y pide factura.', en: 'Pay the agency by transfer to the company\'s name and ask for an invoice.' })}</li>
  </ul></div>`;

let talkTab = 'lla';
V.talk = () => `
  ${head(L({ es: 'Hablar llanero', en: 'Speak llanero' }), L({ es: 'En el Meta se habla con sabor de llano. Toca "Oír" para escuchar.', en: 'In Meta, Spanish has a Llanos flavour. Tap "Hear" to listen.' }))}
  <div class="tabsx" id="talk-tabs">
    <button data-k="lla" onclick="setTalk('lla')">${L({ es: 'Palabras llaneras', en: 'Llanero words' })}</button>
    <button data-k="dlg" onclick="setTalk('dlg')">${L({ es: 'Conversaciones', en: 'Dialogues' })}</button>
    <button data-k="en" onclick="setTalk('en')">${L({ es: 'Frases en inglés', en: 'Phrases in English' })}</button>
  </div>
  <div id="talk-body"></div>`;
function talkBody() {
  const q = s => JSON.stringify(s).replace(/"/g, '&quot;');
  if (talkTab === 'lla') return `<div class="phr">${LLANERO.map(p => `<div class="ph1"><div><div class="o">${esc(p[0])}</div><div class="tr">${esc(LANG === 'es' ? p[1] : p[2])}</div><div class="say">"${esc(p[3])}"</div></div><button onclick="say(${q(p[3])},'es')">${L({ es: 'Oír', en: 'Hear' })}</button></div>`).join('')}</div>`;
  if (talkTab === 'en') return `<div class="phr">${PHRASES.map(p => `<div class="ph1"><div><div class="o">${esc(p[0])}</div><div class="tr">${esc(p[1])}</div><div class="say">${esc(p[2])}</div></div><button onclick="say(${q(p[0])},'en')">${L({ es: 'Oír', en: 'Hear' })}</button></div>`).join('')}</div><p class="small muted mt">${L({ es: 'La pronunciación es aproximada; la sílaba en mayúscula es la fuerte.', en: 'Pronunciation is approximate; the capitalised syllable is stressed.' })}</p>`;
  return DIALOGS.map(d => `<div class="card mt reveal in"><h3>${L(d.t)}</h3>${d.l.map(x => `<div class="dlg ${x[0]}">${esc(x[1])}${LANG === 'en' ? `<em>${esc(x[2])}</em>` : ''}</div>`).join('')}</div>`).join('');
}
function setTalk(k) { talkTab = k; const b = $('#talk-body'); if (b) b.innerHTML = talkBody(); $$('#talk-tabs button').forEach(x => x.classList.toggle('on', x.dataset.k === k)); }
function say(text, lang) {
  if (!('speechSynthesis' in window)) { toast(L({ es: 'Tu celular no tiene voz disponible', en: 'No voice available on this device' })); return; }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === 'en' ? 'en-US' : 'es-CO'; u.rate = .9;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}

V.sos = () => `
  ${head('SOS', L({ es: 'Toca un número para llamar. En los senderos casi no hay señal: busca un punto alto o vuelve al pueblo.', en: 'Tap a number to call. There\'s almost no signal on the trails: find high ground or head back to town.' }))}
  <div class="sosgrid">${EMERG.map(e => `<a class="sosbtn ${e.cls}" href="tel:${e.n}"><strong>${e.n}</strong><span>${L(e.t)}</span><small>${L(e.s)}</small></a>`).join('')}</div>
  <div class="sec-head"><div><h2>${L({ es: 'Si alguien se accidenta', en: 'If someone gets hurt' })}</h2></div></div>
  <div class="status-list">${[
    { es: 'Saca al grupo del agua y llévalo a terreno alto.', en: 'Get the group out of the water and onto high ground.' },
    { es: 'No te lances a rescatar en corriente: lanza algo que flote o una cuerda.', en: 'Don\'t jump into a current to rescue: throw something that floats or a rope.' },
    { es: 'Avisa al guía y manda a alguien a buscar señal o ayuda al pueblo.', en: 'Tell the guide and send someone to find signal or help in town.' },
    { es: 'Llama al 123: di que estás en la Serranía de La Macarena, el nombre del caño y cuántas personas hay.', en: 'Call 123: say you\'re in the Serranía de La Macarena, the stream\'s name and how many people are there.' },
    { es: 'Mantén abrigada a la persona y no le des de beber si está inconsciente.', en: 'Keep the person warm and don\'t give drinks if they\'re unconscious.' }
  ].map((t, i) => `<div class="sl"><div>${num(L(t), i)}</div></div>`).join('')}</div>
  <div class="note mt2">${L({ es: 'Si eres de otro país, guarda en tus contactos el consulado de tu país en Colombia antes de viajar.', en: 'If you\'re from another country, save your consulate in Colombia to your contacts before travelling.' })}</div>
  <div class="btns">${linkBtn('https://www.parquesnacionales.gov.co/atencion-al-ciudadano/', L({ es: 'Canales de Parques Nacionales', en: 'National Parks contact' }), 'red sm')}</div>`;

V.map = () => `
  ${head(L({ es: 'Mapa de la ruta', en: 'Route map' }), L({ es: 'Toca un punto para ver detalles y abrir la ruta.', en: 'Tap a point for details and directions.' }))}
  <div class="chips" id="map-chips">
    ${[['all', { es: 'Todo', en: 'All' }], ['base', { es: 'Base', en: 'Base' }], ['ok', { es: 'Habilitado', en: 'Authorized' }], ['route', { es: 'Rutas de llegada', en: 'Access routes' }]].map((c, i) => `<button data-c="${c[0]}" class="${i ? '' : 'on'}" onclick="mapFilter('${c[0]}')">${L(c[1])}</button>`).join('')}
  </div>
  <div id="map"></div>
  <div class="note mt">${L({ es: 'Caño Canoas está en el Sendero Ecológico por la Paz, entre Piñalito (Vistahermosa) y La Macarena. No marcamos un punto exacto porque no es un sitio habilitado.', en: 'Caño Canoas is on the Peace Ecological Trail between Piñalito (Vistahermosa) and La Macarena. We don\'t pin an exact spot because it isn\'t an authorized site.' })}</div>
  <div class="btns"><button class="btn red sm" onclick="locateMe()">${L({ es: 'Dónde estoy', en: 'Where am I' })}</button><a class="btn sm ghost" href="${gmaps('La Macarena, Meta, Colombia')}" target="_blank" rel="noopener">${L({ es: 'Abrir en Google Maps', en: 'Open in Google Maps' })}</a></div>`;

V.media = () => `
  ${head(L({ es: 'Fotos y videos', en: 'Photos & videos' }), L({ es: 'Fotos reales de Wikipedia y Wikimedia Commons.', en: 'Real photos from Wikipedia and Wikimedia Commons.' }))}
  <div class="gal">${['cristales', 'macarenia', 'sierra', 'guayabero', 'hoatzin', 'pueblo', 'morichal', 'canoas', 'llanero'].map(k => `<figure ${photo(k)}><figcaption>${L(CAPS[k] || { es: k, en: k }) || ''}</figcaption></figure>`).join('')}</div>
  <div class="sec-head"><div><h2>${L({ es: 'Videos', en: 'Videos' })}</h2><p>${L({ es: 'Se abren en YouTube.', en: 'They open on YouTube.' })}</p></div></div>
  <div class="vids">${VIDEOS.map(v => `<a class="vid" ${photo(v.ph)} href="https://www.youtube.com/results?search_query=${encodeURIComponent(v.q)}" target="_blank" rel="noopener"><span class="playc"></span><div><b>${L(v.t)}</b><small>${L(v.s)}</small></div></a>`).join('')}</div>`;
CAPS.morichal = { es: 'Morichal', en: 'Moriche palm swamp' };
CAPS.llanero = { es: 'Joropo llanero', en: 'Llanero joropo' };

/* ---------- Render y navegación ---------- */
const VIEWS = ['home', 'status', 'canoas', 'cristales', 'route', 'budget', 'prep', 'near', 'weather', 'money', 'talk', 'sos', 'map', 'media'];
let current = 'home';
function render() {
  document.documentElement.lang = LANG;
  $$('[data-t]').forEach(el => { const k = el.dataset.t; if (T[k]) el.textContent = L(T[k]); });
  $('#lang-es').classList.toggle('on', LANG === 'es'); $('#lang-en').classList.toggle('on', LANG === 'en');
  $('#main').innerHTML = VIEWS.map(v => `<section class="view ${v === current ? 'on' : ''}" id="v-${v}">${V[v]()}</section>`).join('');
  $('#upd').textContent = VERIFIED + ' · ' + L({ es: 'hora Colombia', en: 'Colombia time' });
  setTalk(talkTab); renderAlert(); renderHolidays(); restoreChecks(); calcBudget(); renderCities();
  if (WX) paintWeather(); paintFX();
  tickClock(); buildTicker(); observeReveal(); paintPhotos();
  map = null; if (current === 'map') setTimeout(initMap, 50);
}
function go(v) {
  if (!VIEWS.includes(v)) v = 'home';
  current = v;
  $$('section.view').forEach(s => s.classList.toggle('on', s.id === 'v-' + v));
  $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  if (location.hash.slice(1) !== v) history.replaceState(null, '', v === 'home' ? location.pathname : '#' + v);
  window.scrollTo(0, 0);
  if (v === 'map') setTimeout(initMap, 60);
  observeReveal(); paintPhotos();
}
function setLang(l) { LANG = l; store.set('lang', l); render(); }
function observeReveal() {
  const els = $$('.view.on .reveal:not(.in)');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .08 });
  els.forEach(e => io.observe(e));
}

/* ---------- Hero en movimiento ---------- */
const HERO = ['cristales', 'canoas', 'macarenia', 'sierra', 'guayabero', 'hoatzin', 'pueblo'];
let heroI = 0, heroTimer = null;
function heroSetup() {
  const h = $('#hero'); if (!h) return;
  const ready = HERO.filter(k => PHOTO_CACHE[k]);
  if (!ready.length || h.dataset.n == ready.length) return;
  h.dataset.n = ready.length;
  $$('.slide', h).forEach(s => s.remove());
  ready.forEach((k, i) => { const s = document.createElement('div'); s.className = 'slide' + (i === 0 ? ' on' : ''); s.style.backgroundImage = `url("${PHOTO_CACHE[k]}")`; s.dataset.k = k; h.prepend(s); });
  $('#hero-dots').innerHTML = ready.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('');
  heroI = 0; heroCaption(ready[0]);
  clearInterval(heroTimer);
  if (ready.length > 1) heroTimer = setInterval(() => {
    const ss = $$('#hero .slide'); if (!ss.length) return;
    const order = ss.slice().reverse();
    order[heroI].classList.remove('on'); heroI = (heroI + 1) % order.length; order[heroI].classList.add('on');
    $$('#hero-dots i').forEach((d, i) => d.classList.toggle('on', i === heroI));
    heroCaption(order[heroI].dataset.k);
  }, 6000);
}
function heroCaption(k) { const c = $('#hero-cap'); if (c) c.textContent = (CAPS[k] ? L(CAPS[k]) + ' · ' : '') + L({ es: 'Foto: Wikimedia Commons', en: 'Photo: Wikimedia Commons' }); }

/* ---------- Temporada: cuenta regresiva ---------- */
function renderAlert() {
  const left = SEASON.end - Date.now();
  const html = seasonOpen() ? (() => {
    const d = Math.floor(left / 864e5), h = Math.floor(left / 36e5) % 24, m = Math.floor(left / 6e4) % 60;
    return `<div class="alert green" onclick="go('cristales')"><div><span class="kicker" style="background:#fff;color:#14653A">Caño Cristales</span><b>${L({ es: 'Temporada 2026 abierta hasta inicios de diciembre', en: '2026 season open until early December' })}</b><div class="small" style="opacity:.92;margin-top:4px">${L({ es: 'La vía legal para conocer la Macarena. La fecha exacta de cierre la fija Cormacarena; contamos hasta el 30 de noviembre. Toca para ver requisitos.', en: 'The legal way to see the Macarena. Cormacarena sets the exact closing date; we count to 30 November. Tap for requirements.' })}</div></div>
      <div class="count"><div><strong>${d}</strong><small>${L({ es: 'días', en: 'days' })}</small></div><div><strong>${h}</strong><small>${L({ es: 'horas', en: 'hours' })}</small></div><div><strong>${m}</strong><small>min</small></div></div></div>`;
  })() : `<div class="alert closed" onclick="go('cristales')"><div><span class="kicker">Caño Cristales</span><b>${L({ es: 'Temporada cerrada', en: 'Season closed' })}</b><div class="small" style="opacity:.9;margin-top:4px">${L({ es: 'Suele reabrir entre mayo y junio. Consulta la fecha en cormacarena.gov.co.', en: 'It usually reopens between May and June. Check the date at cormacarena.gov.co.' })}</div></div></div>`;
  ['#alert', '#alert2'].forEach(s => { const e = $(s); if (e) e.innerHTML = html; });
}

/* ---------- Relojes y franja "Hoy" ---------- */
function tzf(zone, o) { return new Intl.DateTimeFormat(LANG === 'es' ? 'es-CO' : 'en-GB', { timeZone: zone, ...o }).format(new Date()); }
function tickClock() {
  const co = $('#clk-co'); if (co) co.textContent = tzf(ZONE, { hour: '2-digit', minute: '2-digit', hour12: false });
  const s = $('#clk-sub'); if (s) s.textContent = tzf(ZONE, { weekday: 'long', day: 'numeric', month: 'long' });
}
const todayISO = () => new Intl.DateTimeFormat('en-CA', { timeZone: ZONE }).format(new Date());
function nextHoliday() { const iso = todayISO(); return HOLIDAYS.find(h => h[0] >= iso) || null; }
function dateLabel(iso) { const [y, m, d] = iso.split('-').map(Number); return new Intl.DateTimeFormat(LANG === 'es' ? 'es-CO' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(y, m - 1, d)); }
function daysTo(iso) { const now = new Date(todayISO() + 'T00:00:00Z'); return Math.round((new Date(iso + 'T00:00:00Z') - now) / 864e5); }
function rainToday() { return WX && WX.daily ? (WX.daily.precipitation_probability_max[0] ?? null) : null; }
function buildTicker() {
  const parts = [];
  parts.push(`<span><i class="dot"></i>${L({ es: 'Hoy', en: 'Today' })}: <b>${tzf(ZONE, { weekday: 'long', day: 'numeric', month: 'long' })}</b></span>`);
  parts.push(`<span>Caño Canoas: <b>${L({ es: 'no habilitado por Parques Nacionales', en: 'not authorized by National Parks' })}</b></span>`);
  if (seasonOpen()) parts.push(`<span>Caño Cristales: <b>${L({ es: 'abierto, quedan ~' + Math.ceil((SEASON.end - Date.now()) / 864e5) + ' días de temporada', en: 'open, ~' + Math.ceil((SEASON.end - Date.now()) / 864e5) + ' days of season left' })}</b></span>`);
  if (WX && WX.current) parts.push(`<span>${L({ es: 'La Macarena', en: 'La Macarena' })}: <b>${Math.round(WX.current.temperature_2m)} °C</b>, ${L(WCODE(WX.current.weather_code)).toLowerCase()}</span>`);
  const r = rainToday(); if (r != null) parts.push(`<span>${L({ es: 'Lluvia hoy', en: 'Rain today' })}: <b>${r}%</b>${r >= 60 ? L({ es: ' · ojo con los caños', en: ' · careful at the streams' }) : ''}</span>`);
  if (FX && FX.COP) parts.push(`<span>1 USD = <b>${cop(FX.COP)}</b></span>`);
  const nh = nextHoliday(); if (nh) parts.push(`<span>${L({ es: 'Próximo festivo', en: 'Next holiday' })}: <b>${L(nh[1])}</b> (${daysTo(nh[0]) === 0 ? L({ es: 'hoy', en: 'today' }) : L({ es: 'en ' + daysTo(nh[0]) + ' días', en: 'in ' + daysTo(nh[0]) + ' days' })})</span>`);
  parts.push(`<span>${L({ es: 'Emergencias', en: 'Emergencies' })}: <b>123</b></span>`);
  const t = $('#ticker'); if (t) t.innerHTML = parts.join('');
}

/* ---------- Clima en vivo (Open-Meteo) ---------- */
let WX = store.get('wx', null);
const WCODE = c => c === 0 ? { es: 'Despejado', en: 'Clear' } : c <= 3 ? { es: 'Parcialmente nublado', en: 'Partly cloudy' } : c <= 48 ? { es: 'Neblina', en: 'Fog' } : c <= 67 ? { es: 'Lluvia', en: 'Rain' } : c <= 82 ? { es: 'Chubascos', en: 'Showers' } : { es: 'Tormenta', en: 'Thunderstorm' };
async function loadWeather() {
  try {
    WX = await getJSON('https://api.open-meteo.com/v1/forecast?latitude=2.1808&longitude=-73.7864&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America%2FBogota&forecast_days=5');
    store.set('wx', WX); paintWeather(); buildTicker();
  } catch (e) { if (!WX) $$('#wx-now,#wx-now2').forEach(x => x.textContent = '--'); }
}
function paintWeather() {
  if (!WX || !WX.current) return;
  const c = WX.current, txt = Math.round(c.temperature_2m) + ' °C';
  const a = $('#wx-now'); if (a) a.textContent = txt;
  const s = $('#wx-sub'); if (s) s.textContent = L(WCODE(c.weather_code)) + ' · ' + L({ es: 'sensación ', en: 'feels ' }) + Math.round(c.apparent_temperature) + ' °C';
  const b = $('#wx-now2'); if (b) b.textContent = txt + ' · ' + L(WCODE(c.weather_code));
  const d = $('#wx-days'); if (d && WX.daily) d.innerHTML = WX.daily.time.map((t, i) => `<div>${new Intl.DateTimeFormat(LANG === 'es' ? 'es-CO' : 'en-GB', { weekday: 'short', timeZone: 'UTC' }).format(new Date(t + 'T12:00:00Z'))}<b>${Math.round(WX.daily.temperature_2m_max[i])}°</b>${Math.round(WX.daily.temperature_2m_min[i])}° · ${WX.daily.precipitation_probability_max[i] ?? 0}%</div>`).join('');
  const r = rainToday(), rs = $('#rain-strip');
  if (rs) rs.innerHTML = r != null ? `<div class="card ${r >= 60 ? 'dark' : ''} mt2" style="cursor:pointer" onclick="go('weather')"><div class="small" style="opacity:.75">${L({ es: 'Lluvia hoy en La Macarena', en: 'Rain today in La Macarena' })}</div><b style="font-family:'Barlow Condensed';font-size:1.45rem;text-transform:uppercase">${r}% ${r >= 60 ? L({ es: '· día para quedarse fuera del agua', en: '· a day to stay out of the water' }) : r >= 30 ? L({ es: '· atento al cielo', en: '· keep an eye on the sky' }) : L({ es: '· poca probabilidad', en: '· low chance' })}</b></div>` : '';
}

/* ---------- Cambio en vivo ---------- */
let FX = store.get('fx', null);
async function loadFX() {
  try {
    const j = await getJSON('https://open.er-api.com/v6/latest/USD');
    if (j && j.rates && j.rates.COP) { FX = { COP: j.rates.COP, EUR: j.rates.EUR, VES: j.rates.VES, t: j.time_last_update_utc }; store.set('fx', FX); }
  } catch (e) {}
  paintFX(); buildTicker();
}
function paintFX() {
  const ok = FX && FX.COP;
  ['#fx-usd', '#fx-usd2'].forEach(s => { const e = $(s); if (e) e.textContent = ok ? cop(FX.COP) : '--'; });
  const sub = ok ? L({ es: 'pesos colombianos · tasa del día', en: 'Colombian pesos · today\'s rate' }) : L({ es: 'Sin conexión: conecta para ver la tasa', en: 'Offline: connect to see the rate' });
  ['#fx-sub', '#fx-sub2'].forEach(s => { const e = $(s); if (e) e.textContent = sub; });
  const eu = $('#fx-eur'); if (eu) eu.textContent = ok && FX.EUR ? cop(FX.COP / FX.EUR) : '--';
  const vs = $('#fx-ves'); if (vs) vs.textContent = ok && FX.VES ? cop(100 * FX.COP / FX.VES) : '--';
  const fu = $('#fee-usd'); if (fu && ok) fu.textContent = L({ es: 'Ingreso 2026 · ≈ US$', en: '2026 entry · ≈ US$' }) + fmt(CRISTALES.fees[2][1] / FX.COP, 0);
  convert(); calcBudget();
}
function convert() {
  const o = $('#fx-out'); if (!o) return;
  const amt = parseFloat($('#fx-amt').value) || 0, from = $('#fx-from').value;
  const perUSD = { USD: 1, COP: FX && FX.COP, EUR: FX && FX.EUR, VES: FX && FX.VES };
  if (!perUSD[from] || !(FX && FX.COP)) { o.innerHTML = `<div class="note">${L({ es: 'Necesitas conexión una vez para traer la tasa del día. Después funciona sin internet.', en: 'You need a connection once to get today\'s rate. Then it works offline.' })}</div>`; return; }
  const usd = amt / perUSD[from];
  o.innerHTML = `<div class="status-list">${['COP', 'USD', 'EUR', 'VES'].filter(c => c !== from && perUSD[c]).map(c => `<div class="sl"><div><b>${c}</b></div><div style="font-family:'Barlow Condensed';font-size:1.5rem;font-weight:800">${fmt(usd * perUSD[c], c === 'COP' ? 0 : 2)}</div></div>`).join('')}</div>`;
}

/* ---------- Presupuesto ---------- */
function calcBudget() {
  const o = $('#b-out'); if (!o) return;
  const v = id => Math.max(0, parseFloat($(id).value) || 0);
  const p = Math.max(1, Math.round(v('#b-p'))), n = Math.round(v('#b-n')), t = parseInt($('#b-t').value, 10), x = parseFloat($('#b-x').value) || 0;
  const days = n + 1;
  const items = [
    [{ es: 'Transporte', en: 'Transport' }, v('#b-tr') * p],
    [{ es: 'Hospedaje', en: 'Lodging' }, v('#b-h') * n * p],
    [{ es: 'Comida', en: 'Food' }, v('#b-f') * days * p],
    [{ es: 'Entrada a Caño Cristales', en: 'Caño Cristales entry' }, t >= 0 ? CRISTALES.fees[t][1] * p : 0],
    [{ es: 'Guía y transporte interno', en: 'Guide & local transport' }, v('#b-g')],
    [{ es: 'Seguro', en: 'Insurance' }, v('#b-s') * p]
  ];
  const sub = items.reduce((a, i) => a + i[1], 0), extra = sub * x, total = sub + extra;
  const usd = FX && FX.COP ? ' · ≈ US$' + fmt(total / p / FX.COP, 0) : '';
  const row = (t, val, s = '') => `<div class="sl"><div><b>${t}</b>${s ? `<small>${s}</small>` : ''}</div><div style="font-family:'Barlow Condensed';font-size:1.4rem;font-weight:800">${cop(val)}</div></div>`;
  o.innerHTML = `<div class="status-list">${items.filter(i => i[1] > 0).map(i => row(L(i[0]), i[1])).join('')}
    ${extra ? row(L({ es: 'Imprevistos', en: 'Contingency' }) + ' (' + Math.round(x * 100) + '%)', extra) : ''}</div>
    <div class="live" style="margin-top:12px"><div class="lc dark"><div class="lab">${L({ es: 'Total del grupo', en: 'Group total' })}</div><div class="big" style="font-size:1.7rem">${cop(total)}</div><div class="sub">${p} ${L({ es: p === 1 ? 'persona' : 'personas', en: p === 1 ? 'person' : 'people' })} · ${days} ${L({ es: 'días', en: 'days' })}</div></div>
    <div class="lc sea"><div class="lab">${L({ es: 'Por persona', en: 'Per person' })}</div><div class="big" style="font-size:1.7rem">${cop(total / p)}</div><div class="sub">${L({ es: 'En efectivo', en: 'In cash' })}${usd}</div></div></div>`;
}

/* ---------- Festivos ---------- */
function renderHolidays() {
  const box = $('#hol-list'); if (!box) return;
  const iso = todayISO();
  box.innerHTML = HOLIDAYS.filter(h => h[0] >= iso).slice(0, 8).map(h => `<div class="sl"><div><b>${L(h[1])}</b><small style="text-transform:capitalize">${dateLabel(h[0])}</small></div><span class="pill">${daysTo(h[0]) === 0 ? L({ es: 'Hoy', en: 'Today' }) : L({ es: 'En ' + daysTo(h[0]) + ' d', en: 'In ' + daysTo(h[0]) + ' d' })}</span></div>`).join('');
  const nh = nextHoliday(), n = $('#next-hol');
  if (n && nh) n.textContent = L({ es: 'Próximo: ', en: 'Next: ' }) + L(nh[1]);
}

/* ---------- Lista para empacar ---------- */
function tick(i, v) { const s = store.get('chk', {}); s[i] = v; store.set('chk', s); restoreChecks(); }
function resetChecks() { store.set('chk', {}); restoreChecks(); toast(L({ es: 'Lista reiniciada', en: 'List reset' })); }
function restoreChecks() {
  const s = store.get('chk', {}); let n = 0;
  PREP.forEach((_, i) => { const el = $('#chk-' + i); if (!el) return; const on = !!s[i]; el.classList.toggle('done', on); $('input', el).checked = on; if (on) n++; });
  const bar = $('#chk-bar'); if (bar) bar.style.width = (n / PREP.length * 100) + '%';
  const t = $('#chk-txt'); if (t) t.textContent = L({ es: `${n} de ${PREP.length} listos`, en: `${n} of ${PREP.length} done` });
}

/* ---------- Mapa (Leaflet) ---------- */
let map = null, layers = {};
const CAT_COLOR = { base: '#EB0A1E', ok: '#14653A', route: '#0B0B0C' };
function initMap() {
  const el = $('#map'); if (!el || map || typeof window.L === 'undefined') return;
  const LF = window.L;
  map = LF.map(el, { zoomControl: true }).setView([2.9, -73.75], 7);
  LF.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { attribution: '© OpenStreetMap, © CARTO', subdomains: 'abcd', maxZoom: 19 }).addTo(map);
  layers = {};
  MAP_PTS.forEach(p => {
    const icon = LF.divIcon({ className: '', html: `<div class="mk" style="background:${CAT_COLOR[p.cat]}"></div>`, iconSize: [16, 16], iconAnchor: [8, 8] });
    const img = PHOTO_CACHE[p.id] ? `<div style="width:220px;height:110px;border-radius:8px;background:url('${PHOTO_CACHE[p.id]}') center/cover;margin-bottom:6px"></div>` : '';
    const m = LF.marker([p.lat, p.lon], { icon }).bindPopup(`${img}<b>${esc(L(p.n))}</b><br><span>${esc(L(p.d))}</span><br><a href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}" target="_blank" rel="noopener">${L({ es: 'Cómo llegar', en: 'Directions' })}</a>`, { maxWidth: 240 });
    m._cat = p.cat; m.addTo(map); layers[p.id] = m;
  });
  setTimeout(() => map.invalidateSize(), 200);
}
function mapFilter(c) {
  $$('#map-chips button').forEach(b => b.classList.toggle('on', b.dataset.c === c));
  if (!map) return;
  Object.values(layers).forEach(m => { const show = c === 'all' || m._cat === c; if (show && !map.hasLayer(m)) m.addTo(map); if (!show && map.hasLayer(m)) map.removeLayer(m); });
}
function locateMe() {
  if (!navigator.geolocation) { toast(L({ es: 'Tu celular no permite ubicación', en: 'Location not available' })); return; }
  navigator.geolocation.getCurrentPosition(p => {
    if (!map) return; const ll = [p.coords.latitude, p.coords.longitude];
    window.L.circleMarker(ll, { radius: 9, color: '#fff', weight: 3, fillColor: '#2D7FF9', fillOpacity: 1 }).addTo(map).bindPopup(L({ es: 'Estás aquí', en: 'You are here' })).openPopup();
    map.setView(ll, 10);
  }, () => toast(L({ es: 'No pude obtener tu ubicación', en: 'Could not get your location' })), { enableHighAccuracy: true, timeout: 10000 });
}

/* ---------- Otros destinos de la serie ---------- */
const SELF = 'cano-canoas';
const HUB = 'https://haroldco45.github.io/latinos-por-el-mundo/ciudades.json';
const CITY_FALLBACK = [
  { id: 'londres', es: 'Londres', en: 'London', pais: { es: 'Reino Unido', en: 'United Kingdom' }, url: 'https://haroldco45.github.io/londres-para-latinos/' },
  { id: 'madrid', es: 'Madrid', en: 'Madrid', pais: { es: 'España', en: 'Spain' }, url: 'https://haroldco45.github.io/madrid-para-latinos/' },
  { id: 'bilbao', es: 'Bilbao', en: 'Bilbao', pais: { es: 'España', en: 'Spain' }, url: 'https://haroldco45.github.io/bilbao-para-latinos/' },
  { id: 'medellin', es: 'Medellín', en: 'Medellín', pais: { es: 'Colombia', en: 'Colombia' }, url: 'https://haroldco45.github.io/medellin-para-latinos/' },
  { id: 'miami', es: 'Miami', en: 'Miami', pais: { es: 'Estados Unidos', en: 'United States' }, url: 'https://haroldco45.github.io/miami-para-latinos/' },
  { id: 'nueva-york', es: 'Nueva York', en: 'New York', pais: { es: 'Estados Unidos', en: 'United States' }, url: 'https://haroldco45.github.io/nueva-york-para-latinos/' },
  { id: 'toledo', es: 'Toledo', en: 'Toledo', pais: { es: 'España', en: 'Spain' }, url: 'https://haroldco45.github.io/toledo-para-latinos/' },
  { id: 'leamington', es: 'Leamington', en: 'Leamington', pais: { es: 'Canadá', en: 'Canada' }, url: 'https://haroldco45.github.io/leamington-para-latinos/' },
  { id: 'hamamatsu', es: 'Hamamatsu', en: 'Hamamatsu', pais: { es: 'Japón', en: 'Japan' }, url: 'https://haroldco45.github.io/hamamatsu-para-latinos/' },
  { id: 'oizumi', es: 'Oizumi', en: 'Oizumi', pais: { es: 'Japón', en: 'Japan' }, url: 'https://haroldco45.github.io/oizumi-para-latinos/' },
  { id: 'getxo', es: 'Getxo', en: 'Getxo', pais: { es: 'España', en: 'Spain' }, url: 'https://haroldco45.github.io/getxo-para-latinos/' },
  { id: 'willemstad', es: 'Willemstad', en: 'Willemstad', pais: { es: 'Curazao', en: 'Curaçao' }, url: 'https://haroldco45.github.io/willemstad-para-latinos/' },
  { id: 'cartagena', es: 'Cartagena', en: 'Cartagena', pais: { es: 'Colombia', en: 'Colombia' }, url: 'https://haroldco45.github.io/cartagena-para-latinos/' },
  { id: 'norcasia', es: 'Norcasia', en: 'Norcasia', pais: { es: 'Colombia', en: 'Colombia' }, url: 'https://haroldco45.github.io/norcasia-para-latinos/' },
  { id: 'cano-canoas', es: 'Caño Canoas', en: 'Caño Canoas', pais: { es: 'Colombia', en: 'Colombia' }, url: 'https://haroldco45.github.io/cano-canoas-para-latinos/' }
];
const CITY_WIKI = { londres: 'London', madrid: 'Madrid', bilbao: 'Bilbao', medellin: 'Medellín', miami: 'Miami', 'nueva-york': 'New York City', toledo: 'Toledo, Spain', leamington: 'Leamington, Ontario', hamamatsu: 'Hamamatsu', oizumi: 'Ōizumi, Gunma', getxo: 'Getxo', willemstad: 'Willemstad', cartagena: 'Cartagena, Colombia', norcasia: 'Norcasia', 'cano-canoas': 'Caño Cristales' };
let CITIES = store.get('cities', CITY_FALLBACK);
const CITY_PH = store.get('cityph', {});
function renderCities() {
  const box = $('#cx'); if (!box) return;
  box.innerHTML = CITIES.filter(c => c.id !== SELF).map(c => {
    const name = c[LANG] || c.es, pais = (c.pais && (c.pais[LANG] || c.pais.es)) || '';
    const bg = CITY_PH[c.id] ? `background-image:url('${CITY_PH[c.id]}');` : '';
    if (c.pronto) return `<div class="cxc soon" style="--fb:${fbColor(c.id)};${bg}"><b>${esc(name)}</b><small>${esc(pais)} · ${L({ es: 'Muy pronto', en: 'Coming soon' })}</small></div>`;
    return `<a class="cxc" style="--fb:${fbColor(c.id)};${bg}" href="${esc(c.url)}"><b>${esc(name)}</b><small>${esc(pais)}</small></a>`;
  }).join('');
}
async function loadCities() {
  try {
    const j = await getJSON(HUB + '?v=' + Date.now());
    if (j && j.ciudades && j.ciudades.length) {
      const ids = new Set(j.ciudades.map(c => c.id));
      CITIES = j.ciudades.concat(CITY_FALLBACK.filter(c => !ids.has(c.id))); store.set('cities', CITIES);
    }
  } catch (e) {}
  renderCities();
  const need = CITIES.filter(c => !CITY_PH[c.id]);
  if (need.length) {
    const titles = need.map(c => CITY_WIKI[c.id] || c.en || c.es);
    const got = await wikiBatch(titles);
    need.forEach((c, i) => { if (got[titles[i]]) CITY_PH[c.id] = got[titles[i]]; });
    store.set('cityph', CITY_PH); renderCities();
  }
}

/* ---------- PWA ---------- */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; setTimeout(() => $('#install').classList.add('on'), 4000); });
$('#install-btn').addEventListener('click', async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; $('#install').classList.remove('on'); });
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));

/* ---------- Arranque ---------- */
window.addEventListener('hashchange', () => go(location.hash.slice(1) || 'home'));
current = VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home';
render();
$$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.v === current));
setTimeout(() => $('#splash').classList.add('off'), 900);
loadWeather(); loadFX(); loadCities();
loadPhotos().then(() => { paintPhotos(); if (map) { map.remove(); map = null; if (current === 'map') initMap(); } });
setInterval(() => { tickClock(); renderAlert(); }, 30000);
setInterval(buildTicker, 300000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) { tickClock(); renderAlert(); buildTicker(); loadWeather(); loadFX(); } });
