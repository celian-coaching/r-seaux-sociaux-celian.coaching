# Story de présentation (charte CD Coaching)

- `story-presentation-charte.mp4` : 1080x1920, 19,7 s, 30 i/s, sans son.
- `source/` : la page animée qui sert à générer la vidéo.

Pour la régénérer : servir `source/` en local (`python3 -m http.server 8765`,
le navigateur bloque les masques en `file://`), puis
`node render.js <dossier_images>` et assembler avec
`ffmpeg -framerate 30 -i <dossier>/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 out.mp4`.

## Musique

Musique originale composée par programme (`source/musique/compose.py`), donc
sans droits d'auteur. `python3 compose.py full.wav`, couper les 0,33 premières
secondes pour que le rythme démarre au 2e écran, puis normaliser à -14 LUFS
au moment de l'assembler avec la vidéo.
