export enum SERVER_ERROR_RESPONSE_CODES {
  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500}
   */
  INTERNAL_SERVER_ERROR = 500,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501}
   */
  NOT_IMPLEMENTED = 501,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502}
   */
  BAD_GATEWAY = 502,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503}
   */
  SERVICE_UNAVAILABLE = 503,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504}
   */
  GATEWAY_TIMEOUT = 504,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/505}
   */
  HTTP_VERSION_NOT_SUPPORTED = 505,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/506}
   */
  VARIANT_ALSO_NEGOTIATES = 506,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/510}
   */
  NOT_EXTENDED = 510,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/511}
   */
  NETWORK_AUTHENTICATION_REQUIRED = 511
}
