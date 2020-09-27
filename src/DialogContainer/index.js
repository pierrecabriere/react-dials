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
    if (dialog) {
      return { ...this.props, ...dialog.options };
    } else {
      return this.props;
    }
  }

  async add(dialog) {
    const options = this.getOptions(dialog);
    if (dialog.options.open) {
      const res = await dialog.options.open.apply(dialog);
      if (res === false) {
        return;
      }
    }

    await new Promise((resolve) => {
      this.setState((prevState) => {
        const _dialog = prevState.stack.find((d) => d.id === dialog.id);
        if (!_dialog) {
          return { ...prevState, stack: [...prevState.stack, dialog] };
        }
        return prevState;
      }, () => setTimeout(resolve));
    });

    const element = document.getElementById(dialog.id);

    if (!element) {
      return;
    }

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

  async remove(_dialog) {
    const dialog = this.state.stack.find((d) => d.id === _dialog.id);
    if (!dialog) {
      return;
    }

    if (dialog.options.close) {
      const res = await dialog.options.close.apply(dialog);
      if (res === false) {
        return;
      }
    }

    const options = this.getOptions(dialog);
    const element = document.getElementById(dialog.id);

    if (element) {
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
    }

    this.setState((prevState) => {
      if (dialog) {
        return { ...prevState, stack: prevState.stack.filter(d => d !== dialog) }
      }
      return prevState;
    });
  }

  componentDidMount() {
    this.subscription = Dialog.subject.subscribe({
      next: ({ action, payload }) => {
        const { id, default: _default } = this.props;
        if ((!payload.options?.container && !_default) || (payload.options?.container && payload.options?.container !== id)) {
          return;
        }

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
      this.state.stack[this.state.stack.length-1].close();
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
      <div id={this.props.id} className={`dialog-container ${open ? "open" : ""}`}>
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

DialogContainer.defaultProps = {
  id: null,
  default: false,
  transitionTime: null
};

export default DialogContainer;
