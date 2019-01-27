"use strict";

import * as vscode from "vscode";
import { Formatter } from "./format";
import { FormatterController } from "./formatController";
import { TestRunner } from "./runTest";
import { activate as activateFitNesseFoldingProvider } from "./folding";

// called when the extension is activated
export function activate(ctx: vscode.ExtensionContext) {
  console.log("FitNesse Formatter is up and running.");

  // Create a new instance of the formatter class for command execution and for controller on save functionality
  let instance = new Formatter();
  let runner = new TestRunner();
  let controller = new FormatterController(instance);
  const subscriptions: vscode.Disposable[] = [];

  // Register the folding provider for FitNesse Collapsable sections
  activateFitNesseFoldingProvider(ctx);

  // Subscribe the Format Controller for on save functionality
  ctx.subscriptions.push(controller);

  // Register the two different format commands for non on save functionality
  ctx.subscriptions.push(
    vscode.commands.registerCommand("fitnesse.format", () => {
      instance.format();
    })
  );
  ctx.subscriptions.push(
    vscode.commands.registerCommand("fitnesse.formatContextMenu", uri => {
      instance.formatContextMenu(uri.fsPath);
    })
  );

  // Register the commands for the test runner functionality
  ctx.subscriptions.push(
    vscode.commands.registerCommand("fitnesse.runTest", uri => {
      runner.run();
    })
  );
}
