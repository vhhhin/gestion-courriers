export type CourierType = "incoming" | "outgoing" | "decision";
export type CourierStatus = "pending" | "processing" | "completed" | "delayed";
export type CourierPriority = "normal" | "urgent";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee" | "manager";
}

export interface Courier {
  id: string;
  type: CourierType;
  number: string;
  date: Date;
  subject: string;
  sender?: string;
  recipient?: string;
  reference?: string;
  status: CourierStatus;
  priority: CourierPriority;
  attachments?: string[];
  notes?: string;
  history: {
    date: Date;
    action: string;
    user: string;
  }[];
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

export interface Decision {
  id: string;
  type: CourierType;
  number: string;
  date: Date;
  subject: string;
  reference: string;
  description: string;
  status: CourierStatus;
  priority: "normal" | "urgent";
  observation?: string;
  attachments?: {
    name: string;
    driveUrl: string;
  }[];
  qrCode: string;
  history: {
    date: Date;
    action: string;
    user: string;
  }[];
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

export interface FilterOptions {
  status: CourierStatus[];
  priority: CourierPriority[];
  type: CourierType[];
}

export interface CourierStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  delayed: number;
  urgent: number;
}

export interface DashboardStats {
  incoming: CourierStats;
  outgoing: CourierStats;
  decisions: CourierStats;
}
