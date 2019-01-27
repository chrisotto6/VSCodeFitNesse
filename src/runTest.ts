"use strict";

import * as vscode from "vscode";
import { Utility } from "./utility";

export function activate(context: vscode.ExtensionContext) {
  const runner = new TestRunner();
  const run = vscode.commands.registerCommand("fitnesse.runTest", uri => {
    runner.run();
  });
  context.subscriptions.push(run);
}

export class TestRunner {
  private _terminal: vscode.Terminal;
  private _util: Utility;
  private _path: string;
  private _instance: string;
  private _test: string;
  private _memory: string;
  private _classPath: string;
  private _port: string;
  private _jar: string;
  private _preCommand: string;
  private _postCommand: string;
  private _otherConfigs: string;

  constructor() {
    this._terminal = null;
    this._util = new Utility();
  }

  public executionCommand() {
    this._test = this._util.getTest();
    this._otherConfigs = this._util.getOtherCommandArguments();
    this._classPath = this._util.getJavaClassPath();
    this._jar = this._util.getFitJar();
    this._port = this._util.getFitPort();
    this._memory = this._util.getJvmMemory();
    this._instance = this._util.getFitnesseInstance();

    let command = "";

    if (this._classPath !== null && this._classPath !== "") {
      command =
        "java -Xmx" +
        this._memory +
        " -cp " +
        this._classPath +
        " -jar " +
        this._jar +
        " -p " +
        this._port +
        " " +
        this._otherConfigs +
        "-d " +
        this._instance +
        " -c " +
        this._test +
        "?test^&format=text";
    } else {
      command =
        "java -Xmx" +
        this._memory +
        " -jar " +
        this._jar +
        " -p " +
        this._port +
        " " +
        this._otherConfigs +
        "-d " +
        this._instance +
        " -c " +
        this._test +
        "?test^&format=text";
    }
    return command;
  }

  public run() {
    this._preCommand = this._util.getPreExecCommand();
    this._postCommand = this._util.getPostExecCommand();

    if (this._terminal === null) {
      this._terminal = vscode.window.createTerminal(`FitNesse`);
    }

    this._terminal.show();

    if (this._preCommand !== null && this._preCommand !== "") {
      this._terminal.sendText(this._preCommand);
    }

    this._terminal.sendText(this.executionCommand());

    if (this._postCommand !== null && this._postCommand !== "") {
      this._terminal.sendText(this._postCommand);
    }
  }
}
