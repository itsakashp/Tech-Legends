if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const legendRoutes = require('./routes/legends');
const commentRoutes = require('./routes/comments');
const session = require('express-session');
const flash = require('connect-flash');
const userRoutes = require('./routes/users');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user');
const helmet = require('helmet')
const mongoStore = require('connect-mongo');


const app = express();

//mongoose connection
const dburl = process.env.MONGO_URL || 'mongodb://localhost:27017/techLegends';
mongoose.connect(dburl, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify:false,
})
.then(() => {
    console.log('Connected to mongo');
})
.catch(err => {
    console.log('oh no error', err);
})

//session configuration
const store = mongoStore.create({
    mongoUrl:dburl,
    secret:process.env.SESSION_SECRET,
    touchAfter:24*60*60
})

const sessionOptions = {
    store,
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        httpOnly:true,
    }

}

//middleware

app.use(session(sessionOptions));
app.use(flash());
app.use(helmet({
    contentSecurityPolicy:false,
}))
app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.warning = req.flash('warning');
    next();
})

app.use('/legends', legendRoutes);
app.use('/', commentRoutes);
app.use('/', userRoutes);

//routes


app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found', 404));
})

app.use((err, req, res, next) => {
    const {status = 401} = err;
    if(!err.message) err.message="Something's not good";
    res.status(status).render('error', {err});
})

app.listen(4000, ()=> {
    console.log('listening on 4000*');
})