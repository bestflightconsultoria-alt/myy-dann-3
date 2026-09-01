export interface Doctor {
  id: string;
  name: string;
  crm: string;
  specialties?: string[];
  bio?: string;
  city: string;
  state: string;
  isOnline: boolean;
  contactPhone: string;
  appointmentUrl: string;
  whatsappMessage?: string;
  clickCount?: number;
}
