FROM node:22-alpine as build

WORKDIR /app

COPY package.json ./
COPY package-lock.json* ./

COPY . .

RUN npm ci


RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json* ./

RUN npm ci --production

COPY --from=build /app/dist ./dist

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
