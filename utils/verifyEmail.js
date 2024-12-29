import dotenv from "dotenv";
import { Resend } from "resend";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const verifyEmail = async (email) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "admin@tripathimayank.online",
      to: email,
      subject: "Verify your email",
      text: "Please verify your email by clicking on the link below",
    });

    if (error) {
      return console.log(error);
    }
    console.log({ data });

    return data;
  } catch (error) {
    return error;
  }
};

// export default verifyEmail;
