Installation :

cd ~/Projet/l2-maths-redesign
mkdir -p tmp-fix-aliases
unzip -o ~/Téléchargements/fix-matiere-aliases.zip -d tmp-fix-aliases
node tmp-fix-aliases/fix-matiere-aliases.mjs

Puis relancer :
npm run dev -- --host 127.0.0.1 --port 5179 --strictPort
