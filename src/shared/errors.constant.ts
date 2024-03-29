import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from './error-code.contant';

export const Errors = {
  USERNAME_IS_EXISTED: {
    message: 'Username is existed in our platform',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: ErrorCodes.USERNAME_IS_EXISTED,
  },
  INVALID_USERNAME: {
    message: 'Username is invalid',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: ErrorCodes.INVALID_USERNAME,
  },
  INVALID_PASSWORD: {
    message: 'Password is invalid',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: ErrorCodes.INVALID_PASSWORD,
  },
  CANNOT_CREATE_ADMIN_ACCOUNT: {
    message: 'Cannot create admin account',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: ErrorCodes.CANNOT_CREATE_ADMIN_ACCOUNT,
  },
  CANNOT_CREATE_SUPERADMIN_ACCOUNT: {
    message: 'Cannot create superadmin account',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: ErrorCodes.CANNOT_CREATE_SUPERADMIN_ACCOUNT,
  },
  INVALID_COUNTRY_CODE: {
    message: 'Invalid country code',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: ErrorCodes.INVALID_COUNTRY_CODE,
  },
  INVALID_UUID: {
    message: 'UUID is invalid',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: ErrorCodes.INVALID_UUID,
  },
  INVALID_CATEGORY_UUID: {
    message: 'Category UUID is invalid',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: ErrorCodes.INVALID_CATEGORY_UUID,
  },
  INVALID_CATEGORY_OWNERSHIP: {
    message: 'User not own category',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: ErrorCodes.INVALID_CATEGORY_OWNERSHIP,
  },
  INVALID_SUB_CATEGORY_UUID: {
    message: 'SubCategory UUID is invalid',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: ErrorCodes.INVALID_SUB_CATEGORY_UUID,
  },
  INVALID_TOPIC_UUID: {
    message: 'Topic UUID is invalid',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: ErrorCodes.INVALID_TOPIC_UUID,
  },
  INVALID_TUTORIAL_UUID: {
    message: 'Tutorial UUID is invalid',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: ErrorCodes.INVALID_COURSE_UUID,
  },
  INVALID_TUTORIAL_OWNERSHIP: {
    message: 'User not own this tutorial',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: ErrorCodes.INVALID_TUTORIAL_OWNERSHIP,
  },
  NO_FILE_INPUT: {
    message: 'Please add a file to request',
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: ErrorCodes.NO_FILE_INPUT,
  },
};
