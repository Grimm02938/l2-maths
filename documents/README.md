# Guide pour l'ajout de documents

Ce guide explique comment ajouter de nouveaux documents (cours, TD, corrections) au projet.

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

## Format de nommage

Les fichiers doivent être au format PDF et nommés en fonction de leur type. Par exemple, pour le premier chapitre d'analyse, les fichiers seraient :

- `public/documents/analysis/a1/cours.pdf`
- `public/documents/analysis/a1/td.pdf`
- `public/documents/analysis/a1/correction-td.pdf`

## Mise à jour de la disponibilité

Après avoir ajouté un fichier, vous devez mettre à jour le tableau `documents` dans le fichier `src/data/subjects.ts` pour indiquer que le document est disponible.

Par exemple, si vous ajoutez le DS du chapitre `a1` d'analyse, vous devez modifier la ligne correspondante dans le tableau `documents` comme suit :

```typescript
export const documents: Document[] = [
  // ...
  { type: "ds", label: "DS", available: true },
  // ...
];
```
