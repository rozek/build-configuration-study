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