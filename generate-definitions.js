const dtsGenerator = require('dts-generator');

console.log('Building .d.ts file...');

dtsGenerator.default({
  name: 'preact-batteries',
  project: './src',
  out: './dist/preact-batteries.d.ts',
  main: "preact-batteries/index"
}).then(() => console.log('Done!'));