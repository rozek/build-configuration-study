(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (function () {
        var current = global.expectOrdinal;
        var exports = global.expectOrdinal = factory();
        exports.noConflict = function () { global.expectOrdinal = current; return exports; };
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

    /**** expectOrdinal ****/
    function expectOrdinal(Description, Argument) {
        if (Argument == null)
            throwError('MissingArgument: no "' + Description + '" given');
        if ((typeof Argument !== 'number') && !(Argument instanceof Number))
            throwError('InvalidArgument: the given "' + Description + '" is not a number');
        Argument = Argument.valueOf();
        if (isFinite(Argument) &&
            (Math.round(Argument) === Argument) && (Argument >= 0)) {
            return;
        }
        throwError('InvalidArgument: the given "' + Description + '" is not an ordinal number');
    }

    return expectOrdinal;

})));
//# sourceMappingURL=expect-ordinal.bundled.js.map
