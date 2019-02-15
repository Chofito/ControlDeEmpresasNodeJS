'use strict'

let jwt = require('jwt-simple');
let moment = require('moment');
const secret = 'holaaaaaaaaaaaadasd';

exports.ensureAuth = function(req, res, next) {
    if(!req.headers.authorization) return res.status(400).send({message: 'Bad request, check the headers.'});

    let token = req.headers.authorization.replace(/[""]+/g, '');
    let payload = null;

    try {
        payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix()) return res.status(403).send({message: 'The token has expired, please login and get a new token.'});
    } catch (error) {
        return res.status(403).send({message: 'Bad token, please verify your token or get a new one.'})
    }

    req.user = payload;

    next();
};