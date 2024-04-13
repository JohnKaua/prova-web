require('dotenv').config()
const express  = require('express')
const port = 3000
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const foodSchema = new mongoose.Schema({
    name: String,
    category: String,
    quantity: Number,
    expirationDate: Date,
    price: Number
})

const Food = mongoose.model('Food', foodSchema)

try {
    mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
} catch (error) {
    console.error('Erro de conexão com o MongoDB: ', error)
}

app.get('/api/foods', async (req, res) => {
    const foods = await Food.find();
    res.send(foods);
  });
  
  app.get('/api/foods/:id', async (req, res) => {
    const food = await Food.findById(req.params.id);
    res.send(food);
  });
  
  app.post('/api/foods', async (req, res) => {
    if (!req.body.name || !req.body.category || !req.body.quantity || !req.body.expirationDate || !req.body.price) {
        return res.status(400).send("Todos os campos são obrigatórios.");
    }

    const food = new Food({
        name: req.body.name,
        category: req.body.category,
        quantity: req.body.quantity,
        expirationDate: req.body.expirationDate,
        price: req.body.price
    });

    await food.save()
    res.send(food)
  });
  
  app.put('/api/foods/:id', async (req, res) => {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(food);
  });
  
  app.delete('/api/foods/:id', async (req, res) => {
    const result = await Food.findByIdAndDelete(req.params.id);
    res.send(result);
  });
  
app.listen(port, () =>{
    console.log("Servidor rodando em: http://localhost:"+port)
})