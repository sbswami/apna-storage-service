import {C} from '../utils/constants';
import {badRequest} from '../utils/errorHandling';

export const verifyKey = async (req, res, next) => {
  try {
    // Get the app key from header
    const appKey = req.get(C.APP_KEY);

    // If app key exists
    if (appKey) {
      // Check with app key with env
      if (appKey === process.env.APP_KEY) {
        return next();
      }

      // Wrong API key
      res.status(403).json({message: 'Please send correct appKey'});
      return;
    }

    // API key doesn't exists
    res.status(403).json({message: 'Please send appKey with header'});
  } catch (error) {
    badRequest(error, res);
  }
};
