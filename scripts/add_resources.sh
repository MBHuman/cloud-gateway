#!/bin/bash

AUTH_S=http://localhost:3001
R_S=http://localhost:3002

LP=$(curl -X POST $AUTH_S/auth/login -d '{"username": "john", "password": "changeme"}' -H "Content-Type: application/json")
AT=$(echo $LP | jq '.accessToken' | tr -d '"')
RT=$(echo $LP | jq '.refreshToken' | tr -d '"')
PROFILE=$(curl -X GET $AUTH_S/auth/profile -H "Authorization: Bearer $AT")

echo "Access Token: $AT"
echo $PROFILE

USER_ID=$(echo $PROFILE | jq -r '.userId')
echo "user_id: $USER_ID"

curl -X POST $R_S/routes -H "Authorization: Bearer $AT" -H "Content-Type: application/json" -d '{"resourceId": "resource-x", "internalUrl": "http://resource-x:3000"}'
curl -X POST $R_S/routes -H "Authorization: Bearer $AT" -H "Content-Type: application/json" -d '{"resourceId": "nginx", "internalUrl": "http://nginx:80"}'

ADD_RES=$(curl -X POST "$AUTH_S/auth/users/$USER_ID/resources" -d '{"resource": "resource-x"}' -H "Authorization: Bearer $AT" -H "Content-Type: application/json")
echo $ADD_RES

echo "$AUTH_S/auth/users/$USER_ID/resources"

AVAL_RES=$(curl -X GET "$AUTH_S/auth/users/$USER_ID/resources" -H "Authorization: Bearer $AT")
echo $AVAL_RES


curl -X GET $R_S/resource-x/some-resource \
    -H "Authorization: Bearer $AT"

curl -X GET $R_S/nginx \
    -H "Authorization: Bearer $AT"

echo "$AUTH_S/auth/users/$USER_ID/resources"

ADD_RES=$(curl -X POST "$AUTH_S/auth/users/$USER_ID/resources" -d '{"resource": "nginx"}' -H "Authorization: Bearer $AT" -H "Content-Type: application/json")
echo $ADD_RES

curl -X GET $R_S/nginx \
    -H "Authorization: Bearer $AT"