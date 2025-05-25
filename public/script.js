document.addEventListener('DOMContentLoaded', () => {
    const groceryList = document.getElementById('grocery-list');
    const groceryListTitle = document.getElementById('grocery-list-title');
    const newItemInput = document.getElementById('new-item');
    const addButton = document.getElementById('add-button');
    const deleteCheckedButton = document.getElementById('delete-checked-button');
    const refreshButton = document.getElementById('refresh-button');
    const deleteButton = document.getElementById('delete-button');

    function fetchGroceryList() {
        fetch('/get-list')
            .then(response => response.json())
            .then(data => {
                groceryListTitle.innerHTML = `${data.name}`;
                groceryList.innerHTML = '';
                data.groceries.forEach(item => {
                    const li = document.createElement('li');

                    const acquireCheckbox = document.createElement('input');
                    acquireCheckbox.type = 'checkbox';
                    acquireCheckbox.setAttribute('data.id', item.id);
                    acquireCheckbox.addEventListener('change', () => toggleItem(item.id));
                    acquireCheckbox.checked = item.acquired;

                    const itemName = document.createTextNode(item.name);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', () => deleteItem(item.id));
                    
                    li.appendChild(acquireCheckbox);
                    li.appendChild(itemName);
                    li.appendChild(deleteButton);
                    groceryList.appendChild(li);
                });
            });
    }

    function addItem() {
        const itemName = newItemInput.value.trim();
        if (itemName) {
            fetch('/add-item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ item: itemName })
            })
            .then(response => response.json())
            .then(data => {
                newItemInput.value = '';
                fetchGroceryList();
            });
        }
    }

    function toggleItem(itemId) {
        fetch('/acquire-item', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: itemId })
        })
        .then(response => response.json())
        .then(data => {
            fetchGroceryList();
        });
    }

    function deleteItem(itemId) {
        fetch('/delete-item', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: itemId })
        })
        .then(response => response.json())
        .then(data => {
            fetchGroceryList();
        });
    }

    function deleteCheckedItems() {
        fetch('/delete-acquired', {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            fetchGroceryList();
        });
    }

    addButton.addEventListener('click', addItem);
    deleteCheckedButton.addEventListener('click', deleteCheckedItems);
    refreshButton.addEventListener('click', fetchGroceryList);

    // Initial fetch of grocery list
    fetchGroceryList();
});