# 🐇 Guide d'Installation Bunny Stream pour Excelium LMS

Ce guide vous explique étape par étape comment configurer votre bibliothèque de streaming vidéo Bunny Stream sur Bunny.net pour héberger des cours vidéo HD/4K jusqu'à 10 Go avec téléversement TUS résumable et lecture sécurisée.

---

## 🛠️ Étape 1 : Créer un compte & une bibliothèque Bunny Stream

1. Rendez-vous sur [https://bunny.net](https://bunny.net) et connectez-vous (ou créez un compte).
2. Dans le menu de gauche, cliquez sur **Stream** puis sur **Add Stream Library**.
3. Renseignez les informations de la bibliothèque :
   - **Name** : `excelium-lms-videos`
   - **Replication Regions** : Sélectionnez *Europe (Frankfurt/London)* pour une latence optimale au Maroc.
4. Cliquez sur **Create Library**.

---

## 🔑 Étape 2 : Récupérer les clés d'API et l'ID de la bibliothèque

Dans le panneau de configuration de votre nouvelle Stream Library :

1. **Stream Library ID** : Notez l'identifiant numérique affiché en haut (ex: `123456`).
2. **API Key (AccessKey)** : Allez dans la section **API** -> Récupérez la clé d'accès principale.
3. **Security Token Key** : Allez dans **Player** -> **Token Authentication** -> Activez l'option et copiez la clé de sécurité.
4. **Pull Zone / CDN Hostname** : Par défaut `iframe.mediadelivery.net`.

---

## ⚙️ Étape 3 : Renseigner le fichier `.env.local`

Ouvrez le fichier `.env.local` à la racine de votre projet et mettez à jour les variables suivantes :

```env
# Bunny Stream Video Hosting
BUNNY_STREAM_API_KEY=votre_cle_api_bunny
BUNNY_STREAM_LIBRARY_ID=123456
BUNNY_STREAM_CDN_HOSTNAME=iframe.mediadelivery.net
BUNNY_STREAM_TOKEN_KEY=votre_cle_de_token_securite
```

---

## 🔒 Étape 4 : Protection & Filigrane (Watermark)

Le lecteur de la plateforme Excelium intègre automatiquement :
- **Jetons d'accès temporaires signés** (expirant après 24h) pour empêcher l'extraction directe des liens des vidéos.
- **Filigrane dynamique avec l'email de l'étudiant** (ex: `m.alfassi@excelium.ma`) affiché en superposition transparente pour décourager les enregistrements d'écran non autorisés.
- **Reprise automatique pour les vidéos de 2h+** : la position de lecture est sauvegardée chaque 5 secondes dans le stockage local de l'étudiant.
