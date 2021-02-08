import * as vscode from "vscode";

type Options = {
  show?: boolean;
};

const DEFAULT_OPTIONS: Options = {};

export default (cwd: string, { show = true } = DEFAULT_OPTIONS) => {
  const allTerminals = vscode.window.terminals;
  const terminalName = `prescript ${cwd}`;
  var matchedTerminal = allTerminals.find(
    (terminal) => terminal.name === terminalName
  );
  if (matchedTerminal) {
    matchedTerminal.sendText(`cd ${cwd}`);
    if (show) {
      matchedTerminal.show(true);
    }
    return matchedTerminal;
  }

  const newTerminal = vscode.window.createTerminal({
    cwd,
    name: terminalName,
  });

  if (show) {
    newTerminal.show(true);
  }

  return newTerminal;
};
