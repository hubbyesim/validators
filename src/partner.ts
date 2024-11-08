import Joi from 'joi';

export interface PartnerSchema {
  administration_fee: number;
  income_per_gb: number;
  type: string;
  requires_card: boolean;
  name: string;
  last_invoice: Date;
  next_invoice: Date;
  address?: Record<string, unknown>;
  office_phone?: string;
  chamber_of_commerce_number?: string;
  vat_number?: string;
  anvr_number?: number;
  email?: string;
  created_at?: Date;
  updated_at?: Date;
  packageStrategy?: Record<string, unknown>;
  visualIdentity?: Record<string, unknown>;
  iframeConfig?: Record<string, unknown>;
  schedules?: unknown[];
  travelSpiritConfig?: Record<string, unknown>;
}

export const partnerSchema = Joi.object<PartnerSchema>({
  administration_fee: Joi.number().required(),
  income_per_gb: Joi.number().required(),
  type: Joi.string().required(),
  requires_card: Joi.boolean().required(),
  name: Joi.string().required(),
  last_invoice: Joi.date().iso().required(),
  next_invoice: Joi.date().iso().required().min(Joi.ref('last_invoice')),
  address: Joi.object().optional(),
  office_phone: Joi.string().optional(),
  chamber_of_commerce_number: Joi.string().optional(),
  vat_number: Joi.string().optional(),
  anvr_number: Joi.number().optional(),
  email: Joi.string().email().optional(),
  created_at: Joi.date().iso().optional(),
  updated_at: Joi.date().iso().optional(),
  packageStrategy: Joi.object().optional(),
  visualIdentity: Joi.object().optional(),
  iframeConfig: Joi.object().optional(),
  schedules: Joi.array().optional(),
  travelSpiritConfig: Joi.object().optional(),
})
  .label('Partner')
  .options({ abortEarly: false, stripUnknown: true });