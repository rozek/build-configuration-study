(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (function () {
        var current = global.throwError;
        var exports = global.throwError = factory();
        exports.noConflict = function () { global.throwError = current; return exports; };
    }()));
}(this, (function () { 'use strict';

    /**** throwError ****/
    function throwError(Message) {
        var Match = /^([$a-zA-Z][$a-zA-Z0-9]*):\s*(\S.+)\s*$/.exec(Message);
        if (Match == null) {
            throw new Error(Message);
        }
        else {
            var namedError = new Error(Match[2]);
            namedError.name = Match[1];
            throw namedError;
        }
    }

    return throwError;

})));
//# sourceMappingURL=throw-error.js.map
