import { Appointment } from '@/types/appointment';

// In a real application, these would be API calls to your backend
export const appointmentService = {
  async getAppointments(): Promise<Appointment[]> {
    // Simulated API call
    const mockAppointments: Appointment[] = [
      {
        id: 1,
        time: "09:00",
        patient: "John Doe",
        type: "Check-up",
        status: "confirmed",
        phone: "1234567890",
        notes: "Regular check-up"
      },
      // Add more mock appointments as needed
    ];
    return Promise.resolve(mockAppointments);
  },

  async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
    // Simulated API call
    const newAppointment: Appointment = {
      id: Math.floor(Math.random() * 1000),
      ...appointment
    };
    return Promise.resolve(newAppointment);
  },

  async updateAppointmentStatus(id: number, status: string): Promise<void> {
    // Simulated API call
    return Promise.resolve();
  },

  async deleteAppointment(id: number): Promise<void> {
    // Simulated API call
    return Promise.resolve();
  }
};
