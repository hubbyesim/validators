import Joi from 'joi';
import { patterns } from './utils/patterns';
import { BookingApiRequest } from '@hubbyesim/types';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'unpaid' | 'expired';

//Backward compatibility with old locales
const allowedLocales = ['en-US', 'nl-NL', 'de-DE', 'fr-FR', 'it-IT', 'es-ES', 'cs-CZ', 'pl-PL', 'en', 'nl', 'de', 'fr', 'it', 'es', 'cs', 'pl'] as const;

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

// Package Specification Schema: Ensures `destination` is required
const packageSpecificationSchema = Joi.object<PackageSpecification>({
  package_id: Joi.string().optional(),
  destination: Joi.string().optional(),
  iata_code: Joi.string().pattern(patterns.destination).optional(),
  size: Joi.string().pattern(patterns.size).optional(),
}).or('package_id', 'destination');

const communication_options = Joi.object<CommunicationOptions>({
  should_send_message: Joi.boolean().required(),
  channels: Joi.array().items(Joi.string().valid('EMAIL', 'PUSH', 'SMS', 'WHATSAPP')).optional(),
});

export const bookingSchema = Joi.object<BookingApiRequest>({
  departure_date: Joi.date().iso().required(), // Required field
  email: Joi.string().email().optional(), // Optional, but required with OR condition
  phone: Joi.string()
    .pattern(/^\+\d{1,3}\d{1,14}$/)
    .optional(),
  first_name: Joi.string().min(1).max(100).optional(),
  last_name: Joi.string().min(1).max(100).optional(),
  full_name: Joi.string().min(1).max(200).optional(),
  title: Joi.string().valid('mr.', 'ms.', 'mrs.', 'miss', 'dr.', 'prof.').insensitive().optional(),
  pax: Joi.number().integer().min(1).optional(),
  return_date: Joi.date().iso().min(Joi.ref('departure_date')).optional(), // Optional
  flight_number: Joi.string().alphanum().min(1).max(10).optional(),
  gender: Joi.string().valid('M', 'F', 'O').optional(),
  data: Joi.object().optional(),
  locale: Joi.string().valid(...Object.values(allowedLocales)).optional(),
  booking_id: Joi.string().min(3).optional(),
  communication_options: communication_options.optional(),
  package_specifications: Joi.array().items(packageSpecificationSchema).min(1).required(), // Required
})
  .label('Booking')
  .or('email', 'booking_id') // Enforces at least one of these
  .options({ abortEarly: false, stripUnknown: true });


export type BookingSchema = Joi.ObjectSchema<BookingApiRequest>;