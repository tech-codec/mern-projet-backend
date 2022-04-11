const UserModel = require('../models/user.model');
const PostModel = require('../models/post.model');
const ObjectId = require('mongoose').Types.ObjectId;



module.exports.readPost = (req,res)=>{
    PostModel.find((err,docs)=>{
        if(!err) res.send(docs);
        else console.log('Error to get data: '+err);
    })
}

module.exports.createPost = async (req,res)=>{
    const newPost = new PostModel(
        {
            posterId:req.body.posterId,
            message:req.body.message,
            video:req.body.video,
            likers:[],
            comments:[],
        }
    );

    try{
        const post = await newPost.save();
        return res.status(200).json(post);
    }catch(err){
        return res.status(400).send(err);
    }
}

module.exports.updatePost = (req,res)=>{
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send('Id unknow: ' +req.params.id);
    const updateRecord ={
        message:req.body.message
    }

    PostModel.findByIdAndUpdate(
        req.params.id,
        {
            $set:{
                message:req.body.message
            }
        },
        {new:true},
    )
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err }));
}

module.exports.deletePost = async (req,res)=>{
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send('Id unknow: ' +req.params.id);
    try{
        await PostModel.remove({_id:req.params.id}).exec();
        res.status(200).json({message:"Succesfuly deleted."});
    }catch(err){
        return res.status(500).json({err});
    }    
}

