document.addEventListener('DOMContentLoaded', () => {
    const addItemForm = document.querySelector('#addItemForm');

    addItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.querySelector('#name').value;
        const description = document.querySelector('#description').value;

        try {
            const response = await fetch('http://localhost:3000/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description }),
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const newItem = await response.json();
            console.log('Nuevo elemento añadido:', newItem);
            alert('Elemento añadido con éxito');
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al añadir el elemento');
        }
    });

    async function fetchItems() {
        try {
            const response = await fetch('http://localhost:3000/items');
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            const items = await response.json();
            console.log('Elementos obtenidos:', items);
            // Aquí puedes agregar el código para mostrar los elementos en la página
        } catch (error) {
            console.error('Error:', error);
        }
    }

    fetchItems();
});
