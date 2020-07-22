import chalk from 'chalk';

export const BANTAM = chalk.bold.yellow('BANTAM: ');
export const infoMsg = chalk.bold.blue;
export const successMsg = chalk.bold.green;
export const errorMsg = chalk.bold.red;

class Logger {
  readonly writeStream: NodeJS.WriteStream;

  constructor(writeStream?: NodeJS.WriteStream) {
    this.writeStream =
      typeof writeStream === 'undefined' ? process.stdout : writeStream;
  }

  /** Write message to stdout */
  private write(message: string): void {
    this.writeStream.write(`${BANTAM}${message}\n`);
  }

  /** Print info message */
  info(message: string): void {
    this.write(infoMsg(message));
  }

  /** Print success message */
  success(message: string): void {
    this.write(successMsg(message));
  }

  /** Print error message */
  error(message: string): void {
    this.write(errorMsg(message));
  }
}

export default Logger;
