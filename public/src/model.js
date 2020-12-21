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

  // data structure
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
      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item basen on 'inc' or 'exp' type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }
      // Push it into pur data structure
      data.allItems[type].push(newItem);
      // Return the new element
      return newItem;
    },

    uploadData: async function(){
      const response = await fetch('/uploads');
      const uploads = await response.json();
      let paymentsList =  uploads.map((item) =>{
      let paymentsData = {
        type: "exp",
        des: item.Opis,
        val: item.Obciążenia
      };
      if(!item.Obciążenia){
        paymentsData.val = item.Uznania;
        paymentsData.type = "inc"
      }
      if(!item.Opis){
        paymentsData.des = item["Rodzaj transakcji"];
      }
      return paymentsData;
    });
      return paymentsList;
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
      // calculate total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");
      // calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      // calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    calculatePercentage: function () {
      data.allItems.exp.forEach((cur) => cur.calcPercentage(data.totals.inc));
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

    testing: function () {
      console.log(data);
    },
  };
})();
