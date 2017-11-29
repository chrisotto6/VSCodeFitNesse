'use strict';

import * as vscode from 'vscode';
import { Formatter } from './format';
import { FormatterController } from './formatController';

// called when the extension is activated
export function activate(ctx: vscode.ExtensionContext) {
    console.log('FitNesse Formatter is up and running.');

    // Create a new instance of the formatter class for command execution and for controller on save functionality
    let instance = new Formatter();
    let controller = new FormatterController(instance);

    ctx.subscriptions.push(controller);
    
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    ctx.subscriptions.push(vscode.commands.registerCommand('extension.format', () => {
        // The code you place here will be executed every time your command is executed
        instance.format();
    }));
    ctx.subscriptions.push(vscode.commands.registerCommand('extension.formatContextMenu', (uri) => {
        // The code you place here will be executed every time your command is executed
        instance.formatContextMenu(uri.fsPath);
    }));
}