
export const pipe = (...fns) => (initialValue) => {
    return fns.reduce((value, fn) => fn(value), initialValue);
};

let uuid = 1;
export const getUUID = () => `uuid-${++uuid}`;

export function getDataState(stateKey, state) {
    return state[stateKey];
}

export function preventDefaultEvent(e) {
    e.preventDefault();
    return e;
}

export function filterEventTarget(filterFn, e) {
    if (filterFn(e)) {
        return e;
    } else {
        const PIPE_ERROR = new Error('Filter function stop execution.');
        PIPE_ERROR.code = 'PIPE_ERROR';

        throw PIPE_ERROR;
    }
}

export function eventTargetIdSelector(e) {
    return e.target.id;
}

export function getDataFromEvent(selectorFn, e) {
    return selectorFn(e);
}
