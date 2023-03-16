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
import { useMemo } from 'react';



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

    doc.autoTable(columnDefs, currentRowData.map((item, key)=> {
        return (
            [
                `${key+1}`,
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

    const [columns, setColumns] = useState([
        {
            id: 'amount',
            name: 'Amount',
        },
        {
            id: 'status',
            name: 'Status',
        },
        {
            id: 'bank_name',
            name: 'Bank Name',
        },
        {
            id: 'transaction_id',
            name: 'Transaction ID',
        },
        {
            id: 'transaction_type',
            name: 'Transaction Type',
        },
        {
            id: 'transaction_date',
            name: 'Transaction Date',
        },
        {
            id: 'transaction_receipt',
            name: 'Transaction Receipt',
        },
        {
            id: 'remarks',
            name: 'Remarks',
        },
        {
            id: 'admin_remarks',
            name: 'Admin Remarks',
        },
    ],)

    const [rowData, setRowData] = useState([
        {
            s_no: '',
            amount: '',
            status: '',
            bank_name: '',
            transaction_id: '',
            transaction_type: '',
            transaction_date: '',
            transaction_receipt: '',
            remarks: '',
            admin_remarks: '',
        }
    ])


    useEffect(() => {
        setUserName(localStorage.getItem("userName"))
        BackendAxios.get(('api/fund/fetch-fund')).then((res) => {
            setRowData(res.data)
            grid.updateConfig({
                data: res.data
            }).forceRender()
        }).catch(err => {
            console.log(err)
        })
    }, [])


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
                    description: err.message
                })
            })
        }
    })


    const grid = new Grid({
        columns: columns,
        data: rowData,
        search: true,
        style: {
            th: {
                'min-width': '240px'
            },
            td: {
                'min-width': '240px'
            }
        },
        resizable: true,
        fixedHeader: true,
    });
    useEffect(() => {
        grid.render(wrapperRef.current)
    }, [])

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
                                        name={'amount'}
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
                            >Cear Data</Button>
                            <Button colorScheme={'twitter'} onClick={Formik.handleSubmit}>Send Request</Button>
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

                        <Button colorScheme={'red'} onClick={()=>ExportPDF(grid.config.data)}>Export PDF</Button>
                    </HStack>
                    <div ref={wrapperRef}>

                    </div>
                </Box>
            </DashboardWrapper>
        </>
    )
}

export default FundRequest