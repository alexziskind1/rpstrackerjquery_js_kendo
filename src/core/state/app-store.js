import { BehaviorSubject } from "rxjs";
import { distinctUntilChanged, pluck } from "rxjs/operators";

import { INITIAL_STATE } from "./app-state";

export class Store {
  constructor() {
    this.subj = new BehaviorSubject(INITIAL_STATE);
  }

  get value() {
    return this.subj.value;
  }

  select(name) {
    return this.subj.pipe(pluck(name), distinctUntilChanged());
  }

  set(name, state) {
    this.subj.next({
      ...this.value,
      [name]: state,
    });
  }
}
