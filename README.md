# JobSeed Frontend

Plateforme de recherche d'emploi avec accompagnement personnalisé basé sur le Parcours du Héros.

## 🚀 Stack Technique

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Backend**: Supabase
- **Automation**: n8n

## 📦 Installation

```bash
# Cloner le repo
git clone https://github.com/your-repo/jobseed-frontend.git
cd jobseed-frontend

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env.local

# Configurer les variables
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# N8N_BASE_URL=

# Lancer en développement
npm run dev
```

## 🏗️ Structure

```
├── app/                    # Routes Next.js (App Router)
│   ├── auth/              # Pages d'authentification
│   ├── dashboard/         # Tableau de bord
│   ├── journey/           # Parcours du Héros
│   │   └── prologue/      # Tests psychométriques
│   ├── profile/           # Profil utilisateur
│   └── documents/         # Gestion des CV/lettres
├── components/            # Composants React
│   ├── tests/            # Tests psychométriques
│   ├── documents/        # Génération de documents
│   └── ui/               # Composants UI réutilisables
├── lib/                   # Utilitaires et configurations
│   ├── supabase/         # Clients Supabase
│   ├── templates/        # Templates CV/Lettres
│   └── prompts/          # Prompts IA
├── stores/               # Stores Zustand
└── types/                # Types TypeScript
```

## 🎯 Fonctionnalités

### Tests Psychométriques
- **I.C.A.R.E.**: Identification des blocages (Identité, Capacités, Appartenance, Risque, Estime)
- **RIASEC**: Profil d'intérêts professionnels
- **Ennéagramme**: Type de personnalité

### Parcours du Héros
12 stations de développement personnel et professionnel avec feedback IA personnalisé.

### Génération de Documents
- CV personnalisés selon le profil I.C.A.R.E.
- Lettres de motivation adaptées
- Export PDF/DOCX

### Préparation aux Entretiens
Questions ciblées sur les blocages identifiés avec feedback IA.

## 🔧 Déploiement

### Vercel (recommandé)

1. Connecter le repo GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer

### Variables d'environnement requises

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
N8N_BASE_URL=https://n8n.xxx.cloud/webhook
```

## 📄 Licence

Propriétaire - Nouvelle Option Emploi © 2025
