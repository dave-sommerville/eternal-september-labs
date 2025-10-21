
'use strict';

export class Ship {
  #name;
  #orientation;
  #size;

  constructor(name, orientation, size) {
    this.name = name;
    this.orientation = orientation;
    this.size = size;
  }
  set name(name) {
    this.#name = name;
  }

  set orientation(orientation) {
    this.#orientation = orientation;
  }
  set size(size) {
    this.#size = size;
  }
  get name() {
    return this.#name;
  }

  get orientation() {
    return this.#orientation;
  }
  get size() {
    return this.#size;
  }
}