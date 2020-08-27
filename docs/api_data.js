define({ "api": [
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./docs/main.js",
    "group": "/Users/jess/Desktop/Lambda/bw-betterProf/apiDocs/docs/main.js",
    "groupTitle": "/Users/jess/Desktop/Lambda/bw-betterProf/apiDocs/docs/main.js",
    "name": ""
  },
  {
    "type": "post",
    "url": "/auth/login",
    "title": "Login a user",
    "group": "Auth",
    "name": "Login",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "username",
            "description": "<p>string</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "password",
            "description": "<p>string</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "201",
            "description": "<p>Json web token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "HTTP/1.1 201 ok\n{\n  \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1lcnJ5IiwiaWF0IjoxNTk4MzkxNDc5LCJleHAiOjE1OTgzOTUwNzl9.N2fRATukOGX1lmiC9nlUZUegWnQ5ro0cuBWSpURbg_c\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 406 BAD REQUEST\n{\n  \"message\": \"Please provide a username and password\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./auth/auth-router.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/register",
    "title": "Add a new user",
    "group": "Auth",
    "name": "Register",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "username",
            "description": "<p>string</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "password",
            "description": "<p>string</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "201",
            "description": "<p>Json web token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "HTTP/1.1 201 ok\n{\n  \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1lcnJ5IiwiaWF0IjoxNTk4MzkxNDc5LCJleHAiOjE1OTgzOTUwNzl9.N2fRATukOGX1lmiC9nlUZUegWnQ5ro0cuBWSpURbg_c\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 406 BAD REQUEST\n{\n  \"message\": \"Please provide a username and password\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./auth/auth-router.js",
    "groupTitle": "Auth"
  },
  {
    "type": "delete",
    "url": "/classes/:classId/tasks/:taskId",
    "title": "Deletes a task of a particular class",
    "group": "Class_Tasks",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "HTTP 200 ok\n{\n  \"message\": \"Class deleted Successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "classId",
            "description": "<p>Taken from url</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 406 Not Acceptable\n{\n  \"message\": \"Class with that id doesn't exist\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./classes/classesRouter.js",
    "groupTitle": "Class_Tasks",
    "name": "DeleteClassesClassidTasksTaskid"
  },
  {
    "type": "get",
    "url": "/classes/:classId/tasks",
    "title": "Get task list for particular class",
    "group": "Class_Tasks",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "data",
            "description": "<p>Task objects</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "HTTP 200 ok\n{\n  \"data\": [\n      {\n         \"task\": 'A task to do',\n         \"id: 1\n      }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "classId",
            "description": "<p>Taken from url</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 406 Not Acceptable\n{\n  \"data\": []\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./classes/classesRouter.js",
    "groupTitle": "Class_Tasks",
    "name": "GetClassesClassidTasks"
  },
  {
    "type": "post",
    "url": "/classes/:classId/tasks",
    "title": "Adds a task to a particular class",
    "group": "Class_Tasks",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "HTTP 200 ok\n{\n  data: { task: \"to do\", id: 1 },\n      { task: \"to do3\", id: 3 },\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "classId",
            "description": "<p>Taken from url</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 406 Not Acceptable\n{\n  \"message\": \"No class with that id exists\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP 406 Not Acceptable\n{\n  \"message\": \"Please provide a name and due date for the task\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./classes/classesRouter.js",
    "groupTitle": "Class_Tasks",
    "name": "PostClassesClassidTasks"
  },
  {
    "type": "put",
    "url": "/classes/:classId/tasks",
    "title": "Edits the information for a task in a particular class",
    "group": "Class_Tasks",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "HTTP 200 ok\n{\n  \"message\": \"Success\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "classId",
            "description": "<p>Taken from url</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 406 Not Acceptable\n{\n  \"message\": \"Please provide a name and due date for the task\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./classes/classesRouter.js",
    "groupTitle": "Class_Tasks",
    "name": "PutClassesClassidTasks"
  },
  {
    "type": "delete",
    "url": "/classes/:classId",
    "title": "Deletes a class",
    "group": "Classes",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "HTTP 200 ok\n{\n  \"message\": \"Class deleted Successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "classId",
            "description": "<p>Taken from url</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 406 Not Acceptable\n{\n  \"message\": \"Class with that id doesn't exist\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./classes/classesRouter.js",
    "groupTitle": "Classes",
    "name": "DeleteClassesClassid"
  },
  {
    "type": "get",
    "url": "/classes",
    "title": "Get class list of current user",
    "group": "Classes",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "data",
            "description": "<p>Class objects</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "HTTP 200 ok\n{\n  \"data\": [\n      {\n          \"name\": \"Math\",\n          \"id\": 2\n      }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 406 Not Acceptable\n{\n  \"message\": \"Please enter all required fields to add the class.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./classes/classesRouter.js",
    "groupTitle": "Classes",
    "name": "GetClasses"
  },
  {
    "type": "get",
    "url": "/classes/:classId",
    "title": "Get student list for particular class",
    "group": "Classes",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "data",
            "description": "<p>Student objects</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "HTTP 200 ok\n{\n  \"data\": [\n      {\n          \"name\": \"Neo\",\n          \"id\": 1,\n          \"class\": \"Computer Science\",\n          \"class_id\": 1\n      }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "classId",
            "description": "<p>Taken from url</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 406 Not Acceptable\n{\n  \"data\": []\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./classes/classesRouter.js",
    "groupTitle": "Classes",
    "name": "GetClassesClassid"
  },
  {
    "type": "put",
    "url": "/classes/:classId",
    "title": "Edits the information for a class",
    "group": "Classes",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "HTTP 200 ok\n{\n  \"message\": \"Success\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "classId",
            "description": "<p>Taken from url</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 406 Not Acceptable\n{\n  \"message\": \"Please provide a name for the class\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./classes/classesRouter.js",
    "groupTitle": "Classes",
    "name": "PutClassesClassid"
  },
  {
    "type": "delete",
    "url": "/students/:studentId/tasks/:taskId",
    "title": "Deletes a particular task for a particular student",
    "group": "Student_Tasks",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "studentId",
            "description": "<p>integer taken from url</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "taskId",
            "description": "<p>integer taken from url</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "HTTP 200 ok\n{\n  \"message\": \"Deleted task Successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 406 Not Acceptable\n{\n  \"message\": \"That task doesn't belong to that student\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./students/studentsRouter.js",
    "groupTitle": "Student_Tasks",
    "name": "DeleteStudentsStudentidTasksTaskid"
  },
  {
    "type": "get",
    "url": "/students/:studentId/tasks",
    "title": "Get task list for particular student",
    "group": "Student_Tasks",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "data",
            "description": "<p>Task objects</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "    HTTP 200 ok\n    {\n    \"data\": [\n        {\n            \"id\": 1,\n            \"name\": \"Determine a thesis\",\n            \"description\": \"Pick a topic to research\",\n            \"due_date\": \"Sep 1, 2020\",\n            \"completed\": 0\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "studentId",
            "description": "<p>integer taken from url</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 406 Not Acceptable\n{\n  data: []\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./students/studentsRouter.js",
    "groupTitle": "Student_Tasks",
    "name": "GetStudentsStudentidTasks"
  },
  {
    "type": "post",
    "url": "/students/:studentId/tasks",
    "title": "Adds a task for a particular student",
    "group": "Student_Tasks",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "HTTP 200 ok\n{\n  \"message\": \"Added a task\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "studentId",
            "description": "<p>integer taken from url</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 406 Not Acceptable\n{\n  \"message\": \"Please supply all required fields to add a task\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./students/studentsRouter.js",
    "groupTitle": "Student_Tasks",
    "name": "PostStudentsStudentidTasks"
  },
  {
    "type": "put",
    "url": "/students/:studentId/tasks/:taskId",
    "title": "Edits a particular task for a particular student",
    "group": "Student_Tasks",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "studentId",
            "description": "<p>integer taken from url</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "taskId",
            "description": "<p>integer taken from url</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "HTTP 200 ok\n{\n  \"message\": \"Edited task successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 406 Not Acceptable\n{\n  \"message\": \"Please provide information for the task\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./students/studentsRouter.js",
    "groupTitle": "Student_Tasks",
    "name": "PutStudentsStudentidTasksTaskid"
  },
  {
    "type": "delete",
    "url": "/users",
    "title": "Deletes the user",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "userId",
            "description": "<p>integer taken from url</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "HTTP 200 OK\n{\n  \"message\": \"Deleted user Successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 406 Not Acceptable\n{\n  \"message\": \"A user with that id doesn't exist\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./users/usersRouter.js",
    "groupTitle": "Users",
    "name": "DeleteUsers"
  },
  {
    "type": "delete",
    "url": "/users/students/:studentId",
    "title": "Delete a student in the user's student list",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "studentId",
            "description": "<p>integer taken from url</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "HTTP 200 OK\n{\n  \"message\": \"Deleted student Successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 406 Not Acceptable\n{\n  \"message\": \"A student with that id doesn't exist\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./users/usersRouter.js",
    "groupTitle": "Users",
    "name": "DeleteUsersStudentsStudentid"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "Get student list of current user",
    "group": "Users",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "data",
            "description": "<p>Student objects</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "HTTP 200 ok\n{\n   \"data\": [\n    {\n        \"id\": 1,\n        \"username\": \"morpheous\",\n        \"password\": \"pass\",\n        \"class_id\": 1\n    },\n    {\n        \"id\": 3,\n        \"username\": \"sammy\",\n        \"password\": \"$2a$12$O1HL5IgglOwnkrLElF7rguxCIx3BeY2uDsUQJT.Vnr.9L/DMRMgBO\",\n        \"class_id\": 1\n    },\n    {\n        \"id\": 4,\n        \"username\": \"merry\",\n        \"password\": \"$2a$08$pC/D/yh8pICeEozfWRW2weJlp.tREqKNbGd8uoS7QJ7in4Y6ZGniy\",\n        \"class_id\": 1\n    },\n    {\n        \"id\": 5,\n        \"username\": \"merryPippin\",\n        \"password\": \"$2a$08$TjS.2aIuu0.eOjcxCvWhwewoPAPiJq9.IkU7hzjAtpVXoYkPvyRe6\",\n        \"class_id\": 1\n    }\n]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 500 INTERNAL SERVER ERROR\n{\n  \"error\": \"error message goes here\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./users/usersRouter.js",
    "groupTitle": "Users",
    "name": "GetUsers"
  },
  {
    "type": "post",
    "url": "/users/classes",
    "title": "Add a class that the user is teaching",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "name",
            "description": "<p>string</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "HTTP 201 Created\n{\n  \"message\": \"Success\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 406 Not Acceptable\n{\n  \"message\": \"Please enter all required fields to add the class.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./users/usersRouter.js",
    "groupTitle": "Users",
    "name": "PostUsersClasses"
  },
  {
    "type": "post",
    "url": "/users/students",
    "title": "Add a student to the user's student list",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "name",
            "description": "<p>string</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "class_id",
            "description": "<p>integer</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "HTTP 201 Created\n{\n  \"message\": \"Success\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 406 Not Acceptable\n{\n  \"message\": \"Please enter all required fields to add the student.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./users/usersRouter.js",
    "groupTitle": "Users",
    "name": "PostUsersStudents"
  },
  {
    "type": "put",
    "url": "/users/students/:studentId",
    "title": "Edit a student in the user's student list",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "name",
            "description": "<p>string</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "class_id",
            "description": "<p>integer Class id of new class</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "prevClassId",
            "description": "<p>integer Class id of current class - used when changing students to a different class in conjunction with class_id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: ",
          "content": "HTTP 200 OK\n{\n  \"message\": \"Edited student successfully\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 406 Not Acceptable\n{\n   \"message\": \"Please provide a name for the student or the current class id and previous class id\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./users/usersRouter.js",
    "groupTitle": "Users",
    "name": "PutUsersStudentsStudentid"
  }
] });
