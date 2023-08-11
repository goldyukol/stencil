import {Terminal} from "xterm";

export class Logger {
  openStreams: Set<WritableStream>;
  terminal: Terminal;

  constructor(terminal: Terminal) {
    this.terminal = terminal;
    this.openStreams = new Set();
  }

  createWritableStream() {
    const that = this;
    const stream = new WritableStream({
      write(data) {
        that.terminal.write(data);
      },
      close() {
        that.openStreams.delete(this);
      },
    });

    this.openStreams.add(stream);
    return stream;
  }

  closeAllOpenStreams() {
    for (let stream of this.openStreams) {
      stream.close();
    }
  }
}
