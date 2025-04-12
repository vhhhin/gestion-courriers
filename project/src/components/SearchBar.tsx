import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Search } from 'lucide-react';

type DocumentType = 'incoming' | 'outgoing' | 'decision';

const searchFields: Record<DocumentType, string[]> = {
  incoming: ['numéro', 'date', 'expéditeur', 'destinataire', 'objet'],
  outgoing: ['numéro', 'date', 'expéditeur', 'destinataire', 'objet', 'référence'],
  decision: ['numéro', 'date', 'objet'],
};

interface SearchBarProps {
  onSearch: (type: DocumentType, searchData: Record<string, string>) => void;
  language: 'fr' | 'ar';
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, language }) => {
  const [type, setType] = useState<DocumentType>('incoming');
  const [searchData, setSearchData] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(searchData).every(value => !value)) {
      setError(language === 'ar' ? 'يرجى إدخال معايير البحث' : 'Veuillez entrer des critères de recherche');
      return;
    }
    setError('');
    onSearch(type, searchData);
  };

  const getPlaceholder = (field: string) => {
    const translations = {
      'numéro': language === 'ar' ? 'رقم الوثيقة' : 'Numéro',
      'date': language === 'ar' ? 'التاريخ' : 'Date',
      'expéditeur': language === 'ar' ? 'المرسل' : 'Expéditeur',
      'destinataire': language === 'ar' ? 'المرسل إليه' : 'Destinataire',
      'objet': language === 'ar' ? 'الموضوع' : 'Objet',
      'référence': language === 'ar' ? 'المرجع' : 'Référence'
    };
    return translations[field as keyof typeof translations] || field;
  };

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
      <div className="flex items-center gap-2">
        {/* Type de document */}
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as DocumentType);
            setSearchData({});
          }}
          className="p-1.5 border rounded-md text-sm w-32 h-9"
        >
          <option value="incoming">{language === 'ar' ? 'وارد' : 'Courrier arrivée'}</option>
          <option value="outgoing">{language === 'ar' ? 'صادر' : 'Courrier départ'}</option>
          <option value="decision">{language === 'ar' ? 'قرار' : 'Décision'}</option>
        </select>

        {/* Champs de recherche */}
        {searchFields[type].map((field) => (
          <input
            key={field}
            type={field === 'date' ? 'date' : 'text'}
            name={field}
            placeholder={getPlaceholder(field)}
            value={searchData[field] || ''}
            onChange={handleChange}
            className="p-1.5 border rounded-md text-sm w-32 h-9"
          />
        ))}

        {/* Bouton de recherche */}
        <button
          type="submit"
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center gap-1 h-9"
        >
          <Search size={14} />
          {language === 'ar' ? 'بحث' : 'Rechercher'}
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="text-red-500 text-xs mt-1">
          {error}
        </div>
      )}
    </form>
  );
};