# Utilisez une image de base Node.js
FROM node:14

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le fichier package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Installez les dépendances

RUN npm install

# Copiez les fichiers de l'application dans le répertoire de travail
COPY . .

# Exposez le port que votre application utilise (si nécessaire)
EXPOSE 3000

# Commande pour exécuter votre application
CMD ["node", "server.js"]
