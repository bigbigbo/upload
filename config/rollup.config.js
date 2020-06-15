import path from 'path';

import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import url from 'rollup-plugin-url';
import autoprefixer from 'autoprefixer';

const paths = {
  input: path.resolve(__dirname, '../src/lib/index.js')
};

export default {
  input: paths.input,
  external: ['react', 'react-dom', 'antd', 'cropperjs', 'react-cropper'],
  output: [
    {
      name: 'Upload',
      format: 'umd',
      file: 'dist/lib/index.js',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        antd: 'antd',
        cropperjs: 'cropperjs',
        'react-cropper': 'ReactCropper'
      }
    }
  ],
  plugins: [
    resolve(),
    babel({
      exclude: '**/node_modules/**',
      runtimeHelpers: true
    }),
    commonjs(),
    postcss({
      extensions: ['.css', '.scss'],
      plugins: [autoprefixer()]
    }),
    url({
      limit: 10 * 1024 // inline files < 10k, copy files > 10k
    })
    // uglify({
    //   compress: {
    //     drop_debugger: true,
    //     drop_console: true
    //   }
    // })
  ]
};
