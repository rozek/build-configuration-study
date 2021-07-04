import throwError from 'throw-error';

/**** use:Timer={onTick} ****/
function Timer(Element, Options) {
    if (Options == null)
        throwError('MissingArgument: no "Options" given');
    if (typeof Options.onTick !== 'function')
        throwError('InvalidArgument: the given "onTick" callback is either missing ' +
            'or not a JavaScript function');
    setInterval(Options.onTick, 1000);
}

export default Timer;
//# sourceMappingURL=svelte-timer-action.esm.js.map
