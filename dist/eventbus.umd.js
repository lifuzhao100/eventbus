(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.EventBus = factory());
}(this, (function () { 'use strict';

  function isFunction(ele) {
    return ele instanceof Function
  }

  function isPromise(ele) {
    return ele && isFunction(ele.then) && isFunction(ele.catch)
  }

  const weakMap = new WeakMap();

  class EventBus {
    constructor(getErrorHandler) {
      weakMap.set(this, {
        _events: Object.create(null),
      });
      this.getErrorHandler = getErrorHandler;
    }

    get handleError() {
      let handler;
      if (this.getErrorHandler instanceof Function) {
        handler = this.getErrorHandler();
      }
      if (handler instanceof Function) return handler
      return function (e) {
        console.trace(e);
      }
    }

    $on(event, fn) {
      if (Array.isArray(event)) {
        event.forEach(e => {
          this.$on(e, fn);
        });
      } else {
        const {_events} = weakMap.get(this);
        (_events[event] || (_events[event])).push(fn);
      }
      return this
    }

    get on() {
      return this.$on.apply(this, arguments)
    }

    $off(event, fn) {
      const data = weakMap.get(this);

      if (arguments.length === 0) {
        data._events = Object.create(null);
        return this
      }

      const _events = data._events;

      if (Array.isArray(event)) {
        event.forEach(e => {
          this.$off(e, fn);
        });
        return this
      }

      const cbs = _events[event];

      if (!fn || !cbs) {
        _events[event] = null;
        return this
      }

      for (let i = 0; i < cbs.length; i++) {
        if (cbs[i] === fn) {
          cbs.splice(i, 1);
          break
        }
      }

      return this
    }

    get off() {
      return this.$off.apply(this, arguments)
    }

    $once(event, fn) {
      const args = arguments;
      const on = () => {
        this.$off(event, on);
        fn.apply(this, args);
      };
      this.$on(event, on);
      return this
    }

    get once() {
      return this.$once.apply(this, arguments)
    }

    $emit(event) {
      const {_events} = weakMap.get(this);
      const cbs = _events[event];
      if (cbs) {
        const args = Array.from(arguments).slice(1);
        cbs.forEach(cb => {
          try {
            const res = cb.apply(this, args);
            if (isPromise(res)) {
              res.catch(e => this.handleError(e));
            }
          } catch (e) {
            this.handleError(e);
          }
        });
      }
      return this
    }

    get emit() {
      return this.$emit.apply(this, arguments)
    }
  }

  return EventBus;

})));
