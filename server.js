const express = require("express");
const mongoose = require("mongoose");
const app = express();

const PORT = 8000;

const uri = "mongodb+srv://trinpasith:qbULMQUIvxqkq1Sr@projcluster.tdl1p.mongodb.net/?retryWrites=true&w=majority&appName=ProjCluster";


// app.set('port', process.env.PORT || 8000);

//Basic routes
app.use(express.static('public'));

app.get('/', (req,res) => {
   res.status(200).send("success!");
});

app.get('/about',(req,res)=>{
   res.send('About page');
});

//Express error handling middleware
app.use((req,res)=>{
   res.type('text/plain');
   res.status(505);
   res.send('Error page');
});

//Binding to a port
app.listen(3000, ()=>{
  console.log('Express server started at port 3000');
});

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Successful connection to Mongo");
    } catch (error) {
        console.log(error);
    }
}

connect();

app.listen(PORT, () => console.log(`Server started on ${PORT}`));