module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        "targets": "> 0.25%, not dead",
      }
    ]
  ],
  env: {
    test: {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
    },
  },
};
