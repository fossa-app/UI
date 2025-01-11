import * as React from 'react';

interface SearchContextType {
  search: string;
  // TODO: find better solution
  searchChanged: boolean;
  // TODO: add type for props
  props: Record<string, string>;
  setSearch: (search: string) => void;
  setSearchChanged: (changed: boolean) => void;
  setProps: (props: Record<string, string>) => void;
}

const SearchContext = React.createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [search, setSearch] = React.useState('');
  const [props, setProps] = React.useState({});
  const [searchChanged, setSearchChanged] = React.useState(false);

  return (
    <SearchContext.Provider value={{ search, searchChanged, props, setSearch, setSearchChanged, setProps }}>
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
