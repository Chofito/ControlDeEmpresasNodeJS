'use strict'

let company = require('../models/company');

function newCompany(req, res) {
    if (req.user.role == 'ROLE_ADMIN') {
        let tempCompany = new company(req.body);
        let errValidation = tempCompany.validateSync();

        if (!errValidation) {
            company.findOne({ name: tempCompany.name }, (err, matchComp) => {
                if(err) return res.status(500).send({ message: 'Internal error in "find" method, try later.' });
                if(matchComp) return res.status(402).send({ message: 'Thre is already a company with that name.' });
                
                tempCompany.save((err, companySaved) => {
                    if(err) return res.status(500).send({message: 'Internal error, try later.', err});
                    if(!companySaved) return res.status(400).send({message: 'Error while the server was trying to save the company.'})
                
                    return res.status(400).send({company: companySaved});
                });
            });
        } else {
            return res.status(502).send({message: 'verify the next fields.', fields: errValidation.message});
        }
    } else {
        return res.status(402).send({ message: 'You dont\'t have the permisions to create a company.' });
    }
}

function editCompany(req, res) {
    var companyId = req.params.id;
    var body = req.body;

    if (req.user.role == 'ROLE_ADMIN') {
        company.findOne({ name: body.name }, (err, comp) => {
            if(err) return res.status(500).send({ message: 'Internal error, try later.' });
            if(comp) return res.status(500).send({ message: 'There is already a company with that name' });

            company.findByIdAndUpdate(companyId, body, {new: true}, (err, companyUpdated) => {
                if(err) return res.status(500).send({ message: 'Internal error with "findByIdAndUpdate", try later.' });
                if(!companyUpdated) res.status(500).send({ message: 'The ID that you sent doesn\'t exists.' });
    
                return res.status(200).send({ company: companyUpdated });
            });
        });
    } else {
        return res.status(402).send({ message: 'You don\'t have enough permissions to do this'});
    }
}

function deleteCompany(req, res) {
    var companyId = req.params.id;
    var body = req.body;

    if (req.user.role == 'ROLE_ADMIN') {
        company.findByIdAndRemove(companyId, (err, companyDeleted) => {
            if(err) return res.status(500).send({ message: 'Internal error with "findByIdAndUpdate", try later.' });
            if(!companyDeleted) res.status(500).send({ message: 'The ID that you sent doesn\'t exists.' });

            return res.status(200).send({ company: companyDeleted });
        });
    } else {
        return res.status(402).send({ message: 'You don\'t have enough permissions to do this.'});
    }
}

function listCompanies(req, res) {
    company.find({}, (err, companies) => {
        if(err) return res.status(500).send({message: 'Internal error, try later.'});

        return res.status(200).send({companies});
    });
}

function searchCompany(req, res) {
    let term = req.body.search;
    company.find({name: new RegExp('.*'+term+'*.', "i")}, (err, companies) => {
        if(err) return res.status(500).send({ message: 'Internal error with "find", try later.' });

        if (companies) {
            return res.status(200).send({companies});
        } else {
            return res.status(200).send({ message: 'No campany was found with ' + term });
        }
        
    });
}

module.exports = {
    newCompany,
    editCompany,
    deleteCompany,
    listCompanies,
    searchCompany
};