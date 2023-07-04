# one day Nix will be able to easily build Node.js projects
# but we're not there yet :(
FROM node:lts

RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
