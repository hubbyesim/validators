import Joi from 'joi';
import IBAN from 'iban';

export interface PartnerSignupSchema {
    address?: {
        street?: string;
        city?: string;
        postal_code?: string;
        country?: string;
    };
    banking_details: {
        account_holder: string;
        bank_name: string;
        iban: string;
    };
    email: string;
    name: string;
    office_phone?: string;
    password: string;
    tax_number?: string;
    users?: {
        name: string;
        email: string;
    }[];
    vat_number?: string;
    logoBase64?: string;
    bannerBase64?: string;
}

export const partnerSignupSchema = Joi.object<PartnerSignupSchema>({
    address: Joi.object({
        street: Joi.string().optional(),
        city: Joi.string().optional(),
        postal_code: Joi.string().optional(),
        country: Joi.string().optional(),
    }).optional(),
    banking_details: Joi.object({
        account_holder: Joi.string().required(),
        bank_name: Joi.string().required(),
        iban: Joi.string()
            .required()
            .custom((value, helpers) => {
                if (!IBAN.isValid(value)) {
                    return helpers.error('any.invalid', { label: 'IBAN' });
                }
                return value;
            }, 'Global IBAN validation'),
    }).required(),
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    office_phone: Joi.string().optional(),
    password: Joi.string().min(8).required(),
    tax_number: Joi.string().optional(),
    users: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required()
        })
    ).optional().min(1),
    vat_number: Joi.string().optional(),
    logoBase64: Joi.string()
        .custom((value, helpers) => {
            if (!value) return value;
            const base64Data = value.replace(/^data:image\/\w+;base64,/, '');
            try {
                const buffer = Buffer.from(base64Data, 'base64');
                if (buffer.toString('base64') !== base64Data) {
                    return helpers.error('string.base64');
                }
                return value;
            } catch {
                return helpers.error('string.base64');
            }
        })
        .optional()
        .messages({ 'string.base64': 'Logo must be a valid Base64 image string' }),
    bannerBase64: Joi.string()
        .custom((value, helpers) => {
            if (!value) return value;
            const base64Data = value.replace(/^data:image\/\w+;base64,/, '');
            try {
                const buffer = Buffer.from(base64Data, 'base64');
                if (buffer.toString('base64') !== base64Data) {
                    return helpers.error('string.base64');
                }
                return value;
            } catch {
                return helpers.error('string.base64');
            }
        })
        .optional()
        .messages({ 'string.base64': 'Banner must be a valid Base64 image string' }),
    })
    .label('PartnerSignup')
    .options({ abortEarly: false, stripUnknown: true });
