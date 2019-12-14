import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  plugins: [
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
    }),
    terser({
      output: {
        comments: false,
      },
      include: [/^.+\.min\.js$/],
    }),
  ],
  output: [
    // Browser bundle
    {
      file: './build/vaulty-js-sdk.min.js',
      format: 'iife',
      name: 'VaultySDK',
    },
    // Bundle for using in imports
    {
      file: './build/vaulty-js-sdk.esm.js',
      format: 'esm',
    },
  ],
};
