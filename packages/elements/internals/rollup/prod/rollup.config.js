const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');
const postcss = require('rollup-plugin-postcss');

const buildAssetName = 'build/vaulty-js-sdk-elements';
module.exports = [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      name: 'VaultySDK',
      file: `${buildAssetName}.min.js`,
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
      postcss({
        extract: false,
        modules: true,
        use: ['sass'],
        minimize: true,
      }),
    ],
  },
];
