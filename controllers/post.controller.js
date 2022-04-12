const UserModel = require('../models/user.model');
const PostModel = require('../models/post.model');
const ObjectId = require('mongoose').Types.ObjectId;



module.exports.readPost = (req,res)=>{
    PostModel.find((err,docs)=>{
        if(!err) res.send(docs);
        else console.log('Error to get data: '+err);
    }).sort({createdAt:-1})
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

module.exports.likePost = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      await PostModel.findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { likers: req.body.id },
        },
        { new: true })
        .then((data) => res.send(data))
        .catch((err) => res.status(500).send({ message: err }));
  
      await UserModel.findByIdAndUpdate(
        req.body.id,
        {
          $addToSet: { likes: req.params.id },
        },
        { new: true })
              .then((data) => res.send(data))
              .catch((err) => res.status(500).send({ message: err }));
      } catch (err) {
        return console.log({err});
      }
  };
  
  module.exports.unlikePost = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      await PostModel.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { likers: req.body.id },
        },
        { new: true })
              .then((data) => res.send(data))
              .catch((err) => res.status(500).send({ message: err }));
  
      await UserModel.findByIdAndUpdate(
        req.body.id,
        {
          $pull: { likes: req.params.id },
        },
        { new: true })
              .then((data) => res.send(data))
              .catch((err) => res.status(500).send({ message: err }));
      } catch (err) {
        return console.log({err});
      }
  };

  module.exports.commentPost = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      return PostModel.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            comments: {
              commenterId: req.body.commenterId,
              commenterPseudo: req.body.commenterPseudo,
              text: req.body.text,
              timestamp: new Date().getTime(),
            },
          },
        },
        { new: true })
              .then((data) => res.send(data))
              .catch((err) => res.status(500).send({ message: err }));
      } catch (err) {
          return res.status(400).send(err);
      }
  };
  
  module.exports.editCommentPost = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      return PostModel.findById(req.params.id, (err, docs) => {
        const theComment = docs.comments.find((comment) =>
          comment._id.equals(req.body.commentId)
        );
  
        if (!theComment) return res.status(404).send("Comment not found");
        theComment.text = req.body.text;
  
        return docs.save((err) => {
          if (!err) return res.status(200).send(docs);
          return res.status(500).send(err);
        });
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  };
  
  module.exports.deleteCommentPost = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      return PostModel.findByIdAndUpdate(
        req.params.id,
        {
          $pull: {
            comments: {
              _id: req.body.commentId,
            },
          },
        },
        { new: true })
              .then((data) => res.send(data))
              .catch((err) => res.status(500).send({ message: err }));
      } catch (err) {
          return res.status(400).send(err);
      }
  };
  

