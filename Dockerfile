# syntax=docker/dockerfile:1
FROM php:8.3-apache-bookworm AS php-base
RUN apt-get update \
    && apt-get install -y --no-install-recommends libonig-dev unzip \
    && docker-php-ext-install mbstring \
    && rm -rf /var/lib/apt/lists/*

FROM php-base AS dependencies
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

FROM php-base
LABEL org.opencontainers.image.source="https://github.com/helsingborg-stad/styleguide"
WORKDIR /var/www/html
COPY --from=dependencies /app/vendor ./vendor
COPY --from=frontend /app/source ./source
COPY --from=frontend /app/assets ./assets
COPY views ./views
COPY component-design-tokens.json config.php index.php Public.php favicon.ico ./
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf
COPY docker/public/index.php ./public/index.php
RUN a2enmod headers \
    && mkdir -p cache \
    && chown www-data:www-data cache
EXPOSE 80
