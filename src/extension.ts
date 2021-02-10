import * as vscode from "vscode";
import { dirname } from "path";
import { exec } from "child_process";

import getOrCreateTerminal from "./utils/getOrCreateTerminal";

function getCommand(): string | undefined {
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    const { selection, document } = activeEditor;
    if (selection.isEmpty) {
      const line = document.lineAt(selection.active);
      return line.text;
    }
    return document.getText(selection);
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
  context.subscriptions.push(
    vscode.commands.registerCommand("prescript.executeInBackground", () => {
      const cmd = getCommand();
      const cwd = getWorkingDirectory();

      if (cmd && cwd) {
        const terminal = getOrCreateTerminal(cwd, { show: false });
        terminal.sendText(cmd);
      }
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("prescript.executeIntoDocument", () => {
      const cmd = getCommand();
      const cwd = getWorkingDirectory();

      if (cmd && cwd) {
        exec(cmd, { cwd }, async (err, stdout, stderr) => {
          const body = err ? err.message : stdout || stderr;
          const content = `${cmd}\n\n${body}`;
          const outputDocument = await vscode.workspace.openTextDocument({
            content,
          });
          vscode.window.showTextDocument(outputDocument);
        });
      }
    })
  );
}

export function deactivate() {}
