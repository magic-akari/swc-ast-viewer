source "$HOME/.cargo/env"

corepack enable

echo "Building WASM..."
pnpm run build:wasm

echo "Building app..."
pnpm run build
