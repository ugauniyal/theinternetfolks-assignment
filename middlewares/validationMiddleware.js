const Validator = require('validatorjs');

const validateSignUp = (req, res, next) => {
  const data = req.body;

  const rules = {
    name: 'required|string|max:64',
    email: 'required|string|email|max:128',
    password: 'required|string|max:64',
  };

  const validation = new Validator(data, rules);
  if (validation.fails()) {
    return res.status(400).json({ errors: validation.errors.all() });
  }

  next();
};

const validateSignIn = (req, res, next) => {
  const data = req.body;

  const rules = {
    email: 'required|string|email|max:128',
    password: 'required|string|max:64',
  };

  const validation = new Validator(data, rules);
  if (validation.fails()) {
    return res.status(400).json({ errors: validation.errors.all() });
  }

  next();
};

module.exports = { validateSignUp, validateSignIn };
