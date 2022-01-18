// Use this file to add typed environment variables
// This file MUST be included in the tsconfig.json file

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production' | 'test';
      PORT?: string;
    }
  }
}

export { }; // Force modular behavior
