import { Link } from 'react-router-dom';
import { Button, Group } from '@mantine/core';

export const Router = () => {
  const pages = [
    {
      path: '/graph',
      name: 'Graph View',
      color: 'teal',
    },
    {
      path: '/images',
      name: 'Image Data View',
      color: 'blue',
    },
    {
      path: '/clusters',
      name: 'Clusters View',
      color: 'red',
    },
    {
      path: '/network',
      name: 'Network View',
      color: 'orange',
    },
  ];

  return (
    <Group justify="center" className="mt-8">
      {pages.map((page) => (
        <Link to={page.path} key={page.path}>
          <Button variant="light" color={page.color} size="lg" radius="md">
            {page.name}
          </Button>
        </Link>
      ))}
    </Group>
  );
};
