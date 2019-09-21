#!/bin/bash

if [ -z "$1" ]; then
  echo "Please supply a tag"
  exit 1
fi

docker login sldevrg.azurecr.io
docker build -t sldevrg.azurecr.io/sl.fragment-gateway:latest -t sldevrg.azurecr.io/sl.fragment-gateway:$1 .
docker push sldevrg.azurecr.io/sl.fragment-gateway:latest
docker push sldevrg.azurecr.io/sl.fragment-gateway:$1
