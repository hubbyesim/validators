import Joi from 'joi';
import { patterns } from './utils/patterns';
import type { Country } from '@hubbyesim/types';

// Define interface for the schema type
export interface PackageSchema {
  size: string;
  iso: string;
  days: number;
  price: number;
  partner?: string | null;
  is_hidden: boolean;
  is_active: boolean;
  priority: number;
}

export const packageSchema = Joi.object<PackageSchema>({
  size: Joi.string().required().pattern(patterns.size),
  iso: Joi.string().required().pattern(patterns.destination),
  days: Joi.number().required(),
  price: Joi.number().required(),
  partner: Joi.string().allow(null, '').optional(),
  is_hidden: Joi.boolean().default(false),
  is_active: Joi.boolean().default(true),
  priority: Joi.number()
    .min(1)
    .required()
    .messages({
      'number.min': 'Priority must be at least 1',
      'number.base': 'Priority must be a number',
    }),
})
  .label('Package')
  .options({ abortEarly: false, stripUnknown: true });