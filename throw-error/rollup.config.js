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