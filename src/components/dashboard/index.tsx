'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { alpha, Box, Button, styled, SvgIcon, SvgIconProps } from '@mui/material';
import { OrganizationNode } from '@/types/organization';
import { DashboardProps } from './type';
import dynamic from 'next/dynamic';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';

const StaffInformation = dynamic(() => import('@/components/staffinformation'));
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
    ...theme.applyStyles('light', {
      color: theme.palette.grey[800],
    }),
    [`& .${treeItemClasses.groupTransition}`]: {
      marginLeft: 15,
      paddingLeft: 0,
      borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },

  };
});



const Dashboard: React.FC<DashboardProps> = ({ organizations, employees, staffData }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialOrganizationId = searchParams.get('organizationId');
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | null>(initialOrganizationId);
  const [breadcrumbPath, setBreadcrumbPath] = useState<{ path: string[], ids: string[] }>({ path: [], ids: [] });
  const [isTreeViewVisible, setIsTreeViewVisible] = useState(true);

  const searchAutoComplete = useMemo(() => getAllIdsWithUnits(organizations), [organizations]);

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
    const searchBy = searchParams.get('searchBy');
    const searchInput = searchParams.get('searchInput');

    const organizationId = searchBy === "organizationUnit" ? searchInput : initialOrganizationId;

    if (organizationId) {
      const result = findPathById(organizations, organizationId);
      setBreadcrumbPath(result || { path: [], ids: [] });
    } else {
      setBreadcrumbPath({ path: [], ids: [] });
    }
  }, [searchParams, initialOrganizationId, organizations]);

  const toggleTreeViewVisibility = () => {
    setIsTreeViewVisible(!isTreeViewVisible);
  };

  const search = (searchBy: string, searchInput: string) => {
    if (searchInput.trim() === '') {
      return;
    }
    router.push(`?searchBy=${searchBy}&searchInput=${searchInput}`);
  };

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

  const treeItems = useMemo(() => formatTreeItems(organizations), [organizations]);

  const getAllIds: any = (items: TreeItem[]) => {
    return items.flatMap(item => [
      item.id,
      ...(item.children ? getAllIds(item.children) : [])
    ]);
  };

  const [expandedItems, setExpandedItems] = useState<string[]>(() => getAllIds(treeItems));

  function CloseSquare(props: SvgIconProps) {
    return (
      <SvgIcon
        className="close"
        fontSize="inherit"
        style={{ width: 14, height: 14 }}
        {...props}
      >
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
      </SvgIcon>
    );
  }
  const MemoizedEmployeeTable = useMemo(() => <EmployeeTable dataEmployees={employees} breadcrumbPath={breadcrumbPath} />, [employees, breadcrumbPath]);
  const MemoizedTreeView = useMemo(() => (
    <RichTreeView
      items={treeItems}
      expandedItems={expandedItems}
      slots={{
        item: (props: any) => <CustomTreeItem {...props} id={props.itemId} />,
        endIcon: CloseSquare,
        expandIcon: AddBoxIcon,
        collapseIcon: IndeterminateCheckBoxIcon,
      }}
      slotProps={{
        item: { tree: treeItems } as any,
      }}
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
  ), [treeItems, expandedItems, clickHandler]);

  return (
    <main>
      <Button className="mt-5" onClick={toggleTreeViewVisibility}>
        {isTreeViewVisible ? "Hide Panel" : "Show"}
      </Button>
      <div className="flex flex-col md:flex-row w-full px-5 mb-5">
        {isTreeViewVisible && (
          <div className="border-2 rounded p-2 w-full md:w-1/4 mb-5 md:mb-0" style={{ maxHeight: 'calc(100vh - 125px)', overflowY: 'auto', scrollbarWidth: 'none' }}>
            <Box sx={{ minHeight: 270 }}>
              {MemoizedTreeView}
            </Box>
          </div>
        )}

        <div className={`w-full mx-3 p-3 border-2 rounded bg-white ${isTreeViewVisible ? 'md:w-3/4' : 'md:w-full'}`}>
          <Search search={search} organizationUnits={searchAutoComplete} />
          <div className="mx-3" style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
            {staffData ? <StaffInformation staffData={staffData} /> : MemoizedEmployeeTable}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
