# syntax=docker/dockerfile:1
FROM php:8.3-cli-bookworm AS dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends unzip \
    && rm -rf /var/lib/apt/lists/*
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /app
COPY composer.json composer.lock ./
COPY source ./source
RUN --mount=type=secret,id=github_token,required=true \
    COMPOSER_AUTH="{\"github-oauth\":{\"github.com\":\"$(cat /run/secrets/github_token)\"}}" \
    composer install --no-dev --no-interaction --prefer-dist --no-progress --optimize-autoloader

FROM node:24-bookworm-slim AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=secret,id=github_token,required=true \
    printf '//npm.pkg.github.com/:_authToken=%s\n@helsingborg-stad:registry=https://npm.pkg.github.com\n' \
        "$(cat /run/secrets/github_token)" > .npmrc \
    && npm ci --ignore-scripts --no-audit --no-progress \
    && rm .npmrc
COPY --from=dependencies /app/vendor ./vendor
COPY assets ./assets
COPY source ./source
COPY build-design-tokens.mjs component-design-tokens.json postcss.config.js vite.config.mjs ./
RUN npm run build

FROM ghcr.io/helsingborg-stad/ols-docker-hbg@sha256:e963638097f058dc5e480e86b9d1c2f0a26b9ef74cb0e98593c14b682cfebd86
LABEL org.opencontainers.image.source="https://github.com/helsingborg-stad/styleguide"
WORKDIR /var/www/vhosts/localhost/html
COPY --from=dependencies /app/vendor ./vendor
COPY --from=frontend /app/source ./source
COPY --from=frontend /app/assets ./public/assets
COPY views ./views
COPY component-design-tokens.json config.php index.php Public.php ./
COPY favicon.ico ./public/
COPY docker/public/ ./public/
RUN sed -i 's|docRoot                 $VH_ROOT/html/|docRoot                 $VH_ROOT/html/public/|' \
        /usr/local/lsws/conf/templates/docker.conf \
    && cp /usr/local/lsws/conf/templates/docker.conf \
        /usr/local/lsws/.conf/templates/docker.conf \
    && ln -s public/assets assets \
    && mkdir -p cache \
    && chown -R 1000:1000 cache
EXPOSE 80
