# ---------- build ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- runtime ----------
FROM nginx:alpine

# Remove config default
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy dist
COPY --from=build /app/dist/todo-front /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
