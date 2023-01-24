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
import { FaMobile, FaMoneyBillAlt } from 'react-icons/fa'
import DataCard, { TransactionCard } from '../../hocs/DataCard'
import SimpleAccordion from '../../hocs/SimpleAccordion'
import DashboardWrapper from '../../hocs/DashboardLayout'
import Link from 'next/link'

const Dashboard = () => {
  const [newNotification, setNewNotification] = useState(true)
  const [notifications, setNotifications] = useState([
    {
      title: "Under Maintainence",
      content: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque pariatur aut eos quae quisquam eveniet incidunt ad odio magni at."
    }
  ])
  let isProfileComplete
  const [profileAlert, setProfileAlert] = useState(false)

  useEffect(() => {
    isProfileComplete = (localStorage.getItem("isProfileComplete") === "true")
    if (!isProfileComplete) {
      setProfileAlert(true)
    }

    // Check for new notifications


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
    1200,
    2500,
    1100,
    800,
    1500,
    2600,
    900,
    1800
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
        <Stack direction={['row']}
          w={'full'} py={8} spacing={[0, 4]}
          justifyContent={'space-between'}
          flexWrap={'wrap'} alignItems={['flex-start']}
        >
          <DataCard
            title={'AePS Transactions'}
            data={5600}
            icon={<GiReceiveMoney color='white' size={'32'} />}
            color={'#FF7B54'}
          />
          <DataCard
            title={'DMT Transactions'}
            data={5200}
            icon={<FaMoneyBillAlt color='white' size={'32'} />}
            color={'#6C00FF'}
          />
          <DataCard
            title={'Mobile Recharge'}
            data={4800}
            icon={<FaMobile color='white' size={'32'} />}
            color={'#FFB100'}
          />
          <DataCard
            title={'Your Earnings'}
            data={1800}
            icon={<GiTakeMyMoney color='white' size={'32'} />}
            color={'#88A47C'}
          />
        </Stack>

        <HStack justifyContent={'space-between'} py={4}>
          <Text>Your Earning Statistics</Text>
          <Select name='earningStatsDuration' w={'xs'} bg={'white'}>
            <option value="today">Today</option>
            <option value="month">1 Month</option>
            <option value="year">1 Year</option>
          </Select>
        </HStack>
        <Stack
          direction={['column', 'row']}
          py={2} spacing={4}
        >

          <TransactionCard
            color={'#6C00FF'}
            title={"AePS"}
            quantity={"8"}
            amount={"8600"}
          />

          <TransactionCard
            color={'#3C79F5'}
            title={"BBPS"}
            quantity={"8"}
            amount={"8600"}
          />

          <TransactionCard
            color={'#2DCDDF'}
            title={"DMT"}
            quantity={"8"}
            amount={"8600"}
          />
        </Stack>

        <Stack
          direction={['column', 'row']}
          py={2} spacing={4}
        >
          <TransactionCard
            color={'#F2DEBA'}
            title={"PAN"}
            quantity={"8"}
            amount={"8600"}
          />

          <TransactionCard
            color={'#FF8B13'}
            title={"LIC"}
            quantity={"8"}
            amount={"8600"}
          />

          <TransactionCard
            color={'#13005A'}
            title={"CMS"}
            quantity={"8"}
            amount={"8600"}
          />

        </Stack>

        <Stack
          direction={['column', 'row']}
          py={2} spacing={4}
        >
          <TransactionCard
            color={'#ABC270'}
            title={"Recharges"}
            quantity={"8"}
            amount={"8600"}
          />

          <TransactionCard
            color={'#678983'}
            title={"Fund Requests"}
            quantity={"8"}
            amount={"8600"}
          />

        </Stack>

        <Stack
          pt={4}
          direction={['column-reverse', 'row']}
          justifyContent={['flex-start', 'space-between']}
        >
          <Box
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
          </Box>
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
              <Link href={'/dashboard/profile/edit'}>
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