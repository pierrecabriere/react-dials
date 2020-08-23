import { Subject } from "rxjs";

class Dialog {
  id;
  render;
  options;
  ref = null;

  static subject = new Subject();

  static close(dialog) {
    Dialog.subject.next({ action: "remove", payload: dialog });
  }

  constructor(id, render, options = {}) {
    this.id = id;
    this.render = render;
    this.options = options;

    Dialog.subject.next({ action: "add", payload: this });
  }

  close() {
    Dialog.close(this);
  }

  update() {
    this.ref?.forceUpdate();
  }
}

export default Dialog;
