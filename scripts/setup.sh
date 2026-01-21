#!/bin/bash
set -e

echo "🐯 Setting up Fulala Site Builder..."

# Check for required tools
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is required but not installed."
        exit 1
    fi
    echo "✓ $1 found"
}

echo ""
echo "Checking requirements..."
check_command node
check_command npm

# Optional: Elixir for admin dashboard
if command -v elixir &> /dev/null; then
    echo "✓ elixir found (admin dashboard ready)"
    HAS_ELIXIR=true
else
    echo "⚠ elixir not found (admin dashboard will need Docker)"
    HAS_ELIXIR=false
fi

# Setup SvelteKit public site
echo ""
echo "📦 Setting up SvelteKit public site..."
cd fulala-public
npm install
echo "✓ Dependencies installed"

# Setup Convex (if not already done)
if [ ! -f ".env.local" ]; then
    echo ""
    echo "🔧 Convex Setup Required"
    echo "Run: npx convex dev --once --configure=new"
    echo "This will create a new Convex project and configure it."
fi

cd ..

# Setup Phoenix admin (if Elixir is available)
if [ "$HAS_ELIXIR" = true ]; then
    echo ""
    echo "📦 Setting up Phoenix admin dashboard..."
    cd fulala-admin
    mix deps.get
    mix compile
    echo "✓ Admin dashboard ready"
    cd ..
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start development:"
echo ""
echo "  Terminal 1 (Public Site):"
echo "    cd fulala-public && npm run dev"
echo ""
echo "  Terminal 2 (Convex Dev Server):"
echo "    cd fulala-public && npx convex dev"
echo ""
if [ "$HAS_ELIXIR" = true ]; then
    echo "  Terminal 3 (Admin Dashboard):"
    echo "    cd fulala-admin && mix phx.server"
    echo ""
fi
echo "Or use Docker:"
echo "  docker-compose up"
echo ""
echo "🐯 Happy building!"
