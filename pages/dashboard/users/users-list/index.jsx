import React, { useState, useEffect, useRef } from 'react'
import {
    Box,
    Text,
    HStack,
    VStack,
    Stack,
    Button,
    Input,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Switch,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableContainer,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Checkbox,
    CheckboxGroup
} from '@chakra-ui/react'
import { SiMicrosoftexcel } from 'react-icons/si'
import { FaFileCsv, FaFilePdf, FaPrint } from 'react-icons/fa'
import { Grid, html } from "gridjs";
import { _ } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";


import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { BsChevronDown } from 'react-icons/bs';
import DashboardWrapper from '../../../../hocs/DashboardLayout';


const Index = () => {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const [checkedItems, setCheckedItems] = React.useState([false, false])

    const allChecked = checkedItems.every(Boolean)
    const isIndeterminate = checkedItems.some(Boolean) && !allChecked

    const grid = new Grid({
        columns: [
            'User Details',
            'KYC Details',
            'Balance Details',
            'Complete Address',
            'Parent Details',
            'Actions',
        ],
        data: [
            [
                html(`
                    <p>Retailer &nbsp;&nbsp; (Retailer Basic) </p></br>
                    <p>Sangam Kumar </p>
                    <p>dezynationindia@gmail.com </p>
                    <p><a href={'tel:+917838074742'}>+917838074742</a>, <a href={'tel:+919971412064'}>+919971412064</a> </p>
                    <p>Male &nbsp;&nbsp;07 April 2002</p></br>

                    <p>Dezynation Proprietorship</p>
                    `),
                html(`
                    <p><b>Status: </b>&nbsp;&nbsp; Pending </p>
                    <p><b>Aadhaar No.: </b>&nbsp;&nbsp; 67XXXXXX3832 </p>
                    <p><b>PAN: </b>&nbsp;&nbsp; JNxxxxx3D </p>
                    <p><b>GST No.: </b>&nbsp;&nbsp; NA </p></br>
                    <p><b>Referral Code.: </b>&nbsp;&nbsp; REPB50 </p>
                    `),
                html(`
                <p><b>Current Balance: </b>&nbsp;&nbsp; ₹ 4689 </p>
                <p><b>Capping Balance: </b>&nbsp;&nbsp; ₹ 500 </p></br>
                <p><b>Distributors' Balance: </b></p>
                <p>₹ 495500 </p></br>
                <p><b>Retailer' Balance: </b></p>
                <p>₹ 495500 </p></br>
                `),
                html(`
                    <p>B390, Mangal Bazar Road, Block B, Jahangir Puri,</p>
                    <p>New Delhi, Delhi,</p>
                    <p>Pincode - 110033</p>
                `),
                _(<>
                    <p><b>Parent: </b></p><br />
                    <p>Parent Name Here (User ID)</p>
                    <p>Parent Mobile Here</p>
                </>),
                _(<>
                    <span><b>Active</b> <Switch size={'sm'} isChecked></Switch></span>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
                        <button style={{ padding: "2px 4px", background: "green", color: "white" }}>View Profile</button>
                        <button style={{ padding: "2px 4px", background: "orange", color: "white" }}>Send MPIN</button>
                        <button style={{ padding: "2px 4px", background: "blue", color: "white" }}>Send Password</button>
                    </div>
                </>)
            ],
            [
                html(`
                    <p>Retailer &nbsp;&nbsp; (Retailer Basic) </p></br>
                    <p>Rishi Kumar </p>
                    <p>dezynationindia@gmail.com </p>
                    <p><a href={'tel:+917838074742'}>+917838074742</a>, <a href={'tel:+919971412064'}>+919971412064</a> </p>
                    <p>Male &nbsp;&nbsp;07 April 2002</p></br>

                    <p>Dezynation Proprietorship</p>
                    `),
                html(`
                    <p><b>Status: </b>&nbsp;&nbsp; Verified </p>
                    <p><b>Aadhaar No.: </b>&nbsp;&nbsp; 67XXXXXX3832 </p>
                    <p><b>PAN: </b>&nbsp;&nbsp; JNxxxxx3D </p>
                    <p><b>GST No.: </b>&nbsp;&nbsp; NA </p></br>
                    <p><b>Referral Code.: </b>&nbsp;&nbsp; REPB50 </p>
                    `),
                html(`
                <p><b>Current Balance: </b>&nbsp;&nbsp; ₹ 4689 </p>
                <p><b>Capping Balance: </b>&nbsp;&nbsp; ₹ 500 </p></br>
                <p><b>Distributors' Balance: </b></p>
                <p>₹ 495500 </p></br>
                <p><b>Retailer' Balance: </b></p>
                <p>₹ 495500 </p></br>

                `),
                html(`
                    <p>B390, Mangal Bazar Road, Block B, Jahangir Puri,</p>
                    <p>New Delhi, Delhi,</p>
                    <p>Pincode - 110033</p>
                `),
                _(<>
                </>),
                _(<>
                    <span><b>Active</b> <Switch size={'sm'} isChecked></Switch></span>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
                        <button style={{ padding: "2px 4px", background: "green", color: "white" }}>View Profile</button>
                        <button style={{ padding: "2px 4px", background: "orange", color: "white" }}>Send MPIN</button>
                        <button style={{ padding: "2px 4px", background: "blue", color: "white" }}>Send Password</button>
                    </div>
                </>)
            ],
        ],
        autoWidth: true,
        style: {
            th: {
                'background-color': "rgb(0,0,200)",
                'color': "#FFF",
                'padding': "4px 16px"
            },
            td: {
                'padding': "8px 12px",
                'font-size': "12px",
                'vertical-align': 'top',
            },
        },
    });

    const AdditonalCellRenderer = (props) => {
        <>
            <Switch id={props.userId}>Active</Switch>
        </>
    }

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: "Additional Details",
            field: "additional details",
            cellRenderer: AdditonalCellRenderer,
            cellRendererParams: {
                userId: 1
            }
        }
    ])

    const [rowData, setRowData] = useState([

    ])

    // useEffect(() => {
    //     grid.render(wrapperRef.current);
    // });


    return (
        <>
            <DashboardWrapper titleText={'Users List'}>
                <Tabs
                    variant='soft-rounded'
                    colorScheme='green'
                    isFitted
                >
                    <TabList>
                        <Tab fontSize={['xs', 'lg']} _selected={{ bg: 'twitter.500', color: 'white' }}>Super Distributor</Tab>
                        <Tab fontSize={['xs', 'lg']} _selected={{ bg: 'twitter.500', color: 'white' }}>Distributor</Tab>
                        <Tab fontSize={['xs', 'lg']} _selected={{ bg: 'twitter.500', color: 'white' }}>Retailer</Tab>
                    </TabList>
                    <TabPanels pt={8}>

                        {/* Super Distributors Here */}
                        <TabPanel>

                            <Stack
                                direction={['column', 'row']}
                                justifyContent={'space-between'}
                                alignItems={'center'}
                            >
                                <HStack spacing={4}>
                                    <Button size={['xs', 'sm']} colorScheme={'twitter'} leftIcon={<FaFileCsv />}>CSV</Button>
                                    <Button size={['xs', 'sm']} colorScheme={'whatsapp'} leftIcon={<SiMicrosoftexcel />}>Excel</Button>
                                    <Button size={['xs', 'sm']} colorScheme={'red'} leftIcon={<FaFilePdf />}>PDF</Button>
                                    <Button size={['xs', 'sm']} colorScheme={'facebook'} leftIcon={<FaPrint />}>Print</Button>
                                </HStack>
                                <Input
                                    bg={'white'}
                                    w={['full', 'xs']}
                                    placeholder={'Search Here'}
                                />
                            </Stack>

                            {/* Table */}
                            {/* <Box ref={wrapperRef}></Box> */}

                            <TableContainer my={6}>
                                <Table variant='striped' colorScheme='teal'>
                                    <Thead>
                                        <Tr>
                                            <Th>Basic Details</Th>
                                            <Th>KYC Details</Th>
                                            <Th>Balance Details</Th>
                                            <Th>Complete Address</Th>
                                            <Th>Parent Details</Th>
                                            <Th>Actions</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody fontSize={'xs'}>
                                        <Tr>
                                            <Td>
                                                <Box>
                                                    <Text>Retailer &nbsp;&nbsp; (Retailer Basic) </Text><br />
                                                    <Text>Sangam Kumar </Text>
                                                    <Text>dezynationindia@gmail.com </Text>
                                                    <Text><a href={'tel:+917838074742'}>+917838074742</a>, <a href={'tel:+919971412064'}>+919971412064</a> </Text>
                                                    <Text>Male &nbsp;&nbsp;07 April 2002</Text><br />
                                                    <Text>Dezynation Proprietorship</Text>
                                                </Box>
                                            </Td>
                                            <Td>
                                                <Box>
                                                    <Text><b>Status: </b>&nbsp;&nbsp; Verified </Text>
                                                    <Text><b>Aadhaar No.: </b>&nbsp;&nbsp; 67XXXXXX3832 </Text>
                                                    <Text><b>PAN: </b>&nbsp;&nbsp; JNxxxxx3D </Text>
                                                    <Text><b>GST No.: </b>&nbsp;&nbsp; NA </Text><br />
                                                    <Text><b>Referral Code.: </b>&nbsp;&nbsp; REPB50 </Text>
                                                </Box>
                                            </Td>
                                            <Td>
                                                <Box>
                                                    <Text><b>Current Balance: </b>&nbsp;&nbsp; ₹ 4689 </Text>
                                                    <Text><b>Capping Balance: </b>&nbsp;&nbsp; ₹ 500 </Text><br />
                                                    <Text><b>Distributors' Balance: </b>&nbsp;&nbsp;₹ 495500</Text>
                                                    <Text><b>Retailers' Balance: </b>&nbsp;&nbsp;₹ 495500</Text>
                                                </Box>
                                            </Td>
                                            <Td>
                                                <Box>
                                                    <Text>B390, Mangal Bazar Road, Block B, Jahangir Puri,</Text>
                                                    <Text>New Delhi, Delhi,</Text>
                                                    <Text>Pincode - 110033</Text>
                                                </Box>
                                            </Td>
                                            <Td>
                                                <Box>
                                                    <Text>(567) - Admin One</Text>
                                                    <Text>+91 7838074742</Text>
                                                </Box>
                                            </Td>
                                            <Td>
                                                <VStack gap={4}>
                                                    <Switch size={'sm'} defaultChecked>Active</Switch>
                                                    <Popover>
                                                        <PopoverTrigger>
                                                            <Button
                                                                rightIcon={<BsChevronDown />}
                                                                size={'sm'} colorScheme={'twitter'}
                                                            >
                                                                Actions
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent>
                                                            <PopoverBody>
                                                                <Box>
                                                                    <VStack alignItems={'flex-start'} spacing={0}>
                                                                        <Text w={'full'} pb={1} borderBottom={'1px solid #999'}>Actions</Text>
                                                                        <Text p={2} w={'full'} fontSize={'sm'} cursor={'pointer'} _hover={{ bg: 'blue.50' }}>Fund Transfer/Reversal</Text>
                                                                        <Text p={2} w={'full'} fontSize={'sm'} cursor={'pointer'} _hover={{ bg: 'blue.50' }}>Scheme</Text>
                                                                    </VStack>
                                                                    <Box h={8} w={'full'}></Box>
                                                                    <VStack alignItems={'flex-start'} spacing={0}>
                                                                        <Text w={'full'} pb={1} borderBottom={'1px solid #999'}>Settings</Text>
                                                                        <Text p={2} w={'full'} fontSize={'sm'} cursor={'pointer'} _hover={{ bg: 'blue.50' }} onClick={onOpen}>Permissions</Text>
                                                                        <Text p={2} w={'full'} fontSize={'sm'} cursor={'pointer'} _hover={{ bg: 'blue.50' }}>View Profile</Text>
                                                                        <Text p={2} w={'full'} fontSize={'sm'} cursor={'pointer'} _hover={{ bg: 'blue.50' }}>KYC Management</Text>
                                                                    </VStack>
                                                                </Box>
                                                            </PopoverBody>
                                                        </PopoverContent>
                                                    </Popover>

                                                    <Popover>
                                                        <PopoverTrigger>
                                                            <Button
                                                                rightIcon={<BsChevronDown />}
                                                                size={'sm'} colorScheme={'whatsapp'}
                                                            >
                                                                Reports
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent>
                                                            <PopoverBody>
                                                                <Box>
                                                                    <VStack alignItems={'flex-start'} spacing={0}>
                                                                        <Text p={2} w={'full'} fontSize={'sm'} cursor={'pointer'} _hover={{ bg: 'blue.50' }}>AePS Report</Text>
                                                                        <Text p={2} w={'full'} fontSize={'sm'} cursor={'pointer'} _hover={{ bg: 'blue.50' }}>BbPS Report</Text>
                                                                        <Text p={2} w={'full'} fontSize={'sm'} cursor={'pointer'} _hover={{ bg: 'blue.50' }}>DMT Report</Text>
                                                                        <Text p={2} w={'full'} fontSize={'sm'} cursor={'pointer'} _hover={{ bg: 'blue.50' }}>Recharge Report</Text>
                                                                        <Text p={2} w={'full'} fontSize={'sm'} cursor={'pointer'} _hover={{ bg: 'blue.50' }}>User Ledger</Text>
                                                                    </VStack>
                                                                </Box>
                                                            </PopoverBody>
                                                        </PopoverContent>
                                                    </Popover>
                                                </VStack>
                                            </Td>
                                        </Tr>
                                    </Tbody>
                                    <Tfoot>
                                        <Tr>
                                            <Th>To convert</Th>
                                            <Th>into</Th>
                                            <Th>multiply by</Th>
                                        </Tr>
                                    </Tfoot>
                                </Table>
                            </TableContainer>

                        </TabPanel>




                        {/* Distributors Here */}
                        <TabPanel>

                        </TabPanel>




                        {/* Retailers Here */}
                        <TabPanel>

                        </TabPanel>

                    </TabPanels>
                </Tabs>


                {/* Permissions Drawer */}
                <Drawer
                    isOpen={isOpen}
                    placement='right'
                    onClose={onClose}
                    size={'lg'}
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Manage Permissions For User</DrawerHeader>

                        <DrawerBody>
                                <TableContainer>
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
                                                        isChecked={allChecked}
                                                        isIndeterminate={isIndeterminate}
                                                        onChange={(e) => setCheckedItems([e.target.checked, e.target.checked])}
                                                    >
                                                        AePS Section
                                                    </Checkbox>
                                                </Td>
                                                <Td>
                                                    <HStack spacing={6}>
                                                        <Checkbox
                                                            isChecked={checkedItems[0]}
                                                            onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1]])}
                                                        >
                                                            AePS Payout
                                                        </Checkbox>
                                                        <Checkbox
                                                            isChecked={checkedItems[1]}
                                                            onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])}
                                                        >
                                                            AePS Withrawal
                                                        </Checkbox>
                                                        <Checkbox
                                                            isChecked={checkedItems[1]}
                                                            onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])}
                                                        >
                                                            AePS Report
                                                        </Checkbox>
                                                    </HStack>
                                                </Td>
                                            </Tr>
                                            <Tr>
                                                <Td borderRight={'1px solid #999'}>
                                                    <Checkbox
                                                        isChecked={allChecked}
                                                        isIndeterminate={isIndeterminate}
                                                        onChange={(e) => setCheckedItems([e.target.checked, e.target.checked])}
                                                    >
                                                        AePS Section
                                                    </Checkbox>
                                                </Td>
                                                <Td>
                                                    <HStack spacing={6}>
                                                        <Checkbox
                                                            isChecked={checkedItems[0]}
                                                            onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1]])}
                                                        >
                                                            AePS Payout
                                                        </Checkbox>
                                                        <Checkbox
                                                            isChecked={checkedItems[1]}
                                                            onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])}
                                                        >
                                                            AePS Withrawal
                                                        </Checkbox>
                                                        <Checkbox
                                                            isChecked={checkedItems[1]}
                                                            onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])}
                                                        >
                                                            AePS Report
                                                        </Checkbox>
                                                    </HStack>
                                                </Td>
                                            </Tr>
                                            <Tr>
                                                <Td borderRight={'1px solid #999'}>
                                                    <Checkbox
                                                        isChecked={allChecked}
                                                        isIndeterminate={isIndeterminate}
                                                        onChange={(e) => setCheckedItems([e.target.checked, e.target.checked])}
                                                    >
                                                        AePS Section
                                                    </Checkbox>
                                                </Td>
                                                <Td>
                                                    <HStack spacing={6}>
                                                        <Checkbox
                                                            isChecked={checkedItems[0]}
                                                            onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1]])}
                                                        >
                                                            AePS Payout
                                                        </Checkbox>
                                                        <Checkbox
                                                            isChecked={checkedItems[1]}
                                                            onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])}
                                                        >
                                                            AePS Withrawal
                                                        </Checkbox>
                                                        <Checkbox
                                                            isChecked={checkedItems[1]}
                                                            onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])}
                                                        >
                                                            AePS Report
                                                        </Checkbox>
                                                    </HStack>
                                                </Td>
                                            </Tr>
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                        </DrawerBody>

                        <DrawerFooter>
                            <Button variant='outline' mr={3} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue'>Save</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

            </DashboardWrapper>
        </>
    )
}

export default Index