const authorization = (role) => {
  return (req, res, next) => {
    if (role.includes(req.body.role)) {
      next();
    } else {
      res.send("not authorized");
    }
  };
};

module.exports = { authorization };
