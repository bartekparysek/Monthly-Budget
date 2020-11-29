// BUDGET CONTROLLER
const budgetController = (function() {
  // starting with 1 module - IIFE(immidiately invoked fucntion which makes everything secure)
  const Expense = function(id,description,value){
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1
  };
  Expense.prototype.calcPercentage = function(totalIncome) {
    if(totalIncome > 0){
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else{
      this.percentage = -1;
    }

  };
  Expense.prototype.getPercentage = function(){
    return this.percentage;
  };
  const Income = function(id,description,value){
    this.id = id;
    this.description = description;
    this. value = value;
  };
  const calculateTotal = function(type){
    let sum = 0;
    data.allItems[type].forEach(cur => sum += cur.value);
    data.totals[type] = sum;
  };
  // data structure
  const data = {
      allItems: {
          exp: [],
          inc: []
      },
      totals: {
          exp: 0,
          inc:0
      },
      budget: 0,
      percentage: -1,
    };
    return{
      addItem: function(type,des,val){
        let newItem, ID;
        // Create new ID
        if(data.allItems[type].length > 0){
          ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
        } else{
          ID = 0;
        }

        // Create new item basen on 'inc' or 'exp' type
        if(type ==='exp'){
          newItem = new Expense(ID,des,val);
        }else if(type ==='inc'){
          newItem = new Income(ID,des,val) ;
        }
        // Push it into pur data structure
        data.allItems[type].push(newItem);
        // Return the new element
        return newItem;
      },

      deleteItem: function(type, id){
        let ids,index;
        ids = data.allItems[type].map(current => current.id);
        index = ids.indexOf(id);

        if(index !== -1){
          data.allItems[type].splice(index, 1);
        };
      },

      calculateBudget: function(){
        // calculate total income and expenses
          calculateTotal('exp');
          calculateTotal('inc');
        // calculate the budget: income - expenses
          data.budget = data.totals.inc - data.totals.exp;
        // calculate the percentage of income that we spent
        if(data.totals.inc > 0){
          data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        }else{
          data.percentage = -1;
        }

      },
      calculatePercentage: function(){
        data.allItems.exp.forEach(cur => cur.calcPercentage(data.totals.inc));

      },

      getPercentages: function(){
        let allPerc = data.allItems.exp.map(cur => cur.getPercentage());
        return allPerc;

      },
      getBudget: function(){
        return {
          budget: data.budget,
          totalInc: data.totals.inc,
          totalExp: data.totals.exp,
          percentage: data.percentage
        };
      },

      testing: function(){
        console.log(data);
      }
    };
})();

// UI CONTROLLER
const UIController = (function () {
  // IIFE for another module
  const DOMstrings = {
    // in case of strings would be changed
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    button: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPerc: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  const formatNumber =  function(num, type){
    let numSplit, int, dec;
      // + or - before number
      // exactly 2 decimal points and comma separattign the thousands
    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');
    int = numSplit[0];
    if(int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length -3, 3);
    }

    dec = numSplit[1];

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.'+ dec;
  };
  const nodeListForEach = function(list,callback) {
    for (let i = 0; i < list.length; i++){
      callback(list[i],i);
    }
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // either inc or exp
        description: document.querySelector(DOMstrings.inputDesc).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    addListItem: function(obj, type){
        let html,newHTML,element;
        // Create HTML string with a placeholder text
        if(type === 'inc'){
          element = DOMstrings.incomeContainer;
          html = `<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div>
          <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete">
          <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>
          </div>`;
        } else if( type ==='exp'){
          element = DOMstrings.expensesContainer;
          html = `<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div>
          <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage"></div>
          <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>
          </div>`;
        }
        // Replace the placeholder with some actual data
        newHTML = html.replace('%id%',obj.id);
        newHTML = newHTML.replace('%description%',obj.description);
        newHTML = newHTML.replace('%value%',formatNumber(obj.value, type));
        // Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);
    },
    deleteListItem: function(selectorID){
      let el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);

    },
    clearFields: function(){
      let fields,fieldsArr;
      fields = document.querySelectorAll(DOMstrings.inputDesc + ', ' + DOMstrings.inputValue);
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach((current,index,array) => current.value = '');

      fieldsArr[0].focus();
    },

    displayBudget: function(obj){
      let type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp,'exp');
      if(obj.percentage > 0 ){
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      }else{
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }

    },
    displayPercentage: function(percentages){

      const fields = document.querySelectorAll(DOMstrings.expensesPerc);

      nodeListForEach(fields, function(current,index){
        if(percentages[index] > 0){
          current.textContent = percentages[index] + '%';
        } else{
          current.textContent = '---';
        }
      });

    },
    displayMonth: function(){
      let now,year,month;
      now = new Date();
      monthSet = { month: "long" };
      month = now.toLocaleDateString('en-us', monthSet);
      year = now.getFullYear();
      document.querySelector(DOMstrings.dateLabel).textContent = month + ' ' + year;

    },
    changedType: function(){
      const fields = document.querySelectorAll(
        DOMstrings.inputType + ','+
        DOMstrings.inputDesc + ',' +
        DOMstrings.inputValue);

        nodeListForEach(fields, function(cur){
          cur.classList.toggle('red-focus');
        })
        document.querySelector(DOMstrings.button).classList.toggle('red');
    },

    getDOMstrings: function () {
      return DOMstrings;
    }
  };
})();

// GLOBAL APP CONTROLLER
const controller = (function (budgetCtrl, UICtrl) {
  // a link controller for other 2 modules, arguments have different names - good practice
  const setupEventListeners = function () {
    // event listeners are going to be called as soon as the init function
    const DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.button).addEventListener('click', ctrlAddItem);
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
  };
  const updateBudget = function() {
    // 1. Calculate the budget
     budgetCtrl.calculateBudget();
    // 2. Return the budget
     const budget = budgetCtrl.getBudget();
    // 3. Display the budget on the UI
      UICtrl.displayBudget(budget);
 };

  const updatePercentage = function(){
    // calc percentages
    budgetCtrl.calculatePercentage();
    // read from the budget controller
    const percentages = budgetCtrl.getPercentages();

    // update the UI
    UICtrl.displayPercentage(percentages);
  };

  const ctrlAddItem = function () {
    let input,newItem;
    // 1. Get form input data
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0){
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // 3. Add the item to the UI
      UICtrl.addListItem(newItem,input.type);
      // 4. Clear the fields
      UICtrl.clearFields();
      // 5. Calculate and update the budget
      updateBudget();
      // 6. Update the percentages
      updatePercentage();
    }

  };
  const ctrlDeleteItem = function(e){
    let itemID, splitID, type, ID;
    itemID =  e.target.parentNode.parentNode.parentNode.parentNode.id;
    if(itemID){
      // inc-1
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);
      // delete item from the data structure
      budgetCtrl.deleteItem(type,ID);

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
    init: function () {
      console.log("Applications has started");
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init(); // Public initialization function - it is the only one function exposed to the Public
