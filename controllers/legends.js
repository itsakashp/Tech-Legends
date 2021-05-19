const Legend = require('../models/legend');

module.exports.index = async(req, res) => {
    const legends = await Legend.find({});
    res.render('legends/index', {legends});
}

module.exports.renderNewForm = (req, res) => {
    res.render('legends/new');
}

module.exports.details = async(req, res) => {
    const legend = await Legend.findById(req.params.id).populate({
        path:'comments',
        populate:{
            path:'author'
        }
    }).populate('author');
    if(!legend){
        req.flash('error', "Couldn't Find The Legend");
        res.redirect('/legends')
    }
    else{
    res.render('legends/details', {legend});
    }
}

module.exports.createNewLegend = async(req, res) => {
    const legend = new Legend(req.body);
    legend.author = req.user;
    await legend.save();
    req.flash('success', 'Successfully Created the Legend');
    res.redirect(`/legends/${legend._id}`);
}

module.exports.renderEditForm = async(req, res) => {
    const {id} = req.params;
    const legend = await Legend.findById(id);
    if(!legend){
        req.flash('error', "Couldn't Find The Legend");
        res.redirect('/legends');
    }
    else{
        res.render('legends/edit', {legend});
    }
    
}

module.exports.editLegend = async(req, res) => {
    const id = req.params.id;
    await Legend.findByIdAndUpdate(id, req.body);
    req.flash('success', 'Successfully Updated The Legend');
    res.redirect(`/legends/${id}`);
}

module.exports.deleteLegend = async(req, res) => {
    const {id} = req.params;
    await Legend.findByIdAndDelete(id);
    req.flash('warning', 'Deleted the Legend')
    res.redirect('/legends');
}
