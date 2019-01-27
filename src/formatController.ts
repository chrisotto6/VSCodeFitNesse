"use strict";

import * as vscode from "vscode";
import { Formatter } from "./format";

export function activate(context: vscode.ExtensionContext) {
  const formatter = new Formatter();
  const formatController = new FormatterController(formatter);
  context.subscriptions.push(formatController);
}

export class FormatterController {
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
