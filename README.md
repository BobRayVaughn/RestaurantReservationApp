# Capstone: Restaurant Reservation System

[Deployed Application](https://brv-restresapp.herokuapp.com/dashboard)

## Installation

1. Run npm install to install project dependencies.
2. Run npm run start:dev to start the server in development mode.
3. Run the full test suite with npm run test.
4. To run frontend and backend tests separately run npm run test:frontend or npm run test:backend

Use `npm start` to run the application.<br/>
For back-end: `npm run start:backend`<br/>
For front-end `npm run start:frontend`


## What Does It Do?
This app is intended for any businesses that take reservations. <br/>
•Allows users to create, edit, and delete reservations. <br/>
•Allows for users to create tables. <br/>
•Reservations can be sat at the tables and finished when they are done. <br/>
•Allows for users to search for existing reservations by phone number. <br/>
•Each reservation displays first and last name, mobile number, date, time, and capacity of reservation

## API Documentation
| API Path | Method(s)<br/> |
|-------|--------|
| /reservations	|GET: List all reservations<br/>
| /reservations	|POST: Create a new reservation.<br/>
| /reservations/?date='YYYY-MM-DD'	|GET: List all reservations by date.<br/>
| /reservations/:reservation_id	|GET: Read a single reservation by 'reservation_id'.<br/>
| /reservations/:reservation_id	|PUT: Update a reservation by 'reservation_id'.<br/>
| /reservations/:reservation_id	|DELETE: Delete a reservation by 'reservation_id'.<br/>
| /reservations/:reservation_id/status	|PUT: Update a reservation's status. Options being "booked", "seated", or "finished".<br/>
| /tables	|GET: List all tables.<br/>
| /tables	|POST: Create a new table.<br/>
| /tables/:table_id	|GET: Read a single table by 'table_id'.<br/>
| /tables/:table_id	|DELETE: Delete a table by 'table_id'.<br/>
| /tables/:table_id/seat	|PUT: Update a table's status to "occupied".<br/>
| /tables/:table_id/seat	|DELETE: Update a table's status to "free".<br/>

## Tech Stack

# Backend

Express<br/>
JavaScript<br/>
Knex<br/>
Node.js<br/>

# Frontend

CSS<br/>
HTML<br/>
JavaScript<br/>
React<br/>
Bootstrap<br/>

# Database

PostgreSQL<br/>
Heroku<br/>