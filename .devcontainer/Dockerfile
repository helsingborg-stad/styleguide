FROM mcr.microsoft.com/devcontainers/php:1-8.3-bullseye

# Remove broken Yarn repo
RUN rm -f /etc/apt/sources.list.d/yarn.list

# Install tidy system dependency + PHP extension
RUN apt-get update \
    && apt-get install -y libtidy-dev \
    && docker-php-ext-install tidy \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache modules
RUN a2enmod rewrite headers