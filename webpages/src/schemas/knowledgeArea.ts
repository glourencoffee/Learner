import * as yup from 'yup';

export const getTopLevelKnowledgeAreaSchema = yup
  .object({
    areas: yup.array().required().of(
      yup.object({
        id:   yup.number().required(),
        name: yup.string().required()
      })
    )
  });