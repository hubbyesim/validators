import Joi from 'joi';
import * as IBAN from 'iban';
import { Partner } from '@hubbyesim/types';

export const partnerSchema = Joi.object<Partner>({
  administration_fee: Joi.number().required(),
  income_per_gb: Joi.number().required(),
  type: Joi.string().required(),
  requires_card: Joi.boolean().required(),
  name: Joi.string().required(),
  last_invoice: Joi.date().iso().required(),
  next_invoice: Joi.date().iso().required().min(Joi.ref('last_invoice')),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    postal_code: Joi.string().optional(),
    country: Joi.string().optional(),
  }).optional(),
  banking_details: Joi.object({
    account_holder: Joi.string().optional(),
    bank_name: Joi.string().optional(),
    iban: Joi.string()
      .optional()
      .custom((value, helpers) => {
        if (value && !IBAN.isValid(value)) {
          return helpers.error('any.invalid', { label: 'IBAN' });
        }
        return value;
      }, 'Global IBAN validation'),
  }).optional(),
  users: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required()
    })
  ).optional().min(1),
  tax_number: Joi.string().optional(),
  office_phone: Joi.string().optional(),
  chamber_of_commerce_number: Joi.string().optional(),
  vat_number: Joi.string().optional(),
  anvr_number: Joi.number().optional(),
  email: Joi.string().email().optional(),
  created_at: Joi.date().iso().optional(),
  updated_at: Joi.date().iso().optional(),
  packageStrategy: Joi.object().optional(),
  visualIdentity: Joi.object().optional(),
  schedules: Joi.array().optional(),
  travelSpiritConfig: Joi.object().optional(),
  booking_confirmation: Joi.object().optional(),
  commission_fee: Joi.number()
    .min(0)  // Cannot be negative
    .max(100)  // Maximum 100%
    .precision(2)  // Allow up to 2 decimal places
    .optional()
    .allow(null)
    .messages({
      'number.min': 'Commission fee cannot be negative',
      'number.max': 'Commission fee cannot exceed 100%',
      'number.precision': 'Commission fee can have at most 2 decimal places'
    }),
})
  .label('Partner')
  .options({ abortEarly: false, stripUnknown: true });

export type PartnerSchema = Joi.ObjectSchema<Partner>;