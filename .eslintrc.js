require("@rushstack/eslint-config/patch/modern-module-resolution");
module.exports = {
  extends: ["@microsoft/eslint-config-spfx/lib/profiles/default"],
  plugins: ["react-hooks"],
  parserOptions: { tsconfigRootDir: __dirname },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: 2018,
        sourceType: "module"
      },
      rules: {
        "@typescript-eslint/no-explicit-any": 1,
        "@typescript-eslint/no-floating-promises": 2,
        "@typescript-eslint/explicit-function-return-type": [
          1,
          { allowExpressions: true, allowTypedFunctionExpressions: true, allowHigherOrderFunctions: false }
        ],
        "@rushstack/no-new-null": 0,
        "react-hooks/rules-of-hooks": 2,
        "react-hooks/exhaustive-deps": 1
      }
    }
  ]
};
