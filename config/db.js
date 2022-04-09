const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://'+process.env.DB_USER_PASS+'@varus.vs4ug.mongodb.net/mern-projetct',
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    /*useCreateIndex: true,
    useFindAndModify: false,*/
}
)
.then(()=>console.log('connected to Mongodb'))
.catch((err)=>console.log('Failed to connect to Mongodb', err));
