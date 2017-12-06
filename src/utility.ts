'use strict';

import * as vscode from 'vscode';

export class Utility {
    
    public getFitPort() {
        return vscode.workspace.getConfiguration("fitnesse").get<string>("fitnessePort");
    }

    public getFitJar() {
        return vscode.workspace.getConfiguration("fitnesse").get<string>("fitnesseJarLocation");
    }

    public getJvmMemory() {
        return vscode.workspace.getConfiguration("fitnesse").get<string>("javaVirtualMachineMemory");
    }

    public getPreExecCommand() {
        return vscode.workspace.getConfiguration("fitnesse").get<string>("preExecutionCommand");
    }

    public getPostExecCommand() {
        return vscode.workspace.getConfiguration("fitnesse").get<string>("postExecutionCommand");
    }

    public getFitnesseInstance() {
        // Get the path of the current test in the editor
        let path = vscode.window.activeTextEditor.document.fileName;

        // Slice the file path to find out where the fitnesse instance is
        // we need this to change directory in the terminal
        path = path.slice(0, path.lastIndexOf("\FitNesseRoot"));
        return path;
    }

    public getTest() {
        // Get the path of the current test in the editor
        let path = vscode.window.activeTextEditor.document.fileName;

        // Chop down the returned string, we only care about FrontPage/to/TestName
        let test = path.slice(path.lastIndexOf("FrontPage"), path.search(/content.txt/gi) - 1);

        // Replace the file path '\' with '.' so that it can be executed from command line
        test = test.replace(/\\/gi, ".");
        return test;
    }
}