import { Router } from 'express';
import bodyValidator from '#utils/validators/bodyValidator';
import paramValidator from '#utils/validators/paramValidator';
import ProfileController from './controller';
import { getProfileSchema, updateProfileSchema } from './validation';
import { authMiddleware } from '../../middleware/authMiddleware';

import upload from '../../utils/multer';

const profileRouter = Router();

profileRouter.get(
  '/getuser-profile/:profileId',
  authMiddleware,
  paramValidator(getProfileSchema),
  ProfileController.getUserProfile.bind(ProfileController),
);

profileRouter.patch(
  '/update-profile/:profileId',
  authMiddleware,
  paramValidator(getProfileSchema),
  bodyValidator(updateProfileSchema),
  ProfileController.updateProfile.bind(ProfileController),
);

profileRouter.post(
  '/upload-profile-image',
  authMiddleware,
  upload.single('file'),
  ProfileController.uploadProfileImage.bind(ProfileController),
);

export default profileRouter;
