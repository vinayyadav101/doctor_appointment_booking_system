import app from './app.js'
import cloudnairyConnection from './config/cloudConfig.js'
import dbConnection from './config/dbConnection.js'
console.log(process.env.PORT);

const port = process.env.PORT || 5000
console.log(port)



app.listen(port , ()=>{
    dbConnection()
    cloudnairyConnection()
     console.log(`srver runing${port}`);
    
})