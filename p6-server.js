//Require express framework and instantiate
const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

const HOST = "localhost";
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

class Grocery {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.acquired = false;
  }
}

class GroceryList {
  constructor(name) {
    this.name = name;
    this.groceries = [];
  }

  addGrocery(name) {
    let groce = new Grocery(this.groceries.length, name);
    this.groceries.push(groce);
  }

  acquire(id) {
    let groce = this.groceries[parseInt(id)];
    groce.acquired = !groce.acquired;
  }

  //UPDATE REST OF LIST IDs PLEASE
  removeGrocery(id) {
    this.groceries = this.groceries.filter(x => x.id !== parseInt(id));
    for(let i=0; i<this.groceries.length; i++) {
      this.groceries[i].id = i;
    }
  }

  removeAllAcquired() {
    this.groceries = this.groceries.filter(x => x.acquired == false);
    for(let i=0; i<this.groceries.length; i++) {
      this.groceries[i].id = i;
    }
  }
}

let groceryList = new GroceryList("My Grocery List");
groceryList.addGrocery("Bread");
groceryList.addGrocery("Milk");
groceryList.addGrocery("Eggs");
groceryList.addGrocery("Cereal");
groceryList.addGrocery("Ice Cream");

//GET Route
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/get-list', (req, res) => {
  try {
    let data = groceryList;
    res.status(200).type('application/json; charset=utf-8');
    res.json(data);
  } catch(error) {
    console.error('Error fetching grocery list.', error);
    res.status(500).json({error: 'An error occured while fetching the grocery list.'})
  }
});

//POST Route
app.post('/add-item', (req, res) => {
  try {
    let item = req.body.item;
    groceryList.addGrocery(item);
    let data = groceryList;
    res.status(201).type('application/json; charset=utf-8');
    res.json(data);
  } catch(error) {
    console.error('Error adding item to grocery list.', error);
    res.status(500).json({error: 'An error occured while adding an item to the grocery list.'})
  }
});

//PUT Route
app.put('/acquire-item', (req, res) => {
  try {
    let id = req.body.id;
    if(typeof id !== "number") {
      console.error('Invalid datatype in /acquire-item request.')
      return res.status(400).json({error: 'Grocery ID must be an integer.'})
    } else if(id >= groceryList.groceries.length || id < 0) {
      console.error('Invalid grocery ID in /acquire-item request.')
      return res.status(400).json({error: 'Invalid grocery ID.'})
    }
    groceryList.acquire(id);
    let data = groceryList;
    res.status(200).type('application/json; charset=utf-8');
    res.json(data);
  } catch(error) {
    console.error('Error editing grocery list.', error);
    res.status(500).json({error: 'An error occured while editing the grocery list.'})
  }
});

//DELETE ONE Route
app.delete('/delete-item', (req, res) => {
  try {
    let id = req.body.id;
    if(typeof id !== "number") {
      console.error('Invalid datatype in /delete-item request.')
      return res.status(400).json({error: 'Grocery ID must be an integer.'})
    } else if(id >= groceryList.groceries.length || id < 0) {
      console.error('Invalid grocery ID in /delete-item request.')
      return res.status(400).json({error: 'Invalid grocery ID.'})
    }
    groceryList.removeGrocery(id);
    let data = groceryList;
    res.status(200).type('application/json; charset=utf-8');
    res.json(data);
  } catch(error) {
    console.error('Error deleting item from grocery list.', error);
    res.status(500).json({error: 'An error occured while deleting an item from the grocery list.'})
  }
});

//DELETE ACQUIRED Route
app.delete('/delete-acquired', (req, res) => {
  try {
    groceryList.removeAllAcquired();
    let data = groceryList;
    res.status(200).type('application/json; charset=utf-8');
    res.json(data);
  } catch(error) {
    console.error('Error deleting items from grocery list.', error);
    res.status(500).json({error: 'An error occured while deleting items from the grocery list.'})
  }
});

//Handle 404 for all other routes
app.use((req, res) => {
  res.status(404).json({error: '404 Not Found'});
});

//Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server runnning at http://${HOST}:${PORT}`)
});