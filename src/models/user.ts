import mongoose from "mongoose";
import bcrypt from 'bcrypt';

export interface IUser {
  id: string;
  email: string;
  phone: string;
  password: string;
  businessName: string;
  createdAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true, sparse: true },
		phone: { type: String, required: true, unique: true, sparse: true },
		password: { type: String, required: true },
		businessName: { type: String, required: true },
		isEmailVerified: { type: Boolean, default: false},
		isActive: { type: Boolean, default: true },
		lastLogin: { type: Date },
		createdAt: { type: Date, default: Date.now },
	},
	{
		timestamps: true,
		toJSON: {
			transform: (_, ret) => {
				delete ret.password;
				return ret;
			},
		},
	},
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;