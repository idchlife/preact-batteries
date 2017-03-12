import { CompatibleComponentInterface } from "../component-modules/module-system";
import { StoreInterface } from "../component-modules/auth-dependent-component";
export declare class PropertyGetterUndefinedError extends Error {
    constructor(property: string);
}
export declare class StoreListener {
    private store;
    private component;
    private propertiesGetters;
    constructor(c: CompatibleComponentInterface<any, any>, s: StoreInterface);
    add(property: string, customGetterName?: string, onAfterGetCallback?: Function): StoreListener;
    listen(): void;
    private getPropertyFromStore(property, customGetter?, onlyCheckAvailability?);
}
