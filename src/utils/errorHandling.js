import logger from '../../logger/logger';
import {C} from './constants';

export const badRequest = (error, res, errorMessage) => {
  logger.error(error);
  res.status(400).json({[C.ERROR]: errorMessage ?? 'Bad Request'});
};
