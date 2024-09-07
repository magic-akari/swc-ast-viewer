cd $(dirname $0)/..

cp -R ./extra/. ./pkg/

./scripts/package.mjs ./pkg/package.json
