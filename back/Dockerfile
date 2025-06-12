FROM oven/bun:1.2-alpine

WORKDIR /app

COPY package.json ./
COPY bun.lockb* ./

RUN bun install

COPY . .

RUN bunx prisma generate

EXPOSE 3001

CMD ["bun", "run", "start", "--host", "0.0.0.0"]
