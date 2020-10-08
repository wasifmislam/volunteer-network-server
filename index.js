const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.faeh0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


console.log(process.env.DB_USER)

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000;






const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

   const voluntaryWorks = client.db("volunteerNetwork").collection("registrations");
   console.log('datbase connected')
   app.post('/addVoluntaryWorks', (req, res) => {
    const voluntaryWork = req.body;
    console.log(voluntaryWork)
     voluntaryWorks.insertMany(voluntaryWork)
     .then((result, err) => {
          console.log('Result', result)
          console.log(err)
         console.log(result.insertedCount);
         res.send(result.insertedCount)
    })
   })
    app.get('/voluntaryWork', (req, res) => {
        voluntaryWorks.find({}).limit(20)
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

  const registrations = client.db("volunteerNetwork").collection("registrationsUsers");
 
  
  app.post('/addRegistration', (req, res) => {
      const newRegistration = req.body;
      console.log(newRegistration);
      registrations.insertOne(newRegistration)
      .then(result => {
          console.log(result)
          res.send(result.insertedCount > 0);
      })
      console.log(newRegistration);

  })

  app.get('/registrations', (req, res) =>{
      //console.log(req.query.email)
      //console.log(req.params.volType)
      registrations.find(req.params.volType)
      .toArray((err, documents)=> {
          res.send(documents);
      })
  })
});



app.get('/', (req, res) => {
  res.send('Hello World!!!')
})

app.listen(port)