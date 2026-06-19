# Etapa 1 — compilar la aplicación Angular
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2 — servir los archivos estáticos con Nginx
FROM nginx:alpine

COPY --from=build /app/dist/telcox-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
