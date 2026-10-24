# Travlr Getaways – CS-465 Full Stack Development I

A MEAN stack web app with an Express/Handlebars customer site and an Angular admin SPA secured with JWT authentication.

## Architecture

The customer site began as static HTML served by Express, then was refactored into Handlebars templates that render data on the server, with JavaScript for small client-side behavior. The admin side is an Angular SPA that loads once and updates views by calling the REST API, which feels faster but needs more setup. MongoDB was used because its JSON-like documents map directly to JavaScript objects, its flexible schema evolves easily, and it scales well.

## Functionality

JavaScript is a programming language; JSON is a text data format based on its object syntax that holds only data, not logic. JSON connects the stack: MongoDB stores it, the API sends it, and both frontends consume it. I refactored static pages into templates and partials, moved trip data from hard-coded HTML to JSON to MongoDB, and split the admin UI into Angular components with a shared data service. Reusable UI components reduce duplication, keep the design consistent, and make changes and testing easier.

## Testing

Methods (GET, POST, PUT, DELETE) define the action, and endpoints like `/api/trips` and `/api/trips/:tripCode` define the resource. I tested them with Postman for correct status codes and JSON. Security adds a layer: passwords are hashed, `/api/login` issues a JWT, and routes that change data require that token. Testing meant logging in first, sending the token on protected requests, and confirming requests without a valid token return a 401.

## Reflection

This course took me through building a complete, secured full stack application. I learned to connect the MEAN stack, build and test a REST API, model data with Mongoose, build Angular components and services, and implement JWT authentication. These skills make me a stronger candidate for software engineering roles and build on the tools I already create at work.
