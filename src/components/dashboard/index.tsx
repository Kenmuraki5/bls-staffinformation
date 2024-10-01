'use client'
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { SimpleTreeView, TreeItem, treeItemClasses } from '@mui/x-tree-view';
import { styled, alpha } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { Box, Button } from '@mui/material';
import { OrganizationNode } from '@/types/organization';
import { DashboardProps, StyledTreeItemProps } from './type';

const StyledTreeItem = styled(({ isselected, ...other }: StyledTreeItemProps & React.ComponentProps<typeof TreeItem>) => (
  <TreeItem {...other} />
))(({ theme, isselected }) => ({
  color: theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[200],
  backgroundColor: isselected ? "primary" : 'inherit',
  maxHeight: 'calc(100vh)',
  overflowY: 'auto',
  overflowX: 'auto',
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    // padding: theme.spacing(0.5, 1),
    // margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: '0.8rem',
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: '50%',
   backgroundColor:
      theme. palette.mode === 'light' ? alpha(theme.palette.primary.main, 0.25) : theme.palette.primary.dark,
    color: theme.palette.mode === 'dark' && theme.palette.primary.contrastText,
    padding: theme.spacing(0, 1.2),
    cursor: 'pointer',
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    // marginLeft: 15,
    // borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 1)}`,
  },
}));

// const sortTree = (data: OrganizationNode[]): void => {
//   if (!data) return;
//   data.sort((a, b) => a.organizationUnit.localeCompare(b.organizationUnit));
//   data.forEach((node) => sortTree(node.children || []));
// };
const sortTree = (data: OrganizationNode[]): void => {
  if (!data) return;
  data
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

const getAllIdsWithUnits = (data: OrganizationNode[]): Array<{ organizationId: string, organizationUnit: string }> => {
  let result: Array<{ organizationId: string, organizationUnit: string }> = [];

  data.forEach((node) => {
    result.push({
      organizationId: node.organizationId,
      organizationUnit: node.organizationUnit,
    });

    // ถ้ามี children ก็ทำ recursive เรียกตัวเองเพื่อนำข้อมูล children เข้ามาด้วย
    if (node.children) {
      result = result.concat(getAllIdsWithUnits(node.children));
    }
  });

  return result;
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
const EmployeeTable = dynamic(() => import('@/components/employeetable'));

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
  const searchAutoComplete = getAllIdsWithUnits(sortedData);

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
      router.push(`?organizationId=${orgId}`);
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
        <Box
          onClick={(event) => clickHandler(event, nodes.organizationId, !!nodes.children)}
          sx={{
            fontWeight: nodes.children && nodes.children.length > 0 ? 'bold' : 'normal',
          }}
        >
          {nodes.organizationUnit}
        </Box>
      }
      onClick={(event) => clickHandler(event, nodes.organizationId, !!nodes.children)}
      isselected={nodes?.organizationId === selectedOrganizationId}
    >
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </StyledTreeItem>

  );

  return (
    <main>
      <Button className="mt-5" onClick={toggleTreeViewVisibility}>
        {isTreeViewVisible ? "Hide Panel" : "Show"}
      </Button>
      <div className="flex flex-col md:flex-row w-full px-5 mb-5">
        {isTreeViewVisible && (
          <div className="border-2 rounded p-2 w-full md:w-1/4 mb-5 md:mb-0">
            <SimpleTreeView
              defaultExpandedItems={allIds}
              aria-label="customized"
              className="min-h-[270px] flex-grow max-w-full md:max-w-[500px]"
            >
              {sortedData.map((node) => renderTree(node))}
            </SimpleTreeView>
          </div>
        )}
        <div className={`w-full mx-3 p-3 border-2 rounded bg-white ${isTreeViewVisible ? 'md:w-3/4' : 'md:w-full'}`}>
          <Search search={search} organizationUnits={searchAutoComplete}/>
          <div className="mx-3">
            <EmployeeTable dataEmployees={employees} breadcrumbPath={breadcrumbPath}/>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
