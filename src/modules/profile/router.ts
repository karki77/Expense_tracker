import { Router } from 'express';
import bodyValidator from '#utils/validators/bodyValidator';
import paramValidator from '#utils/validators/paramValidator';
import ProfileController from './controller';
import {
  getProfileSchema,
  updateProfileSchema,
  deleteProfileSchema,
  checkUsernameAvailabilitySchema,
} from './validation';
import authMiddleware from '../../middleware/authMiddleware';
import upload from '../../utils/multer';

const profileRouter = Router();

profileRouter.get(
  '/financial-summary/:userId',
  authMiddleware.authMiddlewareWithRedis,
  paramValidator(getProfileSchema),
  ProfileController.getFinancialSummary.bind(ProfileController),
);

profileRouter.get(
  '/getuser-profile/:userId',
  authMiddleware.authMiddlewareWithRedis,
  paramValidator(getProfileSchema),
  ProfileController.getUserProfile.bind(ProfileController),
);

profileRouter.post(
  '/upload-profile-image',
  authMiddleware.authMiddlewareWithRedis,
  upload.single('file'),
  ProfileController.uploadProfileImage.bind(ProfileController),
);

profileRouter.post(
  '/check-username-availability',
  authMiddleware.authMiddlewareWithRedis,
  bodyValidator(checkUsernameAvailabilitySchema),
  ProfileController.checkUsernameAvailability.bind(ProfileController),
);

profileRouter.patch(
  '/update-profile/:userId',
  authMiddleware.authMiddlewareWithRedis,
  upload.single('file'),
  paramValidator(getProfileSchema),
  bodyValidator(updateProfileSchema),
  ProfileController.updateProfile.bind(ProfileController),
);

export default profileRouter;
