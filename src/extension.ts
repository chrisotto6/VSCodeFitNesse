"use strict";

import * as vscode from "vscode";
import { activate as activateFormatter } from "./format";
import { activate as activateFormatterController } from "./formatController";
import { activate as activateTestRunner } from "./runTest";
import { activate as activateFitNesseFoldingProvider } from "./folding";

export function activate(ctx: vscode.ExtensionContext) {
  console.log("FitNesse Formatter is up and running.");

  activateFitNesseFoldingProvider(ctx);
  activateFormatter(ctx);
  activateFormatterController(ctx);
  activateTestRunner(ctx);
}
