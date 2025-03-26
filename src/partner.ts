import Joi from 'joi';
import * as IBAN from 'iban';
import { 
  Partner, 
  VisualIdentity, 
  VisualIdentityBannerStrategy, 
  VisualIdentityBanner,
  BookingDefaults,
  BookingConfirmation,
  Schedule,
  TravelSpiritConfig,
  PricingStrategy,
  PackageStrategy
} from '@hubbyesim/types';

export const partnerSchema = Joi.object<Partner>({
  administration_fee: Joi.number().allow(null),
  email: Joi.string().email().allow(null),
  income_per_gb: Joi.number().allow(null),
  name: Joi.string().allow(null),
  requires_card: Joi.boolean().allow(null),
  type: Joi.string().allow(null),
  schedules: Joi.array().items(Joi.object<Schedule>({
    days: Joi.number().required(),
    email: Joi.object({
      brevoTemplateId: Joi.number().required(),
      travelerBrevoTemplateId: Joi.number().optional()
    }).required(),
    hour: Joi.number().required(),
    key: Joi.string().required(),
    method: Joi.string().required(),
    moment: Joi.string().required(),
    subject: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
    previewText: Joi.object().pattern(Joi.string(), Joi.string()).optional()
  })).allow(null),
  visualIdentity: Joi.object<VisualIdentity>({
    primary_color: Joi.string().required(),
    secondary_color: Joi.string().required(),
    logo: Joi.string().required(),
    font: Joi.string().required(),
    top_banner: Joi.object<VisualIdentityBannerStrategy>({
      strategy: Joi.string().valid('fixed', 'rotating', 'destination', 'timeOfDay').required(),
      banners: Joi.array().items(Joi.object<VisualIdentityBanner>({
        image_url: Joi.string().required(),
        alt: Joi.string().required(),
        click_url: Joi.string().required(),
        locale: Joi.string().required(),
        properties: Joi.object().pattern(Joi.string(), Joi.string()).required()
      })).required()
    }).required(),
    mid_banner: Joi.object<VisualIdentityBannerStrategy>({
      strategy: Joi.string().valid('fixed', 'rotating', 'destination', 'timeOfDay').required(),
      banners: Joi.array().items(Joi.object<VisualIdentityBanner>({
        image_url: Joi.string().required(),
        alt: Joi.string().required(),
        click_url: Joi.string().required(),
        locale: Joi.string().required(),
        properties: Joi.object().pattern(Joi.string(), Joi.string()).required()
      })).required()
    }).required()
  }).allow(null),
  pricingStrategy: Joi.object<PricingStrategy>({
    name: Joi.string().required(),
    parameters: Joi.any().required()
  }).allow(null).optional(),
  packageStrategy: Joi.object<PackageStrategy>({
    name: Joi.string().required(),
    iso3WhiteList: Joi.array().items(Joi.string()).optional(),
    parameters: Joi.any().required()
  }).allow(null).optional(),
  travelSpiritConfig: Joi.object<TravelSpiritConfig>({
    id: Joi.string().required(),
    dbHost: Joi.string().required(),
    dbPort: Joi.number().required(),
    dbUser: Joi.string().required(),
    dbPassword: Joi.string().required(),
    dbName: Joi.string().required(),
    tableName: Joi.string().required(),
    schedule: Joi.string().required(),
    externalPartnerName: Joi.string().required()
  }).allow(null).optional(),
  next_invoice: Joi.date().iso().allow(null),
  last_invoice: Joi.date().iso().allow(null),
  parent: Joi.string().allow(null), // DocumentReference will be handled at model level
  payment_method: Joi.string().valid('invoice', 'direct').required(),
  booking_confirmation: Joi.object<BookingConfirmation>({
    brevo_template_id: Joi.number().required(),
    send_booking_confirmation: Joi.boolean().required()
  }).allow(null),
  users: Joi.array().items(Joi.string()).allow(null), // DocumentReference will be handled at model level
  is_active: Joi.boolean().allow(null).optional(),
  booking_defaults: Joi.object<BookingDefaults>({
    locale: Joi.string().required()
  }).allow(null),
  external_id: Joi.string().allow(null).optional(),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    postal_code: Joi.string().optional(),
    country: Joi.string().optional()
  }).allow(null).optional(),
  banking_details: Joi.object({
    account_holder: Joi.string().required(),
    bank_name: Joi.string().required(),
    iban: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (value && !IBAN.isValid(value)) {
          return helpers.error('any.invalid', { label: 'IBAN' });
        }
        return value;
      }, 'Global IBAN validation')
  }).allow(null).optional(),
  office_phone: Joi.string().allow(null).optional(),
  chamber_of_commerce_number: Joi.string().allow(null).optional(),
  vat_number: Joi.string().allow(null).optional(),
  anvr_number: Joi.number().allow(null).optional(),
  tax_number: Joi.string().allow(null).optional(),
  commission_fee: Joi.number()
    .min(0)  // Cannot be negative
    .max(100)  // Maximum 100%
    .precision(2)  // Allow up to 2 decimal places
    .allow(null)
    .optional()
    .messages({
      'number.min': 'Commission fee cannot be negative',
      'number.max': 'Commission fee cannot exceed 100%',
      'number.precision': 'Commission fee can have at most 2 decimal places'
    }),
  data: Joi.object({
    source: Joi.string().required(),
    manual: Joi.boolean().required()
  }).allow(null).optional()
})
  .label('Partner')
  .options({ abortEarly: false, stripUnknown: true });

export type PartnerSchema = Joi.ObjectSchema<Partner>;