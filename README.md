## Express Payment Gateway Api

### Features

- [x] Auth with JWT and Auth with Role Permission
- [x] Advanced Login And Register
- [x] Refresh Token JWT
- [x] Confirmation Email Activation, Reset Password and more
- [x] Transfer Money To Another Users
- [x] Integration With Docker
- [x] Encryption Password
- [x] Build Automation Using Makefile
- [x] Any More

### Docker Image Registry

```sh
docker pull 705471/express-payment:<tag>
```

### Docker Container

- **express-app** on 3000:3000
- **postgres-db** on 5432:5432
- **postgres-admin** on 8080:80

### Docker Command Makefile

- Docker Compose Up

  ```sh
  make cpup env=dev or make cpup env=prod
  ```

- Docker Compose Down

  ```sh
  make cpdown
  ```

- Dockerfile Build

  ```sh
  make dbd or make dbp
  ```

- Application Running
  ```sh
  make dev or make prod
  ```

### Express Container Default Environment

- ### Production

  - PG_URI=postgres://restuwahyu13:restuwahyu13@db:5432/payment

- ### Development

  - PG_HOST = db
  - PG_USERNAME = restuwahyu13
  - PG_PASSWORD = restuwahyu13
  - PG_DATABASE = payment
  - PG_PORT = 5432

### Postgres Container Default Environment

- POSTGRES_HOST=db
- POSTGRES_USER=restuwahyu13
- POSTGRES_PASSWORD=restuwahyu13
- POSTGRES_DB=payment

### Deploy Docker Container On Heroku

- goto [Clever Cloud](https://www.clever-cloud.com) create your cloud database
- docker build -t restuwahyu13/express-payment .
- heroku container:login
- heroku create **{ website-name }**
- docker tag restuwahyu13/express-payment registry.heroku.com/**{ heroku-website-name }**/web
- docker push {heroku-website-name}
- heroku container:release web -a **{ heroku-website-name }**
- heroku open -a **{ heroku-website-name }**
- heroku logs -a **{ heroku-website-name }** --tail

### Rest API Endpoint

| Name              | Endpoint                         | Method |
| ----------------- | -------------------------------- | ------ |
| **User**          |                                  |        |
| Register          | /api/v1/users/register           | POST   |
| Login             | /api/v1/users/login              | POST   |
| Activation        | /api/v1/users/activation/:id     | GET    |
| Resend            | /api/v1/users/resend-activation  | POST   |
| Forgot            | /api/v1/users/forgot-password    | POST   |
| Reset             | /api/v1/users/reset-password/:id | POST   |
| **admin**         |                                  |        |
| Create            | /api/v1/admins                   | POST   |
| Results           | /api/v1/admins                   | GET    |
| Result            | /api/v1/admins/:id               | GET    |
| Delete            | /api/v1/admins/:id               | DELETE |
| Update            | /api/v1/admins/:id               | PUT    |
| **Topup**         |                                  |        |
| Create            | /api/v1/topups                   | POST   |
| Results           | /api/v1/topups                   | GET    |
| Result            | /api/v1/topups/:id               | GET    |
| Delete            | /api/v1/topups/:id               | DELETE |
| Update            | /api/v1/topups/:id               | PUT    |
| **Withdraw**      |                                  |        |
| Create            | /api/v1/withdraw                 | POST   |
| Results           | /api/v1/withdraw                 | GET    |
| Result            | /api/v1/withdraw/:id             | GET    |
| Delete            | /api/v1/withdraw/:id             | DELETE |
| Update            | /api/v1/withdraw/:id             | PUT    |
| **Transfer**      |                                  |        |
| Create            | /api/v1/transfer                 | POST   |
| Results           | /api/v1/transfer                 | GET    |
| Result            | /api/v1/transfer/:id             | GET    |
| Delete            | /api/v1/transfer/:id             | DELETE |
| Update            | /api/v1/transfer/:id             | PUT    |
| **Saldo**         |                                  |        |
| Create            | /api/v1/saldo                    | POST   |
| Results           | /api/v1/saldo                    | GET    |
| Result            | /api/v1/saldo/:id                | GET    |
| Delete            | /api/v1/saldo/:id                | DELETE |
| Update            | /api/v1/saldo/:id                | PUT    |
| **Refresh Token** |                                  |        |
| Refresh           | /api/v1/refresh-token            | POST   |
