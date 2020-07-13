export type BantamSupportedLanguage = 'typescript' | 'javascript';

export interface BantamCliOptions {
  actionsFolder: string;
  language: BantamSupportedLanguage;
}
