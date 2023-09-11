source "$HOME/.cargo/env"

echo "Building WASM..."
pnpm run build:wasm

echo "Building app..."
pnpm run build
