# Roadmap vacances

Objectif : transformer L2 Maths Archive en outil de travail pour consolider la L2 et preparer la suite.

## Priorite 1 - Une matiere vraiment utile

Choisir une matiere pilote, puis produire un format reproductible :

- cours range proprement ;
- TD references ;
- corrections personnelles ;
- fiches complementaires ;
- annales si disponibles.

La topologie est un bon candidat, parce que les fichiers sont deja partiellement presents.

## Priorite 2 - Format standard d'un chapitre

Chaque chapitre doit pouvoir contenir :

- `cours` : support principal ;
- `td` : feuille d'exercices ;
- `corrige-perso` : correction redigee par toi ;
- `annale` : sujet de controle, partiel ou examen ;
- `complement` : fiche de methode, rappel, exemple detaille.

Les ressources recuperees depuis eCampus peuvent etre marquees `private` dans `src/lib/themes.ts` pour eviter de les publier sans verification.

## Priorite 3 - Prototype eCampus prive

Ne pas commencer par un scraper complet. Faire d'abord un prototype sur une seule matiere :

1. connexion manuelle ou Playwright ;
2. recuperation d'une page de cours ;
3. extraction des liens PDF ;
4. telechargement local dans `imports/ecampus/` ;
5. tri manuel avant publication.

## Definition d'un bon premier jalon

Un seul chapitre termine vaut mieux qu'une archive vide mais ambitieuse.

Premier jalon conseille :

- Topologie TD 1 ;
- poly lie ;
- TD lie ;
- correction personnelle ajoutee ;
- petite fiche complementaire si necessaire.
