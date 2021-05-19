const User = require('../models/user');

module.exports.registerForm = (req, res)=> {
    res.render('users/register');
}

module.exports.registerUser = async(req, res, next) => {
    try{
        const {username, password, email} = req.body;
        const user = new User({username, email});
        const regUser = await User.register(user, password);
        req.logIn(regUser, err =>{
            if(err) return next(err);
            console.log(req.user);
            req.flash('success', `Welcome Onboard ${req.user.username} `);
            return res.redirect('/legends');
        })
        
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register')
    }

}

module.exports.loginForm = (req, res) => {
    res.render('users/login')
}

module.exports.loginUser = (req, res) => {
    const redirectUrl = req.session.returnTo || '/legends';
    delete req.session.returnTo;
    req.flash('success', `Welcome Back ${req.user.username}`);
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('warning', 'Hope You will come back soon');
    res.redirect('/legends');
}

