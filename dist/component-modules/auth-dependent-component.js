"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AUTH_STATUS_AUTHENTICATED = true;
var AUTH_STATUS_ANONYMOUS = false;
var AUTH_STATUC_CHECK_IN_PROGRESS = undefined;
var AUTH_STATE_PARAM = "m_Auth_Bool__";
var AUTH_CHECK_STATE_PARAM = "m_Auth_Check_Bool__";
var AUTH_STATUS_SUCCESS_CALLBACK_CALLED = "m_Auth_Status_Success_callback_called__";
var AuthDependentComponentModule = (function () {
    /**
     * isUserAuthenticated - promise that returns, whether user is authenticated;
     * async because we don't know and don't want to stop main UI thread when
     * checking for authentication
     *
     * needsAuth - needs this component authentication, or not
     */
    function AuthDependentComponentModule(params) {
        this.store = params.store;
        this.needsAuth = params.needsAuth;
        this.authCheckInProcessRenderReturn = params.authCheckInProcessRenderReturn;
        this.authStatusNotAllowedCallback = params.authStatusNotAllowedCallback;
        this.authStatusNotAllowedRenderReturn = params.authStatusNotAllowedRenderReturn;
        this.authStatusSuccessCallback = params.authStatusSuccessCallback;
    }
    AuthDependentComponentModule.prototype.init = function (c) {
        var oldRender = c.render;
        // Working with prototype directly, because we don't want to reactivate render for this
        c[AUTH_STATUS_SUCCESS_CALLBACK_CALLED] = false;
        var _a = this, authCheckInProcessRenderReturn = _a.authCheckInProcessRenderReturn, authStatusNotAllowedCallback = _a.authStatusNotAllowedCallback, authStatusSuccessCallback = _a.authStatusSuccessCallback, authStatusNotAllowedRenderReturn = _a.authStatusNotAllowedRenderReturn, needsAuth = _a.needsAuth, store = _a.store;
        // Default value to be authenticated or not
        c.state = Object.assign({}, c.state, (_b = {},
            _b[AUTH_STATE_PARAM] = store.checkingAuthenticationStatus()
                ? AUTH_STATUC_CHECK_IN_PROGRESS
                : store.isAuthenticated(),
            _b));
        c.render = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var authStatus = this.state[AUTH_STATE_PARAM];
            if (authStatus === AUTH_STATUC_CHECK_IN_PROGRESS) {
                return authCheckInProcessRenderReturn;
            }
            if ((needsAuth && authStatus === AUTH_STATUS_AUTHENTICATED)
                ||
                    (!needsAuth && authStatus === AUTH_STATUS_ANONYMOUS)) {
                if (!c[AUTH_STATUS_SUCCESS_CALLBACK_CALLED]) {
                    c[AUTH_STATUS_SUCCESS_CALLBACK_CALLED] = true;
                    var a = authStatusSuccessCallback;
                    a && a();
                }
                return oldRender.call.apply(oldRender, [this].concat(args));
            }
            else {
                if (typeof authStatusNotAllowedCallback !== "function") {
                    throw "AuthStatusNotAllowedShouldBeFunction";
                }
                authStatusNotAllowedCallback();
                return authStatusNotAllowedRenderReturn;
            }
        }.bind(c);
        var authStatusChangeListener = function () {
            this.setState((_a = {},
                _a[AUTH_STATE_PARAM] = store.checkingAuthenticationStatus()
                    ? AUTH_STATUC_CHECK_IN_PROGRESS
                    : store.isAuthenticated(),
                _a));
            var _a;
        }.bind(c);
        var oldComponentWillMount = c.componentWillMount;
        c.componentWillMount = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            store.addChangeListener(authStatusChangeListener);
            oldComponentWillMount && oldComponentWillMount.call(this);
        }.bind(c);
        var oldComponentWillUnmount = c.componentWillUnmount;
        c.componentWillUnmount = function () {
            store.removeChangeListener(authStatusChangeListener);
            oldComponentWillUnmount && oldComponentWillUnmount.call(this);
        };
        var _b;
    };
    return AuthDependentComponentModule;
}());
exports.AuthDependentComponentModule = AuthDependentComponentModule;
