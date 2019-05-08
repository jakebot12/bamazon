//initialize dependencies and global variables
var inquirer = require("inquirer");
//write inquirer functions for UI
console.log("Welcome to Bamazon!");

var questions = [
  {
    type: "list",
    name: "shoppingList",
    message: "Please enter the ID of the the pruduct you would like to find",
    choices: ["1=HDTV", "2=FishingNet", "3=Hoodie"]
  },
  {
    type: "input",
    name: "quantity",
    message: "How many would you like?",
    validate: function(value) {
      var valid = !isNaN(parseFloat(value));
      return valid || "Please enter a number";
    },
    filter: Number
  }
];

inquirer.prompt(questions).then(answers => {
  console.log("\nOrder receipt:");
  console.log(JSON.stringify(answers, null, "  "));
  console.log("Thank you for shopping with Bamazon!")
});
//assign the inputs to the proper forms
//write functions for output
