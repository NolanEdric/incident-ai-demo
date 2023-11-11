FROM public.ecr.aws/docker/library/node:18-alpine AS base

USER root

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

FROM base as builder

COPY . .
COPY .env.local.example .env

RUN yarn build

FROM base as runner

COPY --from=builder /app/public public
COPY --from=builder /app/.next .next
COPY --from=builder /app/package.json .

ENTRYPOINT [ "yarn", "start", "-p", "80" ]
