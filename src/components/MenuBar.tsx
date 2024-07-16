import React, { useState, useEffect } from 'react';
import { Box, Stack, ToggleButtonGroup, ToggleButton } from '@mui/material';
import useUserHistory from '~/hooks/useUserHistory';
import type { Dispatch, SetStateAction } from 'react';

type MenuBarProps = {
  menuData: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
};

const MenuBar = ({ menuData = [], onChange }: MenuBarProps) => {
  const { getMenuHistory, setMenuHistory } = useUserHistory();
  const [menus, setMenus] = useState(getMenuHistory()); // default ['api', 'create']

  useEffect(() => {
    onChange(menus ?? []);
  }, [menus]);

  const onChangeMenu = (
    e: React.MouseEvent<HTMLElement>,
    newMenus: string[]
  ) => {
    setMenuHistory(newMenus.join(','));
    setMenus(newMenus);
  };

  return (
    menuData.length > 1 && (
      <Box className="menu-bar">
        <ToggleButtonGroup
          color="primary"
          value={menus}
          onChange={onChangeMenu}
        >
          {menuData.map((data) => (
            <ToggleButton key={data} value={data}>
              {data}
              <Stack component="span">
                {Array(menus?.length)
                  .fill(0)
                  .map((_, index) => (
                    <Box
                      key={index}
                      component="span"
                      className={menus?.indexOf(data) === index ? 'active' : ''}
                    >
                      {index + 1}
                    </Box>
                  ))}
              </Stack>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    )
  );
};

export default MenuBar;
