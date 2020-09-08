import { Subject } from "rxjs";

class Dialog {
  id;
  render;
  options;
  ref = null;

  static subject = new Subject();

  static open(dialog) {
    Dialog.subject.next({ action: "add", payload: dialog });
  }

  static close(dialog) {
    Dialog.subject.next({ action: "remove", payload: dialog });
  }

  constructor(id, render, options = {}) {
    this.id = id;
    this.render = render;
    this.options = options;

    this.open();
  }

  open() {
    Dialog.open(this);
  }

  close() {
    Dialog.close(this);
  }

  update() {
    this.ref?.forceUpdate();
  }
}

export default Dialog;
