#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3003}"

PASS_COUNT=0
FAIL_COUNT=0

pass() {
  PASS_COUNT=$((PASS_COUNT + 1))
  echo "PASS - $1"
}

fail() {
  FAIL_COUNT=$((FAIL_COUNT + 1))
  echo "FAIL - $1"
}

assert_equals() {
  local actual="$1"
  local expected="$2"
  local message="$3"

  if [[ "$actual" == "$expected" ]]; then
    pass "$message"
  else
    fail "$message | expected=$expected actual=$actual"
  fi
}

assert_not_empty() {
  local value="$1"
  local message="$2"

  if [[ -n "$value" ]]; then
    pass "$message"
  else
    fail "$message | value is empty"
  fi
}

echo
echo "Running smoke test against:"
echo "$BASE_URL"
echo

HEALTH_BODY=$(mktemp)
HEALTH_HEADERS=$(mktemp)

READINESS_BODY=$(mktemp)
READINESS_HEADERS=$(mktemp)

NOT_FOUND_BODY=$(mktemp)
NOT_FOUND_HEADERS=$(mktemp)

cleanup() {
  rm -f \
    "$HEALTH_BODY" \
    "$HEALTH_HEADERS" \
    "$READINESS_BODY" \
    "$READINESS_HEADERS" \
    "$NOT_FOUND_BODY" \
    "$NOT_FOUND_HEADERS"
}

trap cleanup EXIT

HEALTH_STATUS=$(curl -s \
  -D "$HEALTH_HEADERS" \
  -o "$HEALTH_BODY" \
  -w "%{http_code}" \
  "$BASE_URL/api/health")

assert_equals \
  "$HEALTH_STATUS" \
  "200" \
  "GET /api/health returns 200"

HEALTH_STATE=$(jq -r '.status' "$HEALTH_BODY")

assert_equals \
  "$HEALTH_STATE" \
  "ok" \
  "Health status is ok"

HEALTH_REQUEST_ID=$(jq -r '.requestId // empty' "$HEALTH_BODY")

assert_not_empty \
  "$HEALTH_REQUEST_ID" \
  "Health body includes requestId"

HEALTH_HEADER_REQUEST_ID=$(grep -i '^x-request-id:' "$HEALTH_HEADERS" \
  | cut -d ':' -f 2- \
  | tr -d '\r' \
  | xargs)

assert_equals \
  "$HEALTH_HEADER_REQUEST_ID" \
  "$HEALTH_REQUEST_ID" \
  "Header and body use the same requestId"

HEALTH_RESPONSE_TIME=$(grep -i '^x-response-time:' "$HEALTH_HEADERS" \
  | cut -d ':' -f 2- \
  | tr -d '\r' \
  | xargs)

assert_not_empty \
  "$HEALTH_RESPONSE_TIME" \
  "Health includes X-Response-Time"

HEALTH_SERVER_TIMING=$(grep -i '^server-timing:' "$HEALTH_HEADERS" \
  | cut -d ':' -f 2- \
  | tr -d '\r' \
  | xargs)

assert_not_empty \
  "$HEALTH_SERVER_TIMING" \
  "Health includes Server-Timing"

POWERED_BY=$(grep -i '^x-powered-by:' "$HEALTH_HEADERS" || true)

assert_equals \
  "$POWERED_BY" \
  "" \
  "X-Powered-By header is disabled"

READINESS_STATUS=$(curl -s \
  -D "$READINESS_HEADERS" \
  -o "$READINESS_BODY" \
  -w "%{http_code}" \
  "$BASE_URL/api/health/readiness")

assert_equals \
  "$READINESS_STATUS" \
  "200" \
  "GET /api/health/readiness returns 200"

READINESS_STATE=$(jq -r '.status' "$READINESS_BODY")

assert_equals \
  "$READINESS_STATE" \
  "ready" \
  "Readiness status is ready"

NOT_FOUND_STATUS=$(curl -s \
  -D "$NOT_FOUND_HEADERS" \
  -o "$NOT_FOUND_BODY" \
  -w "%{http_code}" \
  "$BASE_URL/api/does-not-exist")

assert_equals \
  "$NOT_FOUND_STATUS" \
  "404" \
  "Unknown route returns 404"

NOT_FOUND_CODE=$(jq -r '.code' "$NOT_FOUND_BODY")

assert_equals \
  "$NOT_FOUND_CODE" \
  "ROUTE_NOT_FOUND" \
  "Unknown route returns ROUTE_NOT_FOUND"

NOT_FOUND_REQUEST_ID=$(jq -r '.requestId // empty' "$NOT_FOUND_BODY")

assert_not_empty \
  "$NOT_FOUND_REQUEST_ID" \
  "404 response includes requestId"

echo
echo "Smoke test summary"
echo "Passed: $PASS_COUNT"
echo "Failed: $FAIL_COUNT"
echo

if [[ "$FAIL_COUNT" -gt 0 ]]; then
  exit 1
fi

echo "Smoke test completed successfully"
