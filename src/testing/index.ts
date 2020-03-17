export * from './activated-route-stub';
export * from './async-observable-helpers';

export function newEvent(eventName: string, bubbles = false, cancelable = false) {
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(eventName, bubbles, cancelable, null);
    return evt;
}
