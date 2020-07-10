interface UserOptions {
  port?: number;
  devPort?: number;
  actionsFolder?: string;
  actionsIndexFile?: string;
  actionsFileExt?: string;
}

interface Config {
  port: number;
  devPort: number;
  actionsFolder: string;
  actionsIndexFile: string;
  actionsFileExt: string;
}

class Bantam {
  readonly defaultConfig: Config = {
    port: 3000,
    devPort: 3000,
    actionsFolder: 'actions',
    actionsIndexFile: 'index',
    actionsFileExt: '.ts',
  };

  private config: Config;

  constructor(userOptions?: UserOptions) {
    const config = Object.assign(this.defaultConfig, userOptions);
    this.setConfig(config);
  }

  getConfig(): Config {
    return this.config;
  }

  setConfig(config: Config): void {
    this.config = config;
  }
}

export default Bantam;
