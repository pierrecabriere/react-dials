import DialogContainer from "./DialogContainer";
import Dialog from './Dialog'

const dialog = function (render, options) {
  const id = Math.random().toString(36).substr(2, 9);
  return new Dialog(id, render, options);
};

const closeDialog = function (dialog) {
  return Dialog.close(dialog);
}

export { DialogContainer, dialog, closeDialog };
