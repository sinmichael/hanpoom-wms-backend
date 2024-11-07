# Hanpoom Warehouse Management System API README

## Description

This backend is built using [NestJS](https://github.com/nestjs/nest), a progressive Node.js framework that provides a robust structure for building efficient, reliable, and scalable server-side applications, which under the hood runs on Express. I chose NestJS for its powerful modular architecture, built-in support for TypeScript, and extensive ecosystem of libraries and tools. It allows for better organization of code and enhances productivity by promoting best practices.

## Prerequisites
Make sure you have the following installed:

- Node.js (version 14.x or later)
- npm (Node package manager)
- MySQL (make sure it’s running and accessible)

## Getting started

### Install the dependencies

```bash
$ npm install
```

### Starting the server

Make sure to configure your MySQL connection settings in the environment variables. Refer to the .env.example file for guidance.

Development
```bash
$ npm run start:dev
```

Production mode
```bash
$ npm run start:prod
```

### Run Migrations
An SQL file dump is included: `dump-hanpoom_warehouse-202411071303.sql`. You can use this file to set up the database schema manually.

## API Documentation

Once the server is started, the API documentation is generated using Swagger.

The API documentation is generated using Swagger. You can access it at:

- [Swagger UI](http://localhost:3000/api/docs#/)

You can also import the [Swagger JSON](http://localhost:3000/api/docs-json) format directly into **Postman** for easy testing and exploration of the API.

### Endpoints

#### GET /picking-slips

Retrieve a paginated list of picking slips.

#### Parameters

- `limit` (query, optional, number): The number of items to retrieve per page.
  - Default: 10
  - Example: 10

- `page` (query, optional, number): The page number to retrieve.
  - Default: 1
  - Example: 1

- `status` (query, optional, string): The status of the picking slip.
  - Example: "printed"
  - Enum: ["not printed", "printed", "held"]

#### Responses

- `200 OK`: Successfully retrieved the list of picking slips.

## Key Dependencies
Here are some of the important dependencies used in this project:

- NestJS Core Modules: `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
- Database Support: `@nestjs/typeorm`, `mysql2`, `typeorm`
- Validation and Transformation: `class-validator`
- Documentation: `@nestjs/swagger`, `swagger-ui-express`

## To-Do
- Use `github.com/ppetzold/nestjs-paginate` for pagination for cleaner code