FROM node:20-alpine
WORKDIR /app

# Instalamos el CLI globalmente
RUN npm install -g @angular/cli

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos dependencias del proyecto + Flowbite en build time
RUN npm install && npm install flowbite

# Copiamos el resto del código
COPY . .

EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0"]