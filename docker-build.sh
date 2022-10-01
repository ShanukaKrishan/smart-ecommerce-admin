#!/bin/bash

if [[ -z $1 ]]; then
  echo Please provide the version
  exit 1
fi

docker buildx build \
  --pull \
  --no-cache \
  --progress=plain \
  -t smart-ecommerce-store-admin .

docker tag \
  smart-ecommerce-store-admin:latest \
  asia-southeast1-docker.pkg.dev/docme-317706/smart-ecommerce/admin-web:Production_$1

docker push asia-southeast1-docker.pkg.dev/docme-317706/smart-ecommerce/admin-web:Production_$1
