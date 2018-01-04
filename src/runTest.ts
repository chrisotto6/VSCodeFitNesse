'use strict';

import * as vscode from 'vscode';
import { Utility } from './utility';

export class TestRunner {
    private _terminal: vscode.Terminal;
    private _util: Utility;
    private _path: string;
    private _instance: string;
    private _test: string;
    private _memory: string;
    private _port: string;
    private _jar: string;
    private _preCommand: string;
    private _postCommand: string;
    private _otherConfigs: string;

    constructor() {
        this._terminal = null;
        this._util = new Utility();
        this._preCommand = this._util.getPreExecCommand();
        this._postCommand = this._util.getPostExecCommand();
        this._otherConfigs = this._util.getOtherCommandArguments();
    }

    public changeDirectoryCommand() {
        this._instance = this._util.getFitnesseInstance();
        let command = "cd " + this._instance;
        return command;
    }

    public executionCommand() {
        this._test = this._util.getTest();
        this._jar = this._util.getFitJar();
        this._port = this._util.getFitPort();
        this._memory = this._util.getJvmMemory();

        let command = "java -Xmx" + this._memory + "m -jar " + this._jar + " -p " +
            this._port + " " + this._otherConfigs + "-c " + this._test + "?test^&format=text";

        return command;
    }

    public run() {
        if (this._terminal === null) {
            this._terminal = vscode.window.createTerminal(`Ext Terminal`);
        }

        this._terminal.show();

        if (this._preCommand !== null && this._preCommand !== "") {
            this._terminal.sendText(this._util.getPreExecCommand());
        }

        this._terminal.sendText(this.changeDirectoryCommand());
        this._terminal.sendText(this.executionCommand());
        
        if (this._postCommand !== null && this._postCommand !== "") {
            this._terminal.sendText(this._util.getPreExecCommand());
        }
    }
}