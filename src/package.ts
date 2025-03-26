import Joi from 'joi';
import { Package } from '@hubbyesim/types';

export const packageSchema = Joi.object<Package>({
  external_id: Joi.string().required(),
  provider: Joi.string().valid('telna', 'bondio').required(),
  coverage_label: Joi.string().allow(null),
  label: Joi.string().required(),
  bytes: Joi.number().required(),
  country: Joi.string().required(),
  hidden: Joi.boolean().required(),
  is_hidden: Joi.boolean().required(),
  is_active: Joi.boolean().required(),
  priority: Joi.number().required(),
  country_data: Joi.object().allow(null),
  price: Joi.number().required(),
  partner_price: Joi.number().required(),
  days: Joi.number().required(),
  partner: Joi.string().allow(null),
  name: Joi.string().required(),
  type: Joi.string().valid('data-limited', 'time-limited').allow(null),
  throttling: Joi.number().optional(),
  provider_parameters: Joi.object({
    imsi: Joi.number().required()
  }).allow(null)
})
  .label('Package')
  .options({ abortEarly: false, stripUnknown: true });

export type PackageSchema = Joi.ObjectSchema<Package>;