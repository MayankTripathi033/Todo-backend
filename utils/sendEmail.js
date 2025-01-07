import dotenv from "dotenv";
import { Resend } from "resend";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendCustomEmailTodo = async (email, subject, Todo) => {
  try {
    console.log("Todo", Todo, email, subject);

    const { data, error } = await resend.emails.send({
      from: "admin@tripathimayank.online",
      to: email,
      subject: subject,
      html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Todo Notification</title><style>body{font-family:Arial,sans-serif;background-color:#f9f9f9;margin:0;padding:0}.email-container{max-width:600px;margin:20px auto;background-color:#ffffff;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden}.email-header{background-color:#007bff;color:#ffffff;text-align:center;padding:20px;display:flex;justify-content:center;align-items:center;position:relative}.email-header img{border-radius:50%;width:50px;height:50px;margin-right:15px}.email-body{padding:20px;color:#333333;line-height:1.6}.todo-highlight{font-weight:bold;color:#007bff}.email-footer{text-align:center;padding:15px;font-size:12px;color:#777777;background-color:#f4f4f4}</style></head><body><div class="email-container"><div class="email-header"><img src="${Todo.avatar}" alt="Avatar"/><h1>${Todo.headline}</h1></div><div class="email-body"><p>${Todo.description}</p><p class="todo-highlight">"${Todo.message}"</p><p>Remember to stay on top of your tasks. You can always view or update this Todo in your account.</p><p>Best regards,<br>Your Todo App Team</p></div><div class="email-footer">&copy; 2024 Todo App. All rights reserved.</div></div></body></html>`,
      scheduledAt: Todo.scheduledAt,
    });
    console.log("dataaa", data);
    if (error) {
      console.log("error", error);
      return error;
    }
    return data;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};
