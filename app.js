// Budget App

// Budget Controller
let budgetController = (function(){

    // Creating our Budget Objects
    let Expense = function(id, description, value){
        this.id = id,
        this.description = description,
        this.value = value
    }

    let Income = function(id, description, value){
        this.id = id,
        this.description = description,
        this.value = value
    }

    // Data Structure for our data: An Object
    appData = {
        item: {
            exp: [],
            inc: []
        },

        total: {
            expenseTotal: 0,
            incomeTotal: 0
        }
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
        inputIncome: '.income__list'
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
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if (type === 'inc'){
                element = DOMStrings.inputIncome;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            

            // update html 
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
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


        }

    
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
    }


    let updateBudget = function(){
        // calculate the new budget


        // display new budget to the UI 
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

        }
        
    }

    return {
        init: function(){
            eventListeners();
        }
    }
})(budgetController, UIController);

appController.init();
