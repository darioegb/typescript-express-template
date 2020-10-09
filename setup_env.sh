#!/bin/bash
mkdir src/environments
echo NODE_ENV=$NODE_ENV >> "src/environments/${1}.env"
echo MONGO_USER=$MONGO_USER >> "src/environments/${1}.env"
echo MONGO_PASSWORD=$MONGO_PASSWORD >> "src/environments/${1}.env"
echo MONGO_PATH=$MONGO_PATH >> "src/environments/${1}.env"
echo MONGO_DATABASE=$MONGO_DATABASE >> "src/environments/${1}.env"
echo JWT_SECRET=$JWT_SECRET >> "src/environments/${1}.env"
echo PORT=$PORT >> "src/environments/${1}.env"
