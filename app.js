
// Budget Controller

var budgetController = (function (){

    var Expense = function(id, description, value) {
     this.id = id;
     this.description = description;
     this.value = value;
     this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };


    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
       };

       var calculateTotal = function(type) {
  
        var sum = 0;
        data.allItems[type].forEach(function(cur) {

            sum += sum + cur.value;

        });
        data.totals[type] = sum;

        /*
        0
        [200, 400, 100]
        sum = 0+200 = 200
        su, = 200+400
        */
       };


       var data = {
        allItems: {
            exp: [],
            inc: []
        },       
        totals: {
         exp: 0,
         inc:0   
        },
        budget: 0,
        percentage : -1
      };

      return {
          addItem: function(type, des, val) {
            
            var newItem;

            // [1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            // ID = last ID + 1

            // Create new ID
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else {
                ID = 0;
            }
           


            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            }

            // push it into our data structure
            data.allItems[type].push(newItem);
            
            // return the new element
            return newItem;       
          },


          deleteItem: function(type, id) {
              var ids, index;

            // id = 6
            //  data.allItems(type)[id];

            //ids =[1 2 3 4 6 8]
            // index = 3

            ids =  data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);


            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }


          },

          CalculateBudget: function() {

            // calculate total income or expenses
            calculateTotal('exp');
            calculateTotal('inc');


            // calculate the budget inc - exp
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentaget of inc that we spent

            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
            

            // Exp = 100 and inc 200, spent 50% = 100/200 = 0.5 * 100


          },
          calculatePercentages: function() {

            /*
            a= 20
            b=10
            c=40
            income=100
            a = 20/100 = 20%
            b = 10/100 = 10%
            c = 40/100 = 40%
            */

            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
          },

          getPercentage: function() {
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
          },

          getBudget: function() {

            return {
                budget: data.budget, 
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
          },
          testing :function() {
              console.log(data);
          }
      };

})();



// UI Controller
 
   var DOMstrings = {
       inputType : '.add__type',
       inputDescription: '.add__description',
       inputValue: '.add__value',
       inputButton : '.add__btn',
       incomeContainer: '.income__list',
       expenseContainer: '.expenses__list',
       budgetLabel: '.budget__value',
       incomeLabel: '.budget__income--value',
       expensesLabel: '.budget__expenses--value',
       percentageLabel: '.budget__expenses--percentage',
       container: '.container',
       expensesPercLabel: '.item__percentage',
       dateLabel: '.budget__title--month'

   };

   var formatNumber = function(num, type) {
    var numSplit, int, dec;
    /**
     *  + or - before number exactly 2 decimal points comma separating the thousands
     * 2310.4567 -> + 2,310.46
     * 2000 -> + 2,000.00
     */

     num = Math.abs(num);
     num = num.toFixed(2);

     numSplit = num.split('.');
     int = numSplit[0];
    if (int.length > 3) {
       int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length); //input 2310, output 2,310
    }
      dec = numSplit[1];

      

      return (type  === 'exp' ? sign = '-' : sign = '+') + '' + int + '.' +dec;

};

var nodeListForEach = function(list, callback) {
    for (var i = 0; i < list.length; i++) {
        callback(list[i], i);
    }
};


var UIController = (function(){
    
    return{
    getInput: function() {

        return {
             type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
             description: document.querySelector(DOMstrings.inputDescription).value,
             value: parseFloat(document.querySelector(DOMstrings.inputValue).value) 

        };  
    },

    addListItem: function(obj, type) {
        var html, newHtml;

        // Create HTML string with placeholder text
      

        if (type === 'inc') {
            element = DOMstrings.incomeContainer;
            
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

        }else if(type === 'exp'){
            element = DOMstrings.expenseContainer;

            html=  '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">-%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

        }

     
        //Replace the placeholder thext with some actual data
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%',formatNumber (obj.value, type));

        // Insert HTML into the DOM

        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },

    deletListItem: function(selectorID) {
        var el = document.getElementById(selectorID)
        el.parentNode.removeChild(el);

    },

    clearFields: function() {
 
        var fields, fieldsArr;

        fields = document.querySelectorAll(DOMstrings.inputDescription +  ', ' + 
        DOMstrings.inputValue);

        fieldsArr = Array.prototype.slice.call(fields);

        fieldsArr.forEach(function(current, index, array) {
            current.value = "";

        });

        fieldsArr[0].focus();
    },

    displayBudget: function(obj) {
        var type;

        obj.budget > 0 ? type = 'inc' : type = 'exp';

        document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(DOMstrings.incomeLabel).textContent =formatNumber(obj.totalInc, 'inc') ;
        document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp , 'exp') ;
        

        if (obj.percentage > 0){
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
        } else {
            document.querySelector(DOMstrings.percentageLabel).textContent = '---';
        }

    },

    displayPercentages: function(percentages) {

        var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
      


        nodeListForEach(fields, function(current, index){
            if(percentages[index] > 0){
                current.textContent = percentages[index] + '%';
            } else {
                current.textContent = '---';
            }
            
        });
    },

    displayMonth:  function() {

        var year, now, month, months;
        now = new Date();
        months = ['January', 'February', 'March', 'April','May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        month = now.getMonth();

        year = now.getFullYear();

        document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        
    },

    changedType: function() {
        var fields = document.querySelectorAll(
            DOMstrings.inputType + ',' +
            DOMstrings.inputDescription + ',' +
            DOMstrings.inputValue
        );

        nodeListForEach(fields, function(cur){
            cur.classList.toggle('red-focus');
        });

        document.querySelector(DOMstrings.inputButton).classList.toggle('red');

        
    },

      getDomstrings : function() {
          return DOMstrings;
      }
    };

})();


// Global app Controller

var controller = (function(budgetCntrl, UIctrl){

    var DOM = UIctrl.getDomstrings();

    var setupEventListeners = function() {
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);


    document.addEventListener('keypress', function(event){
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    document.querySelector(DOM.inputType).addEventListener('change', UIctrl.changedType);
  
};
 
    var updatePercentages = function() {
        // calculate the percentages
        budgetCntrl.calculatePercentages();
        // Read perentages from the budget controller 
         var percentages = budgetCntrl.getPercentage();

        // update the UI with the new percentages
        UIctrl.displayPercentages(percentages);

    };

   var updateBudget =  function() {

       // Calculate the budget
       budgetCntrl.CalculateBudget();
       
       // return the budget
       var budget = budgetCntrl.getBudget();


        // Display the budget on the UI
        UIctrl.displayBudget(budget);
   };

   

    var ctrlAddItem = function() {

        var input, newItem;
        // Get the field input data

         input = UIctrl.getInput();


         if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
 

        // Add the item to the budget controller
        newItem = budgetCntrl.addItem(input.type, input.description, input.value);

        // add the item to the UI
        UIctrl.addListItem(newItem, input.type);

        // Clear the fields

        UIctrl.clearFields();

        // Calculate and update budgte
        updateBudget();

        // calculate and update percentages
        updatePercentages();

         } 
              
    };

    var ctrlDeleteItem = function(e) {

        var itemID, splitID, type, ID;

        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            // Inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // Delete the item from the data structure 
            budgetCntrl.deleteItem(type, ID);

            // Delete the item from the UI
            UIctrl.deletListItem(itemID);

            // Update and show the new budget
            updateBudget();


        }
    };

    return {
        init: function() {
            console.log('Application started.');
            UIctrl.displayMonth();
            UIctrl.displayBudget({
                budget: 0, 
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();