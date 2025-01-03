import Joi from 'joi';

// Define interface for the schema type
export interface PackageSchema {
  size: string;
  iso: string;
  days: number;
  price: number;
  isHidden: boolean;
}

const destinationPattern = /^[A-Z]{2,3}$/;
const sizePattern = /^[0-9]\d*(\.\d+)?(MB|GB)$/;

export const packageSchema = Joi.object<PackageSchema>({
  size: Joi.string().required().pattern(sizePattern), // size in the form of "500MB" or "3GB" or "3.25 GB"
  iso: Joi.string().required().pattern(destinationPattern),
  days: Joi.number().required(),
  price: Joi.number().required(),
  isHidden: Joi.boolean().default(false),
})
  .label('Package')
  .options({ abortEarly: false, stripUnknown: true });