import { Buffer } from 'buffer';

export type Base64InputData = WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: 'string'): string; };

export class Hasher {
  public static encode = {
    base64: (
      data: Base64InputData
    ): string => Buffer.from(data).toString('base64')
  };

  public static decode = {
    base64: (
      data: Base64InputData,
      encoding: BufferEncoding = 'base64'
    ): string => Buffer.from(data, encoding).toString('ascii')
  };
}
