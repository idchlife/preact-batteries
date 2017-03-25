import { CompatibleComponentInterface, ComponentModule } from "./module-system";
/**
 * This function allows you to easily wrap your method with
 * try catch which will trigger your onError listener, which will
 * be called then within a context of class. Useful when you want intercept
 * errors among several (or all) methods of your class
 */
export declare function listenComponentMethodForErrors(context: any, methodName: string, onError?: (e: Error) => void): void;
export declare class TroubleFreeComponent implements ComponentModule<CompatibleComponentInterface<any, any>> {
    init(c: CompatibleComponentInterface<any, any>): void;
}
