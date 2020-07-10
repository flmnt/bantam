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

  private write(message: string): void {
    this.writeStream.write(`\n${BANTAM}${message}\n\n`);
  }

  info(message: string): void {
    this.write(infoMsg(message));
  }

  success(message: string): void {
    this.write(successMsg(message));
  }

  error(message: string): void {
    this.write(errorMsg(message));
  }
}

export default Logger;
