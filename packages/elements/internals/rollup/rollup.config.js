const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');
const postcss = require('rollup-plugin-postcss');

const buildAssetName = 'build/js-sdk-elements';
module.exports = [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      name: 'SDKElements',
      file: `${buildAssetName}.min.js`,
      format: 'umd',
    },
    plugins: [
      resolve({
        preferBuiltins: false,
      }),
      commonjs({
        include: /node_modules/,
      }),
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
        plugins: [
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-proposal-nullish-coalescing-operator',
          [
            'transform-define',
            {
              'process.env.NODE_ENV': process.env.NODE_ENV,
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
