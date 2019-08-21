"use strict";

import * as vscode from "vscode";
import { WikiFormatter } from "./wikiFormatter";
import { activate as activateFormatter } from "./format";
import { activate as activateFormatterController } from "./formatController";
import { activate as activateTestRunner } from "./runTest";
import { activate as activateFitNesseFoldingProvider } from "./folding";

export function activate(ctx: vscode.ExtensionContext) {
  console.log("VSCode FitNesse is up and running.");

  activateFitNesseFoldingProvider(ctx);
  activateFormatter(ctx);
  activateFormatterController(ctx);
  activateTestRunner(ctx);

  vscode.languages.registerDocumentFormattingEditProvider(
    { scheme: "file", language: "fitnesse" },
    {
      provideDocumentFormattingEdits(
        document: vscode.TextDocument
      ): vscode.TextEdit[] {
        let lastLine = document.lineAt(document.lineCount - 2);
        let start = new vscode.Position(0, 0);
        let end = new vscode.Position(document.lineCount, lastLine.text.length);

        let wiki = new WikiFormatter();
        let formattedText = wiki.format(document.getText());

        return [
          vscode.TextEdit.replace(new vscode.Range(start, end), formattedText)
        ];
      }
    }
  );
}
