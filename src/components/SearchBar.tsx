import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { debounce } from '~/utils';
import type { ChangeEvent, KeyboardEvent } from 'react';

type ApiSearchBarProps = {
  autoSearch?: boolean;
  searchKeyCode?: string;
  onKeyDown?: (str: string) => void;
  onSearch?: (str: string) => void;
};

const methods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'];

const SearchBar = ({
  autoSearch = false,
  searchKeyCode = 'Enter',
  onKeyDown,
  onSearch,
}: ApiSearchBarProps) => {
  const [searchMethod, setSearchMethod] = useState<string[]>();
  const [searchText, setSearchText] = useState('');
  const [searchParam, setSearchParam] = useSearchParams();

  useEffect(() => {
    const keyword = searchParam.get('search') ?? '';
    const filter = (
      !!searchParam.get('methods')
        ? searchParam.get('methods')?.split(',')
        : ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    ) as string[];

    searchParam.set('methods', filter.join(','));
    setSearchParam(searchParam);

    setSearchText(keyword);
    setSearchMethod(filter);

    onSearch && onSearch(keyword);
  }, []);

  const onChangeMethods = (
    e: React.MouseEvent<HTMLElement>,
    newMethods: string[]
  ) => {
    searchParam.set('methods', newMethods.join(','));
    setSearchParam(searchParam);
    setSearchMethod(newMethods);
  };

  const onKeyDownSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === searchKeyCode) {
      const value = (e.target as HTMLInputElement).value;

      searchParam.set('search', value);
      setSearchParam(searchParam);

      onKeyDown && onKeyDown(value);
    }
  };

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;

    setSearchText(value);
    autoSearch && onDebounceSearch(value);
  };

  const onDebounceSearch = useCallback(
    debounce((value) => {
      searchParam.set('search', value);
      setSearchParam(searchParam);

      onSearch && onSearch(value);
    }, 500),
    []
  );

  const onClearSearch = () => {
    setSearchText('');
    searchParam.set('search', '');
    setSearchParam(searchParam);

    onKeyDown && onKeyDown('');
    onDebounceSearch('');
  };

  return (
    <FormControl className="search-bar" variant="outlined" size="small">
      <Stack>
        <ToggleButtonGroup
          value={searchMethod}
          onChange={onChangeMethods}
          size="small"
        >
          {methods.map((method) => (
            <ToggleButton key={method} value={method}>
              {method}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <OutlinedInput
          type="text"
          value={searchText}
          placeholder="path & description"
          onKeyDown={onKeyDownSearch}
          onChange={onChangeSearch}
          endAdornment={
            searchText && (
              <InputAdornment position="end">
                <CancelIcon fontSize="small" onClick={onClearSearch} />
              </InputAdornment>
            )
          }
        />
      </Stack>
    </FormControl>
  );
};

export default SearchBar;
