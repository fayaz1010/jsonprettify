const ts = require("typescript");

module.exports = {
  process(sourceText, sourcePath) {
    if (sourcePath.endsWith(".ts") || sourcePath.endsWith(".tsx")) {
      const result = ts.transpileModule(sourceText, {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2017,
          jsx: ts.JsxEmit.ReactJSX,
          esModuleInterop: true,
          allowJs: true,
          sourceMap: false,
        },
        fileName: sourcePath,
      });
      return { code: result.outputText };
    }
    return { code: sourceText };
  },
};
