export const budgetController = (function () {
  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };
  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };
  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  const calculateTotal = function (type) {
    let sum = 0;
    data.allItems[type].forEach((cur) => (sum += cur.value));
    data.totals[type] = sum;
  };

  const data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };
  return {
    addItem: function (type, des, val) {
      let newItem, ID;

      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }
      data.allItems[type].push(newItem);
      return newItem;
    },

    uploadData: function(res){
      let paymentsList =  res.map((item) =>{
      let paymentsData = {
        type: "exp",
        description: item.Description,
        value: Math.abs(parseFloat(item.Value))
      };
      if(item.Value > 0 ){
        paymentsData.value = parseFloat(item.Value);
        paymentsData.type = "inc"
      }
      if(!item.Description || item.Description === null){
        paymentsData.description = "Transaction";
      }
      return paymentsData;
    });
      return this.pushData(paymentsList);

    },

    pushData: function(list) {
      let expense = list.filter(el => el.type === 'exp');
      let income = list.filter(el => el.type === 'inc');

      const asignID = function() {
        let ID;
        if (list.length > 0) {
          ID = (list.length - 1) + 1;
        } else {
          ID = 0;
        }
        expense.forEach((el,ID) => {
          el.id = ID;
        });
        income.forEach((el,ID) => {
          el.id = ID;
        })
      };
      asignID();
      expense.forEach(el => {

        data.allItems.exp.push(new Expense(el.id,el.description, el.value));
      });
      income.forEach(el => {
        data.allItems.inc.push(new Income(el.id,el.description,el.value));
      });
      calculateTotal("exp");
      calculateTotal("inc");

    },
    deleteItem: function (type, id) {
      let ids, index;
      ids = data.allItems[type].map((current) => current.id);
      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }

    },

    calculateBudget: function () {
      calculateTotal("exp");
      calculateTotal("inc");
      data.budget = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    calculatePercentage: function () {
      data.allItems.exp.forEach((cur) => cur.calcPercentage(data.totals.inc));
    },
    getTransactions: function() {
      return {
        exp:data.allItems.exp,
        inc:data.allItems.inc,
        all: data.allItems.exp.length + data.allItems.inc.length
      }
    },

    getPercentages: function () {
      let allPerc = data.allItems.exp.map((cur) => cur.getPercentage());
      return allPerc;
    },
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },

  };
})();
