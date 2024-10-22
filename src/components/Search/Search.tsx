import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { SearchContext } from 'shared/constants';
import { StyledTextField } from './StyledSearch';

interface SearchProps<T> {
  data: T[];
  context: SearchContext;
  // eslint-disable-next-line no-unused-vars
  getOptionLabel: (option: T) => string;
}

const Search = <T,>({ data, context, getOptionLabel }: SearchProps<T>) => {
  // TODO: add search icons and clear icon instead of arrow
  return (
    <Autocomplete
      size="small"
      options={data}
      noOptionsText={`No ${context} found`}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => <StyledTextField {...params} label={`Search ${context}`} />}
    />
  );
};

export default Search;
