import React from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    VStack,
    Text,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    InputGroup,
    InputLeftAddon,
    Stack,
    Box,
    TableContainer,
    Table, Thead,
    Th, Tr, Td,
    Tbody
} from '@chakra-ui/react'
import { Form, useFormik } from 'formik'
import DashboardWrapper from '../../../hocs/DashboardLayout'

const Index = () => {
    const Formik = useFormik({
        initialValues: {
            amount: "",
            transactionType: "",
            mpin: ""
        }
    })
    return (
        <>
            <DashboardWrapper titleText={'Settle Funds'}>
                <Stack
                    direction={['column', 'row']}
                    gap={16} w={'full'}
                >
                    <Box
                        w={['full', 'sm']}
                        p={4} bg={'white'}
                        rounded={12}
                        boxShadow={'lg'}
                    >
                        <Text mb={8}>Settle amount from your wallet</Text>
                        <InputGroup>
                            <InputLeftAddon children={'₹'} />
                            <Input
                                type={'number'}
                                name={'amount'}
                                onChange={Formik.handleChange}
                                value={Formik.values.amount}
                                placeholder={'Enter Amount'}
                            />
                        </InputGroup>
                        <FormControl mt={8}>
                            <FormLabel>Select Bank Account</FormLabel>
                            <Select name={'transactionType'} onChange={Formik.handleChange}>
                                <option value="39488734970">State Bank of India - 39488734970</option>
                            </Select>
                        </FormControl>
                        <FormControl mt={8}>
                            <FormLabel>Transaction Type</FormLabel>
                            <Select name={'transactionType'} onChange={Formik.handleChange}>
                                <option value="imps">IMPS (2-4 hours)</option>
                                <option value="neft">NEFT (instant)</option>
                            </Select>
                        </FormControl>
                        <Button colorScheme={'twitter'} mt={8} w={'full'}>
                            Done
                        </Button>
                    </Box>

                    <Box
                        w={['full', 'lg', '2xl']}
                        p={4} bg={'white'}
                        rounded={12}
                        boxShadow={'lg'}
                    >
                        <TableContainer>
                            <Table>
                                <Thead>
                                    <Tr>
                                        <Th>#</Th>
                                        <Th>Amount</Th>
                                        <Th>Type</Th>
                                        <Th>Account</Th>
                                        <Th>Status</Th>
                                        <Th>Timestamp</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td>1</Td>
                                        <Td>1000</Td>
                                        <Td>IMPS</Td>
                                        <Td>39488734970</Td>
                                        <Td>Success</Td>
                                        <Td>28-01-2023 16:39</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Stack>
            </DashboardWrapper>
        </>
    )
}

export default Index