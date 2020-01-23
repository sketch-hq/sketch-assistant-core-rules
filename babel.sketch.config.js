module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          safari: '11', // Targetting JavaScriptCore
        },
      },
    ],
    '@babel/typescript',
  ],
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    'macros',
  ],
  ignore: ['src/global.d.ts', '**/__tests__', '**/*.test.ts'],
}
