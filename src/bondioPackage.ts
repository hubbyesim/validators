import Joi from 'joi';
import { patterns } from './utils/patterns';
import type { Country } from '@hubbyesim/types';

// Define interface for the schema type
export interface BondioPackageSchema {
  iso: string;
  periodDays: number;
  periodIterations: number;
  price: number;
  size: string;
  partner?: string | null;
  label: 'lambda' | 'tau';
  is_hidden: boolean;
  is_active: boolean;
  priority: number;
  throttling: number;
  packageType: string;
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

  size: Joi.string()
    .required()
    .pattern(patterns.size)
    .messages({
      'string.pattern.base': 'Size must be in format: number followed by MB or GB (e.g., "500MB" or "1.5GB")',
    }),

  partner: Joi.string()
    .allow('', null)
    .optional(),

    label: Joi.string()
    .required()
    .valid('lambda', 'tau')
    .messages({
      'any.only': 'Label must be either "lambda" or "tau"'
    }),

  is_hidden: Joi.boolean()
    .default(false),

  is_active: Joi.boolean()
    .default(true),

  priority: Joi.number()
    .min(1)
    .required()
    .messages({
        'number.min': 'Priority must be at least 1',
        'number.base': 'Priority must be a number',
    }),

  throttling: Joi.number()
    .min(0)
    .required()
    .messages({
        'number.min': 'Throttling must be at least 0',
        'number.base': 'Throttling must be a number',
    }),

  packageType: Joi.string()
    .required()
    .valid('data-limited', 'time-limited')
    .messages({
      'any.only': 'Package type must be either "data-limited" or "time-limited"',
    }),
})
  .label('BondioPackage')
  .options({ abortEarly: false, stripUnknown: true });