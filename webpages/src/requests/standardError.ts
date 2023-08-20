import * as yup from 'yup';

/**
 * A schema to validate standard error objects
 * received from the webservices API.
 */
export const standardErrorSchema = yup
  .object({
    path:   yup.string().required(),
    method: yup.string().required(),
    error:  yup.object({
      status:  yup.number().required(),
      name:    yup.string().required(),
      message: yup.string().required(),
      details: yup.mixed().optional()
    })
    .required()
  })
  .required();