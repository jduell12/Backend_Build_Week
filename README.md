# Backend

## Database

- Development and testing are in sqlite3
- Production is can use either sqlite3 or postgresSQL
  - Will be using postgresSQL on production for better user experience
- Allows storage of information for the application
  - list of users (targeting professors)
  - list of students
  - list of classes the users are teaching
  - list of tasks each student has and their deadline
- Use relational database for the information storage
- Use Jest for unit testing the database methods used in API

## API

- Use JWT (Json web token) for authentication
- Created endpoints to the specification of the front-end engineers
  - get student list for each professor (aka user)
  - get student list for a particular class
  - get individual student's taks list
  - be able to create, edit and delete user, students, tasks and classes
