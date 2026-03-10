FROM mcr.microsoft.com/devcontainers/php:1-8.3-bullseye

# Remove broken Yarn repo
RUN rm -f /etc/apt/sources.list.d/yarn.list

# Install tidy system dependency + PHP extension
RUN apt-get update \
    && apt-get install -y libtidy-dev \
    && docker-php-ext-install tidy \
    && rm -rf /var/lib/apt/lists/*

# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
        | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
        > /etc/apt/sources.list.d/github-cli.list \
    && apt-get update \
    && apt-get install -y gh \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache modules
RUN a2enmod rewrite headers

