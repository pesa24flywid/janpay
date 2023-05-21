import React, { useState } from 'react'
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
  InputLeftElement
} from '@chakra-ui/react'
import BackendAxios from '../../../../lib/axios'
import { useFormik } from 'formik'


const Lic = () => {
  const [billFetched, setBillFetched] = useState(false)
  const [beneDetails, setBeneDetails] = useState({
    userName: "",
    dueDate: "",
    cellNumber: "",
    billAmount: ""
  })
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
    BackendAxios.post("/api/paysprint/lic/fetch-bill").then(res => {
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
  function payBill(){
    BackendAxios.post("/api/paysprint/lic/pay-bill", {...beneDetails}).then(res => {
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
            <Button colorScheme='whatsapp' onClick={payBill}>Pay Bill</Button> :
            <Button colorScheme='twitter' onClick={fetchInfo}>Fetch Details</Button> 
          }
        </Box>
      </DashboardWrapper>
    </>
  )
}

export default Lic