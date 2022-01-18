import { Router, static as staticContent } from 'express';
import path from 'path';
import RoutesMap from './routes/map';

const { PATH_BASE = '/' } = process.env;

const router: Router = Router({
  strict: true
});

// #region Application route modules list
router.use('/static', staticContent(path.join(__dirname, '..', 'public'))); // Assets provider
router.use(RoutesMap);
// #endregion

export {
  router as APIRouter,
  PATH_BASE
};
