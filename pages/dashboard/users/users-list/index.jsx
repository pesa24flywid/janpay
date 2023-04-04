import React, { useState, useEffect, useRef } from 'react'
import {
    Box,
    Text,
    HStack,
    VStack,
    Stack,
    Button,
    Input,
    Image,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Switch,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    VisuallyHidden,
    useToast,
} from '@chakra-ui/react'
import { SiMicrosoftexcel } from 'react-icons/si'
import { FaFileCsv, FaFilePdf, FaPrint } from 'react-icons/fa'
import {
    BsFileBarGraphFill,
    BsPenFill,
    BsChevronDoubleLeft,
    BsChevronDoubleRight,
    BsChevronLeft,
    BsChevronRight
} from 'react-icons/bs'
import jsPDF from 'jspdf';
import "jspdf-autotable"
import BackendAxios, { ClientAxios } from '../../../../lib/utils/axios'
import CheckboxTree from 'react-checkbox-tree'
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import Script from 'next/script'
import Link from 'next/link'
import { BiPen, BiRupee } from 'react-icons/bi'
import fileDownload from 'js-file-download'
import DashboardWrapper from '../../../../hocs/DashboardLayout'

const ExportPDF = (currentRowData) => {
    const doc = new jsPDF('landscape')
    const columnDefs = [
        '#',
        'Basic Details',
        'KYC Details',
        'Balance Details',
        'Complete Address',
        'Parent Details',
        'Actions',
    ]

    doc.autoTable({ html: '#exportableTable' })
    doc.output('dataurlnewwindow');
}


const Index = () => {
    const Toast = useToast({
        position: 'top-right'
    })
    const [userObjId, setUserObjId] = useState("")
    const [permissionsDrawer, setPermissionsDrawer] = useState(false)

    const [aepsPermissions, setAepsPermissions] = useState([])
    const [aepsExpansion, setAepsExpansion] = useState([])
    const aepsList = [{
        value: "allAeps",
        label: "All AePS Services",
        children: [
            { value: 'aepsBasic', label: 'Basic Transactions' },
            { value: 'aepsPayout', label: 'AePS Payouts' },
            { value: 'aepsReport', label: 'AePS Reports' },
        ]
    }]

    const [bbpsPermissions, setBbpsPermissions] = useState([])
    const [bbpsExpansion, setBbpsExpansion] = useState([])
    const bbpsList = [{
        value: "allBbps",
        label: "All BBPS Services",
        children: [
            { value: 'bbps', label: 'BBPS Transactions' },
            { value: 'bbpsReport', label: 'BBPS Reports' },
        ]
    }]

    const [payoutPermissions, setPayoutPermissions] = useState([])
    const [payoutExpansion, setPayoutExpansion] = useState([])
    const payoutList = [{
        value: "allPayout",
        label: "All Payout Services",
        children: [
            { value: 'payout', label: 'Payout Transactions' },
            { value: 'payoutReport', label: 'Payout Reports' },
        ]
    }]

    const [dmtPermissions, setDmtPermissions] = useState([])
    const [dmtExpansion, setDmtExpansion] = useState([])
    const dmtList = [{
        value: "alldmt",
        label: "All DMT Services",
        children: [
            { value: 'dmt', label: 'DMT Transactions' },
            { value: 'dmtReport', label: 'DMT Reports' },
        ]
    }]

    const availableTabs = ['retailers', 'distributor']
    const [selectedTab, setSelectedTab] = useState("retailer")
    const [fetchedUsers, setFetchedUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState("")
    const [pagination, setPagination] = useState({
        current_page: "1",
        total_pages: "1",
        first_page_url: "",
        last_page_url: "",
        next_page_url: "",
        prev_page_url: "",
    })

    // Fetching users
    function fetchUsersList(pageLink) {
        setFetchedUsers([])
        BackendAxios.get(pageLink || `/api/admin/users-list/${selectedTab}?page=1`).then((res) => {
            setPagination({
                current_page: res.data.current_page,
                total_pages: parseInt(res.data.last_page),
                first_page_url: res.data.first_page_url,
                last_page_url: res.data.last_page_url,
                next_page_url: res.data.next_page_url,
                prev_page_url: res.data.prev_page_url,
            })
            setFetchedUsers(res.data.data)
        }).catch((err) => {
            console.log(err)
            Toast({
                status: 'error',
                description: err.response.data.message || err.message
            })
        })
    }

    useEffect(() => {
        fetchUsersList()
    }, [selectedTab])


    function changeUserStatus(userId, updateTo) {
        BackendAxios.get(`/api/admin/user/status/${userId}/${updateTo}`).then(() => {
            fetchUsersList()
        }).catch((err) => {
            console.log(err)
            Toast({
                status: 'error',
                description: err.response.data.message || err.message
            })
        })
    }

    // Fetch User Permissions
    function fetchUserPermissions() {

        ClientAxios.post('/api/user/fetch', {
            user_id: `${selectedUser}`,
        },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => {
            setUserObjId(res.data[0]._id)
            setAepsPermissions(res.data[0].allowed_pages.filter((page) => {
                return page.includes("aeps")
            }))
            setBbpsPermissions(res.data[0].allowed_pages.filter((page) => {
                return page.includes("bbps")
            }))
            setDmtPermissions(res.data[0].allowed_pages.filter((page) => {
                return page.includes("dmt")
            }))
        }).catch((err) => {
            console.log("No permissions found")
            console.log(err.message)
        })
    }


    useEffect(() => {
        fetchUserPermissions()
    }, [selectedUser])

    function openPermissionsDrawer(userId) {
        setSelectedUser(userId)
        setPermissionsDrawer(true)
    }

    function saveUserPermissions() {
        ClientAxios.post('/api/user/update-permissions', {
            allowed_pages: aepsPermissions.concat(bbpsPermissions, dmtPermissions, payoutPermissions),
            user_id: selectedUser
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            Toast({
                status: 'success',
                description: 'User permissions were updated!'
            })
            fetchUserPermissions()
        }).catch((err) => {
            Toast({
                status: 'error',
                title: 'Error Occured',
                description: err.response.data.message || err.message
            })
        })
    }

    return (
        <>
            <Script
                src='https://kit.fontawesome.com/2aa643340e.js'
                crossOrigin='anonymous'
            />
            <DashboardWrapper pageTitle={'Users List'}>
                <Tabs
                    variant='soft-rounded'
                    colorScheme='green'
                    isFitted
                >
                    <TabList>
                        <Tab
                            fontSize={['xs', 'lg']}
                            _selected={{ bg: 'twitter.500', color: 'white' }}
                            onClick={() => setSelectedTab("retailer")}
                            width={'xs'} flex={'unset'}
                        >
                            Retailer
                        </Tab>
                        <Tab
                            fontSize={['xs', 'lg']}
                            _selected={{ bg: 'twitter.500', color: 'white' }}
                            onClick={() => setSelectedTab("distributor")}
                            width={'xs'} flex={'unset'}
                        >
                            Distributor
                        </Tab>
                    </TabList>
                    <TabPanels pt={8}>
                        {
                            availableTabs.map((tab, key) => {
                                return (
                                    <TabPanel key={key}>

                                        <Stack
                                            direction={['column', 'row']}
                                            justifyContent={'space-between'}
                                            alignItems={'center'}
                                        >
                                            <HStack spacing={4}>
                                                <Button
                                                    size={['xs', 'sm']}
                                                    colorScheme={'twitter'}
                                                    leftIcon={<FaFileCsv />}
                                                >
                                                    CSV
                                                </Button>
                                                <Button
                                                    size={['xs', 'sm']}
                                                    colorScheme={'whatsapp'}
                                                    leftIcon={<SiMicrosoftexcel />}
                                                >
                                                    Excel
                                                </Button>
                                                <Button
                                                    size={['xs', 'sm']}
                                                    colorScheme={'red'}
                                                    leftIcon={<FaFilePdf />}
                                                    onClick={() => ExportPDF()}
                                                >
                                                    PDF
                                                </Button>
                                                <Button
                                                    size={['xs', 'sm']}
                                                    colorScheme={'facebook'}
                                                    leftIcon={<FaPrint />}
                                                    onClick={() => ExportPDF()}
                                                >
                                                    Print
                                                </Button>
                                            </HStack>
                                            <Input
                                                bg={'white'}
                                                w={['full', 'xs']}
                                                placeholder={'Search Here'}
                                            />
                                        </Stack>

                                        <HStack spacing={2} mt={12} py={4} bg={'white'} justifyContent={'center'}>
                                            <Button
                                                colorScheme={'twitter'}
                                                fontSize={12} size={'xs'}
                                                variant={'outline'}
                                                onClick={() => fetchUsersList(pagination.first_page_url)}
                                            ><BsChevronDoubleLeft />
                                            </Button>
                                            <Button
                                                colorScheme={'twitter'}
                                                fontSize={12} size={'xs'}
                                                variant={'outline'}
                                                onClick={() => fetchUsersList(pagination.prev_page_url)}
                                            ><BsChevronLeft />
                                            </Button>
                                            <Button
                                                colorScheme={'twitter'}
                                                fontSize={12} size={'xs'}
                                                variant={'solid'}
                                            >{pagination.current_page}</Button>
                                            <Button
                                                colorScheme={'twitter'}
                                                fontSize={12} size={'xs'}
                                                variant={'outline'}
                                                onClick={() => fetchUsersList(pagination.next_page_url)}
                                            ><BsChevronRight />
                                            </Button>
                                            <Button
                                                colorScheme={'twitter'}
                                                fontSize={12} size={'xs'}
                                                variant={'outline'}
                                                onClick={() => fetchUsersList(pagination.last_page_url)}
                                            ><BsChevronDoubleRight />
                                            </Button>
                                        </HStack>
                                        {/* Table */}
                                        <TableContainer my={6}>
                                            <Table variant='striped' colorScheme='teal'>
                                                <Thead>
                                                    <Tr>
                                                        <Th>Basic Details</Th>
                                                        <Th>KYC Details</Th>
                                                        <Th>Balance Details</Th>
                                                        <Th>Complete Address</Th>
                                                        <Th>KYC Documents</Th>
                                                        {/* <Th>Actions</Th> */}
                                                    </Tr>
                                                </Thead>
                                                <Tbody fontSize={'xs'}>
                                                    {
                                                        fetchedUsers && fetchedUsers.map((user, key) => {
                                                            return (
                                                                <Tr key={key}>
                                                                    <Td>
                                                                        <Box mt={4}>
                                                                            <HStack spacing={4} pb={4}>
                                                                                <a href={
                                                                                    user.profile_pic ?
                                                                                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${user.profile_pic}`
                                                                                        : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
                                                                                } target={'_blank'}>
                                                                                    <Image
                                                                                        src={
                                                                                            user.profile_pic ?
                                                                                                `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${user.profile_pic}`
                                                                                                : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
                                                                                        }
                                                                                        boxSize={'10'} objectFit={'contain'}
                                                                                    />
                                                                                </a>
                                                                                <Box>
                                                                                    <Text><b>ID: </b>{user.id}</Text>
                                                                                    <Text>{user.first_name} {user.last_name} </Text>
                                                                                    <Text>
                                                                                        <a href={`tel:${user.phone_number}`}><b>MOB: </b>{user.phone_number}</a>
                                                                                    </Text>
                                                                                </Box>
                                                                            </HStack>
                                                                            <Text>{user.email}</Text>
                                                                        <HStack spacing={0} my={2}>
                                                                            <Link href={`/dashboard/users/manage-user?pageId=users&user_id=${user.id}`}>
                                                                                <Button
                                                                                    size={'sm'} rounded={0}
                                                                                    colorScheme={'twitter'}
                                                                                    title={'Edit'}
                                                                                >
                                                                                    <BsPenFill />
                                                                                </Button>
                                                                            </Link>
                                                                            <Link href={`/dashboard/account/fund-transfer?pageId=transfer&user_id=${user.id}`}>
                                                                                <Button
                                                                                    size={'sm'} rounded={0}
                                                                                    colorScheme={'whatsapp'}
                                                                                    title={'Transfer/Reversal'}
                                                                                >
                                                                                    <BiRupee fontSize={18} />
                                                                                </Button>
                                                                            </Link>
                                                                            <Link href={`/dashboard/reports/transactions/user-ledger?pageId=reports&user_id=${user.id}`}>
                                                                                <Button
                                                                                    size={'sm'} rounded={0}
                                                                                    colorScheme={'red'}
                                                                                    title={'Reports'}
                                                                                >
                                                                                    <BsFileBarGraphFill />
                                                                                </Button>
                                                                            </Link>
                                                                            <HStack p={2} bg={'white'}>
                                                                                <Switch
                                                                                    size={'sm'}
                                                                                    onChange={() => changeUserStatus(user.id, user.is_active == 1 ? 0 : 1)}
                                                                                    defaultChecked={user.is_active === 1}
                                                                                ></Switch>
                                                                            </HStack>
                                                                        </HStack>
                                                                            <Text>
                                                                                <a href={`tel:${user.alternate_phone}`}>{user.alternate_phone}</a>
                                                                            </Text>
                                                                        </Box>
                                                                    </Td>
                                                                    <Td>
                                                                        <Box>
                                                                            <Text><b>Status: </b>&nbsp;&nbsp; Verified </Text>
                                                                            <Text><b>Aadhaar No.: </b>&nbsp;&nbsp; {user.aadhaar} </Text>
                                                                            <Text><b>PAN: </b>&nbsp;&nbsp; {user.pan_number} </Text>
                                                                            <Text><b>GST No.: </b>&nbsp;&nbsp; {user.gst_number} </Text>
                                                                            <Text><b>Gender & DOB: </b>{user.gender} &nbsp;&nbsp;{user.dob}</Text>
                                                                            <Text><b>Organisation Code.: </b>&nbsp;&nbsp; RPAY </Text><br /><br />

                                                                        </Box>
                                                                    </Td>
                                                                    <Td pos={'relative'}>
                                                                        <Box>
                                                                            <Text><b>Current Balance: </b>&nbsp;&nbsp; ₹ {user.wallet} </Text>
                                                                            <Text><b>Capping Balance: </b>&nbsp;&nbsp; ₹ {user.minimum_balance} </Text>
                                                                            <Text textTransform={'capitalize'}>{user.packages[0].name} Plan</Text>
                                                                            <Text>{user.company_name} {user.firm_type}</Text>
                                                                        </Box>
                                                                    </Td>
                                                                    <Td>
                                                                        <Box>
                                                                            <Text>{user.line},</Text>
                                                                            <Text>{user.city}, {user.state},</Text>
                                                                            <Text>Pincode - {user.pincode}</Text>
                                                                        </Box>
                                                                    </Td>
                                                                    <Td>{/* PAN Card */}
                                                                        
                                                                        {
                                                                            user.pan_photo &&
                                                                            <Button size={'xs'}
                                                                                onClick={() => BackendAxios.post(`/api/admin/file`, {
                                                                                    address: user.pan_photo
                                                                                },{
                                                                                    responseType: 'blob'
                                                                                }).then(res=>{
                                                                                    fileDownload(res.data, `PAN.jpeg`)
                                                                                })}
                                                                            >View PAN Card</Button>
                                                                        }
                                                                        <br /><br />
                                                                        {/* Aadhaar Front */}
                                                                        {
                                                                            user.aadhaar_front &&
                                                                            <Button size={'xs'}
                                                                                onClick={() => BackendAxios.post(`/api/admin/file`, {
                                                                                    address: user.aadhaar_front
                                                                                },{
                                                                                    responseType: 'blob'
                                                                                }).then(res=>{
                                                                                    fileDownload(res.data, `AadhaarFront.jpeg`)
                                                                                })
                                                                            }
                                                                            >View Aadhaar Front</Button>
                                                                        }
                                                                        <br /><br />
                                                                        {/* Aadhaar Back */}
                                                                        {
                                                                            user.aadhaar_back &&
                                                                            <Button size={'xs'}
                                                                                onClick={() => BackendAxios.post(`/api/admin/file`, {
                                                                                    address: user.aadhaar_back
                                                                                },{
                                                                                    responseType: 'blob'
                                                                                }).then(res=>{
                                                                                    fileDownload(res.data, `AadhaarBack.jpeg`)
                                                                                })
                                                                            }
                                                                            >View Aadhaar Back</Button>
                                                                        }

                                                                    </Td>
                                                                </Tr>
                                                            )
                                                        })
                                                    }
                                                </Tbody>
                                            </Table>
                                        </TableContainer>
                                        <HStack spacing={2} py={4} bg={'white'} justifyContent={'center'}>
                                            <Button
                                                colorScheme={'twitter'}
                                                fontSize={12} size={'xs'}
                                                variant={'outline'}
                                                onClick={() => fetchUsersList(pagination.first_page_url)}
                                            ><BsChevronDoubleLeft />
                                            </Button>
                                            <Button
                                                colorScheme={'twitter'}
                                                fontSize={12} size={'xs'}
                                                variant={'outline'}
                                                onClick={() => fetchUsersList(pagination.prev_page_url)}
                                            ><BsChevronLeft />
                                            </Button>
                                            <Button
                                                colorScheme={'twitter'}
                                                fontSize={12} size={'xs'}
                                                variant={'solid'}
                                            >{pagination.current_page}</Button>
                                            <Button
                                                colorScheme={'twitter'}
                                                fontSize={12} size={'xs'}
                                                variant={'outline'}
                                                onClick={() => fetchUsersList(pagination.next_page_url)}
                                            ><BsChevronRight />
                                            </Button>
                                            <Button
                                                colorScheme={'twitter'}
                                                fontSize={12} size={'xs'}
                                                variant={'outline'}
                                                onClick={() => fetchUsersList(pagination.last_page_url)}
                                            ><BsChevronDoubleRight />
                                            </Button>
                                        </HStack>

                                        {/* Printable Table */}
                                        <VisuallyHidden>
                                            <Table variant='striped' colorScheme='teal' id='exportableTable'>
                                                <Thead>
                                                    <Tr>
                                                        <Th>Basic Details</Th>
                                                        <Th>KYC Details</Th>
                                                        <Th>Balance Details</Th>
                                                        <Th>Complete Address</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody fontSize={'xs'}>
                                                    {
                                                        fetchedUsers && fetchedUsers.map((user, key) => {
                                                            return (
                                                                <Tr>
                                                                    <Td>
                                                                        <Box>
                                                                            {/* <Text textTransform={'capitalize'}>{user.packages[0].name} Plan</Text><br /><br /> */}
                                                                            <Text><b>ID: </b>{user.id}</Text>
                                                                            <Text>{user.first_name} {user.last_name} </Text><br />
                                                                            <Text>{user.email}</Text><br />
                                                                            <Text><br />
                                                                                <a href={`tel:${user.phone_number}`}>{user.phone_number}</a>,
                                                                                <a href={`tel:${user.alternate_phone}`}>{user.alternate_phone}</a>
                                                                            </Text>
                                                                            <Text>{user.gender} &nbsp;&nbsp;{user.dob}</Text><br /><br />
                                                                            <Text>{user.company_name} {user.firm_type}</Text><br />
                                                                        </Box>
                                                                    </Td>
                                                                    <Td>
                                                                        <Box>
                                                                            <Text><b>Status: </b>&nbsp;&nbsp; Verified </Text><br />
                                                                            <Text><b>Aadhaar No.: </b>&nbsp;&nbsp; {user.aadhaar} </Text><br />
                                                                            <Text><b>PAN: </b>&nbsp;&nbsp; {user.pan_number} </Text><br />
                                                                            <Text><b>GST No.: </b>&nbsp;&nbsp; {user.gst_number} </Text><br /><br />
                                                                            <Text><b>Organisation Code.: </b>&nbsp;&nbsp; RPAY </Text><br />
                                                                        </Box>
                                                                    </Td>
                                                                    <Td>
                                                                        <Box>
                                                                            <Text><b>Current Balance: </b>&nbsp;&nbsp; Rs. {user.wallet} </Text><br />
                                                                            <Text><b>Capping Balance: </b>&nbsp;&nbsp; Rs. {user.minimum_balance} </Text><br /><br />
                                                                        </Box>
                                                                    </Td>
                                                                    <Td>
                                                                        <Box>
                                                                            <Text>{user.line},</Text><br />
                                                                            <Text>{user.city}, {user.state},</Text><br />
                                                                            <Text>Pincode - {user.pincode}</Text><br />
                                                                        </Box>
                                                                    </Td>
                                                                </Tr>
                                                            )
                                                        })
                                                    }
                                                </Tbody>
                                            </Table>
                                        </VisuallyHidden>

                                    </TabPanel>
                                )
                            })
                        }

                    </TabPanels>
                </Tabs>


                {/* Permissions Drawer */}
                <Drawer
                    isOpen={permissionsDrawer}
                    placement='right'
                    onClose={() => setPermissionsDrawer(false)}
                    size={'lg'}
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Manage Permissions For User</DrawerHeader>

                        <DrawerBody>
                            <form id='userPermission'>
                                <input type="hidden" name='userId' value={selectedUser} />
                                {/* <TableContainer>
                                    <Table variant={'simple'}>
                                        <Thead>
                                            <Tr>
                                                <Th>Section Name</Th>
                                                <Th>Permissions</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            <Tr>
                                                <Td borderRight={'1px solid #999'}>
                                                    <Checkbox
                                                        isChecked={allAepsChecked}
                                                        isIndeterminate={isAepsIndeterminate}
                                                        onChange={(e) => setCheckedAepsItems([e.target.checked, e.target.checked])}
                                                    >
                                                        AePS Section
                                                    </Checkbox>
                                                </Td>
                                                <Td>
                                                    <HStack spacing={6}>
                                                        <Checkbox
                                                            isChecked={checkedAepsItems[0]}
                                                            onChange={(e) => setCheckedAepsItems([e.target.checked, checkedAepsItems[1]])}
                                                        >
                                                            AePS Basics
                                                        </Checkbox>
                                                        <Checkbox
                                                            isChecked={checkedAepsItems[0]}
                                                            onChange={(e) => setCheckedAepsItems([e.target.checked, checkedAepsItems[1]])}
                                                        >
                                                            AePS Payout
                                                        </Checkbox>
                                                        <Checkbox
                                                            isChecked={checkedAepsItems[0]}
                                                            onChange={(e) => setCheckedAepsItems([e.target.checked, checkedAepsItems[1]])}
                                                        >
                                                            AePS Report
                                                        </Checkbox>
                                                    </HStack>
                                                </Td>
                                            </Tr>
                                        </Tbody>
                                    </Table>
                                </TableContainer> */}
                                <VStack spacing={6} w={'full'} alignItems={'flex-start'}>
                                    <CheckboxTree
                                        nodes={aepsList}
                                        checked={aepsPermissions}
                                        onCheck={(checked) => setAepsPermissions(checked)}
                                        expanded={aepsExpansion}
                                        onExpand={(expanded) => setAepsExpansion(expanded)}
                                    />

                                    <CheckboxTree
                                        nodes={bbpsList}
                                        checked={bbpsPermissions}
                                        onCheck={(checked) => setBbpsPermissions(checked)}
                                        expanded={bbpsExpansion}
                                        onExpand={(expanded) => setBbpsExpansion(expanded)}
                                    />

                                    <CheckboxTree
                                        nodes={payoutList}
                                        checked={payoutPermissions}
                                        onCheck={(checked) => setPayoutPermissions(checked)}
                                        expanded={payoutExpansion}
                                        onExpand={(expanded) => setPayoutExpansion(expanded)}
                                    />

                                    <CheckboxTree
                                        nodes={dmtList}
                                        checked={dmtPermissions}
                                        onCheck={(checked) => setDmtPermissions(checked)}
                                        expanded={dmtExpansion}
                                        onExpand={(expanded) => setDmtExpansion(expanded)}
                                    />
                                </VStack>
                            </form>
                        </DrawerBody>

                        <DrawerFooter>
                            <Button variant='outline' mr={3}
                                onClick={() => setPermissionsDrawer(false)}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme='blue'
                                onClick={saveUserPermissions}
                            >Save</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

            </DashboardWrapper >
        </>
    )
}

export default Index