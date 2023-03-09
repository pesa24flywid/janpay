import React, { useEffect } from 'react'
import {
    useFormik
} from 'formik'
import {
    Box,
    Stack,
    HStack,
    VStack,
    Input,
    Select,
    Textarea,
    FormControl,
    FormLabel,
    Text,
    Button,
    RadioGroup,
    Radio,
    Switch,
} from '@chakra-ui/react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'

const Index = () => {

    const Formik = useFormik({
        initialValues: {
            userType: "",
            userPlan: "",
            parentDistributor: "",
            parentSuperDistributor: "",
            firstName: "",
            lastName: "",
            userEmail: "",
            userPhone: "",
            alternativePhone: "",
            dob: null,
            gender: "",
            firstName: "",
            companyType: "",
            aadhaarNum: "",
            panNum: "",
            capAmount: "",
            phoneVerified: "0",
            emailVerified: "0",
            line: "",
            city: "",
            state: "",
            pincode: "",
            isActive: "0",
            approvedBy: "",
            referralCode: "",
            gst: "",
        }
    })

    const FileFormik = useFormik({
        initialValues: {
            profilePic: null,
            aadhaarFront: null,
            aadhaarBack: null,
            pan: null,

        }
    })


    return (
        <>
            <DashboardWrapper titleText={'Create User'}>
                <Text fontWeight={'semibold'} fontSize={'lg'}>Create New User</Text>

                <Stack
                    direction={['column', 'row']}
                    spacing={4}
                >
                    <Box py={4} w={['full', '3xl']} flex={['unset', 7]}>
                        <Stack direction={['column', 'row']} spacing={4}>
                            <FormControl w={['full', 'xs']}>
                                <FormLabel>User Type</FormLabel>
                                <Select
                                    name='userType'
                                    bg={'white'}
                                    placeholder={'Select here'}
                                    value={Formik.values.userType}
                                    onChange={Formik.handleChange}
                                >
                                    <option value="retailer">Retailer</option>
                                    <option value="distributor">Distributor</option>
                                    <option value="super distributor">Super Distributor</option>
                                </Select>
                            </FormControl>
                            <FormControl w={['full', 'xs']}>
                                <FormLabel>User Plan</FormLabel>
                                <Select
                                    name='userPlan'
                                    bg={'white'}
                                    placeholder={'Select here'}
                                    value={Formik.values.userPlan}
                                    onChange={Formik.handleChange}
                                >
                                        <option value="retailer basic">Retailer Basic</option>
                                        <option value="retailer premium">Retailer Premium</option>
                                        <option value="distributor basic">Distributor Basic</option>
                                        <option value="distributor premium">Distributor Premium</option>
                                </Select>
                            </FormControl>
                            {
                                Formik.values.userType == "retailer" &&
                                <FormControl w={['full', 'xs']}>
                                    <FormLabel>Parent Distributor</FormLabel>
                                    <Select
                                        name='parentDistributor'
                                        bg={'white'}
                                        value={Formik.values.parentDistributor}
                                        onChange={Formik.handleChange}
                                    >
                                        <option value="akhil">Akhil</option>
                                        <option value="sangam">sangam</option>
                                    </Select>
                                </FormControl>
                            }
                            {
                                Formik.values.userType == "distributor" &&
                                <FormControl w={['full', 'xs']}>
                                    <FormLabel>Parent Super Distributor</FormLabel>
                                    <Select
                                        name='parentSuperDistributor'
                                        bg={'white'}
                                        value={Formik.values.parentSuperDistributor}
                                        onChange={Formik.handleChange}
                                    >
                                        <option value="akhil">Akhil</option>
                                        <option value="sangam">sangam</option>
                                    </Select>
                                </FormControl>
                            }

                        </Stack>

                        <Box
                            p={2} mt={8} mb={4}
                            bg={'teal.500'} color={'white'}>
                            <Text>Basic Details</Text>
                        </Box>
                        <Stack
                            direction={['column', 'row']}
                            spacing={4} py={4}
                        >
                            <FormControl w={['full', 'xs']}>
                                <FormLabel>User Name</FormLabel>
                                <HStack spacing={2}>
                                    <Input
                                        name='firstName' bg={'white'}
                                        onChange={Formik.handleChange}
                                        placeholder={'First Name'}
                                    />
                                    <Input
                                        name='lastName' bg={'white'}
                                        onChange={Formik.handleChange}
                                        placeholder={'Last Name'}
                                    />
                                </HStack>
                            </FormControl>
                            <FormControl w={['full', 'xs']}>
                                <FormLabel>User Email</FormLabel>
                                <Input
                                    name='userEmail' bg={'white'}
                                    onChange={Formik.handleChange}
                                    placeholder={'Enter User Email'}
                                />
                            </FormControl>

                            <FormControl w={['full', 'xs']}>
                                <FormLabel>User Phone Number</FormLabel>
                                <Input
                                    name='userPhone' bg={'white'}
                                    onChange={Formik.handleChange}
                                    placeholder={'Enter Phone Number'}
                                />
                            </FormControl>

                        </Stack>
                        <Stack
                            direction={['column', 'row']}
                            spacing={4} py={4}
                        >
                            <FormControl w={['full', 'xs']}>
                                <FormLabel>Alternative Mobile Number</FormLabel>
                                <Input
                                    name='alternatePhone' bg={'white'}
                                    onChange={Formik.handleChange}
                                    placeholder={'Alternate Phone Number'}
                                />
                            </FormControl>
                            <FormControl w={['full', 'xs']}>
                                <FormLabel>User DoB</FormLabel>
                                <Input
                                    name='dob' bg={'white'}
                                    type={'date'}
                                    onChange={Formik.handleChange}
                                    placeholder={'Enter User Email'}
                                />
                            </FormControl>

                            <FormControl w={['full', 'xs']}>
                                <FormLabel>Gender</FormLabel>
                                <RadioGroup name='gender' onChange={Formik.handleChange}>
                                    <HStack spacing={6} >
                                        <Radio value='male'>Male</Radio>
                                        <Radio value='female'>Female</Radio>
                                    </HStack>
                                </RadioGroup>
                            </FormControl>

                        </Stack>
                        <Stack
                            direction={['column', 'row']}
                            spacing={4} py={4}
                        >
                            <FormControl w={['full', 'xs']}>
                                <FormLabel>Firm Name</FormLabel>
                                <Input
                                    name='firmName' bg={'white'}
                                    onChange={Formik.handleChange}
                                    placeholder={'Enter Firm Name'}
                                />
                            </FormControl>
                            <FormControl w={['full', 'xs']}>
                                <FormLabel>Company Type</FormLabel>
                                <Select
                                    name={'companyType'}
                                    onChange={Formik.handleChange}
                                    bg={'white'}
                                    placeholder={'Select here'}
                                >
                                    <option value="sole proprietor">Sole Proprietor</option>
                                    <option value="pvtltd">Private Limited</option>
                                    <option value="partnership">Partnership</option>
                                    <option value="llp">LLP</option>
                                </Select>
                            </FormControl>
                        </Stack>


                        <Box
                            p={2} mt={8} mb={4}
                            bg={'teal.500'} color={'white'}>
                            <Text>KYC Details</Text>
                        </Box>
                        <Stack
                            py={4} spacing={4}
                            direction={['column', 'row']}
                        >
                            <FormControl w={['full', 'xs']}>
                                <FormLabel>KYC Status</FormLabel>
                                <Input
                                    name='kycStatus' bg={'white'}
                                    disabled value={'undefined'}
                                />
                            </FormControl>
                            <FormControl w={['full', 'xs']}>
                                <FormLabel>Aadhaar Number</FormLabel>
                                <Input
                                    name='aadhaarNum' bg={'white'}
                                    placeholder={'Enter Aadhaar Number'}
                                    maxLength={12}
                                    onChange={Formik.handleChange}
                                />
                            </FormControl>
                            <FormControl w={['full', 'xs']}>
                                <FormLabel>PAN Number</FormLabel>
                                <Input
                                    name='panNum' bg={'white'}
                                    placeholder={'Enter PAN Number'}
                                    maxLength={10}
                                    onChange={Formik.handleChange}
                                />
                            </FormControl>
                        </Stack>
                        <Stack
                            py={4} spacing={4}
                            direction={['column', 'row']}
                        >
                            <FormControl w={['full', 'xs']}>
                                <FormLabel>GST Number</FormLabel>
                                <Input
                                    name='gst' bg={'white'}
                                    placeholder={'Enter GST Number'}
                                    onChange={Formik.handleChange}
                                />
                            </FormControl>
                            <FormControl w={['full', 'xs']}>
                                <FormLabel>Referral Code</FormLabel>
                                <Input
                                    bg={'white'}
                                    name={'referralCode'}
                                    onChange={Formik.handleChange}
                                    placeholder={'Enter here...'}
                                />
                            </FormControl>
                        </Stack>

                        <Box
                            p={2} mt={8} mb={4}
                            bg={'teal.500'} color={'white'}>
                            <Text>Additional Details</Text>

                        </Box>
                        <Box py={4}>
                            <FormControl>
                                <HStack justifyContent={'space-between'}>
                                    <FormLabel>Is user active?</FormLabel>
                                    <Switch name='isActive' onChange={Formik.handleChange}></Switch>
                                </HStack>
                            </FormControl>
                        </Box>
                    </Box>


                    <Box
                        py={4}
                        w={['full', 'sm']}
                        flex={['unset', 3]}
                    >

                        <Box
                            rounded={8}
                            overflow={'hidden'}
                            boxShadow={'lg'}
                        >
                            <Box
                                p={2} color={'white'}
                                bg={'teal.500'}
                            >
                                <Text>Balance Details</Text>
                            </Box>
                            <Box p={4}>
                                <VStack spacing={6}>
                                    <FormControl w={['full']}>
                                        <FormLabel>Capping Amount</FormLabel>
                                        <Input
                                            type={'number'} bg={'white'}
                                            name={'capAmount'} placeholder={'Enter Amount'}
                                            onChange={Formik.handleChange}
                                        />
                                    </FormControl>
                                    <FormControl w={['full']}>
                                        <FormLabel>Email Verified</FormLabel>
                                        <RadioGroup
                                            name={'emailVerified'}
                                            onChange={Formik.handleChange}
                                        >
                                            <HStack spacing={12}>
                                                <Radio value='1'>Yes</Radio>
                                                <Radio value='0'>No</Radio>
                                            </HStack>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormControl w={['full']}>
                                        <FormLabel>Mobile Verified</FormLabel>
                                        <RadioGroup
                                            name={'phoneVerified'}
                                            onChange={Formik.handleChange}
                                        >
                                            <HStack spacing={12}>
                                                <Radio value='1'>Yes</Radio>
                                                <Radio value='0'>No</Radio>
                                            </HStack>
                                        </RadioGroup>
                                    </FormControl>
                                </VStack>
                            </Box>
                        </Box>


                        {/* Address Collection Form */}
                        <Box
                            rounded={8} mt={12}
                            overflow={'hidden'}
                            boxShadow={'lg'}
                        >
                            <Box
                                p={2} color={'white'}
                                bg={'teal.500'}
                            >
                                <Text>Address Details</Text>
                            </Box>
                            <Box p={4}>
                                <VStack spacing={6}>
                                    <FormControl w={['full']}>
                                        <FormLabel>Street Address</FormLabel>
                                        <Input
                                            type={'number'} bg={'white'}
                                            name={'line'} placeholder={'Enter here'}
                                            onChange={Formik.handleChange}
                                        />
                                    </FormControl>
                                    <FormControl w={['full']}>
                                        <FormLabel>City</FormLabel>
                                        <Input
                                            type={'number'} bg={'white'}
                                            name={'city'} placeholder={'Enter City'}
                                            onChange={Formik.handleChange}
                                        />
                                    </FormControl>
                                    <FormControl w={['full']}>
                                        <FormLabel>State</FormLabel>
                                        <Select name='state'
                                            placeholder='Select here'
                                            onChange={Formik.handleChange}
                                        >
                                            <option value="Jammu Kashmir"></option>
                                            <option value="Delhi"></option>
                                        </Select>
                                    </FormControl>
                                    <FormControl w={['full']}>
                                        <FormLabel>Pincode</FormLabel>
                                        <Input
                                            type={'number'} maxLength={6}
                                            placeholder={'Enter Pincode'}
                                            name={'pincode'} onChange={Formik.handleChange}
                                        />
                                    </FormControl>
                                </VStack>
                            </Box>
                        </Box>

                    </Box>
                </Stack>

                <Box>
                    <Text fontWeight={'semibold'}>Upload Files</Text>
                    <Stack p={4}
                        direction={['column', 'row']}
                        spacing={12}
                    >
                        <FormControl
                            w={['full', '36']}
                        >
                            <FormLabel
                                boxSize={['xs', '36']} rounded={12}
                                border={'1px'} borderStyle={'dashed'}
                                borderColor={'teal.300'} cursor={'pointer'}
                                display={'grid'} placeContent={'center'}
                                htmlFor={'profilePic'}
                            >
                                <Text
                                    fontSize={'xs'}
                                    fontWeight={'semibold'}
                                    color={'teal.400'}
                                >Choose Profile Pic</Text>
                            </FormLabel>
                            <Input
                                type={'file'}
                                name={'profilePic'}
                                id={'profilePic'}
                                display={'none'}
                                onChange={FileFormik.handleChange}
                            />
                            <Button
                                colorScheme={'red'}
                                size={'xs'}
                            >Delete</Button>
                        </FormControl>
                        <FormControl
                            w={['full', '36']}
                        >
                            <FormLabel
                                boxSize={['xs', '36']} rounded={12}
                                border={'1px'} borderStyle={'dashed'}
                                borderColor={'teal.300'} cursor={'pointer'}
                                display={'grid'} placeContent={'center'}
                                htmlFor={'aadhaarFront'}
                            >
                                <Text
                                    fontSize={'xs'}
                                    fontWeight={'semibold'}
                                    color={'teal.400'}
                                >Upload Aadhaar Front</Text>
                            </FormLabel>
                            <Input
                                type={'file'}
                                name={'aadhaarFront'}
                                id={'aadhaarFront'}
                                display={'none'}
                                onChange={FileFormik.handleChange}
                            />
                            <Button
                                colorScheme={'red'}
                                size={'xs'}
                            >Delete</Button>
                        </FormControl>
                        <FormControl
                            w={['full', '36']}
                        >
                            <FormLabel
                                boxSize={['xs', '36']} rounded={12}
                                border={'1px'} borderStyle={'dashed'}
                                borderColor={'teal.300'} cursor={'pointer'}
                                display={'grid'} placeContent={'center'}
                                htmlFor={'aadhaarBack'}
                            >
                                <Text
                                    fontSize={'xs'}
                                    fontWeight={'semibold'}
                                    color={'teal.400'}
                                >Upload Aadhaar Back</Text>
                            </FormLabel>
                            <Input
                                type={'file'}
                                name={'aadhaarBack'}
                                id={'aadhaarBack'}
                                display={'none'}
                                onChange={FileFormik.handleChange}
                            />
                            <Button
                                colorScheme={'red'}
                                size={'xs'}
                            >Delete</Button>
                        </FormControl>
                        <FormControl
                            w={['full', '36']}
                        >
                            <FormLabel
                                boxSize={['xs', '36']} rounded={12}
                                border={'1px'} borderStyle={'dashed'}
                                borderColor={'teal.300'} cursor={'pointer'}
                                display={'grid'} placeContent={'center'}
                                htmlFor={'pan'}
                            >
                                <Text
                                    fontSize={'xs'}
                                    fontWeight={'semibold'}
                                    color={'teal.400'}
                                >Upload PAN Card</Text>
                            </FormLabel>
                            <Input
                                type={'file'}
                                name={'pan'}
                                id={'pan'}
                                display={'none'}
                                onChange={FileFormik.handleChange}
                            />
                            <Button
                                colorScheme={'red'}
                                size={'xs'}
                            >Delete</Button>
                        </FormControl>
                    </Stack>
                </Box>
            </DashboardWrapper>
        </>
    )
}

export default Index