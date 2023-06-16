import React, { useEffect, useState, useRef } from 'react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import {
    Box,
    Button,
    Text,
    Image,
    HStack,
    FormControl,
    FormLabel,
    Input,
    PinInput,
    PinInputField,
    Select,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    VStack,
    useDisclosure
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import BackendAxios, { ClientAxios } from '../../../../lib/axios'
import Cookies from 'js-cookie'
import { BsCheck2Circle, BsDownload, BsXCircle } from 'react-icons/bs'
import Pdf from 'react-to-pdf'

const Fastag = () => {
    const Toast = useToast({ position: 'top-right' })

    useEffect(() => {
        ClientAxios.get(`/api/organisation`).then(res => {
            if (!res.data.fastag_status) {
                window.location.href('/dashboard/not-available')
            }
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const pdfRef = useRef(null)

    const { isOpen, onClose, onOpen } = useDisclosure()
    const [mpin, setMpin] = useState("")

    const [operators, setOperators] = useState([])
    const [billFetched, setBillFetched] = useState(false)

    const [billInfo, setBillInfo] = useState({})
    const [customerName, setCustomerName] = useState("")
    const [billAmount, setBillAmount] = useState("0")

    const [receipt, setReceipt] = useState({
        status: false,
        data: {},
        show: false
    })

    const Formik = useFormik({
        initialValues: {
            operator: "",
            canumber: "",
        },
        onSubmit: (values) => {
            BackendAxios.post(`/api/paysprint/fastag/fetch-bill`, values).then(res => {
                setCustomerName(res.data.name)
                setBillAmount(res.data.amount)
                setBillInfo(res.data.bill_fetch)
                setBillFetched(true)
            }).catch(err => {
                setBillFetched(false)
                Toast({
                    status: 'error',
                    title: 'Error while paying bill',
                    description: err.response?.data?.message || err.response?.data || err.message
                })
            })
        }
    })

    // Fetching operators
    useEffect(() => {
        BackendAxios.get(`/api/paysprint/fastag/operators`).then(res => {
            if (!res.data.status) {
                Toast({
                    status: 'warning',
                    title: 'warning',
                    description: res.data.message
                })
                return
            }
            setOperators(res.data.data)
        }).catch(err => {
            Toast({
                status: 'error',
                title: "Error while fetching operators",
                description: err.response?.data?.message || err.response?.data || err.message
            })
        })
    }, [])

    const handleShare = async () => {
        const myFile = await toBlob(pdfRef.current, { quality: 0.95 })
        const data = {
            files: [
                new File([myFile], 'receipt.jpeg', {
                    type: myFile.type
                })
            ],
            title: 'Receipt',
            text: 'Receipt'
        }
        try {
            await navigator.share(data)
        } catch (error) {
            console.error('Error sharing:', error?.toString());
            Toast({
                status: 'warning',
                description: error?.toString()
            })
        }
    };

    function payBill() {
        BackendAxios.post(`/api/paysprint/fastag/pay-bill`, {
            ...Formik.values,
            bill: billInfo,
            amount: billAmount,
            latlong: Cookies.get("latlong"),
            mpin: mpin
        }).then(res => {
            setBillFetched(false)
            onClose()
            setReceipt({
                status: res.data.metadata?.status || false,
                show: true,
                data: res.data.metadata || { message: "Transaction Failed Without Metadata" }
            })
            Toast({
                status: 'success',
                description: res.data.message || 'Bill paid successfully!'
            })
        }).catch(err => {
            Toast({
                status: 'error',
                title: 'Error while paying bill',
                description: err.response?.data?.message || err.response?.data || err.message
            })
        })
    }

    return (
        <>
            <DashboardWrapper pageTitle={'Fastag Services'}>
                <Box
                    w={['full', 'md']} p={6}
                    bg={'#FFF'} rounded={12}
                    boxShadow={'lg'}
                >
                    <FormControl mb={8}>
                        <FormLabel>Select Provider</FormLabel>
                        <Select
                            name='operator'
                            onChange={Formik.handleChange}
                            placeholder='Select Here'
                        >
                            {
                                operators.map((operator, key) => (
                                    <option value={operator.id}>{operator.name}</option>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl mb={8}>
                        <FormLabel>Vehicle Registration Number</FormLabel>
                        <Input name='canumber' onChange={Formik.handleChange} />
                    </FormControl>
                    {
                        billFetched ?
                            <Box
                                p={4} bg={'blue.50'} mb={8}
                                rounded={8} border={'1px'}
                                borderColor={'blue.200'}
                            >
                                <HStack justifyContent={'space-between'} pb={4}>
                                    <Text fontWeight={'semibold'}>Name: </Text>
                                    <Text>{customerName}</Text>
                                </HStack>
                                <HStack justifyContent={'space-between'}>
                                    <Text fontWeight={'semibold'}>Amount: </Text>
                                    <Text>₹ {billAmount}</Text>
                                </HStack>
                            </Box> : null
                    }
                    <HStack justifyContent={'flex-end'}>
                        {
                            billFetched ?
                                <Button colorScheme='whatsapp' onClick={onOpen}>Pay Bill</Button> :
                                <Button colorScheme='twitter' onClick={Formik.handleSubmit}>Fetch Bill</Button>
                        }
                    </HStack>
                </Box>

            </DashboardWrapper>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalBody p={4}>
                        <Text textAlign={'center'}>Enter MPIN To Confirm Transaction</Text>
                        <HStack p={4} spacing={4} justifyContent={'center'}>
                            <PinInput otp onComplete={value => setMpin(value)}>
                                <PinInputField bg={'aqua'} />
                                <PinInputField bg={'aqua'} />
                                <PinInputField bg={'aqua'} />
                                <PinInputField bg={'aqua'} />
                            </PinInput>
                        </HStack>
                    </ModalBody>
                    <ModalFooter>
                        <HStack justifyContent={'flex-end'}>
                            <Button colorScheme='twitter' onClick={payBill}>Confirm</Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>


            <Modal
                isOpen={receipt.show}
                onClose={() => setReceipt({ ...receipt, show: false })}
            >
                <ModalOverlay />
                <ModalContent width={'xs'}>
                    <Box ref={pdfRef} style={{ border: '1px solid #999' }}>
                        <ModalHeader p={0}>
                            <VStack w={'full'} p={8} bg={receipt.status ? "green.500" : "red.500"}>
                                {
                                    receipt.status ?
                                        <BsCheck2Circle color='#FFF' fontSize={72} /> :
                                        <BsXCircle color='#FFF' fontSize={72} />
                                }
                                <Text color={'#FFF'} textTransform={'capitalize'}>₹ {receipt.data.amount || "0"}</Text>
                                <Text color={'#FFF'} fontSize={'xs'} textTransform={'uppercase'}>Transaction {receipt.status ? "success" : "failed"}</Text>
                            </VStack>
                        </ModalHeader>
                        <ModalBody p={0} bg={'azure'}>
                            <VStack w={'full'} spacing={0} p={4} bg={'#FFF'}>
                                {
                                    receipt.data ?
                                        Object.entries(receipt.data).map((item, key) => {

                                            if (
                                                item[0].toLowerCase() != "status" &&
                                                item[0].toLowerCase() != "user" &&
                                                item[0].toLowerCase() != "user_id" &&
                                                item[0].toLowerCase() != "user_phone" &&
                                                item[0].toLowerCase() != "amount"
                                            )
                                                return (
                                                    <HStack
                                                        justifyContent={'space-between'}
                                                        gap={8} pb={1} w={'full'} key={key}
                                                        borderWidth={'0.75px'} p={2}
                                                    >
                                                        <Text
                                                            fontSize={'xs'}
                                                            fontWeight={'medium'}
                                                            textTransform={'capitalize'}
                                                        >{item[0].replace(/_/g, " ")}</Text>
                                                        <Text fontSize={'xs'} maxW={'full'} >{`${item[1]}`}</Text>
                                                    </HStack>
                                                )

                                        }
                                        ) : null
                                }
                                <VStack pt={8} spacing={0} w={'full'}>
                                    <HStack borderWidth={'0.75px'} p={2} pb={1} justifyContent={'space-between'} w={'full'}>
                                        <Text fontSize={'xs'} fontWeight={'semibold'}>Merchant:</Text>
                                        <Text fontSize={'xs'}>{receipt.data.user}</Text>
                                    </HStack>
                                    <HStack borderWidth={'0.75px'} p={2} pb={1} justifyContent={'space-between'} w={'full'}>
                                        <Text fontSize={'xs'} fontWeight={'semibold'}>Merchant ID:</Text>
                                        <Text fontSize={'xs'}>{receipt.data.user_id}</Text>
                                    </HStack>
                                    <HStack borderWidth={'1px'} p={2} pb={1} justifyContent={'space-between'} w={'full'}>
                                        <Text fontSize={'xs'} fontWeight={'semibold'}>Merchant Mobile:</Text>
                                        <Text fontSize={'xs'}>{receipt.data.user_phone}</Text>
                                    </HStack>
                                    <Image src='/logo_long.jpeg' w={'20'} pt={4} />
                                    <Text fontSize={'xs'}>{process.env.NEXT_PUBLIC_ORGANISATION_NAME}</Text>
                                </VStack>
                            </VStack>
                        </ModalBody>
                    </Box>
                    <ModalFooter>
                        <HStack justifyContent={'center'} gap={4}>
                            <Button
                                colorScheme='yellow'
                                size={'sm'} rounded={'full'}
                                onClick={handleShare}
                            >Share</Button>
                            <Pdf targetRef={pdfRef} filename="Receipt.pdf">
                                {
                                    ({ toPdf }) => <Button
                                        rounded={'full'}
                                        size={'sm'}
                                        colorScheme={'twitter'}
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
        </>
    )
}

export default Fastag