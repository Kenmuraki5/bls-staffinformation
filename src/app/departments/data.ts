export const mockData = [
    {
        domain_id : '1',
        org_id: '1',
        label: 'BlS',
        children: [
            {
                domain_id : '1',
                org_id: '2',
                label: 'Hello',
            },
            {
                domain_id : '1',
                org_id: '3',
                label: 'Subtree with children',
                children: [
                    {
                        domain_id : '1',
                        org_id: '6',
                        label: 'Hello',
                    },
                    {
                        domain_id : '1',
                        org_id: '7',
                        label: 'Sub-subtree with children',
                        children: [
                            {
                                domain_id : '1',
                                org_id: '9',
                                label: 'Child 1',
                            },
                            {
                                domain_id : '1',
                                org_id: '10',
                                label: 'Child 2',
                            },
                            {
                                domain_id : '1',
                                org_id: '11',
                                label: 'Child 3',
                            },
                        ],
                    },
                    {
                        domain_id : '1',
                        org_id: '8',
                        label: 'Hello',
                    },
                ],
            },
            {
                domain_id : '1',
                org_id: '4',
                label: 'World',
            },
            {
                domain_id : '1',
                org_id: '5',
                label: 'Something something',
            },
        ],
    },
    {
        domain_id : '2',
        org_id: '3000',
        label: 'BCAP'
    }
];
