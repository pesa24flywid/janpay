import React, { useState, useEffect, useMemo } from 'react'
import {
    Box,
    Stack,
    Text,
    Button,
    useToast
} from '@chakra-ui/react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import DashboardWrapper from '../../../hocs/DashboardLayout';
import BackendAxios from '../../../lib/axios';

const SupportTickets = () => {
    const Toast = useToast({
        position: 'top-right'
    })
    const [rowData, setRowData] = useState([])
    const [columnDefs, setColumnDefs] = useState([
        {
            field: "id",
            headerName: "Ticket ID"
        },
        {
            field: "title",
            headerName: "Title",
        },
        {
            field: "body",
            headerName: "Message",
        },
        {
            field: "document",
            headerName: "Attachments",
        },
        {
            field: "transaction_id",
            headerName: "Linked Transaction ID",
        },
        {
            field: "status",
            headerName: "Status",
        },
        {
            field: "created_at",
            headerName: "Created At",
        },
        {
            field: "updated_at",
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

    useEffect(()=>{
        BackendAxios.get('/api/user/tickets').then(res=>{
            setRowData(res.data)
        }).catch(err=>{
            Toast({
                status: 'warning',
                description: err.response.data.message || err.response.data || err.message
            })
        })
    },[])

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