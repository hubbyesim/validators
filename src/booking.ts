import Joi from 'joi';

// Define interfaces for the schema types
interface PackageSpecification {
  package_id?: string;
  destination?: string;
  iata_code?: string;
  size?: string;
}

interface CommunicationOptions {
  should_send_message: boolean;
  channels?: Array<'EMAIL' | 'PUSH' | 'SMS' | 'WHATSAPP'>;
}

export interface BookingSchema {
  departure_date: Date;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  title?: 'mr.' | 'ms.' | 'mrs.' | 'miss' | 'dr.' | 'prof.';
  pax?: number;
  return_date: Date;
  flight_number?: string;
  gender?: 'M' | 'F' | 'O';
  date_of_birth?: Date;
  data?: Record<string, unknown>;
  locale?: string;
  booking_id?: string;
  communication_options: CommunicationOptions;
  package_specifications: PackageSpecification[];
}

const sizePattern = /^[1-9]\d*(MB|GB)$/;
const destinationPattern = /^[A-Z]{2,3}$/;

const packageSpecificationSchema = Joi.object<PackageSpecification>({
  package_id: Joi.string(),
  destination: Joi.string().pattern(destinationPattern),
  iata_code: Joi.string().pattern(destinationPattern),
  size: Joi.string().pattern(sizePattern),
})
  .or('package_id', 'destination', 'iata_code');

const communication_options = Joi.object<CommunicationOptions>({
  should_send_message: Joi.boolean().required(),
  channels: Joi.array().items(Joi.string().valid('EMAIL', 'PUSH', 'SMS', 'WHATSAPP')).optional(),
});

export const bookingSchema = Joi.object<BookingSchema>({
  departure_date: Joi.date().iso().required(),
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .pattern(/^\+\d{1,3}\d{1,14}$/)
    .optional(),
  first_name: Joi.string().min(1).max(100).optional(),
  last_name: Joi.string().min(1).max(100).optional(),
  full_name: Joi.string().min(1).max(200).optional(),
  title: Joi.string().valid('mr.', 'ms.', 'mrs.', 'miss', 'dr.', 'prof.').insensitive().optional(),
  pax: Joi.number().integer().min(1).optional(),
  return_date: Joi.date().iso().min(Joi.ref('departure_date')).required(),
  flight_number: Joi.string().alphanum().min(1).max(10).optional(),
  gender: Joi.string().valid('M', 'F', 'O').optional(),
  date_of_birth: Joi.date().iso().max('now').optional(),
  data: Joi.object().optional(),
  locale: Joi.string().min(2).max(5).optional(),
  booking_id: Joi.string().optional().min(3),
  communication_options: communication_options.required(),
  package_specifications: Joi.array().items(packageSpecificationSchema).min(1).required(),
})
  .label('Booking')
  .or('email', 'booking_id')
  .options({ abortEarly: false, stripUnknown: true });