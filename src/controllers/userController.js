'use strict'

let bcrypt = require('bcrypt-node'),
    user = require('../models/user'),
    tokens = require('../services/tokens');

function login(req, res) {
    let params = req.body;
    let $email = params.email;
    let password = params.password;

    user.findOne({email: $email}, (err, $user) => {
        if(err) return res.status(500).send({message: 'Internal error, try later.', error: err});
        if(!$user) return res.status(401).send({message: 'Login error, check your email and password.'});

        bcrypt.compare(password, $user.password, (err, check) => {
            if(err) return res.status(500).send({message: 'Internal error, try later.'})
            if(!check) return res.status(401).send({message: 'Login error, check your email and password.'});

            $user.password = undefined;
            return res.status(200).send({user: $user, token: tokens.createToken($user)});
        });
    });
}

function newUser(req, res) {
    let params = req.body;
    let tempUser = new user(params);
    let errValidation = tempUser.validateSync();
    tempUser.role = 'ROLE_CLIENT';

    if (req.user.role == 'ROLE_ADMIN') {
        if (!errValidation) {
            user.find({ $or: [
                {email: params.email},
                {usuario: params.user},
            ]}).exec((err, users) => {
                if(err) return res.status(500).send({message: 'Internal error, try later.', err});
                if(users && users.length > 0) return res.status(404).send({message: 'The email or user already exists.'});
                bcrypt.hash(tempUser.password, null, null, (err, hash) => {
                    if(err) return res.status(500).send({message: 'Internal error, try later.', err});

                    tempUser.password = hash;
                    tempUser.save((err, userSaved) => {
                        if(err) return res.status(500).send({message: 'Internal error, try later.', err});
                        if(!userSaved) return res.status(400).send({message: 'Error while the server was trying to save the user.'})
                    
                        return res.status(400).send({user: userSaved});
                    });
                });
            });
        } else {
            
        }
    } else {
        return res.status(402).send({message: 'You dont\' have enought permissions to add a new user.'});
    }

}

function editUser(req, res) {
    var userId = req.params.id;
    var body = req.body;

    delete body.password;

    if (req.user.role == 'ROLE_ADMIN' || req.user.sub == userId) {
        if (!body.role || body.role == 'ROLE_ADMIN' || body.role == 'ROLE_CLIENT') {
            user.findByIdAndUpdate(userId, body, {new: true}, (err, userUpdated) => {
                if(err) return res.status(500).send({ message: 'Internal error with "findByIdAndUpdate", try later.' });
                if(!userUpdated) res.status(500).send({ message: 'The ID that you sent doesn\'t exists.' });
    
                userUpdated.password = null;
                return res.status(200).send({ user: userUpdated });
            });
        } else {
            return res.status(402).send({ message: 'Invalid role'});
        }
    } else {
        return res.status(402).send({ message: 'You don\'t have enough permissions to do this'});
    }
}

function deleteUser(req, res) {
    var userId = req.params.id;
    var body = req.body;

    if (req.user.role == 'ROLE_ADMIN' || req.user.sub == userId) {
        user.findByIdAndRemove(userId, (err, userDeleted) => {
            if(err) return res.status(500).send({ message: 'Internal error with "findByIdAndUpdate", try later.' });
            if(!userDeleted) res.status(500).send({ message: 'The ID that you sent doesn\'t exists.' });

            userDeleted.password = null;
            return res.status(200).send({ user: userDeleted });
        });
    } else {
        return res.status(402).send({ message: 'You don\'t have enough permissions to do this.'});
    }
}

function searchUser(req, res) {
    let term = req.body.search;

    if (req.user.role == 'ROLE_ADMIN') {
        user.find({name: new RegExp('.*'+term+'*.', "i")}, (err, users) => {
            if(err) return res.status(500).send({ message: 'Internal error with "find", try later.' });

            if (users) {
                return res.status(200).send({users});
            } else {
                return res.status(200).send({ message: 'No user was found with ' + term });
            }
        });
    } else {
        return res.status(402).send({ message: 'You don\'t have enough permissions to do this.'});
    }

    
}

function listUsers(req, res) {
    if (req.user.role == 'ROLE_ADMIN') {
        user.find({}, (err, users) => {
            if(err) return res.status(500).send({ message: 'Internal error with "find", try later.' });

            return res.status(200).send({users});
        });
    } else {
        return res.status(403).send({ message: 'You don\'t have enought permissions to see all users.' });
    }
    
}

module.exports = {
    login,
    newUser,
    editUser,
    deleteUser,
    searchUser,
    listUsers
};