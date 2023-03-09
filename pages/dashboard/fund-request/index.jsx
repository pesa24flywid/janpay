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
import axios, { FormAxios } from '../../../lib/axios';
import {
    Document,
    Page, Line,
    PDFDownloadLink,
    StyleSheet,
    Text as PText,
    Image, View,
} from '@react-pdf/renderer'

const PrintDoc = () => {
    const [userName, setUserName] = useState("No Name")
    const [rowData, setRowData] = useState([])
    useEffect(() => {
        setUserName(localStorage.getItem("userName"))
    }, [])

    useLayoutEffect(() => {
        axios.get(('api/fund/fetch-fund')).then((res) => {
            setRowData(res.data)
        }).catch(err => {
            console.log(err)
        })
    }, [])


    const styles = StyleSheet.create({
        page: {
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
        logo: {
            width: '28px',
            marginBottom: '8px'
        },
        title: {
            textAlign: 'center',
            margin: '0 auto',
        },
        tableRow: {
            margin: '16px auto 0',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
        },
        tableHead: {
            padding: '4px 8px',
            backgroundColor: 'aqua',
            border: '1px solid #333',
            fontSize: '8px',
            minWidth: '84px'
        },
        tableData: {
            padding: '4px 8px',
            border: '1px solid #333',
            fontSize: '8px',
            minWidth: '84px'
        }
    })
    return (
        <Document>
            <Page style={styles.page} orientation={'landscape'}>
                <Image src={'/logo.png'} style={styles.logo} />
                <PText style={styles.title}>RPAY Fund Requests by {userName}</PText>
                <View style={styles.tableRow}>
                    <PText style={{
                        padding: '4px 8px',
                        backgroundColor: 'aqua',
                        border: '1px solid #333',
                        fontSize: '8px',
                    }}>#</PText>
                    <PText style={styles.tableHead}>Amount (Rs.)</PText>
                    <PText style={styles.tableHead}>Bank Name</PText>
                    <PText style={styles.tableHead}>Transaction ID</PText>
                    <PText style={styles.tableHead}>Type</PText>
                    <PText style={styles.tableHead}>Trnxn Date</PText>
                    <PText style={styles.tableHead}>Status</PText>
                    <PText style={styles.tableHead}>Created At</PText>
                    <PText style={styles.tableHead}>Updated At</PText>
                </View>
                {
                    rowData.map((item, key) => {
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                        }} key={key}>
                            <PText style={{
                                padding: '4px 8px',
                                border: '1px solid #333',
                                fontSize: '8px',
                            }}>1</PText>
                            <PText style={styles.tableData}>{item.amount || "0"}</PText>
                            <PText style={styles.tableData}>{item.bank_name || "NA"}</PText>
                            <PText style={styles.tableData}>{item.transaction_id || "NA"}</PText>
                            <PText style={styles.tableData}>{item.transaction_type || "Cash"}</PText>
                            <PText style={styles.tableData}>{item.transaction_date || "Wrong Format"}</PText>
                            <PText style={styles.tableData}>{item.status || "Pending"}</PText>
                            <PText style={styles.tableData}>{item.created_at || "Wrong Format"}</PText>
                            <PText style={styles.tableData}>{item.updated_at || "Wrong Format"}</PText>
                        </View>
                    })
                }

            </Page>
        </Document>
    )
}


const FundRequest = () => {
    const wrapperRef = useRef(null);
    const Toast = useToast()
    const [clientLoaded, setClientLoaded] = useState(false)
    const [userName, setUserName] = useState("No Name")

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
        axios.get(('api/fund/fetch-fund')).then((res) => {
            setRowData(res.data)
            grid.updateConfig({
                data: res.data
            }).forceRender()

            PrintDoc()

        }).catch(err => {
            console.log(err)
        })
    }, [])

    useEffect(() => {
        setClientLoaded(true)
    })


    const Formik = useFormik({
        initialValues: {
            amount: "",
            bankName: "",
            transactionId: "",
            transactionType: "",
            transactionDate: "",
            depositDate: "",
            receipt: null,
            remarks: "",
        },
        onSubmit: (values) => {
            var formData = new FormData
            formData.append('amount', values.amount,)
            formData.append('bankName', values.bankName,)
            formData.append('transactionId', values.transactionId,)
            formData.append('transactionType', values.transactionType,)
            formData.append('transactionDate', values.transactionDate,)
            formData.append('receipt', values.receipt,)
            FormAxios.post('/api/fund/request-fund', formData).then((res) => {
                Toast({
                    position: 'top-right',
                    description: res.message,
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
    }, []);


    return (
        <>
            <DashboardWrapper titleText={'Fund Request'}>
                <form
                    action={process.env.NEXT_PUBLIC_BACKEND_URL + '/api/fund/request-fund'}
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
                                    <option value="state bank of india">state bank of india</option>
                                </Select>
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
                                <FormLabel>Transaction Receipt</FormLabel>
                                <Input
                                    name={'receipt'}
                                    onChange={(e) => Formik.setFieldValue('receipt', e.currentTarget.files[0])}
                                    type={'file'} accept={'image/jpeg, image/jpg, image/png, pdf'}
                                />
                            </FormControl>
                        </Stack>
                        <Stack p={4}>
                            <FormControl w={['full', 'sm']}>
                                <FormLabel>Remarks</FormLabel>
                                <Input
                                    name={'remarks'}
                                    value={Formik.values.remarks}
                                    onChange={Formik.handleChange}
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
                        <Text fontSize={'lg'}>Fund Requests Details</Text>
                        {
                            clientLoaded &&
                            <PDFDownloadLink document={<PrintDoc rowData={rowData} />} fileName="rpay-fund-requests.pdf">
                                {({ blob, url, loading, error }) =>
                                    loading ?
                                        'loading...' :
                                        <Button colorScheme={'red'}>Export PDF</Button>
                                }
                            </PDFDownloadLink>
                        }
                        {/* <Button colorScheme={'red'}>Export PDF</Button> */}
                    </HStack>
                    <div ref={wrapperRef}>

                    </div>
                </Box>
            </DashboardWrapper>
        </>
    )
}

export default FundRequest