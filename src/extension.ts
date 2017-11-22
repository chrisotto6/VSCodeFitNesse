'use strict';

import * as vscode from 'vscode';
import { WikiFormatter } from './formatter';

// called when the extension is activated
export function activate(ctx: vscode.ExtensionContext) {
    console.log('FitNesse Formatter is up and running.');

    // Create a new instance of the formatter class for command execution and for controller on save functionality
    let instance = new Formatter();
    let controller = new FormatterController(instance);

    ctx.subscriptions.push(controller);
}

class Formatter {
    // Main format function which will happen on save or when the keymapping is pressed
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

            _editor.edit(builder => {
                builder.replace(new vscode.Range(start, end), formattedText);
            });
            
            return;
        }
    }
}

class FormatterController {
    private _formatter: Formatter;
    private _disposable: vscode.Disposable;

    constructor(formatter: Formatter) {
        this._formatter = formatter;

        // subscribe to events
        let subsciptions: vscode.Disposable[] = [];
        vscode.workspace.onWillSaveTextDocument(this._onEvent, this, subsciptions);

        // create combined disposable for the event subsciptions
        this._disposable = vscode.Disposable.from(...subsciptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        this._formatter.format();
    }
}