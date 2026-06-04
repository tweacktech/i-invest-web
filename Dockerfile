FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/
RUN npm ci --workspace=web --include-workspace-root

FROM base AS builder
ARG NEXT_PUBLIC_API_URL=http://localhost:3001/v1
ARG NEXT_PUBLIC_API_KEY=
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_KEY=$NEXT_PUBLIC_API_KEY
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY apps/web ./apps/web
WORKDIR /app/apps/web
RUN npm run build

FROM base AS runner
WORKDIR /app/apps/web
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./.next/static
COPY --from=builder /app/apps/web/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
