const Legend = require('./models/legend');
const Comment = require('./models/comment');
const {legendSchema} = require('./schemas');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be Logged in First');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const{id} = req.params;
    const legend = await Legend.findById(id);
    if(!legend.author.equals(req.user._id)){
        req.flash('error', 'You do not have Permission to do that');
       return res.redirect(`/legends/${id}`);
    }
    next();
}

module.exports.isCommentAuthor = async(req, res, next) => {
    const{lid,cid} = req.params;
    const comment = await Comment.findById(cid);
    if(!comment.author.equals(req.user._id)){
        req.flash('error', 'You do not have Permission to do that');
       return res.redirect(`/legends/${lid}`);
    }
    next();
}

module.exports.validateLegend = (req, res, next) => {
    console.log(req.files);
    const {error} = legendSchema.validate(req.body);
    if(error){
        throw new ExpressError(error.details[0].message, 400);
    }
    else{
        next();
    }
}