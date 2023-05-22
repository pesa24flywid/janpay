import React, { useState, useRef } from 'react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import {
    Box,
    Input,
    Button,
    Text,
    FormControl,
    FormLabel,
    useToast,
    Select,
    HStack,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalHeader,
    Table,
    Tr, Td, Tbody, ModalFooter
} from '@chakra-ui/react'
import BackendAxios from '../../../../lib/axios'
import { useFormik } from 'formik'
import Pdf from 'react-to-pdf'
import { BsDownload } from 'react-icons/bs'


const Cms = () => {
    const Toast = useToast({ position: 'top-right' })
    const { isOpen, onOpen, onClose } = useDisclosure()
    const pdfRef = useRef()
    const [transactionResponse, setTransactionResponse] = useState({})
    const Formik = useFormik({
        initialValues: {
            provider: "airtel",
            transactionId: "",
            referenceId: ""
        },
        onSubmit: values => {
            BackendAxios.post(`/api/paysprint/cms/${values.provider}`, values).then(res => {
                window.open(`${res.data.redirecturl}`, "_blank")
            }).catch(err => {
                Toast({
                    status: 'error',
                    title: 'Error while sending request',
                    description: err.response.data.message || err.response.data || err.message
                })
            })
        }
    })

    function checkStatus() {
        BackendAxios.post(`/api/paysprint/cms/${Formik.values.provider}-status`, {
            referenceId: Formik.values.referenceId
        }).then(res => {
            setTransactionResponse(res.data.data)
            onOpen()
        }).catch(err => {
            Toast({
                status: 'error',
                title: 'Error while sending request',
                description: err.response?.data?.message || err.response?.data || err.message
            })
        })
    }

    return (
        <>
            <DashboardWrapper pageTitle={'CMS'}>
                <Box
                    w={['full', 'lg']}
                    p={4} rounded={8}
                    boxShadow={'lg'}
                    bg={'#FFF'}
                >
                    <FormControl w={['full', 'sm']} pb={8} isRequired>
                        <FormLabel>Select Provider</FormLabel>
                        <Select
                            placeholder='Select CMS Provider'
                            name={'provider'} value={Formik.values.provider}
                            onChange={Formik.handleChange}>
                            <option value="airtel">Airtel CMS</option>
                            <option value="fino">Fino CMS</option>
                        </Select>
                    </FormControl>
                    <FormControl w={['full', 'sm']} pb={8} isRequired>
                        <FormLabel>Transaction ID</FormLabel>
                        <Input name='transactionId' onChange={Formik.handleChange} />
                    </FormControl>
                    <Button colorScheme='twitter' onClick={Formik.handleSubmit}>Submit</Button>
                </Box>
                <Text size={'lg'} fontWeight={'semibold'} pt={'16'} pb={"4"}>Check Transaction Status</Text>
                <Box
                    w={['full', 'lg']}
                    p={4} rounded={8}
                    boxShadow={'lg'}
                    bg={'#FFF'}
                >
                    <FormControl w={['full', 'sm']} pb={8} isRequired>
                        <FormLabel>Select Provider</FormLabel>
                        <Select
                            placeholder='Select CMS Provider'
                            name={'provider'} value={Formik.values.provider}
                            onChange={Formik.handleChange}>
                            <option value="airtel">Airtel CMS</option>
                            <option value="fino">Fino CMS</option>
                        </Select>
                    </FormControl>
                    <FormControl w={['full', 'sm']} pb={8} isRequired>
                        <FormLabel>Reference ID</FormLabel>
                        <Input name='referenceId' onChange={Formik.handleChange} />
                    </FormControl>
                    <Button colorScheme='facebook' onClick={checkStatus}>Check Status</Button>
                </Box>
            </DashboardWrapper>


            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered={true}
                size={'md'}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Transaction Status</ModalHeader>
                    <ModalBody p={4} ref={pdfRef}>
                        <Table variant={'striped'}>
                            <Tbody>
                                {
                                    Object.entries(transactionResponse).map((item, key) => (
                                        <Tr key={key}>
                                            <Td px={2} py={0}>
                                                <Text fontSize={'xs'} textTransform={'capitalize'}>{item[0]}</Text>
                                            </Td>
                                            <Td>
                                                <Text fontSize={'xs'} textTransform={'capitalize'}>{item[1]}</Text>
                                            </Td>
                                        </Tr>
                                    ))
                                }
                            </Tbody>
                        </Table>
                    </ModalBody>
                    <ModalFooter>
                        <HStack w={'full'} justifyContent={'flex-end'}>
                            <Pdf targetRef={pdfRef} filename="Status.pdf" scale={1.2}>
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

export default Cms