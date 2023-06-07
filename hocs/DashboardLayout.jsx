import React, { useState, useEffect, useMemo } from 'react'
import { BsWallet, BsBell, BsPeopleFill, BsFillFileEarmarkBarGraphFill, BsFileEarmarkBarGraphFill, BsHouseDoorFill } from 'react-icons/bs'
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
    Toast,
    Avatar,
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
import { FaUserAlt } from 'react-icons/fa';
import { MdContactSupport } from 'react-icons/md'


const DashboardWrapper = (props) => {
    const [availablePages, setAvailablePages] = useState([])

    useEffect(() => {
        let authentic = bcrypt.compareSync(`${localStorage.getItem("userId") + localStorage.getItem("userName")}`, Cookies.get("verified"))
        if (authentic != true) {
            BackendAxios.post("/logout").then(() => {
                Cookies.remove("verified")
                Cookies.remove("access_token")
                Cookies.remove("XSRF-TOKEN")
                Cookies.remove("laravel_session")
                localStorage.clear()
            })
            setTimeout(() => Router.push("/auth/login"), 2000)
        }
        if (authentic) {
            setIsProfileComplete(localStorage.getItem("isProfileComplete") === "true")
            setUserName(localStorage.getItem("userName"))
            setUserType(localStorage.getItem("userType"))
            setProfilePic(localStorage.getItem("profilePic"))
            Cookies.set("verified", Cookies.get("verified"), { expires: sessionExpiry })
        }
    }, [])

    useEffect(() => {
        ClientAxios.post('/api/user/fetch', {
            user_id: Cookies.get('userId')
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            setAvailablePages(res.data[0].allowed_pages)
        }).catch((err) => {
            console.log(err)
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
    const [profilePic, setProfilePic] = useState("/avatar.png")
    const [wallet, setWallet] = useState("0")
    const { isOpen, onOpen, onClose } = useDisclosure()
    var sessionExpiry = new Date(new Date().getTime() + 2 * 60 * 60 * 1000)
    const Router = useRouter()

    useEffect(() => {
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
        BackendAxios.post('/api/user/wallet', {
        }, {
            headers: {
                Authorization: `Bearer ${Cookies.get("access-token")}`
            }
        }).then((res) => {
            setWallet(res.data[0].wallet)
        }).catch((err) => {
            setWallet('0')
            console.log(err)
        })
    }, [])


    useEffect(() => {
        // Check for new notifications
        if (globalNotifications.length != 0 || organisationNotifications != 0 || userNotifications != 0) {
            setNewNotification(true)
        }
    }, [globalNotifications, organisationNotifications, userNotifications])


    async function signout() {
        await BackendAxios.post("/logout").then(() => {
            Cookies.remove("verified")
        })
        Router.push("/auth/login")
    }

    return (
        <>
            <Head><title>{`Pesa24 - ${props.titleText || props.pageTitle}`}</title></Head>

            <Box
                bg={'aliceblue'}
                w={'full'}>
                <HStack spacing={8} alignItems={'flex-start'}>
                    {/* Sidebar */}
                    <Sidebar
                        isProfileComplete={isProfileComplete}
                        userName={userName}
                        userType={userType?.toUpperCase()}
                        userImage={profilePic}
                    />

                    {/* Main Dashboard Container */}
                    <Box
                        display={'flex'}
                        flexDir={'column'}
                        flex={[1, 8]}
                        w={'full'} h={['100vh', '100vh']}
                        overflowY={'scroll'}
                    >
                        <Show above='md'>
                            <Topbar />
                        </Show>

                        {/* Topbar Starts */}
                        <HStack
                            py={[4, 0]}
                            pb={[4, 2]}
                            px={[4, 2]}
                            bgImage={['/mobileBg.svg', 'unset']}
                            color={['#FFF', '#222']}
                        >
                            <Show below={'md'}>
                                <Box fontSize={'2xl'} onClick={onOpen}>
                                    <FiMenu color='#FFF' />
                                </Box>
                            </Show>
                            <Show above='md'>
                                <Text fontSize={'xl'} fontWeight={'500'} color={['#FFF', '#222']}>{props.titleText || props.pageTitle}</Text>
                                <Spacer />
                            </Show>
                            <Show below='md'>
                                <Spacer />
                                <Text fontSize={'xl'} fontWeight={'500'} color={['#FFF', '#222']}>{userName}</Text>
                            </Show>
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
                            <Show below='md'>
                                <Link href={'/dashboard/profile?pageId=prfile'}>
                                    <Avatar name={userName} src={profilePic} size={'sm'} />
                                </Link>
                            </Show>
                        </HStack>
                        {/* Topbar Ends */}
                        
                        <Box p={[4, 0]} pr={[4, 4]}>
                            {props.children}
                        </Box>

                        <Show below='md'>
                            <Box w={'full'} py={16}>

                            </Box>
                        </Show>
                    </Box>


                </HStack>
            </Box>

            {/* Mobile bottom nav */}
            <Show below='md'>
                <HStack
                    pos={'fixed'}
                    bottom={0}
                    width={'100%'}
                    zIndex={999}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    <HStack
                        width={'100%'}
                        padding={3}
                        boxShadow={'lg'}
                        bg={'#FFF'}
                        justifyContent={'space-between'}
                        paddingX={8}
                        border={'1px'}
                        borderColor={'#FAFAFA'}
                    >
                        <Link href={'/'}>
                            <VStack h={'100%'} justifyContent={'space-between'}>
                                <BsHouseDoorFill fontSize={'20'} />
                                <Text fontSize={'xs'} textAlign={'center'}>Home</Text>
                            </VStack>
                        </Link>

                        <Link href={'/dashboard/mobile/reports?pageId=reports'}>
                            <VStack h={'100%'} justifyContent={'space-between'}>
                                <BsFileEarmarkBarGraphFill fontSize={'20'} />
                                <Text fontSize={'xs'} textAlign={'center'}>Reports</Text>
                            </VStack>
                        </Link>

                        <Link href={'/dashboard/support-tickets'}>
                            <VStack h={'100%'} justifyContent={'space-between'}>
                                <MdContactSupport fontSize={'22'} />
                                <Text fontSize={'xs'} textAlign={'center'}>Support</Text>
                            </VStack>
                        </Link>

                        <Link href={'/dashboard/profile'}>
                            <VStack h={'100%'} justifyContent={'space-between'}>
                                <FaUserAlt fontSize={'18'} />
                                <Text fontSize={'xs'} textAlign={'center'}>Profile</Text>
                            </VStack>
                        </Link>

                    </HStack>
                </HStack>
            </Show>

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

                            <VStack spacing={4}>

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
                                                        <Text textTransform={'capitalize'} fontSize={'md'}>{option.title}</Text>
                                                    </HStack>
                                                </Link>
                                            )
                                        }

                                        if (option.type == 'accordion') {
                                            return (
                                                <Accordion allowToggle w={'full'}>

                                                    <AccordionItem border={'none'}>
                                                        <AccordionButton px={[3, 3]} _expanded={{ bg: 'aqua' }} border={'none'}>
                                                            <HStack spacing={1} flex={1} fontSize={'md'} alignItems={'center'}>
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
                                                >
                                                    {
                                                        availablePages.includes('userManagementCreateUser') ?
                                                            <Link href={"/dashboard/users/create-user?pageId=users"} style={{ width: '100%' }}>
                                                                <Text
                                                                    w={'full'} textAlign={'left'}
                                                                    px={3} py={2} _hover={{ bg: 'aqua' }}
                                                                    textTransform={'capitalize'}
                                                                >Create User</Text>
                                                            </Link> : null
                                                    }

                                                    {
                                                        availablePages.includes('userManagementUsersList') ?
                                                            <Link href={"/dashboard/users/view-users?pageId=users"} style={{ width: '100%' }}>
                                                                <Text
                                                                    w={'full'} textAlign={'left'}
                                                                    px={3} py={2} _hover={{ bg: 'aqua' }}
                                                                    textTransform={'capitalize'}
                                                                >View Users</Text>
                                                            </Link> : null
                                                    }

                                                    {
                                                        availablePages.includes('userManagementUserLedger') ?
                                                            <Link href={"/dashboard/users/user-ledger?pageId=users"} style={{ width: '100%' }}>
                                                                <Text
                                                                    w={'full'} textAlign={'left'}
                                                                    px={3} py={2} _hover={{ bg: 'aqua' }}
                                                                    textTransform={'capitalize'}
                                                                >User Ledger</Text>
                                                            </Link> : null
                                                    }

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
                                        <Text fontSize={'xs'} color={'#888'}>Wallet</Text>
                                        <Text fontSize={'xl'}>₹ {wallet || 0}</Text>
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