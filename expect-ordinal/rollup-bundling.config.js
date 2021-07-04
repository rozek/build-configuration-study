import commonjs   from '@rollup/plugin-commonjs'
import resolve    from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript';
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
};