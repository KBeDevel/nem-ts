export enum CLIENT_ERROR_RESPONSE_CODES {
  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400}
   */
  BAD_REQUEST = 400,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401}
   */
  UNAUTHORIZED = 401,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403}
   */
  FORBIDDEN = 403,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404}
   */
  NOT_FOUND = 404,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405}
   */
  METHOD_NOT_ALLOWED = 405,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406}
   */
  NOT_ACCEPTABLE = 406,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407}
   */
  PROXY_AUTHENTICATION_REQUIRED = 407,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408}
   */
  REQUEST_TIMEOUT = 408,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409}
   */
  CONFLICT = 409,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418}
   */
  GONE = 410,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/411}
   */
  LENGTH_REQUIRED = 411,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412}
   */
  PRECONDITION_FAILED = 412,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/413}
   */
  PAYLOAD_TOO_LARGE = 413,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/414}
   */
  URI_TOO_LONG = 414,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415}
   */
  UNSUPPORTED_MEDIA_TYPE = 415,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416}
   */
  RANGE_NOT_SATISFIABLE = 416,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/417}
   */
  EXPECTATION_FAILED = 417,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418}
   */
  'I\'M_A_TEAPOT' = 418,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422}
   */
  UNPROCESSABLE_ENTITY = 422,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/425}
   */
  TOO_EARLY = 425,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/426}
   */
  UPGRADE_REQUIRED = 426,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/428}
   */
  PRECONDITION_REQUIRED = 428,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429}
   */
  TOO_MANY_REQUESTS = 429,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/431}
   */
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/451}
   */
  UNAVAILABLE_FOR_LEGAL_REASONS = 451
}
