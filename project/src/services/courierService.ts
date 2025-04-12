import { Courier } from "../types/courier";

const STORAGE_KEY = "couriers";
const FILES_STORAGE_KEY = "courier_files";

interface StoredFile {
  id: string;
  courierId: string;
  name: string;
  data: string; // Base64
  type: string;
}

export const courierService = {
  getAll: (): Courier[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved
        ? JSON.parse(saved).map((courier) => ({
            ...courier,
            history: courier.history || [],
            attachments: courier.attachments || [],
          }))
        : [];
    } catch (error) {
      console.error("Erreur lors de la récupération des courriers:", error);
      return [];
    }
  },

  getNextNumber: (type: "incoming" | "outgoing"): string => {
    const couriers = courierService.getAll();
    const typeCouriers = couriers.filter((c) => c.type === type);
    const maxNumber = Math.max(
      ...typeCouriers.map((c) => parseInt(c.number) || 0),
      0
    );
    return (maxNumber + 1).toString();
  },

  add: async (courier: Courier) => {
    try {
      const couriers = courierService.getAll();
      couriers.push(courier);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(couriers));
      return courier;
    } catch (error) {
      console.error("Erreur lors de l'ajout du courrier:", error);
      throw error;
    }
  },

  update: async (courier: Courier): Promise<Courier> => {
    try {
      const couriers = courierService.getAll();
      const index = couriers.findIndex((c) => c.id === courier.id);

      if (index === -1) {
        throw new Error("Courrier non trouvé");
      }

      couriers[index] = {
        ...courier,
        history: [
          ...courier.history,
          {
            date: new Date(),
            action: "updated",
            user: "current-user",
          },
        ],
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(couriers));
      return courier;
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      throw error;
    }
  },

  getIncoming: () => {
    return courierService.getAll().filter((c) => c.type === "incoming");
  },

  getOutgoing: () => {
    return courierService.getAll().filter((c) => c.type === "outgoing");
  },

  deleteById: (id: string) => {
    try {
      const couriers = courierService.getAll();
      const filteredCouriers = couriers.filter((c) => c.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCouriers));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      throw new Error("Impossible de supprimer le courrier");
    }
  },

  saveFile: async (courierId: string, file: File): Promise<StoredFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const fileData = e.target?.result as string;
          const storedFile: StoredFile = {
            id: Date.now().toString(),
            courierId,
            name: file.name,
            data: fileData,
            type: file.type,
          };

          const files = courierService.getFiles();
          files.push(storedFile);
          localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(files));
          resolve(storedFile);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsDataURL(file);
    });
  },

  getFiles: (courierId?: string): StoredFile[] => {
    try {
      const files = JSON.parse(localStorage.getItem(FILES_STORAGE_KEY) || "[]");
      return courierId
        ? files.filter((f: StoredFile) => f.courierId === courierId)
        : files;
    } catch {
      return [];
    }
  },
};
