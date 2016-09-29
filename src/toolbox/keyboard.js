

var Keyboard = (function () {
    
    var keys = {};
    
    window.onkeydown = function (e) {
        keys[e.code] = true;
    }
    
    window.onkeyup = function (e) {
        keys[e.code] = false;
    }
    
    return {
        isKeyDown: function (code) {
            return keys[code];
        }
    }
    
})();
    
