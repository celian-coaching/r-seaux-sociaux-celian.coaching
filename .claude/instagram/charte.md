# Charte graphique @celian.coaching

Couleurs choisies par Célian (2026-10-26). N'utiliser que celles-ci.

| Rôle | Couleur | Code |
|---|---|---|
| Jaune citron | accent principal, couvertures | `#e0ff20` |
| Vert menthe | récap, numéros, illustrations | `#00dba0` |
| Orange | chiffres, appel à l'action | `#e46d29` |

Neutres : texte et fonds sombres `#141414`, texte clair `#f4f4f0`.

Polices : titres en Oswald (condensée, majuscules), texte en Inter.

Règles de lisibilité : texte noir sur les trois couleurs ; sur fond sombre, les
titres en jaune citron. Pas d'orange sur jaune ni sur vert (trop peu de contraste).

## Style des carrousels (validé le 2026-10-26)

Inspiration : les infographies de @supertrainers, avec nos couleurs (exemples dans `inspirations/`).

- Fond papier clair `#f6f4ec`, bande de papier déchiré en haut (menthe ou citron).
- Titre en Oswald noir, un mot dans un encadré de couleur légèrement penché.
- Personnage dessiné à plat, membres effilés et silhouette de profil (t-shirt menthe,
  legging foncé, baskets orange à semelle blanche avec lacets, visage de profil
  avec nez et menton, queue de cheval),
  annotations manuscrites (police Caveat) avec des flèches vers le geste.
- Le dessin et les annotations sont générés par `carrousels/01-4-mouvements/slides.html`
  (fonctions `personne()`, `tronc()`, `chaussure()`, `tete()` ; chaque pose se
  décrit par le bassin, l'angle du buste et la place des mains et des chevilles,
  `squelette()` garde les mêmes longueurs de membres partout) : réutiliser ce fichier comme base.

## Personnages (2026-10-27)

Bibliothèque commune : `carrousels/personnages.js`, planche : `carrousels/personnages/planche.png`.

- 6 personnages : `femme`, `homme`, `grandmere`, `grandpere`, `garcon`, `fille`.
- 3 peaux : `claire` (beige clair), `mate` (marron clair), `foncee` (noir clair).
- Hauts : menthe ou citron selon le personnage (modifiable avec `haut`), legging
  foncé et baskets orange pour tous.
- Dans une page de slides : `<script src="../personnages.js"></script>` puis
  `svg.innerHTML = Perso.dessiner('squat', { type: 'homme', peau: 'mate' })`.
- Poses prêtes : `debout`, `squat`, `mur`, `gainage`, `birddog` (`Perso.POSES`).
  Une nouvelle pose = bassin, angle du buste, place des mains et des chevilles.
- Varier les personnages d'un carrousel à l'autre pour que chacun s'y retrouve.

## Corps anatomique (2026-10-27)

Mannequin lisse, de face ou de dos, pour montrer les muscles travaillés
(inspiré des infographies @supertrainers). Planche : `carrousels/personnages/anatomie.png`.

- Toujours en peau beige clair (choix de Célian).
- `Perso.anatomie({ type: 'homme' | 'femme', vue: 'face' | 'dos', muscles: { quadriceps: 1, fessiers: 1, ischios: .5 } })`,
  dessin dans un repère `0 0 200 440`.
- Muscles en orange de la charte : 1 = muscle principal, .5 = muscle qui aide.
  Les autres restent en contour léger.
- Face : deltoides, pectoraux, biceps, avantbras, abdominaux, obliques, quadriceps,
  adducteurs, mollets, tibial. Dos : trapezes, deltoides, triceps, dorsaux, avantbras,
  lombaires, fessiers, ischios, mollets.

## Logo sur chaque visuel (2026-10-27)

Fichiers et règles de couleur : `logo/README.md` (logo validé : piste 4, l'haltère C + D).

- Toujours le logo sur ce qui sort : carrousels, cartons de reels, stories, affiches.
- Couleurs gardées par Célian (2026-10-27) : **logo citron sur fond menthe** et **logo
  citron sur fond orange**. Sur tout autre fond (papier clair, citron, noir, photo), le logo
  citron va dans un rond menthe ou orange : `logo/pastille-citron-sur-menthe.png` ou
  `logo/pastille-citron-sur-orange.png` (fond transparent).
- Logo orange aussi possible (`logo/logo-orange-recadre.png`) : posé directement sur fond
  citron, menthe ou noir, ou sur fond clair en grand (choix de Célian, malgré le contraste
  faible sur citron et menthe : réservé au logo, jamais au texte). Sinon dans un rond noir ou clair :
  `logo/pastille-orange-sur-noir.png`, `logo/pastille-orange-sur-clair.png`.
- Carrousels : pastille menthe de 66 px à gauche de `@celian.coaching`, en bas à gauche des
  slides sur papier ; sur une slide orange ou menthe, `logo/logo-citron-recadre.png` posé
  directement (voir `.handle` dans `carrousels/01-4-mouvements/slides.html`).
