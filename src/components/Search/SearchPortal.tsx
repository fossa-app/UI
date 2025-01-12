import * as React from 'react';
import ReactDOM from 'react-dom';
import { useLocation } from 'react-router-dom';
import { TextFieldProps } from '@mui/material/TextField';
import { SEARCH_PORTAL_ID } from 'shared/constants';
import { useDebounce } from 'shared/hooks';
import { useSearch } from './SearchContext';
import { StyledTextField } from './StyledTextField';

export type SearchPortalProps = { testSelector?: string } & TextFieldProps;

const SearchPortal: React.FC<SearchPortalProps> = (searchPortalProps) => {
  const { search, props, setSearch, setSearchChanged, setProps } = useSearch();
  const location = useLocation();
  const debouncedSearch = useDebounce(search);
  const searchContainer = document.getElementById(SEARCH_PORTAL_ID);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearch(event.target.value);
  };

  React.useEffect(() => {
    setSearchChanged(true);
  }, [debouncedSearch, setSearchChanged]);

  React.useEffect(() => {
    setSearch('');
    setSearchChanged(false);
    setProps({});
  }, [location, setSearch, setSearchChanged, setProps]);

  if (!searchContainer || !Object.keys(props).length) {
    return null;
  }

  return ReactDOM.createPortal(
    <StyledTextField
      variant="filled"
      label={props.label}
      data-cy={props.testSelector}
      value={search}
      onChange={handleChange}
      {...searchPortalProps}
    />,
    searchContainer
  );
};

export default SearchPortal;
