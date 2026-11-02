# Byggsteg: Next behöver devDependencies (TypeScript, Tailwind) för att bygga
FROM node:24-alpine AS bygg
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Körsteg: bara produktionsberoenden + byggresultatet
FROM node:24-alpine
# tzdata så att loggar och schemajobb visar svensk tid
RUN apk add --no-cache tzdata
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=bygg /app/.next ./.next
COPY --from=bygg /app/public ./public
COPY next.config.mjs ./
EXPOSE ${PORT:-3131}
CMD ["npm", "start"]
