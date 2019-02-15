'use strict'

let mongoose = require('mongoose');
let user = require('./models/user');
let app = require('./app');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/ControlEmpresas2015567', {useNewUrlParser: true}).then(() => {
    console.log('Successful connection to the database');

    app.set('port', process.env.Port || 3000);
    
    app.listen(app.get('port'), () => {
        console.log(`The server is running in the port '${app.get('port')}'`);
    });

    user.findOne({name: 'Rodolfo Robles'}, (err, admin) => {
        if (!admin) {
            let admin = new user();
            admin.name = 'Rodolfo Robles';
            admin.user = 'chofito';
            admin.email = 'rjroblesq@gmail.com';
            admin.password = '$2a$10$WTWnO01NBv7COHIFXjw2H.wwoQhiqjon5LO25b4YHxYkz6DdyUlIC';
            admin.role = 'ROLE_ADMIN'

            admin.save();
        }
    });
}).catch(err => console.log(err));