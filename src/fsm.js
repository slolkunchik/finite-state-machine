class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */

    constructor(config) {
        this.config = config;
        if (this.config === undefined) {
            throw new Error("Config isn't passed");
        }
        this.history = [this.config.initial];
        this.undoList = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        if (this.state === undefined) {
            this.state = this.config.initial;
        }

        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this.config.states[state] === undefined) {
            throw new Error("State isn't exist");
        } else {
            this.state = state;
            this.history.push(this.state);

            return this.state;
        }

    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let curState = this.state || this.config.initial; //depending on the initial state (changed or not)
        let newState = this.config.states[curState].transitions[event];

        if (!newState) { //if undefined
            throw new Error("Event in current state isn\'t exist");
        } else {
            this.undoList = []; //for redo
            this.changeState(newState)
        }

        return this;
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.config.initial;
        return this;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let statesArray = [];
        let states = this.config.states;
        if (event === undefined) {
            return Object.keys(states);
        } else {
            for (let key in states) {
                if (states[key].transitions[event]) {
                    statesArray.push(key);
                }
            }
        }
        return statesArray;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.history.slice(-1)[0] === this.config.initial) {
            return false
        }

        this.undoList.push(this.history.pop()); //delete and push last history element
        this.changeState(this.history.slice(-1)[0]);
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.undoList.length === 0) {
            return false;
        }
        this.changeState(this.undoList.pop());
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history.length = 1;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
