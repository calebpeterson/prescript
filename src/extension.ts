import * as vscode from "vscode";
import { dirname } from "path";

import getOrCreateTerminal from "./utils/getOrCreateTerminal";

function getCommand(): string | undefined {
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    const selection = activeEditor.selection;
    const line = activeEditor.document.lineAt(selection.active);
    return line.text;
  }
}

function getWorkingDirectory(): string | undefined {
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    const uri = activeEditor.document.uri;
    const cwd = dirname(uri.fsPath);
    return cwd;
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("prescript.execute", () => {
      const cmd = getCommand();
      const cwd = getWorkingDirectory();

      if (cmd && cwd) {
        const terminal = getOrCreateTerminal(cwd);
        terminal.sendText(cmd);
      }
    })
  );
}

export function deactivate() {}
