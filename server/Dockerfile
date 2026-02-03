FROM oven/bun:latest

WORKDIR /server

COPY package*.json ./

RUN bun install

COPY . .

EXPOSE 3000

CMD [ "bun", "run", "src/index.ts" ]