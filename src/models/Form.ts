import { FormSchema } from "@/types/SchemaTypes";
import mongoose, { Schema } from "mongoose";

const formSchema:Schema<FormSchema> = new Schema({
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
  submission:[{
     type: mongoose.Schema.Types.ObjectId,
    ref: "submissions",
    require:true
  }]
});

export const FormModel = mongoose.models.forms || mongoose.model<FormSchema>("forms", formSchema);
