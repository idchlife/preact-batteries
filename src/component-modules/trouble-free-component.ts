import {
  CompatibleComponentInterface,
  ComponentModule
} from "./module-system";

class RenderMethodNotDefinedError extends Error {
  constructor() {
    super(
      "[preact-batteries.trouble-free-component]: render method in your component is not defined"
    );
  }
}

/**
 * This function allows you to easily wrap your method with
 * try catch which will trigger your onError listener, which will
 * be called then within a context of class. Useful when you want intercept
 * errors among several (or all) methods of your class
 */
export function listenComponentMethodForErrors(
  context,
  methodName: string,
  onError?: (e: Error) => void
) {
  const old: Function | undefined = context[methodName];

  if (methodName === "render" && !old) {
    throw new RenderMethodNotDefinedError();
  }

  context[methodName] = function(...args) {
    try {
      if (methodName === "render") {
        return old.call(context, ...args);
      }
      
      old && old.call(context, ...args);
    } catch (e) {
      if (onError) {
        onError.call(context, e);
      }
    }
  }.bind(context);
}

const ERROR_MESSAGE = "[CRITICAL ERROR]";

function renderFunction() {
  return ERROR_MESSAGE;
}

function onErrorFunc(e: Error | string) {
  this.render = renderFunction;

  console.error(
    `[preact-batteries.troube-free-component]: you had error in one of your methods in component.
    You can distinguish one with error by looking at your interface. It should show ${ERROR_MESSAGE}. Also, here is
    error message. Logging error after this message.`
  );

  if (e instanceof Error) {
    console.error(e.stack);
  } else {
    console.error(e);
  }
}

function onAppearedErrorFunc(e: Error) {
  if (this.forceUpdate) {
    onErrorFunc.call(this, e);

    this.setState({ error: Math.random() * 1000 });
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
    listenComponentMethodForErrors(c, "componentWillMount", onErrorFunc);
    listenComponentMethodForErrors(c, "componentDidMount", onAppearedErrorFunc);
    listenComponentMethodForErrors(c, "componentWillReceiveProps", onErrorFunc);
    listenComponentMethodForErrors(c, "shouldComponentUpdate", onErrorFunc);
    listenComponentMethodForErrors(c, "render", onAppearedErrorFunc);
  }
}