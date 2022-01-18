export enum REDIRECTION_RESPONSE_CODES {
  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/300}
   */
  MULTIPLE_CHOICE = 300,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301}
   */
  MOVED_PERMANENTLY = 301,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302}
   */
  FOUND = 302,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303}
   */
  SEE_OTHER = 303,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304}
   */
  NOT_MODIFIED = 304,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307}
   */
  TEMPORARY_REDIRECT = 307,

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/308}
   */
  PERMANENT_REDIRECT = 308
}
