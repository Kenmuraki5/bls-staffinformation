'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { SimpleTreeView, TreeItem, treeItemClasses } from '@mui/x-tree-view';
import { styled, alpha } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { Box, CircularProgress, Button, Typography, Breadcrumbs, Link } from '@mui/material';
import { OrganizationNode } from '@/types/organization';
import { DashboardProps, StyledTreeItemProps } from './type';

const StyledTreeItem = styled(({ isselected, ...other }: StyledTreeItemProps & React.ComponentProps<typeof TreeItem>) => (
  <TreeItem {...other} />
))(({ theme, isselected }) => ({
  color: theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[200],
  backgroundColor: isselected ? alpha(theme.palette.primary.main, 0.1) : 'inherit',
  maxHeight: 'calc(100vh)',
  overflowY: 'auto',
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
      theme.palette.mode === 'light' ? alpha(theme.palette.primary.main, 0.25) : theme.palette.primary.dark,
    color: theme.palette.mode === 'dark' && theme.palette.primary.contrastText,
    padding: theme.spacing(0, 1.2),
    cursor: 'pointer',
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

const sortTree = (data: OrganizationNode[]): void => {
  if (!data) return;
  data.sort((a, b) => a.organizationUnit.localeCompare(b.organizationUnit));
  data.forEach((node) => sortTree(node.children || []));
};

const getAllIds = (data: OrganizationNode[]): string[] => {
  let ids: string[] = [];
  data.forEach((node) => {
    ids.push(node.organizationId);
    if (node.children) {
      ids = ids.concat(getAllIds(node.children));
    }
  });
  return ids;
};

const findPathById = (data: OrganizationNode[], id: string): { path: string[], ids: string[] } | null => {
  for (const node of data) {
    if (node.organizationId === id) return { path: [node.organizationUnit], ids: [node.organizationId] };
    if (node.children) {
      const result = findPathById(node.children, id);
      if (result) return { path: [node.organizationUnit, ...result.path], ids: [node.organizationId, ...result.ids] };
    }
  }
  return null;
};

const Search = dynamic(() => import('@/components/search'));
const EmployeeTable = dynamic(() => import('@/components/employeetable'), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <CircularProgress />
    </Box>
  ),
});

const Dashboard: React.FC<DashboardProps> = ({ organizations, employees }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialOrganizationId = searchParams.get('organizationId');
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | null>(initialOrganizationId);
  const [breadcrumbPath, setBreadcrumbPath] = useState<{ path: string[], ids: string[] }>({ path: [], ids: [] });
  const [isTreeViewVisible, setIsTreeViewVisible] = useState(true);

  const sortedData = organizations;
  sortTree(sortedData);
  const allIds = getAllIds(sortedData);

  const clickHandler = useCallback(
    (event: React.MouseEvent, orgId: string, haschildren: boolean): void => {
      event.stopPropagation();
      if (event.target instanceof Element) {
        const isIcon = !!(event.target as Element).closest(".MuiTreeItem-iconContainer");
        if (isIcon && haschildren) {
          return;
        }
      }
      setSelectedOrganizationId(orgId);
      const result = findPathById(organizations, orgId);
      setBreadcrumbPath(result || { path: [], ids: [] });
      router.push(`/?organizationId=${orgId}`);
    },
    [organizations, router]
  );

  useEffect(() => {
    if (initialOrganizationId) {
      const result = findPathById(organizations, initialOrganizationId);
      setBreadcrumbPath(result || { path: [], ids: [] });
    }
  }, [initialOrganizationId, organizations]);

  const toggleTreeViewVisibility = () => {
    setIsTreeViewVisible(!isTreeViewVisible);
  };

  const breadcrumbClickHandler = (id: string) => {
    console.log(id);
    router.push(`?organizationId=${id}`);
  };

  const search = (searchBy: string, searchInput: string) => {
    router.push(`?searchBy=${searchBy}&searchInput=${searchInput}`);
  };

  useEffect(() => {
    const searchBy = searchParams.get('searchBy');
    const searchInput = searchParams.get('searchInput');
    if (searchBy && searchInput) {
      const result = findPathById(organizations, employees[0]?.organizationId);
      setBreadcrumbPath(result || { path: [], ids: [] });
    }
  }, [searchParams, organizations, employees]);

  const renderTree = (nodes: OrganizationNode) => (
    <StyledTreeItem
      key={nodes.organizationId}
      itemId={nodes.organizationId}
      label={
        <Box onClick={(event) => clickHandler(event, nodes.organizationId, !!nodes.children)}>
          {nodes.organizationUnit}
        </Box>
      }
      onClick={(event) => clickHandler(event, nodes.organizationId, !!nodes.children)}
      isselected={nodes?.organizationId === selectedOrganizationId}
      haschildren={!!nodes.children}
    >
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </StyledTreeItem>
  );

  return (
    <main>
      <Button className='mt-5' onClick={toggleTreeViewVisibility}>
        {isTreeViewVisible ? "Hide" : "Show"}
      </Button>
      <div className='flex flex-row w-screen px-5 mb-5'>
        {isTreeViewVisible && (
        <div className='h-full border-2 rounded p-2' style={{ width: isTreeViewVisible ? '350px' : '0' }}>
          <SimpleTreeView
            defaultExpandedItems={allIds}
            aria-label="customized"
            sx={{ overflowX: 'scroll', minHeight: 270, flexGrow: 1, maxWidth: 500 }}
          >
            {sortedData.map((node) => renderTree(node))}
          </SimpleTreeView>

        </div>)}
        <div className='w-full mx-3 p-3 border-2 border rounded bg-white' style={{ width: isTreeViewVisible ? 'calc(100% - 370px)' : '100%' }}>
          <Search search={search} />
          <div className='m-3'>
            <Breadcrumbs separator="›" aria-label="breadcrumb" maxItems={4}>
              {breadcrumbPath.path.map((label, index) => (
                <Link
                  className='hover:text-blue-700'
                  style={{ cursor: 'pointer' }}
                  key={breadcrumbPath.ids[index]}
                  color="inherit"
                  onClick={() => breadcrumbClickHandler(breadcrumbPath.ids[index])}
                >
                  {label}
                </Link>
              ))}
            </Breadcrumbs>
            <EmployeeTable dataEmployees={employees} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
