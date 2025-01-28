import Joi from 'joi';
import { patterns } from './utils/patterns';

interface PackageSpecification {
  package_id?: string;
  destination: string; 
  iata_code?: string;
  size?: string;
}

export interface PackageSpecificationsSchema {
  package_specifications: PackageSpecification[];
}

const packageSpecificationSchema = Joi.object<PackageSpecification>({
  package_id: Joi.string(), // package_id property can be any string
  destination: Joi.string().pattern(patterns.destination), 
  iata_code: Joi.string().pattern(patterns.destination),
  size: Joi.string().pattern(patterns.size),
})
  .or('package_id', 'destination', 'iata_code'); // Must have either package_id or destination or iata

export const packageSpecificationsSchema = Joi.object<PackageSpecificationsSchema>({
  package_specifications: Joi.array().items(packageSpecificationSchema).min(1).required(),
})
  .options({ abortEarly: false, stripUnknown: true });