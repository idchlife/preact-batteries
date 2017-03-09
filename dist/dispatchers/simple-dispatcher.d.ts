declare class Dispatcher {
    callbacks: any[];
    register(callback: (payload: any) => void): void;
    dispatch(payload: any): void;
}
export default Dispatcher;
