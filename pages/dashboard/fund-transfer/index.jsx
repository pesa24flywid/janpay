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
import { BsChevronDoubleLeft, BsChevronDoubleRight, BsChevronLeft, BsChevronRight } from 'react-icons/bs'

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
            amount: "",
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
            }).catch(err => {
                Toast({
                    status: 'error',
                    description: err.message
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


    const [rowData, setRowData] = useState([
        {}
    ])

    const [columnDefs, setColumnDefs] = useState([
        { headerName: "Trnxn ID", field: 'transaction_id' },
        { headerName: "Beneficiary Name", field: 'name' },
        { headerName: "Beneficiary ID", field: 'user_id' },
        { headerName: "Phone", field: 'phone_number' },
        { headerName: "Amount", field: 'amount' },
        { headerName: "Transaction Type", field: 'transaction_type' },
        { headerName: "Datetime", field: 'created_at' },
        { headerName: "Remarks", field: 'remarks' },
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
                            bg={'twitter.500'}
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
                                            name={'amount'} bg={'white'}
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
                                    colorScheme={'twitter'}>Submit</Button>
                            </HStack>
                        </Box>
                    </Box>
                </Box>

                <HStack spacing={2} py={4} bg={'white'} justifyContent={'center'}>
                    <Button
                        colorScheme={'twitter'}
                        fontSize={12} size={'xs'}
                        variant={'outline'}
                        onClick={() => fetchTransfers(pagination.first_page_url)}
                    ><BsChevronDoubleLeft />
                    </Button>
                    <Button
                        colorScheme={'twitter'}
                        fontSize={12} size={'xs'}
                        variant={'outline'}
                        onClick={() => fetchTransfers(pagination.prev_page_url)}
                    ><BsChevronLeft />
                    </Button>
                    <Button
                        colorScheme={'twitter'}
                        fontSize={12} size={'xs'}
                        variant={'solid'}
                    >{pagination.current_page}</Button>
                    <Button
                        colorScheme={'twitter'}
                        fontSize={12} size={'xs'}
                        variant={'outline'}
                        onClick={() => fetchTransfers(pagination.next_page_url)}
                    ><BsChevronRight />
                    </Button>
                    <Button
                        colorScheme={'twitter'}
                        fontSize={12} size={'xs'}
                        variant={'outline'}
                        onClick={() => fetchTransfers(pagination.last_page_url)}
                    ><BsChevronDoubleRight />
                    </Button>
                </HStack>
                <Box py={6}>
                    <Text fontWeight={'medium'} pb={4}>Recent Transfers</Text>
                    <Box className='ag-theme-alpine' w={'full'} h={['sm', 'xs']}>
                        <AgGridReact
                            columnDefs={columnDefs}
                            rowData={rowData}
                        >

                        </AgGridReact>
                    </Box>
                </Box>
                <HStack spacing={2} py={4} bg={'white'} justifyContent={'center'}>
                    <Button
                        colorScheme={'twitter'}
                        fontSize={12} size={'xs'}
                        variant={'outline'}
                        onClick={() => fetchTransfers(pagination.first_page_url)}
                    ><BsChevronDoubleLeft />
                    </Button>
                    <Button
                        colorScheme={'twitter'}
                        fontSize={12} size={'xs'}
                        variant={'outline'}
                        onClick={() => fetchTransfers(pagination.prev_page_url)}
                    ><BsChevronLeft />
                    </Button>
                    <Button
                        colorScheme={'twitter'}
                        fontSize={12} size={'xs'}
                        variant={'solid'}
                    >{pagination.current_page}</Button>
                    <Button
                        colorScheme={'twitter'}
                        fontSize={12} size={'xs'}
                        variant={'outline'}
                        onClick={() => fetchTransfers(pagination.next_page_url)}
                    ><BsChevronRight />
                    </Button>
                    <Button
                        colorScheme={'twitter'}
                        fontSize={12} size={'xs'}
                        variant={'outline'}
                        onClick={() => fetchTransfers(pagination.last_page_url)}
                    ><BsChevronDoubleRight />
                    </Button>
                </HStack>


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

            </DashboardWrapper>
        </>
    )
}

export default FundTransfer