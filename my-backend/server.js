const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mydatabase', { 
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(error => {
  console.error('Error connecting to MongoDB', error);
});

// Define a schema
const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

// Define a model
const Item = mongoose.model('Item', itemSchema);

// Routes
app.get('/items', async (req, res) => {
    console.log('solicitud recibida en /items')
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para manejar solicitudes POST a /items
app.post('/items', async (req, res) => {
    try {
      const newItemData = req.body; // Datos del nuevo elemento enviados en el cuerpo de la solicitud
      const newItem = await Item.create(newItemData); // Crear un nuevo elemento en la base de datos
      res.status(201).json(newItem); // Enviar una respuesta con el nuevo elemento creado
    } catch (error) {
      res.status(500).json({ message: error.message }); // Enviar una respuesta de error si ocurre algún problema
    }
  });
  

app.get('/', (req, res) => {
    res.send('¡Bienvenido a la página principal!');
  });
  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
