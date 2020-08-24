module.exports = {
  validClass,
};

//checks that all required fields for a class are provdied
function validClass(classInfo) {
  return Boolean(classInfo.name);
}
