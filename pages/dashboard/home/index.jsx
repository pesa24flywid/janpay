import React, { useState, useEffect } from 'react'
import DashboardWrapper from '../../../hocs/DashboardLayout'
import {
    Box,
    Button,
    HStack,
    Icon,
    Image,
    Stack,
    Text,
    VStack,
    useToast
} from '@chakra-ui/react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Link from 'next/link'
import { FaCar, FaCity, FaFingerprint, FaHeart, FaMobile, FaMoneyBillAlt, FaRegMoneyBillAlt, FaSatelliteDish, FaUsers } from 'react-icons/fa'
import { BiIdCard, BiMobileAlt, BiRupee } from 'react-icons/bi'
import { BsArrowRight, BsCreditCardFill, BsCurrencyRupee, BsDropletFill, BsEmojiSmileFill, BsHeartFill, BsHouseDoorFill, BsLightningChargeFill } from 'react-icons/bs'
import { IoMdFingerPrint, IoMdUmbrella } from 'react-icons/io'
import BackendAxios, { ClientAxios } from '../../../lib/axios'
import Marquee from 'react-fast-marquee'
import Loader from '../../../hocs/Loader'
import { HiServerStack } from 'react-icons/hi2'
import { AiFillFire } from 'react-icons/ai'
import { GiMoneyStack, GiRotaryPhone } from 'react-icons/gi'
import { GoMortarBoard } from 'react-icons/go'
import { FiMonitor } from 'react-icons/fi'

const Index = () => {
    const Toast = useToast({ position: 'top-right' })
    const [isLoading, setIsLoading] = useState(false)
    const images = [
        'https://cdn.corporatefinanceinstitute.com/assets/online-payment-companies-1024x683.jpeg',
        'https://images.gizbot.com/fit-in/img/600x338/2020/11/ds4-1605688425.jpg',
        'https://sbnri.com/blog/wp-content/uploads/2022/09/Bharat-Bill-Payment-1.jpg',
        // Add more image URLs as needed
    ];
    const [aepsData, setAepsData] = useState({ count: 0, debit: 0, credit: 0 })
    const [bbpsData, setBbpsData] = useState({ count: 0, debit: 0, credit: 0 })
    const [dmtData, setDmtData] = useState({ count: 0, debit: 0, credit: 0 })
    const [rechargeData, setRechargeData] = useState({ count: 0, debit: 0, credit: 0 })
    const [payoutData, setPayoutData] = useState({ count: 0, debit: 0, credit: 0 })
    const [bbpsProvider, setBbpsProvider] = useState("")
    const [categories, setCategories] = useState([])

    // Fetch all available categories
    useEffect(() => {
        setIsLoading(true)
        if (bbpsProvider == "eko") {
            BackendAxios.get(`api/eko/bbps/operators/categories`).then((res) => {
                setCategories(res.data.data)
                setIsLoading(false)
            }).catch((err) => {
                console.log(err)
                setIsLoading(false)
                Toast({
                    status: 'warning',
                    title: "Error while fetching operators",
                    description: err.response?.data?.message || err.response?.data || err.message
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
                setIsLoading(false)
            }).catch(err => {
                console.log(err)
                Toast({
                    status: 'warning',
                    description: "Error while fetching operators"
                })
                setIsLoading(false)
            })
        }
    }, [bbpsProvider])

    useEffect(() => {
        setIsLoading(true)
        BackendAxios.get('/api/user/overview?tenure=today').then(res => {
            setAepsData(res.data[0].aeps)
            setBbpsData(res.data[1].bbps)
            setDmtData(res.data[2].dmt)
            setRechargeData(res.data[8].recharge)
            setPayoutData(res.data[4].payout)
            setIsLoading(false)
        })

        ClientAxios.get(`/api/global`).then(res => {
            setBbpsProvider(res.data[0]?.bbps_provider)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    return (
        <>
            <DashboardWrapper pageTitle={'Home'}>
                {
                    isLoading ?
                        <Loader /> : null
                }
                <Box>
                    <Box py={2} bgColor={'yellow.50'} mt={4} rounded={8}>
                        <Marquee pauseOnHover={true} delay={3}>
                            <Text><span style={{ fontWeight: 'bold', color: 'red' }}>NEW: </span> Enjoy great offers on mobile recharge!</Text>
                        </Marquee>
                    </Box>
                    <HStack mt={8}>
                        <Stack
                            direction={['column', 'row']}
                            p={4} boxShadow={'md'}
                            rounded={8} flex={1}
                            bgImage={'/greenbg.svg'}
                            bgSize={'cover'}
                            bgRepeat={'no-repeat'}
                            color={'#FFF'}
                            spacing={4}
                            alignItems={'center'}
                            justifyContent={['center', 'flex-start']}
                        >
                            <Icon as={BsCurrencyRupee} fontSize={[28, 48]} />
                            <Box>
                                <Text fontSize={['sm']} textAlign={['center', 'left']}>Bigpay</Text>
                                <Text fontSize={['lg', '2xl']} fontWeight={'semibold'}>₹ {Math.abs(payoutData?.credit - payoutData?.debit) || 0}</Text>
                            </Box>
                        </Stack>
                        <Stack
                            direction={['column', 'row']}
                            p={4} boxShadow={'md'}
                            rounded={8} flex={1}
                            bgImage={'/greenbg.svg'}
                            bgSize={'cover'}
                            bgRepeat={'no-repeat'}
                            color={'#FFF'}
                            spacing={4}
                            alignItems={'center'}
                            justifyContent={['center', 'flex-start']}
                        >
                            <Icon as={FaMobile} fontSize={[28, 48]} />
                            <Box>
                                <Text fontSize={['sm']} textAlign={['center', 'left']}>Bill Pay</Text>
                                <Text fontSize={['lg', '2xl']} fontWeight={'semibold'}>
                                    ₹ {Math.abs(bbpsData.credit - bbpsData.debit) || 0}
                                </Text>
                            </Box>
                        </Stack>
                        <Stack
                            direction={['column', 'row']}
                            p={4} boxShadow={'md'}
                            rounded={8} flex={1}
                            bgImage={'/greenbg.svg'}
                            bgSize={'cover'}
                            bgRepeat={'no-repeat'}
                            color={'#FFF'}
                            spacing={4}
                            alignItems={'center'}
                            justifyContent={['center', 'flex-start']}
                        >
                            <Icon as={FaRegMoneyBillAlt} fontSize={[28, 48]} />
                            <Box>
                                <Text fontSize={['sm']} textAlign={['center', 'left']}>DMT</Text>
                                <Text fontSize={['lg', '2xl']} fontWeight={'semibold'}>
                                    ₹ {Math.abs(dmtData.credit - dmtData.debit) || 0}
                                </Text>
                            </Box>
                        </Stack>
                    </HStack>


                    <Box
                        width={'100%'}
                        rounded={16}
                        boxShadow={'lg'}
                        p={4} marginTop={8}
                        bgImage={'/mobileBg.svg'}
                        bgSize={'cover'}
                        bgRepeat={'no-repeat'}
                    >
                        <Text color={'#FFF'} mb={[8]} fontWeight={'semibold'} fontSize={'md'}>Explore Our Services</Text>

                        <HStack justifyContent={'flex-start'} gap={[4, 8]} flexWrap={'wrap'}>

                            {/* <Box w={['27.5%', '20%']} p={4} _hover={{ bgColor: 'rgba(0,0,0,0.2)' }} rounded={'full'} transition={'all .3s ease'}>
                                <Link
                                    href={'/dashboard/services/aeps?pageId=services'}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Icon fontSize={36} as={FaFingerprint} color={'#FFF'} />
                                    <Text
                                        textAlign={'center'}
                                        color={'#FFF'}
                                        fontSize={['sm', 'md']}
                                    >AePS</Text>
                                </Link>
                            </Box> */}

                            <Box w={['27.5%', '20%']} p={4} _hover={{ bgColor: 'rgba(0,0,0,0.2)' }} rounded={'full'} transition={'all .3s ease'}>
                                <Link
                                    href={'/dashboard/services/payout?pageId=services'}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Icon fontSize={36} as={BsCurrencyRupee} color={'#FFF'} />
                                    <Text
                                        textAlign={'center'}
                                        color={'#FFF'}
                                        fontSize={['sm', 'md']}
                                    >Bigpay</Text>
                                </Link>
                            </Box>

                            <Box w={['27.5%', '20%']} p={4} _hover={{ bgColor: 'rgba(0,0,0,0.2)' }} rounded={'full'} transition={'all .3s ease'}>
                                <Link
                                    href={'/dashboard/services/bbps/all?pageId=services'}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text
                                        fontWeight={'extrabold'}
                                        color={'#FFF'}
                                        rounded={'full'}
                                        display={'grid'}
                                        placeContent={'center'}
                                        fontSize={36}
                                        lineHeight={['9', '9']}
                                    >B</Text>
                                    <Text
                                        textAlign={'center'}
                                        color={'#FFF'}
                                        fontSize={['sm', 'md']}
                                        paddingTop={1}
                                    >Bill Pay</Text>
                                </Link>
                            </Box>

                            <Box w={['27.5%', '20%']} p={4} _hover={{ bgColor: 'rgba(0,0,0,0.2)' }} rounded={'full'} transition={'all .3s ease'}>
                                <Link
                                    href={'/dashboard/services/dmt?pageId=services'}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Icon fontSize={36} as={FaRegMoneyBillAlt} color={'#FFF'} />
                                    <Text
                                        textAlign={'center'}
                                        color={'#FFF'}
                                        fontSize={['sm', 'md']}
                                    >DMT</Text>
                                </Link>
                            </Box>

                            {/* <Box w={['27.5%', '20%']} p={4} _hover={{ bgColor: 'rgba(0,0,0,0.2)' }} rounded={'full'} transition={'all .3s ease'}>
                                <Link
                                    href={'/dashboard/services/recharge?pageId=services'}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Icon fontSize={36} as={BiMobileAlt} color={'#FFF'} />
                                    <Text
                                        textAlign={'center'}
                                        color={'#FFF'}
                                        fontSize={['sm', 'md']}
                                    >Recharge</Text>
                                </Link>
                            </Box> */}

                            {/* <Box w={['27.5%', '20%']} p={4} _hover={{ bgColor: 'rgba(0,0,0,0.2)' }} rounded={'full'} transition={'all .3s ease'}>
                                <Link
                                    href={'/dashboard/services/fastag?pageId=services'}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Icon fontSize={36} as={FaCar} color={'#FFF'} />
                                    <Text
                                        textAlign={'center'}
                                        color={'#FFF'}
                                        fontSize={['sm', 'md']}
                                    >Fastag</Text>
                                </Link>
                            </Box> */}

                            {/* <Box w={['27.5%', '20%']} p={4} _hover={{ bgColor: 'rgba(0,0,0,0.2)' }} rounded={'full'} transition={'all .3s ease'}>
                                <Link
                                    href={'/dashboard/services/lic?pageId=services'}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Icon fontSize={36} as={IoMdUmbrella} color={'#FFF'} />
                                    <Text
                                        textAlign={'center'}
                                        color={'#FFF'}
                                        fontSize={['sm', 'md']}
                                    >LIC</Text>
                                </Link>
                            </Box> */}

                            {/* <Box w={['27.5%', '20%']} p={4} _hover={{ bgColor: 'rgba(0,0,0,0.2)' }} rounded={'full'} transition={'all .3s ease'}>
                                <Link
                                    href={'/dashboard/services/pan?pageId=services'}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Icon fontSize={36} as={BiIdCard} color={'#FFF'} />
                                    <Text
                                        textAlign={'center'}
                                        color={'#FFF'}
                                        fontSize={['sm', 'md']}
                                    >PAN Card</Text>
                                </Link>
                            </Box> */}

                            {/* <Box w={['27.5%', '20%']} p={4} _hover={{ bgColor: 'rgba(0,0,0,0.2)' }} rounded={'full'} transition={'all .3s ease'}>
                                <Link
                                    href={'/dashboard/services/axis?pageId=services'}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Image src='/axisbank.svg' boxSize={[8, 8]} objectFit={'contain'} />
                                    <Text
                                        textAlign={'center'}
                                        color={'#FFF'}
                                        fontSize={['sm', 'md']}
                                        paddingTop={1}
                                    >Axis Bank</Text>
                                </Link>
                            </Box> */}

                        </HStack>
                    </Box>

                    <Box
                        width={'100%'}
                        rounded={16}
                        boxShadow={'lg'}
                        p={['6', 4]} marginTop={8}
                        bgImage={'/mobileBg.svg'}
                        bgSize={'cover'}
                        bgRepeat={'no-repeat'}
                    >
                        <Text color={'#FFF'} mb={[8]} fontWeight={'semibold'} fontSize={'md'}>Bill Payment & Recharge</Text>

                        <HStack justifyContent={['space-between', 'flex-start']} gap={[4, 8]} flexWrap={'wrap'}>
                            {
                                bbpsProvider == "eko" ?
                                    categories.map((item, key) => (
                                        <Box
                                            w={['25%', '20%']} p={[4]} key={key}
                                            _hover={{ bgColor: 'rgba(0,0,0,0.2)' }}
                                            rounded={'full'} transition={'all .3s ease'}
                                        >
                                            <Link
                                                href={{
                                                    pathname: `/dashboard/services/bbps`,
                                                    query: {
                                                        pageId: 'services',
                                                        passedCategory: bbpsProvider == "eko" ? item.operator_category_id : item.operator_category_name
                                                    }
                                                }}

                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-start',
                                                    gap: '8px',
                                                    height: '84px'
                                                }}
                                            >
                                                {
                                                    item.operator_category_name.toLowerCase().includes("mobile")
                                                        ? <FaMobile color={'#FFF'} size={28} /> :
                                                        item.operator_category_name.toLowerCase().includes("broadband")
                                                            ? <HiServerStack color={'#FFF'} size={28} /> :
                                                            item.operator_category_name.toLowerCase().includes("gas") || item.operator_category_name.toLowerCase().includes("lpg")
                                                                ? <AiFillFire color={'#FFF'} size={28} /> :
                                                                item.operator_category_name.toLowerCase().includes("dth")
                                                                    ? <FaSatelliteDish color={'#FFF'} size={28} /> :
                                                                    item.operator_category_name.toLowerCase().includes("card")
                                                                        ? <BsCreditCardFill color={'#FFF'} size={28} /> :
                                                                        item.operator_category_name.toLowerCase().includes("electricity")
                                                                            ? <BsLightningChargeFill color={'#FFF'} size={28} /> :
                                                                            item.operator_category_name.toLowerCase().includes("landline")
                                                                                ? <GiRotaryPhone color={'#FFF'} size={28} /> :
                                                                                item.operator_category_name.toLowerCase().includes("water")
                                                                                    ? <BsDropletFill color={'#FFF'} size={28} /> :
                                                                                    item.operator_category_name.toLowerCase().includes("housing") || item.operator_category_name.toLowerCase().includes("rental")
                                                                                        ? <BsHouseDoorFill color={'#FFF'} size={28} /> :
                                                                                        item.operator_category_name.toLowerCase().includes("education")
                                                                                            ? <GoMortarBoard color={'#FFF'} size={28} /> :
                                                                                            item.operator_category_name.toLowerCase().includes("tax")
                                                                                                ? <BiRupee color={'#FFF'} size={28} /> :
                                                                                                item.operator_category_name.toLowerCase().includes("associations")
                                                                                                    ? <FaUsers color={'#FFF'} size={28} /> :
                                                                                                    item.operator_category_name.toLowerCase().includes("tv")
                                                                                                        ? <FiMonitor color={'#FFF'} size={28} /> :
                                                                                                        item.operator_category_name.toLowerCase().includes("hospital") || item.operator_category_name.toLowerCase().includes("donation")
                                                                                                            ? <FaHeart color={'#FFF'} size={28} /> :
                                                                                                            item.operator_category_name.toLowerCase().includes("insurance")
                                                                                                                ? <IoMdUmbrella color={'#FFF'} size={28} /> :
                                                                                                                item.operator_category_name.toLowerCase().includes("loan")
                                                                                                                    ? <GiMoneyStack color={'#FFF'} size={28} /> :
                                                                                                                    item.operator_category_name.toLowerCase().includes("fastag")
                                                                                                                        ? <FaCar color={'#FFF'} size={28} /> :
                                                                                                                        item.operator_category_name.toLowerCase().includes("municipal services")
                                                                                                                            ? <FaCity color={'#FFF'} size={28} /> :
                                                                                                                            item.operator_category_name.toLowerCase().includes("subscription")
                                                                                                                                ? <FaMoneyBillAlt color={'#FFF'} size={28} /> : <BiRupee color={'#FFF'} size={28} />
                                                }
                                                <Text
                                                    textAlign={'center'}
                                                    color={'#FFF'}
                                                    fontSize={['sm', 'md']}
                                                >{item.operator_category_name}</Text>
                                            </Link>
                                        </Box>
                                    ))
                                    : null
                            }

                        </HStack>
                    </Box>

                    <Box w={'full'} mt={8} p={4} rounded={16} boxShadow={'lg'} bgColor={'whatsapp.400'}>
                        <HStack justifyContent={'space-between'}>
                            <Text fontSize={'lg'} maxW={'50%'} fontWeight={'semibold'}>Boost Your Income With Us!</Text>
                            <Link href={'/dashboard/services/activate?pageId=services'}>
                                <Button
                                    size={['sm', 'md']} variant={'solid'}
                                    rounded={'full'}
                                    colorScheme='whatsapp'
                                    bgColor={'whatsapp.600'}
                                    rightIcon={<BsArrowRight color='#FFF' />}
                                >Activate Services</Button>
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
                    <Box mt={8} w={'full'} h={'36'} rounded={16} boxShadow={'lg'} overflow={'hidden'}>
                        <Carousel autoPlay infiniteLoop showArrows={false} showStatus={false}>
                            {images.map((image, index) => (
                                <div key={index}>
                                    <img src={image} alt={`Image ${index + 1}`} />
                                </div>
                            ))}
                        </Carousel>
                    </Box>
                </Box>
            </DashboardWrapper>
        </>
    )
}

export default Index