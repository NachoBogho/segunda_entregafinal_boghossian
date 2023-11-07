const addButton = document.querySelectorAll(".addButton");

addButton.forEach(addBtn => {
    addBtn.addEventListener("click", (event) => {
        const productId = event.target.id
        const amount = { "quantity": 1 };

        fetch(`/api/carts/6545642cca55f5b5ab6ea0d6/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify(amount),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(result => result.json()).then(json => console.log(json));

    })
})

const addToCart = (id) => {
    console.log("id:", id);
    console.log("Agregado");
}