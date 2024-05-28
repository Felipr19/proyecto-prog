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
const ordenSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
});

// Define a model
const Orden = mongoose.model('Orden', ordenSchema);

// Routes
app.get('/orden', async (req, res) => {
    console.log('solicitud recibida en /orden')
  try {
    const orden = await Orden.find();
    res.json(orden);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para manejar solicitudes POST a /items
app.post('/orden', async (req, res) => {
    try {
      const newItemData = req.body; // Datos del nuevo elemento enviados en el cuerpo de la solicitud
      console.log(newItemData); // Este es el console.log que mencionas
      const newItem = await Orden.create(newItemData); // Crear un nuevo elemento en la base de datos
      await newItem.save(); // Save the new item to the database
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
