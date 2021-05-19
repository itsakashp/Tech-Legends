const Legend = require('../models/legend')
const Comment = require('../models/comment');

module.exports.newComment = async(req, res) => {
    const{id} = req.params;
    console.log(req.body)
    const com = req.body.comment;
    com.author = req.user;
    const legend = await Legend.findById(id);
    const comment = new Comment(com);
    legend.comments.push(comment);
    await comment.save();
    await legend.save();
    res.redirect(`/legends/${id}`);

}

module.exports.deleteComment = async(req, res)=> {
    const{lid, cid} = req.params;
    await Legend.findByIdAndUpdate(lid, {$pull:{comments: cid}});
    await Comment.findByIdAndDelete(cid);
    res.redirect(`/legends/${lid}`);
}