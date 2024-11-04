import Joi from 'joi';

interface PackageSpecification {
  package_id?: string;
  destination?: string;
  iata_code?: string;
  size?: string;
}

export interface PackageSpecificationsSchema {
  package_specifications: PackageSpecification[];
}

const sizePattern = /^[1-9]\d*(MB|GB)$/;
const destinationPattern = /^[A-Z]{2,3}$/;

export const packageSpecificationsSchema = async (): Promise<Joi.ObjectSchema<PackageSpecificationsSchema>> => {
  const packageSpecificationSchema = Joi.object<PackageSpecification>({
    package_id: Joi.string(), // package_id property can be any string
    destination: Joi.string().pattern(destinationPattern), // ISO3 string for destination
    iata_code: Joi.string().pattern(destinationPattern), // ISO3 string for destination
    size: Joi.string().pattern(sizePattern), // size in the form of "500MB" or "3GB"
  })
    .or('package_id', 'destination', 'iata_code'); // Must have either package_id or destination or iata
  // .xor('package_id', 'size') // `size` should not exist with `package_id`
  // .with('destination') // `size` must exist together with `destination`

  return Joi.object<PackageSpecificationsSchema>({
    package_specifications: Joi.array().items(packageSpecificationSchema).min(1).required(),
  })
    .options({ abortEarly: false, stripUnknown: true });
};