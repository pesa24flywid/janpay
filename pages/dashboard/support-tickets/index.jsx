import React, { useState, useEffect, useMemo } from 'react'
import {
    Box,
    Stack,
    Text,
    Button,
} from '@chakra-ui/react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import DashboardWrapper from '../../../hocs/DashboardLayout';

const SupportTickets = () => {
    const [rowData, setRowData] = useState([])
    const [columnDefs, setColumnDefs] = useState([
        {
            field: "ticketId",
            headerName: "Ticket ID"
        },
        {
            field: "title",
            headerName: "Title",
        },
        {
            field: "message",
            headerName: "Message",
        },
        {
            field: "attachments",
            headerName: "Attachments",
        },
        {
            field: "linkedTransaction",
            headerName: "Linked Transaction ID",
        },
        {
            field: "status",
            headerName: "Status",
        },
        {
            field: "createdAt",
            headerName: "Created At",
        },
        {
            field: "updatedAt",
            headerName: "Updated At",
        },
    ])

    const defaultColDef = useMemo(() => {
        return {
            resizable: true,
            filter: true,
            floatingFilter: true,
        };
    }, []);

    return (
        <>
            <DashboardWrapper titleText={'Support Tickets'}>
                <Box w={'full'} h={12}></Box>
                <Box h={'sm'} w={'full'} className='ag-theme-alpine'>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                    >

                    </AgGridReact>
                </Box>
            </DashboardWrapper>
        </>
    )
}

export default SupportTickets