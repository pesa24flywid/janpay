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
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import BackendAxios, { FormAxios } from '../../../../lib/axios'

const Index = () => {
    const [availablePlans, setAvailablePlans] = useState([])
    const [availableParents, setAvailableParents] = useState([])
    const [isParentInputDisabled, setIsParentInputDisabled] = useState(true)
    const [isPlanInputDisabled, setIsPlanInputDisabled] = useState(true)
    const Toast = useToast({
        position: 'top-right'
    })
    const Formik = useFormik({
        initialValues: {
            userType: "",
            userPlan: "",
            hasParent: "0",
            parent: "",
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
            let userForm = document.getElementById('createUserForm')
            FormAxios.postForm('/api/admin/create/user', userForm).then((res) => {
                Toast({
                    status: 'success',
                    title: 'User Created',
                })
                console.log(res.data)
            }).catch((err) => {
                Toast({
                    status: 'error',
                    title: err.message,
                })
                console.log(err)
            })
        }
    })

    useEffect(() => {
        let userToFetch
        setAvailableParents([])
        setAvailablePlans([])
        setIsParentInputDisabled(true)
        setIsPlanInputDisabled(true)
        if (Formik.values.userType) {
            BackendAxios.get(`/api/admin/packages/${Formik.values.userType}`).then((res) => {
                setAvailablePlans(res.data[0].roles.map((plan) => {
                    return {
                        planName: plan.pivot.name,
                        planId: plan.pivot.id,
                    }
                }))
                setIsPlanInputDisabled(false)
            })

            if (Formik.values.userType != "1") {
                if (Formik.values.userType == "3") userToFetch = "distributor"
                if (Formik.values.userType == "2") userToFetch = "super_distributor"
                if (Formik.values.userType == "4") userToFetch = "admin"
                BackendAxios.get(
                    `/api/admin/get-users/${userToFetch}`).then((res) => {
                        setAvailableParents(
                            res.data.map((child) => {
                                return {
                                    name: child.name,
                                    user_id: child.id
                                }
                            })
                        )
                        setIsParentInputDisabled(false)
                    }).catch((err) => {
                        console.log(err)
                        Toast({
                            status: 'error',
                            description: err.message
                        })
                    })
            }

        }
        if (!Formik.values.userType) {
            setAvailablePlans([])
            setIsPlanInputDisabled(false)
        }
    }, [Formik.values.userType])

    return (
        <>
            <form onSubmit={Formik.handleSubmit} id={'createUserForm'}>
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
                                        <option value="3">Retailer</option>
                                        <option value="2">Distributor</option>
                                        <option value="4">Super Distributor</option>
                                        <option value="1">Admin (Whitelabel)</option>
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
                                        isDisabled={isPlanInputDisabled}
                                    >
                                        {
                                            availablePlans.map((plan, key) => {
                                                return <option value={plan.planId} key={key}>{plan.planName}</option>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                                <input type={'hidden'} name={'hasParent'} value={Formik.values.userType == "1" ? "0" : "1"} />
                                {
                                    // Ask parent distributor if user type is retailer
                                    Formik.values.userType == "3" &&
                                    <FormControl w={['full', 'xs']}>
                                        <FormLabel>Parent Distributor</FormLabel>
                                        <Select
                                            name='parent'
                                            bg={'white'}
                                            value={Formik.values.parent}
                                            onChange={Formik.handleChange}
                                            isDisabled={isParentInputDisabled}
                                        >
                                            {
                                                availableParents.map((parent, key) => {
                                                    return <option value={parent.user_id} key={key}>{parent.name}</option>
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                }
                                {
                                    // Ask parent super distributor if user type is distributor
                                    Formik.values.userType == "2" &&
                                    <FormControl w={['full', 'xs']}>
                                        <FormLabel>Parent Super Distributor</FormLabel>
                                        <Select
                                            name='parent'
                                            bg={'white'}
                                            value={Formik.values.parent}
                                            onChange={Formik.handleChange}
                                            isDisabled={isParentInputDisabled}
                                        >
                                            {
                                                availableParents.map((parent, key) => {
                                                    return <option value={parent.user_id} key={key}>{parent.name}</option>
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                }
                                {
                                    // Ask parent admin if user type is super distributor
                                    Formik.values.userType == "4" &&
                                    <FormControl w={['full', 'xs']}>
                                        <FormLabel>Parent Admin (Whitelabel)</FormLabel>
                                        <Select
                                            name='parent'
                                            bg={'white'}
                                            value={Formik.values.parent}
                                            onChange={Formik.handleChange}
                                            isDisabled={isParentInputDisabled}
                                        >
                                            {
                                                availableParents.map((parent, key) => {
                                                    return <option value={parent.user_id} key={key}>{parent.name}</option>
                                                })
                                            }
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
                                        <input type="hidden" name='isActive' value={Formik.values.isActive} />
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
                                                bg={'white'}
                                                name={'line'} placeholder={'Enter here'}
                                                onChange={Formik.handleChange}
                                            />
                                        </FormControl>
                                        <FormControl w={['full']}>
                                            <FormLabel>City</FormLabel>
                                            <Input
                                                bg={'white'}
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
                                                <option value="Jammu Kashmir">Jammu Kashmir</option>
                                                <option value="Delhi">Delhi</option>
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
                                    onChange={(e) => Formik.setFieldValue('profilePic', e.currentTarget.files[0])}
                                />
                                <Button
                                    colorScheme={'red'}
                                    size={'xs'}
                                    onClick={(e) => Formik.setFieldValue('profilePic', null)}
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
                        <Button type={'submit'} colorScheme={'twitter'}>Submit</Button>
                    </HStack>
                </DashboardWrapper>
            </form>
        </>
    )
}

export default Index