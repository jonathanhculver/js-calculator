$(document).ready(function() {
    math.calculator.init();
});

var math = window.math || {};

math.calculator= (function() {
    var self = {};
    var mathString = '';
    var allowedKeys = {};

    self.init = function() {
        initButtons();
        initDataStore();
        initInputs();
    };

    var initButtons = function() {
        attachMathEvent('.mathButton');
        attachClearEvent($('#clearButton'));
        attachEqualsEvent($('#equalButton'));
    };

    var initInputs = function() {
        math.placeholder.init($('#calcDisplay'));
        attachKeyEvent($('#calcDisplay'));
    };

    var initDataStore = function() {
        getAllowedKeys();
    };

    var attachMathEvent = function(button_class) {
        $('#calculator').on('click', button_class, function() {
            if($('#calcDisplay').hasClass('placeholder')) {
                $('#calcDisplay').removeClass("placeholder");
            }
            var value = $(this).attr('data-value');
            appendMathString(value);
            updateDisplay();
        });
    };

    var attachClearEvent = function(button) { 
        $(button).on('click', function() {
            resetDisplay();
        });
    };

    var attachEqualsEvent = function(button) {
        $(button).on('click', function() {
            setMathString(calculateResult());
            updateDisplay();
        });     
    };

    var attachKeyEvent = function(input) {
        $(input).on('keypress', function(e) {
            var key = e.which;
            /* only allow certain keys */
            if(allowedKeys[key] != undefined) {
                /* enter or equals key */
                if(key == 13 || key == 61) {
                    e.preventDefault();
                    setMathString(calculateResult());
                    updateDisplay();
                    mimicButtonPress(61);
                } else if(key == 8) {
                    resetDisplay();
                } else if(key != 0) {
                    if(math.placeholder.isDefaultValue($('#calcDisplay'))) {
                        $('#calcDisplay').removeClass("placeholder");
                        $('#calcDisplay').html('');
                    }
                    appendMathString(allowedKeys[key]);
                    mimicButtonPress(key);
                }
            } else {
                e.preventDefault();
            }
        });
    };

    var getAllowedKeys= function() {
        for(var i = 48, max=57, j=0; i<=max; i++, j++) {
            allowedKeys[i] = j;
        }
        allowedKeys[43] = '+';
        allowedKeys[45] = '-';
        allowedKeys[47] = '/';
        allowedKeys[42] = '*';
        allowedKeys[13] = 'Enter';
        allowedKeys[61] = '=';
        allowedKeys[8] = 'Delete';
        allowedKeys[0] = 'Other';
    };

    var mimicButtonPress = function(key) {
        var buttons = $('.calcButton');
        buttons.removeClass('pressed');

        var button = $('.calcButton[data-keyCode="'+key+'"]');
        button.addClass('pressed');
    };
 
    var updateDisplay = function(value){
        var display = $('#calcDisplay');
        var mathString = getMathString();
        if(mathString == '') {
            mathString = '0';
        } 
        display.html(mathString);
    };

    var resetDisplay = function() {
        clearMathString();
        updateDisplay();
        math.placeholder.reset($('#calcDisplay'));
        var buttons = $('.calcButton');
        buttons.removeClass('pressed');
    };

    var calculateResult = function() {
        return eval(getMathString());
    };

    var getMathString = function() {
        return mathString;
    };

    var setMathString = function(value) {
        mathString = value;
        return mathString;
    };

    var appendMathString = function(value) {
        return mathString+=value;
    };

    var clearMathString = function() {
        mathString = '';
        return mathString;
    };

    return self;

}());

math.placeholder = (function() {
    var self = {};

    self.init = function(input) {
        var placeholder = input.attr('data-placeholder');
        
        if(input[0].textContent.trim() == "") {
            input.addClass('placeholder');
            input.html(placeholder);
        }

        input.on('focus', function() {
            if(this.textContent.trim() == placeholder) {
                $(this).html("");
                $(this).removeClass("placeholder");
            }
        });
        input.on('blur', function() {
            if(this.textContent.trim() == "") {
                $(this).html(placeholder);
                $(this).addClass("placeholder");
            }
        });
    };

    self.reset = function(input) {
        var placeholder = input.attr('data-placeholder');
        input.addClass('placeholder');
        input.html(placeholder);
    };

    self.isDefaultValue = function(input) {

        if(input[0].textContent.trim() == "") {
            return true;
        } else {
            if(input[0].textContent.trim() == input.attr('data-placeholder')) {
                return true;
            }
        }
        return false;
    };

    return self;
    
}());