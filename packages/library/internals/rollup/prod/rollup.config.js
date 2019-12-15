import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from '../../../package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      name: 'VaultySDK',
      file: pkg.browser,
      format: 'umd',
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelrc: false,
        presets: [
          [
            '@babel/env',
            {
              targets: {
                browsers: '> 0.25%, not dead',
                ie: '11',
              },
            },
          ],
        ],
        exclude: ['node_modules/**'],
      }),
      terser({
        output: {
          comments: false,
        },
      }),
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'esm' },
    ],
    plugins: [
      babel({
        babelrc: false,
        presets: [
          [
            '@babel/env',
          ],
        ],
        exclude: ['node_modules/**'],
      }),
    ],
  },
];
