import { useState } from 'react';
import { Container, Typography } from '@mui/material';
import MenuBar from './MenuBar';
import Contents from '~/layout/Contents';
import ApiBox from '~/components/ApiBox';
import CreateBox from '~/components/CreateBox';
import LogBox from '~/components/LogBox';
import PipelineBox from '~/components/PipelineBox';

const itemsConfig = [
  { key: 'api', component: <ApiBox /> },
  { key: 'create', component: <CreateBox /> },
  { key: 'log', component: <LogBox /> },
  // { key: 'pipeline', component: <PipelineBox /> },
];

const Main = () => {
  const [menus, setMenus] = useState(['api']);

  return (
    <Container className="container" maxWidth={false}>
      <Typography>
        {`http://${process.env.HOST}:${process.env.PORT}`}
      </Typography>
      <Contents
        ribbon={
          <MenuBar
            datas={itemsConfig.map((menu) => menu.key)}
            onChange={setMenus}
          />
        }
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
