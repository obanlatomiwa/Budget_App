// Budget App

// Budget Controller
let budgetController = (function(){

})();


// UI Controller
let UIController = (function(){

    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    }

    return {
        getInput: function(){
            // get values for UI
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            }

        },
        getDOMStrings: function(){
            return DOMStrings;
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

    // add items
    let addCtrlItem = function(){
        // get data from the input
        let input = UICtrl.getInput();
        console.log(input);

        // send to the budget controller

        // send to the UI controller

        // calculate the new budget

        // display new budget to the UI 
    }

    return {
        init: function(){
            eventListeners();
        }
    }
})(budgetController, UIController);

appController.init();
