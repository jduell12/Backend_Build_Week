module.exports = {
  userValid,
  loginValid,
  classValid,
};

//checks that a username and password is provided
function userValid(user) {
  return Boolean(user.username && user.password);
}

//checks that login is valid
function loginValid(user) {
  return Boolean(
    user.username && user.password && typeof user.password === "string",
  );
}

//checks that the class has all required fields
function classValid(classInfo) {
  return Boolean(classInfo.name);
}
