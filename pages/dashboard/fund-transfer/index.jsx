import React, { useState, useEffect } from 'react'
import {
    Stack,
    Text,
    VStack,
    HStack,
    Button,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    Input,
    Box,
    FormControl,
    FormLabel,
    PinInput,
    PinInputField,
    Select,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import DashboardWrapper from '../../../hocs/DashboardLayout'
import { useFormik } from 'formik'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import BackendAxios from '../../../lib/axios'
import { useRouter } from 'next/router';
import { BsCheck2Circle, BsChevronDoubleLeft, BsChevronDoubleRight, BsChevronLeft, BsChevronRight, BsClock, BsDownload, BsEye, BsFileEarmarkCheck, BsXCircle } from 'react-icons/bs'
import Pdf from 'react-to-pdf'

const FundTransfer = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const Router = useRouter()
    const { user_id } = Router.query
    const Toast = useToast({
        position: 'top-right'
    })
    const [fetchedUser, setFetchedUser] = useState({
        user_name: "",
        firm_name: "",
        wallet: "",
        phone: "",
    })
    const TransferFormik = useFormik({
        initialValues: {
            beneficiaryId: user_id || "",
            amount: 0,
            transactionType: "transfer",
            remarks: "",
            mpin: "",
        },
        onSubmit: values => {
            BackendAxios.post(`/api/money-transfer`, values).then(res => {
                Toast({
                    status: 'success',
                    description: 'Transaction successful!'
                })
                onClose()
                setReceipt({
                    status: 'success',
                    show: true,
                    data: res.data.metadata
                })
                fetchTransfers()
            }).catch(err => {
                Toast({
                    status: 'error',
                    description: err.response.data.message || err.response.data || err.message
                })
            })
        }
    })

    const [pagination, setPagination] = useState({
        current_page: "1",
        total_pages: "1",
        first_page_url: "",
        last_page_url: "",
        next_page_url: "",
        prev_page_url: "",
    })

    const verifyBeneficiary = (queriedUserId) => {
        // Logic to verifiy beneficiary details
        BackendAxios.get(`/api/users/${queriedUserId || TransferFormik.values.beneficiaryId}`).then((res) => {
            setFetchedUser({
                ...fetchedUser,
                user_name: res.data.data.first_name + " " + res.data.data.last_name,
                firm_name: res.data.data.firm_name,
                phone: res.data.data.phone_number,
                wallet: res.data.data.wallet,

            })
            TransferFormik.setFieldValue("beneficiaryId", res.data.data.id)
        }).catch((err) => {
            Toast({
                status: 'error',
                description: 'User not found!'
            })
            setFetchedUser({
                user_name: "",
                firm_name: "",
                wallet: "",
                phone: "",
            })
        })
    }

    const pdfRef = React.createRef()
    const [receipt, setReceipt] = useState({
        show: false,
        status: "success",
        data: {}
    })
    const receiptCellRenderer = (params) => {
        function showReceipt(willShow) {
            if(!params.data.metadata){
                Toast({
                    description: 'No Receipt Available'
                })
                return
            }
            setReceipt({
                status: JSON.parse(params.data.metadata).status ? "success" : "failed",
                show: willShow,
                data: JSON.parse(params.data.metadata)
            })
        }
        return (
            <HStack height={'full'} w={'full'} gap={4}>
                <Button rounded={'full'} colorScheme='orange' size={'xs'} onClick={() => showReceipt(true)}><BsEye /></Button>
            </HStack>
        )
    }

    const [rowData, setRowData] = useState([])

    const [columnDefs, setColumnDefs] = useState([
        { headerName: "Trnxn ID", field: 'transaction_id' },
        { headerName: "Beneficiary Name", field: 'name' },
        { headerName: "Beneficiary ID", field: 'reciever_id' },
        { headerName: "Receiver Phone", field: 'phone_number' },
        { headerName: "Amount", field: 'amount' },
        { headerName: "Datetime", field: 'created_at' },
        { headerName: "Remarks", field: 'remarks' },
        { headerName: "Metadata", field: 'metadata' },
        { headerName: "Receipt", field: 'actions', pinned: 'right', cellRenderer: 'receiptCellRenderer' },
    ])

    function fetchTransfers(pageLink) {
        BackendAxios.get(pageLink || '/api/money-transfer?page=1').then((res) => {
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
        })
    }

    useEffect(() => {
        fetchTransfers()
    }, [])

    useEffect(() => {
        if (Router.isReady && user_id) {
            verifyBeneficiary(user_id)
            TransferFormik.setFieldValue("beneficiaryId", user_id)
        }
    }, [Router.isReady])

    return (
        <>
            <DashboardWrapper pageTitle={'Fund Transfer'}>

                {/* Fund Transfer Form */}
                <Box py={6}>
                    <Box
                        rounded={16}
                        overflow={'hidden'}
                    >
                        <Box
                            bg={'orange.500'}
                            p={3} color={'white'}
                        >
                            <Text>Transfer Funds To Any Registered User</Text>
                        </Box>
                        <Box p={4}>
                            <Stack
                                direction={['column', 'row']}
                                spacing={6} py={6}
                            >
                                <FormControl w={['full', 'xs']}>
                                    <FormLabel>User ID</FormLabel>
                                    <InputGroup>
                                        <Input
                                            name={'beneficiaryId'} bg={'white'}
                                            value={TransferFormik.values.beneficiaryId}
                                            onChange={TransferFormik.handleChange}
                                            placeholder={'Enter Beneficiary User ID'}
                                        />
                                        <InputRightAddon
                                            children={'Verify'}
                                            cursor={'pointer'}
                                            onClick={() => verifyBeneficiary()}
                                        />
                                    </InputGroup>
                                </FormControl>
                            </Stack>
                            {
                                fetchedUser.user_name ?
                                    <Stack
                                        p={4} bg={'blue.50'}
                                        border={'1px'}
                                        borderColor={'blue.200'}
                                        rounded={16}
                                        direction={['column', 'row']}
                                        spacing={6} justifyContent={'space-between'}
                                        textTransform={'capitalize'}
                                    >
                                        <Box>
                                            <Text fontWeight={'medium'}>Beneficiary Name</Text>
                                            <Text>{fetchedUser.user_name}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight={'medium'}>Firm Name</Text>
                                            <Text>{fetchedUser.firm_name}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight={'medium'}>Current Balance</Text>
                                            <Text>₹ {fetchedUser.wallet}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight={'medium'}>Phone</Text>
                                            <Text>{fetchedUser.phone}</Text>
                                        </Box>
                                    </Stack> : null
                            }
                            <Stack
                                direction={['column', 'row']}
                                py={8} justifyContent={'flex-start'}
                                gap={4}
                            >
                                <FormControl w={['full', 'xs']}>
                                    <FormLabel>Enter Amount</FormLabel>
                                    <InputGroup>
                                        <InputLeftAddon
                                            children={'₹'}
                                        />
                                        <Input
                                            name={'amount'} bg={'white'} type={'number'}
                                            onChange={TransferFormik.handleChange}
                                            placeholder={'Enter Amount To Transfer'}
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormControl w={['full', 'xs']}>
                                    <FormLabel>Transaction Type</FormLabel>
                                    <Select
                                        name={'transactionType'}
                                        bg={'white'}
                                        onChange={TransferFormik.handleChange}
                                    >
                                        <option value="transfer" selected>Transfer</option>
                                    </Select>
                                </FormControl>
                            </Stack>
                            <FormControl py={6}>
                                <FormLabel>Remarks (optional)</FormLabel>
                                <Input
                                    placeholder='Enter here...'
                                    bg={'white'} name={'remarks'}
                                    onChange={TransferFormik.handleChange}
                                />
                            </FormControl>

                            <HStack justifyContent={'flex-end'}>
                                <Button
                                    type='submit' onClick={onOpen}
                                    colorScheme={'orange'}>Submit</Button>
                            </HStack>
                        </Box>
                    </Box>
                </Box>

                <Box py={6}>
                    <Text fontWeight={'medium'} pb={4}>Recent Transfers</Text>
                    <Box className='ag-theme-alpine ag-theme-pesa24-blue' w={'full'} h={['sm', 'xs']}>
                        <AgGridReact
                            columnDefs={columnDefs}
                            rowData={rowData}
                            components={{
                                'receiptCellRenderer': receiptCellRenderer
                            }}
                        >

                        </AgGridReact>
                    </Box>
                </Box>


                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Confirm Transaction</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack>
                                <FormControl w={['full', 'xs']}>
                                    <Text>You are making a transaction for {fetchedUser.user_name} of Rs. {TransferFormik.values.amount} </Text>
                                    <FormLabel>Enter MPIN to confirm</FormLabel>
                                    <HStack spacing={4}>
                                        <PinInput
                                            name={'mpin'} otp
                                            onComplete={value => TransferFormik.setFieldValue('mpin', value)}
                                        >
                                            <PinInputField bg={'aqua'} />
                                            <PinInputField bg={'aqua'} />
                                            <PinInputField bg={'aqua'} />
                                            <PinInputField bg={'aqua'} />
                                        </PinInput>
                                    </HStack>
                                </FormControl>
                            </VStack>
                        </ModalBody>

                        <ModalFooter>
                            <Button variant='ghost' onClick={onClose}>Cancel</Button>
                            <Button colorScheme='blue' mr={3} onClick={TransferFormik.handleSubmit}>Done</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <Modal
                    isOpen={receipt.show}
                    onClose={() => setReceipt({ ...receipt, show: false })}
                >
                    <ModalOverlay />
                    <ModalContent width={'xs'}>
                        <Box ref={pdfRef} style={{ borderBottom: '1px solid #999' }}>
                            <ModalHeader p={0}>
                                <VStack w={'full'} p={8} bg={receipt.status == "success" ? "green.500" : receipt.status == "failed" ? "red.500" : "yellow.700"}>
                                    {
                                        receipt.status == "success" ?
                                            <BsCheck2Circle color='#FFF' fontSize={72} /> :
                                            receipt.status == "failed" ?
                                                <BsXCircle color='#FFF' fontSize={72} /> :
                                                <BsClock color='#FFF' fontSize={72} />

                                    }
                                    <Text color={'#FFF'} textTransform={'capitalize'}>Transaction {receipt.status}</Text>
                                </VStack>
                            </ModalHeader>
                            <ModalBody p={0} bg={'azure'}>
                                <VStack w={'full'} p={4} bg={'#FFF'}>
                                    {
                                        receipt.data ?
                                            Object.entries(receipt.data).map((item, key) => (
                                                <HStack
                                                    justifyContent={'space-between'}
                                                    gap={8} pb={4} w={'full'} key={key}
                                                >
                                                    <Text fontSize={11}
                                                        fontWeight={'medium'}
                                                        textTransform={'capitalize'}
                                                    >{item[0]}</Text>
                                                    <Text fontSize={11} >{`${item[1]}`}</Text>
                                                </HStack>
                                            )) : null
                                    }
                                </VStack>
                            </ModalBody>
                        </Box>
                        <ModalFooter>
                            <HStack justifyContent={'center'} gap={8}>

                                <Pdf targetRef={pdfRef} filename="Receipt.pdf">
                                    {
                                        ({ toPdf }) => <Button
                                            rounded={'full'}
                                            size={'sm'}
                                            colorScheme={'orange'}
                                            leftIcon={<BsDownload />}
                                            onClick={toPdf}
                                        >Download
                                        </Button>
                                    }
                                </Pdf>
                            </HStack>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

            </DashboardWrapper>
        </>
    )
}

export default FundTransfer