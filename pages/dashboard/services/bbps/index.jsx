import React, { useState, useEffect, useRef } from 'react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Stack,
  HStack,
  VStack,
  useToast
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
  BsPlayBtnFill,
  BsCurrencyRupee
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
import { useFormik } from 'formik'
import BackendAxios, { FormAxios, ClientAxios } from '../../../../lib/axios'
import Cookies from 'js-cookie'


const Bbps = () => {
  const [bbpsProvider, setBbpsProvider] = useState("paysprint")
  const Toast = useToast({ position: 'top-right' })
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
      Toast({
        title: 'Try again later',
        description: 'We are facing some issues.'
      })
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

  const formRef = useRef(null)

  const [latlong, setLatlong] = useState("")


  // Fetch all available categories
  useEffect(() => {
    if (bbpsProvider == "eko") {
      BackendAxios.get(`api/${bbpsProvider}/bbps/operators/categories`).then((res) => {
        setCategories(res.data.data)
      }).catch((err) => {
        console.log(err)
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
  }, [])

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

  function fetchBill(e) {
    e.preventDefault()
    let formData = new FormData(document.getElementById('bbpsForm'))
    if (bbpsProvider == "eko") {
      FormAxios.post(`api/${bbpsProvider}/bbps/fetch-bill`,
        formData
      )
    }
    if (bbpsProvider == "paysprint") {
      FormAxios.post(`api/${bbpsProvider}/bbps/fetch-bill`,
        formData
      ).then(res => {
        console.log(res.data)
        setFetchBillResponse(res.data)
      }).catch(err => {
        Toast({
          status: 'error',
          description: err.response.data.message || err.response.data || err.message
        })
      })
    }
  }

  function payBill(e) {
    e.preventDefault()
    let formData = new FormData(document.getElementById('bbpsForm'))
  }

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
                        item.operator_category_name.includes("Mobile")
                          ? <FaMobile /> :
                          item.operator_category_name.includes("Broadband")
                            ? <HiServerStack /> :
                            item.operator_category_name.includes("Gas") || item.operator_category_name.includes("LPG")
                              ? <AiFillFire /> :
                              item.operator_category_name.includes("DTH")
                                ? <FaSatelliteDish /> :
                                item.operator_category_name.includes("Card")
                                  ? <BsCreditCardFill /> :
                                  item.operator_category_name.includes("Electricity")
                                    ? <BsLightningChargeFill /> :
                                    item.operator_category_name.includes("Landline")
                                      ? <GiRotaryPhone /> :
                                      item.operator_category_name.includes("Water")
                                        ? <BsDropletFill /> :
                                        item.operator_category_name.includes("Housing") || item.operator_category_name.includes("Rental")
                                          ? <BsHouseDoorFill /> :
                                          item.operator_category_name.includes("Education")
                                            ? <GoMortarBoard /> :
                                            item.operator_category_name.includes("Tax")
                                              ? <BiRupee /> :
                                              item.operator_category_name.includes("Associations")
                                                ? <FaUsers /> :
                                                item.operator_category_name.includes("TV")
                                                  ? <FiMonitor /> :
                                                  item.operator_category_name.includes("Hospital") || item.operator_category_name.includes("Donation")
                                                    ? <FaHeart /> :
                                                    item.operator_category_name.includes("Insurance")
                                                      ? <BsEmojiSmileFill /> :
                                                      item.operator_category_name.includes("Loan")
                                                        ? <GiMoneyStack /> :
                                                        item.operator_category_name.includes("FASTag")
                                                          ? <FaCar /> :
                                                          item.operator_category_name.includes("Municipal Services")
                                                            ? <FaCity /> :
                                                            item.operator_category_name.includes("Subscription")
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
                      setFetchBillBtn(true)
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
                                <FormLabel>{parameter.param_label}</FormLabel>
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
                        <FormControl id={'senderName'} w={['full', 'xs']} pb={6}>
                          <FormLabel>Confirmation Mobile Number</FormLabel>
                          <Input type={'tel'} maxLength={10} name='confirmation_mobile_no' />
                        </FormControl>
                        <input type="hidden" name='latlong' value={latlong} />
                      </>
                    }

                  </Stack>
                  {
                    fetchBillBtn ?
                      <Button colorScheme={'facebook'} onClick={(e) => fetchBill(e)}>Fetch Bill</Button> :
                      <Button colorScheme={'twitter'} onClick={(e) => payBill(e)}>Submit</Button>
                  }
                </form> : null
            }
          </Box>
        </Stack>
      </DashboardWrapper>
    </>
  )
}

export default Bbps