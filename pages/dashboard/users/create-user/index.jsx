import React, { useEffect, useState } from 'react'
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
    useToast,
} from '@chakra-ui/react'
import BackendAxios, { FormAxios } from '../../../../lib/axios'
import { states } from '../../../../lib/states'
import DashboardWrapper from '../../../../hocs/DashboardLayout'

const Index = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [availablePlans, setAvailablePlans] = useState([])
    const [myRole, setMyRole] = useState("")
    const [myUserId, setMyUserId] = useState("")
    const [myName, setMyName] = useState("")
    const [availableParents, setAvailableParents] = useState([])
    const Toast = useToast({
        position: 'top-right'
    })
    const Formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            userEmail: "",
            userPhone: "",
            userRole: "",
            userPlan: "",
            hasParent: "1",
            parent: "",
            alternatePhone: "",
            dob: null,
            gender: "",
            firmName: "",
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
            isActive: "1",
            approvedBy: "",
            referralCode: "",
            gst: "",
            profilePic: null,
            aadhaarFront: null,
            aadhaarBack: null,
            pan: null,
        },
        onSubmit: (values) => {
            if (values.profilePic && values.aadhaarBack && values.aadhaarFront && values.pan) {
                setIsLoading(true)
                let userForm = document.getElementById('createUserForm')
                FormAxios.postForm('/api/admin/create/user', userForm).then((res) => {
                    setIsLoading(false)
                    Toast({
                        status: 'success',
                        title: 'User Created',
                    })
                }).catch((err) => {
                    setIsLoading(false)
                    Toast({
                        status: 'error',
                        title: 'Error while creating user',
                        description: err.response.data.message || err.response.data || err.message,
                    })
                    console.log(err)
                })
            }
            else {
                Toast({
                    status: 'error',
                    description: 'All images are mandatory'
                })
            }
        }
    })

    useEffect(() => {
        // Fetching all users
        BackendAxios.get(`/api/admin/all-users-list/distributor`).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
            Toast({
                status: 'error',
                description: 'Error while fetching users'
            })
        })

        // Fetching all plans
        BackendAxios.get('/api/admin/packages').then((res) => {
            setAvailablePlans(res.data)
        }).catch(err => {
            console.log(err)
            Toast({
                status: 'error',
                description: 'Error while fetching packages'
            })
        })

        // Getting current user role
        setMyRole(localStorage.getItem('userType'))
        setMyUserId(localStorage.getItem('userId'))
        setMyName(localStorage.getItem('userName'))
    }, [])

    useEffect(() => {
        // Fetching all users
        let parentRole
        if (Formik.values.userRole == "3" && myRole == "distributor") {
            Formik.setFieldValue("parent", localStorage.getItem("userId"))
        }
        if (Formik.values.userRole == "3" && myRole == "super_distributor") {
            parentRole = "distributor"
            BackendAxios.get(`/api/admin/all-users-list/${parentRole}`).then(res => {
                console.log(res.data)
                setAvailableParents(res.data)
            }).catch(err => {
                console.log(err)
                Toast({
                    status: 'error',
                    description: err.response.data.message || err.response.data || err.message
                })
            })
        }
        if (Formik.values.userRole == "2") {
            Formik.setFieldValue("parent", localStorage.getItem("userId"))
        }
    }, [Formik.values.userRole])

    return (
        <>
            <form onSubmit={Formik.handleSubmit} id={'createUserForm'}>
                <input type="hidden" name='hasParent' value={1} />
                <DashboardWrapper pageTitle={'Create User'}>
                    <Stack direction={['column', 'row']} spacing={4}>
                        <FormControl w={['full', 'xs']} >
                            <FormLabel>User Role</FormLabel>
                            <Select
                                placeholder='Select Role'
                                name={'userRole'} bg={'white'}
                                onChange={Formik.handleChange}
                            >
                                {
                                    myRole == "distributor" ? <>
                                        <option value="3">Retailer</option>
                                    </> : myRole == "super_distributor" ? <>
                                        <option value="3">Retailer</option>
                                        <option value="2">Distributor</option>
                                    </> : null
                                }
                            </Select>
                        </FormControl>

                        <FormControl w={['full', 'xs']} >
                            <FormLabel>User Plan</FormLabel>
                            <Select
                                placeholder='Select Plan'
                                name={'userPlan'} bg={'white'}
                                onChange={Formik.handleChange}
                            >
                                {
                                    availablePlans.map((item, key) => {
                                        return <option value={item.id} key={key}>{item.name}</option>
                                    })
                                }
                            </Select>
                        </FormControl>

                        {
                            Formik.values.userRole == "3" ?
                                <FormControl w={['full', 'xs']}>
                                    <FormLabel>Parent Distributor</FormLabel>
                                    <Select
                                        placeholder='Select Parent'
                                        name={'parent'} bg={'white'}
                                        onChange={Formik.handleChange}
                                    >
                                        {
                                            myRole == "super_distributor" ?
                                                availableParents.map((item, key) => {
                                                    return <option value={item.id} key={key}>{item.name}</option>
                                                }) :
                                                <option value={myUserId}>{myName}</option>
                                        }
                                    </Select>
                                </FormControl> : null
                        }
                    </Stack>

                    <Stack
                        direction={['column', 'row']}
                        spacing={4}
                    >
                        <Box py={4} w={['full', '3xl']} flex={['unset', 7]}>

                            <Box
                                p={2} mt={8} mb={4}
                                bg={'teal.500'} color={'white'}>
                                <Text>Basic Details</Text>
                            </Box>
                            <Stack
                                direction={['column', 'row']}
                                spacing={4} py={4}
                            >
                                <FormControl w={['full', '56']} isRequired>
                                    <FormLabel fontSize={12}>User Name</FormLabel>
                                    <Input
                                        fontSize={12}
                                        name='firstName' bg={'white'}
                                        onChange={Formik.handleChange}
                                        placeholder={'First Name'}
                                    />
                                </FormControl>
                                <FormControl w={['full', '56']} isRequired>
                                    <FormLabel fontSize={12}>Last Name</FormLabel>
                                    <Input
                                        fontSize={12}
                                        name='lastName' bg={'white'}
                                        onChange={Formik.handleChange}
                                        placeholder={'Last Name'}
                                    />
                                </FormControl>
                                <FormControl w={['full', '56']} isRequired>
                                    <FormLabel fontSize={12}>User Email</FormLabel>
                                    <Input
                                        fontSize={12}
                                        name='userEmail' bg={'white'}
                                        onChange={Formik.handleChange}
                                        placeholder={'Enter User Email'}
                                    />
                                </FormControl>

                            </Stack>
                            <Stack
                                direction={['column', 'row']}
                                spacing={4} py={4}
                            >

                                <FormControl w={['full', '56']} isRequired>
                                    <FormLabel fontSize={12}>User Phone Number</FormLabel>
                                    <Input
                                        fontSize={12}
                                        name='userPhone' bg={'white'}
                                        onChange={Formik.handleChange}
                                        placeholder={'Enter Phone Number'}
                                    />
                                </FormControl>
                                <FormControl w={['full', '56']}>
                                    <FormLabel fontSize={12}>Alternative Mobile Number</FormLabel>
                                    <Input
                                        fontSize={12}
                                        name='alternatePhone' bg={'white'}
                                        onChange={Formik.handleChange}
                                        placeholder={'Alternate Phone Number'}
                                    />
                                </FormControl>
                                <FormControl w={['full', '56']} isRequired>
                                    <FormLabel fontSize={12}>User DoB</FormLabel>
                                    <Input
                                        fontSize={12}
                                        name='dob' bg={'white'}
                                        type={'date'}
                                        onChange={Formik.handleChange}
                                        placeholder={'Enter User Email'}
                                    />
                                </FormControl>
                            </Stack>
                            <Stack
                                direction={['column', 'row']}
                                spacing={4} py={4}
                            >
                                <FormControl w={['full', '56']} isRequired>
                                    <FormLabel fontSize={12}>Gender</FormLabel>
                                    <RadioGroup name='gender' onChange={Formik.handleChange}>
                                        <HStack spacing={6} >
                                            <Radio value='male'>Male</Radio>
                                            <Radio value='female'>Female</Radio>
                                        </HStack>
                                    </RadioGroup>
                                </FormControl>
                                <FormControl w={['full', '56']}>
                                    <FormLabel fontSize={12}>Company Name</FormLabel>
                                    <Input
                                        fontSize={12}
                                        name='firmName' bg={'white'}
                                        onChange={Formik.handleChange}
                                        placeholder={'Enter Company Name'}
                                    />
                                </FormControl>
                                <FormControl w={['full', '56']}>
                                    <FormLabel fontSize={12}>Company Type</FormLabel>
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
                                <FormControl w={['full', '56']} isRequired>
                                    <FormLabel fontSize={12}>KYC Status</FormLabel>
                                    <Input
                                        fontSize={12}
                                        name='kycStatus' bg={'white'}
                                        disabled value={'undefined'}
                                    />
                                </FormControl>
                                <FormControl w={['full', '56']} isRequired>
                                    <FormLabel fontSize={12}>Aadhaar Number</FormLabel>
                                    <Input
                                        fontSize={12}
                                        name='aadhaarNum' bg={'white'}
                                        placeholder={'Enter Aadhaar Number'}
                                        maxLength={12}
                                        onChange={Formik.handleChange}
                                    />
                                </FormControl>
                                <FormControl w={['full', '56']} isRequired>
                                    <FormLabel fontSize={12}>PAN Number</FormLabel>
                                    <Input
                                        fontSize={12}
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
                                <FormControl w={['full', '56']} isRequired>
                                    <FormLabel fontSize={12}>GST Number</FormLabel>
                                    <Input
                                        fontSize={12}
                                        name='gst' bg={'white'}
                                        placeholder={'Enter GST Number'}
                                        onChange={Formik.handleChange}
                                    />
                                </FormControl>
                                <FormControl w={['full', '56']}>
                                    <FormLabel fontSize={12}>Referral Code</FormLabel>
                                    <Input
                                        fontSize={12}
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
                                <FormControl isRequired>
                                    <HStack justifyContent={'space-between'}>
                                        <FormLabel fontSize={12}>Is user active?</FormLabel>
                                        <input type="hidden" name='isActive' value={Formik.values.isActive} />
                                        fontSize={12}
                                        <Switch
                                            defaultChecked={true}
                                            onChange={(e) => { Formik.setFieldValue('isActive', e.target.checked ? "1" : "0") }}
                                        ></Switch>
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
                                        <FormControl w={['full']} isRequired>
                                            <FormLabel fontSize={12}>Capping Amount</FormLabel>
                                            <Input
                                                fontSize={12}
                                                type={'number'} bg={'white'}
                                                name={'capAmount'} placeholder={'Enter Amount'}
                                                onChange={Formik.handleChange}
                                            />
                                        </FormControl>
                                        <FormControl w={['full']} isRequired>
                                            <FormLabel fontSize={12}>Email Verified</FormLabel>
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
                                        <FormControl w={['full']} isRequired>
                                            <FormLabel fontSize={12}>Mobile Verified</FormLabel>
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
                                        <FormControl w={['full']} isRequired>
                                            <FormLabel fontSize={12}>Street Address</FormLabel>
                                            <Input
                                                fontSize={12}
                                                bg={'white'}
                                                name={'line'} placeholder={'Enter here'}
                                                onChange={Formik.handleChange}
                                            />
                                        </FormControl>
                                        <FormControl w={['full']} isRequired>
                                            <FormLabel fontSize={12}>City</FormLabel>
                                            <Input
                                                fontSize={12}
                                                bg={'white'}
                                                name={'city'} placeholder={'Enter City'}
                                                onChange={Formik.handleChange}
                                            />
                                        </FormControl>
                                        <FormControl w={['full']} isRequired>
                                            <FormLabel fontSize={12}>State</FormLabel>
                                            <Select name='state'
                                                placeholder='Select here'
                                                bg={'white'}
                                                onChange={Formik.handleChange}
                                            >
                                                {
                                                    states.map((stateName, key) => {
                                                        return <option value={stateName} key={key}>{stateName}</option>
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                        <FormControl w={['full']} isRequired>
                                            <FormLabel fontSize={12}>Pincode</FormLabel>
                                            <Input
                                                fontSize={12} bg={'white'}
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
                                    backgroundImage={
                                        Formik.values.profilePic ?
                                            URL.createObjectURL(Formik.values.profilePic) :
                                            "#FFFFFFFF"
                                    }
                                    backgroundSize={'contain'}
                                    backgroundRepeat={'no-repeat'}
                                    backgroundPosition={'center'}
                                >
                                    <Text
                                        fontSize={'xs'}
                                        fontWeight={'semibold'}
                                        color={'teal.400'}
                                    >Choose Profile Pic</Text>
                                </FormLabel>
                                <Input
                                    type={'file'}
                                    accept='.jpg, .jpeg, .png, .pdf'
                                    name={'profilePic'}
                                    id={'profilePic'}
                                    display={'none'}
                                    onChange={(e) => {
                                        Formik.setFieldValue('profilePic', e.currentTarget.files[0])
                                    }}
                                />
                                <Button
                                    colorScheme={'red'}
                                    size={'xs'}
                                    onClick={() => Formik.setFieldValue('profilePic', null)}
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
                                    backgroundImage={
                                        Formik.values.aadhaarFront ?
                                            URL.createObjectURL(Formik.values.aadhaarFront) :
                                            "#FFFFFFFF"
                                    }
                                    backgroundSize={'contain'}
                                    backgroundRepeat={'no-repeat'}
                                    backgroundPosition={'center'}
                                >
                                    <Text
                                        fontSize={'xs'}
                                        fontWeight={'semibold'}
                                        color={'teal.400'}
                                    >Upload Aadhaar Front</Text>
                                </FormLabel>
                                <Input
                                    type={'file'}
                                    accept='.jpg, .jpeg, .png, .pdf'
                                    name={'aadhaarFront'}
                                    id={'aadhaarFront'}
                                    display={'none'}
                                    onChange={(e) => Formik.setFieldValue('aadhaarFront', e.currentTarget.files[0])}
                                />
                                <Button
                                    colorScheme={'red'}
                                    size={'xs'}
                                    onClick={(e) => Formik.setFieldValue('aadhaarFront', null)}
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
                                    backgroundImage={
                                        Formik.values.aadhaarBack ?
                                            URL.createObjectURL(Formik.values.aadhaarBack) :
                                            "#FFFFFFFF"
                                    }
                                    backgroundSize={'contain'}
                                    backgroundRepeat={'no-repeat'}
                                    backgroundPosition={'center'}
                                >
                                    <Text
                                        fontSize={'xs'}
                                        fontWeight={'semibold'}
                                        color={'teal.400'}
                                    >Upload Aadhaar Back</Text>
                                </FormLabel>
                                <Input
                                    type={'file'}
                                    accept='.jpg, .jpeg, .png, .pdf'
                                    name={'aadhaarBack'}
                                    id={'aadhaarBack'}
                                    display={'none'}
                                    onChange={(e) => Formik.setFieldValue('aadhaarBack', e.currentTarget.files[0])}
                                />
                                <Button
                                    colorScheme={'red'}
                                    size={'xs'}
                                    onClick={(e) => Formik.setFieldValue('aadhaarBack', null)}
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
                                    backgroundImage={
                                        Formik.values.pan ?
                                            URL.createObjectURL(Formik.values.pan) :
                                            "#FFFFFFFF"
                                    }
                                    backgroundSize={'contain'}
                                    backgroundRepeat={'no-repeat'}
                                    backgroundPosition={'center'}
                                >
                                    <Text
                                        fontSize={'xs'}
                                        fontWeight={'semibold'}
                                        color={'teal.400'}
                                    >Upload PAN Card</Text>
                                </FormLabel>
                                <Input
                                    type={'file'}
                                    accept='.jpg, .jpeg, .png, .pdf'
                                    name={'pan'}
                                    id={'pan'}
                                    display={'none'}
                                    onChange={(e) => Formik.setFieldValue('pan', e.currentTarget.files[0])}
                                />
                                <Button
                                    colorScheme={'red'}
                                    size={'xs'}
                                    onClick={(e) => Formik.setFieldValue('pan', null)}
                                >Delete</Button>
                            </FormControl>
                        </Stack>
                    </Box>

                    <HStack
                        spacing={4}
                        p={4} bg={'aqua'}
                        justifyContent={'flex-end'}
                    >
                        <Button type={'reset'} onClick={Formik.handleReset}>Clear Form</Button>
                        <Button type={'submit'} colorScheme={'orange'} isLoading={isLoading}>Submit</Button>
                    </HStack>
                </DashboardWrapper>
            </form>
        </>
    )
}

export default Index