'use strict';

const { Router } = require('express');
const router = new Router();

const bcryptjs = require('bcryptjs');
const User = require('./../models/user');



router.get('/login', (req, res) => {
  res.render('authentication/login');
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  let user;

  User.findOne({ username })
    .then(document => {
      if (!document) {
        next(new Error('USER_NOT_FOUND'));
      } else {
        user = document;
        return bcryptjs.compare(password, document.passwordHash);
      }
    })
    .then(match => {
      if (match) {
        req.session.userId = user._id;
        res.redirect('/');
      } else {
        next(new Error('USER_PASSWORD_WRONG'));
      }
    })
    .catch(error => {
      next(error);
    });
});

router.get('/sign-up', (req, res) => {
  res.render('authentication/sign-up');
});

router.post('/sign-up', (req, res, next) => {
  const { username, password } = req.body;

  bcryptjs
    .hash(password, 10)
    .then(hashPlusSalt => {
      return User.create({
        username,
        passwordHash: hashPlusSalt
      });
    })
    .then(user => {
      req.session.userId = user._id;
      res.redirect('/');
    })
    .catch(error => {
      next(error);
    });
});

router.post('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
