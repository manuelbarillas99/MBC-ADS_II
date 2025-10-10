# frontend/Dockerfile

# Etapa 1: Build de Angular
FROM node:20 AS build
WORKDIR /app

# Copiamos solo las dependencias primero
COPY package*.json ./
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Build de producción
#RUN npm run build --omit=dev
#RUN npm run build --prod
#RUN npm run build --configuration production
#RUN npx ng build mbc-adsii-front --configuration production
#RUN npx ng build --configuration production
RUN npm run build --output-path=dist/mbc-adsii-front

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Eliminación de la configuración por defecto
#RUN rm -rf /usr/share/nginx/html/*

# Copiamos el build de Angular al contenedor Nginx
#COPY --from=build /app/dist/mbc-adsii-front/browser /usr/share/nginx/html
COPY --from=build /app/dist/mbc-adsii-front /usr/share/nginx/html

# Copiamos configuración personalizada de Nginx 
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
