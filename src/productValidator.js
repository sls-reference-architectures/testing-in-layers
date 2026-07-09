import Joi from 'joi';
import { BadRequest } from 'http-errors';

const schema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required().min(0).invalid(0),
  description: Joi.string().max(500),
});

const validate = (product) => {
  const result = schema.validate(product, { abortEarly: false, stripUnknown: true });
  if (result.error) {
    throw new BadRequest(`Bad Request: ${result.error.message}`);
  }

  return result.value;
};

export default validate;
