import { Subject } from "rxjs";

class Dialog {
  id;
  render;
  options;
  ref = null;

  static subject = new Subject();

  static close(input) {
    const id = input instanceof Dialog ? input.id : input;
    Dialog.subject.next({ action: "remove", payload: id });
  }

  constructor(id, render, options = {}) {
    this.id = id;
    this.render = render;
    this.options = options;

    Dialog.subject.next({ action: "add", payload: this });
  }

  close() {
    Dialog.close(this.id);
  }
}

export default Dialog;
