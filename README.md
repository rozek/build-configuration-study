# build-configuration-study #

How difficult can it be to configure a modern JavaScript build chain? VERY

... but it *is* feasible!

## Background Information ##

Nowadays, web applications often consist of many modules, which in turn can also be made up of modules themselves.

Above a certain number, the individual loading of each module by the browser takes too long - that's why developers usually bundle many small modules together into larger ones.

Since often not all exported values and functions are needed from individual modules, a process called "tree shaking" is used to remove all unnecessary exports during bundling.

Unfortunately, the requirements of a "bundler" for the modules to be used are different from those of a browser. In addition, some environments (such as, e.g., Node.js or Svelte) have further requirements that must also be met. And those who do not program in native JavaScript but require a preprocessor (as in the case of TypeScript, for example) face further difficulties.

And to top it all off, a programmer has to painstakingly gather the individual requirements from the Internet - taking into account only the relevant ones and neglecting all outdated (or possibly even incorrect) publications.

The author has walked this rocky road for the following scenarios:

* creating Svelte components (in general, or Svelte applications in particular)
* creating JavaScript modules specifically for Svelte
* creating general purpose JavaScript modules

under the following conditions

* programming in TypeScript
* bundling (and preprocessing et al.) using rollup
* publishing as npm package

### Relevance for Programmers with different Development Environments ###

* **Developers not using Svelte**
	* may simply ignore the creation of Svelte components or modules which are specifically made for Svelte
	* but should definitely still consider the `svelte` field in `package.json` files to facilitate the use of their modules for Svelte users
* **non-TypeScript Programmers**<br>just replace TypeScript with a preprocessor of their choice and adjust the rollup plugins accordingly
* **users of other bundlers than Rollup**<br>may still follow the requirements for `package.json` files and configure the bundler of their choice accordingly
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

In the end, the different parts are each assembled into a web page that uses bundled or unbundled artifacts: just load the files `example-with-bundled-component.html` or `example-with-unbundled-component.html`, resp., into your browser.

## throw-error ##

`throw-error` represents a simple module without any dependencies. The module has been written in TypeScript and exports a single function `throwError` which simply throws a named JavaScript `Error` built from a given message.

It may be used

* in a bundler as an (unbundled) ECMAScript module (ESM)
* in Node.js as an (unbundled) CommonJS module (CJS)
* in a browser as an (unbundled) AMD module or simply from a global variable
* within Svelte (unbundled)

Since `throw-error` does not have any dependencies, there is also no need for any bundling.

### Tools used ###

The author often uses the following set of tools for building JavaScript modules written in TypeScript

* `npm init` (you will have to answer some questions)<br>because the modules are going to be published using npm
* `npm install --save-dev rollup`<br>that's the bundler the author uses (standard bundler for svelte)
* `npm install --save-dev typescript`<br>because the author now only programs in TypeScript
* `npm install --save-dev rimraf`<br>to cleanup folders at the beginning of a new build
* `npm install --save-dev @rollup/plugin-typescript`<br>to let rollup handle TypeScript properly
* `npm install --save-dev rollup-plugin-terser`<br>for (optional) minification
* `npm install --save-dev agadoo`<br>`agadoo` helps validating that the built (unbundled) artifact can be "tree-shaken"

Since this module does not have any dependencies, Rollup does not have to be told how to find and handle CommonJS modules

### package.json ###

The full npm package description (`package.json`) can be found in the subfolder for this package within this repository. Shown here are the most important lines only (with some comments attached that should not find their way into the actual JSON file, though)

```
  "type": "module", // tell Node.js to prefer ESM over CJS zu
  "main":    "./dist/throw-error.js", // points to the UMD module, UNPKG needs it
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
    "build": "rimraf dist && rollup -c rollup.config.js && tsc && mv src/*.d.ts dist/ && rm src/*.js",
    "agadoo":"agadoo",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

Note: the extra invocation of the TypeScript compiler (`tsc`) is required in order to properly generate a type declaration file (see [issue 105](https://github.com/rollup/plugins/issues/105) of the `@rollup/plugin-typescript` plugin - if you don't need such a file, you may safely remove the whole `&& tsc && mv src/*.d.ts dist && rm src/*.js` command chain from the "scripts.build" line.

### rollup.config.js ###

The `rollup.config.js` shown below configures Rollup for two runs:

* the first iteration creates an UMD module (which serves the need for CJS and AMD modules and a global variable pointing to the module's export
* the second run creates the unbundled ECMAScript module

```
import typescript from '@rollup/plugin-typescript'
//import { terser } from 'rollup-plugin-terser' // uncomment for minification

export default {
  input: './src/throw-error.ts',
  output: [
    {
      file:     './dist/throw-error.js',
      format:    'umd',        // builds for both Node.js and Browser
      name:      'throwError', // required for UMD modules
      noConflict:true,
      exports:   'default',
      sourcemap: true,
//    plugins: [terser({ format:{ comments:false, safari10:true } })], // dto.
    },{
      file:     './dist/throw-error.esm.js',
      format:   'esm',
      sourcemap:true,
    }
  ],
  plugins: [
    typescript(),
  ],
}
```

If you want the UMD module to be minified, just uncomment the lines mentioning the `terser`.

### tsconfig.json ###

`tsconfig.json` is used to configure the TypeScript compiler. The full configuration can be found in the subfolder for this package within this repository. Shown here are the most important lines only - in contrast to `package.json`, this file *may* contain comments.

```
  "include":["./src/**/*.ts"],
  "exclude":[],
  "compilerOptions": {
    "module": "ESNext",   /* rollup wants it so */
    "declaration": true,  /* for a '.d.ts' file */
    "outDir":  "./",
    "rootDir": "./",

    "moduleResolution": "node", /* to work with NPM packages */
    "esModuleInterop":  true,   /* for interoperability between CJS and ESM */
  }
```

## expect-ordinal ##

`expect-ordinal` represents a module with own dependencies. The module has been written in TypeScript and exports a single function `expectOrdinal` which checks if a given value is an ordinal JavaScript number and throws an error if not.

It may be used

* in a bundler as an (unbundled) ECMAScript module (ESM)
* in Node.js as a (partially) bundled or unbundled CommonJS module (CJS)
* in a browser as a (partially) bundled or unbundled AMD module or simply from a global variable
* within Svelte (unbundled)

Since `expect-ordinal` does have its own dependencies (in contrast to `throw-error`), the need for (fully or partially) bundled artifact may arise.

### Tools used ###

Since `expect-ordinal` does have its own dependencies (in form of npm packages), Rollup has to be instructed how to find and handle them:

* `npm init` (you will have to answer some questions)<br>because the modules are going to be published using npm
* `npm install --save-dev rollup`<br>that's the bundler the author uses (standard bundler for svelte)
* `npm install --save-dev typescript`<br>because the author now only programs in TypeScript
* `npm install --save-dev rimraf`<br>to cleanup folders at the beginning of a new build
* `npm install --save-dev @rollup/plugin-node-resolve`<br>to allow rollup looking for installed npm modules
* `npm install --save-dev @rollup/plugin-commonjs`<br>because npm modules are still often CJS modules (rather than ECMAScript modules)
* `npm install --save-dev @rollup/plugin-typescript`<br>to let rollup handle TypeScript properly
* `npm install --save-dev rollup-plugin-terser`<br>for (optional) minification
* `npm install --save-dev agadoo`<br>`agadoo` helps validating that the built (unbundled) artifact can be "tree-shaken"

### package.json ###

The full npm package description (`package.json`) can be found in the subfolder for this package within this repository. Shown here are the most important lines only (with some comments attached that should not find their way into the actual JSON file, though)

```
  "type": "module", // tell Node.js to prefer ESM over CJS
  "main":    "./dist/expect-ordinal.js", // points to the UMD module, UNPKG needs it
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
    "build": "rimraf dist && rollup -c rollup.config.js && rollup -c rollup-bundling.config.js && tsc && mv src/*.d.ts dist/ && rm src/*.js",
    "agadoo":"agadoo",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

This variant of `package.json` reflects the fact that the module is built once with and once without bundling.

Note: the extra invocation of the TypeScript compiler (`tsc`) is required in order to properly generate a type declaration file (see [issue 105](https://github.com/rollup/plugins/issues/105) of the `@rollup/plugin-typescript` plugin - if you don't need such a file, you may safely remove the whole `&& tsc && mv src/*.d.ts dist && rm src/*.js` command chain from the "scripts.build" line.

### rollup.config.js ###

If no (or only partial) bundling is wanted, the `rollup.config.js` should list all packages that should *not* be bundled and specify a global variable name for each of them:

```
import commonjs   from '@rollup/plugin-commonjs'
import resolve    from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
//import { terser } from 'rollup-plugin-terser' // uncomment for minification

export default {
  input: './src/expect-ordinal.ts',
  external:['throw-error'],                  // list of (unbundled) dependencies
  output: [
    {
      file:     './dist/expect-ordinal.js',
      format:    'umd',           // builds for both Node.js and Browser
      name:      'expectOrdinal', // required for UMD modules
      globals:   { 'throw-error':'throwError' },  // globals for unbundled dep.s
      noConflict:true,
      exports:   'default',
      sourcemap: true,
//    plugins: [terser({ format:{ comments:false, safari10:true } })],
    },{
      file:     './dist/expect-ordinal.esm.js',
      format:   'esm',
      sourcemap:true,
    }
  ],
  plugins: [
    resolve(), commonjs(), typescript(),
  ],
}
```

### rollup-bundling.config.js ###

If bundling is wanted, the need for the field `external` and `option.globals` no longer exists:

```
import commonjs   from '@rollup/plugin-commonjs'
import resolve    from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
//import { terser } from 'rollup-plugin-terser' // uncomment for minification

export default {
  input: './src/expect-ordinal.ts',
  output:{
    file:     './dist/expect-ordinal.bundled.js',
    format:    'umd',           // builds for both Node.js and Browser
    name:      'expectOrdinal', // required for UMD modules
    noConflict:true,
    exports:   'default',
    sourcemap: true,
//  plugins: [terser({ format:{ comments:false, safari10:true } })],
  },
  plugins: [
    resolve(), commonjs(), typescript(),
  ],
}
```

### tsconfig.json ###

`tsconfig.json` is used to configure the TypeScript compiler. The full configuration can be found in the subfolder for this package within this repository. Shown here are the most important lines only - in contrast to `package.json`, this file *may* contain comments.

```
  "include":["./src/**/*.ts"],
  "exclude":[],
  "compilerOptions": {
    "module": "ESNext",   /* rollup wants it so */
    "declaration": true,  /* for a '.d.ts' file */
    "outDir":  "./",
    "rootDir": "./",

    "moduleResolution": "node", /* to work with NPM packages */
    "esModuleInterop":  true,   /* for interoperability between CJS and ESM */
  }
```

## svelte-timer-action ##

`svelte-timer-action` represents a module (with dependencies) which has been specifically made for Svelte. The module has been written in TypeScript and exports a single function `Timer` which can be used as a Svelte action invoking a given callback once a second.

Since `svelte-timer-action` may only be used within Svelte, there is never any need for bundling (as Svelte should always have access to the component's source code anyway). This restriction also simplifies configuration of the build chain.

### Tools used ###

Since Svelte should always get access to the source code of a module (perhaps after any preprocessing - e.g., transpilation), there is no need for bundling and minification:

* `npm init` (you will have to answer some questions)<br>because the modules are going to be published using npm
* `npm install --save-dev rollup`<br>that's the bundler the author uses (standard bundler for svelte)
* `npm install --save-dev typescript`<br>because the author now only programs in TypeScript
* `npm install --save-dev rimraf`<br>to cleanup folders at the beginning of a new build
* `npm install --save-dev @rollup/plugin-node-resolve`<br>to allow rollup looking for installed npm modules
* `npm install --save-dev @rollup/plugin-commonjs`<br>because npm modules are still often CJS modules (rather than ECMAScript modules)
* `npm install --save-dev @rollup/plugin-typescript`<br>to let rollup handle TypeScript properly
* `npm install --save-dev agadoo`<br>`agadoo` helps validating that the built (unbundled) artifact can be "tree-shaken"

Similar to `throw-error` you may omit `@rollup/plugin-node-resolve` and `@rollup/plugin-commonjs` if your action does not have any dependencies.

### package.json ###

The full npm package description (`package.json`) can be found in the subfolder for this package within this repository. Shown here are the most important lines only (with some comments attached that should not find their way into the actual JSON file, though)

```
  "module": "./dist/svelte-timer-action.esm.js",
  "svelte": "./dist/svelte-timer-action.esm.js", // points to what Svelte should use
  "types":  "./dist/svelte-timer-action.d.ts",   // points to type declarations
  "exports": {
    "./package.json":"./package.json" // Svelte wants it so
  },
  "scripts": {
    "build": "rimraf dist && rollup -c rollup.config.js && tsc && mv src/*.d.ts dist/ && rm src/*.js*",
    "agadoo":"agadoo ./dist/svelte-timer-action.esm.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

Note I: the extra invocation of the TypeScript compiler (`tsc`) is required in order to properly generate a type declaration file (see [issue 105](https://github.com/rollup/plugins/issues/105) of the `@rollup/plugin-typescript` plugin - if you don't need such a file, you may safely remove the whole `&& tsc && mv src/*.d.ts dist && rm src/*.js` command chain from the "scripts.build" line.

Note II: the "agadoo" script had to be changed since there is no longer a `main` field in this package description.

Note III: you may still decide to treat Svelte actions like any other JavaScript module and, e.g., build an UMD module which can be loaded separately into a browser (but do not forget to add a `main` or `browse` field to your `package.json`: [unpkg](https://unpkg.com/) needs it) - it's just that this situation rarely occurs, which is why the action will be partially bundled into the Svelte view in this example.

### rollup.config.js ###

Again, in order to avoid bundling, a list of all external dependencies should be provided - however, the need for specifying global variable names does not apply:

```
import commonjs   from '@rollup/plugin-commonjs'
import resolve    from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export default {
  input: './src/svelte-timer-action.ts',
  external:['throw-error'],                  // list of (unbundled) dependencies
  output: {
    file:     './dist/svelte-timer-action.esm.js',
    format:   'esm',
    sourcemap:true,
  },
  plugins: [
    resolve({ browser:true, dedupe:['svelte'] }), commonjs(), typescript(),
  ],
}
```

Similar to `throw-error` you may omit any `commonjs` and `resolve` imports and invocations if your action does not have any dependencies.

### tsconfig.json ###

`tsconfig.json` is used to configure the TypeScript compiler. The full configuration can be found in the subfolder for this package within this repository. Shown here are the most important lines only - in contrast to `package.json`, this file *may* contain comments.

```
  "include":["./src/**/*.ts"],
  "exclude":[],
  "compilerOptions": {
    "module": "ESNext",   /* rollup wants it so */
    "declaration": true,  /* for a '.d.ts' file */
    "outDir":  "./",
    "rootDir": "./",

    "moduleResolution": "node", /* to work with NPM packages */
    "esModuleInterop":  true,   /* for interoperability between CJS and ESM */
  }
```

## svelte-countdown-view ##

`svelte-countdown-view` represents a Svelte component (with dependencies). The component has been written in TypeScript and exports a simple countdown timer.

It may be used

* in a bundler as an (unbundled) ECMAScript module (ESM)
* in Node.js as a (partially) bundled or unbundled CommonJS module (CJS)
* in a browser as a (partially) bundled or unbundled AMD module or simply from a global variable
* within Svelte (unbundled)

In contrast to `expected-ordinal`, the build chain for this module now also has to include the Svelte compiler.

### Tools used ###

Now that the Svelte compiler has to be used, the list of tools becomes a little bit longer:

* `npm init` (you will have to answer some questions)<br>because the modules are going to be published using npm
* `npm install --save-dev rollup`<br>that's the bundler the author uses (standard bundler for svelte)
* `npm install --save-dev typescript`<br>because the author now only programs in TypeScript
* `npm install --save-dev rimraf`<br>to cleanup folders at the beginning of a new build
* `npm install --save-dev @rollup/plugin-node-resolve`<br>to allow rollup looking for installed npm modules
* `npm install --save-dev @rollup/plugin-commonjs`<br>because npm modules are still often CJS modules (rather than ECMAScript modules)
* `npm install --save-dev @rollup/plugin-typescript`<br>to let rollup handle TypeScript properly
* `npm install --save-dev svelte rollup-plugin-svelte`<br>to let rollup handle Svelte components properly
* `npm install --save-dev svelte-preprocess`<br>because Svelte files contain HTML, CSS and JavaScript all together
* `npm install --save-dev @tsconfig/svelte`<br>TypeScript compiler configuration defaults for Svelte
* `npm install --save-dev rollup-plugin-postcss`<br>because Svelte files also contain CSS
* `npm install --save-dev save-to-file`<br>writes the results of the Svelte preprocessing step into a file (see [save-to-file](https://github.com/rozek/save-to-file))
* `npm install --save-dev rollup-plugin-terser`<br>for (optional) minification

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
    "build": "rimraf dist && rollup -c rollup.config.js && rollup -c rollup-bundling.config.js && tsc && mv src/*.d.ts dist/ && rm src/*.js",
    "agadoo":"agadoo",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

Note: the extra invocation of the TypeScript compiler (`tsc`) is required in order to properly generate a type declaration file (see [issue 105](https://github.com/rollup/plugins/issues/105) of the `@rollup/plugin-typescript` plugin - if you don't need such a file, you may safely remove the whole `&& tsc && mv src/*.d.ts dist && rm src/*.js` command chain from the "scripts.build" line.

### rollup.config.js ###

Again, it could be useful to create (partially) bundled and unbundled artifacts - here is the configuration for unbundled (or only partially bundled) ones (listing all modules that should not be bundled together with their global variable names):

```
import svelte         from 'rollup-plugin-svelte'
import commonjs       from '@rollup/plugin-commonjs'
import resolve        from '@rollup/plugin-node-resolve'
import autoPreprocess from 'svelte-preprocess'
import typescript     from '@rollup/plugin-typescript'
import postcss        from 'rollup-plugin-postcss'
import saveToFile     from 'save-to-file'
//import { terser } from 'rollup-plugin-terser' // uncomment for minification

export default {
  input: './src/index.ts',
  external:[                                 // list of (unbundled) dependencies
    'throw-error','expect-ordinal', // 'svelte-timer-action' // partial bundling
  ],
  output: [
    {
      file:     './dist/svelte-countdown-view.js',
      format:    'umd',           // builds for both Node.js and Browser
      name:      'CountdownView', // required for UMD modules
      globals:   {                         // globals for unbundled dependencies
        'throw-error':'throwError',
        'expect-ordinal':'expectOrdinal',
//      'svelte-timer-action':'Timer'                        // partial bundling
      },
      noConflict:true,
      exports:   'default',
      sourcemap: true,
//    plugins: [terser({ format:{ comments:false, safari10:true } })],
    },{
      file:     './dist/svelte-countdown-view.esm.js',
      format:   'esm',
      sourcemap:true,
    }
  ],
  plugins: [
    svelte({ preprocess:[
      autoPreprocess({ aliases:[['ts','typescript']] }),
      saveToFile('./dist/svelte-countdown-view.svelte')
    ]}),
    resolve({ browser:true, dedupe:['svelte'] }), commonjs(), typescript(),
    postcss({ extract:false, inject:{insertAt:'top'} }),
  ],
}
```

### rollup-bundling.config.js ###

The Rollup configuration for bundled artefacts is simple - as usual:

```
import svelte         from 'rollup-plugin-svelte'
import commonjs       from '@rollup/plugin-commonjs'
import resolve        from '@rollup/plugin-node-resolve'
import autoPreprocess from 'svelte-preprocess'
import typescript     from '@rollup/plugin-typescript'
import postcss        from 'rollup-plugin-postcss'
//import { terser } from 'rollup-plugin-terser' // uncomment for minification

export default {
  input: './src/index.ts',
  output:{
    file:     './dist/svelte-countdown-view.bundled.js',
    format:    'umd',           // builds for both Node.js and Browser
    name:      'CountdownView', // required for UMD modules
    noConflict:true,
    exports:   'default',
    sourcemap: true,
//  plugins: [terser({ format:{ comments:false, safari10:true } })],
  },
  plugins: [
    svelte({ preprocess:[
      autoPreprocess({ aliases:[['ts','typescript']] })
    ]}),
    resolve({ browser:true, dedupe:['svelte'] }), commonjs(), typescript(),
    postcss({ extract:false, inject:{insertAt:'top'} }),
  ],
}
```

### tsconfig.json ###

`tsconfig.json` is used to configure the TypeScript compiler. The full configuration can be found in the subfolder for this package within this repository. Shown here are the most important lines only - in contrast to `package.json`, this file *may* contain comments.

The Svelte compiler requires some modifications compared to the configuration used for the other modules.

```
  "extends": "@tsconfig/svelte/tsconfig.json",

  "include": ["src/**/*.ts"],
  "exclude": ["node_modules/*", "__sapper__/*", "public/*"],
  "compilerOptions": {
    "module": "ESNext",   /* rollup wants it so */
    "declaration": true,  /* for a '.d.ts' file */
    "outDir":  "./",
    "rootDir": "./",

    "moduleResolution": "node", /* to work with NPM packages */
    "esModuleInterop":  true,   /* for interoperability between CJS and ESM */
  }
```

## License ##

[MIT License](LICENSE.md)
