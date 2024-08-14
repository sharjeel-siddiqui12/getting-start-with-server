import express from 'express';
import path from 'path';
import cors from 'cors'
import mongoose from 'mongoose';

const dbUri =  'mongodb+srv://user123:user123@cluster0.bbbw2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbUri)






const app = express()
app.use(cors())

const port = process.env.PORT || 5001

app.get('/weather', (req, res) => {
  console.log(`${req.ip} is asking for weather`)
  res.send({
    city: "karachi",
    temp_c: 26
  })
})



const __dirname = path.resolve();

app.use('/', express.static(path.join(__dirname, "/web/index.html")))
app.use('/', express.static(path.join(__dirname, "/web")))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
    // process.exit(1);
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////