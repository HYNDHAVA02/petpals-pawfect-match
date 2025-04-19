# Dockerfile
# ────────────────
# 1) Build stage
FROM node:18-alpine AS builder

# set working directory
WORKDIR /app

# copy only package manifests for caching
COPY package*.json ./

# install deps
RUN npm ci

# copy rest of your source
COPY . .

# build the production bundle
RUN npm run build

# ────────────────
# 2) Production stage
FROM nginx:stable-alpine

# copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# remove default nginx index if you customized base path
# (optional) COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
