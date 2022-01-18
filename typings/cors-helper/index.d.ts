/// <reference types="@types/cors" />
/// <reference types="@types/express" />

declare module 'cors-helper' {
  import type { CorsOptions, CorsOptionsDelegate } from 'cors';
  import type { Request, Response, NextFunction } from 'express';
  export function allowCrossDomainMiddleware (_: Request, res: Response, next: NextFunction): void;
  export function createAllowedListMiddleware (list: string | string[]): CorsOptions | CorsOptionsDelegate;
  export function createBlockedListMiddleware (list: string | string[]): CorsOptions | CorsOptionsDelegate;
}
