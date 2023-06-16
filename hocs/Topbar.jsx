import React from 'react'
import {
    HStack,
    Text,
    Box,
    Image,
    Spacer,
    useToast,
    Show,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Textarea
} from '@chakra-ui/react'
import Link from 'next/link'
import { IoMdHelpBuoy } from 'react-icons/io'
import { useFormik } from 'formik'
import { FormAxios } from '../lib/axios'

const Topbar = () => {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const Toast = useToast({
        position: 'top-right'
    })
    const Formik = useFormik({
        initialValues: {
            linkedTransactionId: "",
            title: "",
            message: "",
            attachments: null,
        },
        onSubmit: (values) => {
            FormAxios.post('/api/tickets', {
                linkedTransactionId: values.linkedTransactionId,
                title: values.title,
                body: values.message,
                attachments: values.attachments,
            }).then((res) => {
                Toast({
                    status: 'success',
                    title: 'Ticket Raised',
                    description: 'We will reply you soon.'
                })
                onClose()
            }).catch((err) => {
                console.log(err)
                Toast({
                    status: 'error',
                    title: 'Error Occured',
                    description: 'Please contact support.'
                })
            })
        }
    })
    return (
        <>
            <HStack
                w={'full'} mb={6} px={4} py={2}
                rounded={12} bg={'white'}
                boxShadow={'base'}
            >
                <Image
                    w={'36'}
                    src={'/logo_long.png'}
                />
                {/* <Text fontWeight={'semibold'}>Pesa24</Text> */}
                <Spacer />
                <Show above={'md'}>
                    <Link href={'tel:+9178380742'} style={{ paddingRight: '2rem' }}>
                        <Text fontSize={'xs'} color={'#666'}>
                            Helpline Number
                        </Text>
                        <Text fontSize={'lg'}>
                            +91 7838074742
                        </Text>
                    </Link>
                </Show>
                <Button
                    leftIcon={<IoMdHelpBuoy fontSize={'1.25rem'} />}
                    rounded={'full'} colorScheme={'twitter'}
                    onClick={onOpen}
                >New Ticket</Button>
            </HStack>



            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Raise New Ticket</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Title</FormLabel>
                            <Input name='title' onChange={Formik.handleChange} />
                        </FormControl>
                        <FormControl pt={6}>
                            <FormLabel>Transaction ID (optional)</FormLabel>
                            <Input name='linkedTransactionId' onChange={Formik.handleChange} />
                        </FormControl>
                        <FormControl py={6}>
                            <FormLabel>Message</FormLabel>
                            <Textarea name='message'
                                onChange={Formik.handleChange}
                                resize={'none'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Attachments</FormLabel>
                            <Input
                                name='attachments' type={'file'}
                                onChange={(e) => Formik.setFieldValue("attachments", e.currentTarget.files[0])}
                                accept={'image/jpeg, image/png, image/jpg'}
                                />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme={'twitter'} onClick={Formik.handleSubmit}>Send</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Topbar