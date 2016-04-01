module.exports = function (Donor) {
  Donor.beforeRemote('create', function (context, donor, next) {
    console.log('Saving new donor with name: ', context.req.body.name);
    // TODO  map the userID and roleID in the RoleMapping POST API call

    next();
  });
};
