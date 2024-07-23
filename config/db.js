const mongoose = require('mongoose')

const connectDb = async() => {
    try {
        const conn =  await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDb:', conn.connection.host)

    }catch(error) {
        console.error( `Failed to connect to MongoDB: ${error.message}`)
        process.exit(1)
    }
}

module.exports = connectDb