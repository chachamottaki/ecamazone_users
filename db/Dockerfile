# Utilisez l'image MySQL officielle
FROM mysql:latest

# Définissez des variables d'environnement pour configurer la base de données
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=user_microservice

# Exposez le port MySQL
EXPOSE 3306

# Commande pour démarrer le serveur MySQL
CMD ["mysqld"]