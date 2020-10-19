# react-dials

Simple dialogs manager based on rxjs

--

## Usage

### Add dialogs container to your app

```jsx
import { DialogContainer } from "react-dials";

// render anywhere in your app
<DialogContainer default />
```

### Add dialogs container to your app

```jsx
import { DialogContainer } from "react-dials";

// render anywhere in your app
<DialogContainer default />
```

### Create a dialog

Then, you can create dialogs from anywhere in your app !

```jsx
import { dialog } from "react-dials";

const myDialog = dialog(<div className="modal" onClick={myDialog.close}>Hello world !</div>);
```

## Advanced configuration

### Multiple containers

```jsx

// render anywhere in your app
<DialogContainer default />
<DialogContainer id="anotherContainer" />

const myDialog = dialog(<div className="modal" onClick={myDialog.close}>Hello world !</div>); // will render in the default container
const mySecondDialog = dialog(<div className="modal" onClick={mySecondDialog.close}>Hello world !</div>, { container: "anotherContainer" }); // will render in the second container
```

## License

MIT © [pierrecabriere](https://github.com/pierrecabriere)
