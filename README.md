# Cloud Gateway

Использует микросервисный подход на [NestJS](https://nestjs.com/) с использованием транспорта на [RMQ](https://www.rabbitmq.com/)

## Топология

```mermaid
graph LR
    
    A[auth]
    RC[route-checker]
    R[router]

    R <--> RMQ[RabbitMQ]
    A <--> RMQ
    RC <--> RMQ

    R -.-> RC
    RC -.-> A

    U[User] --Добавление доступов пользователю--> A
    U[User] --Удаление доступов у пользователя--> A
    U[User] --Авторизация--> A
    U[User] --Рефреш токена--> A

    U --Добавление редиректов--> R
    U --Удаление редиректов--> R
    U --Все запросы--> R

    S1[Service A]
    S2[Service B]
    SN[Service N]

    R --redirect--> S1 
    R --redirect--> S2 
    R --redirect--> SN 

```

## Для тестирования

1. Апи с добавлением ресурсов в `auth` сервисе находятся в [скрипте](./scripts/auth_n_test.sh)
2. Весь трафик идёт через `router` сервиc
3. Авторизация идёт через `auth` сервис 
4. `route-checker` - промежуточный сервис


### Запуск

Перед запуском локально устанвливаем модули в корневой папке


```bash
npm i
```

Чтобы протестировать сервисы без docker-compose можно запускать их в dev режиме через

```bash
npm run start:dev
```

> Чтобы работало взаимодействие надо запустить брокер:

```bash
docker run -d \
  --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=user \
  -e RABBITMQ_DEFAULT_PASS=password \
  rabbitmq:3-management
```

- `5672` - порт для AMQP
- `15672` - дашборд по запросам RMQ


## Запуск

Для запуска всех сервисов в [папке](./deploy/local_cluster/) можно запустить

```bash
docker compose up -d
```