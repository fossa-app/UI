import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface SearchProps<T> {
  data: T[];
  // eslint-disable-next-line no-unused-vars
  getOptionLabel: (option: T) => string;
}

const Search = <T,>({ data = [], getOptionLabel }: SearchProps<T>) => {
  return (
    <Autocomplete
      size="small"
      options={data}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => <TextField {...params} label="Search" />}
    />
  );
};

export default Search;
