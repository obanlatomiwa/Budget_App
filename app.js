// Budget App

// Budget Controller
let budgetController = (function(){

    // Creating our Budget Objects
    let Expense = function(id, description, value){
        this.id = id,
        this.description = description,
        this.value = value,
        this.percentage = -1
    }

    // calculates percentage for Expense objects
    Expense.prototype.calcPercentage = function(totalIncome){
        if (totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else{
            this.percentage = -1;
        }
    }

    // returns percentage for Expense objects
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    } 

    let Income = function(id, description, value){
        this.id = id,
        this.description = description,
        this.value = value
    }

    // helps to calculate total expenses and income and update the data structure
    let calculateTotal = function(type){
        let sum = 0;
        appData.item[type].forEach(function(cur){
            sum += cur.value;
        });
        appData.total[type] = sum; 
    }
    // Data Structure for our data: An Object
    let appData = {
        item: {
            exp: [],
            inc: []
        },

        total: {
            exp: 0,
            inc: 0
        },

        percentage: -1,
        budget: 0,
        
    }



    return {
        addItem: function(type, des, val){
            let newItem, Id;
            // create ids for data entries
                if (appData.item[type].length > 0){
                    Id = appData.item[type][appData.item[type].length - 1].id + 1;
                }else{
                    Id = 0;
                }   

            // verify the type of object
            if (type === 'exp'){
                // create new object
                newItem = new Expense(Id, des, val);

            }else if (type === 'inc'){
                newItem = new Income(Id, des, val);
            }
            // update database
            appData.item[type].push(newItem);

            
            // return new element
            return newItem;

        },

        // calculate budget
        calculateBudget: function(){
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate budget "total income - total expenses"
            appData.budget = appData.total.inc - appData.total.exp;

            // calculate percentage  "total expenses / total income"
            if (appData.total.inc > 0){
                appData.percentage = Math.round((appData.total.exp / appData.total.inc) * 100);
            }else{
                appData.percentage = -1;
            }

        },  
        // calculate Percentages for each object
        calculatePercentages: function(){
            // get percentage from Expense prototype
            appData.item.exp.forEach(function(cur){
                cur.calcPercentage(appData.total.inc);
            });
        },

        getPercentages: function(){
            let allPercentages = appData.item.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPercentages;
        },
        
        deleteItem: function(type, id){
            let obj_ids, index;
            obj_ids = appData.item[type].map(function(current){
                return current.id;
            });

            index = obj_ids.indexOf(id);

            if (index !== -1){
                appData.item[type].splice(index, 1);
            };

        },

        getBudget: function(){
            return {
                totalBudget: appData.budget,
                totalPercentage: appData.percentage,
                totalIncome: appData.total.inc,
                totalExpenses: appData.total.exp
            };
        },

        testing: function(){
            console.log(appData);
        }
    }
})();


// UI Controller
let UIController = (function(){

    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        inputExpense: '.expenses__list',
        inputIncome: '.income__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }

    let formatNumbers = function(num, type){
        let numSplit, integerPart, decimalPart;
        num = Math.abs(num);
        
        // change number to 2 d.p    note toFixed() returns a string
        num = num.toFixed(2);
        numSplit = num.split('.');
        // split the string
        integerPart = numSplit[0];
        // formats the string to add commas
        if (integerPart.length > 3){
            integerPart = integerPart.substr(0, integerPart.length - 3) + ',' + integerPart.substr(integerPart.length - 3, 3);
        }

        // add '+' for income and '-' for expenses
        decimalPart = numSplit[1];
        type === 'exp' ? sign = '-' : sign = '+';

        return (type === 'exp' ? '-' : '+') + ' ' + integerPart + '.' + decimalPart;
    }


    let nodeListForEach = function(list, callback){
        for (let i = 0; i < list.length; i++){
            callback(list[i], i);
        }
    }


    return {
        getInput: function(){
            // get values for UI
            return {
                type: document.querySelector(DOMStrings.inputType).value, // returns either 'inc' or 'exp'
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }

        },
        getDOMStrings: function(){
            return DOMStrings;
        },

        addNewItem: function(obj, type){
            let html, newHtml, element;

            // create html string
            if (type === 'exp'){
                element = DOMStrings.inputExpense;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if (type === 'inc'){
                element = DOMStrings.inputIncome;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
             

            // update html 
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumbers(obj.value, type));
            
            // update the UI and insert newHtml into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearHtmlFields: function(){
            let field, fieldArray;
            // clear fields using querySelectorAll
            field = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

            // convert the querySelectorAll list to an Array using slice from the Array prototype
            fieldArray = Array.prototype.slice.call(field);

            // loop through the array to clear field
            fieldArray.forEach(function(cur, ind, arr){
                cur.value = "";
            });

            // change focus back to the description field
            fieldArray[0].focus();


        },

        // display budget
        displayBudget: function(obj){
            let type;
            obj.totalBudget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumbers(obj.totalBudget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumbers(obj.totalIncome, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumbers(obj.totalExpenses, 'exp');

            // adjucting the percentage display
            if (obj.totalPercentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.totalPercentage + '%';
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
            
        },

        displayPercentages: function(percentage){
            let field = document.querySelectorAll(DOMStrings.expensesPercentageLabel);

            nodeListForEach(field, function(cur, index){
                if (percentage[index] > 0){
                    cur.textContent = percentage[index] + '%';
                }else{
                    cur.textContent = '---';
                }
            })
            
        },

        // display Month to the UI
        displayMonth: function(){
            let now, month, months, year;
            // get the current date object
            now = new Date();

            // create a month array
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            // get the current month and year
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        displayType: function(){
            let field;
            field = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue
            );

            nodeListForEach(field, function(cur){
                cur.classList.toggle('red-focus');
            })

            document.querySelector(DOMStrings.inputButton).classList.toggle('red');
        },

        // delete an item from the UI 
        deleteUIItem: function(itemID){
            let element = document.getElementById(itemID);
            element.parentNode.removeChild(element);
        },


    
    }


})();


// App Controller
let appController = (function(budgetCtrl, UICtrl){

    // set up event listeners 
    let eventListeners = function(){
        let DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputButton).addEventListener('click', addCtrlItem);
        document.addEventListener('keypress', function(event){
            // ensure the Keyboard Enter key, adds items
            if (event.keyCode === 13 || event.which === 13){
                addCtrlItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.displayType);
    }


    let updateBudget = function(){
        // calculate the new budget
        budgetCtrl.calculateBudget();

        // get budget 
        let budget = budgetCtrl.getBudget();

        // display new budget to the UI 
        UICtrl.displayBudget(budget);
    }

    // update percentages 
    let updatePercentages = function(){
        // calculate and update percentages
        budgetCtrl.calculatePercentages();

        // get percentage from budget controller and update it
        let percent = budgetCtrl.getPercentages();

        // update the UI percentages
        UICtrl.displayPercentages(percent);
    }

    // add items
    let addCtrlItem = function(){
        let input, newItem;
        // get data from the input
        input = UICtrl.getInput();

        // filter data input 
        if (input.description !== "" && input.value > 0 && !isNaN(input.value)){
            // send to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);


        // send to the UI controller
        UICtrl.addNewItem(newItem, input.type);

        // clear html fields
        UICtrl.clearHtmlFields();

        // calculate the new budget
        updateBudget();

        // update percentages
        updatePercentages();
        }
        
    };

    let ctrlDeleteItem = function(event){
        let ID, splitID, type;
        ID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (ID){
            splitID = ID.split('-');
            type = splitID[0];
            itemID = parseInt(splitID[1]);

            // delete item from app data structure
            budgetCtrl.deleteItem(type, itemID);

            // delete item from  UI
            UICtrl.deleteUIItem(ID);

            // update UI and Budget 
            updateBudget();

            // update percentages
            updatePercentages();
        }



    }

    return {
        init: function(){
            eventListeners();
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                totalBudget: 0,
                totalPercentage: 0,
                totalIncome: 0,
                totalExpenses: 0
            });
        }
    }
})(budgetController, UIController);

appController.init();
