# Hero Hub – Superhero List & Review Platform

Full-stack web app where users can search superheroes, build custom hero lists, rate and review them, and manage policies – with authentication, email verification, and admin tools.

## Tech Stack

- **Frontend:** React, React Router, Axios, CRA
- **Backend:** Node.js, Express, Joi
- **Database:** MongoDB + Mongoose
- **Auth:** JWT with email verification tokens
- **Other:** dotenv, bcryptjs, CORS

## Features

- **User Accounts**
  - Register, log in, log out
  - Password change with verification of current password
  - Email verification flow (`/verify/:token`)

- **Hero Search**
  - Unauthenticated users can:
    - Search superheroes by name, race, publisher, and powers
    - View public hero lists and see hero details (gender, race, publisher, powers)

- **Hero Lists**
  - Authenticated users can:
    - Create/update hero lists (name, description, visibility, heroes)
    - Add reviews (rating 1–10 + optional text)
    - See average rating and reviews for each list

- **Admin Tools**
  - View all users and deactivate accounts
  - Manage policy documents (type + content)
  - Moderate flagged reviews / content on hero lists

## Project Structure

```text
client/         # React SPA (public hero search, login/register, user & admin UIs)
server/         # Express API, database models, auth, and hero list logic
  HeroList.js   # Mongoose schema for hero lists & reviews
  User.js       # Users (roles, email verification, deactivation)
  Policy.js     # Policy documents
  db.js         # MongoDB connection helper
