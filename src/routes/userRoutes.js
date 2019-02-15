'use strict'

let express = require('express');
let userController = require('../controllers/userController');
let companyController = require('../controllers/companyController');
let md_auth = require('../middlewares/authentication');

let api = express.Router();
api.post('/login', userController.login);

// CRUD Usuarios - Solo los usuarios pueden editar y eliminar su perfil, administradores tienen control absoluto
api.post('/newUser', md_auth.ensureAuth, userController.newUser); // OK
api.post('/editUser/:id', md_auth.ensureAuth, userController.editUser); // OK
api.delete('/deleteUser/:id', md_auth.ensureAuth, userController.deleteUser); // OK
api.get('/listUsers', md_auth.ensureAuth, userController.listUsers); // OK
api.post('/searchUser', md_auth.ensureAuth, userController.searchUser); // OK

// CRUD Empresas - Solo administradores a excepcion de listCompanies
api.post('/newCompany', md_auth.ensureAuth, companyController.newCompany); // OK
api.post('/editCompany/:id', md_auth.ensureAuth, companyController.editCompany); // OK
api.delete('/deleteCompany/:id', md_auth.ensureAuth, companyController.deleteCompany); // OK
api.get('/listCompanies', companyController.listCompanies); // OK
api.post('/searchCompany', md_auth.ensureAuth, companyController.searchCompany); // OK

module.exports = api;