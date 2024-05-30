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

// Esquema y modelo para ordenes
const ordenSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  cart: [{ 
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String, 
    price: Number 
  }]
});
const Orden = mongoose.model('Orden', ordenSchema);

// Esquema y modelo para productos
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
  },
  stock: {
    type: Number,
    required: true
  }
});
const Product = mongoose.model('Product', productSchema);

// Ruta para obtener todas las ordenes
app.get('/orden', async (req, res) => {
  try {
    const orden = await Orden.find();
    res.json(orden);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para crear una nueva orden
app.post('/orden', async (req, res) => {
  try {
    const { name, phone, address, cart } = req.body; // Desestructurar datos del formulario y carrito

    // Mapear el carrito para que incluya el ID del producto
    const updatedCart = await Promise.all(cart.map(async (item) => {
      const product = await Product.findOne({ name: item.name }); // Buscar el producto por su nombre
      return { productId: product._id, name: item.name, price: item.price };
    }));

    const newOrder = new Orden({ name, phone, address, cart: updatedCart }); // Crear nueva orden con carrito actualizado
    await newOrder.save(); // Guardar la nueva orden en la base de datos

    // Actualizar la cantidad en stock de cada producto en el carrito
    for (const item of updatedCart) {
      await updateStock(item.productId, -1); // Restar 1 a la cantidad en stock
    }

    res.status(201).json(newOrder); // Enviar respuesta con la nueva orden creada
  } catch (error) {
    res.status(500).json({ message: error.message }); // Enviar respuesta de error si ocurre algún problema
  }
});

// Ruta para obtener todos los productos
app.get('/productos', async (req, res) => {
  try {
    const productos = await Product.find();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para crear un nuevo producto
app.post('/productos', async (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
    stock: req.body.stock
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Ruta para obtener un producto por su ID
app.get('/productos/:id', getProduct, (req, res) => {
  res.json(res.product);
});

// Ruta para actualizar un producto por su ID
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
  if (req.body.stock != null) {
    res.product.stock = req.body.stock;
  }
  try {
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Ruta para eliminar un producto por su ID
app.delete('/productos/:id', getProduct, async (req, res) => {
  try {
    await Product.deleteOne({ _id: res.product._id }); // Utilizar deleteOne para eliminar el producto por su ID
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

  // Verificar si el producto es un modelo de Mongoose
  if (!(product instanceof Product)) {
    return res.status(500).json({ message: 'El objeto recuperado no es un producto válido' });
  }

  res.product = product;
  next();
}

// Función para actualizar la cantidad en stock de un producto
async function updateStock(productId, quantity) {
  try {
    console.log('Actualizando stock para el producto con ID:', productId);
    console.log('Cantidad a restar:', quantity);

    const product = await Product.findById(productId);
    if (product) {
      product.stock += quantity;
      await product.save();
      console.log('Stock actualizado correctamente:', product);
    } else {
      console.log('Producto no encontrado');
    }
  } catch (error) {
    console.error('Error al actualizar el stock del producto:', error);
  }
}


// Ruta principal
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la página principal!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
