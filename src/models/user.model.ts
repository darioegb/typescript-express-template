import { Schema, Document, model }  from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

import { User } from '../interfaces/user.interface';
import { Roles } from '../enums';

const userSchema = new Schema({
    firstName: { type: String, required: true, minlength: 3, maxlength: 30 },
    lastName: { type: String, required: true, minlength: 3, maxlength: 30  },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'USER_ROLE', enum: Object.values(Roles) }
});

userSchema.plugin(mongooseUniqueValidator, { message: '{PATH} must be unique' });

export const userModel = model<User & Document>('User', userSchema);
