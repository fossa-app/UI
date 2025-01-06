import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { SearchContext } from 'shared/constants';
import { StyledTextField } from './StyledSearch';

interface SearchProps<T> {
  data: T[];
  context: SearchContext;
  getOptionLabel: (option: T) => string;
}

const Search = <T,>({ data, context, getOptionLabel }: SearchProps<T>) => {
  return (
    <Autocomplete
      size="small"
      options={data}
      // TODO: fix noOptionsText
      noOptionsText={`No ${context} found`}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => (
        <StyledTextField
          {...params}
          label={`Search ${context}`}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  );
};

export default Search;
