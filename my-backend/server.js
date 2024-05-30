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


const ordenSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  cart: [{ name: String, price: Number }]
});
const Orden = mongoose.model('Orden', ordenSchema);

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    }});
const Product = mongoose.model('Product', productSchema);

app.get('/orden', async (req, res) => {
  try {
    const orden = await Orden.find();
    res.json(orden);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


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

// Obtener todos los productos
app.get('/productos', async (req, res) => {
  try {
      const productos = await Product.find();
      res.json(productos);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Crear un nuevo producto
app.post('/productos', async (req, res) => {
  const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: req.body.image
  });

  try {
      const newProduct = await product.save();
      res.status(201).json(newProduct);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});

// Obtener un producto por su ID
app.get('/productos/:id', getProduct, (req, res) => {
  res.json(res.product);
});

// Actualizar un producto por su ID
app.patch('/productos/:id', getProduct, async (req, res) => {
  if (req.body.name != null) {
      res.product.name = req.body.name;
  }
  if (req.body.description != null) {
      res.product.description = req.body.description;
  }
  if (req.body.price != null) {
      res.product.price = req.body.price;
  }
  if (req.body.image != null) {
      res.product.image = req.body.image;
  }
  try {
      const updatedProduct = await res.product.save();
      res.json(updatedProduct);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});

// Eliminar un producto por su ID
app.delete('/productos/:id', getProduct, async (req, res) => {
  try {
      await res.product.remove();
      res.json({ message: 'Producto eliminado' });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Middleware para obtener un producto por su ID
async function getProduct(req, res, next) {
  let product;
  try {
      product = await Product.findById(req.params.id);
      if (product == null) {
          return res.status(404).json({ message: 'No se encontró el producto' });
      }
  } catch (err) {
      return res.status(500).json({ message: err.message });
  }

  res.product = product;
  next();
}


app.get('/', (req, res) => {
    res.send('¡Bienvenido a la página principal!');
  });
  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
