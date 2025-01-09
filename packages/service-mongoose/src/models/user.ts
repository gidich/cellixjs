import { Schema, model, Model, connect } from 'mongoose';
interface User {
    name: string;
    email: string;
    avatar?: string;
  }
  
  // 2. Create a Schema corresponding to the document interface.
export const UserModel = model<User>('User', new Schema<User, Model<User>, User>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        avatar: String
    },
    {
        timestamps: true, 
        versionKey: 'version',
      }
));