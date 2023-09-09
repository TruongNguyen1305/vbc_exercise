FROM node:18 as build
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine as main
WORKDIR /app
COPY --from=build /app .
RUN npm start

