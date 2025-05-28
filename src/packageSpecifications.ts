import Joi from 'joi';
import { patterns } from './utils/patterns';
import { PackageSpecification } from '@hubbyesim/types';

export interface PackageSpecificationsSchema {
  package_specifications: [];
}

const packageSpecificationSchema = Joi.object<PackageSpecification>({
  package_id: Joi.string().optional(),
  destination: Joi.string().pattern(patterns.destination).optional(),
  iata_code: Joi.string().pattern(patterns.destination).optional(),
  size: Joi.string().pattern(patterns.size).optional(),
})
  .or('package_id', 'destination', 'iata_code');

export const packageSpecificationsSchema = Joi.object<PackageSpecificationsSchema>({
  package_specifications: Joi.array().items(packageSpecificationSchema).min(1).required(),
})
  .options({ abortEarly: false, stripUnknown: true });