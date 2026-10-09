# ServCraft — site complet

> Décris ton serveur. L'IA le construit.

Site marketing + parcours guidé de création + panel de gestion pour ServCraft, un SaaS qui crée un serveur GTA V RP de A à Z grâce à l'IA. Toutes les données sont simulées ; le code est organisé pour brancher ensuite l'API d'IA, Stripe, Discord, PostgreSQL et le moteur de déploiement.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
```

Stack : Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion. Police : Inter Tight (via `next/font`).

## Le chemin guidé

| Étape | Route | Objectif |
| --- | --- | --- |
| 0 | `/` | Accueil : hero, comment ça marche, démo animée, ce qui est inclus, IA de gestion, tarifs, FAQ |
| 1 | `/creer` | Décris ton serveur (zone de texte + exemples) |
| 2 | `/creer/questions` | 5 questions, une par écran |
| 3 | `/creer/recap` | Fiche du serveur générée par l'IA, chaque élément modifiable |
| 4 | `/creer/offre` | Offre → compte (e-mail ou Discord) → paiement |
| 5 | `/creer/construction` | Construction en direct (~20 s simulées) |
| 6 | `/creer/mise-en-ligne` | Formation en trois parties : clé de serveur, Discord, connexion au jeu (l'ancienne adresse `/creer/pret` y redirige) |
| 7 | `/panel` | Panel de gestion avec l'IA au centre |

Pages secondaires : `/tarifs`, `/communaute`, `/a-propos`, `/connexion`, `/fonctionnalites`, `/fonctionnalites/[slug]`, `/legal/[slug]`, 404.

L'état du parcours est conservé dans `localStorage` (`src/lib/wizard-store.tsx`) : on peut revenir en arrière et reprendre là où on s'était arrêté. Le panel fonctionne aussi sans parcours (mode démonstration).

## Images

Deux types d'images dans `public/images/` :

- des **photos** (`.jpg`) pour le monde du jeu : accueil, ville, police, métiers, gangs, immobilier, braquages, image finale, communauté, à propos ;
- des **écrans du produit** (`.jpg`) rendus par `scripts/screens.mjs` : panel, Discord, serveur, économie, site web, IA, sauvegardes, réparation. Ce sont des compositions HTML (police et composants du site) capturées dans Chromium ; pour les régénérer, lance `npm run build` puis `node scripts/screens.mjs` avec Playwright installé (`npm i -D playwright`).

Le fichier `src/lib/data/images.ts` liste chaque emplacement avec son chemin, son texte alternatif et, si besoin, son point de cadrage. Pour changer une image, remplace le fichier en gardant son nom ou modifie le chemin dans ce fichier.

## Paiement Stripe

Le paiement est réel dès que `STRIPE_SECRET_KEY` est renseignée (fichier `.env.local` en local, « Environment Variables » dans Vercel). Sans clé, le paiement est simulé.

- L'étape Offre ouvre la page de paiement hébergée par Stripe (abonnement mensuel). Les quatre produits et tarifs sont créés automatiquement dans Stripe à la première utilisation (`src/lib/stripe.ts`).
- Le retour se fait sur `/creer/paiement`, qui vérifie la session côté serveur (`/api/checkout/verify`) avant de lancer la construction.
- `/api/stripe/webhook` reçoit les événements Stripe (signature vérifiée avec `STRIPE_WEBHOOK_SECRET`). À compléter avec la base de données.
- Carte de test : `4242 4242 4242 4242`, n'importe quelle date future et n'importe quel code.

Variables : voir `.env.example`.

## Où brancher le réel

Chaque service simulé garde la signature à conserver :

- `src/lib/services/ai.ts` — génération de la fiche (`generateSpec`) et propositions de modification (`proposeChange`) → API d'IA.
- `src/lib/services/payments.ts` — `checkout` → Stripe Checkout.
- `src/lib/services/auth.ts` — `signInWithEmail`, `signInWithDiscord` → lien magique + OAuth Discord.
- `src/lib/services/deploy.ts` — `runDeployment` → moteur de déploiement (SSE / WebSocket).
- `src/lib/services/panel.ts` — données du panel → PostgreSQL via `/api/panel/*`.

## Structure

```
src/
  app/                 routes (App Router)
  components/ui/       Tag, PillButton, ImageCard, ChoiceCard, ProgressBar, BuildList, AiResponseCard, Switch, Reveal, Cursor…
  components/layout/   Navbar (méga-menu), Footer, FinalCta, SiteShell
  components/home/     sections de l'accueil
  components/wizard/   enveloppe du parcours, champs modifiables
  components/panel/    onglets et discussion IA
  lib/data/            contenu : fonctionnalités, tarifs, FAQ, étapes de construction, prompts, images
  lib/services/        services simulés à brancher
  lib/wizard-store.tsx état du parcours (contexte + localStorage)
```

Non affilié à Rockstar Games, Take-Two ou Cfx.re.
