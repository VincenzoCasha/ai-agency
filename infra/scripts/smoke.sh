#!/usr/bin/env bash
# CRUDO V2 — Smoke post-deploy.
# Uso: BASE_URL=https://crudomov.es ./infra/scripts/smoke.sh
# Requiere: curl, jq.

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
PASS=0
FAIL=0

step() {
  local name="$1"; shift
  if "$@" >/dev/null 2>&1; then
    echo "  ok  · $name"
    PASS=$((PASS + 1))
  else
    echo "  FAIL · $name"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== smoke against $BASE_URL ==="

step "GET /api/v1/health"            curl -fsS "$BASE_URL/api/v1/health"
step "GET /api/v1/products?size=1"   bash -c "curl -fsS '$BASE_URL/api/v1/products?size=1' | jq -e '.items|length>=0' >/dev/null"
step "GET /api/v1/categories"        bash -c "curl -fsS '$BASE_URL/api/v1/categories'        | jq -e '.items|type==\"array\"' >/dev/null"
step "GET /api/v1/events"            bash -c "curl -fsS '$BASE_URL/api/v1/events'            | jq -e '.items|type==\"array\"' >/dev/null"
step "GET /api/v1/site/config"       bash -c "curl -fsS '$BASE_URL/api/v1/site/config'       | jq -e '.legal_name'        >/dev/null"
step "GET /api/v1/admin/dashboard sin token devuelve 401" \
  bash -c "test \"\$(curl -s -o /dev/null -w '%{http_code}' '$BASE_URL/api/v1/admin/dashboard')\" = '401'"
step "GET / sirve la SPA (HTML con CRUDO)" \
  bash -c "curl -fsS '$BASE_URL/' | grep -qi 'crudo'"
step "GET /robots.txt" \
  bash -c "curl -fsS '$BASE_URL/robots.txt' | grep -qi 'sitemap\|disallow'"
step "GET /sitemap.xml" \
  bash -c "curl -fsS '$BASE_URL/sitemap.xml' | grep -qi '<urlset'"

echo
echo "=== resumen: ok=$PASS fail=$FAIL ==="
[ "$FAIL" -eq 0 ]
