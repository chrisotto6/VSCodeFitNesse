'use strict';

import * as vscode from 'vscode';
import { WikiFormatter } from './formatter';

// called when your extension is activated
export function activate(ctx: vscode.ExtensionContext) {
    console.log('FitNesse Formatter is up and running.');

    // Create a new instance of the formatter class for command execution and for controller on save functionality
    let commandExec = new CommandFormat();
    let instance = new Formatter();
    let controller = new FormatterController(instance);

    // Being that we want to be able to execute the format from keybinding and on save we have a few things going on
    // We create the disposable for the command registration, after that we handle the create through the controller
    // which is subscribed to the on save event from the workspace
    let disposable = vscode.commands.registerCommand('extension.format', () => {
        
        commandExec.format();

        // Display a message box to the user
        vscode.window.showInformationMessage('Hey there.');
    });

    ctx.subscriptions.push(disposable);
    ctx.subscriptions.push(controller);
    ctx.subscriptions.push(commandExec);
}

class Formatter {
    private needsFormat = false;

    // Main format function which will happen on save or when the keymapping is pressed
    public format() {
        let _editor = vscode.window.activeTextEditor;
        let _doc = _editor.document;

        if (!_editor) {
          return;
        } 

        console.log(_doc.languageId);

        // Need to make sure the document is a text document see language-configuration.json and package.json
        // For specifics around the FitNesse language addition
        if (_doc.languageId === "text") {
            let jarjar = new WikiFormatter();

            let text = _doc.getText();
            console.log("formatting text: " + text.length);
            let binks = jarjar.format(text);

            return;
        }
    }

    public setNeedsFormat(bool) {
        this.needsFormat = bool;
    }
}

class CommandFormat extends Formatter {
    dispose() {
        this.dispose();
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
        vscode.workspace.onDidChangeTextDocument(this._isDirty, this, subsciptions);

        // create combined disposable for the event subsciptions
        this._disposable = vscode.Disposable.from(...subsciptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        this._formatter.format();
    }

    private _isDirty() {
        this._formatter.setNeedsFormat(true);
    }
}