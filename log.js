const EventEmitter = require('events');
const fs = require('fs');

class Log extends EventEmitter {
  constructor() {
    super();
    this.filename = "require-msg.log";
  }

  toAlignment (value) {
    value = value.toString();
    if (value.length < 2) {
      value = '0' + value;
    }
    return value
  }

  getFormatTime (date) {
    const month = this.toAlignment(date.getMonth() + 1);
    const day = this.toAlignment(date.getDate());
    const hours = this.toAlignment(date.getHours());
    const minutes = this.toAlignment(date.getMinutes());
    return `[${month}-${day} ${hours}:${minutes}] `
  }

  async log (msg) {
    const currentTime = this.getFormatTime(new Date());
    const logMsg = `${currentTime} ${msg}\n`;
    const fd = await fs.openSync(this.filename, 'a');
    fs.writeSync(fd, logMsg);
    fs.closeSync(fd);
  }

}

module.exports = Log;