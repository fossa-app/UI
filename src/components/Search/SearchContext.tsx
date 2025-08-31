import * as React from 'react';
import { SearchPortalProps } from './SearchPortal';

interface SearchContextType {
  searchTerm: string;
  // TODO: find better solution
  searchTermChanged: boolean;
  portalProps: SearchPortalProps;
  setSearchTerm: (term: string) => void;
  setSearchTermChanged: (changed: boolean) => void;
  setPortalProps: (props: SearchPortalProps) => void;
}

const SearchContext = React.createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchTermChanged, setSearchTermChanged] = React.useState(false);
  const [portalProps, setPortalProps] = React.useState<SearchPortalProps>({});

  return (
    <SearchContext.Provider value={{ searchTerm, searchTermChanged, portalProps, setSearchTerm, setSearchTermChanged, setPortalProps }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = React.useContext(SearchContext);

  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }

  return context;
};
