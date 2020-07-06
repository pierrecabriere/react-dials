import React from "react";
import "./index.scss";
import Dialog from '../Dialog'

class DialogContainer extends React.Component {
  subscription;
  state = {
    stack: [],
  };

  getOptions(dialog) {
    return { transitionTime: null, ...this.props, ...dialog.options };
  }

  async add(dialog) {
    const options = this.getOptions(dialog);
    await new Promise((resolve) => {
      this.setState((prevState) => {
        const _dialog = prevState.stack.find((d) => d.id === dialog.id);
        if (!_dialog) {
          prevState.stack.push(dialog);
        }
        return prevState;
      }, resolve);
    });

    const element = document.getElementById(dialog.id);

    if (options.transitionTime) {
      element.classList.add("opening");
      setTimeout(() => {
        element.classList.remove("opening");
        element.classList.add("open");
      }, options.transitionTime);
    } else {
      element.classList.add("open");
    }
  }

  async remove(id) {
    const dialog = this.state.stack.find((d) => d.id === id);
    const options = this.getOptions(dialog);
    const element = document.getElementById(dialog.id);

    await new Promise((resolve) => {
      if (options.transitionTime) {
        element.classList.add("closing");
        setTimeout(() => {
          element.classList.remove("closing");
          element.classList.remove("open");
          resolve();
        }, options.transitionTime);
      } else {
        element.classList.remove("open");
        resolve();
      }
    });

    this.setState((prevState) => {
      if (dialog) {
        dialog.options.close && dialog.options.close.apply(dialog);
        prevState.stack.splice(prevState.stack.indexOf(dialog), 1);
      }
      return prevState;
    });
  }

  removeLast() {
    const dialog = this.state.stack[this.state.stack.length - 1];
    if (dialog) {
      this.remove(dialog.id);
    }
  }

  componentDidMount() {
    this.subscription = Dialog.subject.subscribe({
      next: ({ action, payload }) => {
        switch (action) {
          case "add":
            this.add(payload);
            break;
          case "remove":
            this.remove(payload);
            break;
        }
      },
    });
  }

  componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe();
  }

  render() {
    const open = this.state.stack.length;
    return (
      <div className={`dialog-container ${open ? "open" : ""}`}>
        <div
          className="dialog-backdrop"
          data-size={open}
          onClick={(e) => {
            e.stopPropagation();
            this.removeLast();
          }}
        />
        {this.state.stack.map((dialog) => (
          <div key={dialog.id} className="dialog-item" id={dialog.id}>
            {dialog.render}
          </div>
        ))}
      </div>
    );
  }
}

export default DialogContainer;
