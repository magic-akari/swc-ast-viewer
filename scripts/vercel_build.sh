source "$HOME/.cargo/env"
export BUN_INSTALL="$HOME/.bun"
export PATH=$BUN_INSTALL/bin:$PATH

bun run build:wasm
bun run build
