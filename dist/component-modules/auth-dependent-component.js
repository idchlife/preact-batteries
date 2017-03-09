"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AUTH_STATUS_AUTHENTICATED = true;
var AUTH_STATUS_ANONYMOUS = false;
var AUTH_STATUC_CHECK_IN_PROGRESS = undefined;
var AUTH_STATE_PARAM = "m_Auth_Bool__";
var AUTH_CHECK_STATE_PARAM = "m_Auth_Check_Bool__";
var AuthDependentComponent = (function () {
    /**
     * isUserAuthenticated - promise that returns, whether user is authenticated;
     * async because we don't know and don't want to stop main UI thread when
     * checking for authentication
     *
     * needsAuth - needs this component authentication, or not
     */
    function AuthDependentComponent(params) {
        this.store = params.store;
        this.needsAuth = params.needsAuth;
        this.authCheckInProcessRenderReturn = params.authCheckInProcessRenderReturn;
        this.authStatusNotAllowedCallback = params.authStatusNotAllowedCallback;
        this.authStatusNotAllowedRenderReturn = params.authStatusNotAllowedRenderReturn;
    }
    AuthDependentComponent.prototype.init = function (c) {
        var oldRender = c.render;
        var _a = this, authCheckInProcessRenderReturn = _a.authCheckInProcessRenderReturn, authStatusNotAllowedCallback = _a.authStatusNotAllowedCallback, authStatusNotAllowedRenderReturn = _a.authStatusNotAllowedRenderReturn, needsAuth = _a.needsAuth, store = _a.store;
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
            if (needsAuth && authStatus === AUTH_STATUS_AUTHENTICATED) {
                return oldRender.call.apply(oldRender, [this].concat(args));
            }
            else if (!needsAuth && authStatus === AUTH_STATUS_ANONYMOUS) {
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
    return AuthDependentComponent;
}());
exports.AuthDependentComponent = AuthDependentComponent;
