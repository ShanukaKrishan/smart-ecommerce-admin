#!/bin/bash

docker buildx build \
  --pull \
  --no-cache \
  --progress=plain \
  -t smart-ecommerce-store-admin .
