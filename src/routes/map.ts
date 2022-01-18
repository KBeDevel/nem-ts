import { Router } from 'express';
import { REDIRECTION_RESPONSE_CODES } from '../libs/http-response-codes/redirection';

const RoutesMap: Router = Router({
  strict: true
});

// #region Regular endpoints
// #endregion

// #region Views
RoutesMap.get('/', (_request, response) => {
  response.render('root');
});
// #endregion

// #region Redirects
RoutesMap.get('/source', (_request, response) => {
  response.redirect(REDIRECTION_RESPONSE_CODES.PERMANENT_REDIRECT, 'https://github.com/KBeDevel/nem-ts');
});
// #endregion

export default RoutesMap;
