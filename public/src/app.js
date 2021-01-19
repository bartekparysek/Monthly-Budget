import { UIController } from "../views/mainView.js";
import { budgetController } from "./model.js";

const controller = (function (budgetCtrl, UICtrl) {

  const setupEventListeners = function () {

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
    document
      .getElementById(DOM.uploadForm)
      .addEventListener("submit", uploadFiles);
  }

    const ctrlTransactions = function(){
      const transactions = budgetCtrl.getTransactions();

      transactions.exp.forEach( el => UICtrl.addListItem(el, "exp"));
      transactions.inc.forEach(el => UICtrl.addListItem(el, "inc" ));

      updateBudget();
    };
    const ctrlBarChart = function() {
      const transactions = budgetCtrl.getTransactions();

      const expValueArray = transactions.exp.map(el => el.value);
      const incValueArray = transactions.inc.map(el => el.value);
      const expID = transactions.exp.map(el => el.id);
      const incID = transactions.inc.map(el => el.id);

      UICtrl.displayIncomeChart(incID,[incValueArray]);
      UICtrl.displayExpenseChart(expID,[expValueArray]);

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
            ctrlBarChart();
            budgetCtrl.testing();
          }
        });

    };

  const updateBudget = function () {

    budgetCtrl.calculateBudget();

    const budget = budgetCtrl.getBudget();

    UICtrl.displayBudget(budget);
    UICtrl.displayBudgetChart(budget);
  };

  const updatePercentage = function () {

    budgetCtrl.calculatePercentage();

    const percentages = budgetCtrl.getPercentages();

    UICtrl.displayPercentage(percentages);
  };

  const ctrlAddItem = function () {
    let input, newItem;

    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      UICtrl.addListItem(newItem, input.type);

      UICtrl.clearFields();
      ctrlBarChart();

      updateBudget();

      updatePercentage();

    }

  };
  const ctrlDeleteItem = function (e) {
    let itemID, splitID, type, ID;
    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      budgetCtrl.deleteItem(type, ID);

      UICtrl.deleteListItem(itemID);

      updateBudget();

      updatePercentage();

      ctrlBarChart();
    }
  };

  return {
    init: async function () {
      console.log("Applications has started");
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });

      UICtrl.displayExpenseChart([], [[]]);
      UICtrl.displayIncomeChart([], [[]]);

      const par = {
        totalExp: 0,
        totalInc: 1
      };
      UICtrl.displayBudgetChart(par);
      setupEventListeners();
    }
  };
})(budgetController, UIController);
controller.init(); // Public initialization function - it is the only one function exposed to the Public
