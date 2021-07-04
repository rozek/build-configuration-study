/**** use:Timer={onTick} ****/

  import throwError from 'throw-error'

  function Timer (Element:HTMLElement, Options:{ onTick:Function }):void {
    if (Options == null) throwError(
      'MissingArgument: no "Options" given'
    )

    if (typeof Options.onTick !== 'function') throwError(
      'InvalidArgument: the given "onTick" callback is either missing ' +
      'or not a JavaScript function'
    )

    setInterval(Options.onTick, 1000)
  }

  export default Timer

