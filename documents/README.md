# Guide pour l'ajout de documents

Ce guide explique comment ajouter de nouveaux documents (cours, TD, corrections) au projet.

## Principe

Le site distingue maintenant les ressources par type et par visibilite.

Types utiles :

- `cours` : poly, notes de cours, supports publics autorises
- `td` : feuilles de TD
- `corrige-perso` : corrections redigees par toi
- `annale` : sujets d'examens, partiels, controles
- `complement` : fiche, rappel, note de methode, document supplementaire

Visibilites :

- `public` : ressource affichable sur le site
- `private` : ressource utile en local ou importee depuis eCampus, a ne pas republier automatiquement

Sources possibles :

- `site` : document deja integre au projet
- `ecampus` : document recupere depuis eCampus pour usage personnel
- `personnel` : document redige par toi

## Structure des dossiers

Les documents sont organisés par matière, puis par chapitre. La structure est la suivante :

```
public/documents/{id_matiere}/{id_chapitre}/{type_document}.pdf
```

- `{id_matiere}` : L'identifiant de la matière (par exemple, `analysis`, `algebra`, `topology`).
- `{id_chapitre}` : L'identifiant du chapitre (par exemple, `a1`, `e1`, `t1`).
- `{type_document}` : Le type de document, qui peut être :
    - `cours`
    - `td`
    - `correction-td`
    - `ds`
    - `correction-ds`

## Exemple pour la topologie S2

Pour la topologie du second semestre, les fichiers attendus sont rangés ici :

- `public/documents/topologie/s2/poly-girand.pdf`
- `public/documents/topologie/s2/td1.pdf`
- `public/documents/topologie/s2/td2.pdf`
- `public/documents/topologie/s2/td3.pdf`
- `public/documents/topologie/s2/td4.pdf`

## Format de nommage

Les fichiers doivent être au format PDF et nommés en fonction de leur type. Par exemple, pour le premier chapitre d'analyse, les fichiers seraient :

- `public/documents/analysis/a1/cours.pdf`
- `public/documents/analysis/a1/td.pdf`
- `public/documents/analysis/a1/correction-td.pdf`

## Mise à jour de la disponibilité

Après avoir ajouté un fichier, il faut mettre à jour les chapitres dans `src/lib/themes.ts`.

Exemple :

```typescript
{
  id: 'a1',
  title: 'Suites et Series Numeriques',
  available: true,
  resources: [
    {
      id: 'a1-cours',
      type: 'cours',
      title: 'Cours',
      url: '/documents/analyse/a1_cours.pdf',
      visibility: 'public',
      source: 'site',
    },
    {
      id: 'a1-corrige-perso',
      type: 'corrige-perso',
      title: 'Corrige personnel TD 1',
      url: '/documents/analyse/a1_corrige_perso.pdf',
      visibility: 'public',
      source: 'personnel',
    },
  ],
}
```

Regle pratique : les supports enseignants ou imports eCampus restent en `private` tant que tu n'as pas une raison claire de les publier.

Attention : ne mets pas une URL eCampus privee dans `src/lib/themes.ts`. Le code frontend est public apres build. Pour une ressource `private`, garde le fichier dans un dossier local non publie et laisse la ressource sans `url` cote site.
