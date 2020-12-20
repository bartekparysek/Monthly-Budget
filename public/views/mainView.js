// exporting module
export const UIController = (function () {
  // UI CONTROLLER

  const DOMstrings = {
    // in case of strings would be changed
    inputType: ".add__type",
    inputDesc: ".add__description",
    inputValue: ".add__value",
    button: ".add__btn",
    uploadType: "file__upload",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPerc: ".item__percentage",
    dateLabel: ".budget__title--month",
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
    addListItem: function (obj, type) {
      let html, newHTML, element;
      // Create HTML string with a placeholder text
      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html = `<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div>
              <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete">
              <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>
              </div>`;
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html = `<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div>
              <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage"></div>
              <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>
              </div>`;
      }
      // Replace the placeholder with some actual data
      newHTML = html.replace("%id%", obj.id);
      newHTML = newHTML.replace("%description%", obj.description);
      newHTML = newHTML.replace("%value%", formatNumber(obj.value, type));
      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHTML);
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
