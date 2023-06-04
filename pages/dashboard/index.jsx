import React, { useEffect, useState } from 'react'
import {
  Box,
  Text,
  Stack,
  Button,
  HStack,
  Select,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Show,
  VStack,
  Hide,
  useToast,
} from '@chakra-ui/react'
import {
  Chart as ChartJs,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  Filler,
  CategoryScale,
  LinearScale
} from 'chart.js'
import {
  Pie
} from 'react-chartjs-2'
import { GiReceiveMoney, GiTakeMyMoney } from 'react-icons/gi'
import { FaFingerprint, FaMobile, FaMoneyBillAlt } from 'react-icons/fa'
import DataCard, { TransactionCard } from '../../hocs/DataCard'
import SimpleAccordion from '../../hocs/SimpleAccordion'
import DashboardWrapper from '../../hocs/DashboardLayout'
import Link from 'next/link'
import BackendAxios from '../../lib/axios'
import { BiMobileAlt, BiRupee } from 'react-icons/bi'

const Dashboard = () => {
  const [newNotification, setNewNotification] = useState(true)
  const [notifications, setNotifications] = useState([])
  let isProfileComplete
  const [profileAlert, setProfileAlert] = useState(false)
  const [aepsData, setAepsData] = useState({ count: 0, debit: 0, credit: 0 })
  const [bbpsData, setBbpsData] = useState({ count: 0, debit: 0, credit: 0 })
  const [dmtData, setDmtData] = useState({ count: 0, debit: 0, credit: 0 })
  const [panData, setPanData] = useState({ count: 0, debit: 0, credit: 0 })
  const [payoutData, setPayoutData] = useState({ count: 0, debit: 0, credit: 0 })
  const [licData, setLicData] = useState({ count: 0, debit: 0, credit: 0 })
  const [fastagData, setFastagData] = useState({ count: 0, debit: 0, credit: 0 })
  const [cmsData, setCmsData] = useState({ count: 0, debit: 0, credit: 0 })
  const [rechargeData, setRechargeData] = useState({ count: 0, debit: 0, credit: 0 })

  useEffect(() => {
    isProfileComplete = (localStorage.getItem("isProfileComplete") === "true")
    if (!isProfileComplete) {
      setProfileAlert(true)
    }
  }, [])

  function getOverview(tenure) {
    // Fetch transactions overview
    BackendAxios.get(`/api/user/overview?tenure=${tenure || "today"}`).then(res => {
      setAepsData(res.data[0].aeps)
      setBbpsData(res.data[1].bbps)
      setDmtData(res.data[2].dmt)
      setPanData(res.data[3].pan)
      setPayoutData(res.data[4].payout)
      setLicData(res.data[5].lic)
      setFastagData(res.data[6].fastag)
      setCmsData(res.data[7].cms)
      setRechargeData(res.data[8].recharge)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    getOverview()
  }, [])

  // ChartJS Configuration
  ChartJs.register(ArcElement, Tooltip, Legend, Filler, PointElement, CategoryScale, LinearScale)
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: false,
      },
    },
  };
  const labels = ['AePS', 'BBPS', 'DMT', 'PAN', 'LIC', 'CMS', 'Recharges', 'Fund Request'];

  // Sample Data for Chart
  const transactionData = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ]

  const chartData = {
    labels,
    datasets: [
      {
        label: "Earning Overview",
        data: transactionData,
        borderColor: '#FFFFFF',
        backgroundColor: [
          '#6C00FF',
          '#3C79F5',
          '#2DCDDF',
          '#F2DEBA',
          '#FF8B13',
          '#13005A',
          '#ABC270',
          '#678983',
        ],
      },
    ]
  }


  return (
    <>
      <DashboardWrapper titleText='Dashboard'>
        <Show
          below='md'
        >
          <Box
            width={'100%'}
            rounded={16}
            boxShadow={'lg'}
            py={2} px={4} marginTop={8}
            bgImage={'/mobileBg.svg'}
            bgAttachment={'fixed'}
          >
            <Text color={'#FFF'} fontSize={'xs'}>Explore Our Services</Text>
            <br />
            <HStack justifyContent={'space-between'}>

              <Link href={'/dashboard/services/aeps?pageId=services'}>
                <VStack>
                  <FaFingerprint fontSize={20} color='#FFF' />
                  <Text
                    textAlign={'center'}
                    color={'#FFF'}
                    fontSize={'xs'}
                  >AePS</Text>
                </VStack>
              </Link>

              <Link href={'/dashboard/services/bbps?pageId=services'}>
                <VStack>
                  <Text
                    fontWeight={'extrabold'}
                    color={'#FFF'}
                    w={5} h={5}
                    p={2} border={'1px'}
                    borderColor={'#FFF'}
                    rounded={'full'}
                    display={'grid'}
                    placeContent={'center'}
                    fontSize={12}
                  >B</Text>
                  <Text
                    textAlign={'center'}
                    color={'#FFF'}
                    fontSize={'xs'}
                  >Bill Pay</Text>
                </VStack>
              </Link>

              <Link href={'/dashboard/services/dmt?pageId=services'}>
                <VStack>
                  <BiRupee fontSize={20} color='#FFF' />
                  <Text
                    textAlign={'center'}
                    color={'#FFF'}
                    fontSize={'xs'}
                  >DMT</Text>
                </VStack>
              </Link>

              <Link href={'/dashboard/services/recharge?pageId=services'}>
                <VStack>
                  <BiMobileAlt fontSize={20} color='#FFF' />
                  <Text
                    textAlign={'center'}
                    color={'#FFF'}
                    fontSize={'xs'}
                  >Recharge</Text>
                </VStack>
              </Link>

            </HStack>
          </Box>
        </Show>

        <HStack justifyContent={'space-between'} py={4}>
          <Text>Your Earning Statistics</Text>
          <Select
            name='earningStatsDuration'
            w={'xs'} bg={'white'}
            onChange={e => getOverview(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="month">1 Month</option>
            <option value="year">1 Year</option>
          </Select>
        </HStack>
        <Stack direction={['row']}
          w={'full'} py={8} spacing={[0, 4]}
          justifyContent={'space-between'}
          flexWrap={'wrap'} alignItems={['flex-start']}
        >
          <DataCard
            title={'AePS Transactions'}
            data={aepsData?.credit - aepsData?.debit}
            icon={<GiReceiveMoney color='white' size={'32'} />}
            color={'#FF7B54'}
          />
          <DataCard
            title={'DMT Transactions'}
            data={dmtData?.debit - dmtData?.credit}
            icon={<FaMoneyBillAlt color='white' size={'32'} />}
            color={'#6C00FF'}
          />
          <DataCard
            title={'Mobile Recharge'}
            data={0}
            icon={<FaMobile color='white' size={'32'} />}
            color={'#FFB100'}
          />
          <DataCard
            title={'Your Earnings'}
            data={0}
            icon={<GiTakeMyMoney color='white' size={'32'} />}
            color={'#88A47C'}
          />
        </Stack>
        <Stack
          direction={['column', 'row']}
          py={2} spacing={4}
        >
          <TransactionCard
            color={'#6C00FF'}
            title={"AePS"}
            quantity={aepsData?.count}
            amount={aepsData?.credit - aepsData?.debit}
          />

          <TransactionCard
            color={'#3C79F5'}
            title={"BBPS"}
            quantity={bbpsData?.count}
            amount={bbpsData?.debit - bbpsData?.credit}
          />

          <TransactionCard
            color={'#2DCDDF'}
            title={"DMT"}
            quantity={dmtData?.count}
            amount={dmtData?.debit - dmtData?.credit}
          />
        </Stack>

        <Stack
          direction={['column', 'row']}
          py={2} spacing={4}
        >
          <TransactionCard
            color={'#F2DEBA'}
            title={"PAN"}
            quantity={panData?.count}
            amount={panData?.debit - panData?.credit}
          />

          <TransactionCard
            color={'#FF8B13'}
            title={"LIC"}
            quantity={licData?.count}
            amount={licData?.debit - licData?.credit}
          />

          <TransactionCard
            color={'#13005A'}
            title={"CMS"}
            quantity={cmsData?.count}
            amount={cmsData?.debit - cmsData?.credit}
          />

        </Stack>

        <Stack
          direction={['column', 'row']}
          py={2} spacing={4}
        >
          <TransactionCard
            color={'#13005A'}
            title={"Fastag"}
            quantity={fastagData?.count}
            amount={fastagData?.debit - fastagData?.credit}
          />

          <TransactionCard
            color={'#26845A'}
            title={"Payout"}
            quantity={payoutData?.count}
            amount={payoutData?.debit - payoutData?.credit}
          />

          <TransactionCard
            color={'#FF8B13'}
            title={"Recharge"}
            quantity={rechargeData?.count}
            amount={rechargeData?.debit - rechargeData?.credit}
          />

        </Stack>

        <Stack
          pt={4}
          direction={['column-reverse', 'row']}
          justifyContent={['flex-start', 'space-between']}
        >
          {/* <Box
            w={['full', 'md']}
            p={4} rounded={12}
            bg={'white'}
            boxShadow={'md'}
          >
            <HStack justifyContent={'space-between'} pb={4}>
              <Text>Your Earning Overview</Text>
              <Select name='earningChartDuration' w={'fit-content'} bg={'white'}>
                <option value="today">Today</option>
                <option value="month">1 Month</option>
                <option value="year">1 Year</option>
              </Select>
            </HStack>
            <Pie
              width={'inherit'}
              data={chartData}
              options={options}
            />
          </Box> */}
          <Hide below='md'>
            <Box
              w={['full', 'md', 'xl']}
              p={4} rounded={12}
              bg={'white'}
              boxShadow={'md'}
            >
              <Text mb={4}>New Notifications</Text>
              {newNotification ? (
                notifications.map((notification, key) =>
                  <SimpleAccordion
                    key={key}
                    title={notification.title}
                    content={notification.content}
                  />
                )
              ) : <Box display={'grid'} placeContent={'center'}>No new notifications</Box>}
            </Box>
          </Hide>

        </Stack>

        {/* Profile Incompletion Alert */}
        <Modal isOpen={profileAlert} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Incomplete Profile</ModalHeader>
            <ModalBody>
              Your profile is incomplete. Please complete your profile to start using our services.
            </ModalBody>

            <ModalFooter>
              <Link href={'/dashboard/profile/edit?pageId=profile'}>
                <Button colorScheme='blue' mr={3}>
                  Complete Now
                </Button>
              </Link>
              <Button variant='ghost' onClick={() => setProfileAlert(false)}>Finish Later</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </DashboardWrapper>
    </>
  )
}

export default Dashboard