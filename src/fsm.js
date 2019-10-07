class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */

    constructor(config) {
      this.config = config;
      if(this.config === undefined){
          throw new Error("Config isn't passed");
      }
      this.history = [this.config.initial];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        if(this.state === undefined) {
            this.state = this.config.initial;
        }

        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(this.config.states[state] === undefined){
            throw new Error("State isn't exist");
        } else {
            //this.prevState = this.state||this.config.initial;
            this.state = state;
            this.history.push(this.state);
            this.i = this.history.length - 1;
            return this.state;
        }

    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let curState = this.state||this.config.initial; //в зависимости от того менялось ли initial state
        console.log('curstate', curState);
        let newState = this.config.states[curState].transitions[event];
        console.log(newState);
        if(!newState) { //если вернулось undefined
            throw new Error("Event in current state isn\'t exist");
        } else {
            console.log(this.history);
            this.history.push(newState);
            console.log(this.history);
            this.state = newState;
            this.i = this.history.length - 1;
            console.log('i', this.i);
        }
        //this.prevState = curState;
        //this.history.push(this.prevState);

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
        if(event === undefined) {
            return Object.keys(states);
        } else {
           for(let key in states) {
               if(states[key].transitions[event]) {
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
        if(this.history.length === 1) {
            return false;
        }
        if(this.history[this.history.length-2] === this.state) {
            return false;
        }
        else {
            this.i = this.history.length-1; // индекс последнего элемента в хистори;
            //this.state = this.prevState; // state стал предпоследним, т.е. индекс -1;
            this.i--;
            this.state = this.history[this.i];
            return true;
        }

    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this.history.length === 1) {
            return false;
        }

        if((this.i+1) >= this.history.length) { //чтобы не ушло дальше, чем вся хистори
            return false;
        }
        this.i++;
        this.state = this.history[this.i];
            //this.prevState = this.history[this.i-1];
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
