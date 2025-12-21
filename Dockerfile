# =========
# Build
# =========
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# =========
# Runtime (Nginx)
# =========
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# limpa conteúdo default
RUN rm -rf ./*

# Copia o build do Angular
# (Ajuste "todo-front" se o nome do projeto no angular.json for diferente)
COPY --from=build /app/dist/todo-front/browser ./

# Config do nginx com proxy /api
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]