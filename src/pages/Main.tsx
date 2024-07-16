import { useState } from 'react';
import { Container, Typography } from '@mui/material';
import Header from '~/layout/Header';
import Contents from '~/layout/Contents';
import MenuBar from '../components/MenuBar';
import ApiBox from '~/components/ApiBox';
import CreateBox from '~/components/CreateBox';
import LogBox from '~/components/LogBox';
import PipelineBox from '~/components/PipelineBox';
import type { ReactElement } from 'react';

const itemsConfig: { key: string; component: ReactElement }[] = [
  { key: 'api', component: <ApiBox /> },
  { key: 'create', component: <CreateBox /> },
  { key: 'pipeline', component: <PipelineBox /> },
  { key: 'log', component: <LogBox /> },
];

const Main = () => {
  const [menus, setMenus] = useState<string[]>([]);

  return (
    <Container className="container" maxWidth={false}>
      <Header>
        <Typography>
          {`http://${process.env.HOST}:${process.env.PORT}`}
        </Typography>
        <MenuBar
          menuData={itemsConfig.map((menu) => menu.key)}
          onChange={setMenus}
        />
      </Header>
      <Contents
        items={menus.map(
          (menu) =>
            itemsConfig.filter((item) => {
              return item.key === menu;
            })[0]
        )}
      />
    </Container>
  );
};

export default Main;
