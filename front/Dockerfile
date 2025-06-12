FROM oven/bun:1.2-alpine

WORKDIR /app

COPY package.json ./
COPY bun.lockb* ./

RUN bun install

COPY . .

RUN bun run build

EXPOSE 4173

CMD ["bun", "run", "preview", "--host", "0.0.0.0"]
