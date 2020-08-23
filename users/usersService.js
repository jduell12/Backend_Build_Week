module.exports = {
  userValid,
  loginValid,
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
