'use strict';

import * as vscode from 'vscode';

export class Utility {
    
    public getJvmMemory() {
        return vscode.workspace.getConfiguration("fitnesse").get<string>("javaVirtualMachineMemory");
    }

    public getFitJar() {
        return vscode.workspace.getConfiguration("fitnesse").get<string>("fitnesseJarLocation");
    }

    public getFitPort() {
        return vscode.workspace.getConfiguration("fitnesse").get<string>("fitnessePort");
    }

    public getRootPath() {
        return vscode.workspace.getConfiguration("fitnesse").get<string>("rootPath");
    }

    public getFitnesseRoot() {
        return vscode.workspace.getConfiguration("fitnesse").get<string>("fitnesseRoot");
    }

    public getLogLevel() {
        return vscode.workspace.getConfiguration("fitnesse").get<boolean>("logLevel");
    }

    public getLogDirectory() {
        return vscode.workspace.getConfiguration("fitnesse").get<string>("logDirectory");
    }

    public getVersionsControllerDays() {
        return vscode.workspace.getConfiguration("fitnesse").get<string>("versionsControllerDays");
    }

    public getOmittingUpdates() {
        return vscode.workspace.getConfiguration("fitnesse").get<boolean>("omittingUpdates");
    }

    public getRedirectOutput() {
        return vscode.workspace.getConfiguration("fitnesse").get<string>("redirectOutput");
    }

    public getPlugins() {
        return vscode.workspace.getConfiguration("fitnesse").get<string>("plugins");
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

    public getOtherCommandArguments() {
        // Based on the return functions we need to determine with other command line arguments to have
        // when running our test. This builds out the string used based on the configurations defined.
        let args = "";

        if (this.getRootPath() !== null && this.getRootPath() !== "") {
            args += "-d " + this.getRootPath() + " ";
        }

        if (this.getFitnesseRoot() !== null && this.getFitnesseRoot() !== "") {
            args += "-r " + this.getFitnesseRoot() + " ";
        }
        
        if (this.getLogLevel() !== null && this.getLogLevel() !== false) {
            args += "-v ";
        }

        if (this.getVersionsControllerDays() !== null && this.getVersionsControllerDays() !== "") {
            args += "-e " + this.getVersionsControllerDays() + " ";
        }

        if (this.getOmittingUpdates() !== null && this.getOmittingUpdates() !== false) {
             args += "-o ";
        }

        if (this.getRedirectOutput() !== null && this.getRedirectOutput() !== "") {
            args += "-b " + this.getRedirectOutput() + " ";
        }

        if (this.getPlugins() !== null && this.getPlugins() !== "") {
            args += "-f " + this.getPlugins() + " ";
        }

        return args;
    }
}