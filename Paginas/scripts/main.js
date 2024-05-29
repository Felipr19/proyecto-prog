document.addEventListener('DOMContentLoaded', () => {
    // Formulario de Contacto
    const addItemForm = document.querySelector('#addItemForm');

    if (addItemForm) {
        addItemForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.querySelector('#name').value;
            const phone = document.querySelector('#phone').value;
            const address = document.querySelector('#address').value;

            try {
                const response = await fetch('http://localhost:3000/orden', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, phone, address }),
                });

                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }

                const newOrden = await response.json();
                console.log('Nuevo elemento añadido:', newOrden);
                alert('Elemento añadido con éxito');
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un error al añadir el elemento');
            }
        });
    }

    async function fetchItems() {
        try {
            const response = await fetch('http://localhost:3000/orden');
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            const orden = await response.json();
            console.log('Elementos obtenidos:', orden);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    fetchItems();

    // Carrito de Compras
    let cart = [];

    function addToCart(productName, productPrice) {
        try {
            cart.push({ name: productName, price: productPrice });
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
            cart.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
                cartItems.appendChild(li);
                
            });
            console.log('Carrito:', cart)

        } catch (error) {
            console.error('Error al actualizar la lista del carrito:', error);
            alert('Hubo un error al actualizar la lista del carrito');
        }
    }

    try {
        const cartButton = document.getElementById('cart-button');
        cartButton.addEventListener('click', () => {
            try {
                const cartList = document.getElementById('cart-list');
                if (cartList.style.display === 'none' || cartList.style.display === '') {
                    cartList.style.display = 'block';
                } else {
                    cartList.style.display = 'none';
                }
            } catch (error) {
                console.error('Error al mostrar/ocultar el carrito:', error);
                alert('Hubo un error al mostrar/ocultar el carrito');
            }
        });
    } catch (error) {
        console.error('Error al inicializar el botón del carrito:', error);
        alert('Hubo un error al inicializar el botón del carrito');
    }

    // Hacer que addToCart esté disponible globalmente
    window.addToCart = addToCart;

    document.getElementById('order-button').addEventListener('click', () => {
        const orderForm = document.getElementById('order-form');
        orderForm.style.display = 'block';
    });

    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de la forma tradicional

        // Captura los valores de los campos del formulario
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;

        // Guarda los valores en variables
        const formData = {
            name: name,
            phone: phone,
            address: address
        };

        // Muestra los datos capturados en la consola (puedes reemplazar esto con la lógica que desees)
        console.log('Datos del formulario:', formData);

        // Aquí puedes agregar la lógica para enviar los datos a un servidor, etc.
        // Por ejemplo, utilizando fetch() para hacer una solicitud POST

        // Oculta el formulario después de enviarlo
        const orderForm = document.getElementById('order-form');
        orderForm.style.display = 'none';
    });
});
