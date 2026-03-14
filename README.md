# NGO Tracker — Structure du projet

## Stack technique
React 18 · Tailwind CSS · React Context API

## Arborescence

```
src/
│
├── App.jsx                          # Racine : routing, context, langue, dark mode
│
├── context/
│   └── AppContext.jsx               # Contexte global partagé (useApp hook)
│
├── translations/
│   └── index.js                     # Toutes les traductions FR / EN
│
├── components/
│   ├── ui/
│   │   ├── Logo.jsx                 # NGOLogo (SVG) + LogoText
│   │   ├── Toggles.jsx              # DarkToggle + LangToggle
│   │   ├── InputField.jsx           # Champ de saisie réutilisable
│   │   ├── StatCard.jsx             # Carte KPI dashboard
│   │   └── ProjectsTable.jsx        # Tableau des projets
│   │
│   └── layout/
│       └── DashShell.jsx            # Layout sidebar + topbar partagé des dashboards
│
└── pages/
    ├── Landing.jsx                  # Page d'accueil publique
    ├── Login.jsx                    # Connexion (3 rôles)
    ├── Register.jsx                 # Inscription (ONG / Manager / Viewer)
    │
    └── dashboards/
        ├── DashAdmin.jsx            # Dashboard Administrateur (accès complet)
        ├── DashManager.jsx          # Dashboard Manager (projets assignés)
        └── DashViewer.jsx           # Dashboard Observateur (lecture seule)
```

## Palette de couleurs
| Usage           | Classe Tailwind          | Hex       |
|-----------------|--------------------------|-----------|
| Fond principal  | `bg-emerald-900`         | `#064e3b` |
| Fond dark       | `bg-emerald-950`         | `#022c22` |
| Accent or       | `text-amber-400`         | `#fbbf24` |
| Or foncé        | `text-amber-600`         | `#d97706` |
| Vert clair      | `bg-emerald-100`         | `#d1fae5` |
| Texte clair     | `text-emerald-700/60`    | opacity   |

## Installation

```bash
npm create vite@latest ngo-tracker -- --template react
cd ngo-tracker
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install
```

Copier les fichiers `src/` dans le dossier `src/` du projet Vite.

Ajouter dans `tailwind.config.js` :
```js
content: ["./index.html", "./src/**/*.{js,jsx}"],
```

Ajouter dans `src/index.css` :
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```bash
npm run dev
```
