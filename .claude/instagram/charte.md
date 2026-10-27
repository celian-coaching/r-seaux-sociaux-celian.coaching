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
