import {
  CompatibleComponentInterface,
  ComponentModule,
} from "./module-system";

export interface StoreInterface {
  addChangeListener(listener: Function);
  removeChangeListener(listener: Function);
  getState?(): any;
}

export interface AuthenticationStoreInterface extends StoreInterface {
  checkingAuthenticationStatus(): boolean;
  isAuthenticated(): boolean;
}

export interface AuthModuleContructorObject {
  // Store, where will be checked authentication status
  store: AuthenticationStoreInterface;
  // Does this component need authentication to work
  needsAuth: boolean;
  // Component that will be returned in render if auth check is in progress.
  authCheckInProcessRenderReturn: any;
  // This does what is says. If this component needs to be with
  // authentication - callback will be called, when user is anonymous.
  // And reversed.
  authStatusNotAllowedCallback: Function;
  // Often this should be similar to 
  authStatusNotAllowedRenderReturn: any;
  // Useful for preloading data
  authStatusSuccessCallback?: Function;
}

const AUTH_STATUS_AUTHENTICATED = true;
const AUTH_STATUS_ANONYMOUS = false;
const AUTH_STATUC_CHECK_IN_PROGRESS = undefined;

const AUTH_STATE_PARAM = "m_Auth_Bool__";
const AUTH_CHECK_STATE_PARAM = "m_Auth_Check_Bool__";
const AUTH_STATUS_SUCCESS_CALLBACK_CALLED = "m_Auth_Status_Success_callback_called__"

export class AuthDependentComponentModule implements AuthModuleContructorObject, ComponentModule<CompatibleComponentInterface<any, any>> {
  store: AuthenticationStoreInterface;
  needsAuth: boolean;
  authCheckInProcessRenderReturn;
  authStatusNotAllowedCallback;
  authStatusNotAllowedRenderReturn;
  authStatusSuccessCallback;

  /**
   * isUserAuthenticated - promise that returns, whether user is authenticated;
   * async because we don't know and don't want to stop main UI thread when
   * checking for authentication
   * 
   * needsAuth - needs this component authentication, or not
   */
  constructor(params: AuthModuleContructorObject) {
    this.store = params.store;
    this.needsAuth = params.needsAuth;
    this.authCheckInProcessRenderReturn = params.authCheckInProcessRenderReturn;
    this.authStatusNotAllowedCallback = params.authStatusNotAllowedCallback;
    this.authStatusNotAllowedRenderReturn = params.authStatusNotAllowedRenderReturn;
    this.authStatusSuccessCallback = params.authStatusSuccessCallback;
  }
  
  init(c: CompatibleComponentInterface<any, any>) {
    const oldRender: Function = c.render;

    // Working with prototype directly, because we don't want to reactivate render for this
    c[AUTH_STATUS_SUCCESS_CALLBACK_CALLED] = false;

    const {
      authCheckInProcessRenderReturn,
      authStatusNotAllowedCallback,
      authStatusSuccessCallback,
      authStatusNotAllowedRenderReturn,
      needsAuth,
      store
    } = this;

    // Default value to be authenticated or not
    c.state = Object.assign({}, c.state, {
      [AUTH_STATE_PARAM]: store.checkingAuthenticationStatus()
        ? AUTH_STATUC_CHECK_IN_PROGRESS
        : store.isAuthenticated()
    });

    c.render = function(...args) {
      const authStatus = this.state[AUTH_STATE_PARAM];

      if (authStatus === AUTH_STATUC_CHECK_IN_PROGRESS) {
        return authCheckInProcessRenderReturn;
      }

      if (
        (needsAuth && authStatus === AUTH_STATUS_AUTHENTICATED)
        ||
        (!needsAuth && authStatus === AUTH_STATUS_ANONYMOUS)
      ) {
        if (!c[AUTH_STATUS_SUCCESS_CALLBACK_CALLED]) {
          c[AUTH_STATUS_SUCCESS_CALLBACK_CALLED] = true;
          
          const a = authStatusSuccessCallback;

          a && a();
        }

        return oldRender.call(this, ...args);
      } else {
        if (typeof authStatusNotAllowedCallback !== "function") {
          throw "AuthStatusNotAllowedShouldBeFunction";
        }
        authStatusNotAllowedCallback();

        return authStatusNotAllowedRenderReturn;
      }
    }.bind(c);

    const authStatusChangeListener = function() {
      this.setState({
        [AUTH_STATE_PARAM]: store.checkingAuthenticationStatus()
          ? AUTH_STATUC_CHECK_IN_PROGRESS
          : store.isAuthenticated()
      });
    }.bind(c);

    const oldComponentWillMount: Function = c.componentWillMount;

    c.componentWillMount = function(...args) {
      store.addChangeListener(authStatusChangeListener)

      oldComponentWillMount && oldComponentWillMount.call(this);
    }.bind(c);

    const oldComponentWillUnmount: Function = c.componentWillUnmount;

    c.componentWillUnmount = function() {
      store.removeChangeListener(authStatusChangeListener);

      oldComponentWillUnmount && oldComponentWillUnmount.call(this);
    }
  }
}