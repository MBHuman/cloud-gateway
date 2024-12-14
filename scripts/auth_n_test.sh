#!/bin/bash

# Получение userId
AUTH_S=http://localhost:3001
R_S=http://localhost:3002

LP=$(curl -X POST $AUTH_S/auth/login -d '{"username": "john", "password": "changeme"}' -H "Content-Type: application/json")
AT=$(echo $LP | jq '.accessToken' | tr -d '"')
RT=$(echo $LP | jq '.refreshToken' | tr -d '"')
PROFILE=$(curl -X GET $AUTH_S/auth/profile -H "Authorization: Bearer $AT")

echo "Access Token: $AT"
echo "Refresh Token: $RT"
echo $PROFILE

USER_ID=$(echo $PROFILE | jq '.userId' | tr -d '"')

# Добавление ресурсов

ADD_RES=$(curl -X POST "$AUTH_S/auth/users/$USER_ID/resources" -d '{"resource": "custom_res"}' -H "Authorization: Bearer $AT" -H "Content-Type: application/json")
echo $ADD_RES

AVAL_RES=$(curl -X GET "$AUTH_S/auth/users/$USER_ID/resources" -H "Authorization: Bearer $AT")
echo $AVAL_RES

RM_RES=$(curl -X POST "$AUTH_S/auth/users/$USER_ID/resources/remove" -d '{"resource": "custom_res"}' -H "Authorization: Bearer $AT" -H "Content-Type: application/json")
echo $RM

AVAL_RES=$(curl -X GET "$AUTH_S/auth/users/$USER_ID/resources" -H "Authorization: Bearer $AT")
echo $AVAL_RES
