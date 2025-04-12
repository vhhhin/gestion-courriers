const STORAGE_KEY = 'files';

export interface StoredFile {
  id: string;
  name: string;
  content: string; // Base64 encoded
  type: string;
  associatedId: string; // ID du courrier ou de la décision
}

export const fileService = {
  saveFile: async (file: File, associatedId: string): Promise<StoredFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const storedFile: StoredFile = {
            id: Date.now().toString(),
            name: file.name,
            content: content,
            type: file.type,
            associatedId
          };

          const files = fileService.getFiles();
          files.push(storedFile);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
          
          resolve(storedFile);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsDataURL(file);
    });
  },

  getFiles: (): StoredFile[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  getFilesByAssociatedId: (associatedId: string): StoredFile[] => {
    return fileService.getFiles().filter(f => f.associatedId === associatedId);
  }
};
