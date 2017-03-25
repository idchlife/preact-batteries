import {
  CompatibleComponentInterface,
  ComponentModule,
  listenMethodForErrors
} from "./module-system";

const ERROR_MESSAGE = "[CRITICAL ERROR]";

function renderFunction() {
  return ERROR_MESSAGE;
}

function onErrorFunc(e: Error) {
  this.render = renderFunction;

  console.error(
    `[preact-batteries.troube-free-component]: you had error in one of your methods in component.
    You can distinguish one with error by looking at your interface. It should show ${ERROR_MESSAGE}. Also, here is
    error message. Logging error after this message.`
  );
  console.error(e);
}

function onAppearedErrorFunc(e: Error) {
  if (this.forceUpdate) {
    onErrorFunc.call(this, e);

    this.forceUpdate();
  } else {
    console.warn(
      `[preact-batteries.trouble-free-component]: component did not have forceUpdate method,
      and error appeared in the render method or didMount method. So error in the component cannot be shown in the interface.
      Throwing error further.`
    );

    throw e;
  }
}

export class TroubleFreeComponent implements ComponentModule<CompatibleComponentInterface<any, any>> {
  public init(c: CompatibleComponentInterface<any, any>) {
    listenMethodForErrors(c, "componentWillMount", onErrorFunc);
    listenMethodForErrors(c, "componentDidMount", onAppearedErrorFunc);
    listenMethodForErrors(c, "componentWillReceiveProps", onErrorFunc);
    listenMethodForErrors(c, "shouldComponentUpdate", onErrorFunc);
    listenMethodForErrors(c, "render", onAppearedErrorFunc);
  }
}