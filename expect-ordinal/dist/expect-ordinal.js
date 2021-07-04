(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('throw-error')) :
    typeof define === 'function' && define.amd ? define(['throw-error'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (function () {
        var current = global.expectOrdinal;
        var exports = global.expectOrdinal = factory(global.throwError);
        exports.noConflict = function () { global.expectOrdinal = current; return exports; };
    }()));
}(this, (function (throwError) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var throwError__default = /*#__PURE__*/_interopDefaultLegacy(throwError);

    /**** expectOrdinal ****/
    function expectOrdinal(Description, Argument) {
        if (Argument == null)
            throwError__default['default']('MissingArgument: no "' + Description + '" given');
        if ((typeof Argument !== 'number') && !(Argument instanceof Number))
            throwError__default['default']('InvalidArgument: the given "' + Description + '" is not a number');
        Argument = Argument.valueOf();
        if (isFinite(Argument) &&
            (Math.round(Argument) === Argument) && (Argument >= 0)) {
            return;
        }
        throwError__default['default']('InvalidArgument: the given "' + Description + '" is not an ordinal number');
    }

    return expectOrdinal;

})));
//# sourceMappingURL=expect-ordinal.js.map
