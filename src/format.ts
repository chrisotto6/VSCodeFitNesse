'use strict';

import * as vscode from 'vscode';
import { WikiFormatter } from './wikiFormatter';

export class Formatter {
    // Main format function which will happen on save
    public format() {

        // Variable creation
        let _editor = vscode.window.activeTextEditor;
        let _doc = _editor.document;
        let lastLine = _doc.lineAt(_doc.lineCount - 2);
        let start = new vscode.Position(0, 0);
        let end = new vscode.Position(_doc.lineCount - 1, lastLine.text.length);

        if (!_editor) {
          return;
        }

        // Need to make sure the document is a text document see language-configuration.json and package.json
        // For specifics around the FitNesse language addition
        if (_doc.languageId === "text" && _doc.isDirty) {

            // Variable Creation
            let wiki = new WikiFormatter();
            let text = _doc.getText();
            let formattedText = wiki.format(text);

            _editor.edit(update => {
                update.replace(new vscode.Range(start, end), formattedText);
            });
            
            return;
        }
    }
}