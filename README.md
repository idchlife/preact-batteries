# preact-batteries

This repository (npm module, too) filled with variety of different helpers, classes and other functionality.
Made with additional love for Preact support and TypeScript support.

!Not yet tested with react/inferno etc

## Installation

**npm i preact-batteries**

```
  # You can import whatever parts of helpers you desire
  import { StoreListener } from "preact-batteries"
```

## Overview and usage

Every usable part is accessible through main index.js file, you can see TypeScript entry file and see that inner parts are exported from there for easiness of finding them:
https://github.com/idchlife/preact-batteries/blob/master/src/index.ts

### - module system

Provided as it is, module system is useless without modules (duh).
What it does you can see here: https://github.com/idchlife/preact-batteries/blob/master/src/component-modules/module-system.ts#L13

Simply accepting classes as modules with .init method, which accepts your component.

So if you want to add module, just know that this modules system will be used and make your module compatible with it.

##### AuthDependentComponentModule
and example of using module system in your component

This module provides functionality on basically "doing something when Component rendered and your app is now in (not) desired authentication status"

```typescript
import {
  modules,
  AuthDependentComponentModule,
  CompatibleComponentInterface
} from "preact-batteries";

export default class AuthPage
  extends Component<Props, State>
  implements CompatibleComponentInterface<Props, State> {
  
  constructor() {
    super();

    modules<Component<RouteProps, State>>(this, [
      new AuthDependentComponentModule({
        // Store with AuthenticationStoreInterface (can be found in entry file).
        // Methods of this store will be used to check authentication status
        // of your application.
        store: AuthStore,
        // What should be returned when authentication chek is in progress
        // authCheckInProcessRenderReturn: <div>loading...</div>,
        // Example of using router, which should naviagate to
        // different url of your application, if condition for authentication is not met.
        authStatusNotAllowedCallback: () => router.navigate("/"),
        // Same as not auth status is invalid, just not to show user
        // blank page, something should be returned.
        authStatusNotAllowedRenderReturn: <div>loading...</div>,
        // Here you declare, whether your component need authentication or not.
        // Component for authenticated access should have needsAuth: true.
        // In this example - this is /auth page component, which gives user
        // ability to authenticate in system. When auth status in store changes,
        // user will be automatically redirected to "/" as
        // seen here in authStatusNotAllowedCallback.
        needsAuth: false
      })
    ]);
  }
}
```

AuthDependentComponentModule attaches to your component via componentWillMount and componentWillUnmount, hijacking their calls and after it made it's considerations about authentication status - calling your own componentWillMoune/WillUnmount methods.

If authentication status is okay - component will just rendered which you wrote in your render method

### - dispatchers

You can find dispatcher for your needs in this repository. Yes, dispatcher as in Flux.

##### SimpleDispatcher

Synchronous, simple, dumb.

Usage (for dispatcher.ts file which will be used across your stores):

```
import { SimpleDispatcher } from "preact-batteries";

export default new SimpleDispatcher();
```

Code can be viewed here: https://github.com/idchlife/preact-batteries/blob/master/src/dispatchers/simple-dispatcher.ts

If you're familiar with Flux you will know how to use it. Well, source code gives you a hint too! Dispatches something, all listeners gets the payload (something which dispatcher gives to all registered listeners. I mean ALL registered listeners. They listen to EVERY dispatch). Each listener guesses does it want to handle the dispatch or not. in Flux, this is determined by "type" property in dispatched object.

### - store-helpers

You can get different store helpers for you clean Flux application.

##### NodeEventsStore

Store, which you can extend. Uses node events (EventEmitter) to emit your events and add listeners.
Already has addChangeListener and removeChangeListener, also emitChange
For easinees of creating your stores. Just extend it and you're good to go!

##### MittStore

Same as NodeEventsStore, but using mitt (tine event emitter library from **developit**: https://github.com/developit/mitt )

```typescript
import {
  MittStore
} from "preact-batteries";

class MyStore extends MittStore {
  // Now you have store with addChangeListener,
  // removeChangeListener and emitChange
}
```

### - store-component-helpers

If you have store as in Flux, which is EventEmitter and also have components - you might want
to use some helpers which would reduce boilerplate, but would do it transparently and without
any huge magic parts.

##### StoreListener

This class is designed to help you adding listeners for store properties for your component.
Example of usage:

```typescript
import { StoreListener } from "preact-batteries";

interface State {
  authenticated?: boolean | undefined;
  somethingElse?: any;
}

export default class Routing extends Component<undefined, State> {
  constructor() {
    super();

    new StoreListener(this, AuthStore)
      .add('authenticated')
      .add('somethingElse')
      .listen();
  }
}
```

StoreListener will listen to change event from your store and update state of
this component with fresh property/ies value

After change event, StoreListener will try to find out, how to get your property from state.
It will try to access getState() from store and check whether it is object, which can be
accessed for property.
Also it will try to check if there is getter for this property in store, like getSomethingElse().
You can also pass as second argument to .add - customGetterName, which also would be used to
get property.
And at last, StoreListener will try to access property as it was just public property
of your store object.