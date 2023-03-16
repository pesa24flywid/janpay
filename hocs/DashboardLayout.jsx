import React, { useState, useEffect } from 'react'
import { BsWallet, BsBell, BsPeopleFill } from 'react-icons/bs'
import { FiMenu } from 'react-icons/fi'
import { BiRupee, BiUser, BiPowerOff } from "react-icons/bi";
import { VscDashboard } from "react-icons/vsc";
import {
    HStack,
    Text,
    Box,
    VStack,
    Spacer,
    Show,
    useDisclosure,
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'
import Link from 'next/link'
import Head from 'next/head'
import Sidebar, { ServicesAccordion, SidebarOptions } from './Sidebar'
import BankDetails from './BankDetails'
import Cookies from 'js-cookie';
let bcrypt = require('bcryptjs')
import { useRouter } from 'next/router';
import BackendAxios, { ClientAxios } from '../lib/axios';
import Topbar from './Topbar';
import SimpleAccordion from './SimpleAccordion';


const DashboardWrapper = (props) => {

    // Check if user has paid onboarding fee or not
    useEffect(() => {
        BackendAxios.get('/api/user/check/onboard-fee').then((res) => {
            if (res.data[0].onboard_fee == 0) {
                if(!window.location.href.includes(`/services/activate`)){
                    if(!window.location.href.includes(`/fund-request`) && !window.location.href.includes(`/support-tickets`)){
                        window.location.assign('/dashboard/services/activate?pageId=services')
                    }
                }
            }
        })
    }, [])


    const [openNotification, setOpenNotification] = useState(false)
    const [newNotification, setNewNotification] = useState(false)
    const [globalNotifications, setGlobalNotifications] = useState([])
    const [organisationNotifications, setOrganisationNotifications] = useState([])
    const [userNotifications, setUserNotifications] = useState([])

    const [isProfileComplete, setIsProfileComplete] = useState(false)
    const [userName, setUserName] = useState("No Name")
    const [userType, setUserType] = useState("Undefined")
    const [userImage, setUserImage] = useState("/avatar.png")
    const [wallet, setWallet] = useState("0")
    const { isOpen, onOpen, onClose } = useDisclosure()
    var sessionExpiry = new Date(new Date().getTime() + 2 * 60 * 60 * 1000)
    const Router = useRouter()

    useEffect(() => {
        setIsProfileComplete(localStorage.getItem("isProfileComplete") === "true")
        setUserName(localStorage.getItem("userName"))
        setUserType(localStorage.getItem("userType"))
        Cookies.set("verified", Cookies.get("verified"), { expires: sessionExpiry })

        // Check wallet balance
        BackendAxios.post('/api/user/wallet').then((res) => {
            setWallet(res.data[0].wallet)
        }).catch((err) => {
            setWallet('Error')
        })

        // Fetch all notifications
        ClientAxios.post('/api/user/fetch', {
            user_id: localStorage.getItem('userId')
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            setUserNotifications(res.data[0].notifications)
        }).catch((err) => {
            console.log(err)
        })

    }, [])

    useEffect(() => {
        // Check for new notifications
        if (globalNotifications.length != 0 || organisationNotifications != 0 || userNotifications != 0) {
            setNewNotification(true)
        }
    }, [globalNotifications, organisationNotifications, userNotifications])

    useEffect(() => {
        let authentic = bcrypt.compareSync(`${localStorage.getItem("userId") + localStorage.getItem("userName")}`, Cookies.get("verified"))
        if (authentic != true) {
            BackendAxios.post("/logout").then(() => {
                Cookies.remove("verified")
            })
            setTimeout(() => Router.push("/auth/login"), 2000)
        }
    })
    async function signout() {
        await BackendAxios.post("/logout").then(() => {
            Cookies.remove("verified")
            localStorage.clear()
        })
        setTimeout(() => Router.push("/auth/login"), 2000)
    }

    return (
        <>
            <Head><title>{`Pesa24 - ${props.titleText}`}</title></Head>

            <Box
                bg={'aliceblue'}
                w={'full'} minH={'100vh'}>

                <HStack spacing={8} alignItems={'flex-start'}>
                    {/* Sidebar */}
                    <Sidebar
                        isProfileComplete={isProfileComplete}
                        userName={userName}
                        userType={userType.toUpperCase()}
                        userImage={userImage}
                    />

                    {/* Main Dashboard Container */}
                    <Box
                        p={4}
                        display={'flex'}
                        flexDir={'column'}
                        flex={['unset', 8]}
                        w={'full'} h={'100vh'}
                        overflowY={'scroll'}
                    >
                        <Topbar />

                        {/* Topbar Starts */}
                        <HStack
                            pt={[4, 0]}
                            pb={[0, 2]}
                            px={[0, 2]}
                        >
                            <Show below={'md'}>
                                <Box fontSize={'2xl'} onClick={onOpen}>
                                    <FiMenu color='#333' />
                                </Box>
                            </Show>
                            <Text fontSize={'xl'} fontWeight={'500'} color={'#333'}>{props.titleText}</Text>
                            <Spacer />
                            <HStack
                                spacing={4}
                                w={'auto'}
                                display={["none", "flex"]}
                            >

                                <Link href={'#'}>
                                    <HStack boxShadow={'md'}
                                        p={1} px={3} w={'auto'}
                                        spacing={2}
                                        rounded={'full'}
                                        bg={'white'}
                                        justifyContent={'flex-start'}
                                    >
                                        <Box
                                            boxSize={'8'}
                                            bg={'#FFB100'} color={'white'}
                                            rounded={'full'}
                                            display={'grid'} placeContent={'center'}
                                        >
                                            <BsWallet />
                                        </Box>
                                        <VStack w={'auto'} spacing={0}
                                            alignItems={'flex-start'}
                                            justifyContent={'center'}
                                        >
                                            <Text fontSize={'xs'} color={'#888'} mb={0}>Wallet</Text>
                                            <h2>₹ {wallet}</h2>
                                        </VStack>
                                    </HStack>
                                </Link>
                                <Spacer w={8} />
                                <Box
                                    pos={'relative'}
                                    boxSize={'10'} p={2} cursor={'pointer'}
                                    color={'gray.600'} boxShadow={'md'}
                                    rounded={'full'} bg={'white'}
                                    display={'grid'} placeContent={'center'}
                                    onClick={() => setOpenNotification(true)}
                                >
                                    <BsBell fontSize={'20'} />
                                    {newNotification ? <Box boxSize={'2'} rounded={'full'} bg={'red'} position={'absolute'} top={'3'} right={'3'}></Box> : null}
                                </Box>

                            </HStack>
                        </HStack>
                        {/* Topbar Ends */}

                        {props.children}

                    </Box>


                </HStack>
            </Box>

            {/* Mobile Sidebar */}
            <Show below={'md'}>
                <Drawer
                    isOpen={isOpen}
                    placement='left'
                    onClose={onClose}
                    size={'xs'}
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            <Text fontWeight={'semibold'}>Pesa24</Text>
                        </DrawerHeader>

                        <DrawerBody mt={8}>

                            <VStack spacing={6}>

                                {
                                    SidebarOptions.map((option, key) => {
                                        if (option.type == 'link') {
                                            return (
                                                <Link href={option.link} key={key} style={{ width: "100%" }}>
                                                    <HStack
                                                        px={3}
                                                        py={2}
                                                        rounded={'full'}
                                                        overflow={'hidden'}
                                                        _hover={{ bg: 'aqua' }}
                                                        id={option.id || option.title}
                                                    >
                                                        {option.icon}
                                                        <Text textTransform={'capitalize'}>{option.title}</Text>
                                                    </HStack>
                                                </Link>
                                            )
                                        }

                                        if (option.type == 'accordion') {
                                            return (
                                                <Accordion allowToggle w={'full'}>

                                                    <AccordionItem>
                                                        <AccordionButton px={[0, 3]} _expanded={{ bg: 'aqua' }}>
                                                            <HStack spacing={1} flex={1} fontSize={['1.2rem', 'md']} alignItems={'center'}>
                                                                {option.icon}
                                                                <Text textTransform={'capitalize'}>{option.title}</Text>
                                                            </HStack>
                                                            <AccordionIcon />
                                                        </AccordionButton>

                                                        <AccordionPanel px={0}>


                                                            <VStack
                                                                w={'full'}
                                                                alignItems={'flex-start'}
                                                                justifyContent={'flex-start'}
                                                                spacing={2}
                                                                overflow={'hidden'}
                                                                id={'payout'}
                                                            >

                                                                {option.children.map((item, key) => {
                                                                    return (
                                                                        <Link key={key} href={item.link} style={{ width: '100%' }}>
                                                                            <Text
                                                                                w={'full'} textAlign={'left'}
                                                                                px={3} py={2} _hover={{ bg: 'aqua' }}
                                                                                textTransform={'capitalize'}
                                                                            >{item.title}</Text>
                                                                        </Link>
                                                                    )
                                                                })}
                                                            </VStack>

                                                        </AccordionPanel>

                                                    </AccordionItem>

                                                </Accordion>
                                            )

                                        }
                                    })
                                }

                                {
                                    userType != "retailer" &&

                                    <Accordion allowToggle w={'full'}>

                                        <AccordionItem>
                                            <AccordionButton px={[0, 3]} _expanded={{ bg: 'aqua' }}>
                                                <HStack spacing={1} flex={1} fontSize={['1.2rem', 'md']} alignItems={'center'}>
                                                    <BsPeopleFill />
                                                    <Text textTransform={'capitalize'}>Manage Users</Text>
                                                </HStack>
                                                <AccordionIcon />
                                            </AccordionButton>

                                            <AccordionPanel px={0}>


                                                <VStack
                                                    w={'full'}
                                                    alignItems={'flex-start'}
                                                    justifyContent={'flex-start'}
                                                    spacing={2}
                                                    overflow={'hidden'}
                                                    id={'users'}
                                                >
                                                    <Link href={"/users/create-user?pageId=users"} style={{ width: '100%' }}>
                                                        <Text
                                                            w={'full'} textAlign={'left'}
                                                            px={3} py={2} _hover={{ bg: 'aqua' }}
                                                            textTransform={'capitalize'}
                                                        >Create User</Text>
                                                    </Link>

                                                    <Link href={"/users/users-list?pageId=users"} style={{ width: '100%' }}>
                                                        <Text
                                                            w={'full'} textAlign={'left'}
                                                            px={3} py={2} _hover={{ bg: 'aqua' }}
                                                            textTransform={'capitalize'}
                                                        >View User</Text>
                                                    </Link>

                                                    <Link href={"/users/users-report?pageId=users"} style={{ width: '100%' }}>
                                                        <Text
                                                            w={'full'} textAlign={'left'}
                                                            px={3} py={2} _hover={{ bg: 'aqua' }}
                                                            textTransform={'capitalize'}
                                                        >Users Report</Text>
                                                    </Link>

                                                </VStack>

                                            </AccordionPanel>

                                        </AccordionItem>

                                    </Accordion>
                                }


                            </VStack>

                            <BankDetails />
                        </DrawerBody>

                        <DrawerFooter justifyContent={'center'}>
                            <VStack w={'full'} spacing={8}>
                                <HStack w={'full'} spacing={4} justifyContent={'space-between'}>
                                    <Box>
                                        <Text fontSize={'xs'} color={'#888'}>DMT Wallet</Text>
                                        <Text fontSize={'xl'}>₹ {props.dmt || 0}</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize={'xs'} color={'#888'}>Prepaid Wallet</Text>
                                        <Text fontSize={'xl'}>₹ {props.prepaid || 0}</Text>
                                    </Box>
                                </HStack>
                                <HStack spacing={2} color={'red'} onClick={() => signout()}>
                                    <BiPowerOff fontSize={'1.5rem'} />
                                    <Text fontSize={'lg'}>
                                        Sign Out
                                    </Text>
                                </HStack>
                            </VStack>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Show>


            {/* Notifications Drawer */}
            <Drawer
                isOpen={openNotification}
                onClose={() => setOpenNotification(false)}
                placement={'right'}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader>
                        Notifications
                    </DrawerHeader>
                    <DrawerBody>
                        {
                            globalNotifications.map((notification, key) => {
                                return (
                                    <SimpleAccordion
                                        key={key}
                                        title={notification.title}
                                        content={notification.content}
                                    />
                                )
                            })
                        }
                        {
                            organisationNotifications.map((notification, key) => {
                                return (
                                    <SimpleAccordion
                                        key={key}
                                        title={notification.title}
                                        content={notification.content}
                                    />
                                )
                            })
                        }
                        {
                            userNotifications.map((notification, key) => {
                                return (
                                    <SimpleAccordion
                                        key={key}
                                        title={notification.title}
                                        content={notification.content}
                                    />
                                )
                            })
                        }
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

        </>
    )
}

export default DashboardWrapper