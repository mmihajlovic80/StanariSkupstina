//bodyParser
let bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
// Za svaku rutu koju zelimo da je user autentikovan koristi se 'ensureAuthenticated' kao middleware
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
// Load user model
const User = require('../models/users');


require('../config/passport')(passport); // Local strategy za autorizacuju korisnika.

//model
mongoose = require('mongoose');
mongoose.connect('mongodb+srv://bgajic:KafanaZirafa1!@cluster0-xsmc3.mongodb.net/BazaDB?retryWrites=true', { useNewUrlParser: true });

var korisnik = "Miroslav";

var Podaci = new mongoose.Schema({
    poruka: String,
    vreme: {
        type: Date,
        default: Date.now
    },
    korisnik:{
        type: String,
        default: korisnik
    } 
});


var Todo = mongoose.model('Todo', Podaci);

//parsiranje dolaznog toka kroz body url parser
//var urlencodedParser = bodyParser.urlencoded({ extended: false });
//menjamo sa bazom

module.exports = (app) => {

    app.use(bodyParser.json({limit: "50mb"})); // Limit samo zbog prevelikih fajlova, npr ako neko reši da upl video
    app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

    // Express Session Middleware
    app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // Express Messages Middleware
    app.use(flash());

    // Global vars
    app.use(function (req, res, next) {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error'); // na loginu kada su pogresni podaci
        next();
    });

    // Express Validator Middleware
    app.use(expressValidator({
        errorFormatter: function(param, msg, value) {
            let namespace = param.split('.')
                , root    = namespace.shift()
                , formParam = root;

            while(namespace.length) {
                formParam += '[' + namespace.shift() + ']';
            }
            return {
                param : formParam,
                msg   : msg,
                value : value
            };
        }
    }));

    /* GET ZAHTEV*/

    app.get('/', function (req, res) {
        let pageTitle = 'Todos. BRE!';
        res.render('index', {
            title:pageTitle,
        });
    });

    app.get('/login', function (req, res) {
        let pageTitle = 'Login page';
        res.render('login', {
            title:pageTitle,
        });
    });

    app.get('/todo', ensureAuthenticated,  (req, res) => {
        const korisnik = req.user.first_name; //= "Cile" //req.user.first_name; //kako uvezati sa input poljem kako bi ispisivalo ime user-a koji je logovan

        

    //DOHVATANJE PODATAKA i prikaz na view
        Todo.find({}, function(err, data) {
            if (err) throw err;
            res.render('todo', { podaci: data });
        }).sort({vreme:-1});
    });

    /*POST ZAHTEV */
    app.post('/todo', (req, res) => {

    //PREUZIMANJE PODATAKA SA VIEW-A I DODAVANJE U DB
        var newTodo = Todo(req.body).save(function(err) {
            if (err) throw err;
        });
    });

    /*BRISANJE PODATAKA IZ DB */
    app.delete('/todo/:poruka', (req, res) => {
        Todo.find({ poruka: req.params.poruka.replace(/\-/g, " ") }).deleteOne(function(err, data) {
            //umesto deleteOne mozemo da koristimo i remove
            if (err) throw err;
            res.json(data);
        });
    });

    // Register Proccess
    app.post('/register', (req, res) => {

        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const email = req.body.email;
        const password = req.body.password;
        const password2 = req.body.password2;

        req.checkBody('first_name', 'First name is required').notEmpty();
        req.checkBody('last_name', 'Last name is required').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

        let errorsArray = [];

        if(!first_name || !last_name || !email || !password ){
            errorsArray.push({msg:'Please fill in all fields'});
        }

        if(password !== password2){
            errorsArray.push({msg: 'Passwords do not match'});
        }

        //Check pass length
        if(password.length < 6 ){
            errorsArray.push({msg: 'Password must be at least 6 characters'})
        }

        if(errorsArray.length > 0){
            res.render('index', {
                title:'Todos. BRE!',
                errorsArray,
                first_name,
                last_name,
                email,
                password,
                password2,
            });

        }else{

            User.findOne({email: email })
                .then(user => {
                    if(user){
                        //User exists
                        errorsArray.push({msg: "User already registered!"});
                        res.render('index', {
                            errorsArray,
                            first_name,
                            last_name,
                            email,
                            password,
                            password2
                        });

                    }else{

                        let newUser = new User({
                            first_name:first_name,
                            last_name:last_name,
                            email:email,
                            password:password,
                        });

                        bcrypt.genSalt(10, function(err, salt){
                            bcrypt.hash(newUser.password, salt, function(err, hash){
                                if(err){
                                    console.log(err);
                                }
                                newUser.password = hash;
                                newUser.save(function(err, user){
                                    if(err){
                                        console.log(err);
                                        return;
                                    } else {

                                        //new register user data
                                        let userId = user._id;
                                        req.flash('success_msg','You are now registered and can log in');
                                        res.redirect('/login');
                                    }
                                });
                            });
                        });
                    }
                });
           }
    });

    // Ovako mozemo da uradimo DEBUG ako login ne radi......
    
    /*
    app.post('/login', (req, res, next) => {
        console.log(req.url);
        passport.authenticate('local', function(err, user, info) {
            console.log("authenticate");
            console.log(err);
            console.log(user);
            console.log(info);
        })(req, res, next);
    });
 */

//Login handler
    app.post('/login', (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/todo',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
    });


    // Logout
    app.get('/logout', (req, res) => {
        req.logout();
        req.flash('success_msg', 'You are logged out');
        res.redirect('/login');
    });


}