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

`throw-error` represents a simple module without any dependencies. The module has been written in TypeScript and exports a single function `throwError` which simply throws a named JavaScript `Error` built from a given message.

It may be used

* in a bundler as an (unbundled) ECMAScript module (ESM)
* in Node.js as an (unbundled) CommonJS module (CJS)
* in a browser as an (unbundled) AMD module or simply from a global variable
* within Svelte (unbundled)

Since `throw-error` does not have any dependencies, there is also no need for bundling.

### Tools used ###

### package.json ###

The full npm package description (`package.json`) can be found in the subfolder for this package within this repository. Shown here are the most important lines only (with some comments attached that should not find their way into the actual JSON file, though)

```
  "type": "module", // tell Node.js to prefer ESM over CJS
  "main":    "./dist/throw-error.js", // points to the UMD module
//"browser": "./dist/throw-error.js", // instead of "main" if pkg is for browsers only
  "module": "./dist/throw-error.esm.js", // points to the ESM module
  "svelte": "./dist/throw-error.esm.js", // points to what Svelte should use
  "types":  "./dist/throw-error.d.ts",   // points to type declarations
  "exports": {
    ".": {
      "require":"./dist/throw-error.js",    // "require" the UMD file
      "import": "./dist/throw-error.esm.js" // "import" the ESM file
    },
    "./package.json":"./package.json" // Svelte wants it so
  },
  "scripts": {
    "build": "rimraf dist && tsc && rollup -c rollup.config.js && mv src/*.d.ts dist/ && rm src/*.js",
    "agadoo":"agadoo",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

### rollup.config.js ###

## expected-ordinal ##

`expected-ordinal` represents a module with own dependencies. The module has been written in TypeScript and exports a single function `expectOrdinal` which checks if a given value is an ordinal JavaScript number and throws an error if not.

It may be used

* in a bundler as an (unbundled) ECMAScript module (ESM)
* in Node.js as a (partially) bundled or unbundled CommonJS module (CJS)
* in a browser as a (partially) bundled or unbundled AMD module or simply from a global variable
* within Svelte (unbundled)

Since `expected-ordinal` does have its own dependencies (in contrast to `throw-error`), the question arises whether it should be bundled or not.

### Tools used ###

### package.json ###

The full npm package description (`package.json`) can be found in the subfolder for this package within this repository. Shown here are the most important lines only (with some comments attached that should not find their way into the actual JSON file, though)

```
  "type": "module", // tell Node.js to prefer ESM over CJS
  "main":    "./dist/expect-ordinal.js", // points to the UMD module
//"browser": "./dist/expect-ordinal.bundled.js", // instead of "main" if pkg is for browsers only
  "module": "./dist/expect-ordinal.esm.js", // points to the ESM module
  "svelte": "./dist/expect-ordinal.esm.js", // points to what Svelte should use
  "types":  "./dist/expect-ordinal.d.ts",   // points to type declarations
  "exports": {
    ".": {
      "require":"./dist/expect-ordinal.js",    // "require" the UMD file
      "import": "./dist/expect-ordinal.esm.js" // "import" the ESM file
    },
    "./package.json":"./package.json" // Svelte wants it so
  },
  "scripts": {
    "build": "rimraf dist && tsc && rollup -c rollup.config.js && rollup -c rollup-bundling.config.js && mv src/*.d.ts dist/ && rm src/*.js",
    "agadoo":"agadoo",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

### rollup.config.js ###

## svelte-timer-action ##

`svelte-timer-action` represents a module (with dependencies) which has been specifically made for Svelte. The module has been written in TypeScript and exports a single function `Timer` which can be used as a Svelte action which invokes a given callback once a second.

Since `svelte-timer-action` may only be used within Svelte, there is never any need for bundling (as Svelte should always have access to the component's source code anyway). This restriction also simplifies configuration of the build chain.

### Tools used ###

### package.json ###

The full npm package description (`package.json`) can be found in the subfolder for this package within this repository. Shown here are the most important lines only (with some comments attached that should not find their way into the actual JSON file, though)

```
  "svelte": "./dist/svelte-timer-action.esm.js", // points to what Svelte should use
  "types":  "./dist/svelte-timer-action.d.ts",   // points to type declarations
  "exports": {
    "./package.json":"./package.json" // Svelte wants it so
  },
  "scripts": {
    "build": "rimraf dist && tsc && rollup -c rollup.config.js && mv src/*.d.ts dist/ && rm src/*.js*",
    "agadoo":"agadoo",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

### rollup.config.js ###

## svelte-countdown-view ##

`svelte-countdown-view` represents a Svelte component (with dependencies). The component has been written in TypeScript and exports a simple countdown timer.

It may be used

* in a bundler as an (unbundled) ECMAScript module (ESM)
* in Node.js as a (partially) bundled or unbundled CommonJS module (CJS)
* in a browser as a (partially) bundled or unbundled AMD module or simply from a global variable
* within Svelte (unbundled)

In contrast to `expected-ordinal`, the build chain for this module now also has to include the Svelte compiler.

### Tools used ###

### package.json ###

The full npm package description (`package.json`) can be found in the subfolder for this package within this repository. Shown here are the most important lines only (with some comments attached that should not find their way into the actual JSON file, though)

```
  "type": "module", // tell Node.js to prefer ESM over CJS
  "browser": "./dist/svelte-countdown-view.bundled.js", // because pkg is for browsers only
  "module": "./dist/svelte-countdown-view.esm.js", // points to the ESM module
  "svelte": "./dist/svelte-countdown-view.svelte", // points to what Svelte should use
  "types":  "./dist/svelte-countdown-view.d.ts",   // points to type declarations
  "exports": {
    ".": {
      "require":"./dist/svelte-countdown-view.js",    // "require" the UMD file
      "import": "./dist/svelte-countdown-view.esm.js" // "import" the ESM file
    },
    "./package.json":"./package.json" // Svelte wants it so
  },
  "scripts": {
    "build": "rimraf dist && tsc && rollup -c rollup.config.js && rollup -c rollup-bundling.config.js && rollup -c rollup-bundling.config.js && mv src/*.d.ts dist/ && rm src/*.js",
    "agadoo":"agadoo",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

### rollup.config.js ###
