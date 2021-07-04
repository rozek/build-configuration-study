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
