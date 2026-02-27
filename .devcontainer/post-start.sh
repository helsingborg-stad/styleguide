#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Function to print styled messages
print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}${BLUE}  🚀 Helsingborg Styleguide Development Environment${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_url() {
    echo -e "${YELLOW}🌐 $1${NC}"
}

# Print header
print_header

# Start Apache service
print_info "Starting Apache service..."
service apache2 start

if [ $? -eq 0 ]; then
    print_success "Apache service started successfully!"
else
    echo -e "${RED}❌ Failed to start Apache service${NC}"
    exit 1
fi

# Display access information
echo ""
print_success "Development environment is ready!"
echo ""
print_info "Access your styleguide at:"
print_url "  • Local:     http://localhost:8080"
print_url "  • Codespace: https://$CODESPACE_NAME-8080.app.github.dev" 
echo ""
print_info "Available commands:"
echo -e "  ${YELLOW}npm run dev${NC}     - Start Vite development server"
echo -e "  ${YELLOW}npm run build${NC}   - Build for production"
echo -e "  ${YELLOW}npm run test${NC}    - Run tests"
echo -e "  ${YELLOW}npm run lint${NC}    - Run linting"
echo ""
print_success "Happy coding! 🎨"
echo ""