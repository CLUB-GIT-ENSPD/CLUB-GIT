# Club GIT · ENSPD

Application web du Club Génie Informatique & Télécommunications de l'ENSPD.
Le serveur local fournit l'interface React et l'API Express.

## Prérequis

- Node.js 22.12 ou plus récent
- npm

## Installation et démarrage

Depuis la racine du dépôt :

```powershell
npm ci
npm run dev
```

Ouvrir ensuite [http://localhost:3000](http://localhost:3000). Aucune clé Gemini
ni configuration `.env.local` n'est nécessaire pour lancer l'application locale.

## Vérifications

```powershell
npm run lint
npm run build
npm test
```
