import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';

import pkg from '../../package.json';

const dependenciesToList = (dependencies) => (
  Object.keys(dependencies)
    .filter((dependency) => !dependency.includes('@js-sdk'))
);
const devBuildAssets = {
  main: 'devTmp/js-sdk.cjs.js',
  module: 'devTmp/js-sdk.esm.js',
  browser: 'devTmp/js-sdk.min.js',
};
const isDevelopmentBuild = Boolean(process.env.ROLLUP_WATCH);
const sourcemap = isDevelopmentBuild ? 'inline' : false;
const externalDependencies = [
  ...dependenciesToList(pkg.dependencies),
  ...dependenciesToList(pkg.devDependencies),
];

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      name: 'SDK',
      file: isDevelopmentBuild ? devBuildAssets.browser : pkg.browser,
      format: 'iife',
      sourcemap,
    },
    plugins: [
      resolve({
        browser: true,
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
    external: [
      ...externalDependencies,
      'crypto',
    ],
    plugins: [
      resolve({
        preferBuiltins: true,
      }),
      commonjs({
        include: /node_modules/,
      }),
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
