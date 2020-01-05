"use strict";

import * as vscode from "vscode";
import { WikiFormatter } from "./wikiFormatter";

export function activate(context: vscode.ExtensionContext) {
  const formatter = new Formatter();
  const format = vscode.commands.registerCommand("fitnesse.format", () => {
    formatter.format();
  });
  const formatMenu = vscode.commands.registerCommand(
    "fitnesse.formatContextMenu",
    uri => {
      formatter.formatContextMenu(uri.fsPath);
    }
  );
  context.subscriptions.push(format, formatMenu);
}

export class Formatter {
  public format() {
    let _editor = vscode.window.activeTextEditor;
    let _doc = _editor.document;
    let lastLine = _doc.lineAt(_doc.lineCount - 2);
    let start = new vscode.Position(0, 0);
    let end = new vscode.Position(_doc.lineCount, lastLine.text.length);

    if (!_editor) {
      return;
    }

    if (_doc.languageId === "fitnesse") {
      // Variable Creation
      let text = _doc.getText();
      let wiki = new WikiFormatter();
      let formattedText = wiki.format(text);

      _editor.edit(update => {
        update.replace(new vscode.Range(start, end), formattedText);
      });
      return;
    }
  }

  public formatContextMenu(uri) {
    const fs = require("fs");
    const path = require("path");

    const walkSync = d =>
      fs.statSync(d).isDirectory()
        ? Array.prototype.concat(
            ...fs.readdirSync(d).map(f => walkSync(path.join(d, f)))
          )
        : [d];

    let files = walkSync(uri);

    files = files.filter(file => file.endsWith("content.txt"));

    vscode.window
      .showWarningMessage(
        "You are about to format " +
          files.length +
          " test files.\nDo you wish to continue?",
        { modal: true },
        "Yes",
        "No"
      )
      .then(answer => {
        if (answer !== "Yes") {
          return;
        }

        let _editor = vscode.window.activeTextEditor;
        files.forEach(file => {
          if (_editor && _editor.document.fileName === file) {
            this.format();
            return;
          }

          fs.readFile(file, "utf8", function(err, data) {
            if (err) {
              return console.log(err);
            }
            let wiki = new WikiFormatter();
            let formattedText = wiki.format(data);

            fs.writeFile(file, formattedText, "utf8", function(err) {
              if (err) {
                return console.log(err);
              }
              console.log("The file was saved!");
            });
          });
        });
      });
  }
}
