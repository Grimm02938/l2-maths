Installation

Depuis la racine du projet :

cd ~/Projet/l2-maths-redesign
unzip -o ~/Téléchargements/site-style-pro-minimal-l2.zip -d tmp-pro-style
cp tmp-pro-style/l2-slug-pro-minimal.astro 'src/pages/l2/[slug].astro'
npm run dev -- --host 127.0.0.1 --port 5177 --strictPort

Puis ouvre :
http://127.0.0.1:5177/l2/analyse-s1/

Design :
- aucune mention Officiel / Drive visible ;
- pas d'icônes ;
- pas de cartes empilées ;
- structure professionnelle en sections + lignes ;
- style académique minimal.
