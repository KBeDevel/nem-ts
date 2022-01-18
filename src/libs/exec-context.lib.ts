export class ExecutionContext {
  public static isDevMode (): boolean {
    return process.env.NODE_ENV === 'development';
  }

  public static isProductionMode (): boolean {
    return process.env.NODE_ENV === 'production';
  }

  public static isSSLMode (): boolean {
    return process.env.MODE === 'ssl';
  }
}
