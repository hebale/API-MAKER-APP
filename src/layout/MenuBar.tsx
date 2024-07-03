import React, { useState, useEffect } from 'react';
import { Box, Stack, ToggleButtonGroup, ToggleButton } from '@mui/material';

type MenuBarProps = {
  datas: string[];
  onChange: (menus: string[]) => void;
};

const MenuBar = ({ datas = [], onChange }: MenuBarProps) => {
  const [menus, setMenus] = useState(datas);

  useEffect(() => {
    onChange(menus);
  }, [menus]);

  const onChangeMenu = (
    e: React.MouseEvent<HTMLElement>,
    newMenus: string[]
  ) => {
    setMenus(newMenus);
  };

  return (
    datas.length > 1 && (
      <Box className="menubar-box">
        <ToggleButtonGroup
          color="primary"
          value={menus}
          onChange={onChangeMenu}
        >
          {datas.map((data) => (
            <ToggleButton key={data} value={data}>
              {data}
              <Stack component="span">
                {Array(datas.length)
                  .fill(0)
                  .map((_, index) => (
                    <Box
                      key={index}
                      component="span"
                      className={menus.indexOf(data) === index ? 'active' : ''}
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
