require('dotenv').config();
const mongoose=require('mongoose');

const connectToMongoDB = async () => {
    console.log(process.env.MONGO_URI)
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,  
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}




module.exports = {connectToMongoDB};


