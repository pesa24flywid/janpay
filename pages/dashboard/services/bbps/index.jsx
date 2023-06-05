import React, { useState, useEffect, useRef } from 'react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Image,
  PinInput,
  PinInputField,
  Select,
  Button,
  Stack,
  HStack,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalContent,
  useDisclosure
} from '@chakra-ui/react'
import { HiServerStack } from 'react-icons/hi2'
import { GiRotaryPhone, GiMoneyStack } from 'react-icons/gi'
import { GoMortarBoard } from 'react-icons/go'
import {
  BsCreditCardFill,
  BsLightningChargeFill,
  BsDropletFill,
  BsHouseDoorFill,
  BsEmojiSmileFill,
  BsCheck2Circle,
  BsXCircle,
  BsDownload,
} from 'react-icons/bs'
import { AiFillFire } from 'react-icons/ai'
import { FiMonitor } from 'react-icons/fi'
import {
  FaMobile,
  FaSatelliteDish,
  FaMoneyBillAlt,
  FaUsers,
  FaHeart,
  FaCar,
  FaCity,
} from 'react-icons/fa'
import { BiRupee } from 'react-icons/bi'
import BackendAxios, { FormAxios, ClientAxios } from '../../../../lib/axios'
import Cookies from 'js-cookie'
import Pdf from 'react-to-pdf'


const Bbps = () => {
  const [bbpsProvider, setBbpsProvider] = useState("")
  const Toast = useToast({ position: 'top-right' })
  const { isOpen, onOpen, onClose } = useDisclosure()
  useEffect(() => {

    ClientAxios.post('/api/user/fetch', {
      user_id: localStorage.getItem('userId')
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      if (res.data[0].allowed_pages.includes('bbpsTransaction') == false) {
        window.location.assign('/dashboard/not-allowed')
      }
    }).catch((err) => {
      console.log(err)
    })

    ClientAxios.get(`/api/global`).then(res => {
      setBbpsProvider(res.data[0].bbps_provider)
      if (!res.data[0].bbps_status) {
        window.location.href('/dashboard/not-available')
      }
    }).catch(err => {
      console.log(err)
    })

    ClientAxios.get(`/api/organisation`).then(res => {
      if (!res.data.bbps_status) {
        window.location.href('/dashboard/not-available')
      }
    }).catch(err => {
      console.log(err)
    })
  }, [])

  const [allData, setAllData] = useState([])

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState()

  const [operators, setOperators] = useState([])
  const [operatorListDisabled, setOperatorListDisabled] = useState(false)
  const [selectedOperator, setSelectedOperator] = useState()

  const [operatorParams, setOperatorParams] = useState()

  const [fetchBillBtn, setFetchBillBtn] = useState(false)
  const [fetchBillResponse, setFetchBillResponse] = useState({})

  const [amount, setAmount] = useState("")
  const [mpin, setMpin] = useState("")
  const formRef = useRef(null)

  const [latlong, setLatlong] = useState("")


  // Fetch all available categories
  useEffect(() => {
    if (bbpsProvider == "eko") {
      BackendAxios.get(`api/eko/bbps/operators/categories`).then((res) => {
        setCategories(res.data.data)
      }).catch((err) => {
        console.log(err)
        Toast({
          status: 'warning',
          title: "Error while fetching operators",
          description: err.response?.data?.message || err.response.data || err.message
        })
      })
    }
    if (bbpsProvider == "paysprint") {
      BackendAxios.get(`api/${bbpsProvider}/bbps/operators/categories`).then(res => {
        setAllData(Object.keys(res.data).map((item, key) => ({
          operator_category_name: item,
          operators: res.data[item],
          status: 1
        })))
        setCategories(Object.keys(res.data).map((item, key) => ({
          operator_category_name: item,
          status: 1
        })))
      }).catch(err => {
        console.log(err)
        Toast({
          status: 'warning',
          description: "Error while fetching operators"
        })
      })
    }
  }, [bbpsProvider])

  useEffect(() => {
    setLatlong(Cookies.get("latlong"))
    console.log(latlong)
  })


  function fetchOperators(category_id) {
    setSelectedOperator(null)
    setOperatorParams()
    if (bbpsProvider == "eko") {
      BackendAxios.get(`api/${bbpsProvider}/bbps/operators/${category_id}`).then((res) => {
        setOperators(res.data.data)
      }).catch((err) => {
        console.log(err)
      })
    }
    if (bbpsProvider == "paysprint") {
      setOperators(allData.filter(data => (category_id == data.operator_category_name))[0].operators)
    }
  }

  function fetchParams(operator_id) {
    if (bbpsProvider == "eko") {
      BackendAxios.get(`api/${bbpsProvider}/bbps/operators/fields/${operator_id}`).then((res) => {
        setSelectedOperator(operator_id)
        setOperatorParams(res.data.data)
        res.data.fetchBill == 1 ? setFetchBillBtn(true) : setFetchBillBtn(false)
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  // Fetch Bill
  function fetchBill(e) {
    e.preventDefault()
    let formData = new FormData(document.getElementById('bbpsForm'))
    if (bbpsProvider == "eko") {
      FormAxios.post(`api/${bbpsProvider}/bbps/fetch-bill`,
        formData
      ).then(res => {
        if (res.data.response_type_id == -1) {
          Toast({
            description: res.data.message || "Unable to fetch bill"
          })
          return
        }
        setFetchBillResponse(res.data.data)
        setAmount(res.data.data.amount)
        setFetchBillBtn(false)
      }).catch(err => {
        Toast({
          status: 'error',
          title: 'Error while fetching bill',
          description: err.response?.data?.message || err.response?.data || err.message
        })
      })
    }
    if (bbpsProvider == "paysprint") {
      FormAxios.post(`api/${bbpsProvider}/bbps/fetch-bill`,
        formData
      ).then(res => {
        setFetchBillResponse(res.data)
        if (res.data.status == false && parseInt(res.data.response_code) == 0) {
          Toast({
            description: res.data.message
          })
          return
        }
        setFetchBillBtn(false)
        setAmount(res.data.amount)
      }).catch(err => {
        Toast({
          status: 'error',
          description: err.response.data.message || err.response.data || err.message
        })
      })
    }
  }

  // Pay Bill
  function payBill(e) {
    e.preventDefault()
    let formData = new FormData(document.getElementById('bbpsForm'))
    if (bbpsProvider == "eko") {
      var object = {};
      formData.forEach(function (value, key) {
        object[key] = value;
      });
      BackendAxios.post(`api/${bbpsProvider}/bbps/pay-bill/12`,
        {
          ...object,
          mpin: mpin,
          ...(fetchBillResponse.length ? {bill : fetchBillResponse} : {}),
          utility_acc_no: object.utility_acc_no,
          confirmation_mobile_no: object.confirmation_mobile_no,
          amount: amount,
          latitude: latlong.split(",")[0],
          longitude: latlong.split(",")[1],
          latlong: latlong
        }
      ).then(res => {
        setReceipt({
          status: res.data.metadata?.status,
          show: true,
          data: res.data.metadata
        })
        onClose()
      }).catch(err => {
        if (err.response.status == 406) {
          Toast({
            status: 'error',
            description: 'MPIN is incorrect'
          })
          return
        }
        setReceipt({
          status: err.response.data?.metadata?.status,
          show: true,
          data: err.response.data?.metadata
        })
        onClose()
      })
    }
    if (bbpsProvider == "paysprint") {
      var object = {};
      formData.forEach(function (value, key) {
        object[key] = value;
      });
      BackendAxios.post(`api/${bbpsProvider}/bbps/pay-bill/12`,
        {
          ...object,
          mpin: mpin,
          bill: fetchBillResponse,
          amount: amount,
          latitude: latlong.split(",")[0],
          longitude: latlong.split(",")[1]
        }
      ).then(res => {
        setReceipt({
          status: res.data.metadata?.status,
          show: true,
          data: res.data.metadata
        })
        onClose()
      }).catch(err => {
        if (err.response.status == 406) {
          Toast({
            status: 'error',
            description: 'MPIN is incorrect'
          })
          return
        }
        setReceipt({
          status: err.response.data?.metadata?.status,
          show: true,
          data: err.response.data?.metadata
        })
        onClose()
      })
    }
  }

  const pdfRef = React.createRef()
  const [receipt, setReceipt] = useState({
    show: false,
    status: "success",
    data: {}
  })

  return (
    <>
      <DashboardWrapper titleText={'BBPS Transaction'}>
        <Stack
          w={'full'} bg={'white'}
          boxShadow={'md'} mt={6}
          rounded={12}
          direction={['column', 'row']}
        >
          <VStack
            w={['full', 'xs']} h={['sm', 'xl']}
            overflowY={['scroll']}
            alignItems={['flex-start']}
            justifyContent={['flex-start']}
            spacing={0} borderRightColor={['unset', '#999']}
            borderBottomColor={['#999', 'unset']}
            borderRight={[0, '1px']} borderBottom={['1px', 0]}
          >
            <Text p={4} pb={2}>Select Category</Text>
            {
              categories.map((item, key) => {

                return (
                  item.status == "1" ?
                    <Stack w={['full']}
                      px={4} py={[3, 4]}
                      _hover={{ bg: "aqua" }}
                      direction={['row']}
                      spacing={2} key={key} alignItems={'center'}
                      cursor={'pointer'} onClick={() => {
                        bbpsProvider == "eko" &&
                          fetchOperators(item.operator_category_id)
                        bbpsProvider == 'paysprint' &&
                          fetchOperators(item.operator_category_name)

                      }}
                    >
                      {
                        item.operator_category_name.toLowerCase().includes("mobile")
                          ? <FaMobile /> :
                          item.operator_category_name.toLowerCase().includes("broadband")
                            ? <HiServerStack /> :
                            item.operator_category_name.toLowerCase().includes("gas") || item.operator_category_name.toLowerCase().includes("lpg")
                              ? <AiFillFire /> :
                              item.operator_category_name.toLowerCase().includes("dth")
                                ? <FaSatelliteDish /> :
                                item.operator_category_name.toLowerCase().includes("card")
                                  ? <BsCreditCardFill /> :
                                  item.operator_category_name.toLowerCase().includes("electricity")
                                    ? <BsLightningChargeFill /> :
                                    item.operator_category_name.toLowerCase().includes("landline")
                                      ? <GiRotaryPhone /> :
                                      item.operator_category_name.toLowerCase().includes("water")
                                        ? <BsDropletFill /> :
                                        item.operator_category_name.toLowerCase().includes("housing") || item.operator_category_name.toLowerCase().includes("rental")
                                          ? <BsHouseDoorFill /> :
                                          item.operator_category_name.toLowerCase().includes("education")
                                            ? <GoMortarBoard /> :
                                            item.operator_category_name.toLowerCase().includes("tax")
                                              ? <BiRupee /> :
                                              item.operator_category_name.toLowerCase().includes("associations")
                                                ? <FaUsers /> :
                                                item.operator_category_name.toLowerCase().includes("tv")
                                                  ? <FiMonitor /> :
                                                  item.operator_category_name.toLowerCase().includes("hospital") || item.operator_category_name.toLowerCase().includes("donation")
                                                    ? <FaHeart /> :
                                                    item.operator_category_name.toLowerCase().includes("insurance")
                                                      ? <BsEmojiSmileFill /> :
                                                      item.operator_category_name.toLowerCase().includes("loan")
                                                        ? <GiMoneyStack /> :
                                                        item.operator_category_name.toLowerCase().includes("fastag")
                                                          ? <FaCar /> :
                                                          item.operator_category_name.toLowerCase().includes("municipal services")
                                                            ? <FaCity /> :
                                                            item.operator_category_name.toLowerCase().includes("subscription")
                                                              ? <FaMoneyBillAlt /> : <BiRupee />
                      }
                      <Text textTransform={'capitalize'}>{item.operator_category_name}</Text>
                    </Stack> : null
                )
              })
            }
          </VStack>
          <Box p={4}>

            {
              operators.length != 0 &&
              <FormControl id={'operator'}>
                <FormLabel>Select Operator</FormLabel>
                <Select
                  name={'operator'} w={['full', 'xs']}
                  value={selectedOperator}
                  placeholder='Select Here'
                  onChange={(e) => {
                    if (bbpsProvider == "eko") {
                      fetchParams(e.target.value)
                    }
                    if (bbpsProvider == "paysprint") {
                      let selectedOperator = operators.find((item) => (item.id == e.target.value))
                      setOperatorParams([{
                        param_type: "AlphaNumeric",
                        param_label: selectedOperator.displayname,
                        regex: "",
                        param_name: "canumber"
                      }])
                      if (selectedOperator.viewbill == "1") {
                        setFetchBillBtn(true)
                      }
                      if (selectedOperator.viewbill == "0") {
                        setFetchBillBtn(false)
                      }
                      setSelectedOperator(e.target.value)
                    }
                  }}
                >
                  {
                    operators.map((operator) => {
                      return (
                        <option value={operator.operator_id || operator.id}>{operator.name}</option>
                      )
                    })
                  }
                </Select>
              </FormControl>
            }


            {
              operatorParams ?
                <form action="" method='POST' ref={formRef} id={'bbpsForm'}>
                  <input type="hidden" name="operator_id" value={selectedOperator} />
                  <Stack
                    my={6}
                    direction={['column']}
                    spacing={6}
                  >
                    {
                      operatorParams.map((parameter, key) => {

                        {

                          if (parameter.param_type == "Numeric") {
                            return (
                              <FormControl id={parameter.param_name} w={['full', 'xs']}>
                                <FormLabel>{parameter.param_label}</FormLabel>
                                <Input type={'number'} pattern={parameter.regex} name={parameter.param_name} />
                              </FormControl>
                            )
                          }

                          if (parameter.param_type == "AlphaNumeric") {
                            return (
                              <FormControl id={parameter.param_name} w={['full', 'xs']}>
                                <FormLabel>{parameter.param_label || "CA Number"}</FormLabel>
                                <Input type={'text'} pattern={parameter.regex} name={parameter.param_name} />
                              </FormControl>
                            )
                          }

                          if (parameter.param_type == "List") {
                            return (
                              <FormControl id={parameter.param_name} w={['full', 'xs']}>
                                <FormLabel>{parameter.param_label}</FormLabel>
                                <Select name={parameter.param_name}>
                                  <option value="1">Option 1</option>
                                  <option value="2">Option 2</option>
                                </Select>
                              </FormControl>
                            )
                          }

                        }

                      })
                    }

                    {
                      fetchBillBtn && bbpsProvider == "eko" &&
                      <>
                        <FormControl id={'senderName'} w={['full', 'xs']} pb={6}>
                          <FormLabel>Sender Name</FormLabel>
                          <Input name='sender_name' />
                        </FormControl>
                        <FormControl id={'confirmation_mobile_no'} w={['full', 'xs']} pb={6}>
                          <FormLabel>Confirmation Mobile Number</FormLabel>
                          <Input type={'tel'} maxLength={10} name='confirmation_mobile_no' />
                        </FormControl>
                        <input type="hidden" name='latlong' value={latlong} />
                      </>
                    }
                    {
                      fetchBillBtn ||
                      <FormControl id={'amount'} w={['full', 'xs']} pb={6}>
                        <FormLabel>Bill Amount</FormLabel>
                        <Input type={'tel'} isDisabled={fetchBillBtn} name='amount' value={amount} onChange={e => setAmount(e.target.value)} />
                      </FormControl>
                    }
                  </Stack>
                  {
                    fetchBillBtn ?
                      <Button colorScheme={'facebook'} onClick={(e) => fetchBill(e)}>Fetch Bill</Button> :
                      <Button colorScheme={'twitter'} onClick={onOpen}>Pay (₹{amount})</Button>
                  }
                </form> : null
            }
          </Box>
        </Stack>
      </DashboardWrapper>


      {/* MPIN Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Transaction</ModalHeader>
          <ModalBody>
            <VStack>
              <Text>Enter MPIN to confirm transaction</Text>
              <HStack gap={4}>
                <PinInput onComplete={value => setMpin(value)}>
                  <PinInputField bg={'aqua'} />
                  <PinInputField bg={'aqua'} />
                  <PinInputField bg={'aqua'} />
                  <PinInputField bg={'aqua'} />
                </PinInput>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={'flex-end'} gap={6}>
              <Button onClick={onClose}>Cancel</Button>
              <Button colorScheme='twitter' onClick={(e) => payBill(e)}>Submit</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>


      {/* Receipt */}
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
                <Text color={'#FFF'} textTransform={'capitalize'}>₹ {bbpsProvider == "paysprint" ? receipt.data.amount : receipt.data.amount}</Text>
                <Text color={'#FFF'} fontSize={'sm'} textTransform={'uppercase'}>TRANSACTION {receipt.status ? "success" : "failed"}</Text>
              </VStack>
            </ModalHeader>
            <ModalBody p={0} bg={'azure'}>
              <VStack w={'full'} p={4} bg={'#FFF'}>
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
                <VStack pt={8} w={'full'}>
                  <HStack pb={1} justifyContent={'space-between'} w={'full'}>
                    <Text fontSize={'xs'} fontWeight={'semibold'}>Merchant:</Text>
                    <Text fontSize={'xs'}>{receipt.data.user}</Text>
                  </HStack>
                  <HStack pb={1} justifyContent={'space-between'} w={'full'}>
                    <Text fontSize={'xs'} fontWeight={'semibold'}>Merchant ID:</Text>
                    <Text fontSize={'xs'}>{receipt.data.user_id}</Text>
                  </HStack>
                  <HStack pb={1} justifyContent={'space-between'} w={'full'}>
                    <Text fontSize={'xs'} fontWeight={'semibold'}>Merchant Mobile:</Text>
                    <Text fontSize={'xs'}>{receipt.data.user_phone}</Text>
                  </HStack>
                  <Image src='/logo_long.png' w={'20'} />
                  <Text fontSize={'xs'}>{process.env.NEXT_PUBLIC_ORGANISATION_NAME}</Text>
                </VStack>
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

export default Bbps