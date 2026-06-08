Installation

cd ~/Projet/l2-maths-redesign
unzip -o ~/Téléchargements/site-style-pro-wide-l2.zip -d tmp-pro-wide
cp tmp-pro-wide/l2-slug-pro-wide.astro 'src/pages/l2/[slug].astro'
npm run dev -- --host 127.0.0.1 --port 5177 --strictPort

Puis recharge /l2/analyse-s1/

Cette version corrige :
- page trop centrée ;
- trop de rectangles ;
- labels Officiel/Drive supprimés ;
- affichage en lignes sobres sur 3 colonnes.
