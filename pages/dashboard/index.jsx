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
  Image,
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
import { FaCar, FaFingerprint, FaMobile, FaMoneyBillAlt } from 'react-icons/fa'
import DataCard, { TransactionCard } from '../../hocs/DataCard'
import SimpleAccordion from '../../hocs/SimpleAccordion'
import DashboardWrapper from '../../hocs/DashboardLayout'
import Link from 'next/link'
import BackendAxios from '../../lib/axios'
import { BiIdCard, BiMobileAlt, BiRupee } from 'react-icons/bi'
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { BsArrowRight, BsHeartFill } from 'react-icons/bs'

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

  const images = [
    'https://cdn.corporatefinanceinstitute.com/assets/online-payment-companies-1024x683.jpeg',
    'https://images.gizbot.com/fit-in/img/600x338/2020/11/ds4-1605688425.jpg',
    'https://sbnri.com/blog/wp-content/uploads/2022/09/Bharat-Bill-Payment-1.jpg',
    // Add more image URLs as needed
  ];

  return (
    <>
      <DashboardWrapper titleText='Dashboard'>
        <Show
          below='md'
        >
          <Box>
            <Box mt={8} w={'full'} h={'36'} rounded={16} boxShadow={'lg'} overflow={'hidden'} showArrows={false} showStatus={false}>
              <Carousel autoPlay infiniteLoop>
                {images.map((image, index) => (
                  <div key={index}>
                    <img src={image} alt={`Image ${index + 1}`} />
                  </div>
                ))}
              </Carousel>
            </Box>

            <Box
              width={'100%'}
              rounded={16}
              boxShadow={'lg'}
              py={4} px={4} marginTop={8}
              bgImage={'/mobileBg.svg'}
              bgAttachment={'fixed'}
            >
              <Text color={'#FFF'} fontSize={'xs'}>Explore Our Services</Text>
              <br />
              <HStack justifyContent={'space-between'}>

                <Link href={'/dashboard/services/aeps?pageId=services'} style={{ flex: 1 }}>
                  <VStack>
                    <FaFingerprint fontSize={20} color='#FFF' />
                    <Text
                      textAlign={'center'}
                      color={'#FFF'}
                      fontSize={'xs'}
                    >AePS</Text>
                  </VStack>
                </Link>

                <Link href={'/dashboard/services/bbps?pageId=services'} style={{ flex: 1 }}>
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

                <Link href={'/dashboard/services/dmt?pageId=services'} style={{ flex: 1 }}>
                  <VStack>
                    <BiRupee fontSize={20} color='#FFF' />
                    <Text
                      textAlign={'center'}
                      color={'#FFF'}
                      fontSize={'xs'}
                    >DMT</Text>
                  </VStack>
                </Link>

                <Link href={'/dashboard/services/recharge?pageId=services'} style={{ flex: 1 }}>
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
              <br /><br />
              <HStack justifyContent={'space-between'}>

                <Link href={'/dashboard/services/fastag?pageId=services'} style={{ flex: 1 }}>
                  <VStack>
                    <FaCar fontSize={20} color='#FFF' />
                    <Text
                      textAlign={'center'}
                      color={'#FFF'}
                      fontSize={'xs'}
                    >Fastag</Text>
                  </VStack>
                </Link>

                <Link href={'/dashboard/services/lic?pageId=services'} style={{ flex: 1 }}>
                  <VStack>
                    <BsHeartFill fontSize={18} color='#FFF' />
                    <Text
                      textAlign={'center'}
                      color={'#FFF'}
                      fontSize={'xs'}
                    >LIC</Text>
                  </VStack>
                </Link>

                <Link href={'/dashboard/services/pan?pageId=services'} style={{ flex: 1 }}>
                  <VStack>
                    <BiIdCard fontSize={20} color='#FFF' />
                    <Text
                      textAlign={'center'}
                      color={'#FFF'}
                      fontSize={'xs'}
                    >PAN Card</Text>
                  </VStack>
                </Link>

                <Link href={'/dashboard/services/axis?pageId=services'} style={{ flex: 1 }}>
                  <VStack>
                    <Image src='/axisbank.svg' boxSize={5} objectFit={'contain'} />
                    <Text
                      textAlign={'center'}
                      color={'#FFF'}
                      fontSize={'xs'}
                    >Axis Bank</Text>
                  </VStack>
                </Link>

              </HStack>
            </Box>

            <Box w={'full'} mt={8} p={4} rounded={16} boxShadow={'lg'} bgColor={'#FFF'}>
              <HStack>
                <Text fontSize={'lg'} maxW={'50%'} fontWeight={'semibold'}>Boost Your Income With Us!</Text>
                <Link href={'/dashboard/services/activate?pageId=services'}>
                  <Button size={'sm'} variant={'outline'} rounded={'full'} fontSize={'xs'} colorScheme='twitter' rightIcon={<BsArrowRight size={12} color='#E4A5FF' />}>Activate Services</Button>
                </Link>
              </HStack>
            </Box>
            <Text my={8} fontWeight={'semibold'}>Your Transaction Reports</Text>
            <HStack>
              <VStack flex={1} p={2} rounded={8} bgColor={'#FFF'} boxShadow={'md'}>
                <Image src='https://onlinedigitalsevakendra.in/Content/HomePage/images/logoslider/6.png' boxSize={16} objectFit={'contain'} />
                <Text fontSize={'xs'} textAlign={'center'}>AePS</Text>
                <Link href={'/dashboard/reports/aeps?pageId=reports'}>
                  <Button colorScheme='whatsapp' size={'xs'} rounded={'full'}>View</Button>
                </Link>
              </VStack>
              <VStack flex={1} p={2} rounded={8} bgColor={'#FFF'} boxShadow={'md'}>
                <Image src='https://setu.co/_next/static/media/b_assured.8a87bea7.png' boxSize={16} width={12} objectFit={'contain'} />
                <Text fontSize={'xs'} textAlign={'center'}>BBPS</Text>
                <Link href={'/dashboard/reports/bbps?pageId=reports'}>
                  <Button colorScheme='whatsapp' size={'xs'} rounded={'full'}>View</Button>
                </Link>              </VStack>
              <VStack flex={1} p={2} rounded={8} bgColor={'#FFF'} boxShadow={'md'}>
                <Image src='/money-transfer.png' boxSize={16} width={12} objectFit={'contain'} />
                <Text fontSize={'xs'} textAlign={'center'}>DMT</Text>
                <Link href={'/dashboard/reports/dmt?pageId=reports'}>
                  <Button colorScheme='whatsapp' size={'xs'} rounded={'full'}>View</Button>
                </Link>
              </VStack>
            </HStack>
            <HStack pt={8}>
              <VStack flex={1} p={2} rounded={8} bgColor={'#FFF'} boxShadow={'md'}>
                <Image src='/mobile.png' boxSize={16} width={12} objectFit={'contain'} />
                <Text fontSize={'xs'} textAlign={'center'}>Recharge</Text>
                <Link href={'/dashboard/reports/recharge?pageId=reports'}>
                  <Button colorScheme='whatsapp' size={'xs'} rounded={'full'}>View</Button>
                </Link>
              </VStack>
              <VStack flex={1} p={2} rounded={8} bgColor={'#FFF'} boxShadow={'md'}>
                <Image src='/payout.png' boxSize={16} w={12} objectFit={'contain'} />
                <Text fontSize={'xs'} textAlign={'center'}>Payout</Text>
                <Link href={'/dashboard/reports/payout?pageId=reports'}>
                  <Button colorScheme='whatsapp' size={'xs'} rounded={'full'}>View</Button>
                </Link>
              </VStack>
              <VStack flex={1} p={2} rounded={8} bgColor={'#FFF'} boxShadow={'md'}>
                <Image src='/report.png' boxSize={16} width={12} objectFit={'contain'} />
                <Text fontSize={'xs'} textAlign={'center'}>All Reports</Text>
                <Link href={'/dashboard/mobile/reports?pageId=reports'}>
                  <Button colorScheme='facebook' size={'xs'} rounded={'full'}>View All</Button>
                </Link>
              </VStack>
            </HStack>
          </Box>
        </Show>

        <Show above='md'>
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
        </Show>

      </DashboardWrapper>

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
    </>
  )
}

export default Dashboard