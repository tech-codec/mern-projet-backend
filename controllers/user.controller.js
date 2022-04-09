const UserModel = require('../models/user.model');
const ObjectId = require('mongoose').Types.ObjectId;


module.exports.getAllUsers = async(req,res)=>{
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.userInfo = async(req,res)=>{
    console.log(req.params);
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send('Id unknow: ' +req.params.id);
        UserModel.findById(req.params.id, (err,docs)=>{
        if(!err) res.send(docs);
        else console.log('Id unKnow: '+err);
    }).select('-password');
}

module.exports.updateUser= async(req,res)=>{
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send('Id unknow: ' +req.params.id);
    try{
        await UserModel.findOneAndUpdate(
            {_id: req.params.id},
            {
                $set:{
                    bio: req.body.bio
                }
            },
            {new:true,upsert:true,setDefaultsOnInsert:true},
        )
        .then((data) => res.send(data))
        .catch((err) => res.status(500).send({ message: err }));
    }  catch(err){
        return console.log({message:err});
    }  
}


module.exports.deleteUser= async(req,res)=>{
    if(!ObjectId.isValid(req.params.id))
        return res.status(400).send('Id unknow: ' +req.params.id);
    try{
        await UserModel.remove({_id:req.params.id}).exec();
        res.status(200).json({message:"Succesfuly deleted."});
    }catch(err){
        return res.status(500).json({err});
    }    
}

module.exports.follow = async(req,res)=>{
    if(!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.idToFollow))
        return res.status(400).send('Id unknow: ' +req.params.id);
        try{

            // add to the follower list
            console.log('cool les gars');
            await UserModel.findByIdAndUpdate(
                req.params.id,
                {$addToSet:{following:req.body.idToFollow}},
                {new:true,upsert:true},
            )
            .then((data)=>res.send(data))
            .catch((err)=>res.status(500).send({message:err}));

            // add to following list
            await UserModel.findByIdAndUpdate(
                req.body.idToFollow,
                {$addToSet:{followers:req.params.id}},
                {new:true, upsert:true},
            )
            .then((data)=>res.send(data))
            .catch((err)=>res.status(500).send({message:err}));
        }catch(err){
            return console.log({err});
        }        
}

module.exports.unfollow = async(req,res)=>{
    if(!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.idToUnFollow))
        return res.status(400).send('Id unknow: ' +req.params.id);
        try{

            // remove to the follower list
            console.log('cool les gars');
            await UserModel.findByIdAndUpdate(
                req.params.id,
                {$pull:{following:req.body.idToUnFollow}},
                {new:true,upsert:true},
            )
            .then((data)=>res.send(data))
            .catch((err)=>res.status(500).send({message:err}));

            // remove to following list
            await UserModel.findByIdAndUpdate(
                req.body.idToUnFollow,
                {$pull:{followers:req.params.id}},
                {new:true, upsert:true},
            )
            .then((data)=>res.send(data))
            .catch((err)=>res.status(500).send({message:err}));
        }catch(err){
            return console.log({err});
        }            
}
