// PaySprint Recharge Handling

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
  Flex,
  VStack,
  useToast,
  RadioGroup,
  Radio,
  InputGroup,
  InputLeftAddon
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
import axios, { ClientAxios } from '../../../../lib/axios'
import { FormAxios } from '../../../../lib/axios'


const Bbps = () => {
  const [keyword, setKeyword] = useState("")

  const [categories, setCategories] = useState()
  const [selectedCategory, setSelectedCategory] = useState()

  const [operators, setOperators] = useState()
  const [selectedOperatorId, setSelectedOperatorId] = useState('')
  const [selectedOperatorName, setSelectedOperatorName] = useState('')
  const [networkCircle, setNetworkCircle] = useState("")
  const [operatorMenuStatus, setOperatorMenuStatus] = useState(true)

  const [operatorParams, setOperatorParams] = useState()

  const [circleForm, setCircleForm] = useState(false)

  const [hlrResponse, setHlrResponse] = useState([])
  const [plans, setPlans] = useState()
  const [selectedPlan, setSelectedPlan] = useState('')
  const [amount, setAmount] = useState(selectedPlan)

  const [fetchBillBtn, setFetchBillBtn] = useState(false)
  const [fetchInfoBtn, setFetchInfoBtn] = useState(false)

  const formRef = useRef()
  const Toast = useToast()

  useEffect(() => {
    ClientAxios.post("/api/paysprint/category/all").then((res) => {
      setCategories(res.data)
    }).catch((err) => {
      Toast({
        status: "error",
        title: "Error Occured",
        description: err.message,
      })
      console.log(err)
    })
  }, [])


  function fetchOperators(keyword) {
    setOperatorMenuStatus(false)
    setSelectedOperatorId('')
    setSelectedOperatorName('')
    setOperatorParams()
    setCircleForm(false)
    setPlans()
    setKeyword(keyword)
    axios.get(`api/paysprint/bbps/mobile-operators/${keyword}`).then((res) => {
      setOperators(Object.values(res.data))
      setOperatorMenuStatus(true)
    }).catch((err) => {
      Toast({
        status: "error",
        title: "Error Occured",
        description: err.message,
      })
      console.log(err)
    })
  }

  function fetchParams(operator_id, operator_name) {
    setSelectedOperatorId(operator_id)
    setSelectedOperatorName(operator_name)
    setOperatorParams()
    axios.get(`api/paysprint/bbps/mobile-operators/parameter/${operator_id}`).then((res) => {
      setOperatorParams(Object.values(res.data))
      keyword == "Postpaid" || keyword == "Landline" ? setFetchBillBtn(true) : setFetchBillBtn(false)
      keyword == "PREPAID" ? setFetchInfoBtn(true) : setFetchInfoBtn(false)
    }).catch((err) => {
      console.log(err)
    })
  }



  function browsePlan() {
    setPlans()
    axios.post(`api/paysprint/bbps/mobile-recharge/browse`, {
      selectedOperatorName,
      networkCircle,
    }).then((res) => {
      setPlans(res.data.TOPUP)
    }).catch((err) => {
      Toast({
        status: "error",
        title: "No plans found",
        description: err.message
      })
      setPlans()
    })
  }

  function hlrRequest() {
    axios.get(`api/paysprint/bbps/mobile-recharge/hlr`, {
      selectedOperatorName,
      networkCircle,
    }).then((res) => {
      if (res.data.status != false) {
        setHlrResponse(res.data)
      }
      else {
        Toast({
          status: "error",
          title: "We're facing some issues.",
          description: "Please enter details manually",
        })
        setFetchInfoBtn(false)
        setCircleForm(true)
        setHlrResponse()
      }
    }).catch((err) => {
      Toast({
        status: "error",
        title: "We're facing some issues.",
        description: "Please enter details manually",
      })
      setFetchInfoBtn(false)
      setCircleForm(true)
      setHlrResponse()
    })
  }

  function fetchBill() {
    let formData = new FormData(document.getElementById('psRechargeForm'))
    FormAxios.post("api/eko/bbps/fetch-bill",
      formData
    )
  }


  return (
    <>
      <DashboardWrapper titleText={'PaySprint Transaction'}>
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
            {categories &&
              categories.map((item, key) => {

                return (
                  <Stack w={['full']}
                    px={4} py={[3, 4]}
                    _hover={{ bg: "aqua" }}
                    direction={['row']}
                    spacing={2} key={key} alignItems={'center'}
                    cursor={'pointer'} onClick={() => fetchOperators(item.keyword)}
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
                                                            ? <FaMoneyBillAlt /> : null
                    }
                    <Text textTransform={'capitalize'}>{item.operator_category_name}</Text>
                  </Stack>
                )
              })
            }
          </VStack>
          <Box p={4} w={['full', '85%']} h={['auto', 'xl']} overflowY={['scroll']}>

            {
              operators ?
                <FormControl id={'operator'}>
                  <FormLabel>Select Operator</FormLabel>
                  <Select
                    name={'operator'} w={['full', 'xs']}
                    value={selectedOperatorId}
                    onChange={(e) => fetchParams(e.target.value, e.target.title)}
                    isDisabled={!operatorMenuStatus}
                    placeholder={'Select Operator'}
                  >
                    {
                      operators.map((operator) => {
                        return (
                          <option value={operator.id} title={operator.name}>{operator.name}</option>
                        )
                      })
                    }
                  </Select>
                </FormControl> : null
            }


            {
              operatorParams ?
                <form action="" method='POST' ref={formRef} id={'psRechargeForm'}>
                  <input type="hidden" name="operator_id" value={selectedOperatorName} />
                  <Stack
                    my={6}
                    direction={['column']}
                    spacing={6}
                  >
                    {
                      operatorParams.map((parameter, key) => {

                        {
                          return (
                            <FormControl id={"canumber"} w={['full', 'xs']} key={key}>
                              <FormLabel>{parameter.displayname || "Enter Number"}</FormLabel>
                              <Input type={'text'} pattern={parameter.regex} name={"canumber"} />
                            </FormControl>
                          )
                        }

                      })
                    }

                  </Stack>
                  {
                    circleForm ?
                      <Stack
                        my={6}
                        direction={['column']}
                        spacing={6}
                        w={['full', 'xs']}
                      >
                        <FormControl id='networkCircle'>
                          <FormLabel>Select Network Circle</FormLabel>
                          <Select name='networkCircle' placeholder='Select Circle' onChange={(e) => setNetworkCircle(e.target.value)}>
                            <option value="Andhra Pradesh Mobileangana">Andhra Pradesh Mobileangana</option>
                            <option value="Assam">Assam</option>
                            <option value="Bihar Jharkhand">Bihar Jharkhand</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Delhi NCR">Delhi NCR</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Haryana">Haryana</option>
                            <option value="Himachal Pradesh">Himachal Pradesh</option>
                            <option value="Jammu Kashmir">Jammu Kashmir</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Kolkata">Kolkata</option>
                            <option value="Madhya Pradesh Chhattisgarh">Madhya Pradesh Chhattisgarh</option>
                            <option value="Maharashtra Goa">Maharashtra Goa</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="North East">North East</option>
                            <option value="Orissa">Orissa</option>
                            <option value="Punjab">Punjab</option>
                            <option value="Rajasthan">Rajasthan</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="UP East">UP East</option>
                            <option value="UP West">UP West</option>
                            <option value="West Bengal">West Bengal</option>
                          </Select>
                        </FormControl>
                        <Button onClick={() => browsePlan()}>Browse Plans</Button>
                      </Stack> : null
                  }

                  {
                    plans ?
                      <>
                        <FormLabel mt={6}>Select Plan</FormLabel>
                        <RadioGroup
                          name="plan" p={4}
                          id="plan" mb={6}
                          value={selectedPlan}
                          onChange={(value)=>{setSelectedPlan(value)}}
                          w={['full', '2xl']}
                          overflowX={'scroll'}
                          bg={'aqua'}
                          rounded={12}
                        >
                          <HStack w={'max'}>
                            {
                              plans.map((plan, key) => {
                                return (
                                  <Box
                                    p={3} key={key}
                                    w={['full', '56']}
                                    bg={'white'}
                                    rounded={12}
                                    boxShadow={'lg'}
                                  >
                                    <Radio value={plan.rs} w={'full'}>
                                      <Text fontSize={'xl'} fontWeight={'semibold'}>₹ {plan.rs}</Text>
                                      <Text fontSize={'xs'}>{plan.desc}</Text>
                                    </Radio>
                                  </Box>
                                )
                              })
                            }
                          </HStack>
                        </RadioGroup>

                        <FormControl id='amount' name="amount" w={['full', 'xs']} my={6}>
                          <FormLabel>or enter custom amount</FormLabel>
                          <InputGroup>
                          <InputLeftAddon children={'₹'} />
                          <Input type={'number'} value={ selectedPlan || amount } onChange={(e) => { setAmount(e.target.value); setSelectedPlan('') }} />
                          </InputGroup>
                        </FormControl>
                        <Button colorScheme={'whatsapp'}>Pay Now</Button>
                      </> : null
                  }


                  {
                    fetchBillBtn && <Button colorScheme={'facebook'} onClick={() => fetchBill()}>Fetch Bill</Button>
                  }
                  {
                    fetchInfoBtn && <Button colorScheme={'twitter'} onClick={() => hlrRequest()}>Fetch Info</Button>
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