FROM node:18
WORKDIR /app
COPY package*.json ./

COPY . .

EXPOSE 5173
# Copier le script d'entrypoint
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Utilisation de l'entrypoint
ENTRYPOINT ["/entrypoint.sh"]