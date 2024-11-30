import * as React from 'react';

const PageContext = React.createContext({});

export const usePageContext = () => {
  const context = React.useContext(PageContext);

  if (!context) {
    throw new Error('usePageContext must be used within a Page component');
  }

  return context;
};

export default PageContext;
