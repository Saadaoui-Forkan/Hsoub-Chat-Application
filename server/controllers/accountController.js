const createError = require("http-errors");

exports.profile = (req, res, next) => {
  const user = req.user;
  user.name = req.body.name;
  user.about = req.body.about;
  user.avatar = req.file ? req.file.filename : user.avatar;
  user
    .save()
    .then((updated) => {
      sendUpdateUser(updated);
      res.json();
    })
    .catch(next);
};

const sendUpdateUser = (user) => {
  io.emit("update_user", user.getData());
};

