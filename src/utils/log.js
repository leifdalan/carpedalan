import { logLevel } from '../../server/config';

import { console } from './globals';

const logState = ['none', 'info', 'error', 'silly'].findIndex(
  i => i === logLevel,
);
export class Logger {
  constructor() {
    this.history = [];
  }

  info(...args) {
    this.history.push([...args]);
    if (logState > 0) {
      console.log(...args);
    }
  }

  error(...args) {
    this.history.push([...args]);
    if (logState > 1) {
      console.error(...args);
    }
  }

  dump() {
    console.log(this.history);
  }
}

const logger = new Logger();
export default logger;
