import React from "react";
import "./index.scss";
import Dialog from '../Dialog'

class DialogItem extends React.Component {
  render() {
    return <div className="dialog-item" id={this.props.dialog.id}>
      {typeof this.props.dialog.render === "function" ? this.props.dialog.render() : this.props.dialog.render}
    </div>
  }
}

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
          return { ...prevState, stack: [...prevState.stack, dialog] };
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
        return { ...prevState, stack: prevState.stack.filter(d => d !== dialog) }
      }
      return prevState;
    });
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

  handleEscapeKeydown = (event) => {
    // enter
    if (parseInt(event.keyCode, 10) === 13) {
      event.stopPropagation();
    // escape
    } else if (parseInt(event.keyCode, 10) === 27) {
      event.preventDefault();
      event.stopPropagation();
      this.state.stack[0].close();
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.stack.length === 1 && !prevState.stack.length) {
      window.addEventListener("keydown", this.handleEscapeKeydown, false);
    } else if (!this.state.stack.length && prevState.stack.length) {
      window.removeEventListener("keydown", this.handleEscapeKeydown, false);
    }
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
        />
        {this.state.stack.map((dialog) => (
          <DialogItem key={dialog.id} dialog={dialog} ref={node => dialog.ref = node} />
        ))}
      </div>
    );
  }
}

export default DialogContainer;
