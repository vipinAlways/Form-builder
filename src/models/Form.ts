import { FormSchema } from "@/types/SchemaTypes";
import mongoose, { Schema } from "mongoose";

const formSchema = new Schema<FormSchema>({
  title: { type: String, required: true },
  headerImage: { type: String },
  theme:{
    bg:String,
    color:String
  },
  questions: [{ type: Schema.Types.ObjectId, ref: "questions" }],

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    require:true
  },

});

export const FormModel = mongoose.models.FormSchema || mongoose.model<FormSchema>("forms", formSchema);
