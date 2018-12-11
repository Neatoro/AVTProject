import _ from "lodash";

class Interval {
  constructor(interval, callback) {
    this.interval = interval;
    this.callback = callback;
    this.running = false;
    this.currentTimer = 0;
    this.timer = undefined;
  }

  start() {
    this.timer = setInterval(this._next.bind(this), 1);
  }

  stop() {
    if (!_.isUndefined(this.timer)) {
      clearInterval(this.timer);
    }
  }

  _next() {
    this.currentTimer += 1;
    if (this.currentTimer >= this.interval) {
      this.callback();
      this.currentTimer = 0;
    }
  }
}

export default Interval;
