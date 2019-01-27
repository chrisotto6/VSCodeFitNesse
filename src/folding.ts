'use strict';

import { TextDocument, FoldingRange, FoldingRangeProvider, ProviderResult } from 'vscode';

export default class FitNesseFoldingProvider implements FoldingRangeProvider {
    public provideFolding(document: TextDocument): ProviderResult<FoldingRange[]> {
        return findRanges(document);
    }


}