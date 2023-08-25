import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  userId: mongoose.Schema.Types.ObjectId;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
