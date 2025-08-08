#!/bin/bash
set -eufo pipefail

cd "$(dirname "$0")/.."

trap "docker-compose down --volumes --remove-orphans" 0

# SERVICE=${SERVICE:-dev}
# docker-compose pull "$SERVICE"
# docker-compose -f docker-compose.yml run --rm --service-ports "$SERVICE" "$@"

docker-compose up --detach --remove-orphans --force-recreate
