"use strict";

import {
  TextDocument,
  FoldingRange,
  FoldingRangeProvider,
  ProviderResult,
  ExtensionContext,
  languages
} from "vscode";

export function activate(context: ExtensionContext) {
  const provider = new FitNesseFoldingProvider();
  const registration = languages.registerFoldingRangeProvider(
    [
      { scheme: "file", language: "fitnesse" },
      { scheme: "untitled", language: "fitnesse" }
    ],
    provider
  );
  context.subscriptions.push(registration);
}

type FoldingRegex = {
  begin: RegExp;
  end: RegExp;
};

export class FitNesseFoldingProvider implements FoldingRangeProvider {
  private regexes: Array<FoldingRegex> = [];

  constructor() {
    this.regexes.push({
      begin: new RegExp(/^!\*.*/),
      end: new RegExp(/^\*.*\!/)
    });
  }

  confirmFoldingRange(
    document: TextDocument,
    lineCount: number,
    foldingRanges: FoldingRange[],
    foldingRangeStart: number
  ): number {
    let i;
    for (i = foldingRangeStart + 1; i < lineCount; i++) {
      if (this.regexes[0].begin.test(document.lineAt(i).text)) {
        i = this.confirmFoldingRange(document, lineCount, foldingRanges, i);
      } else if (this.regexes[0].end.test(document.lineAt(i).text)) {
        foldingRanges.push(new FoldingRange(foldingRangeStart, i));
        return i + 1;
      }
    }
    return i;
  }

  public provideFoldingRanges(
    document: TextDocument
  ): ProviderResult<FoldingRange[]> {
    const foldingRanges: FoldingRange[] = [];
    const lineCount = document.lineCount;
    let i = 0;
    let line;

    while (i < lineCount) {
      line = document.lineAt(i).text;
      if (this.regexes[0].begin.test(line)) {
        i = this.confirmFoldingRange(document, lineCount, foldingRanges, i);
      } else {
        i++;
      }
    }
    return foldingRanges;
  }
}
