'use strict'

let jwt = require('jwt-simple');
let moment = require('moment');
const secret = 'holaaaaaaaaaaaadasd';

exports.createToken = function(user) {
    let payload = {
        sub: user._id,
        name: user.name,
        email: user.email,
        user: user.user,
        role: user.role,
        iat: moment.unix(),
        exp: moment().day(30, 'days').unix()
    };

    return jwt.encode(payload, secret);
}