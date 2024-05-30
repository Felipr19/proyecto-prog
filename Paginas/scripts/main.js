document.addEventListener('DOMContentLoaded', () => {
    // Carrito de Compras
    let cart = [];

    function addToCart(productId, productName, productPrice) {
        try {
            cart.push({ id: productId, name: productName, price: productPrice });
            updateCartList();
        } catch (error) {
            console.error('Error al añadir al carrito:', error);
            alert('Hubo un error al añadir el producto al carrito');
        }
    }    

    function updateCartList() {
        try {
            const cartItems = document.getElementById('cart-items');
            cartItems.innerHTML = '';
            cart.forEach((item, index) => {
                const li = document.createElement('li');
                li.innerHTML = `${item.name} - $${item.price.toFixed(2)} <button onclick="removeFromCart(${index})">Eliminar</button>`;
                cartItems.appendChild(li);
            });
            console.log('Carrito:', cart);
        } catch (error) {
            console.error('Error al actualizar la lista del carrito:', error);
            alert('Hubo un error al actualizar la lista del carrito');
        }
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartList();
    }

    window.removeFromCart = removeFromCart;

    try {
        const cartButton = document.getElementById('cart-button');
        cartButton.addEventListener('click', () => {
            try {
                const cartList = document.getElementById('cart-list');
                cartList.style.display = (cartList.style.display === 'none' || cartList.style.display === '') ? 'block' : 'none';
            } catch (error) {
                console.error('Error al mostrar/ocultar el carrito:', error);
                alert('Hubo un error al mostrar/ocultar el carrito');
            }
        });

        const orderButton = document.getElementById('order-button');
        orderButton.addEventListener('click', () => {
            const orderForm = document.getElementById('order-form');
            orderForm.style.display = 'block';
        });
    } catch (error) {
        console.error('Error al inicializar el botón del carrito:', error);
        alert('Hubo un error al inicializar el botón del carrito');
    }

    // Hacer que addToCart esté disponible globalmente
    window.addToCart = addToCart;

    // Formulario de Contacto
    const contactForm = document.querySelector('#contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.querySelector('#name').value;
            const phone = document.querySelector('#phone').value;
            const address = document.querySelector('#address').value;

            // Añadir carrito de compras al formulario de datos
            const formData = { name, phone, address, cart };

            try {
                const response = await fetch('http://localhost:3000/orden', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }

                const newOrden = await response.json();
                console.log('Nuevo elemento añadido:', newOrden);
                alert('Elemento añadido con éxito');

                // Oculta el formulario después de enviarlo
                const orderForm = document.getElementById('order-form');
                orderForm.style.display = 'none';
                document.getElementById('name').value = ''; // Restablecer el valor del campo nombre a vacío
                document.getElementById('phone').value = ''; // Restablecer el valor del campo teléfono a vacío
                document.getElementById('address').value = ''; // Restablecer el valor del campo dirección a vacío
                const cartList = document.getElementById('cart-list')
                cartList.style.display = 'none'
                cart = []
                updateCartList()
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un error al añadir el elemento');
            }
        });
    }

    async function fetchProductos() {
        try {
            const response = await fetch('http://localhost:3000/productos');
            if (!response.ok) {
                throw new Error('Error al obtener los productos');
            }
            const productos = await response.json();
            console.log('Productos obtenidos:', productos);
            displayProductos(productos);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    }

    function displayProductos(productos) {
        const catalogContainer = document.getElementById('productos');
        catalogContainer.innerHTML = ''; // Limpiar el contenedor antes de renderizar los productos
        productos.forEach(producto => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
    
            const productImage = document.createElement('img');
            productImage.src = producto.image;
            productImage.alt = producto.name;
    
            const productName = document.createElement('h2');
            productName.textContent = producto.name;
    
            const productDescription = document.createElement('p');
            productDescription.textContent = producto.description;
    
            const productPrice = document.createElement('p');
            productPrice.textContent = `$${producto.price.toFixed(2)}`;
    
            const productAvailability = document.createElement('p'); // Elemento para mostrar la disponibilidad
            productAvailability.textContent = (producto.stock <= 0) ? 'No disponible' : 'Disponible'; // Condicional para mostrar disponibilidad
    
            const addToCartButton = document.createElement('button');
            addToCartButton.textContent = 'Añadir al carrito';
            addToCartButton.disabled = (producto.stock <= 0); // Deshabilitar el botón si no hay stock
            addToCartButton.addEventListener('click', () => addToCart(producto._id, producto.name, producto.price));
    
            productCard.appendChild(productImage);
            productCard.appendChild(productName);
            productCard.appendChild(productDescription);
            productCard.appendChild(productPrice);
            productCard.appendChild(productAvailability); // Agregar la disponibilidad al card del producto
            productCard.appendChild(addToCartButton);
    
            catalogContainer.appendChild(productCard);
        });
    }
    
    function closeOrderForm() {
        const orderForm = document.getElementById('order-form');
        orderForm.style.display = 'none';
    }

    window.closeOrderForm = closeOrderForm;

    fetchProductos();
});
