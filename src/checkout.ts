import Joi from 'joi';

export interface CheckoutSchema {
  email: string;
  partnerId: string;
  packageId: string;
  successUrl: string;
  cancelUrl: string;
}

export const checkoutSchema = async (): Promise<Joi.ObjectSchema<CheckoutSchema>> => {
  return Joi.object<CheckoutSchema>({
    email: Joi.string().email().required(),
    partnerId: Joi.string().required(),
    packageId: Joi.string().required(),
    successUrl: Joi.string().uri().required(),
    cancelUrl: Joi.string().uri().required(),
  })
    .label('Checkout')
    .options({ abortEarly: false, stripUnknown: true });
};