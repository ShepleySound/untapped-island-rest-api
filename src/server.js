'use strict';

require('dotenv').config();
const express = require('express');

// CUSTOM MIDDLEWARE
const authSignin = require('./router/authCreate/indexRoutes');
const authCards = require('./router/cards/cardRoutes');
const authUser = require('./router/users/userRoutes');
const authPortfolio = require('./router/portfolio/portfolioRoutes');
const serverError = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');

// DATABASE FUNCTIONS

// INSTANTIATE EXPRESS AND CORS
const app = express();
const cors = require('cors');

// USE MIDDLEWARE IN ALL ROUTES
app.use(cors());
app.use(express.json());


app.get('/', (req, res, next) => {
  res.status(200).send('Welcome to Untapped Island!')
})

// signup/signin route from router->authCreate
app.use(authSignin);
// cards route from router->cards
app.use(authCards)
// User-Portfolio route from router->portfolioRoutes
app.use(authPortfolio);
// routes to user from router->userRoutes:
app.use(authUser);
// Catch all routes
app.use(serverError);
app.use(notFound);

module.exports = {
 start:(PORT) => app.listen(PORT, console.log('Server has started on: ', PORT)),
 app
}
