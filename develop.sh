#!/bin/bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")" && pwd)"
package_name="@danerwilliams/charcoal"
install_root="$repo_root/.develop-install"
bin_root="$install_root/bin"

(cd "$repo_root" && yarn turbo run build --filter=@danerwilliams/charcoal)

rm -rf "$install_root"
mkdir -p "$bin_root"

cat >"$install_root/package.json" <<'EOF'
{
  "name": "@danerwilliams/charcoal",
  "version": "0.0.0-local",
  "private": true,
  "bin": {
    "graphite": "bin/gt.js",
    "gt": "bin/gt.js"
  }
}
EOF

cat >"$bin_root/gt.js" <<'EOF'
#!/usr/bin/env node

require("../../apps/cli/dist/src/index.js");
EOF

chmod +x "$bin_root/gt.js"

npm uninstall --location=global "$package_name" >/dev/null 2>&1 || true
npm install --location=global "$install_root"
