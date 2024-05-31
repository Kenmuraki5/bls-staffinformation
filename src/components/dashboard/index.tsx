'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SimpleTreeView } from '@mui/x-tree-view';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { styled, alpha } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { CircularProgress } from '@mui/material';

interface OrganizationNode {
  organizationId: string;
  organizationUnit: string;
  domainId: string;
  children?: OrganizationNode[];
}

interface EmployeeNode {
  EmpID: string
  OrganizationID: string
  OrganizationUnit: string
  BranchID: string
  JobID: string
  ManagerID: string
  EnTitle: string
  EnFirstName: string
  EnLastName: string
  Nickname: string
  ThTitle: string
  ThFirstName: string
  ThLastName: string
  Email: string
  DerivativeTrader: string
  DerivativeLicense: string
  SingleTrader: string
  SingleLicense: string
  OtherLicense: string
  StartWorkingDate: string
  LastWorkingDate: string
  EffectiveDate: string
  CorporationTitle: string
  ExtensionCode: string
}
interface DashboardProps {
  organizations: OrganizationNode[];
  employees: EmployeeNode[];
}

interface StyledTreeItemProps {
  isSelected: boolean;
}

const StyledTreeItem = styled(({ isSelected, ...other }: StyledTreeItemProps & React.ComponentProps<typeof TreeItem>) => (
  <TreeItem {...other} />
))(({ theme, isSelected }) => ({
  color: theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[200],
  backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.1) : 'inherit',
  maxHeight: 'calc(100vh - 200px)',
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

// const getRootIds = (data: OrganizationNode[]): string[] => {
//   return data.map((node) => node.organizationId);
// };
const Search = dynamic(() => import('@/components/search'));
const EmployeeTable = dynamic(() => import('@/components/employeetable'),{
  ssr:false,
  loading: () => <CircularProgress/>
});

const Dashboard: React.FC<DashboardProps> = ({organizations, employees}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialOrganizationId = searchParams.get('organizationId');
  const initialDomainId = searchParams.get('domain');
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | null>(initialOrganizationId);
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(initialDomainId);

  useEffect(() => {
    if (initialOrganizationId && initialDomainId) {
      setSelectedOrganizationId(initialOrganizationId);
      setSelectedDomainId(initialDomainId);
    }
  }, [initialOrganizationId, initialDomainId]);

  const sortedData = organizations;
  sortTree(sortedData);

  const allIds = getAllIds(sortedData);

  const handleTreeItemClick = (event: React.MouseEvent, orgId: string, domainId: string) => {
    event.stopPropagation();
    setSelectedOrganizationId(orgId);
    router.replace(`?domain=${domainId}&organizationId=${orgId}`);
  };

  const renderTree = (nodes: OrganizationNode) => (
    <StyledTreeItem
      key={nodes.organizationId}
      itemId={nodes.organizationId}
      label={nodes.organizationUnit}
      isSelected={nodes.organizationId === selectedOrganizationId}
      onClick={(event) => handleTreeItemClick(event, nodes.organizationId, nodes.domainId)}
    >
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </StyledTreeItem>
  );

  return (
    <main>
      <div className='flex flex-row w-screen p-5'>
        <div className='h-full'>
          <SimpleTreeView
            defaultExpandedItems={allIds}
            aria-label="customized"
            sx={{ overflowX: 'hidden', minHeight: 270, flexGrow: 1, maxWidth: 500, width: 350 }}
          >
            {sortedData.map((node) => renderTree(node))}
          </SimpleTreeView>
        </div>
        <div className='w-full m-5 border-2 border rounded bg-white'>
          <Search />
          <div className='m-3'>
            <EmployeeTable dataEmployees={employees} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
