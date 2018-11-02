import { console } from './globals';

export class Logger {
  constructor() {
    this.history = [];
  }

  info(...args) {
    this.history.push([...args]);
    console.log(...args);
  }

  error(...args) {
    this.history.push([...args]);
    console.error(...args);
  }

  dump() {
    console.log(this.history);
  }
}

const logger = new Logger();
export default logger;
