#!/bin/bash

# Создать секреты
echo "your_redis_password" | docker secret create redis_password -
echo "user" | docker secret create rabbitmq_user -
echo "password" | docker secret create rabbitmq_password -
echo "your_jwt_secret" | docker secret create jwt_secret -
