# build context is ..

FROM node:18-alpine AS base-next

USER root

WORKDIR /app

COPY static-ui/package.json .
COPY static-ui/yarn.lock .

RUN yarn

FROM base-next as builder-next

COPY static-ui .

RUN yarn build

FROM golang:1.21-alpine as builder-go

WORKDIR /app

COPY proxy/go.mod proxy/go.sum ./
RUN go mod download

COPY proxy/*.go ./

RUN CGO_ENABLED=0 GOOS=linux go build -o incident-ai-demo-proxy

FROM alpine as runner

WORKDIR /app

COPY --from=builder-next /app/out out
COPY --from=builder-go /app/incident-ai-demo-proxy incident-ai-demo-proxy

EXPOSE 8080
# Run
ENTRYPOINT ["/app/incident-ai-demo-proxy"]
