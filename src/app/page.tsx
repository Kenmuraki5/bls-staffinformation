'use client'
import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import Image from 'next/image';

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  color:
    theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[200],

  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: '0.8rem',
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: '50%',
    backgroundColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.primary.main, 0.25)
        : theme.palette.primary.dark,
    color: theme.palette.mode === 'dark' && theme.palette.primary.contrastText,
    padding: theme.spacing(0, 1.2),
  },
}));

// Mock data JSON representing the tree hierarchy
const mockData = [
  {
    id: '1',
    label: 'BlS',
    children: [
      {
        id: '2',
        label: 'Hello',
      },
      {
        id: '3',
        label: 'Subtree with children',
        children: [
          {
            id: '6',
            label: 'Hello',
          },
          {
            id: '7',
            label: 'Sub-subtree with children',
            children: [
              {
                id: '9',
                label: 'Child 1',
              },
              {
                id: '10',
                label: 'Child 2',
              },
              {
                id: '11',
                label: 'Child 3',
              },
            ],
          },
          {
            id: '8',
            label: 'Hello',
          },
        ],
      },
      {
        id: '4',
        label: 'World',
      },
      {
        id: '5',
        label: 'Something something',
      },
    ],
  },
  {
    id: '3000',
    label: 'BCAP'
  }
];

// Function to recursively sort the tree data by label
const sortTree = (data:any) => {
  if (!data) return null;
  data.sort((a: any, b: any) => a.label.localeCompare(b.label));
  data.forEach((node: any) => sortTree(node.children));
};

const Home = () => {
  const sortedData = [...mockData];
  sortTree(sortedData);

  return (
    <main className="min-h-screen justify-between bg-white">
      <section id="header">
        <div className="bg-rose-500 p-2"></div>
      </section>

      <section id="logo">
        <div className="flex content-center">
          <div>
            <Image src="/bls-header-logo.png" alt="" width={300} height={300}></Image>
          </div>
          <div>
            <p className="p-5 font-bold text-3xl text-rose-600">StaffInformation</p>
          </div>
        </div>
      </section>

      <hr></hr>
      {/* side bar Department */}
      <section id='sidebar'>
        <div className='p-5'>
          <SimpleTreeView
            aria-label="customized"
            defaultExpandedItems={['1']}
            sx={{ overflowX: 'hidden', minHeight: 270, flexGrow: 1, maxWidth: 300 }}
          >
            <StyledTreeItem itemId="0" label="Home"></StyledTreeItem>
            <StyledTreeItem itemId="20" label="Search Information"></StyledTreeItem>
            {sortedData.map((node) => (
              <StyledTreeItem key={node.id} itemId={node.id} label={node.label}>
                {node.children && node.children.map((child) => (
                  <StyledTreeItem key={child.id} itemId={child.id} label={child.label} />
                ))}
              </StyledTreeItem>
            ))}
          </SimpleTreeView>
        </div>
      </section>
    </main>
  );
};

export default Home;
