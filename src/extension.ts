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
}