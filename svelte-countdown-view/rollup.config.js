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
};