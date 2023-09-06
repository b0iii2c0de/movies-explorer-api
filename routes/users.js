const userRouter = require('express').Router();

const { getUserInfo, editUserInfo } = require('../controllers/users');
const {
  getUserInfoValidator,
  editUserInfoValidator,
} = require('../middlewares/validation');

userRouter.get('/users/me', getUserInfoValidator, getUserInfo);

userRouter.patch('/users/me', editUserInfoValidator, editUserInfo);

module.exports = userRouter;
