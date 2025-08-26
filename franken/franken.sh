#!/bin/bash

set -e

# Configuration
DOMAIN="styleguide.local.municipio.tech"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CERT_KEY="$SCRIPT_DIR/franken.key"
CERT_CRT="$SCRIPT_DIR/franken.crt"
CADDYFILE="$SCRIPT_DIR/Caddyfile"
WEBROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Generate self-signed certificate with SAN if not present
if [ ! -f "$CERT_KEY" ] || [ ! -f "$CERT_CRT" ]; then
  echo "🔐 Generating self-signed certificate for $DOMAIN..."

  # Create a temporary OpenSSL config with SAN
  OPENSSL_CNF="$SCRIPT_DIR/franken_openssl.cnf"
  cat > "$OPENSSL_CNF" <<EOF
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
CN = $DOMAIN

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = $DOMAIN
EOF

  openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout "$CERT_KEY" \
    -out "$CERT_CRT" \
    -config "$OPENSSL_CNF" \
    -extensions v3_req

  rm -f "$OPENSSL_CNF"
else
  echo "✅ Certificate already exists, skipping generation."
fi

# Trust the certificate (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "🔗 Trusting the certificate in macOS Keychain..."
  sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain "$CERT_CRT"
else
  if command -v trust &> /dev/null; then
    echo "🔗 Trusting the certificate..."
    trust anchor --store "$CERT_CRT"
  else
    echo "⚠️ 'trust' command not found. Please trust the certificate manually."
    echo "You can use the following command to trust it:"
    echo "sudo trust anchor --store $CERT_CRT"
  fi
fi

# Write Caddyfile with absolute paths
echo "📝 Writing Caddyfile..."
cat > "$CADDYFILE" <<EOF
https://$DOMAIN:443 {
    root * $WEBROOT
    php_fastcgi localhost:9000
    file_server
    tls $CERT_CRT $CERT_KEY
}
EOF

# Check /etc/hosts
if ! grep -q "$DOMAIN" /etc/hosts; then
  echo "⚠️  Domain not found in /etc/hosts. Add this line with sudo:"
  echo "127.0.0.1 $DOMAIN"
else
  echo "✅ $DOMAIN found in /etc/hosts."
fi

# Run FrankenPHP in full Caddy mode
echo "🚀 Starting FrankenPHP server for $DOMAIN"
exec frankenphp run --config "$CADDYFILE"