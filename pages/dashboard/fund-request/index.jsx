import React, { useRef, useEffect, useState, useLayoutEffect } from 'react'
import DashboardWrapper from '../../../hocs/DashboardLayout'
import {
    Box,
    Text,
    Stack,
    FormControl,
    FormLabel,
    InputGroup,
    InputLeftAddon,
    Input,
    Button,
    Select,
    HStack,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    useToast,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { Grid } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import BackendAxios, { ClientAxios, FormAxios } from '../../../lib/axios';
import jsPDF from 'jspdf';
import "jspdf-autotable"
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { BsEye } from 'react-icons/bs';

const ExportPDF = (currentRowData) => {
    const doc = new jsPDF('landscape')
    const columnDefs = [
        '#',
        'Amount',
        'Bank Name',
        'Trnxn ID',
        'Status',
        'Trnxn Date',
        'Admin Remarks',
    ]

    doc.autoTable(columnDefs, currentRowData.map((item, key) => {
        return (
            [
                `${key + 1}`,
                `${item.amount} - ${item.transaction_type}`,
                `${item.bank_name}`,
                `${item.transaction_id}`,
                `${item.status}`,
                `${item.transaction_date}`,
                `${item.remarks}`,
                `${item.admin_remarks}`,
            ]
        )
    }))
    doc.setCharSpace(4)
    //This is a key for printing
    doc.output('dataurlnewwindow');
}


const FundRequest = () => {
    const wrapperRef = useRef(null);
    const Toast = useToast({
        position: 'top-right'
    })
    const [clientLoaded, setClientLoaded] = useState(false)
    const [userName, setUserName] = useState("No Name")
    const [bankDetails, setBankDetails] = useState([])
    const date = new Date()

    // let parent
    // let grandParent
    // let greatGrandParent
    // const [availableParents, setAvailableParents] = useState([])
    // function getParents(userData) {
    //     setAvailableParents([])
    //     if (userData.parents_roles[0].parents_roles.length == 0) {
    //         parent = userData.parents_roles[0]
    //         parent = userData.parents_roles[0]

    //         setAvailableParents([
    //             {
    //                 myParentId: parent.id,
    //                 myParentName: parent.name,
    //                 myParentRole: parent.roles[0].name.replace("_", " ")
    //             }
    //         ])

    //         console.log("Parent Found")
    //     }
    //     if (userData.parents_roles[0].parents_roles[0].parents_roles.length == 0) {
    //         parent = userData.parents_roles[0]
    //         parent = userData.parents_roles[0]
    //         grandParent = userData.parents_roles[0].parents_roles[0]
    //         grandParent = userData.parents_roles[0].parents_roles[0]

    //         setAvailableParents([
    //             {
    //                 myParentId: parent.id,
    //                 myParentName: parent.name,
    //                 myParentRole: parent.roles[0].name.replace("_", " ")
    //             },
    //             {
    //                 myParentId: grandParent.id,
    //                 myParentName: grandParent.name,
    //                 myParentRole: grandParent.roles[0].name.replace("_", " ")
    //             },
    //         ])

    //         console.log("Parent Found")
    //     }

    //     else {
    //         parentName = userData.parents_roles[0]
    //         parentId = userData.parents_roles[0]
    //         grandParent = userData.parents_roles[0].parents_roles[0]
    //         grandParent = userData.parents_roles[0].parents_roles[0]
    //         greatGrandParent = userData.parents_roles[0].parents_roles[0].parents_roles[0]
    //         greatGrandParent = userData.parents_roles[0].parents_roles[0].parents_roles[0]

    //         setAvailableParents([
    //             {
    //                 myParentId: parent.id,
    //                 myParentName: parent.name,
    //                 myParentRole: parent.roles[0].name.replace("_", " ")
    //             },
    //             {
    //                 myParentId: grandParent.id,
    //                 myParentName: grandParent.name,
    //                 myParentRole: grandParent.roles[0].name.replace("_", " ")
    //             },
    //             {
    //                 myParentId: greatGrandParent.id,
    //                 myParentName: greatGrandParent.name,
    //                 myParentRole: greatGrandParent.roles[0].name.replace("_", " ")
    //             },
    //         ])

    //         console.log("Parent Found")
    //     }

    //     console.log(availableParents)
    // }

    // useEffect(() => {
    //     // Fetch parents
    //     BackendAxios.get('/api/fund/fetch-parents').then((res) => {
    //         getParents(res.data[0])
    //     }).catch((err) => {
    //         console.log(err)
    //     })
    // }, [])


    useEffect(() => {
        // Fetch available Banks
        ClientAxios.post('/api/cms/banks/fetch').then((res) => {
            setBankDetails(res.data)
        })
    }, [])

    const [pagination, setPagination] = useState({
        current_page: "1",
        total_pages: "1",
        first_page_url: "",
        last_page_url: "",
        next_page_url: "",
        prev_page_url: "",
    })
    const [rowData, setRowData] = useState([

    ])
    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: "Trnxn ID",
            field: 'transaction_id',
            width: 150
        },
        {
            headerName: "Amount",
            field: 'amount',
            width: 150
        },
        {
            headerName: "Status",
            field: 'status',
            width: 100
        },
        {
            headerName: "Type",
            field: 'transaction_type',
            width: 100
        },
        {
            headerName: "Trnxn Date",
            field: 'transaction_date',
            width: 150
        },
        {
            headerName: "Request Timestamp",
            field: 'created_at',
            width: 180
        },
        {
            headerName: "Remarks",
            field: 'remarks',
            width: 200
        },
        {
            headerName: "Receipt",
            field: 'receipt',
            cellRenderer: 'receiptCellRenderer',
            pinned: 'right',
            width: 80
        },
    ])

    function fetchTransactions(pageLink) {
        BackendAxios.get(pageLink || `/api/fund/fetch-fund?page=1`).then((res) => {
            setPagination({
                current_page: res.data.current_page,
                total_pages: parseInt(res.data.last_page),
                first_page_url: res.data.first_page_url,
                last_page_url: res.data.last_page_url,
                next_page_url: res.data.next_page_url,
                prev_page_url: res.data.prev_page_url,
            })
            setRowData(res.data.data)
        }).catch((err) => {
            console.log(err)
            Toast({
                status: 'error',
                description: err.response.data.message || err.response.data || err.message
            })
        })
    }

    useEffect(() => {
        fetchTransactions()
        setUserName(localStorage.getItem("userName"))
    }, [])


    const receiptCellRenderer = (params) => {
        function showReceipt() {
            if (!params.data.receipt) {
                Toast({
                    description: 'No Receipt Available'
                })
                return
            }
            window.open(`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${params.data.receipt}`, "_blank")
        }
        return (
            <HStack height={'full'} w={'full'} gap={4}>
                <Button rounded={'full'} colorScheme='twitter' size={'xs'} onClick={() => showReceipt()}><BsEye /></Button>
            </HStack>
        )
    }

    const Formik = useFormik({
        initialValues: {
            amount: "",
            bankName: "",
            requestFrom: "",
            transactionId: "",
            transactionType: "",
            transactionDate: "",
            depositDate: "",
            receipt: null,
            remarks: "",
        },
        onSubmit: (values) => {
            var formData = new FormData(document.getElementById('request-form'))
            FormAxios.post('/api/fund/request-fund', formData).then((res) => {
                Toast({
                    position: 'top-right',
                    description: res.data,
                })
            }).catch(err => {
                Toast({
                    status: 'error',
                    title: 'Error Occured',
                    description: err.response.data.message || err.response.data || err.message,
                })
            })
        }
    })


    return (
        <>
            <DashboardWrapper titleText={'Fund Request'}>
                <form
                    method='POST' id={'request-form'}
                >
                    <Box
                        p={6} w={'full'}
                        bg={'white'}
                        rounded={16}
                        boxShadow={'md'}
                    >
                        <Stack
                            direction={['column', 'row']}
                            spacing={6} p={4}
                        >
                            <FormControl w={['full', 'xs']}>
                                <FormLabel>Request Amount*</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon children={'₹'} />
                                    <Input
                                        type={'number'}
                                        name={'amount'} maxLength={6}
                                        onChange={Formik.handleChange}
                                        value={Formik.values.amount}
                                    />
                                </InputGroup>
                            </FormControl>

                            <FormControl w={['full', 'xs']}>
                                <FormLabel>Bank Name*</FormLabel>
                                <Select
                                    name={'bankName'}
                                    onChange={Formik.handleChange}
                                    textTransform={'capitalize'}
                                    placeholder={'Select Here'}
                                    value={Formik.values.bankName}
                                >
                                    {
                                        bankDetails.map((bank, key) => {
                                            return (
                                                <option key={key} value={`${bank.bank_name}-${bank.account}`}>
                                                    {bank.bank_name} - {bank.account}
                                                </option>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>

                            {/* <FormControl w={['full', 'xs']}>
                                <FormLabel>Request From*</FormLabel>
                                <Select
                                    name={'requestFrom'}
                                    onChange={Formik.handleChange}
                                    textTransform={'capitalize'}
                                    placeholder={'Select Here'}
                                    value={Formik.values.requestFrom}
                                >
                                    {
                                        availableParents.map((parent, key) => {
                                            return (
                                                <option key={key} value={parent.myParentId}>
                                                    {parent.myParentRole}
                                                </option>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl> */}

                        </Stack>

                        <Stack
                            direction={['column', 'row']}
                            spacing={6} p={4}
                        >
                            <FormControl w={['full', 'xs']}>
                                <FormLabel>Transaction ID</FormLabel>
                                <Input
                                    name={'transactionId'}
                                    onChange={Formik.handleChange}
                                    placeholder={'Transaction ID'}
                                    value={Formik.values.transactionId}
                                    textTransform={'uppercase'}
                                />
                            </FormControl>
                            <FormControl w={['full', 'xs']}>
                                <FormLabel>Transaction Date</FormLabel>
                                <Input
                                    name={'transactionDate'}
                                    onChange={Formik.handleChange}
                                    type={'date'} value={Formik.values.transactionDate}
                                    max={`${date.getFullYear()}-${(date.getMonth() + 1).toLocaleString('en-US', {
                                        minimumIntegerDigits: 2
                                    })}-${date.getDate().toLocaleString('en-US', {
                                        minimumIntegerDigits: 2
                                    })}`}
                                />
                            </FormControl>
                            <FormControl w={['full', 'xs']}>
                                <FormLabel>Transaction Type*</FormLabel>
                                <Select
                                    name={'transactionType'}
                                    onChange={Formik.handleChange}
                                    textTransform={'capitalize'}
                                    placeholder={'Select Here'}
                                    value={Formik.values.transactionType}
                                >
                                    <option value="cash">Cash</option>
                                    <option value="imps">IMPS</option>
                                    <option value="neft">NEFT</option>
                                    <option value="rtgs">RTGS</option>
                                    <option value="upi">UPI</option>
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack direction={['column', 'row']} p={4} spacing={6}>
                            <FormControl w={['full', 'sm']}>
                                <FormLabel>Remarks</FormLabel>
                                <Input
                                    name={'remarks'}
                                    value={Formik.values.remarks}
                                    onChange={Formik.handleChange}
                                />
                            </FormControl>

                            <FormControl w={['full', 'sm']}>
                                <FormLabel>Transaction Receipt</FormLabel>
                                <Input
                                    name={'receipt'}
                                    onChange={(e) => Formik.setFieldValue('receipt', e.currentTarget.files[0])}
                                    type={'file'} accept={'image/jpeg, image/jpg, image/png, pdf'}
                                />
                            </FormControl>
                        </Stack>
                        <HStack spacing={6} justifyContent={'flex-end'} pt={8}>
                            <Button
                                colorScheme={'red'}
                                variant={'outline'}
                                onClick={Formik.handleReset}
                            >Clear Data</Button>
                            <Button colorScheme={'orange'} onClick={Formik.handleSubmit}>Send Request</Button>
                        </HStack>
                    </Box>
                </form>

                <Box
                    p={6}
                    mt={12}
                    bg={'white'}
                    boxShadow={'md'}
                >

                    <HStack justifyContent={'space-between'}>
                        <Text fontSize={'lg'} pb={6}>Your Past Fund Requests</Text>

                        <Button colorScheme={'red'} onClick={() => ExportPDF(rowData)}>Export PDF</Button>
                    </HStack>
                    <Box h={'12'} w={'full'}></Box>
                    <Box py={6}>
                        <Box
                            className='ag-theme-alpine ag-theme-pesa24-blue'
                            w={'full'} h={['2xl']} roundedTop={16}
                            overflow={'hidden'}
                        >
                            <AgGridReact
                                columnDefs={columnDefs}
                                rowData={rowData}
                                defaultColDef={{
                                    filter: true,
                                    floatingFilter: true,
                                    resizable: true,
                                    sortable: true,
                                }}
                                components={{
                                    'receiptCellRenderer': receiptCellRenderer
                                }}
                            >

                            </AgGridReact>
                        </Box>
                    </Box>
                </Box>
            </DashboardWrapper>
        </>
    )
}

export default FundRequest