const { connect, set } = require('mongoose');
const MongoDbUrl = 'mongodb+srv://SpecialCodes:fedswjfnwsdefklnejf@cluster1.bfiytf1.mongodb.net/?retryWrites=true&w=majority'

async function connectToDatabase() {
    try {
        await connect(MongoDbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(async (connection) => {
            await console.log(`a7a7 ${connection.connections[0].name}`);
        });
    } catch (error) {
        console.log('a7a4');
        console.error(error);
    }
}



module.exports = connectToDatabase;