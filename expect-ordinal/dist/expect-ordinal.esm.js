import throwError from 'throw-error';

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

export default expectOrdinal;
//# sourceMappingURL=expect-ordinal.esm.js.map
