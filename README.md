# build-configuration-study #

How difficult can it be to configure a modern JavaScript build chain? VERY

... but it *is* feasible!

## Background Information ##

Nowadays, web applications often consist of many modules, which in turn can also be made up of modules themselves.

Above a certain number, the individual loading of each module by the browser takes too long - that's why developers usually bundle many small modules together into larger ones.

Since often not all exported values and functions are needed from individual modules, a process called "tree shaking" is used to remove all unnecessary exports during bundling.

Unfortunately, the requirements of a "bundler" for the modules to be used are different from those of a browser. In addition, some environments (such as, e.g., Node.js or Svelte) have further requirements that must also be met. And those who do not program in native JavaScript but require a preprocessor (as in the case of TypeScript, for example) face further difficulties.

And to top it all off, a programmer has to painstakingly gather the individual requirements from the Internet - taking into account only the relevant ones and neglecting all outdated (or possibly even incorrect) publications.

The author has walked this rocky road for the following underlying conditions:

* creating Svelte components (in general, or Svelte applications in particular)
* creating JavaScript modules specifically for Svelte
* creating general purpose JavaScript modules
* programming in TypeScript
* bundling et al. using rollup
* publishing as npm package

### Relevance for Programmers with other Constraints ###

* **Developers not using Svelte**
	* may simply ignore the creation of Svelte components or modules which are specifically made for Svelte
	* but should definitely still consider the `svelte` field in `package.json` files to facilitate the use of their modules for Svelte users
* **non-TypeScript Programmers**<br>just replace TypeScript with a preprocessor of their choice and adjust the rollup plugins accordingly
* **users of other bundlers than Rollup**<br>may still follow the requirements for `package.json` files and configure the bundler of thier choice accordingly
* **Developers not publishing npm packages**<br>may still have to create the artifacts mentioned in `package.json` files even if they deploy them in other ways

### Practical Examples ###

The patterns shown below have been backed (and verified) by practical (albeit artificially constructed) examples:

* `throw-error` represents a simple module without any dependencies
* `expected-ordinal` represents a module with own dependencies
* `svelte-timer-action` represents a module (with dependencies) which has been specifically made for Svelte
* `svelte-countdown-view` represents a Svelte component (with dependencies, Svelte applications are just special forms of Svelte components)

For each of these use cases, the files

* `package.json` and
* `rollup.config.js`

are described and the tools used mentioned.

In the end, the different parts are each assembled into a web page that uses bundled or unbundled artifacts.

## throw-error ##

`throw-error` represents a simple module without any dependencies. The module has been written in TypeScript and

## expected-ordinal ##

`expected-ordinal` represents a module with own dependencies. The module has been written in TypeScript and

## svelte-timer-action ##

`svelte-timer-action` represents a module (with dependencies) which has been specifically made for Svelte. The module has been written in TypeScript and

## svelte-countdown-view ##

`svelte-countdown-view` represents a Svelte component (with dependencies). The component has been written in TypeScript and
