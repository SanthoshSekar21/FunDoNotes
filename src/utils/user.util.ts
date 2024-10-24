import nodemailer from 'nodemailer'
export const sendEmail = async ({ recipients, subject, message }) => {
     const transporter= nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS  
        }
    });
   
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipients,
        subject: subject,
        text: message
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error("Error sending email");
    }
};
