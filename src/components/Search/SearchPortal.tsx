import React from 'react';
import ReactDOM from 'react-dom';
import { useLocation } from 'react-router-dom';
import { TextFieldProps } from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import { SEARCH_PORTAL_ID } from 'shared/constants';
import { useDebounce } from 'shared/hooks';
import { useSearch } from './SearchContext';
import { StyledSearchPortal } from './StyledSearchPortal';

export type SearchPortalProps = { testSelector?: string } & TextFieldProps;

const SearchPortal: React.FC<SearchPortalProps> = (searchPortalProps) => {
  const { searchTerm, portalProps, setSearchTerm, setSearchTermChanged, setPortalProps } = useSearch();
  const location = useLocation();
  const debouncedSearch = useDebounce(searchTerm);
  const searchContainer = document.getElementById(SEARCH_PORTAL_ID);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const searchPhrase = event.target.value;

    setSearchTerm(searchPhrase);

    if (!searchPhrase) {
      setSearchTermChanged(true);
    }
  };

  const handleClear = () => {
    if (searchTerm) {
      setSearchTermChanged(true);
    }

    setSearchTerm('');
  };

  React.useEffect(() => {
    if (searchTerm && debouncedSearch && searchTerm === debouncedSearch) {
      setSearchTermChanged(true);
    }
  }, [searchTerm, debouncedSearch, setSearchTermChanged]);

  React.useEffect(() => {
    const resetSearch = () => {
      setSearchTerm('');
      setSearchTermChanged(false);
      setPortalProps({});
    };

    resetSearch();

    return resetSearch;
  }, [location.pathname, setSearchTerm, setSearchTermChanged, setPortalProps]);

  if (!searchContainer || !Object.keys(portalProps).length) {
    return null;
  }

  return ReactDOM.createPortal(
    <StyledSearchPortal
      variant="filled"
      label={portalProps.label}
      data-cy={portalProps.testSelector}
      value={searchTerm}
      onChange={handleChange}
      slotProps={{
        input: {
          endAdornment: (
            <IconButton
              aria-label="Clear Search"
              data-cy={`${portalProps.testSelector}-clear`}
              size="small"
              sx={{
                color: (theme) => theme.palette.primary.contrastText,
              }}
              onClick={handleClear}
            >
              <ClearIcon />
            </IconButton>
          ),
        },
      }}
      {...searchPortalProps}
    />,
    searchContainer
  );
};

export default SearchPortal;
