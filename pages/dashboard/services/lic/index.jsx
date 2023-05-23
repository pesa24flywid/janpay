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
  HStack,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  VStack,
  useDisclosure,
  PinInput,
  PinInputField
} from '@chakra-ui/react'
import BackendAxios from '../../../../lib/axios'
import { useFormik } from 'formik'
import Pdf from 'react-to-pdf'
import { BsCheck2Circle, BsDownload, BsXCircle } from 'react-icons/bs'
import Cookies from 'js-cookie'


const Lic = () => {
  const pdfRef = useRef(null)
  const [receipt, setReceipt] = useState({
    status: false,
    data: {},
    show: false
  })
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [billFetched, setBillFetched] = useState(false)
  const [beneDetails, setBeneDetails] = useState({
    userName: "",
    dueDate: "",
    cellNumber: "",
    billAmount: ""
  })
  const [mpin, setMpin] = useState("")
  const Toast = useToast({
    position: 'top-right'
  })
  const Formik = useFormik({
    initialValues: {
      canumber: "",
      amount: "",
      ad1: ""
    }
  })

  function fetchInfo() {
    BackendAxios.post("/api/paysprint/lic/fetch-bill", {
      canumber: Formik.values.canumber,
      ad1: Formik.values.ad1
    }).then(res => {
      if (res.data.status == false) {
        Toast({
          status: 'warning',
          description: res.data.message || 'No policy information found!'
        })
        return
      }
      setBillFetched(true)
      Formik.setFieldValue("amount", res.data.amount)
      setBeneDetails(res.data.bill_fetch)
    }).catch(err => {
      Toast({
        status: 'error',
        title: "Error while fetching dtails",
        description: err.response.data.message || err.response.data || err.message
      })
    })
  }
  function payBill() {
    BackendAxios.post("/api/paysprint/lic/pay-bill", { 
      bill: beneDetails, 
      mpin: mpin,
      canumber: Formik.values.canumber,
      latlong: Cookies.get("latlong"),
      amount: Formik.values.amount
    }).then(res => {
      Toast({
        status: 'success',
        description: "Bill Paid!"
      })
    }).catch(err => {
      Toast({
        status: 'error',
        title: "Error while fetching dtails",
        description: err.response.data.message || err.response.data || err.message
      })
    })
  }

  return (
    <>
      <DashboardWrapper pageTitle={'LIC Services'}>
        <Box
          w={['full', 'lg']}
          p={4} rounded={8}
          boxShadow={'lg'}
          bg={'#FFF'}
        >
          <FormControl my={4}>
            <FormLabel>Policy Number</FormLabel>
            <Input name='canumber' onChange={Formik.handleChange} />
          </FormControl>
          <FormControl my={4}>
            <FormLabel>Email</FormLabel>
            <Input name='ad1' onChange={Formik.handleChange} />
          </FormControl>
          {billFetched ?
            <>
              <Box p={4} rounded={8} bg={'aqua'} my={4}>
                <Text>Details: </Text>
                <HStack><Text fontWeight={'semibold'}>User Name: </Text><Text>{beneDetails.userName}</Text></HStack>
                <HStack><Text fontWeight={'semibold'}>Due Date: </Text><Text>{beneDetails.dueDate}</Text></HStack>
                <HStack><Text fontWeight={'semibold'}>Bill Amount: </Text><Text>{beneDetails.billAmount}</Text></HStack>
                <HStack><Text fontWeight={'semibold'}>Cell Number: </Text><Text>{beneDetails.cellNumber}</Text></HStack>
              </Box>
              <FormControl my={4}>
                <FormLabel>Amount</FormLabel>
                <InputGroup>
                  <InputLeftElement children={'₹'} />
                  <Input type='number' name='amount' value={Formik.values.amount} onChange={Formik.handleChange} />
                </InputGroup>
              </FormControl>
            </> : null
          }
          {
            billFetched ?
              <Button colorScheme='whatsapp' onClick={onOpen}>Pay Bill</Button> :
              <Button colorScheme='twitter' onClick={fetchInfo}>Fetch Details</Button>
          }
        </Box>
      </DashboardWrapper>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Text>Please enter your MPIN to confirm this transaction</Text>
            <HStack p={4} justifyContent={'center'} spacing={4}>
              <PinInput otp onComplete={value=>setMpin(value)}>
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
                <Text color={'#FFF'} textTransform={'capitalize'}>Transaction {receipt.status ? "success" : "failed"}</Text>
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
                        <Text fontSize={14}
                          fontWeight={'medium'}
                          textTransform={'capitalize'}
                        >{item[0]}</Text>
                        <Text fontSize={14} >{`${item[1]}`}</Text>
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

export default Lic