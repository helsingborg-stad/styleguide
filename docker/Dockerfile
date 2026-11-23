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

# dunglas/frankenphp 1.13.4, PHP 8.3, Debian bookworm.
FROM dunglas/frankenphp:1.13.4-php8.3-bookworm@sha256:12e0098404972ba606b3f8a15540ef2fe91e38a3cf4ef2ed0def1ba58205a796
LABEL org.opencontainers.image.source="https://github.com/helsingborg-stad/styleguide"
WORKDIR /app

# Application files are owned by root and read-only to the server user. Only
# public/ is served (see Caddyfile); everything else sits outside the web root.
COPY --from=dependencies /app/vendor ./vendor
COPY --from=frontend /app/source ./source
COPY --from=frontend /app/assets ./public/assets
COPY views ./views
COPY component-design-tokens.json config.php index.php Public.php ./
COPY favicon.ico ./public/
COPY docker/public/ ./public/
COPY docker/Caddyfile /etc/frankenphp/Caddyfile
COPY --chmod=755 docker/docker-entrypoint.sh /usr/local/bin/styleguide-entrypoint

# The app resolves assets from BASEPATH/assets, so point it at the served copy.
# Run unprivileged: drop the binary's bind capability (we listen on 8080), and
# give www-data write access only to cache/ and Caddy's own state directories.
RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
    && ln -s public/assets assets \
    && mkdir -p cache \
    && chown www-data:www-data cache \
    && chown -R www-data:www-data /config/caddy /data/caddy \
    && setcap -r /usr/local/bin/frankenphp

USER www-data

# TLS terminates at the cluster ingress; bind an unprivileged HTTP port.
EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/styleguide-entrypoint"]
CMD ["frankenphp", "run", "--config", "/etc/frankenphp/Caddyfile", "--adapter", "caddyfile"]
