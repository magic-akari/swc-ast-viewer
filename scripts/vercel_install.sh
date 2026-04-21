echo "Installing WASM pack..."
# Install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

corepack enable

echo "Installing dependencies..."
# Install dependencies
pnpm i
