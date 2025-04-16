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
  PackageStrategy,
  PartnerPricing
} from '@hubbyesim/types';

export const partnerSchema = Joi.object<Partner>({
  // Basic information
  id: Joi.string().required(),
  name: Joi.string().allow(null),
  type: Joi.string().allow(null),
  is_active: Joi.boolean().allow(null).optional(),
  external_id: Joi.string().allow(null).optional(),
  parent: Joi.any().allow(null), // DocumentReference will be handled at model level

  // Contact information
  contact: Joi.object({
    email: Joi.string().email().allow(null),
    office_phone: Joi.string().allow(null).optional()
  }).allow(null),

  // Location information
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    postal_code: Joi.string().optional(),
    country: Joi.string().optional()
  }).allow(null).optional(),

  // Registration information
  registration: Joi.object({
    chamber_of_commerce_number: Joi.string().allow(null).optional(),
    vat_number: Joi.string().allow(null).optional(),
    anvr_number: Joi.number().allow(null).optional(),
    tax_number: Joi.string().allow(null).optional()
  }).allow(null).optional(),

  // Banking information
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

  // Financial information
  financial_properties: Joi.object({
    administration_fee: Joi.number().allow(null),
    income_per_gb: Joi.number().allow(null),
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
    payment_method: Joi.string().valid('invoice', 'direct').required(),
    requires_card: Joi.boolean().allow(null),
    next_invoice: Joi.date().allow(null),
    last_invoice: Joi.date().allow(null),
    pricing_strategy: Joi.object({
      strategy: Joi.string().valid('split', 'bundle').required(),
      default_price_list: Joi.any().allow(null), // DocumentReference will be handled at model level
      custom_prices: Joi.array().items(Joi.object<PartnerPricing>({
        iso3: Joi.string().required(),
        label: Joi.string().valid('1GB', '1DAY').required(),
        type: Joi.string().valid('data-limit', 'time-limit').required(),
        price: Joi.number().required()
      }))
    }).allow(null).optional()
  }).allow(null),

  // Platform settings
  platform_settings: Joi.object({
    package_strategy: Joi.object<PackageStrategy>({
      name: Joi.string().required(),
      iso3_white_list: Joi.array().items(Joi.string()).optional(),
      parameters: Joi.any().required()
    }).allow(null).optional(),
    free_esim: Joi.object({
      allowance: Joi.number().allow(null),
      package_specifications: Joi.any().allow(null) // This will be validated elsewhere
    }).allow(null).optional(),
    booking_defaults: Joi.object<BookingDefaults>({
      locale: Joi.string().required()
    }).allow(null),
    schedules: Joi.array().items(Joi.object<Schedule>({
      days: Joi.number().required(),
      email: Joi.object({
        brevo_template_id: Joi.number().required(),
        subject: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
        preview_text: Joi.object().pattern(Joi.string(), Joi.string()).optional()
      }).allow(null),
      push: Joi.object({
        title: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
        body: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
        target: Joi.string().required()
      }).allow(null),
      hour: Joi.number().required(),
      key: Joi.string().required(),
      method: Joi.string().valid('email', 'sms', 'whatsapp', 'push').required(),
      moment: Joi.string().valid('departure', 'return', 'immediate').required(),
      filter: Joi.object({
        type: Joi.string().valid('iso3', 'gender', 'percentage', 'age').required(),
        value: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
        comparison: Joi.string().valid(
          'equal', 'not_equal', 'greater_than', 'less_than', 
          'greater_than_or_equal', 'less_than_or_equal'
        ).required()
      }).allow(null)
    })).allow(null),
    booking_confirmation: Joi.object<BookingConfirmation>({
      brevo_template_id: Joi.number().required(),
      send_booking_confirmation: Joi.boolean().required()
    }).allow(null)
  }).optional(),

  // Visual identity
  visual_identity: Joi.object<VisualIdentity>({
    primary_color: Joi.string().required(),
    secondary_color: Joi.string().required(),
    font: Joi.string().required(),
    logo: Joi.string().required(),
    top_banner: Joi.object<VisualIdentityBannerStrategy>({
      strategy: Joi.string().valid('fixed', 'rotating', 'destination', 'time_of_day').required(),
      banners: Joi.array().items(Joi.object<VisualIdentityBanner>({
        image_url: Joi.string().required(),
        alt: Joi.string().required(),
        click_url: Joi.string().required(),
        locale: Joi.string().required(),
        properties: Joi.object().pattern(Joi.string(), Joi.string()).required()
      })).required()
    }).required(),
    mid_banner: Joi.object<VisualIdentityBannerStrategy>({
      strategy: Joi.string().valid('fixed', 'rotating', 'destination', 'time_of_day').required(),
      banners: Joi.array().items(Joi.object<VisualIdentityBanner>({
        image_url: Joi.string().required(),
        alt: Joi.string().required(),
        click_url: Joi.string().required(),
        locale: Joi.string().required(),
        properties: Joi.object().pattern(Joi.string(), Joi.string()).required()
      })).required()
    }).required()
  }).allow(null),

  // User management
  users: Joi.array().items(Joi.any()).allow(null), // DocumentReference will be handled at model level

  // Metadata
  data: Joi.object({
    source: Joi.string().required(),
    manual: Joi.boolean().required()
  }).optional()
})
  .label('Partner')
  .options({ abortEarly: false, stripUnknown: true });

export type PartnerSchema = Joi.ObjectSchema<Partner>;