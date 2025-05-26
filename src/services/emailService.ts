interface EmailParams {
  to: string;
  subject: string;
  body: string;
}

class EmailService {
  private static instance: EmailService;
  private apiKey: string = import.meta.env.VITE_EMAIL_API_KEY || '';

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async sendEmail({ to, subject, body }: EmailParams): Promise<boolean> {
    try {
      // Replace this with your actual email service implementation
      // Example using a hypothetical email API:
      const response = await fetch('https://api.emailservice.com/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          to,
          subject,
          html: body
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  public async sendAppointmentReminder(
    patientEmail: string,
    patientName: string,
    appointmentDate: string,
    appointmentTime: string,
    appointmentType: string
  ): Promise<boolean> {
    const subject = `Appointment Reminder: ${appointmentType} on ${appointmentDate}`;
    const body = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Appointment Reminder</h2>
        <p>Dear ${patientName},</p>
        <p>This is a reminder of your upcoming appointment:</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Date:</strong> ${appointmentDate}</p>
          <p><strong>Time:</strong> ${appointmentTime}</p>
          <p><strong>Type:</strong> ${appointmentType}</p>
        </div>
        <p>If you need to reschedule or cancel, please contact us at least 24 hours before your appointment.</p>
        <p>Best regards,<br>Your Clinic Team</p>
      </div>
    `;

    return this.sendEmail({ to: patientEmail, subject, body });
  }
}

export const emailService = EmailService.getInstance();
