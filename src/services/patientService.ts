interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string;
  lastVisit: string;
  upcomingAppointment?: string;
}

// In a real application, these would be API calls to your backend
export const patientService = {
  async getPatients(): Promise<Patient[]> {
    // Simulated API call
    const mockPatients: Patient[] = [
      {
        id: 1,
        name: "John Doe",
        phone: "1234567890",
        email: "john@example.com",
        lastVisit: "2025-05-20",
        upcomingAppointment: "2025-06-01"
      },
      // Add more mock patients as needed
    ];
    return Promise.resolve(mockPatients);
  },

  async createPatient(patient: Omit<Patient, 'id'>): Promise<Patient> {
    // Simulated API call
    const newPatient: Patient = {
      id: Math.floor(Math.random() * 1000),
      ...patient
    };
    return Promise.resolve(newPatient);
  },

  async updatePatient(id: number, data: Partial<Patient>): Promise<void> {
    // Simulated API call
    return Promise.resolve();
  },

  async deletePatient(id: number): Promise<void> {
    // Simulated API call
    return Promise.resolve();
  }
};
