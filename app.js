// Budget App

// Budget Controller
let budgetController = (function(){

})();


// UI Controller
let UIController = (function(){


})();


// App Controller
let appController = (function(){

    // add items
    let addCtrlItem = function(){
        // get data from the input 

        // send to the budget controller

        // send to the UI controller

        // calculate the new budget

        // display new budget to the UI 
    }
    document.querySelector('.add__btn').addEventListener('click', addCtrlItem);
    document.addEventListener('keypress', function(event){
        // ensure the Keyboard Enter key, adds items
        if (event.keyCode === 13 || event.which === 13){
            addCtrlItem();
        }
    });

})();
