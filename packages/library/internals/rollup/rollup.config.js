import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import alias from '@rollup/plugin-alias';
import pkg from '../../package.json';

const devBuildAssets = {
  main: 'devTmp/js-sdk.cjs.js',
  module: 'devTmp/js-sdk.esm.js',
  browser: 'devTmp/js-sdk.min.js',
};
const isDevelopmentBuild = Boolean(process.env.ROLLUP_WATCH);
const sourcemap = isDevelopmentBuild ? 'inline' : false;

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      name: 'SDK',
      file: isDevelopmentBuild ? devBuildAssets.browser : pkg.browser,
      format: 'umd',
      sourcemap,
    },
    plugins: [
      alias({
        entries: [
          // use browser version of crypto
          { find: 'crypto', replacement: '@js-sdk/utils/src/helpers/crypto' },
        ],
      }),
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
        ],
        exclude: ['node_modules/**'],
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
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: 'src/index.js',
    output: [
      {
        file: isDevelopmentBuild ? devBuildAssets.main : pkg.main,
        format: 'cjs',
        sourcemap,
      },
      {
        file: isDevelopmentBuild ? devBuildAssets.module : pkg.module,
        format: 'esm',
        sourcemap,
      },
    ],
    plugins: [
      babel({
        babelrc: false,
        presets: [
          [
            '@babel/env',
          ],
        ],
        plugins: [
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-proposal-nullish-coalescing-operator',
        ],
        exclude: ['node_modules/**'],
      }),
    ],
  },
];
