import { UIController } from "../views/mainView.js";
import { budgetController } from "./model.js";

// GLOBAL APP CONTROLLER
const controller = (function (budgetCtrl, UICtrl) {
  // a link controller for other 2 modules, arguments have different names - good practice
  const setupEventListeners = function () {
    // event listeners are going to be called as soon as the init function
    const DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.button).addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);

    /*document // some red focus add event listener DELETE later
      .querySelector(DOM.inputType)
      .addEventListener("change", UICtrl.changedType);
    */
    // papa parse event listener
    document
      .getElementById(DOM.uploadForm)
      .addEventListener("submit", uploadFiles);
  }

    const ctrlTransactions = function(){
      let transactions = budgetCtrl.getTransactions();
      const expIdArray = transactions.exp.map(el => el.id);
      const expValueArray = transactions.exp.map(item => item.value);

      transactions.exp.forEach( el => UICtrl.addListItem(el, "exp"));
      transactions.inc.forEach(el => UICtrl.addListItem(el, "inc" ));

      UICtrl.displayBarChart(expIdArray,expValueArray);

      updateBudget();
    };
    const uploadFiles = function (e){
      e.preventDefault();


        let fileList = UICtrl.getFile();

        const files = Papa.parse(fileList, {
          header: true,
          download:true,
          dynamicTyping: true,
          complete: function(results) {
            budgetCtrl.uploadData(results.data);
            ctrlTransactions();
            budgetCtrl.testing();
          }
        });

    };
      /*
        //Get files data
        const addingItems = data variable .forEach(el => UICtrl.addListItem(el, el.type));
        UICtrl.addListItem(files,files.type);
        */
    /*
      it should be made after the file loads = function(){
        budgetCtrl.calculateBudget();
        // 2. Return the budget
        const budget = budgetCtrl.getBudget();
        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
      }
      */
  const updateBudget = function () {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();
    // 2. Return the budget
    const budget = budgetCtrl.getBudget();
    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
    UICtrl.displayBudgetChart(budget);
  };

  const updatePercentage = function () {
    // calc percentages
    budgetCtrl.calculatePercentage();
    // read from the budget controller
    const percentages = budgetCtrl.getPercentages();

    // update the UI
    UICtrl.displayPercentage(percentages);
  };

  const ctrlAddItem = function () {
    let input, newItem;
    // 1.a Get form input data
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);
      // 4. Clear the fields
      UICtrl.clearFields();
      //Update chart
      let transactions = budgetCtrl.getTransactions();
      const expIdArray = transactions.exp.map(el => el.id);
      const expValueArray = transactions.exp.map(item => item.value);
      UICtrl.displayBarChart(expIdArray,[...expValueArray]);
      // 5. Calculate and update the budget
      updateBudget();
      // 6. Update the percentages
      updatePercentage();

    }

  };
  const ctrlDeleteItem = function (e) {
    let itemID, splitID, type, ID;
    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      // inc-1
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);
      // delete item from the data structure
      budgetCtrl.deleteItem(type, ID);

      // delete item from UI
      UICtrl.deleteListItem(itemID);
      // update and show the budget
      updateBudget();
      // update percantges
      updatePercentage();
    }
  };

  return {
    // object for init function
    init: async function () {
      console.log("Applications has started");
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      UICtrl.displayBarChart([],[[]]);
      const par = {
        totalExp: 0,
        totalInc: 1
      };
      UICtrl.displayBudgetChart(par);
      setupEventListeners();

      /*let currencies;
      currencies = await budgetCtrl.uploadCurrency();
      // updated currencies
      UICtrl.displayCurrencies(currencies);
      */

      budgetCtrl.testing();
    }
  };
})(budgetController, UIController);
controller.init(); // Public initialization function - it is the only one function exposed to the Public
