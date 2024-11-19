'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { alpha, Box, Button, styled } from '@mui/material';
import { OrganizationNode } from '@/types/organization';
import { DashboardProps } from './type';
import dynamic from 'next/dynamic';

const Search = dynamic(() => import('@/components/search'));
const EmployeeTable = dynamic(() => import('@/components/employeetable'));

const getAllIdsWithUnits = (data: OrganizationNode[]): Array<{ organizationId: string, organizationUnit: string }> => {
  let result: Array<{ organizationId: string, organizationUnit: string }> = [];

  data.forEach((node) => {
    result.push({
      organizationId: node.organizationId,
      organizationUnit: node.organizationUnit,
    });

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

const CustomTreeItem = styled(TreeItem)(({ theme, tree, id }: any) => {
  const findNode: any = (items: any[], nodeId: string) => {
    for (const item of items) {
      if (item.id === nodeId) {
        return item;
      }
      if (item.children && item.children.length > 0) {
        const foundNode = findNode(item.children, nodeId);
        if (foundNode) {
          return foundNode;
        }
      }
    }
    return null;
  };


  const node = findNode(tree, id);
  const isLevel1 = node ? node.level === true : false;

  return {
    color: theme.palette.grey[200],
    [`& .${treeItemClasses.content}`]: {
      borderRadius: theme.spacing(0.5),
      padding: theme.spacing(0.5, 1),
      margin: theme.spacing(0.2, 0),
      [`& .${treeItemClasses.label}`]: {
        fontSize: '0.8rem',
        fontWeight: isLevel1 ? 'bold' : 500,
      },
    },
    [`& .${treeItemClasses.iconContainer}`]: {
      borderRadius: '50%',
      backgroundColor: theme.palette.primary.dark,
      padding: theme.spacing(0, 1.2),
      ...theme.applyStyles('light', {
        backgroundColor: alpha(theme.palette.primary.main, 0.25),
      }),
      ...theme.applyStyles('dark', {
        color: theme.palette.primary.contrastText,
      }),
    },
    ...theme.applyStyles('light', {
      color: theme.palette.grey[800],
    }),
  };
});



const Dashboard: React.FC<DashboardProps> = ({ organizations, employees }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialOrganizationId = searchParams.get('organizationId');
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | null>(initialOrganizationId);
  const [breadcrumbPath, setBreadcrumbPath] = useState<{ path: string[], ids: string[] }>({ path: [], ids: [] });
  const [isTreeViewVisible, setIsTreeViewVisible] = useState(true);

  const searchAutoComplete = getAllIdsWithUnits(organizations);

  const clickHandler = useCallback(
    (orgId: string): void => {
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

    if (searchBy === "organizationUnit" && searchInput) {
      const organizationId = employees[0]?.organizationId;

      if (organizationId) {
        const result = findPathById(organizations, organizationId);
        setBreadcrumbPath(result || { path: [], ids: [] });
      }
    }
  }, [searchParams, organizations, employees]);

  interface TreeItem {
    id: string;
    label: string;
    children: TreeItem[];
  }

  const formatTreeItems = (nodes: OrganizationNode[]): TreeItem[] => {
    return nodes.map(node => ({
      id: node.organizationId,
      label: node.organizationUnit,
      children: node.children ? formatTreeItems(node.children) : [],
      level: (node.level == 0) || (node.level == 1) || !!node?.children?.length, // ตรวจสอบว่า node นี้มีลูก
    }));
  };

  const treeItems = formatTreeItems(organizations);

  const getAllIds: any = (items: TreeItem[]) => {
    return items.flatMap(item => [
      item.id,
      ...(item.children ? getAllIds(item.children) : [])
    ]);
  };

  const [expandedItems, setExpandedItems] = useState<string[]>(() => getAllIds(treeItems));

  return (
    <main>
      <Button className="mt-5" onClick={toggleTreeViewVisibility}>
        {isTreeViewVisible ? "Hide Panel" : "Show"}
      </Button>
      <div className="flex flex-col md:flex-row w-full px-5 mb-5">
        {isTreeViewVisible && (
          <div className="border-2 rounded p-2 w-full md:w-1/4 mb-5 md:mb-0" style={{ maxHeight: 'calc(100vh - 125px)', overflowY: 'auto', scrollbarWidth: 'none' }}>
            <Box sx={{ minHeight: 270 }}>
              <RichTreeView
                items={treeItems}
                expandedItems={expandedItems}
                slots={{ item: (props: any) => <CustomTreeItem {...props} id={props.itemId} /> }}
                slotProps={{ item: { tree: treeItems } as any }}
                onItemSelectionToggle={(event, itemId: any) => clickHandler(itemId)}
                onItemExpansionToggle={(event: any, itemId) => {
                  if (event.target.closest(`.${treeItemClasses.iconContainer}`)) {
                    setExpandedItems(prev =>
                      prev.includes(itemId)
                        ? prev.filter(id => id !== itemId)
                        : [...prev, itemId]
                    );
                  }
                }}
              />
            </Box>
          </div>
        )}

        <div className={`w-full mx-3 p-3 border-2 rounded bg-white ${isTreeViewVisible ? 'md:w-3/4' : 'md:w-full'}`}>
          <Search search={search} organizationUnits={searchAutoComplete} />
          <div className="mx-3">
            <EmployeeTable dataEmployees={employees} breadcrumbPath={breadcrumbPath} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
