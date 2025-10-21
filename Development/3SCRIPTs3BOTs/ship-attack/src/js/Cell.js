'use strict';

export class Cell {
  #row;
  #col;
  #element;

  constructor(row, col, element) {
    this.row = row;
    this.col = col;
    this.element = element;
  }
  set row(row) {
    this.#row = row;
  }
  set col(col) {
    this.#col = col;
  }
  set element(element) {
    this.#element = element;
  }

  get row() {
    return this.#row;
  }
  get col() {
    return this.#col;
  }
  get element() {
    return this.#element;
  }
get key() {
  return `${this.#row},${this.#col}`;
}

  addClass(cls) {
    this.#element.classList.add(cls);
  }
  removeClass(cls) {
    this.#element.classList.remove(cls);
  }
}
