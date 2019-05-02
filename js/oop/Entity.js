import UTILS from './utils.js';

class Entity {
    constructor() {
        this.id = UTILS.getUUID();
    }
}

export default Entity;