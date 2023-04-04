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
import BackendAxios, { FormAxios } from '../../../../lib/utils/axios'
import { states } from '../../../../lib/states'
import { useRouter } from 'next/router'
import DashboardWrapper from '../../../../hocs/DashboardLayout'

const Index = () => {
    const Router = useRouter()
    const { user_id } = Router.query
    const Toast = useToast({
        position: 'top-right'
    })
    const Formik = useFormik({
        initialValues: {
            userId: "",
            firstName: "",
            lastName: "",
            userEmail: "",
            userPhone: "",
            alternativePhone: "",
            dob: null,
            gender: "",
            firmName: "",
            companyType: "",
            aadhaarNum: "",
            panNum: "",
            capAmount: "",
            phoneVerified: "0",
            emailVerified: "0",
            kycStatus: "",
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
            let userForm = document.getElementById('editUserForm')
            FormAxios.postForm('/admin-update-user', userForm).then((res) => {
                Toast({
                    status: 'success',
                    title: 'User Updated',
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

    function searchUser(queryUserId) {
        BackendAxios.post(`/api/admin/user/info/${queryUserId || Formik.values.userId}`).then((res) => {
            Formik.setFieldValue("firstName", res.data.data.first_name)
            Formik.setFieldValue("lastName", res.data.data.last_name)
            Formik.setFieldValue("userEmail", res.data.data.email)
            Formik.setFieldValue("userPhone", res.data.data.phone_number)
            Formik.setFieldValue("alternativePhone", res.data.data.alternate_number)
            Formik.setFieldValue("dob", res.data.data.dob)
            Formik.setFieldValue("gender", res.data.data.gender)
            Formik.setFieldValue("firmName", res.data.data.firm_name)
            Formik.setFieldValue("companyType", res.data.data.firm_type)
            Formik.setFieldValue("kycStatus", res.data.data.kyc)
            Formik.setFieldValue("aadhaarNum", res.data.data.aadhaar)
            Formik.setFieldValue("panNum", res.data.data.pan_number)
            Formik.setFieldValue("isActive", res.data.data.is_active)
            Formik.setFieldValue("gst", res.data.data.gst_number)
            Formik.setFieldValue("capAmount", res.data.data.minimum_balance)
            Formik.setFieldValue("line", res.data.data.line)
            Formik.setFieldValue("city", res.data.data.city)
            Formik.setFieldValue("state", res.data.data.state)
            Formik.setFieldValue("pincode", res.data.data.pincode)
        }).catch((err) => {
            Toast({
                status: 'error',
                description: "User not found!"
            })
            console.log(err)
        })
    }

    useEffect(() => {
        if (Router.isReady && user_id) {
            searchUser(user_id)
            Formik.setFieldValue("userId", user_id)
        }
    }, [Router.isReady])

    return (
        <>
            <form onSubmit={Formik.handleSubmit} id={'editUserForm'}>
                <DashboardWrapper pageTitle={'Edit User'}>
                    {/* <input type="hidden" name={'userId'} value={Formik.values.userId} /> */}
                    <FormControl>
                        <FormLabel>Enter User ID to edit details</FormLabel>
                        <HStack>
                            <Input
                                name='userId' onChange={Formik.handleChange}
                                value={Formik.values.userId} w={['full', 'xs']}
                            />
                            <Button onClick={() => searchUser(Formik.values.userId)} colorScheme={'teal'}>Search Details</Button>
                        </HStack>
                    </FormControl>

                    <Stack
                        direction={['column', 'row']}
                        spacing={4}
                    >
                        <Box pb={4} w={['full', '3xl']} flex={['unset', 7]}>

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
                                            value={Formik.values.firstName}
                                            onChange={Formik.handleChange}
                                            placeholder={'First Name'}
                                        />
                                        <Input
                                            name='lastName' bg={'white'}
                                            value={Formik.values.lastName}
                                            onChange={Formik.handleChange}
                                            placeholder={'Last Name'}
                                        />
                                    </HStack>
                                </FormControl>
                                <FormControl w={['full', 'xs']}>
                                    <FormLabel>User Email</FormLabel>
                                    <Input
                                        name='userEmail' bg={'white'}
                                        value={Formik.values.userEmail}
                                        onChange={Formik.handleChange}
                                        placeholder={'Enter User Email'}
                                    />
                                </FormControl>

                                <FormControl w={['full', 'xs']}>
                                    <FormLabel>User Phone Number</FormLabel>
                                    <Input
                                        name='userPhone' bg={'white'}
                                        value={Formik.values.userPhone}
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
                                        value={Formik.values.alternativePhone}
                                        placeholder={'Alternate Phone Number'}
                                    />
                                </FormControl>
                                <FormControl w={['full', 'xs']}>
                                    <FormLabel>User DoB</FormLabel>
                                    <Input
                                        name='dob' bg={'white'}
                                        type={'date'}
                                        onChange={Formik.handleChange}
                                        value={Formik.values.dob}
                                        placeholder={'Enter User DoB'}
                                    />
                                </FormControl>

                                <FormControl w={['full', 'xs']}>
                                    <FormLabel>Gender</FormLabel>
                                    <RadioGroup
                                        name='gender'
                                        onChange={Formik.handleChange}
                                        value={Formik.values.gender}
                                    >
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
                                        value={Formik.values.firmName}
                                        onChange={Formik.handleChange}
                                        placeholder={'Enter Firm Name'}
                                    />
                                </FormControl>
                                <FormControl w={['full', 'xs']}>
                                    <FormLabel>Company Type</FormLabel>
                                    <Select
                                        name={'companyType'}
                                        onChange={Formik.handleChange}
                                        value={Formik.values.companyType}
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
                                        value={Formik.values.kycStatus ? "verified" : "unverified"}
                                        disabled
                                    />
                                </FormControl>
                                <FormControl w={['full', 'xs']}>
                                    <FormLabel>Aadhaar Number</FormLabel>
                                    <Input
                                        name='aadhaarNum' bg={'white'}
                                        placeholder={'Enter Aadhaar Number'}
                                        maxLength={12}
                                        value={Formik.values.aadhaarNum}
                                        onChange={Formik.handleChange}
                                    />
                                </FormControl>
                                <FormControl w={['full', 'xs']}>
                                    <FormLabel>PAN Number</FormLabel>
                                    <Input
                                        name='panNum' bg={'white'}
                                        placeholder={'Enter PAN Number'}
                                        maxLength={10}
                                        value={Formik.values.panNum}
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
                                        value={Formik.values.gst}
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
                                            value={Formik.values.isActive}
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
                                                value={Formik.values.capAmount}
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
                                                value={Formik.values.line}
                                            />
                                        </FormControl>
                                        <FormControl w={['full']}>
                                            <FormLabel>City</FormLabel>
                                            <Input
                                                bg={'white'}
                                                name={'city'} placeholder={'Enter City'}
                                                onChange={Formik.handleChange}
                                                value={Formik.values.city}
                                            />
                                        </FormControl>
                                        <FormControl w={['full']}>
                                            <FormLabel>State</FormLabel>
                                            <Select name='state'
                                                placeholder='Select here'
                                                onChange={Formik.handleChange}
                                                value={Formik.values.state}
                                            >
                                                {
                                                    states.map((stateName, key) => {
                                                        return <option value={stateName} key={key}>{stateName}</option>
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                        <FormControl w={['full']}>
                                            <FormLabel>Pincode</FormLabel>
                                            <Input
                                                type={'number'} maxLength={6}
                                                placeholder={'Enter Pincode'}
                                                name={'pincode'} onChange={Formik.handleChange}
                                                value={Formik.values.pincode}
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
                                        URL.createObjectURL(Formik.values.pan):
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
                        <Button type={'submit'} colorScheme={'twitter'}>Update Details</Button>
                    </HStack>
                </DashboardWrapper>
            </form>
        </>
    )
}

export default Index