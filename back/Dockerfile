# back/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Instala dependências (inclui devDeps para compilar)
COPY package*.json ./
RUN npm ci

# Copia código
COPY . .

# Garante permissão de execução para os bins (tsc etc)
RUN if [ -d node_modules/.bin ]; then chmod +x node_modules/.bin/* || true; fi

# Usa o script de build definido no package.json (build: "tsc")
RUN npm run build

# Stage final (apenas runtime)
FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Copia artefatos
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/app.js"]