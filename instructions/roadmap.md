# 🖥️ Portfolio 3D Interactif — Anjah Rakotovao

> **Vision** : Un portfolio immersif où le visiteur explore un bureau 3D low-poly et interagit avec les objets pour découvrir mon profil, mes projets et me contacter.

---

## 📋 Tech Stack

| Technologie | Version | Rôle |
|---|---|---|
| Nuxt | 4.4.2 | Framework Vue.js (SSR désactivé) |
| Vue | 3.5.x | UI réactive |
| TresJS Core | 5.7.0 | Wrapper Vue pour Three.js |
| TresJS Cientos | 5.6.0 | Helpers (OrbitControls, GLTFModel, Html, Environment) |
| Three.js | 0.183.x | Moteur 3D WebGL |
| GSAP | 3.14.x | Animations caméra & transitions |
| TailwindCSS | 4.x (via @nuxtjs/tailwindcss@7) | Styles utilitaires |

---

## 🏗️ Architecture actuelle

```
desk-portfolio/
├── app/
│   ├── app.vue              ← Layout principal (titre + overlay HUD)
│   └── components/
│       └── TheScene.vue      ← Scène 3D complète (caméra, lumières, modèle, interactions)
├── public/
│   └── models/
│       ├── room_v1.glb       ← Ancienne version de la scène
│       ├── room_v3.glb       ← Version intermédiaire
│       ├── room_v4.glb       ← Version intermédiaire
│       └── room_v5.glb       ← 🟢 Version actuelle (4.7 MB)
└── nuxt.config.ts            ← Config (ssr: false, modules, optimizeDeps)
```

---

## 🎯 Éléments interactifs de la scène

### 1. 💻 Laptop — *Site web / Projets*
| Aspect | État |
|---|---|
| Modèle 3D | ✅ Présent dans `room_v5.glb` |
| Meshes identifiés | ✅ `laptop_bottom`, `laptop_cover`, `screen` |
| Détection clic | ✅ Fonctionnel |
| Détection hover (cursor pointer) | ✅ Fonctionnel |
| Animation zoom caméra | ✅ GSAP fly-to avec lookAt progressif |
| Contenu HTML (iframe) | ✅ `anjahnyony.com` via `<Html>` de Cientos |
| Bouton retour | ✅ "← Retour au bureau" avec transition fade |

> [!NOTE]
> Le laptop est le seul élément entièrement fonctionnel pour l'instant. Les positions caméra et lookAt sont calibrées.

---

### 2. 📱 Téléphone — *Formulaire de contact*
| Aspect | État |
|---|---|
| Modèle 3D | ✅ Présent dans `room_v5.glb` (nouveau) |
| Meshes identifiés | ✅ Tous les meshes commençant par `Plane038_` (parent: `flash_camera`) |
| Détection clic | ✅ Fonctionnel |
| Détection hover | ✅ Fonctionnel |
| Animation zoom caméra | ✅ Fonctionnel |
| Contenu HTML | ✅ Formulaire avec iframe (Apparait avec FadeIn post-animation) |

**Plan d'implémentation :**
1. Ajouter `PHONE_PARTS` dans le script (détection prefixe `Plane038_`)
2. Créer `zoomToPhone()` avec positions caméra calibrées
3. Créer un composant `ContactForm.vue` affiché en overlay HTML 3D sur l'écran du téléphone
4. Backend : Nuxt server route `/api/contact` ou service externe (Formspree, etc.)

---

### 3. 📚 Livres — *Parcours / À propos*
| Aspect | État |
|---|---|
| Modèle 3D | ✅ Présent dans `room_v5.glb` (étagère avec livres) |
| Meshes identifiés | ✅ `book`, `book001`, `book002`, `book003`, `book_shelf` |
| Détection clic | ✅ Fonctionnel |
| Détection hover | ✅ Fonctionnel |
| Animation zoom caméra | ✅ Fonctionnel |
| Contenu HTML | ✅ Fait (Via Iframe/Timeline) |

**Plan d'implémentation :**
1. Ajouter `BOOK_PARTS` dans le script
2. Créer `zoomToBooks()` avec animation vers l'étagère
3. Créer un composant `ParcourPanel.vue` — style page de livre ou timeline verticale
4. Contenu : formation, stack technique, expériences, soft skills

---

### 4. 💡 Interrupteur — *Mode clair / sombre*
| Aspect | État |
|---|---|
| Modèle 3D | ✅ Présent dans `room_v5.glb` (nouveau) |
| Meshes identifiés | ✅ `light_switch` |
| Détection clic | ✅ Fonctionnel |
| Détection hover | ✅ Fonctionnel |
| Animation toggle | ✅ GSAP cross-fade des lumières |
| Changement lumières scène | ✅ Parfait (HDRI fade, ombres ajustées) |
| Changement UI overlay | ❌ À implémenter |

**Plan d'implémentation :**
1. Au clic sur `light_switch` : toggle état `isDarkMode`
2. Animer l'interrupteur (rotation ou position du bouton)
3. Modifier les lumières de la scène :
   - **Clair** : AmbientLight forte, DirectionalLight chaude, clear-color clair
   - **Sombre** : AmbientLight faible, lumière lampe de bureau, clear-color sombre
4. Adapter le HUD (texte titre/sous-titre) selon le mode
5. Optionnel : ajouter une lampe de bureau dans le modèle 3D

---

## 📅 Roadmap par phases

### Phase 1 — Identification des meshes ⬅️ **TERMINÉE** ✅
- [x] Charger `room_v5.glb` et logger tous les noms de meshes au clic
- [x] Mapper chaque mesh à son objet (téléphone, livres, interrupteur)
- [x] Documenter les noms dans ce fichier

### Phase 2 — Interactions de base
- [x] Ajouter le hover (cursor pointer) pour téléphone, livres, interrupteur
- [x] Ajouter les fonctions `zoomToPhone()`, `zoomToBooks()` avec GSAP
- [x] Calibrer les positions caméra pour chaque zoom
- [ ] Refactoriser `TheScene.vue` — extraire la logique de zoom en composable `useZoom.ts`

### Phase 3 — Contenu interactif
- [x] Créer/Lier `ContactForm.vue` (téléphone) — HTML overlay 3D et rotation du modèle OK.
- [x] Créer/Lier composant iframe pour (livres) — timeline du parcours / Animation ouverture du livre OK.
- [x] Implémenter le toggle dark/light mode (interrupteur)

### Phase 4 — Polish & UX
- [ ] Animations d'entrée au chargement de la page
- [ ] Écran de chargement pendant le téléchargement du modèle GLB
- [ ] Hints visuels (particules, glow, tooltip) sur les objets interactifs
- [ ] Responsive / gestion mobile (touch events)
- [ ] SEO meta tags, favicon, Open Graph

### Phase 5 — Déploiement
- [ ] Build de production (`nuxt generate` ou `nuxt build`)
- [ ] Déploiement (Vercel / Netlify / Cloudflare Pages)
- [ ] Domaine personnalisé
- [ ] Analytics

---

## 🔧 Configuration importante

```ts
// nuxt.config.ts
ssr: false  // ← OBLIGATOIRE (Three.js crash côté serveur)
compatibilityDate: '2026-04-01'
```

## 🐛 Problèmes résolus

| Date | Problème | Solution |
|---|---|---|
| 2026-04-01 | IPC connection closed au démarrage | Ajout `ssr: false` dans nuxt.config.ts |
| 2026-04-01 | `Cannot use 'import.meta' outside a module` | Upgrade `@nuxtjs/tailwindcss` de v6 → v7.0.0-beta.1 (conflit TW3 vs TW4) |

---

## 📝 Notes

- Le modèle GLB actuel est `room_v5.glb` (4.7 MB) — penser à l'optimiser avec Draco compression pour le déploiement
- Les positions caméra du laptop sont calibrées : target `(1.54, 1.81, 0.90)`, lookAt `(1.54, 1.65, 0.24)`
- OrbitControls limités : pas de pan, distance 2-7, angles restreints pour rester dans la pièce
