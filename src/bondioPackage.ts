import Joi from 'joi';
import { patterns } from './utils/patterns';

// Define interface for the schema type
export interface BondioPackageSchema {
  iso: string;
  periodDays: number;
  periodIterations: number;
  price: number;
  isHidden: boolean;
  size: string;
  partner?: string;
  subscription_type: 'lambda' | 'xi';
}

export const bondioPackageSchema = Joi.object<BondioPackageSchema>({
  iso: Joi.string()
    .required()
    .pattern(patterns.destination)
    .messages({
      'string.pattern.base': 'ISO must be 2-3 uppercase letters',
    }),

  periodDays: Joi.number()
    .required()
    .min(1)
    .max(30)
    .default(30)
    .messages({
      'number.min': 'Period days must be at least 1',
      'number.max': 'Period days cannot exceed 30',
    }),

  periodIterations: Joi.number()
    .required()
    .min(1)
    .default(1),

  price: Joi.number()
    .required()
    .positive(),

  isHidden: Joi.boolean()
    .required(),

  size: Joi.string()
    .required()
    .pattern(patterns.size)
    .messages({
      'string.pattern.base': 'Size must be in format: number followed by MB or GB (e.g., "500MB" or "1.5GB")',
    }),

  partner: Joi.string()
    .optional(),

  subscription_type: Joi.string()
    .required()
    .valid('lambda', 'xi')
    .messages({
      'any.only': 'Subscription type must be either "lambda" or "xi"'
    }),
})
  .label('BondioPackage')
  .options({ abortEarly: false, stripUnknown: true });