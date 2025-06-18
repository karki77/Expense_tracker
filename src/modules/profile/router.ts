import { Router } from 'express';
import bodyValidator from '#utils/validators/bodyValidator';
import paramValidator from '#utils/validators/paramValidator';
import ProfileController from './controller';
import { getProfileSchema, updateProfileSchema } from './validation';
import { authMiddleware } from '../../middleware/authMiddleware';

const profileRouter = Router();

profileRouter.get(
  '/getuser-profile/:profileId',
  authMiddleware,
  paramValidator(getProfileSchema),
  ProfileController.getUserProfile.bind(ProfileController),
);

export default profileRouter;
