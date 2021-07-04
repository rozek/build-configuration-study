import commonjs   from '@rollup/plugin-commonjs'
import resolve    from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript';
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
};