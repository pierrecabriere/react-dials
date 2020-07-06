import DialogContainer from "./DialogContainer";
import Dialog from './Dialog'

const dialog = function (render, options) {
  const id = Math.random().toString(36).substr(2, 9);
  return new Dialog(id, render, options);
};

const closeDialog = function (input) {
  return Dialog.close(input);
}

export { DialogContainer, dialog, closeDialog };
