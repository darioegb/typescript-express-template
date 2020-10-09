# Typescript Express template

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=darioegb_typescript-express-template&metric=alert_status)](https://sonarcloud.io/dashboard?id=darioegb_typescript-express-template)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=darioegb_typescript-express-template&metric=bugs)](https://sonarcloud.io/dashboard?id=darioegb_typescript-express-template)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=darioegb_typescript-express-template&metric=code_smells)](https://sonarcloud.io/dashboard?id=darioegb_typescript-express-template)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=darioegb_typescript-express-template&metric=coverage)](https://sonarcloud.io/dashboard?id=darioegb_typescript-express-template)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=darioegb_typescript-express-template&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=darioegb_typescript-express-template)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=darioegb_typescript-express-template&metric=sqale_index)](https://sonarcloud.io/dashboard?id=darioegb_typescript-express-template)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=darioegb_typescript-express-template&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=darioegb_typescript-express-template)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=darioegb_typescript-express-template&metric=ncloc)](https://sonarcloud.io/dashboard?id=darioegb_typescript-express-template)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=darioegb_typescript-express-template&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=darioegb_typescript-express-template)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=darioegb_typescript-express-template&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=darioegb_typescript-express-template)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=darioegb_typescript-express-template&metric=security_rating)](https://sonarcloud.io/dashboard?id=darioegb_typescript-express-template)

## Description

This repository is a NodeJS Express rest api template with jwt authentication, unit test coverage, and mongodb database. It is written in Typescript. Its documentation is made with postman and the collection is at the root of the project. It also has a quality gate with sonarcloud.

## Installation

```bash
npm install
```

### Enviroment file

Create your .env files similar next example for each enviroment that you need. For example it project work with 3 test, dev and prod.
```terminal
<!-- .env.dev -->
MONGO_USER=dbAdmin
MONGO_PASSWORD=password
MONGO_PATH=@localhost:27017
MONGO_DATABASE=mongoose
JWT_SECRET=jwt_secret
PORT=3000
NODE_ENV=dev
```


## Running

```bash
npm run dev
```

## Debbuging

If you use visual code as a code editor, you can use **Node: Nodemon** or **Jest All** settings for debugging when the server is running or when you want to debug test cases respectively.

## Testing

```bash
npm run test
```