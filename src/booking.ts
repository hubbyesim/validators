import Joi from 'joi';
import { patterns } from './utils/patterns';
import { BookingApiRequest, PackageSpecification, CommunicationChannel } from '@hubbyesim/types';

//Backward compatibility with old locales
const allowedLocales = ['en-US', 'nl-NL', 'de-DE', 'fr-FR', 'it-IT', 'es-ES', 'cs-CZ', 'pl-PL', 'en', 'nl', 'de', 'fr', 'it', 'es', 'cs', 'pl'] as const;

const packageSpecificationSchema = Joi.object<PackageSpecification>({
  package_id: Joi.string().optional(),
  destination: Joi.string().optional(),
  iata_code: Joi.string().pattern(patterns.destination).optional(),
  size: Joi.string().pattern(patterns.size).optional(),
}).or('package_id', 'destination');

const communication_options = Joi.object({
  should_send_message: Joi.boolean().required(),
  channels: Joi.array().items(
    Joi.string().valid(CommunicationChannel.EMAIL, CommunicationChannel.WHATSAPP, CommunicationChannel.PUSH_NOTIFICATION, CommunicationChannel.SMS)
  ).optional(),
});

export const bookingSchema = Joi.object<BookingApiRequest>({
  departure_date: Joi.date().iso().required(),
  email: Joi.string().email().optional().allow(null),
  phone: Joi.string()
    .pattern(/^\+\d{1,3}\d{1,14}$/)
    .optional()
    .allow(null),
  first_name: Joi.string().min(1).max(100).optional().allow(null),
  last_name: Joi.string().min(1).max(100).optional().allow(null),
  full_name: Joi.string().min(1).max(200).optional().allow(null),
  title: Joi.string().valid('mr.', 'ms.', 'mrs.', 'miss', 'dr.', 'prof.').insensitive().optional().allow(null),
  pax: Joi.number().integer().min(1).optional().allow(null),
  return_date: Joi.date().iso().min(Joi.ref('departure_date')).optional().allow(null),
  flight_number: Joi.string().alphanum().min(1).max(10).optional().allow(null),
  gender: Joi.string().valid('M', 'F', 'O').optional(),
  data: Joi.object().optional(),
  locale: Joi.string().valid(...Object.values(allowedLocales)).optional(),
  booking_id: Joi.string().min(3).optional().allow(null),
  communication_options: communication_options.required(),
  package_specifications: Joi.array().items(packageSpecificationSchema).min(1).required(),
  created_at: Joi.date().required(),
  updated_at: Joi.date().required()
})
  .label('Booking')
  .or('email', 'booking_id') // Enforces at least one of these
  .options({ abortEarly: false, stripUnknown: true });


export type BookingSchema = Joi.ObjectSchema<BookingApiRequest>;