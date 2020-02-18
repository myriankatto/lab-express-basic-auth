'use strict';

const { Router } = require('express');
const router = new Router();

const routeGuard = require('./../middleware/route-guard');

const User = require('./../models/user');

router.get('/', (req, res) => {
  res.render('index', { title: 'Hello World!' });
});

router.get('/main', routeGuard, (req, res) => {
  res.render('authentication/main');
});

router.get('/private', routeGuard, (req, res) => {
  res.render('authentication/private');
});

router.get('/:id/edit', routeGuard, (req, res, next) => {
  const id = req.params.id;

  User.findById(id)
    .then(user => {
      res.render('authentication/user-edit', { user });
    })
    .catch(error => {
      next(error);
    });
});

router.post('/:id/edit', routeGuard, (req, res, next) => {
  const id = req.params.id;
  const data = {
    username: req.body.username
  };

  User.findByIdAndUpdate(id, data)
    .then(() => {
      res.redirect(`/`);
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:id', routeGuard, (req, res, next) => {
  const id = req.params.id;

  User.findById(id)
    .then(user => {
      console.log(User);
      res.render('authentication/user', { user });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
