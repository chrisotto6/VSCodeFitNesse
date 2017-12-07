export class WikiFormatter {
  wikificationPrevention;

  //
  //   * This is the entry point, it takes a chunk of text, splits it into lines, loops
  //   * through the lines collecting consecutive lines that are part of a table, and returns
  //   * a chunk of text with those tables it collected formatted.
  //
  format(wikiText) {
    this.wikificationPrevention = false;
    let formatted = "";
    let currentTable = [];
    let lines = wikiText.split("\n");
    let line = null;
    let i = 0;
    let j = lines.length;

    while (i < j) {
      line = lines[i];
      if (this.isTableRow(line)) {
        currentTable.push(line);
      } else {
        formatted += this.formatTable(currentTable);
        currentTable = [];
        formatted += line + "\n";
      }
      i++;
    }
    formatted += this.formatTable(currentTable);
    return formatted.slice(0, formatted.length - 1);
  }

  //
  //   * This function receives an array of strings(rows), it splits each of those strings
  //   * into an array of strings(columns), calls off to calculate what the widths
  //   * of each of those columns should be and then returns a string with each column
  //   * right/space padded based on the calculated widths.
  //
  formatTable(table) {
    let formatted = "";
    let splitRowsResult = this.splitRows(table);
    let { rows } = splitRowsResult;
    let { suffixes } = splitRowsResult;
    let widths = this.calculateColumnWidths(rows);
    let row = null;
    let rowIndex = 0;
    let numberOfRows = rows.length;

    while (rowIndex < numberOfRows) {
      row = rows[rowIndex];
      formatted += "|";
      let columnIndex = 0;
      let numberOfColumns = row.length;

      while (columnIndex < numberOfColumns) {
        formatted += this.rightPad(row[columnIndex], widths[rowIndex][columnIndex]) + "|";
        columnIndex++;
      }
      formatted += suffixes[rowIndex] + "\n";
      rowIndex++;
    }
    if (this.wikificationPrevention) {
      formatted = `!|${ formatted.substr(2) }`;
      this.wikificationPrevention = false;
    }
    return formatted;
  }

  //
  //   * This is where the nastiness starts due to trying to emulate
  //   * the html rendering of colspans.
  //   *   - make a row/column matrix that contains data lengths
  //   *   - find the max widths of those columns that don't have colspans
  //   *   - update the matrix to set each non colspan column to those max widths
  //   *   - find the max widths of the colspan columns
  //   *   - increase the non colspan columns if the colspan columns lengths are greater
  //   *   - adjust colspan columns to pad out to the max length of the row
  //   *
  //   * Feel free to refactor as necessary for clarity
  //
  calculateColumnWidths(rows) {
    let widths = this.getRealColumnWidths(rows);
    let totalNumberOfColumns = this.getNumberOfColumns(rows);
    let maxWidths = this.getMaxWidths(widths, totalNumberOfColumns);
    this.setMaxWidthsOnNonColspanColumns(widths, maxWidths);
    let colspanWidths = this.getColspanWidth(widths, totalNumberOfColumns);
    this.adjustWidthsForColspans(widths, maxWidths, colspanWidths);
    this.adjustColspansForWidths(widths, maxWidths);
    return widths;
  }

  isTableRow(line) {
    return line.match(/^!?\|/);
  }

  splitRows(rows) {
    let splitRows = [];
    let rowSuffixes = [];
    this.each(rows, function (row) {
      let columns = this.splitRow(row);
      rowSuffixes.push(columns[columns.length - 1]);
      splitRows.push(columns.slice(0, columns.length - 1));
    }, this);
    return {
      rows: splitRows,
      suffixes: rowSuffixes
    };
  }

  splitRow(row) {
    let replacement = '__TEMP_PIPE_CHARACTER__';
    if (row.match(/!-/)) {
      row = this.replacePipesInLiteralsWithPlaceholder(row, replacement);
    }
    let columns = this.trim(row).split("|");
    if (!this.wikificationPrevention && columns[0] === "!") {
      this.wikificationPrevention = true;
      columns[1] = `!${ columns[1] }`; //leave a placeholder
    }
    columns = columns.slice(1, columns.length);
    this.each(columns, function (column, i) {
      columns[i] = this.trim(column).replace(/__TEMP_PIPE_CHARACTER__/g, '|');
    }, this);
    return columns;
  }

  replacePipesInLiteralsWithPlaceholder(text, rep) {
    let newText = "";

    while(text.match(/!-/)) {
      var textParts = this.splitLiteral(text);
      newText = newText + textParts.left + textParts.literal.replace(/\|/g, rep);
      text = textParts.right;
    }
    return newText + text;
  }

  splitLiteral(text) {
    let leftText = "";
    let rightText = "";
    let literalText = "";

    let matchOpenLiteral = text.match(/(.*?)(!-.*)/);
    leftText = matchOpenLiteral[1];
    if (matchOpenLiteral[2].match(/-!/)) {
      var matchCloseLiteral = matchOpenLiteral[2].match(/(.*?-!)(.*)/);
      literalText = matchCloseLiteral[1];
      rightText = matchCloseLiteral[2];
    }
    else {
      literalText = matchOpenLiteral[2];
      rightText = "";
    }
    return {left:leftText, literal:literalText, right:rightText};
  }

  getRealColumnWidths(rows) {
    let widths = [];
    this.each(rows, function (row, rowIndex) {
      widths.push([]);
      this.each(row, function (column, columnIndex) {
        widths[rowIndex][columnIndex] = column.length;
      }, this);
    }, this);
    return widths;
  }

  getMaxWidths(widths, totalNumberOfColumns) {
    let maxWidths = [];
    let row = null;
    this.each(widths, function (row, rowIndex) {
      this.each(row, function (columnWidth, columnIndex) {
        if (columnIndex === row.length - 1 && row.length < totalNumberOfColumns) {
          return false;
        }
        if (columnIndex >= maxWidths.length) {
          maxWidths.push(columnWidth);
        } else if (columnWidth > maxWidths[columnIndex]) {
          maxWidths[columnIndex] = columnWidth;
        }
      }, this);
    }, this);
    return maxWidths;
  }

  getNumberOfColumns(rows) {
    let numberOfColumns = 0;
    this.each(rows, function (row) {
      if (row.length > numberOfColumns) {
        numberOfColumns = row.length;
      }
    }, undefined);

    return numberOfColumns;
  }

  getColspanWidth(widths, totalNumberOfColumns) {
    let colspanWidths = [];
    let colspan = null;
    let colspanWidth = null;
    this.each(widths, function (row, rowIndex) {
      if (row.length < totalNumberOfColumns) {
        colspan = totalNumberOfColumns - row.length;
        colspanWidth = row[row.length - 1];
        if (colspan >= colspanWidths.length) {
          colspanWidths[colspan] = colspanWidth;
        } else if (!colspanWidths[colspan] || colspanWidth > colspanWidths[colspan]) {
          colspanWidths[colspan] = colspanWidth;
        }
      }
    }, undefined);

    return colspanWidths;
  }

  setMaxWidthsOnNonColspanColumns(widths, maxWidths) {
    this.each(widths, function (row, rowIndex) {
      this.each(row, function (columnWidth, columnIndex) {
        if (columnIndex === row.length - 1 && row.length < maxWidths.length) {
          return false;
        }
        row[columnIndex] = maxWidths[columnIndex];
      }, this);
    }, this);
  }

  getWidthOfLastNumberOfColumns(maxWidths, numberOfColumns) {
    let width = 0;
    let i = 1;

    while (i <= numberOfColumns) {
      width += maxWidths[maxWidths.length - i];
      i++;
    }
    return width + numberOfColumns - 1; //add in length of separators
  }

  spreadOutExcessOverLastNumberOfColumns(maxWidths, excess, numberOfColumns) {
    let columnToApplyExcessTo = maxWidths.length - numberOfColumns;
    let i = 0;

    while (i < excess) {
      maxWidths[columnToApplyExcessTo++] += 1;
      if (columnToApplyExcessTo === maxWidths.length) {
        columnToApplyExcessTo = maxWidths.length - numberOfColumns;
      }
      i++;
    }
  }

  adjustWidthsForColspans(widths, maxWidths, colspanWidths) {
    let lastNumberOfColumnsWidth = null;
    let excess = null;
    this.each(colspanWidths, function (colspanWidth, index) {
      lastNumberOfColumnsWidth = this.getWidthOfLastNumberOfColumns(maxWidths, index + 1);
      if (colspanWidth && colspanWidth > lastNumberOfColumnsWidth) {
        excess = colspanWidth - lastNumberOfColumnsWidth;
        this.spreadOutExcessOverLastNumberOfColumns(maxWidths, excess, index + 1);
        this.setMaxWidthsOnNonColspanColumns(widths, maxWidths);
      }
    }, this);
  }

  adjustColspansForWidths(widths, maxWidths) {
    let colspan = null;
    let lastNumberOfColumnsWidth = null;
    this.each(widths, function (row, rowIndex) {
      colspan = maxWidths.length - row.length + 1;
      if (colspan > 1) {
        row[row.length - 1] = this.getWidthOfLastNumberOfColumns(maxWidths, colspan);
      }
    }, this);
  }

  //
  //   * Utility functions
  //
  trim(text) {
    return (text || "").replace(/^[^\S\r\n]+|[^\S\r\n]+$/g, "");
  }

  each(array, callback, context) {
    let index = 0;
    let { length } = array;
    while (index < length && callback.call(context, array[index], index) !== false) {
      index++;
    }
  }

  rightPad(value, length) {
    let padded = value;
    let i = 0;
    let j = length - value.length;

    while (i < j) {
      padded += " ";
      i++;
    }

    return padded;
  }
}
