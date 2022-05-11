const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

/*module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    console.log(token);
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          // res.cookie("jwt", "", { maxAge: 1 });
          next();
        } else {
          let user = await UserModel.findById(decodedToken.id);
          res.locals.user = user;
          console.log(res.locals.user);
          next();
        }
      });
        /*let payload = jwt.verify(token, process.env.TOKEN_SECRET);
        if (!payload) {
            return res.status(401).send('Unauthorized request');
        }
        req.userId = payload.id;
        console.log("c'est mon "+req.userId);
        next();*/
   /* } else {
        return res.status(401).send('Unauthorized request');
    }
  }*/

  module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          // res.cookie("jwt", "", { maxAge: 1 });
          next();
        } else {
          let user = await UserModel.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  };
  

  module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
        if (err) {
          console.log(err);
          return res.status(401).send('Unauthorized request');
        } else {
          console.log(decodedToken.id);
          next();
        }
      });
    } else {
      return res.status(401).send('Unauthorized request');
    }
  };


  /*module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
        if (err) {
          console.log(err);
          res.send(200).json('no token')
        } else {
          console.log(decodedToken.id);
          next();
        }
      });
    } else {
      console.log('No token');
    }
  };*/

