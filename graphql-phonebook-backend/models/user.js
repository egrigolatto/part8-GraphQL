import { Schema, model } from "mongoose";

const schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "Person",
    },
  ],
});

export default model("User", schema);
