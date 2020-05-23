const { default: resolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');
const postcss = require('rollup-plugin-postcss');
const alias = require('@rollup/plugin-alias');
const visualizer = require('rollup-plugin-visualizer');
const image = require('@rollup/plugin-image');

const prodBuildAssetName = 'build/js-sdk-elements.min.js';
const devBuildAssetName = 'devTmp/js-sdk-elements.js';

const isDevelopmentBuild = process.env.NODE_ENV === 'development';
const sourcemap = isDevelopmentBuild ? 'inline' : false;

module.exports = [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      name: 'SDKElements',
      file: isDevelopmentBuild ? devBuildAssetName : prodBuildAssetName,
      format: 'umd',
      sourcemap,
    },
    plugins: [
      alias({
        entries: [
          // use browser version of crypto
          { find: 'crypto', replacement: '@js-sdk/common/src/helpers/crypto' },
        ],
      }),
      resolve({
        preferBuiltins: false,
      }),
      commonjs({
        include: /node_modules/,
      }),
      image(),
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
      postcss({
        extract: false,
        modules: true,
        use: ['sass'],
        minimize: true,
      }),
      // enable terser for production
      (
        isDevelopmentBuild
          ? undefined
          : terser({
            output: {
              comments: false,
            },
          })
      ),
      // enable build analyzer (visualizer)
      (
        isDevelopmentBuild
          ? undefined
          : visualizer({
            title: 'SDK library',
            filename: './build/stats.html',
          })
      ),
    ],
  },
];
