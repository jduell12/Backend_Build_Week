BASE_URL: https://better-professor-build-week.herokuapp.com/

- All authorized endpoints must have authorization through JWT - created upon registering
- All data received from API are on res.body.data
  - arrays of data
- All messages from API are on res.body.message
  - messages regarding successful edits/deletes

## GET requests

- get student list of user ordered by classes
  - BASE_URL/users
- get user's list of classes
  - BASE_URL/classes
- get list of students in a particular class
  - BASE_URL/classes/:classId
- get task list for a particular student
  - BASE_URL/students/:studentId/tasks

## POST requests

- add a new user and returns a JWT token
  - BASE_URL/auth/register
- logs in in a user and returns a JWT token
  - BASE_URL/auth/login
- add a new class to the user's class list
  - BASE_URL/users/classes
- add a student to the user's student list
  - BASE_URL/users/students
- add a task to a particular student
  - BASE_URL/students/:studentId/tasks

## PUT requests

- edit information for a class
  - BASE_URL/classes/:classId
- edit information for a student
  - BASE_URL/users/students/:studentId
- edit a task for a particular student
  - BASE_URL/students/:studentId/tasks/:taskId

## DELETE requests

- deletes the user logged in
  - BASE_URL/users
- deletes a class
  - BASE_URL/classes/:classId
- deletes a student
  - BASE_URL/users/students/:studentId
- deletes a task from a particular student
  - BASE_URL/students/:studentId/tasks/:taskId
