import Joi from 'joi';
import { patterns } from './utils/patterns';

// Define interface for the schema type
export interface PackageSchema {
  size: string;
  iso: string;
  days: number;
  price: number;
  isHidden: boolean;
}

export const packageSchema = Joi.object<PackageSchema>({
  size: Joi.string().required().pattern(patterns.size),
  iso: Joi.string().required().pattern(patterns.destination),
  days: Joi.number().required(),
  price: Joi.number().required(),
  isHidden: Joi.boolean().default(false),
})
  .label('Package')
  .options({ abortEarly: false, stripUnknown: true });