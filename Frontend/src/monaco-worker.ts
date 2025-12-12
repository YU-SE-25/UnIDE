self.MonacoEnvironment = {
  getWorker(_, label) {
    // JS / TS
    if (label === "javascript" || label === "typescript") {
      return new Worker(
        new URL(
          "monaco-editor/esm/vs/language/typescript/ts.worker.js",
          import.meta.url
        ),
        { type: "module" }
      );
    }

    // 기본 editor worker
    return new Worker(
      new URL("monaco-editor/esm/vs/editor/editor.worker.js", import.meta.url),
      { type: "module" }
    );
  },
};
