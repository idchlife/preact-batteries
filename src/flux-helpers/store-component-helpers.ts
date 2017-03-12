import {
  CompatibleComponentInterface
} from "../component-modules/module-system";
import {
  StoreInterface
} from "../component-modules/auth-dependent-component";

interface Properties {
  [property: string]: any;
}

export class PropertyGetterUndefinedError extends Error {
  constructor(property: string) {
    super(
      `[StoreListener]: property ${property} does not have valid
       getter method or public availability in the store`
    );
  }
}

interface PropertyGetterObject {
  property: string;
  customGetterName?: string;
  onAfterGetCallback?: Function;
}

export class StoreListener {
  private store: StoreInterface;
  private component: CompatibleComponentInterface<any, any>;
  private propertiesGetters: Array<PropertyGetterObject> = [];

  constructor(c: CompatibleComponentInterface<any, any>, s: StoreInterface) {
    this.store = s;
    this.component = c;
  }

  public add(
    property: string,
    customGetterName: string = undefined,
    onAfterGetCallback: Function = undefined
  ): StoreListener {
    this.getPropertyFromStore(property, customGetterName, true);

    this.propertiesGetters.push({
      property,
      customGetterName,
      onAfterGetCallback
    });

    return this;
  }

  public listen() {
    const c = this.component;

    const oldComponentWillMount = c.componentWillMount;

    const store = this.store;
    const propertiesGetters = this.propertiesGetters;

    const getPropertyFromStore = this.getPropertyFromStore.bind(this);

    const changeListener = function changeListener() {
      const newState = {};

      propertiesGetters.forEach(p => {
        newState[p.property] = getPropertyFromStore(p.property, p.customGetterName);
      });

      this.setState(newState);
    }.bind(c);

    c.componentWillMount = function() {
      store.addChangeListener(changeListener);

      oldComponentWillMount.call(this);
    }.bind(c);

    const oldComponentWillUnmount = c.componentWillUnmount;
      store.removeChangeListener(changeListener);
    c.componentWillUnmount = function() {
      store.removeChangeListener(changeListener);

      oldComponentWillUnmount.call(this);
    }.bind(c);
  }

  private getPropertyFromStore(
    property: string,
    customGetter: string = undefined,
    onlyCheckAvailability: boolean = false
  ) {
    if (customGetter) {
      if (typeof this.store[customGetter] === "undefined") {
        throw new PropertyGetterUndefinedError(property);
      }

      if (!onlyCheckAvailability) {
        return this.store[customGetter];
      }
    }

    const getterMethod = "get" + property.charAt(0).toUpperCase() + property.slice(1);

    const stateProperty: boolean
      = (this.store.getState 
        && typeof this.store.getState === "function"
        && typeof this.store.getState() === "object"
        && this.store.getState().hasOwnProperty(property)) ? true : false;

    if (
      typeof this.store[property] === "undefined"
      &&
      typeof this.store[getterMethod] === "undefined"
      &&
      !stateProperty
    ) {
      throw new PropertyGetterUndefinedError(property);
    }
    if (!onlyCheckAvailability) {
      if (stateProperty) {
        const state = this.store.getState();

        return state[property];
      }
      return this.store[property] ? this.store[property] : this.store[getterMethod];
    }
  }
}