document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('add-product-form');
    const productList = document.getElementById('product-list');

    // Función para obtener los productos y mostrarlos en la lista
    async function fetchProductos() {
        try {
            const response = await fetch('http://localhost:3000/productos');
            const productos = await response.json();
            displayProductos(productos);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    }

    // Función para mostrar los productos en la lista
    function displayProductos(productos) {
        productList.innerHTML = '';
        productos.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <p><strong>Nombre:</strong> ${product.name}</p>
                <p><strong>Descripción:</strong> ${product.description}</p>
                <p><strong>Precio:</strong> ${product.price}</p>
                <p><strong>Imagen:</strong> <img src="${product.image}" alt="${product.name}" width="50"></p>
                <p><strong>Stock:</strong> ${product.stock}</p>
                <button class="edit-button" data-id="${product._id}">Editar</button>
                <button class="delete-button" data-id="${product._id}">Eliminar</button>
            `;
            productList.appendChild(productItem);
        });

        // Agregar eventos a los botones de editar y eliminar
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', handleEdit);
        });
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    }

    // Función para manejar la adición de un nuevo producto
    addProductForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(addProductForm);
        const productData = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: formData.get('price'),
            image: formData.get('image'),
            stock: formData.get('stock')
        };

        try {
            const response = await fetch('http://localhost:3000/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
            const newProduct = await response.json();
            addProductForm.reset();
            fetchProductos();
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    });

    // Función para manejar la edición de un producto
    async function handleEdit(event) {
        const productId = event.target.getAttribute('data-id');
        const productItem = event.target.parentElement;

        const name = prompt('Nuevo nombre:', productItem.querySelector('p:nth-child(1)').textContent.split(': ')[1]);
        const description = prompt('Nueva descripción:', productItem.querySelector('p:nth-child(2)').textContent.split(': ')[1]);
        const price = prompt('Nuevo precio:', productItem.querySelector('p:nth-child(3)').textContent.split(': ')[1]);
        const image = prompt('Nueva URL de imagen:', productItem.querySelector('p:nth-child(4) img').getAttribute('src'));
        const stock = prompt('Nueva cantidad en inventario:', productItem.querySelector('p:nth-child(5)').textContent.split(': ')[1]);

        const productData = { name, description, price, image, stock };

        try {
            await fetch(`http://localhost:3000/productos/${productId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
            fetchProductos();
        } catch (error) {
            console.error('Error al editar el producto:', error);
        }
    }

    // Función para manejar la eliminación de un producto
    async function handleDelete(event) {
        const productId = event.target.getAttribute('data-id');

        try {
            await fetch(`http://localhost:3000/productos/${productId}`, {
                method: 'DELETE'
            });
            fetchProductos();
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    }

    // Obtener y mostrar los productos al cargar la página
    fetchProductos();
});

