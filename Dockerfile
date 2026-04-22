FROM node:20-alpine
WORKDIR /app

# Instalamos el CLI globalmente
RUN npm install -g @angular/cli

# Copiamos archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0"]