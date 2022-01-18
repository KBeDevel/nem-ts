// #region API client
export type DefaultRequestHeaders = {
  [key: string]: string;
};

export type ResponseBody<T = unknown> = {
  error?: {
    value: boolean;
    message: string;
    timestamp?: number;
  };
  value?: T;
};
// #endregion

// #region DB utils
export type MongooseConfigProtocol = 'mongodb' | 'http' | 'https';

export type MongooseConfig = {
  databaseName: string;
  protocol: MongooseConfigProtocol;
  domain: string;
  port?: string | number;
};
// #endregion
