#!/bin/bash

if [ ! -f "./.env" ]; then
  echo "Secrets not found. Writing database URL to file"
  echo $DATABASE_URL >> .env
fi

echo "${DATABASE_URL}"
echo "Genrating Dummy Data for MongoDB"
# npm run generate-dummy-data

npm run dev
