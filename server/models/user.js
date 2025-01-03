import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { z } from 'zod';

import Base from './base.js';
import mailer from '#lib/mailer.js';

const UserAttributesSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be between 2 and 30 characters long')
    .max(30, 'First name must be between 2 and 30 characters long'),
  lastName: z
    .string()
    .min(2, 'Last name must be between 2 and 30 characters long')
    .max(30, 'Last name must be between 2 and 30 characters long'),
  email: z.string().email('Please enter a valid email address.'),
});

const UserPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
    'Password must include uppercase, lowercase, number, and special characters'
  );

const UserRegisterSchema = UserAttributesSchema.extend({
  password: UserPasswordSchema,
  inviteId: z.string().uuid().optional(),
});

const UserResponseSchema = UserAttributesSchema.extend({
  id: z.string().uuid(),
  picture: z.string().nullable(),
  pictureUrl: z.string().nullable(),
  isAdmin: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deactivatedAt: z.coerce.date().nullable(),
});

const UserUpdateSchema = UserAttributesSchema.extend({
  password: UserPasswordSchema.or(z.literal('')),
  picture: z.string().nullable(),
  isAdmin: z.boolean(),
  deactivatedAt: z.coerce.date().nullable(),
}).partial();

export class User extends Base {
  static PasswordSchema = UserPasswordSchema;
  static RegisterSchema = UserRegisterSchema;
  static ResponseSchema = UserResponseSchema;
  static UpdateSchema = UserUpdateSchema;

  constructor (data) {
    super(Prisma.UserScalarFieldEnum, data);
  }

  get pictureUrl () {
    return this.getAssetUrl('picture');
  }

  get isActive () {
    return !this.deactivatedAt;
  }

  get isPasswordResetTokenValid () {
    return new Date() <= new Date(this.passwordResetExpiresAt);
  }

  get fullNameAndEmail () {
    return `${this.firstName} ${this.lastName} <${this.email}>`
      .trim()
      .replace(/ {2,}/g, ' ');
  }

  generatePasswordResetToken () {
    this.passwordResetToken = crypto.randomUUID();
  }

  async sendPasswordResetEmail () {
    const { firstName } = this;
    const url = `${process.env.BASE_URL}/password/${this.passwordResetToken}`;
    return mailer.send({
      message: {
        to: this.fullNameAndEmail,
      },
      template: 'password-reset',
      locals: {
        firstName,
        url,
      },
    });
  }

  async setPassword (password) {
    this.hashedPassword = await bcrypt.hash(password, 10);
  }

  async comparePassword (password) {
    return bcrypt.compare(password, this.hashedPassword);
  }
}

export default User;
