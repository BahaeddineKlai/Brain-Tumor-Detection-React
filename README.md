

# Frontend React – Classification de Tumeurs Cérébrales

Cette application est l’interface web du projet.  
Elle permet à l’utilisateur de télécharger une image IRM et de l’envoyer à une API FastAPI pour obtenir une prédiction.

---

## 📥 Installation du projet

Après avoir téléchargé le projet depuis GitHub, ouvrez un terminal dans le dossier du projet puis exécutez :

```bash
npm install
````

Cela installe toutes les dépendances nécessaires.

---

## ▶️ Lancer l’application

Pour démarrer le serveur de développement React :

```bash
npm run dev
```

ou, selon la configuration du projet :

```bash
npm start
```

Une adresse locale sera affichée dans le terminal, par exemple :

```
http://localhost:5173
```

Ouvrez ce lien dans votre navigateur.

---

## 🔗 Lien avec le backend

L’application communique avec l’API FastAPI via :

```js
const API_URL = 'http://127.0.0.1:8000';
```

Le backend doit être lancé en même temps que le frontend.

---

## 🧩 Explication simple du code

### 1. Gestion des états

```js
const [selectedFile, setSelectedFile] = useState(null);
const [previewUrl, setPreviewUrl] = useState(null);
const [prediction, setPrediction] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

Ces variables servent à stocker :

* l’image choisie
* l’aperçu
* les résultats du modèle
* l’état de chargement
* les erreurs

---

### 2. Sélection de l’image

```js
const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
```

Ce bloc récupère le fichier sélectionné.

Il vérifie que c’est bien une image avant de l’enregistrer.

---

### 3. Envoi vers l’API

```js
const formData = new FormData();
formData.append('file', selectedFile);
```

L’image est envoyée à l’API avec :

```js
fetch(`${API_URL}/predict`, { method: 'POST', body: formData });
```

---

### 4. Réception de la réponse

```js
const result = await response.json();
setPrediction(result);
```

On récupère le résultat et on l’affiche automatiquement dans l’interface.

---

### 5. Affichage intelligent des couleurs

```js
if (conf >= 0.9) return 'bg-green-600';
if (conf >= 0.7) return 'bg-yellow-500';
return 'bg-red-500';
```

La couleur change selon le niveau de confiance du modèle.

---
