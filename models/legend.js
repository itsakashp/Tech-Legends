const mongoose = require('mongoose');
const comments = require('./comment');

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
});


const legendSchema = new mongoose.Schema({
    name: String,
    DOB: String,
    POB: String,
    about: String,
    images: [ImageSchema],
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

legendSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await comments.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model('Legend', legendSchema);


