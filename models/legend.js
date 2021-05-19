const mongoose = require('mongoose');
const comments = require('./comment');

const legendSchema = new mongoose.Schema({
    name: String,
    DOB: String,
    POB: String,
    about: String,
    image: String,
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ]
});

module.exports = mongoose.model('Legend', legendSchema);

legendSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await comments.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})
