'use client'
import React from 'react';
import { SimpleTreeView } from '@mui/x-tree-view';
import { useEffect, useState } from 'react';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { styled, alpha } from '@mui/material/styles';
import { GetStaticProps } from 'next';

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

// Function to recursively sort the tree data by label
const sortTree = (data: any) => {
    if (!data) return null;
    data.sort((a: any, b: any) => a.label.localeCompare(b.label));
    data.forEach((node: any) => sortTree(node.children));
};

const Sidebar = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/departments')
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    return (
        <main>
            <div className='p-5'>
                <SimpleTreeView
                    aria-label="customized"
                    defaultExpandedItems={['1']}
                    sx={{ overflowX: 'hidden', minHeight: 270, flexGrow: 1, maxWidth: 500, width: 250 }}
                >
                    {/* Render data */}
                    {data.map((node: any) => (
                        <StyledTreeItem key={node.id} itemId={node.id} label={node.label}>
                            {node.children &&
                                node.children.map((child: any) => (
                                    <StyledTreeItem key={child.id} itemId={child.id} label={child.label} />
                                ))}
                        </StyledTreeItem>
                    ))}
                </SimpleTreeView>
            </div>
        </main>
    );
};

export default Sidebar;
