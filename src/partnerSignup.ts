import Joi from 'joi';
import IBAN from 'iban';

export interface PartnerSignupSchema {
    address: string;
    banking_details: {
        account_holder: string;
        bank_name: string;
        iban: string;
    };
    email: string;
    name: string;
    office_phone?: string;
    password: string;
    tax_number: string;
    users?: []; // Optional
    vat_number?: string;
    logoBase64?: string; // Optional
    bannerBase64?: string; // Optional
}

export const partnerSignupSchema = Joi.object<PartnerSignupSchema>({
    address: Joi.object().optional(),
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
    email: Joi.string().email().required(), // Required for signup
    name: Joi.string().required(),
    office_phone: Joi.string().optional(),
    password: Joi.string().min(8).required(), // Ensure secure password with minimum length
    tax_number: Joi.string().required(), // Required for signup
    users: Joi.array().items(Joi.object()).optional(), // Optional users array
    vat_number: Joi.string().optional(),
    logoBase64: Joi.string()
        .base64()
        .optional()
        .messages({ 'string.base64': 'Logo must be a valid Base64 string' }),
    bannerBase64: Joi.string()
        .base64()
        .optional()
        .messages({ 'string.base64': 'Banner must be a valid Base64 string' }),
})
    .label('PartnerSignup')
    .options({ abortEarly: false, stripUnknown: true });
