# Réseaux sociaux @celian.coaching

Dépôt de travail Instagram de Célian, coach sportif à domicile à Lyon.

- Skills Instagram : `.claude/skills/ig-*`. Skill `find-skills` (vercel-labs/skills) pour chercher
  d'autres skills. Skill `short-editing` (melvynx/video-agent-skills, commit f4542923, audité le
  2026-11-25) pour le montage des reels : ne jamais lancer `preview` (serveur local qui peut servir
  n'importe quel fichier) et ne jamais lui fournir de clé API (ElevenLabs, OpenAI, Gemini), pour que
  tout reste en local. Profil de voix : `.claude/instagram/voice.md`
  (le copier dans `~/.claude/instagram/voice.md` en début de session, avec `log.md`).
- Scripts validés : `.claude/instagram/reels/`. Historique : `.claude/instagram/log.md`.
- Suivi tournage / publication : `.claude/instagram/suivi.md`.

## Façon de travailler avec Célian

- Tout se passe dans le chat : quand il demande un script (« envoie 13 »), l'afficher
  directement dans la réponse. Pas de page web. Format validé par Célian :
  1. un tableau Temps | Ce que tu dis | Carton à l'écran | Plan ;
  2. le texte seul dans un bloc, à relire avant de filmer ;
  3. la légende dans un bloc à copier (si elle existe, sinon proposer /ig-caption) ;
  4. trois rappels avant de tourner (vertical + zones libres, sous-titres, accord
     des personnes filmées), puis « Dis-moi quand il est tourné ».
- Quand il dit qu'un reel est tourné ou posté, mettre à jour `suivi.md`
  (statut + date du jour), puis commit et push.
- Toujours le tutoyer, en français.
