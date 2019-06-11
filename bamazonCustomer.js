//initialize dependencies and global variables
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

//Set up server connection with database and display products
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  getProducts();
});

//Create welcome message and write inquirer functions for UI
console.log("Welcome to Bamazon!");

//Display the inventory in a console table
function getProducts() {
  // Query data from products mysql
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
    itemPrompt(res);
  });
}

//Ask the user for their selection
function itemPrompt(inventory) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "choices",
        message:"Please enter the ID of the the product you would like to purchase"
      }
    ])
    .then(function(val) {
      var itemId = parseInt(val.choices);
      var item = queryInventory(itemId, inventory);

      if (item) {
        quantityPrompt(item);
      } else {
        console.log(
          "I'm sorry, it looks as though that item has either been sold out, or does not have that quantity available. Please select less quantity or choose another item."
        );
        getProducts();
      }
    });
}

//Ask the user how many of their selection they would like to purchase
function quantityPrompt(item) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many of this item would you like?"
      }
    ])
    .then(function(val) {
      var quantity = parseInt(val.quantity);

      if (quantity > item.stock_quantity) {
        console.log(
          "I'm sorry, it looks as though that item has either been sold out, or does not have that quantity available. Please select less quantity or choose another item."
        );
        getProducts();
      } else {
        completePurchase(item, quantity);
      }
    });
}

//Purchase Function

function completePurchase(item, quantity) {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
    [quantity, item.itemId],
    function(err, res) {
      console.log(
        "You have completed this purchase of " +
          quantity +
          " " +
          item.product_name +
          "'s!"
      );
      getProducts();
    }
  );
}

//Check the availability of customers' selection
function queryInventory(itemId, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === itemId) {
      return inventory[i];
    }
  }
  return null;
}
