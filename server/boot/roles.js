module.exports = function (app, cb) {
  // const Role = app.models.Role;
  var Role = app.models.Role;
  Role.create({ name: 'authenticatedDonor' }, cb);
};
