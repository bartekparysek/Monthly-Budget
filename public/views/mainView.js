// exporting module
export const UIController = (function () {
  // UI CONTROLLER

  const DOMstrings = {
    // in case of strings would be changed
    inputType: `input[name="radio"]:checked`,
    inputDesc: ".add__description",
    inputValue: ".add__value",
    button: ".add__btn",
    uploadType: "file__select",
    uploadForm: "uploadForm",
    transactionsContainer: ".transactions__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPerc: ".item__percentage",
    dateLabel: ".budget__title--month",
    tableEUR: "table__euro",
    tableUSD: "table__usd",
    tableGBP: "table__funt"
  };

  const formatNumber = function (num, type) {
    let numSplit, int, dec;
    // + or - before number
    // exactly 2 decimal points and comma separattign the thousands
    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split(".");
    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
    }

    dec = numSplit[1];

    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };
  const nodeListForEach = function (list, callback) {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // either inc or exp
        description: document.querySelector(DOMstrings.inputDesc).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
      };
    },
    getFile: function () {
      return document.getElementById(DOMstrings.uploadType).files[0];
    },
    addListItem: function (obj, type) {
      let html, newHTML;
      // Create HTML string with a placeholder text
      if (type === "inc") {
        html = `<div class="item clearfix" id="inc-${obj.id}"> <div class="item__description">${obj.description}</div>
              <div class="right clearfix"> <div class="item__value">${formatNumber(obj.value, type)}</div> <div class="item__delete">
              <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>
              </div>`;
      } else if (type === "exp") {
        html = `<div class="item clearfix" id="exp-${obj.id}"> <div class="item__description">${obj.description}</div>
              <div class="right clearfix"><div class="item__value">${formatNumber(obj.value, type)}</div><div class="item__percentage"></div>
              <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>
              </div>`;
      }
      newHTML = html;
      // Insert the HTML into the DOM
      document.querySelector(DOMstrings.transactionsContainer).insertAdjacentHTML("beforeend", newHTML);
    },
    deleteListItem: function (selectorID) {
      let el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },
    clearFields: function () {
      let fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMstrings.inputDesc + ", " + DOMstrings.inputValue
      );
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach((current, index, array) => (current.value = ""));

      fieldsArr[0].focus();
    },

    displayBudget: function (obj) {
      let type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        "inc"
      );
      document.querySelector(
        DOMstrings.expensesLabel
      ).textContent = formatNumber(obj.totalExp, "exp");
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },
    displayPercentage: function (percentages) {
      const fields = document.querySelectorAll(DOMstrings.expensesPerc);

      nodeListForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },
    displayMonth: function () {
      let now, year, month, monthSet;
      now = new Date();
      monthSet = { month: "long" };
      month = now.toLocaleDateString("en-us", monthSet);
      year = now.getFullYear();
      document.querySelector(DOMstrings.dateLabel).textContent =
        month + " " + year;
    },

    displayExpenseChart: function(ids,values) {
      const options = {
        seriesBarDistance: 6,
        axisX: {
          showGrid:false,
          offset: 30,
          labelOffset: {
            x: 0,
            y: 5
          },
          chartPadding: {
            top: 20,
            right: 15,
            bottom: 5,
            left: 10
          },
        }
      }
      new Chartist.Bar('#chart1',{
        labels: ids,
        series: values
      }, options);
    },

    displayIncomeChart: function(ids,val) {
      const options = {
        seriesBarDistance: 6,
        axisX: {
          offset: 30,
          showGrid:false,
          labelOffset: {
            x: 0,
            y: 5
          },
          chartPadding: {
            top: 20,
            right: 15,
            bottom: 5,
            left: 10
          },
          axisY: {

          }
        }
      }
      new Chartist.Bar('#chart3', {
        labels: ids,
        series: val
      }, options);
    },
    displayBudgetChart: function(budget){
      new Chartist.Pie('#chart2', {
        series: [budget.totalExp,budget.totalInc]
      });
    },
    changedType: function () {
      const fields = document.querySelectorAll(
        DOMstrings.inputType +
        "," +
        DOMstrings.inputDesc +
        "," +
        DOMstrings.inputValue
      );

      nodeListForEach(fields, function (cur) {
        cur.classList.toggle("red-focus");
      });
      document.querySelector(DOMstrings.button).classList.toggle("red");
    },

    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();
