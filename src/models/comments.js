const mongoose = require('mongoose')

const CommentSchema = mongoose.Schema({
    commentText :{
        type:String,
        required: true
    } ,
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    }
},{
    timestamps: true,
})

const ProductComment = mongoose.model("ProductComment", CommentSchema);

module.exports = ProductComment;
