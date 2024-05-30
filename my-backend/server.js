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
  cart: [{ name: String, price: Number }]
});

// Define a model
const Orden = mongoose.model('Orden', ordenSchema);

// Routes
app.get('/orden', async (req, res) => {
  try {
    const orden = await Orden.find();
    res.json(orden);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para manejar solicitudes POST a /orden
app.post('/orden', async (req, res) => {
  try {
      const { name, phone, address, cart } = req.body; // Desestructurar datos del formulario y carrito
      const newOrder = new Orden({ name, phone, address, cart }); // Crear nueva orden con carrito incluido
      await newOrder.save(); // Guardar la nueva orden en la base de datos
      res.status(201).json(newOrder); // Enviar respuesta con la nueva orden creada
  } catch (error) {
      res.status(500).json({ message: error.message }); // Enviar respuesta de error si ocurre algún problema
  }
});
  

app.get('/', (req, res) => {
    res.send('¡Bienvenido a la página principal!');
  });
  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
