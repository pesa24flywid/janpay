import React, { useEffect, useState } from 'react'
import {
  Box,
  HStack,
  VStack,
  Image,
  Text,
  Button,
  Stack,
} from '@chakra-ui/react'
import Head from 'next/head'
import Link from 'next/link'
import Sidebar from '../../hocs/Sidebar'
import Topbar from '../../hocs/Topbar'
import {
  Chart as ChartJs,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler,
  CategoryScale,
  LinearScale
} from 'chart.js'
import {
  Line
} from 'react-chartjs-2'
import { GiReceiveMoney, GiTakeMyMoney } from 'react-icons/gi'
import { FaMobile, FaMoneyBillAlt } from 'react-icons/fa'
import DataCard from '../../hocs/DataCard'
import SimpleAccordion from '../../hocs/SimpleAccordion'
import BankDetails from '../../hocs/BankDetails'

const Dashboard = () => {
  const [newNotification, setNewNotification] = useState(true)
  const [notifications, setNotifications] = useState([
    {
      title: "Under Maintainence",
      content: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque pariatur aut eos quae quisquam eveniet incidunt ad odio magni at."
    }
  ])

  useEffect(() => {

    // Check for new notifications

  }, [])

  // ChartJS Configuration
  ChartJs.register(LineElement, Tooltip, Legend, Filler, PointElement, CategoryScale, LinearScale)
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
  const labels = ['January', 'February', 'March', 'April', 'May'];

  // Sample Data for AePS Transactions
  const aepsData = [
    1200,
    2500,
    1100,
    800,
    1500,
  ]


  // Sample Data for DMT Transactions
  const dmtData = [
    3200,
    1500,
    8100,
    1200,
    1300,
  ]


  // Sample Data for Mobile Recharge
  const rechargeData = [
    867,
    1300,
    1800,
    912,
    1678,
  ]

  const chartData = {
    labels,
    datasets: [
      {
        label: "AePS",
        data: aepsData,
        borderColor: '#FF7B54',
        backgroundColor: '#FF7B54',
      },
      {
        label: "DMT",
        data: dmtData,
        borderColor: '#6C00FF',
        backgroundColor: '#6C00FF',
      },
      {
        label: "Mob. Recharge",
        data: rechargeData,
        borderColor: '#FFB100',
        backgroundColor: '#FFB100',
      },
    ]
  }


  return (
    <>
      <Head><title>Pesa24 - Dashboard</title></Head>
      <Box
        bg={'aliceblue'} p={[0, 4]}
        w={'full'} minH={'100vh'}>
        <HStack spacing={8} alignItems={'flex-start'}>
          {/* Sidebar */}
          <Sidebar />

          {/* Main Dashboard Container */}
          <Box
            display={'flex'}
            flexDir={'column'}
            flex={['unset', 7]}
            w={'full'}
          >
            <Topbar
              title={'Overview'}
              aeps={8000}
              dmt={6400}
              prepaid={2600}
              notification={true}
            />

            <Stack direction={['column', 'row']}
              w={'full'} py={8} spacing={[2, 4]}
              justifyContent={'space-between'}
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


            <Stack
              direction={['column', 'row']}
              justifyContent={['flex-start', 'space-between']}
            >
              <Box
                w={['full', 'md', 'xl']}
                p={4} rounded={12}
                bg={'white'}
                boxShadow={'md'}
              >
                <Text mb={2}>Recent Transactions</Text>
                <Line
                  width={'inherit'}
                  data={chartData}
                  options={options}
                />
              </Box>
              <Box
                w={'md'}
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

            <BankDetails />
          </Box>


        </HStack>
      </Box>
    </>
  )
}

export default Dashboard