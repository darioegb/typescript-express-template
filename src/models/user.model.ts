import { Schema, Document, model } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

import { User } from '@interfaces';
import { Roles } from '@enums';

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      get: (): undefined => undefined,
    },
    role: {
      type: String,
      default: 'USER',
      enum: Object.values(Roles),
    },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      getters: true,
      transform: function (_doc, ret) {
        delete ret._id;
      },
    },
  },
);

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.plugin(mongooseUniqueValidator, {
  message: '{PATH} must be unique',
});

export const userModel = model<User & Document>('User', userSchema);
