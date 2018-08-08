'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var meaw = require('meaw');

/**
 * A `Point` represents a point in the text editor.
 */
class Point {
  /**
   * Creates a new `Point` object.
   *
   * @param {number} row - Row of the point, starts from 0.
   * @param {number} column - Column of the point, starts from 0.
   */
  constructor(row, column) {
    /** @private */
    this._row = row;
    /** @private */
    this._column = column;
  }

  /**
   * Row of the point.
   *
   * @type {number}
   */
  get row() {
    return this._row;
  }

  /**
   * Column of the point.
   *
   * @type {number}
   */
  get column() {
    return this._column;
  }

  /**
   * Checks if the point is equal to another point.
   *
   * @param {Point} point - A point object.
   * @returns {boolean} `true` if two points are equal.
   */
  equals(point) {
    return this.row === point.row && this.column === point.column;
  }
}

/**
 * A `Range` object represents a range in the text editor.
 */
class Range {
  /**
   * Creates a new `Range` object.
   *
   * @param {Point} start - The start point of the range.
   * @param {Point} end - The end point of the range.
   */
  constructor(start, end) {
    /** @private */
    this._start = start;
    /** @private */
    this._end = end;
  }

  /**
   * The start point of the range.
   *
   * @type {Point}
   */
  get start() {
    return this._start;
  }

  /**
   * The end point of the range.
   *
   * @type {Point}
   */
  get end() {
    return this._end;
  }
}

/**
 * A `Focus` object represents which cell is focused in the table.
 *
 * Note that `row` and `column` properties specifiy a cell's position in the table, not the cursor's
 * position in the text editor as {@link Point} class.
 *
 * @private
 */
class Focus {
  /**
   * Creates a new `Focus` object.
   *
   * @param {number} row - Row of the focused cell.
   * @param {number} column - Column of the focused cell.
   * @param {number} offset - Raw offset in the cell.
   */
  constructor(row, column, offset) {
    /** @private */
    this._row = row;
    /** @private */
    this._column = column;
    /** @private */
    this._offset = offset;
  }

  /**
   * Row of the focused cell.
   *
   * @type {number}
   */
  get row() {
    return this._row;
  }

  /**
   * Column of the focused cell.
   *
   * @type {number}
   */
  get column() {
    return this._column;
  }

  /**
   * Raw offset in the cell.
   *
   * @type {number}
   */
  get offset() {
    return this._offset;
  }

  /**
   * Checks if two focuses point the same cell.
   * Offsets are ignored.
   *
   * @param {Focus} focus - A focus object.
   * @returns {boolean}
   */
  posEquals(focus) {
    return this.row === focus.row && this.column === focus.column;
  }

  /**
   * Creates a copy of the focus object by setting its row to the specified value.
   *
   * @param {number} row - Row of the focused cell.
   * @returns {Focus} A new focus object with the specified row.
   */
  setRow(row) {
    return new Focus(row, this.column, this.offset);
  }

  /**
   * Creates a copy of the focus object by setting its column to the specified value.
   *
   * @param {number} column - Column of the focused cell.
   * @returns {Focus} A new focus object with the specified column.
   */
  setColumn(column) {
    return new Focus(this.row, column, this.offset);
  }

  /**
   * Creates a copy of the focus object by setting its offset to the specified value.
   *
   * @param {number} offset - Offset in the focused cell.
   * @returns {Focus} A new focus object with the specified offset.
   */
  setOffset(offset) {
    return new Focus(this.row, this.column, offset);
  }
}

/**
 * Represents column alignment.
 *
 * - `Alignment.NONE` - Use default alignment.
 * - `Alignment.LEFT` - Align left.
 * - `Alignment.RIGHT` - Align right.
 * - `Alignment.CENTER` - Align center.
 *
 * @type {Object}
 */
const Alignment = Object.freeze({
  NONE  : "none",
  LEFT  : "left",
  RIGHT : "right",
  CENTER: "center"
});

/**
 * Represents default column alignment
 *
 * - `DefaultAlignment.LEFT` - Align left.
 * - `DefaultAlignment.RIGHT` - Align right.
 * - `DefaultAlignment.CENTER` - Align center.
 *
 * @type {Object}
 */
const DefaultAlignment = Object.freeze({
  LEFT  : Alignment.LEFT,
  RIGHT : Alignment.RIGHT,
  CENTER: Alignment.CENTER
});

/**
 * Represents alignment of header cells.
 *
 * - `HeaderAlignment.FOLLOW` - Follow column's alignment.
 * - `HeaderAlignment.LEFT` - Align left.
 * - `HeaderAlignment.RIGHT` - Align right.
 * - `HeaderAlignment.CENTER` - Align center.
 *
 * @type {Object}
 */
const HeaderAlignment = Object.freeze({
  FOLLOW: "follow",
  LEFT  : Alignment.LEFT,
  RIGHT : Alignment.RIGHT,
  CENTER: Alignment.CENTER
});

/**
 * A `TableCell` object represents a table cell.
 *
 * @private
 */
class TableCell {
  /**
   * Creates a new `TableCell` object.
   *
   * @param {string} rawContent - Raw content of the cell.
   */
  constructor(rawContent) {
    /** @private */
    this._rawContent = rawContent;
    /** @private */
    this._content = rawContent.trim();
    /** @private */
    this._paddingLeft = this._content === ""
      ? (this._rawContent === "" ? 0 : 1)
      : this._rawContent.length - this._rawContent.trimLeft().length;
    /** @private */
    this._paddingRight = this._rawContent.length - this._content.length - this._paddingLeft;
  }

  /**
   * Raw content of the cell.
   *
   * @type {string}
   */
  get rawContent() {
    return this._rawContent;
  }

  /**
   * Trimmed content of the cell.
   *
   * @type {string}
   */
  get content() {
    return this._content;
  }

  /**
   * Width of the left padding of the cell.
   *
   * @type {number}
   */
  get paddingLeft() {
    return this._paddingLeft;
  }

  /**
   * Width of the right padding of the cell.
   *
   * @type {number}
   */
  get paddingRight() {
    return this._paddingRight;
  }

  /**
   * Convers the cell to a text representation.
   *
   * @returns {string} The raw content of the cell.
   */
  toText() {
    return this.rawContent;
  }

  /**
   * Checks if the cell is a delimiter i.e. it only contains hyphens `-` with optional one
   * leading and trailing colons `:`.
   *
   * @returns {boolean} `true` if the cell is a delimiter.
   */
  isDelimiter() {
    return /^\s*:?-+:?\s*$/.test(this.rawContent);
  }

  /**
   * Returns the alignment the cell represents.
   *
   * @returns {Alignment|undefined} The alignment the cell represents;
   * `undefined` if the cell is not a delimiter.
   */
  getAlignment() {
    if (!this.isDelimiter()) {
      return undefined;
    }
    if (this.content[0] === ":") {
      if (this.content[this.content.length - 1] === ":") {
        return Alignment.CENTER;
      }
      else {
        return Alignment.LEFT;
      }
    }
    else {
      if (this.content[this.content.length - 1] === ":") {
        return Alignment.RIGHT;
      }
      else {
        return Alignment.NONE;
      }
    }
  }

  /**
   * Computes a relative position in the trimmed content from that in the raw content.
   *
   * @param {number} rawOffset - Relative position in the raw content.
   * @returns {number} - Relative position in the trimmed content.
   */
  computeContentOffset(rawOffset) {
    if (this.content === "") {
      return 0;
    }
    if (rawOffset < this.paddingLeft) {
      return 0;
    }
    if (rawOffset < this.paddingLeft + this.content.length) {
      return rawOffset - this.paddingLeft;
    }
    else {
      return this.content.length;
    }
  }

  /**
   * Computes a relative position in the raw content from that in the trimmed content.
   *
   * @param {number} contentOffset - Relative position in the trimmed content.
   * @returns {number} - Relative position in the raw content.
   */
  computeRawOffset(contentOffset) {
    return contentOffset + this.paddingLeft;
  }
}

/**
 * A `TableRow` object represents a table row.
 *
 * @private
 */
class TableRow {
  /**
   * Creates a new `TableRow` objec.
   *
   * @param {Array<TableCell>} cells - Cells that the row contains.
   * @param {string} marginLeft - Margin string at the left of the row.
   * @param {string} marginRight - Margin string at the right of the row.
   */
  constructor(cells, marginLeft, marginRight) {
    /** @private */
    this._cells = cells.slice();
    /** @private */
    this._marginLeft = marginLeft;
    /** @private */
    this._marginRight = marginRight;
  }

  /**
   * Margin string at the left of the row.
   *
   * @type {string}
   */
  get marginLeft() {
    return this._marginLeft;
  }

  /**
   * Margin string at the right of the row.
   *
   * @type {string}
   */
  get marginRight() {
    return this._marginRight;
  }

  /**
   * Gets the number of the cells in the row.
   *
   * @returns {number} Number of the cells.
   */
  getWidth() {
    return this._cells.length;
  }

  /**
   * Returns the cells that the row contains.
   *
   * @returns {Array<TableCell>} An array of cells that the row contains.
   */
  getCells() {
    return this._cells.slice();
  }

  /**
   * Gets a cell at the specified index.
   *
   * @param {number} index - Index.
   * @returns {TableCell|undefined} The cell at the specified index if exists;
   * `undefined` if no cell is found.
   */
  getCellAt(index) {
    return this._cells[index];
  }

  /**
   * Convers the row to a text representation.
   *
   * @returns {string} A text representation of the row.
   */
  toText() {
    if (this._cells.length === 0) {
      return this.marginLeft;
    }
    else {
      const cells = this._cells.map(cell => cell.toText()).join("|");
      return `${this.marginLeft}|${cells}|${this.marginRight}`;
    }
  }

  /**
   * Checks if the row is a delimiter or not.
   *
   * @returns {boolean} `true` if the row is a delimiter i.e. all the cells contained are delimiters.
   */
  isDelimiter() {
    return this._cells.every(cell => cell.isDelimiter());
  }
}

/**
 * A `Table` object represents a table.
 *
 * @private
 */
class Table {
  /**
   * Creates a new `Table` object.
   *
   * @param {Array<TableRow>} rows - An array of rows that the table contains.
   */
  constructor(rows) {
    /** @private */
    this._rows = rows.slice();
  }

  /**
   * Gets the number of rows in the table.
   *
   * @returns {number} The number of rows.
   */
  getHeight() {
    return this._rows.length;
  }

  /**
   * Gets the maximum width of the rows in the table.
   *
   * @returns {number} The maximum width of the rows.
   */
  getWidth() {
    return this._rows.map(row => row.getWidth())
      .reduce((x, y) => Math.max(x, y), 0);
  }

  /**
   * Gets the width of the header row.
   *
   * @returns {number|undefined} The width of the header row;
   * `undefined` if there is no header row.
   */
  getHeaderWidth() {
    if (this._rows.length === 0) {
      return undefined;
    }
    return this._rows[0].getWidth();
  }

  /**
   * Gets the rows that the table contains.
   *
   * @returns {Array<TableRow>} An array of the rows.
   */
  getRows() {
    return this._rows.slice();
  }

  /**
   * Gets a row at the specified index.
   *
   * @param {number} index - Row index.
   * @returns {TableRow|undefined} The row at the specified index;
   * `undefined` if not found.
   */
  getRowAt(index) {
    return this._rows[index];
  }

  /**
   * Gets the delimiter row of the table.
   *
   * @returns {TableRow|undefined} The delimiter row;
   * `undefined` if there is not delimiter row.
   */
  getDelimiterRow() {
    const row = this._rows[1];
    if (row === undefined) {
      return undefined;
    }
    if (row.isDelimiter()) {
      return row;
    }
    else {
      return undefined;
    }
  }

  /**
   * Gets a cell at the specified index.
   *
   * @param {number} rowIndex - Row index of the cell.
   * @param {number} columnIndex - Column index of the cell.
   * @returns {TableCell|undefined} The cell at the specified index;
   * `undefined` if not found.
   */
  getCellAt(rowIndex, columnIndex) {
    const row = this._rows[rowIndex];
    if (row === undefined) {
      return undefined;
    }
    return row.getCellAt(columnIndex);
  }

  /**
   * Gets the cell at the focus.
   *
   * @param {Focus} focus - Focus object.
   * @returns {TableCell|undefined} The cell at the focus;
   * `undefined` if not found.
   */
  getFocusedCell(focus) {
    return this.getCellAt(focus.row, focus.column);
  }

  /**
   * Converts the table to an array of text representations of the rows.
   *
   * @returns {Array<string>} An array of text representations of the rows.
   */
  toLines() {
    return this._rows.map(row => row.toText());
  }

  /**
   * Computes a focus from a point in the text editor.
   *
   * @param {Point} pos - A point in the text editor.
   * @param {number} rowOffset - The row index where the table starts in the text editor.
   * @returns {Focus|undefined} A focus object that corresponds to the specified point;
   * `undefined` if the row index is out of bounds.
   */
  focusOfPosition(pos, rowOffset) {
    const rowIndex = pos.row - rowOffset;
    const row = this._rows[rowIndex];
    if (row === undefined) {
      return undefined;
    }
    if (pos.column < row.marginLeft.length + 1) {
      return new Focus(rowIndex, -1, pos.column);
    }
    else {
      const cellWidths = row.getCells().map(cell => cell.rawContent.length);
      let columnPos = row.marginLeft.length + 1; // left margin + a pipe
      let columnIndex = 0;
      for (; columnIndex < cellWidths.length; columnIndex++) {
        if (columnPos + cellWidths[columnIndex] + 1 > pos.column) {
          break;
        }
        columnPos += cellWidths[columnIndex] + 1;
      }
      const offset = pos.column - columnPos;
      return new Focus(rowIndex, columnIndex, offset);
    }
  }

  /**
   * Computes a position in the text editor from a focus.
   *
   * @param {Focus} focus - A focus object.
   * @param {number} rowOffset - The row index where the table starts in the text editor.
   * @returns {Point|undefined} A position in the text editor that corresponds to the focus;
   * `undefined` if the focused row  is out of the table.
   */
  positionOfFocus(focus, rowOffset) {
    const row = this._rows[focus.row];
    if (row === undefined) {
      return undefined;
    }
    const rowPos = focus.row + rowOffset;
    if (focus.column < 0) {
      return new Point(rowPos, focus.offset);
    }
    const cellWidths = row.getCells().map(cell => cell.rawContent.length);
    const maxIndex = Math.min(focus.column, cellWidths.length);
    let columnPos = row.marginLeft.length + 1;
    for (let columnIndex = 0; columnIndex < maxIndex; columnIndex++) {
      columnPos += cellWidths[columnIndex] + 1;
    }
    return new Point(rowPos, columnPos + focus.offset);
  }

  /**
   * Computes a selection range from a focus.
   *
   * @param {Focus} focus - A focus object.
   * @param {number} rowOffset - The row index where the table starts in the text editor.
   * @returns {Range|undefined} A range to be selected that corresponds to the focus;
   * `undefined` if the focus does not specify any cell or the specified cell is empty.
   */
  selectionRangeOfFocus(focus, rowOffset) {
    const row = this._rows[focus.row];
    if (row === undefined) {
      return undefined;
    }
    const cell = row.getCellAt(focus.column);
    if (cell === undefined) {
      return undefined;
    }
    if (cell.content === "") {
      return undefined;
    }
    const rowPos = focus.row + rowOffset;
    const cellWidths = row.getCells().map(cell => cell.rawContent.length);
    let columnPos = row.marginLeft.length + 1;
    for (let columnIndex = 0; columnIndex < focus.column; columnIndex++) {
      columnPos += cellWidths[columnIndex] + 1;
    }
    columnPos += cell.paddingLeft;
    return new Range(
      new Point(rowPos, columnPos),
      new Point(rowPos, columnPos + cell.content.length)
    );
  }
}

/**
 * Splits a text into cells.
 *
 * @private
 * @param {string} text
 * @returns {Array<string>}
 */
function _splitCells(text) {
  const cells = [];
  let buf = "";
  let rest = text;
  while (rest !== "") {
    switch (rest[0]) {
    case "`":
      // read code span
      {
        const start = rest.match(/^`*/)[0];
        let buf1 = start;
        let rest1 = rest.substr(start.length);
        let closed = false;
        while (rest1 !== "") {
          if (rest1[0] === "`") {
            const end = rest1.match(/^`*/)[0];
            buf1 += end;
            rest1 = rest1.substr(end.length);
            if (end.length === start.length) {
              closed = true;
              break;
            }
          }
          else {
            buf1 += rest1[0];
            rest1 = rest1.substr(1);
          }
        }
        if (closed) {
          buf += buf1;
          rest = rest1;
        }
        else {
          buf += "`";
          rest = rest.substr(1);
        }
      }
      break;
    case "\\":
      // escape next character
      if (rest.length >= 2) {
        buf += rest.substr(0, 2);
        rest = rest.substr(2);
      }
      else {
        buf += "\\";
        rest = rest.substr(1);
      }
      break;
    case "|":
      // flush buffer
      cells.push(buf);
      buf = "";
      rest = rest.substr(1);
      break;
    default:
      buf += rest[0];
      rest = rest.substr(1);
    }
  }
  cells.push(buf);
  return cells;
}

/**
 * Reads a table row.
 *
 * @private
 * @param {string} text - A text.
 * @param {RegExp} [leftMarginRegex=/^\s*$/] - A regular expression object that matches left margin.
 * @returns {TableRow}
 */
function _readRow(text, leftMarginRegex = /^\s*$/) {
  let cells = _splitCells(text);
  let marginLeft;
  if (cells.length > 0 && leftMarginRegex.test(cells[0])) {
    marginLeft = cells[0];
    cells = cells.slice(1);
  }
  else {
    marginLeft = "";
  }
  let marginRight;
  if (cells.length > 1 && /^\s*$/.test(cells[cells.length - 1])) {
    marginRight = cells[cells.length - 1];
    cells = cells.slice(0, cells.length - 1);
  }
  else {
    marginRight = "";
  }
  return new TableRow(cells.map(cell => new TableCell(cell)), marginLeft, marginRight);
}

/**
 * Creates a regex source string of margin character class.
 *
 * @private
 * @param {Set<string>} chars - A set of additional margin characters.
 * A pipe `|`, a backslash `\`, and a backquote will be ignored.
 * @return {string} A regex source string.
 */
function marginRegexSrc(chars) {
  let cs = "";
  for (const c of chars) {
    if (c !== "|" && c !== "\\" && c !== "`") {
      cs += `\\u{${c.codePointAt(0).toString(16)}}`;
    }
  }
  return `[\\s${cs}]*`;
}

/**
 * Creates a regular expression object that matches margin of tables.
 *
 * @private
 * @param {Set<string>} chars - A set of additional margin characters.
 * A pipe `|`, a backslash `\`, and a backquote will be ignored.
 * @return {RegExp} An regular expression object that matches margin of tables.
 */
function _marginRegex(chars) {
  return new RegExp(`^${marginRegexSrc(chars)}$`, "u");
}

/**
 * Reads a table from lines.
 *
 * @private
 * @param {Array<string>} lines - An array of texts, each text represents a row.
 * @param {Object} options - An object containing options for parsing.
 *
 * | property name     | type                              | description                                 |
 * | ----------------- | --------------------------------- | ------------------------------------------- |
 * | `leftMarginChars` | {@link Set}&lt;{@link string}&gt; | A set of additional left margin characters. |
 *
 * @returns {Table} The table red from the lines.
 */
function readTable(lines, options) {
  const leftMarginRegex = _marginRegex(options.leftMarginChars);
  return new Table(lines.map(line => _readRow(line, leftMarginRegex)));
}

/**
 * Creates a delimiter text.
 *
 * @private
 * @param {Alignment} alignment
 * @param {number} width - Width of the horizontal bar of delimiter.
 * @returns {string}
 * @throws {Error} Unknown alignment.
 */
function _delimiterText(alignment, width) {
  const bar = "-".repeat(width);
  switch (alignment) {
  case Alignment.NONE:
    return ` ${bar} `;
  case Alignment.LEFT:
    return `:${bar} `;
  case Alignment.RIGHT:
    return ` ${bar}:`;
  case Alignment.CENTER:
    return `:${bar}:`;
  default:
    throw new Error("Unknown alignment: " + alignment);
  }
}

/**
 * Extends array size.
 *
 * @private
 * @param {Array} arr
 * @param {number} size
 * @param {Function} callback - Callback function to fill newly created cells.
 * @returns {Array} Extended array.
 */
function _extendArray(arr, size, callback) {
  const extended = arr.slice();
  for (let i = arr.length; i < size; i++) {
    extended.push(callback(i, arr));
  }
  return extended;
}

/**
 * Completes a table by adding missing delimiter and cells.
 * After completion, all rows in the table have the same width.
 *
 * @private
 * @param {Table} table - A table object.
 * @param {Object} options - An object containing options for completion.
 *
 * | property name       | type           | description                                               |
 * | ------------------- | -------------- | --------------------------------------------------------- |
 * | `minDelimiterWidth` | {@link number} | Width of delimiters used when completing delimiter cells. |
 *
 * @returns {Object} An object that represents the result of the completion.
 *
 * | property name       | type            | description                            |
 * | ------------------- | --------------- | -------------------------------------- |
 * | `table`             | {@link Table}   | A completed table object.              |
 * | `delimiterInserted` | {@link boolean} | `true` if a delimiter row is inserted. |
 *
 * @throws {Error} Empty table.
 */
function completeTable(table, options) {
  const tableHeight = table.getHeight();
  const tableWidth = table.getWidth();
  if (tableHeight === 0) {
    throw new Error("Empty table");
  }
  const rows = table.getRows();
  const newRows = [];
  // header
  const headerRow = rows[0];
  const headerCells = headerRow.getCells();
  newRows.push(new TableRow(
    _extendArray(headerCells, tableWidth, j => new TableCell(
      j === headerCells.length ? headerRow.marginRight : ""
    )),
    headerRow.marginLeft,
    headerCells.length < tableWidth ? "" : headerRow.marginRight
  ));
  // delimiter
  const delimiterRow = table.getDelimiterRow();
  if (delimiterRow !== undefined) {
    const delimiterCells = delimiterRow.getCells();
    newRows.push(new TableRow(
      _extendArray(delimiterCells, tableWidth, j => new TableCell(
        _delimiterText(
          Alignment.NONE,
          j === delimiterCells.length
            ? Math.max(options.minDelimiterWidth, delimiterRow.marginRight.length - 2)
            : options.minDelimiterWidth
        )
      )),
      delimiterRow.marginLeft,
      delimiterCells.length < tableWidth ? "" : delimiterRow.marginRight
    ));
  }
  else {
    newRows.push(new TableRow(
      _extendArray([], tableWidth, () => new TableCell(
        _delimiterText(Alignment.NONE, options.minDelimiterWidth)
      )),
      "",
      ""
    ));
  }
  // body
  for (let i = delimiterRow !== undefined ? 2 : 1; i < tableHeight; i++) {
    const row = rows[i];
    const cells = row.getCells();
    newRows.push(new TableRow(
      _extendArray(cells, tableWidth, j => new TableCell(
        j === cells.length ? row.marginRight : ""
      )),
      row.marginLeft,
      cells.length < tableWidth ? "" : row.marginRight
    ));
  }
  return {
    table            : new Table(newRows),
    delimiterInserted: delimiterRow === undefined
  };
}

/**
 * Calculates the width of a text based on characters' EAW properties.
 *
 * @private
 * @param {string} text
 * @param {Object} options -
 *
 * | property name     | type                               |
 * | ----------------- | ---------------------------------- |
 * | `normalize`       | {@link boolean}                    |
 * | `wideChars`       | {@link Set}&lt;{@link string} &gt; |
 * | `narrowChars`     | {@link Set}&lt;{@link string} &gt; |
 * | `ambiguousAsWide` | {@link boolean}                    |
 *
 * @returns {number} Calculated width of the text.
 */
function _computeTextWidth(text, options) {
  const normalized = options.normalize ? text.normalize("NFC") : text;
  let w = 0;
  for (const char of normalized) {
    if (options.wideChars.has(char)) {
      w += 2;
      continue;
    }
    if (options.narrowChars.has(char)) {
      w += 1;
      continue;
    }
    switch (meaw.getEAW(char)) {
    case "F":
    case "W":
      w += 2;
      break;
    case "A":
      w += options.ambiguousAsWide ? 2 : 1;
      break;
    default:
      w += 1;
    }
  }
  return w;
}

/**
 * Returns a aligned cell content.
 *
 * @private
 * @param {string} text
 * @param {number} width
 * @param {Alignment} alignment
 * @param {Object} options - Options for computing text width.
 * @returns {string}
 * @throws {Error} Unknown alignment.
 * @throws {Error} Unexpected default alignment.
 */
function _alignText(text, width, alignment, options) {
  const space = width - _computeTextWidth(text, options);
  if (space < 0) {
    return text;
  }
  switch (alignment) {
  case Alignment.NONE:
    throw new Error("Unexpected default alignment");
  case Alignment.LEFT:
    return text + " ".repeat(space);
  case Alignment.RIGHT:
    return " ".repeat(space) + text;
  case Alignment.CENTER:
    return " ".repeat(Math.floor(space / 2))
      + text
      + " ".repeat(Math.ceil(space / 2));
  default:
    throw new Error("Unknown alignment: " + alignment);
  }
}

/**
 * Just adds one space paddings to both sides of a text.
 *
 * @private
 * @param {string} text
 * @returns {string}
 */
function _padText(text) {
  return ` ${text} `;
}

/**
 * Formats a table.
 *
 * @private
 * @param {Table} table - A table object.
 * @param {Object} options - An object containing options for formatting.
 *
 * | property name       | type                     | description                                             |
 * | ------------------- | ------------------------ | ------------------------------------------------------- |
 * | `minDelimiterWidth` | {@link number}           | Minimum width of delimiters.                            |
 * | `defaultAlignment`  | {@link DefaultAlignment} | Default alignment of columns.                           |
 * | `headerAlignment`   | {@link HeaderAlignment}  | Alignment of header cells.                              |
 * | `textWidthOptions`  | {@link Object}           | An object containing options for computing text widths. |
 *
 * `options.textWidthOptions` must contain the following options.
 *
 * | property name     | type                              | description                                         |
 * | ----------------- | --------------------------------- | --------------------------------------------------- |
 * | `normalize`       | {@link boolean}                   | Normalize texts before computing text widths.       |
 * | `wideChars`       | {@link Set}&lt;{@link string}&gt; | Set of characters that should be treated as wide.   |
 * | `narrowChars`     | {@link Set}&lt;{@link string}&gt; | Set of characters that should be treated as narrow. |
 * | `ambiguousAsWide` | {@link boolean}                   | Treat East Asian Ambiguous characters as wide.      |
 *
 * @returns {Object} An object that represents the result of formatting.
 *
 * | property name   | type           | description                                    |
 * | --------------- | -------------- | ---------------------------------------------- |
 * | `table`         | {@link Table}  | A formatted table object.                      |
 * | `marginLeft`    | {@link string} | The common left margin of the formatted table. |
 */
function _formatTable(table, options) {
  const tableHeight = table.getHeight();
  const tableWidth = table.getWidth();
  if (tableHeight === 0) {
    return {
      table,
      marginLeft: ""
    };
  }
  const marginLeft = table.getRowAt(0).marginLeft;
  if (tableWidth === 0) {
    const rows = new Array(tableHeight).fill()
      .map(() => new TableRow([], marginLeft, ""));
    return {
      table: new Table(rows),
      marginLeft
    };
  }
  // compute column widths
  const delimiterRow = table.getDelimiterRow();
  const columnWidths = new Array(tableWidth).fill(0);
  if (delimiterRow !== undefined) {
    const delimiterRowWidth = delimiterRow.getWidth();
    for (let j = 0; j < delimiterRowWidth; j++) {
      columnWidths[j] = options.minDelimiterWidth;
    }
  }
  for (let i = 0; i < tableHeight; i++) {
    if (delimiterRow !== undefined && i === 1) {
      continue;
    }
    const row = table.getRowAt(i);
    const rowWidth = row.getWidth();
    for (let j = 0; j < rowWidth; j++) {
      columnWidths[j] = Math.max(
        columnWidths[j],
        _computeTextWidth(row.getCellAt(j).content, options.textWidthOptions)
      );
    }
  }
  // get column alignments
  const alignments = delimiterRow !== undefined
    ? _extendArray(
      delimiterRow.getCells().map(cell => cell.getAlignment()),
      tableWidth,
      () => options.defaultAlignment
    )
    : new Array(tableWidth).fill(options.defaultAlignment);
  // format
  const rows = [];
  // header
  const headerRow = table.getRowAt(0);
  rows.push(new TableRow(
    headerRow.getCells().map((cell, j) =>
      new TableCell(_padText(_alignText(
        cell.content,
        columnWidths[j],
        options.headerAlignment === HeaderAlignment.FOLLOW
          ? (alignments[j] === Alignment.NONE ? options.defaultAlignment : alignments[j])
          : options.headerAlignment,
        options.textWidthOptions
      )))
    ),
    marginLeft,
    ""
  ));
  // delimiter
  if (delimiterRow !== undefined) {
    rows.push(new TableRow(
      delimiterRow.getCells().map((cell, j) =>
        new TableCell(_delimiterText(alignments[j], columnWidths[j]))
      ),
      marginLeft,
      ""
    ));
  }
  // body
  for (let i = delimiterRow !== undefined ? 2 : 1; i < tableHeight; i++) {
    const row = table.getRowAt(i);
    rows.push(new TableRow(
      row.getCells().map((cell, j) =>
        new TableCell(_padText(_alignText(
          cell.content,
          columnWidths[j],
          alignments[j] === Alignment.NONE ? options.defaultAlignment : alignments[j],
          options.textWidthOptions
        )))
      ),
      marginLeft,
      ""
    ));
  }
  return {
    table: new Table(rows),
    marginLeft
  };
}

/**
 * Formats a table weakly.
 * Rows are formatted independently to each other, cell contents are just trimmed and not aligned.
 * This is useful when using a non-monospaced font or dealing with wide tables.
 *
 * @private
 * @param {Table} table - A table object.
 * @param {Object} options - An object containing options for formatting.
 * The function accepts the same option object for {@link formatTable}, but properties not listed
 * here are just ignored.
 *
 * | property name       | type           | description          |
 * | ------------------- | -------------- | -------------------- |
 * | `minDelimiterWidth` | {@link number} | Width of delimiters. |
 *
 * @returns {Object} An object that represents the result of formatting.
 *
 * | property name   | type           | description                                    |
 * | --------------- | -------------- | ---------------------------------------------- |
 * | `table`         | {@link Table}  | A formatted table object.                      |
 * | `marginLeft`    | {@link string} | The common left margin of the formatted table. |
 */
function _weakFormatTable(table, options) {
  const tableHeight = table.getHeight();
  const tableWidth = table.getWidth();
  if (tableHeight === 0) {
    return {
      table,
      marginLeft: ""
    };
  }
  const marginLeft = table.getRowAt(0).marginLeft;
  if (tableWidth === 0) {
    const rows = new Array(tableHeight).fill()
      .map(() => new TableRow([], marginLeft, ""));
    return {
      table: new Table(rows),
      marginLeft
    };
  }
  const delimiterRow = table.getDelimiterRow();
  // format
  const rows = [];
  // header
  const headerRow = table.getRowAt(0);
  rows.push(new TableRow(
    headerRow.getCells().map(cell =>
      new TableCell(_padText(cell.content))
    ),
    marginLeft,
    ""
  ));
  // delimiter
  if (delimiterRow !== undefined) {
    rows.push(new TableRow(
      delimiterRow.getCells().map(cell =>
        new TableCell(_delimiterText(cell.getAlignment(), options.minDelimiterWidth))
      ),
      marginLeft,
      ""
    ));
  }
  // body
  for (let i = delimiterRow !== undefined ? 2 : 1; i < tableHeight; i++) {
    const row = table.getRowAt(i);
    rows.push(new TableRow(
      row.getCells().map(cell =>
        new TableCell(_padText(cell.content))
      ),
      marginLeft,
      ""
    ));
  }
  return {
    table: new Table(rows),
    marginLeft
  };
}

/**
 * Represents table format type.
 *
 * - `FormatType.NORMAL` - Formats table normally.
 * - `FormatType.WEAK` - Formats table weakly, rows are formatted independently to each other, cell
 *   contents are just trimmed and not aligned.
 *
 * @type {Object}
 */
const FormatType = Object.freeze({
  NORMAL: "normal",
  WEAK  : "weak"
});


/**
 * Formats a table.
 *
 * @private
 * @param {Table} table - A table object.
 * @param {Object} options - An object containing options for formatting.
 *
 * | property name       | type                     | description                                             |
 * | ------------------- | ------------------------ | ------------------------------------------------------- |
 * | `formatType`        | {@link FormatType}       | Format type, normal or weak.                            |
 * | `minDelimiterWidth` | {@link number}           | Minimum width of delimiters.                            |
 * | `defaultAlignment`  | {@link DefaultAlignment} | Default alignment of columns.                           |
 * | `headerAlignment`   | {@link HeaderAlignment}  | Alignment of header cells.                              |
 * | `textWidthOptions`  | {@link Object}           | An object containing options for computing text widths. |
 *
 * `options.textWidthOptions` must contain the following options.
 *
 * | property name     | type                              | description                                         |
 * | ----------------- | --------------------------------- | --------------------------------------------------- |
 * | `normalize`       | {@link boolean}                   | Normalize texts before computing text widths.       |
 * | `wideChars`       | {@link Set}&lt;{@link string}&gt; | Set of characters that should be treated as wide.   |
 * | `narrowChars`     | {@link Set}&lt;{@link string}&gt; | Set of characters that should be treated as narrow. |
 * | `ambiguousAsWide` | {@link boolean}                   | Treat East Asian Ambiguous characters as wide.      |
 *
 * @returns {Object} An object that represents the result of formatting.
 *
 * | property name   | type           | description                                    |
 * | --------------- | -------------- | ---------------------------------------------- |
 * | `table`         | {@link Table}  | A formatted table object.                      |
 * | `marginLeft`    | {@link string} | The common left margin of the formatted table. |
 *
 * @throws {Error} Unknown format type.
 */
function formatTable(table, options) {
  switch (options.formatType) {
  case FormatType.NORMAL:
    return _formatTable(table, options);
  case FormatType.WEAK:
    return _weakFormatTable(table, options);
  default:
    throw new Error("Unknown format type: " + options.formatType);
  }
}

/**
 * Alters a column's alignment of a table.
 *
 * @private
 * @param {Table} table - A completed non-empty table.
 * @param {number} columnIndex - An index of the column.
 * @param {Alignment} alignment - A new alignment of the column.
 * @param {Object} options - An object containing options for completion.
 *
 * | property name       | type           | description          |
 * | ------------------- | -------------- | -------------------- |
 * | `minDelimiterWidth` | {@link number} | Width of delimiters. |
 *
 * @returns {Table} An altered table object.
 * If the column index is out of range, returns the original table.
 */
function alterAlignment(table, columnIndex, alignment, options) {
  const delimiterRow = table.getRowAt(1);
  if (columnIndex < 0 || delimiterRow.getWidth() - 1 < columnIndex) {
    return table;
  }
  const delimiterCells = delimiterRow.getCells();
  delimiterCells[columnIndex] = new TableCell(_delimiterText(alignment, options.minDelimiterWidth));
  const rows = table.getRows();
  rows[1] = new TableRow(delimiterCells, delimiterRow.marginLeft, delimiterRow.marginRight);
  return new Table(rows);
}

/**
 * Inserts a row to a table.
 * The row is always inserted after the header and the delimiter rows, even if the index specifies
 * the header or the delimiter.
 *
 * @private
 * @param {Table} table - A completed non-empty table.
 * @param {number} rowIndex - An row index at which a new row will be inserted.
 * @param {TableRow} row - A table row to be inserted.
 * @returns {Table} An altered table obejct.
 */
function insertRow(table, rowIndex, row) {
  const rows = table.getRows();
  rows.splice(Math.max(rowIndex, 2), 0, row);
  return new Table(rows);
}

/**
 * Deletes a row in a table.
 * If the index specifies the header row, the cells are emptied but the row will not be removed.
 * If the index specifies the delimiter row, it does nothing.
 *
 * @private
 * @param {Table} table - A completed non-empty table.
 * @param {number} rowIndex - An index of the row to be deleted.
 * @returns {Table} An altered table obejct.
 */
function deleteRow(table, rowIndex) {
  if (rowIndex === 1) {
    return table;
  }
  const rows = table.getRows();
  if (rowIndex === 0) {
    const headerRow = rows[0];
    rows[0] = new TableRow(
      new Array(headerRow.getWidth()).fill(new TableCell("")),
      headerRow.marginLeft,
      headerRow.marginRight
    );
  }
  else {
    rows.splice(rowIndex, 1);
  }
  return new Table(rows);
}

/**
 * Moves a row at the index to the specified destination.
 *
 * @private
 * @param {Table} table - A completed non-empty table.
 * @param {number} rowIndex - Index of the row to be moved.
 * @param {number} destIndex - Index of the destination.
 * @returns {Table} An altered table object.
 */
function moveRow(table, rowIndex, destIndex) {
  if (rowIndex <= 1 || destIndex <= 1 || rowIndex === destIndex) {
    return table;
  }
  const rows = table.getRows();
  const row = rows[rowIndex];
  rows.splice(rowIndex, 1);
  rows.splice(destIndex, 0, row);
  return new Table(rows);
}

/**
 * Inserts a column to a table.
 *
 * @private
 * @param {Table} table - A completed non-empty table.
 * @param {number} columnIndex - An column index at which the new column will be inserted.
 * @param {Array<TableCell>} column - An array of cells.
 * @param {Object} options - An object containing options for completion.
 *
 * | property name       | type           | description             |
 * | ------------------- | -------------- | ----------------------- |
 * | `minDelimiterWidth` | {@link number} | Width of the delimiter. |
 *
 * @returns {Table} An altered table obejct.
 */
function insertColumn(table, columnIndex, column, options) {
  const rows = table.getRows();
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = rows[i].getCells();
    const cell = i === 1
      ? new TableCell(_delimiterText(Alignment.NONE, options.minDelimiterWidth))
      : column[i > 1 ? i - 1 : i];
    cells.splice(columnIndex, 0, cell);
    rows[i] = new TableRow(cells, row.marginLeft, row.marginRight);
  }
  return new Table(rows);
}

/**
 * Deletes a column in a table.
 * If there will be no columns after the deletion, the cells are emptied but the column will not be
 * removed.
 *
 * @private
 * @param {Table} table - A completed non-empty table.
 * @param {number} columnIndex - An index of the column to be deleted.
 * @param {Object} options - An object containing options for completion.
 *
 * | property name       | type           | description             |
 * | ------------------- | -------------- | ----------------------- |
 * | `minDelimiterWidth` | {@link number} | Width of the delimiter. |
 *
 * @returns {Table} An altered table object.
 */
function deleteColumn(table, columnIndex, options) {
  const rows = table.getRows();
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let cells = row.getCells();
    if (cells.length <= 1) {
      cells = [new TableCell(i === 1
        ? _delimiterText(Alignment.NONE, options.minDelimiterWidth)
        : ""
      )];
    }
    else {
      cells.splice(columnIndex, 1);
    }
    rows[i] = new TableRow(cells, row.marginLeft, row.marginRight);
  }
  return new Table(rows);
}

/**
 * Moves a column at the index to the specified destination.
 *
 * @private
 * @param {Table} table - A completed non-empty table.
 * @param {number} columnIndex - Index of the column to be moved.
 * @param {number} destIndex - Index of the destination.
 * @returns {Table} An altered table object.
 */
function moveColumn(table, columnIndex, destIndex) {
  if (columnIndex === destIndex) {
    return table;
  }
  const rows = table.getRows();
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getCells();
    const cell = cells[columnIndex];
    cells.splice(columnIndex, 1);
    cells.splice(destIndex, 0, cell);
    rows[i] = new TableRow(cells, row.marginLeft, row.marginRight);
  }
  return new Table(rows);
}

/**
 * The `Insert` class represents an insertion of a line.
 *
 * @private
 */
class Insert {
  /**
   * Creats a new `Insert` object.
   *
   * @param {number} row - Row index, starts from `0`.
   * @param {string} line - A string to be inserted at the row.
   */
  constructor(row, line) {
    /** @private */
    this._row = row;
    /** @private */
    this._line = line;
  }

  /**
   * Row index, starts from `0`.
   *
   * @type {number}
   */
  get row() {
    return this._row;
  }

  /**
   * A string to be inserted.
   *
   * @type {string}
   */
  get line() {
    return this._line;
  }
}

/**
 * The `Delete` class represents a deletion of a line.
 *
 * @private
 */
class Delete {
  /**
   * Creates a new `Delete` object.
   *
   * @param {number} row - Row index, starts from `0`.
   */
  constructor(row) {
    /** @private */
    this._row = row;
  }

  /**
   * Row index, starts from `0`.
   *
   * @type {number}
   */
  get row() {
    return this._row;
  }
}

/**
 * Applies a command to the text editor.
 *
 * @private
 * @param {ITextEditor} textEditor - An interface to the text editor.
 * @param {Insert|Delete} command - A command.
 * @param {number} rowOffset - Offset to the row index of the command.
 * @returns {undefined}
 */
function _applyCommand(textEditor, command, rowOffset) {
  if (command instanceof Insert) {
    textEditor.insertLine(rowOffset + command.row, command.line);
  }
  else if (command instanceof Delete) {
    textEditor.deleteLine(rowOffset + command.row);
  }
  else {
    throw new Error("Unknown command");
  }
}

/**
 * Apply an edit script (array of commands) to the text editor.
 *
 * @private
 * @param {ITextEditor} textEditor - An interface to the text editor.
 * @param {Array<Insert|Delete>} script - An array of commands.
 * The commands are applied sequentially in the order of the array.
 * @param {number} rowOffset - Offset to the row index of the commands.
 * @returns {undefined}
 */
function applyEditScript(textEditor, script, rowOffset) {
  for (const command of script) {
    _applyCommand(textEditor, command, rowOffset);
  }
}


/**
 * Linked list used to remember edit script.
 *
 * @private
 */
class IList {
  get car() {
    throw new Error("Not implemented");
  }

  get cdr() {
    throw new Error("Not implemented");
  }

  isEmpty() {
    throw new Error("Not implemented");
  }

  unshift(value) {
    return new Cons(value, this);
  }

  toArray() {
    const arr = [];
    let rest = this;
    while (!rest.isEmpty()) {
      arr.push(rest.car);
      rest = rest.cdr;
    }
    return arr;
  }
}

/**
 * @private
 */
class Nil extends IList {
  constructor() {
    super();
  }

  get car() {
    throw new Error("Empty list");
  }

  get cdr() {
    throw new Error("Empty list");
  }

  isEmpty() {
    return true;
  }
}

/**
 * @private
 */
class Cons extends IList {
  constructor(car, cdr) {
    super();
    this._car = car;
    this._cdr = cdr;
  }

  get car() {
    return this._car;
  }

  get cdr() {
    return this._cdr;
  }

  isEmpty() {
    return false;
  }
}

const nil = new Nil();


/**
 * Computes the shortest edit script between two arrays of strings.
 *
 * @private
 * @param {Array<string>} from - An array of string the edit starts from.
 * @param {Array<string>} to - An array of string the edit goes to.
 * @param {number} [limit=-1] - Upper limit of edit distance to be searched.
 * If negative, there is no limit.
 * @returns {Array<Insert|Delete>|undefined} The shortest edit script that turns `from` into `to`;
 * `undefined` if no edit script is found in the given range.
 */
function shortestEditScript(from, to, limit = -1) {
  const fromLen = from.length;
  const toLen = to.length;
  const maxd = limit >= 0 ? Math.min(limit, fromLen + toLen) : fromLen + toLen;
  const mem = new Array(Math.min(maxd, fromLen) + Math.min(maxd, toLen) + 1);
  const offset = Math.min(maxd, fromLen);
  for (let d = 0; d <= maxd; d++) {
    const mink = d <= fromLen ? -d :  d - 2 * fromLen;
    const maxk = d <= toLen   ?  d : -d + 2 * toLen;
    for (let k = mink; k <= maxk; k += 2) {
      let i;
      let script;
      if (d === 0) {
        i = 0;
        script = nil;
      }
      else if (k === -d) {
        i = mem[offset + k + 1].i + 1;
        script = mem[offset + k + 1].script.unshift(new Delete(i + k));
      }
      else if (k === d) {
        i = mem[offset + k - 1].i;
        script = mem[offset + k - 1].script.unshift(new Insert(i + k - 1, to[i + k - 1]));
      }
      else {
        const vi = mem[offset + k + 1].i + 1;
        const hi = mem[offset + k - 1].i;
        if (vi > hi) {
          i = vi;
          script = mem[offset + k + 1].script.unshift(new Delete(i + k));
        }
        else {
          i = hi;
          script = mem[offset + k - 1].script.unshift(new Insert(i + k - 1, to[i + k - 1]));
        }
      }
      while (i < fromLen && i + k < toLen && from[i] === to[i + k]) {
        i += 1;
      }
      if (k === toLen - fromLen && i === fromLen) {
        return script.toArray().reverse();
      }
      mem[offset + k] = { i, script };
    }
  }
  return undefined;
}

/**
 * The `ITextEditor` represents an interface to a text editor.
 *
 * @interface
 */
class ITextEditor {
  /**
   * Gets the current cursor position.
   *
   * @returns {Point} A point object that represents the cursor position.
   */
  getCursorPosition() {
    throw new Error("Not implemented: getCursorPosition");
  }

  /**
   * Sets the cursor position to a specified one.
   *
   * @param {Point} pos - A point object which the cursor position is set to.
   * @returns {undefined}
   */
  setCursorPosition(pos) {
    throw new Error("Not implemented: setCursorPosition");
  }

  /**
   * Sets the selection range.
   * This method also expects the cursor position to be moved as the end of the selection range.
   *
   * @param {Range} range - A range object that describes a selection range.
   * @returns {undefined}
   */
  setSelectionRange(range) {
    throw new Error("Not implemented: setSelectionRange");
  }

  /**
   * Gets the last row index of the text editor.
   *
   * @returns {number} The last row index.
   */
  getLastRow() {
    throw new Error("Not implemented: getLastRow");
  }

  /**
   * Checks if the editor accepts a table at a row to be editted.
   * It should return `false` if, for example, the row is in a code block (not Markdown).
   *
   * @param {number} row - A row index in the text editor.
   * @returns {boolean} `true` if the table at the row can be editted.
   */
  acceptsTableEdit(row) {
    throw new Error("Not implemented: acceptsTableEdit");
  }

  /**
   * Gets a line string at a row.
   *
   * @param {number} row - Row index, starts from `0`.
   * @returns {string} The line at the specified row.
   * The line must not contain an EOL like `"\n"` or `"\r"`.
   */
  getLine(row) {
    throw new Error("Not implemented: getLine");
  }

  /**
   * Inserts a line at a specified row.
   *
   * @param {number} row - Row index, starts from `0`.
   * @param {string} line - A string to be inserted.
   * This must not contain an EOL like `"\n"` or `"\r"`.
   * @return {undefined}
   */
  insertLine(row, line) {
    throw new Error("Not implemented: insertLine");
  }

  /**
   * Deletes a line at a specified row.
   *
   * @param {number} row - Row index, starts from `0`.
   * @returns {undefined}
   */
  deleteLine(row) {
    throw new Error("Not implemented: deleteLine");
  }

  /**
   * Replace lines in a specified range.
   *
   * @param {number} startRow - Start row index, starts from `0`.
   * @param {number} endRow - End row index.
   * Lines from `startRow` to `endRow - 1` is replaced.
   * @param {Array<string>} lines - An array of string.
   * Each strings must not contain an EOL like `"\n"` or `"\r"`.
   * @returns {undefined}
   */
  replaceLines(startRow, endRow, lines) {
    throw new Error("Not implemented: replaceLines");
  }

  /**
   * Batches multiple operations as a single undo/redo step.
   *
   * @param {Function} func - A callback function that executes some operations on the text editor.
   * @returns {undefined}
   */
  transact(func) {
    throw new Error("Not implemented: transact");
  }
}

/**
 * Reads a property of an object if exists; otherwise uses a default value.
 *
 * @private
 * @param {*} obj - An object. If a non-object value is specified, the default value is used.
 * @param {string} key - A key (or property name).
 * @param {*} defaultVal - A default value that is used when a value does not exist.
 * @returns {*} A read value or the default value.
 */
function _value(obj, key, defaultVal) {
  return (typeof obj === "object" && obj !== null && obj[key] !== undefined)
    ? obj[key]
    : defaultVal;
}

/**
 * Reads multiple properties of an object if exists; otherwise uses default values.
 *
 * @private
 * @param {*} obj - An object. If a non-object value is specified, the default value is used.
 * @param {Object} keys - An object that consists of pairs of a key and a default value.
 * @returns {Object} A new object that contains read values.
 */
function _values(obj, keys) {
  const res = {};
  for (const [key, defaultVal] of Object.entries(keys)) {
    res[key] = _value(obj, key, defaultVal);
  }
  return res;
}

/**
 * Reads options for the formatter from an object.
 * The default values are used for options that are not specified.
 *
 * @param {Object} obj - An object containing options.
 * The available options and default values are listed below.
 *
 * | property name       | type                              | description                                             | default value            |
 * | ------------------- | --------------------------------- | ------------------------------------------------------- | ------------------------ |
 * | `leftMarginChars`   | {@link Set}&lt;{@link string}&gt; | A set of additional left margin characters.             | `new Set()`              |
 * | `formatType`        | {@link FormatType}                | Format type, normal or weak.                            | `FormatType.NORMAL`      |
 * | `minDelimiterWidth` | {@link number}                    | Minimum width of delimiters.                            | `3`                      |
 * | `defaultAlignment`  | {@link DefaultAlignment}          | Default alignment of columns.                           | `DefaultAlignment.LEFT`  |
 * | `headerAlignment`   | {@link HeaderAlignment}           | Alignment of header cells.                              | `HeaderAlignment.FOLLOW` |
 * | `textWidthOptions`  | {@link Object}                    | An object containing options for computing text widths. |                          |
 * | `smartCursor`       | {@link boolean}                   | Enables "Smart Cursor" feature.                         | `false`                  |
 *
 * The available options for `obj.textWidthOptions` are the following ones.
 *
 * | property name     | type                              | description                                           | default value |
 * | ----------------- | --------------------------------- | ----------------------------------------------------- | ------------- |
 * | `normalize`       | {@link boolean}                   | Normalizes texts before computing text widths.        | `true`        |
 * | `wideChars`       | {@link Set}&lt;{@link string}&gt; | A set of characters that should be treated as wide.   | `new Set()`   |
 * | `narrowChars`     | {@link Set}&lt;{@link string}&gt; | A set of characters that should be treated as narrow. | `new Set()`   |
 * | `ambiguousAsWide` | {@link boolean}                   | Treats East Asian Ambiguous characters as wide.       | `false`       |
 *
 * @returns {Object} - An object that contains complete options.
 */
function options(obj) {
  const res = _values(obj, {
    leftMarginChars  : new Set(),
    formatType       : FormatType.NORMAL,
    minDelimiterWidth: 3,
    defaultAlignment : DefaultAlignment.LEFT,
    headerAlignment  : HeaderAlignment.FOLLOW,
    smartCursor      : false
  });
  res.textWidthOptions = _values(obj.textWidthOptions, {
    normalize      : true,
    wideChars      : new Set(),
    narrowChars    : new Set(),
    ambiguousAsWide: false
  });
  return res;
}

/**
 * Creates a regular expression object that matches a table row.
 *
 * @param {Set<string>} leftMarginChars - A set of additional left margin characters.
 * A pipe `|`, a backslash `\`, and a backquote will be ignored.
 * @returns {RegExp} A regular expression object that matches a table row.
 */
function _createIsTableRowRegex(leftMarginChars) {
  return new RegExp(`^${marginRegexSrc(leftMarginChars)}\\|`, "u");
}

/**
 * Computes new focus offset from information of completed and formatted tables.
 *
 * @private
 * @param {Focus} focus - A focus.
 * @param {Table} table - A completed but not formatted table with original cell contents.
 * @param {Object} formatted - Information of the formatted table.
 * @param {boolean} moved - Indicates whether the focus position is moved by a command or not.
 * @returns {number}
 */
function _computeNewOffset(focus, table, formatted, moved) {
  if (moved) {
    const formattedFocusedCell = formatted.table.getFocusedCell(focus);
    if (formattedFocusedCell !== undefined) {
      return formattedFocusedCell.computeRawOffset(0);
    }
    else {
      return focus.column < 0 ? formatted.marginLeft.length : 0;
    }
  }
  else {
    const focusedCell = table.getFocusedCell(focus);
    const formattedFocusedCell = formatted.table.getFocusedCell(focus);
    if (focusedCell !== undefined && formattedFocusedCell !== undefined) {
      const contentOffset = Math.min(
        focusedCell.computeContentOffset(focus.offset),
        formattedFocusedCell.content.length
      );
      return formattedFocusedCell.computeRawOffset(contentOffset);
    }
    else {
      return focus.column < 0 ? formatted.marginLeft.length : 0;
    }
  }
}

/**
 * The `TableEditor` class is at the center of the markdown-table-editor.
 * When a command is executed, it reads a table from the text editor, does some operation on the
 * table, and then apply the result to the text editor.
 *
 * To use this class, the text editor (or an interface to it) must implement {@link ITextEditor}.
 */
class TableEditor {
  /**
   * Creates a new table editor instance.
   *
   * @param {ITextEditor} textEditor - A text editor interface.
   */
  constructor(textEditor) {
    /** @private */
    this._textEditor = textEditor;
    // smart cursor
    /** @private */
    this._scActive = false;
    /** @private */
    this._scTablePos = null;
    /** @private */
    this._scStartFocus = null;
    /** @private */
    this._scLastFocus = null;
  }

  /**
   * Resets the smart cursor.
   * Call this method when the table editor is inactivated.
   *
   * @returns {undefined}
   */
  resetSmartCursor() {
    this._scActive = false;
  }

  /**
   * Checks if the cursor is in a table row.
   * This is useful to check whether the table editor should be activated or not.
   *
   * @param {Object} options - See {@link options}.
   * @returns {boolean} `true` if the cursor is in a table row.
   */
  cursorIsInTable(options) {
    const re = _createIsTableRowRegex(options.leftMarginChars);
    const pos = this._textEditor.getCursorPosition();
    return this._textEditor.acceptsTableEdit(pos.row)
      && re.test(this._textEditor.getLine(pos.row));
  }

  /**
   * Finds a table under the current cursor position.
   *
   * @private
   * @param {Object} options - See {@link options}.
   * @returns {Object|undefined} An object that contains information about the table;
   * `undefined` if there is no table.
   * The return object contains the properties listed in the table.
   *
   * | property name   | type                                | description                                                              |
   * | --------------- | ----------------------------------- | ------------------------------------------------------------------------ |
   * | `range`         | {@link Range}                       | The range of the table.                                                  |
   * | `lines`         | {@link Array}&lt;{@link string}&gt; | An array of the lines in the range.                                      |
   * | `table`         | {@link Table}                       | A table object read from the text editor.                                |
   * | `focus`         | {@link Focus}                       | A focus object that represents the current cursor position in the table. |
   */
  _findTable(options) {
    const re = _createIsTableRowRegex(options.leftMarginChars);
    const pos = this._textEditor.getCursorPosition();
    const lastRow = this._textEditor.getLastRow();
    const lines = [];
    let startRow = pos.row;
    let endRow = pos.row;
    // current line
    {
      const line = this._textEditor.getLine(pos.row);
      if (!this._textEditor.acceptsTableEdit(pos.row) || !re.test(line)) {
        return undefined;
      }
      lines.push(line);
    }
    // previous lines
    for (let row = pos.row - 1; row >= 0; row--) {
      const line = this._textEditor.getLine(row);
      if (!this._textEditor.acceptsTableEdit(row) || !re.test(line)) {
        break;
      }
      lines.unshift(line);
      startRow = row;
    }
    // next lines
    for (let row = pos.row + 1; row <= lastRow; row++) {
      const line = this._textEditor.getLine(row);
      if (!this._textEditor.acceptsTableEdit(row) || !re.test(line)) {
        break;
      }
      lines.push(line);
      endRow = row;
    }
    const range = new Range(
      new Point(startRow, 0),
      new Point(endRow, lines[lines.length - 1].length)
    );
    const table = readTable(lines, options);
    const focus = table.focusOfPosition(pos, startRow);
    return { range, lines, table, focus };
  }

  /**
   * Finds a table and does an operation with it.
   *
   * @private
   * @param {Object} options - See {@link options}.
   * @param {Function} func - A function that does some operation on table information obtained by
   * {@link TableEditor#_findTable}.
   * @returns {undefined}
   */
  _withTable(options, func) {
    const info = this._findTable(options);
    if (info === undefined) {
      return;
    }
    func(info);
  }

  /**
   * Updates lines in a given range in the text editor.
   *
   * @private
   * @param {number} startRow - Start row index, starts from `0`.
   * @param {number} endRow - End row index.
   * Lines from `startRow` to `endRow - 1` are replaced.
   * @param {Array<string>} newLines - New lines.
   * @param {Array<string>} [oldLines=undefined] - Old lines to be replaced.
   * @returns {undefined}
   */
  _updateLines(startRow, endRow, newLines, oldLines = undefined) {
    if (oldLines !== undefined) {
      // apply the shortest edit script
      // if a table is edited in a normal manner, the edit distance never exceeds 3
      const ses = shortestEditScript(oldLines, newLines, 3);
      if (ses !== undefined) {
        applyEditScript(this._textEditor, ses, startRow);
        return;
      }
    }
    this._textEditor.replaceLines(startRow, endRow, newLines);
  }

  /**
   * Moves the cursor position to the focused cell,
   *
   * @private
   * @param {number} startRow - Row index where the table starts in the text editor.
   * @param {Table} table - A table.
   * @param {Focus} focus - A focus to which the cursor will be moved.
   * @returns {undefined}
   */
  _moveToFocus(startRow, table, focus) {
    const pos = table.positionOfFocus(focus, startRow);
    if (pos !== undefined) {
      this._textEditor.setCursorPosition(pos);
    }
  }

  /**
   * Selects the focused cell.
   * If the cell has no content to be selected, then just moves the cursor position.
   *
   * @private
   * @param {number} startRow - Row index where the table starts in the text editor.
   * @param {Table} table - A table.
   * @param {Focus} focus - A focus to be selected.
   * @returns {undefined}
   */
  _selectFocus(startRow, table, focus) {
    const range = table.selectionRangeOfFocus(focus, startRow);
    if (range !== undefined) {
      this._textEditor.setSelectionRange(range);
    }
    else {
      this._moveToFocus(startRow, table, focus);
    }
  }

  /**
   * Formats the table under the cursor.
   *
   * @param {Object} options - See {@link options}.
   * @returns {undefined}
   */
  format(options) {
    this._withTable(options, ({ range, lines, table, focus }) => {
      let newFocus = focus;
      // complete
      const completed = completeTable(table, options);
      if (completed.delimiterInserted && newFocus.row > 0) {
        newFocus = newFocus.setRow(newFocus.row + 1);
      }
      // format
      const formatted = formatTable(completed.table, options);
      newFocus = newFocus.setOffset(_computeNewOffset(newFocus, completed.table, formatted, false));
      // apply
      this._textEditor.transact(() => {
        this._updateLines(range.start.row, range.end.row + 1, formatted.table.toLines(), lines);
        this._moveToFocus(range.start.row, formatted.table, newFocus);
      });
    });
  }

  /**
   * Formats and escapes from the table.
   *
   * @param {Object} options - See {@link options}.
   * @returns {undefined}
   */
  escape(options) {
    this._withTable(options, ({ range, lines, table, focus }) => {
      // complete
      const completed = completeTable(table, options);
      // format
      const formatted = formatTable(completed.table, options);
      // apply
      const newRow = range.end.row + (completed.delimiterInserted ? 2 : 1);
      this._textEditor.transact(() => {
        this._updateLines(range.start.row, range.end.row + 1, formatted.table.toLines(), lines);
        let newPos;
        if (newRow > this._textEditor.getLastRow()) {
          this._textEditor.insertLine(newRow, "");
          newPos = new Point(newRow, 0);
        }
        else {
          const re = new RegExp(`^${marginRegexSrc(options.leftMarginChars)}`, "u");
          const nextLine = this._textEditor.getLine(newRow);
          const margin = re.exec(nextLine)[0];
          newPos = new Point(newRow, margin.length);
        }
        this._textEditor.setCursorPosition(newPos);
      });
      this.resetSmartCursor();
    });
  }

  /**
   * Alters the alignment of the focused column.
   *
   * @param {Alignment} alignment - New alignment.
   * @param {Object} options - See {@link options}.
   * @returns {undefined}
   */
  alignColumn(alignment, options) {
    this._withTable(options, ({ range, lines, table, focus }) => {
      let newFocus = focus;
      // complete
      const completed = completeTable(table, options);
      if (completed.delimiterInserted && newFocus.row > 0) {
        newFocus = newFocus.setRow(newFocus.row + 1);
      }
      // alter alignment
      let altered = completed.table;
      if (0 <= newFocus.column && newFocus.column <= altered.getHeaderWidth() - 1) {
        altered = alterAlignment(completed.table, newFocus.column, alignment, options);
      }
      // format
      const formatted = formatTable(altered, options);
      newFocus = newFocus.setOffset(_computeNewOffset(newFocus, completed.table, formatted, false));
      // apply
      this._textEditor.transact(() => {
        this._updateLines(range.start.row, range.end.row + 1, formatted.table.toLines(), lines);
        this._moveToFocus(range.start.row, formatted.table, newFocus);
      });
    });
  }

  /**
   * Selects the focused cell content.
   *
   * @param {Object} options - See {@link options}.
   * @returns {undefined}
   */
  selectCell(options) {
    this._withTable(options, ({ range, lines, table, focus }) => {
      let newFocus = focus;
      // complete
      const completed = completeTable(table, options);
      if (completed.delimiterInserted && newFocus.row > 0) {
        newFocus = newFocus.setRow(newFocus.row + 1);
      }
      // format
      const formatted = formatTable(completed.table, options);
      newFocus = newFocus.setOffset(_computeNewOffset(newFocus, completed.table, formatted, false));
      // apply
      this._textEditor.transact(() => {
        this._updateLines(range.start.row, range.end.row + 1, formatted.table.toLines(), lines);
        this._selectFocus(range.start.row, formatted.table, newFocus);
      });
    });
  }

  /**
   * Moves the focus to another cell.
   *
   * @param {number} rowOffset - Offset in row.
   * @param {number} columnOffset - Offset in column.
   * @param {Object} options - See {@link options}.
   * @returns {undefined}
   */
  moveFocus(rowOffset, columnOffset, options) {
    this._withTable(options, ({ range, lines, table, focus }) => {
      let newFocus = focus;
      // complete
      const completed = completeTable(table, options);
      if (completed.delimiterInserted && newFocus.row > 0) {
        newFocus = newFocus.setRow(newFocus.row + 1);
      }
      const startFocus = newFocus;
      // move focus
      if (rowOffset !== 0) {
        const height = completed.table.getHeight();
        // skip delimiter row
        const skip =
            newFocus.row < 1 && newFocus.row + rowOffset >= 1 ? 1
          : newFocus.row > 1 && newFocus.row + rowOffset <= 1 ? -1
          : 0;
        newFocus = newFocus.setRow(
          Math.min(Math.max(newFocus.row + rowOffset + skip, 0), height <= 2 ? 0 : height - 1)
        );
      }
      if (columnOffset !== 0) {
        const width = completed.table.getHeaderWidth();
        if (!(newFocus.column < 0 && columnOffset < 0)
          && !(newFocus.column > width - 1 && columnOffset > 0)) {
          newFocus = newFocus.setColumn(
            Math.min(Math.max(newFocus.column + columnOffset, 0), width - 1)
          );
        }
      }
      const moved = !newFocus.posEquals(startFocus);
      // format
      const formatted = formatTable(completed.table, options);
      newFocus = newFocus.setOffset(_computeNewOffset(newFocus, completed.table, formatted, moved));
      // apply
      this._textEditor.transact(() => {
        this._updateLines(range.start.row, range.end.row + 1, formatted.table.toLines(), lines);
        if (moved) {
          this._selectFocus(range.start.row, formatted.table, newFocus);
        }
        else {
          this._moveToFocus(range.start.row, formatted.table, newFocus);
        }
      });
      if (moved) {
        this.resetSmartCursor();
      }
    });
  }

  /**
   * Moves the focus to the next cell.
   *
   * @param {Object} options - See {@link options}.
   * @returns {undefined}
   */
  nextCell(options) {
    this._withTable(options, ({ range, lines, table, focus }) => {
      // reset smart cursor if moved
      const focusMoved = (this._scTablePos !== null && !range.start.equals(this._scTablePos))
        || (this._scLastFocus !== null && !focus.posEquals(this._scLastFocus));
      if (this._scActive && focusMoved) {
        this.resetSmartCursor();
      }
      let newFocus = focus;
      // complete
      const completed = completeTable(table, options);
      if (completed.delimiterInserted && newFocus.row > 0) {
        newFocus = newFocus.setRow(newFocus.row + 1);
      }
      const startFocus = newFocus;
      let altered = completed.table;
      // move focus
      if (newFocus.row === 1) {
        // move to next row
        newFocus = newFocus.setRow(2);
        if (options.smartCursor) {
          if (newFocus.column < 0 || altered.getHeaderWidth() - 1 < newFocus.column) {
            newFocus = newFocus.setColumn(0);
          }
        }
        else {
          newFocus = newFocus.setColumn(0);
        }
        // insert an empty row if needed
        if (newFocus.row > altered.getHeight() - 1) {
          const row = new Array(altered.getHeaderWidth()).fill(new TableCell(""));
          altered = insertRow(altered, altered.getHeight(), new TableRow(row, "", ""));
        }
      }
      else {
        // insert an empty column if needed
        if (newFocus.column > altered.getHeaderWidth() - 1) {
          const column = new Array(altered.getHeight() - 1).fill(new TableCell(""));
          altered = insertColumn(altered, altered.getHeaderWidth(), column, options);
        }
        // move to next column
        newFocus = newFocus.setColumn(newFocus.column + 1);
      }
      // format
      const formatted = formatTable(altered, options);
      newFocus = newFocus.setOffset(_computeNewOffset(newFocus, altered, formatted, true));
      // apply
      const newLines = formatted.table.toLines();
      if (newFocus.column > formatted.table.getHeaderWidth() - 1) {
        // add margin
        newLines[newFocus.row] += " ";
        newFocus = newFocus.setOffset(1);
      }
      this._textEditor.transact(() => {
        this._updateLines(range.start.row, range.end.row + 1, newLines, lines);
        this._selectFocus(range.start.row, formatted.table, newFocus);
      });
      if (options.smartCursor) {
        if (!this._scActive) {
          // activate smart cursor
          this._scActive = true;
          this._scTablePos = range.start;
          if (startFocus.column < 0 || formatted.table.getHeaderWidth() - 1 < startFocus.column) {
            this._scStartFocus = new Focus(startFocus.row, 0, 0);
          }
          else {
            this._scStartFocus = startFocus;
          }
        }
        this._scLastFocus = newFocus;
      }
    });
  }

  /**
   * Moves the focus to the previous cell.
   *
   * @param {Object} options - See {@link options}.
   * @returns {undefined}
   */
  previousCell(options) {
    this._withTable(options, ({ range, lines, table, focus }) => {
      let newFocus = focus;
      // complete
      const completed = completeTable(table, options);
      if (completed.delimiterInserted && newFocus.row > 0) {
        newFocus = newFocus.setRow(newFocus.row + 1);
      }
      const startFocus = newFocus;
      // move focus
      if (newFocus.row === 0) {
        if (newFocus.column > 0) {
          newFocus = newFocus.setColumn(newFocus.column - 1);
        }
      }
      else if (newFocus.row === 1) {
        newFocus = new Focus(0, completed.table.getHeaderWidth() - 1, newFocus.offset);
      }
      else {
        if (newFocus.column > 0) {
          newFocus = newFocus.setColumn(newFocus.column - 1);
        }
        else {
          newFocus = new Focus(
            newFocus.row === 2 ? 0 : newFocus.row - 1,
            completed.table.getHeaderWidth() - 1,
            newFocus.offset
          );
        }
      }
      const moved = !newFocus.posEquals(startFocus);
      // format
      const formatted = formatTable(completed.table, options);
      newFocus = newFocus.setOffset(_computeNewOffset(newFocus, completed.table, formatted, moved));
      // apply
      this._textEditor.transact(() => {
        this._updateLines(range.start.row, range.end.row + 1, formatted.table.toLines(), lines);
        if (moved) {
          this._selectFocus(range.start.row, formatted.table, newFocus);
        }
        else {
          this._moveToFocus(range.start.row, formatted.table, newFocus);
        }
      });
      if (moved) {
        this.resetSmartCursor();
      }
    });
  }

  /**
   * Moves the focus to the next row.
   *
   * @param {Object} options - See {@link options}.
   * @returns {undefined}
   */
  nextRow(options) {
    this._withTable(options, ({ range, lines, table, focus }) => {
      // reset smart cursor if moved
      const focusMoved = (this._scTablePos !== null && !range.start.equals(this._scTablePos))
        || (this._scLastFocus !== null && !focus.posEquals(this._scLastFocus));
      if (this._scActive && focusMoved) {
        this.resetSmartCursor();
      }
      let newFocus = focus;
      // complete
      const completed = completeTable(table, options);
      if (completed.delimiterInserted && newFocus.row > 0) {
        newFocus = newFocus.setRow(newFocus.row + 1);
      }
      const startFocus = newFocus;
      let altered = completed.table;
      // move focus
      if (newFocus.row === 0) {
        newFocus = newFocus.setRow(2);
      }
      else {
        newFocus = newFocus.setRow(newFocus.row + 1);
      }
      if (options.smartCursor) {
        if (this._scActive) {
          newFocus = newFocus.setColumn(this._scStartFocus.column);
        }
        else if (newFocus.column < 0 || altered.getHeaderWidth() - 1 < newFocus.column) {
          newFocus = newFocus.setColumn(0);
        }
      }
      else {
        newFocus = newFocus.setColumn(0);
      }
      // insert empty row if needed
      if (newFocus.row > altered.getHeight() - 1) {
        const row = new Array(altered.getHeaderWidth()).fill(new TableCell(""));
        altered = insertRow(altered, altered.getHeight(), new TableRow(row, "", ""));
      }
      // format
      const formatted = formatTable(altered, options);
      newFocus = newFocus.setOffset(_computeNewOffset(newFocus, altered, formatted, true));
      // apply
      this._textEditor.transact(() => {
        this._updateLines(range.start.row, range.end.row + 1, formatted.table.toLines(), lines);
        this._selectFocus(range.start.row, formatted.table, newFocus);
      });
      if (options.smartCursor) {
        if (!this._scActive) {
          // activate smart cursor
          this._scActive = true;
          this._scTablePos = range.start;
          if (startFocus.column < 0 || formatted.table.getHeaderWidth() - 1 < startFocus.column) {
            this._scStartFocus = new Focus(startFocus.row, 0, 0);
          }
          else {
            this._scStartFocus = startFocus;
          }
        }
        this._scLastFocus = newFocus;
      }
    });
  }

  /**
   * Inserts an empty row at the current focus.
   *
   * @param {Object} options - See {@link options}.
   * @returns {undefined}
   */
  insertRow(options) {
    this._withTable(options, ({ range, lines, table, focus }) => {
      let newFocus = focus;
      // complete
      const completed = completeTable(table, options);
      if (completed.delimiterInserted && newFocus.row > 0) {
        newFocus = newFocus.setRow(newFocus.row + 1);
      }
      // move focus
      if (newFocus.row <= 1) {
        newFocus = newFocus.setRow(2);
      }
      newFocus = newFocus.setColumn(0);
      // insert an empty row
      const row = new Array(completed.table.getHeaderWidth()).fill(new TableCell(""));
      const altered = insertRow(completed.table, newFocus.row, new TableRow(row, "", ""));
      // format
      const formatted = formatTable(altered, options);
      newFocus = newFocus.setOffset(_computeNewOffset(newFocus, altered, formatted, true));
      // apply
      this._textEditor.transact(() => {
        this._updateLines(range.start.row, range.end.row + 1, formatted.table.toLines(), lines);
        this._moveToFocus(range.start.row, formatted.table, newFocus);
      });
      this.resetSmartCursor();
    });
  }

  /**
   * Deletes a row at the current focus.
   *
   * @param {Object} options - See {@link options}.
   * @returns {undefined}
   */
  deleteRow(options) {
    this._withTable(options, ({ range, lines, table, focus }) => {
      let newFocus = focus;
      // complete
      const completed = completeTable(table, options);
      if (completed.delimiterInserted && newFocus.row > 0) {
        newFocus = newFocus.setRow(newFocus.row + 1);
      }
      // delete a row
      let altered = completed.table;
      let moved = false;
      if (newFocus.row !== 1) {
        altered = deleteRow(altered, newFocus.row);
        moved = true;
        if (newFocus.row > altered.getHeight() - 1) {
          newFocus = newFocus.setRow(newFocus.row === 2 ? 0 : newFocus.row - 1);
        }
      }
      // format
      const formatted = formatTable(altered, options);
      newFocus = newFocus.setOffset(_computeNewOffset(newFocus, altered, formatted, moved));
      // apply
      this._textEditor.transact(() => {
        this._updateLines(range.start.row, range.end.row + 1, formatted.table.toLines(), lines);
        if (moved) {
          this._selectFocus(range.start.row, formatted.table, newFocus);
        }
        else {
          this._moveToFocus(range.start.row, formatted.table, newFocus);
        }
      });
      this.resetSmartCursor();
    });
  }

  /**
   * Moves the focused row by the specified offset.
   *
   * @param {number} offset - An offset the row is moved by.
   * @param {Object} options - See {@link options}.
   * @returns {undefined}
   */
  moveRow(offset, options) {
    this._withTable(options, ({ range, lines, table, focus }) => {
      let newFocus = focus;
      // complete
      const completed = completeTable(table, options);
      if (completed.delimiterInserted && newFocus.row > 0) {
        newFocus = newFocus.setRow(newFocus.row + 1);
      }
      // move row
      let altered = completed.table;
      if (newFocus.row > 1) {
        const dest = Math.min(Math.max(newFocus.row + offset, 2), altered.getHeight() - 1);
        altered = moveRow(altered, newFocus.row, dest);
        newFocus = newFocus.setRow(dest);
      }
      // format
      const formatted = formatTable(altered, options);
      newFocus = newFocus.setOffset(_computeNewOffset(newFocus, altered, formatted, false));
      // apply
      this._textEditor.transact(() => {
        this._updateLines(range.start.row, range.end.row + 1, formatted.table.toLines(), lines);
        this._moveToFocus(range.start.row, formatted.table, newFocus);
      });
      this.resetSmartCursor();
    });
  }

  /**
   * Inserts an empty column at the current focus.
   *
   * @param {Object} options - See {@link options}.
   * @returns {undefined}
   */
  insertColumn(options) {
    this._withTable(options, ({ range, lines, table, focus }) => {
      let newFocus = focus;
      // complete
      const completed = completeTable(table, options);
      if (completed.delimiterInserted && newFocus.row > 0) {
        newFocus = newFocus.setRow(newFocus.row + 1);
      }
      // move focus
      if (newFocus.row === 1) {
        newFocus = newFocus.setRow(0);
      }
      if (newFocus.column < 0) {
        newFocus = newFocus.setColumn(0);
      }
      // insert an empty column
      const column = new Array(completed.table.getHeight() - 1).fill(new TableCell(""));
      const altered = insertColumn(completed.table, newFocus.column, column, options);
      // format
      const formatted = formatTable(altered, options);
      newFocus = newFocus.setOffset(_computeNewOffset(newFocus, altered, formatted, true));
      // apply
      this._textEditor.transact(() => {
        this._updateLines(range.start.row, range.end.row + 1, formatted.table.toLines(), lines);
        this._moveToFocus(range.start.row, formatted.table, newFocus);
      });
      this.resetSmartCursor();
    });
  }

  /**
   * Deletes a column at the current focus.
   *
   * @param {Object} options - See {@link options}.
   * @returns {undefined}
   */
  deleteColumn(options) {
    this._withTable(options, ({ range, lines, table, focus }) => {
      let newFocus = focus;
      // complete
      const completed = completeTable(table, options);
      if (completed.delimiterInserted && newFocus.row > 0) {
        newFocus = newFocus.setRow(newFocus.row + 1);
      }
      // move focus
      if (newFocus.row === 1) {
        newFocus = newFocus.setRow(0);
      }
      // delete a column
      let altered = completed.table;
      let moved = false;
      if (0 <= newFocus.column && newFocus.column <= altered.getHeaderWidth() - 1) {
        altered = deleteColumn(completed.table, newFocus.column, options);
        moved = true;
        if (newFocus.column > altered.getHeaderWidth() - 1) {
          newFocus = newFocus.setColumn(altered.getHeaderWidth() - 1);
        }
      }
      // format
      const formatted = formatTable(altered, options);
      newFocus = newFocus.setOffset(_computeNewOffset(newFocus, altered, formatted, moved));
      // apply
      this._textEditor.transact(() => {
        this._updateLines(range.start.row, range.end.row + 1, formatted.table.toLines(), lines);
        if (moved) {
          this._selectFocus(range.start.row, formatted.table, newFocus);
        }
        else {
          this._moveToFocus(range.start.row, formatted.table, newFocus);
        }
      });
      this.resetSmartCursor();
    });
  }

  /**
   * Moves the focused column by the specified offset.
   *
   * @param {number} offset - An offset the column is moved by.
   * @param {Object} options - See {@link options}.
   * @returns {undefined}
   */
  moveColumn(offset, options) {
    this._withTable(options, ({ range, lines, table, focus }) => {
      let newFocus = focus;
      // complete
      const completed = completeTable(table, options);
      if (completed.delimiterInserted && newFocus.row > 0) {
        newFocus = newFocus.setRow(newFocus.row + 1);
      }
      // move column
      let altered = completed.table;
      if (0 <= newFocus.column && newFocus.column <= altered.getHeaderWidth() - 1) {
        const dest = Math.min(Math.max(newFocus.column + offset, 0), altered.getHeaderWidth() - 1);
        altered = moveColumn(altered, newFocus.column, dest);
        newFocus = newFocus.setColumn(dest);
      }
      // format
      const formatted = formatTable(altered, options);
      newFocus = newFocus.setOffset(_computeNewOffset(newFocus, altered, formatted, false));
      // apply
      this._textEditor.transact(() => {
        this._updateLines(range.start.row, range.end.row + 1, formatted.table.toLines(), lines);
        this._moveToFocus(range.start.row, formatted.table, newFocus);
      });
      this.resetSmartCursor();
    });
  }

  /**
   * Formats all the tables in the text editor.
   *
   * @param {Object} options - See {@link options}.
   * @returns {undefined}
   */
  formatAll(options) {
    this._textEditor.transact(() => {
      const re = _createIsTableRowRegex(options.leftMarginChars);
      let pos = this._textEditor.getCursorPosition();
      let lines = [];
      let startRow = undefined;
      let lastRow = this._textEditor.getLastRow();
      // find tables
      for (let row = 0; row <= lastRow; row++) {
        const line = this._textEditor.getLine(row);
        if (this._textEditor.acceptsTableEdit(row) && re.test(line)) {
          lines.push(line);
          if (startRow === undefined) {
            startRow = row;
          }
        }
        else if (startRow !== undefined) {
          // get table info
          const endRow = row - 1;
          const range = new Range(
            new Point(startRow, 0),
            new Point(endRow, lines[lines.length - 1].length)
          );
          const table = readTable(lines, options);
          const focus = table.focusOfPosition(pos, startRow);
          const focused = focus !== undefined;
          // format
          let newFocus = focus;
          const completed = completeTable(table, options);
          if (focused && completed.delimiterInserted && newFocus.row > 0) {
            newFocus = newFocus.setRow(newFocus.row + 1);
          }
          const formatted = formatTable(completed.table, options);
          if (focused) {
            newFocus = newFocus.setOffset(
              _computeNewOffset(newFocus, completed.table, formatted, false)
            );
          }
          // apply
          const newLines = formatted.table.toLines();
          this._updateLines(range.start.row, range.end.row + 1, newLines, lines);
          // update cursor position
          const diff = newLines.length - lines.length;
          if (focused) {
            pos = formatted.table.positionOfFocus(newFocus, startRow);
          }
          else if (pos.row > endRow) {
            pos = new Point(pos.row + diff, pos.column);
          }
          // reset
          lines = [];
          startRow = undefined;
          // update
          lastRow += diff;
          row += diff;
        }
      }
      if (startRow !== undefined) {
        // get table info
        const endRow = lastRow;
        const range = new Range(
          new Point(startRow, 0),
          new Point(endRow, lines[lines.length - 1].length)
        );
        const table = readTable(lines, options);
        const focus = table.focusOfPosition(pos, startRow);
        // format
        let newFocus = focus;
        const completed = completeTable(table, options);
        if (completed.delimiterInserted && newFocus.row > 0) {
          newFocus = newFocus.setRow(newFocus.row + 1);
        }
        const formatted = formatTable(completed.table, options);
        newFocus = newFocus.setOffset(
          _computeNewOffset(newFocus, completed.table, formatted, false)
        );
        // apply
        const newLines = formatted.table.toLines();
        this._updateLines(range.start.row, range.end.row + 1, newLines, lines);
        pos = formatted.table.positionOfFocus(newFocus, startRow);
      }
      this._textEditor.setCursorPosition(pos);
    });
  }
}

exports.Point = Point;
exports.Range = Range;
exports.Focus = Focus;
exports.Alignment = Alignment;
exports.DefaultAlignment = DefaultAlignment;
exports.HeaderAlignment = HeaderAlignment;
exports.TableCell = TableCell;
exports.TableRow = TableRow;
exports.Table = Table;
exports.readTable = readTable;
exports.FormatType = FormatType;
exports.completeTable = completeTable;
exports.formatTable = formatTable;
exports.alterAlignment = alterAlignment;
exports.insertRow = insertRow;
exports.deleteRow = deleteRow;
exports.moveRow = moveRow;
exports.insertColumn = insertColumn;
exports.deleteColumn = deleteColumn;
exports.moveColumn = moveColumn;
exports.Insert = Insert;
exports.Delete = Delete;
exports.applyEditScript = applyEditScript;
exports.shortestEditScript = shortestEditScript;
exports.ITextEditor = ITextEditor;
exports.options = options;
exports.TableEditor = TableEditor;
//# sourceMappingURL=mte-kernel.js.map
