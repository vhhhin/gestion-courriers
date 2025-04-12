import type { CourierType, CourierStatus, CourierPriority } from '../types/courier';

export interface Decision {
  id: string;
  type: CourierType;
  number: string;
  date: Date;
  subject: string;
  reference: string;
  description: string;
  status: CourierStatus;
  priority: CourierPriority;
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

const STORAGE_KEY = 'decisions';

const decisionService = {
  getAll: (): Decision[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des décisions:', error);
      return [];
    }
  },

  getNextNumber: (): string => {
    const decisions = decisionService.getAll();
    const maxNumber = Math.max(...decisions.map(d => parseInt(d.number) || 0), 0);
    return (maxNumber + 1).toString();
  },

  save: (decision: Omit<Decision, 'id'>) => {
    try {
      const nextNumber = decisionService.getNextNumber();
      const newDecision = {
        ...decision,
        id: Date.now().toString(),
        number: nextNumber,
        date: new Date(),
        type: 'decision' as CourierType,
        reference: `${nextNumber}/${new Date().getFullYear()}`,
        description: decision.description || '',
        priority: decision.priority || 'normal',
        qrCode: '',
        history: [{
          date: new Date(),
          action: 'created',
          user: 'current-user'
        }],
        createdBy: 'current-user',
        createdAt: new Date(),
        updatedBy: 'current-user',
        updatedAt: new Date()
      } as Decision;
      
      const decisions = decisionService.getAll();
      decisions.push(newDecision);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
      return newDecision;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw new Error("Impossible d'enregistrer la décision");
    }
  },

  deleteById: (id: string) => {
    const decisions = decisionService.getAll().filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
  }
};

export default decisionService;
