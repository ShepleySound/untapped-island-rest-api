# Untapped Island REST API

<!-- Enter a description for the repository -->

## [API URL](http://untappedisland-env.eba-rjiv3cm2.us-west-2.elasticbeanstalk.com/)

This repository holds the source code for the Untapped Island REST API. Currently, the API is hosted on AWS using Elastic Beanstalk. The PostgreSQL database is hosted using Amazon RDS.

Sample queries for the API are available in [Postman](https://www.postman.com/grey-moon-312243/workspace/untapped-island-api/overview). Full route documentation is currently in development. Cards can be queried by making a GET request to the `/cards` route.

## Technology / Architecture

The API, built using [Express](https://expressjs.com/), queries a PostgreSQL database using [Prisma Client](https://www.prisma.io/) as the ORM. Auth routes for user sign-up and sign-in are integrated. Password-based authentication is performed with [Bcrypt](https://en.wikipedia.org/wiki/Bcrypt) as the primary password-hashing function. On authentication, a [JWT](https://jwt.io/) is passed to the client for future authentication/authorization purposes. The JWT identifies the user and allows the client to perform API queries with CRUD functionality on the user's unique portfolio.

## What is Untapped Island?

Untapped Island is a work-in-progress web application that allows users to search for Magic: The Gathering cards and add them to a personalized portfolio. 

## Resources

[MTGJSON, an open-source catalog of Magic: The Gathering data](https://mtgjson.com/)
[Inspired by Scryfall](https://scryfall.com/)


## Authors

- Robert Shepley :wave:
- Timothee Odushina
- Junyoung Son
- Daniel Frey
- Keelen Fisher
