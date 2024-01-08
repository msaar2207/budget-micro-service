import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: String,
  password: String,
  budgetLimit: Number,
});

UserSchema.pre(
  'save',
  async function (next: (err?: any) => void): Promise<void> {
    if (!this.isModified('password')) return next();

    try {
      const salt = await bcrypt.genSalt(10);
      this['password'] = await bcrypt.hash(this['password'], salt);
      next();
    } catch (err) {
      next(err);
    }
  },
);
