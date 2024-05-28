document.addEventListener('DOMContentLoaded', () => {
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
                    body:JSON.stringify({ name, phone, address }),
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
});
