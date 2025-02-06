# Timeless advisor API

## Table of Contents

- [Introduction](#introduction)
- [Instalation](#installation)
- [Usage](#usage)
- [Authentication and Authorization](#authentication-and-authorization)
- [Api end points](#api-end-points)
- [Testing](#testing)
- [Future features](#future-features)

## Introduction

 Welcome to Learnify! Your goal is to answer multiple-choice questions correctly and use the clues you gather to solve the final mystery.

## Installation

- Run `npm install`
- Create a `.env`file with the following environment variables
  - PORT - This will be the port the api will be listening to
  - DB_URL - Used to connect to the production database
- Initialize and populate database with `npm run setup-db`

## Usage

- In production environment run `node index.js`
- In development environments
  - run `npm run dev` to use nodemon
  - run `npm run test` to run tests, refer to [test setup](#testing) for more information

## Authentication and Authorization

This api uses `jwt tokens` to authenticate and authorize requests.

    A jwt token should be sent in the authorization header of all requests to routes marked as restricted

The `authenticator` middleware in the middleware stack of any route that requires `authentication`, this includes when accessing `users` accounts to play the game.

## API end points

| Routes                | Method | Body                            | Restricted      | Response                                                           |
| --------------------- | ------ | --------------------------------| --------------- | ------------------------------------------------------------------------- |
| `/users/register` | `POST`  | `Body` |             
| `/users/login`       | `POST` | `Body` |
| `/users/currentq`        | `GET` | `Body`| `Required`|
| `/users/update-points`    | `POST` | `Body`| `Required`|                                
| `/users/reset-points`    | `POST` | `Body`| `Required`|


## Testing

The api contains both unit and integration testing.

To setup testing follow the following steps:

- Run `npm run setup-test-db` 
- Run `npm run test` 
- Run `npm run coverage`

## Future Features

- Teachers Dashboard