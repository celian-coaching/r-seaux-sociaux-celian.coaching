// Personnages des carrousels @celian.coaching
//
// 6 personnages (femme, homme, grandmere, grandpere, garcon, fille)
// × 3 peaux (claire = beige clair, mate = marron clair, foncee = noir clair).
//
// Utilisation dans une page de slides :
//   <script src="../personnages.js"></script>
//   svg.innerHTML = Perso.dessiner('squat', { type: 'homme', peau: 'mate' });
//   Perso.cadrer(svg, 10);   // recadre le svg sur le dessin
//
// Une pose se décrit dans le repère d'un adulte (sol à y = 398) : le bassin,
// l'angle du buste, et où vont mains et chevilles ; coudes et genoux se placent
// tout seuls (voir Perso.POSES). Les enfants sont le même squelette réduit
// autour du point `sol` de la pose : pour un geste contre un mur ou une chaise,
// redonner des cibles à leur taille.
(function () {

const PEAUX = {
  claire: { peau: '#f2c29b', peauO: '#d9a079', joue: '#ef9a84', joueOp: .35, bouche: '#b5634a', cheveux: '#4a3426', meche: '#5e4433' },
  mate:   { peau: '#c68b59', peauO: '#a6703f', joue: '#d77656', joueOp: .3,  bouche: '#874630', cheveux: '#2e2119', meche: '#46342a' },
  foncee: { peau: '#8d5b3c', peauO: '#6f442b', joue: '#b4573f', joueOp: .3,  bouche: '#552a1a', cheveux: '#1c1714', meche: '#3a302a' },
};
const GRIS = { cheveux: '#cfcbc3', meche: '#a9a49a' };
const HAUTS = {
  menthe: { haut: '#00dba0', hautO: '#00b083' },
  citron: { haut: '#e0ff20', hautO: '#b9d60c' },
};
const TENUE = { bas: '#2d2f3e', basO: '#1d1f2a', chaussure: '#e46d29', chaussureO: '#bf561c' };

// taille : échelle du corps ; tete : échelle de la tête avant `taille`
// carrure : largeur des épaules et des membres ; poitrine : 0 (plat) à 1
const TYPES = {
  femme:     { nom: 'Femme',       taille: 1,   tete: 1,   carrure: 1,    poitrine: 1,   coiffure: 'queue',    haut: 'menthe', cil: true },
  homme:     { nom: 'Homme',       taille: 1.04, tete: 1,  carrure: 1.12, poitrine: .25, coiffure: 'court',    haut: 'citron' },
  grandmere: { nom: 'Grand-mère',  taille: .97, tete: 1,   carrure: 1.05, poitrine: .9,  coiffure: 'chignon',  haut: 'menthe', cil: true, gris: true, lunettes: true, rides: true },
  grandpere: { nom: 'Grand-père',  taille: 1.01, tete: 1,  carrure: 1.1,  poitrine: .2,  coiffure: 'degarni',  haut: 'citron', gris: true, lunettes: true, rides: true, moustache: true },
  garcon:    { nom: 'Garçon',      taille: .66, tete: 1.32, carrure: .94, poitrine: 0,   coiffure: 'epis',     haut: 'citron' },
  fille:     { nom: 'Fille',       taille: .66, tete: 1.32, carrure: .94, poitrine: 0,   coiffure: 'couettes', haut: 'menthe', cil: true },
};

function couleurs(o) {
  const t = TYPES[o.type || 'femme'], p = PEAUX[o.peau || 'claire'];
  return Object.assign({}, TENUE, p, t.gris ? GRIS : {}, HAUTS[o.haut || t.haut], { t });
}

const r1 = n => Math.round(n * 10) / 10;
function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
function add(a, v, k = 1) { return [a[0] + v[0] * k, a[1] + v[1] * k]; }
function unit(a, b) { const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / d, (b[1] - a[1]) / d]; }

// membre effilé : deux cercles (rayons ra, rb) reliés par leurs tangentes
function cap(a, b, ra, rb, col) {
  const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  const th = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const al = Math.acos(Math.max(-1, Math.min(1, (ra - rb) / d)));
  const pt = (c, r, ang) => `${r1(c[0] + r * Math.cos(ang))} ${r1(c[1] + r * Math.sin(ang))}`;
  return `<path d="M${pt(a, ra, th + al)} L${pt(b, rb, th + al)} A${rb} ${rb} 0 ${2 * al > Math.PI ? 1 : 0} 0 ${pt(b, rb, th - al)}`
       + ` L${pt(a, ra, th - al)} A${ra} ${ra} 0 ${2 * al > Math.PI ? 0 : 1} 0 ${pt(a, ra, th + al)} Z" fill="${col}"/>`;
}
// contour fermé lissé (Catmull-Rom)
function lisse(pts, col) {
  const n = pts.length, P = i => pts[(i + n) % n];
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    d += ` C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return `<path d="${d} Z" fill="${col}"/>`;
}

// basket de profil, tracée cheville à l'origine, pointe vers +x, semelle vers +y
function chaussure(C, cheville, pied, dir, ombre) {
  const u = unit(cheville, pied), s = dir === 1 ? [-u[1], u[0]] : [u[1], -u[0]];
  const tige = ombre ? C.chaussureO : C.chaussure, semelle = ombre ? '#d6d0c2' : '#fff';
  return `<g transform="matrix(${r1(u[0] * 1000) / 1000} ${r1(u[1] * 1000) / 1000} ${r1(s[0] * 1000) / 1000} ${r1(s[1] * 1000) / 1000} ${r1(cheville[0])} ${r1(cheville[1])})">`
       + `<path d="M-15 10 L-17 -6 C-17 -16 -12 -20 -5 -20 L2 -19 C5 -13 10 -10 18 -9 C30 -7 40 -3 42 4 L42 10 Z" fill="${tige}"/>`
       + `<path d="M-19 9 L40 9 C46 9 48 12 46 15 C44 18 40 18 36 18 L-14 18 C-19 18 -21 13 -19 9 Z" fill="${semelle}"/>`
       + `<path d="M-19 15 L45 15" stroke="${ombre ? '#b9b2a2' : '#d9d4c8'}" stroke-width="2"/>`
       + `<path d="M-6 4 C4 1 14 0 27 3" stroke="${semelle}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
       + [[6, -14], [12, -11.5], [18, -10]].map(([x, y]) => `<path d="M${x - 2} ${y - 3} l4 6" stroke="${semelle}" stroke-width="2.4" stroke-linecap="round"/>`).join('')
       + `<path d="M-17 -8 C-17 -16 -12 -20 -6 -20" stroke="${ombre ? '#8f3e12' : '#9e4515'}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
}
function jambe(C, l, dir, ombre) {
  const bas = ombre ? C.basO : C.bas;
  return cap(l.genou, l.cheville, 15, 9, bas) + chaussure(C, l.cheville, l.pied, dir, ombre)
       + cap(l.hanche, l.genou, 24, 15, bas);
}
function bras(C, a, ombre) {
  const peau = ombre ? C.peauO : C.peau, u = unit(a.coude, a.main), k = C.t.carrure;
  return cap(a.coude, a.main, 9.5 * k, 7 * k, peau) + cap(a.main, add(a.main, u, 9), 9, 8.5, peau)
       + cap(a.epaule, a.coude, 13 * k, 9.5 * k, peau)
       + cap(a.epaule, lerp(a.epaule, a.coude, .42), 17 * k, 14.5 * k, ombre ? C.hautO : C.haut);
}
// buste vu de profil : dos d'un côté, poitrine du côté du regard
function tronc(C, h, e, dir) {
  const u = unit(h, e), L = Math.hypot(e[0] - h[0], e[1] - h[1]), k = C.t.carrure;
  const nf = [-u[1] * dir, u[0] * dir], nb = [-nf[0], -nf[1]];
  const at = (t, n, w) => add(add(h, u, L * t), n, w);
  const haut = [at(.18, nb, 26), at(.5, nb, 23), at(.88, nb, 25 * k), at(1.1, nb, 10), at(1.12, nf, 6),
                at(.92, nf, 23 * k), at(.72, nf, 22 * k + 6 * C.t.poitrine), at(.48, nf, 22), at(.18, nf, 25), at(.14, nb, 0)];
  const bassin = [at(0, nb, 26), at(.3, nb, 24), at(.3, nf, 23), at(0, nf, 25), at(-.14, nb, 4)];
  return lisse(bassin, C.bas) + lisse(haut, C.haut)
       + cap(at(.16, nb, 23), at(.16, nf, 22), 3, 3, C.hautO);
}

// cheveux : ce qui passe derrière le visage, puis ce qui passe devant
const COIFFURES = {
  queue: {
    derriere: C => `<path d="M-12 -18 C-30 -26 -48 -14 -46 8 C-44 20 -38 26 -32 30 C-36 18 -34 4 -20 -4 Z" fill="${C.cheveux}"/>`
      + `<path d="M-12 -18 C-24 -18 -30 -10 -34 0" stroke="${C.meche}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      + `<rect x="-20" y="-20" width="9" height="13" rx="4" transform="rotate(-30 -15 -13)" fill="${C.haut}"/>`,
    devant: C => `<path d="M-21 6 C-27 -24 -2 -34 16 -24 C22 -21 25 -15 24 -10 C16 -15 8 -15 2 -11 C-4 -7 -8 -2 -10 4 C-13 4 -17 4 -21 6 Z" fill="${C.cheveux}"/>`
      + `<path d="M2 -11 C8 -15 16 -15 24 -10" stroke="${C.meche}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  },
  court: {
    derriere: () => '',
    devant: C => `<path d="M-21 9 C-26 -20 -4 -32 14 -27 C21 -25 25 -19 24 -13 C16 -17 9 -16 3 -14 C0 -9 -4 -5 -6 0 L-8 7 C-12 8 -17 9 -21 9 Z" fill="${C.cheveux}"/>`
      + `<path d="M-5 -2 L-4 7" stroke="${C.cheveux}" stroke-width="5" stroke-linecap="round"/>`
      + `<path d="M-2 -22 C6 -25 14 -24 20 -20" stroke="${C.meche}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  },
  chignon: {
    derriere: C => `<circle cx="-20" cy="-22" r="13" fill="${C.cheveux}"/>`
      + `<path d="M-30 -24 C-26 -32 -16 -34 -10 -28" stroke="${C.meche}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
    devant: C => `<path d="M-21 7 C-27 -22 -4 -33 14 -26 C21 -23 25 -16 24 -11 C17 -16 9 -16 3 -12 C-2 -8 -6 -3 -8 4 C-12 5 -17 6 -21 7 Z" fill="${C.cheveux}"/>`
      + `<path d="M0 -14 C6 -19 14 -19 22 -14" stroke="${C.meche}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  },
  degarni: {
    derriere: () => '',
    devant: C => `<path d="M-20 9 C-24 -2 -22 -12 -14 -18 C-12 -12 -10 -6 -8 0 L-7 6 C-11 8 -16 9 -20 9 Z" fill="${C.cheveux}"/>`
      + `<path d="M-6 -3 L-5 6" stroke="${C.cheveux}" stroke-width="4.5" stroke-linecap="round"/>`
      + `<path d="M-2 -22 C6 -24 14 -22 19 -18" stroke="${C.peauO}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>`,
  },
  epis: {
    derriere: () => '',
    devant: C => `<path d="M-21 9 C-26 -20 -4 -32 14 -27 C21 -25 25 -19 24 -13 C16 -17 9 -16 3 -14 C0 -9 -4 -5 -6 0 L-8 7 C-12 8 -17 9 -21 9 Z" fill="${C.cheveux}"/>`
      + `<path d="M4 -27 C14 -33 27 -27 27 -15 C23 -19 18 -19 13 -17 C12 -21 8 -24 4 -27 Z" fill="${C.cheveux}"/>`
      + `<path d="M-5 -2 L-4 6" stroke="${C.cheveux}" stroke-width="5" stroke-linecap="round"/>`
      + `<path d="M-4 -23 C4 -26 12 -25 18 -21" stroke="${C.meche}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  },
  couettes: {
    derriere: C => `<path d="M-16 -4 C-30 -6 -40 6 -38 24 C-34 16 -28 10 -18 8 Z" fill="${C.cheveux}"/>`
      + `<rect x="-22" y="-8" width="8" height="12" rx="4" transform="rotate(-20 -18 -2)" fill="${C.haut}"/>`,
    devant: C => `<path d="M-21 7 C-27 -22 -2 -33 16 -24 C23 -20 26 -13 24 -5 C21 -11 17 -13 12 -13 C8 -12 6 -9 4 -10 C0 -6 -6 -1 -8 5 C-12 5 -17 6 -21 7 Z" fill="${C.cheveux}"/>`
      + `<path d="M2 -12 C8 -16 16 -16 22 -11" stroke="${C.meche}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  },
};

// tête de profil (nez, lèvres, menton), regard vers la droite puis retournée selon dir
function tete(C, t, dir, angle = 0) {
  const T = C.t, coif = COIFFURES[T.coiffure];
  return `<g transform="translate(${r1(t[0])} ${r1(t[1])}) scale(${dir * T.tete} ${T.tete}) rotate(${r1(angle)})">`
       + coif.derriere(C)
       + `<path d="M-19 -4 C-19 -20 -7 -25 5 -25 C16 -25 22 -17 22 -7 L22 -4 C24 -1 27 2 27 4.5 C27 6.5 25 7.5 22.5 7.5`
       + ` C22.5 9.5 23 11 22 12.5 C22.5 14 22 16 20 17 C19 21 16 23.5 11 24 C4 24.5 -4 23 -9 19 C-15 14 -19 6 -19 -4 Z" fill="${C.peau}"/>`
       + coif.devant(C)
       + `<path d="M-9 0 C-14 -2 -15 8 -11 11 C-8 12 -7 9 -7 6" fill="${C.peauO}"/>`
       + `<path d="M9 -7.5 Q13.5 -10 18 -8" stroke="${C.cheveux}" stroke-width="${T.gris ? 2.6 : 2}" fill="none" stroke-linecap="round"/>`
       + `<ellipse cx="14" cy="1" rx="2.6" ry="3.2" fill="#141414"/>`
       + (T.cil ? `<path d="M15.5 -2 l3 -2" stroke="#141414" stroke-width="1.8" stroke-linecap="round"/>` : '')
       + (T.rides ? `<path d="M7 -1 l-3 -1.5 M7 3 l-3 1.5 M14 19 q-3 2 -6 1" stroke="${C.peauO}" stroke-width="1.6" fill="none" stroke-linecap="round"/>` : '')
       + `<ellipse cx="9" cy="10" rx="5" ry="3.5" fill="${C.joue}" opacity="${C.joueOp}"/>`
       + (T.moustache ? `<path d="M14 10 C17 8.5 22 9 25 11 C23 13.5 18 13.5 14 12 Z" fill="${C.cheveux}"/>` : '')
       + `<path d="M15.5 14.5 Q18.5 16.5 21.5 14.5" stroke="${C.bouche}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
       + (T.lunettes ? `<circle cx="14" cy="1" r="8" fill="#fff" fill-opacity=".2" stroke="#141414" stroke-width="1.7"/>`
                     + `<path d="M6 0 L-8 -1.5" stroke="#141414" stroke-width="1.6" stroke-linecap="round"/>` : '')
       + `</g>`;
}

// squelette aux proportions fixes : on donne le bassin, l'angle du buste,
// et où vont mains et chevilles ; coudes et genoux se placent tout seuls.
const L = { tronc: 130, cou: 44, bras: 64, avantBras: 56, cuisse: 106, tibia: 95, pied: 36 };
const vec = (deg, l) => [Math.cos(deg * Math.PI / 180) * l, Math.sin(deg * Math.PI / 180) * l];
function ik(a, cible, l1, l2, pli) {
  const d = Math.min(Math.hypot(cible[0] - a[0], cible[1] - a[1]), l1 + l2 - .5);
  const th = Math.atan2(cible[1] - a[1], cible[0] - a[0]);
  const al = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)) * pli;
  const mid = [a[0] + l1 * Math.cos(th + al), a[1] + l1 * Math.sin(th + al)];
  return [mid, add(mid, unit(mid, cible), l2)];
}
function squelette(s) {
  const h = s.hanche, e = add(h, vec(s.tronc, L.tronc));
  const spine = s.tronc, aligne = s.dir === 1 ? spine + 90 : 270 - spine;
  const jambe = (j, hh) => { const [g, c] = ik(hh, j.cheville, L.cuisse, L.tibia, j.pli);
    return { hanche: hh, genou: g, cheville: c, pied: add(c, vec(j.pied, L.pied)) }; };
  const bras = (b, ee) => { const [c, m] = ik(ee, b.main, L.bras, L.avantBras, b.pli);
    return { epaule: ee, coude: c, main: m }; };
  const loin = [-6 * s.dir, -3];
  return {
    dir: s.dir, hanche: h, epaule: e,
    tete: add(e, vec(spine + (s.nuque || 0) * s.dir, L.cou)), angle: aligne * .55 + (s.regard || 0),
    jambe: jambe(s.jambe, h), jambeLoin: jambe(s.jambeLoin, add(h, loin)),
    bras: bras(s.bras, add(e, [0, 4])), brasLoin: bras(s.brasLoin, add(e, loin)),
  };
}

const POSES = {
  debout: {
    dir: 1, hanche: [300, 182], tronc: -90, regard: 0, sol: [300, 398],
    jambe: { cheville: [304, 460], pied: 0, pli: 1 },
    jambeLoin: { cheville: [290, 460], pied: 0, pli: 1 },
    bras: { main: [312, 400], pli: -1 },
    brasLoin: { main: [290, 400], pli: -1 },
  },
  squat: {
    dir: -1, hanche: [344, 262], tronc: 252, regard: 4, sol: [245, 398],
    jambe: { cheville: [238, 382], pied: 182, pli: 1 },
    jambeLoin: { cheville: [252, 380], pied: 182, pli: 1 },
    bras: { main: [168, 160], pli: -1 },
    brasLoin: { main: [178, 150], pli: -1 },
  },
  mur: {
    dir: 1, hanche: [314, 256], tronc: -40, regard: 6, sol: [155, 398],
    jambe: { cheville: [160, 386], pied: 0, pli: 1 },
    jambeLoin: { cheville: [150, 388], pied: 0, pli: 1 },
    bras: { main: [484, 174], pli: 1 },
    brasLoin: { main: [484, 162], pli: 1 },
  },
  gainage: {
    dir: 1, hanche: [288, 338], tronc: -8, regard: 4, sol: [300, 398],
    jambe: { cheville: [30, 374], pied: 112, pli: 1 },
    jambeLoin: { cheville: [24, 370], pied: 112, pli: 1 },
    bras: { main: [480, 388], pli: 1 },
    brasLoin: { main: [468, 384], pli: 1 },
  },
  birddog: {
    dir: 1, hanche: [272, 277], tronc: -5, regard: 10, nuque: 6, sol: [300, 398],
    jambe: { cheville: [60, 266], pied: 92, pli: 1 },
    jambeLoin: { cheville: [174, 368], pied: 125, pli: -1 },
    bras: { main: [404, 420], pli: 1 },
    brasLoin: { main: [560, 246], pli: 1 },
  },
};

// pose : nom dans POSES ou objet de même forme ; options : { type, peau, haut }
function dessiner(pose, options = {}) {
  const s = typeof pose === 'string' ? POSES[pose] : pose;
  const C = couleurs(options), p = squelette(s), k = C.t.taille;
  const cou = lerp(p.epaule, p.tete, .55);
  const corps = jambe(C, p.jambeLoin, p.dir, true) + bras(C, p.brasLoin, true)
       + cap(lerp(p.hanche, p.epaule, .9), cou, 10, 9, C.peauO)
       + tronc(C, p.hanche, p.epaule, p.dir)
       + jambe(C, p.jambe, p.dir, false) + tete(C, p.tete, p.dir, p.angle) + bras(C, p.bras, false);
  if (k === 1) return corps;
  const [x, y] = s.sol || [p.hanche[0], 398];
  return `<g transform="translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${corps}</g>`;
}
// recadre un <svg> au plus juste autour de ce qu'il contient
function cadrer(svg, marge = 8) {
  const b = svg.getBBox();
  svg.setAttribute('viewBox', `${b.x - marge} ${b.y - marge} ${b.width + 2 * marge} ${b.height + 2 * marge}`);
}

window.Perso = { dessiner, cadrer, squelette, POSES, TYPES, PEAUX, HAUTS };
})();
