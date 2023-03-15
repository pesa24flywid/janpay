import React, { useState, useEffect } from 'react'
import Layout from '../../layout'
import {
    Box,
    HStack,
    VStack,
    Stack,
    FormControl,
    Input,
    Select,
    Switch,
    Image,
    Text,
    Button,
    useToast,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    CheckboxGroup,
    Checkbox,
    FormLabel
} from '@chakra-ui/react'
import { Formik, useFormik } from 'formik'
import { useRef } from 'react'
import axios from '@/lib/utils/axios'

const ManageUser = () => {
    const initialFocusRef = useRef()
    const Toast = useToast({
        position: 'top-right'
    })
    const [searchingFor, setSearchingFor] = useState("")
    const [availableUsers, setAvailableUsers] = useState([
        { id: 55, name: "Sangam Kumar" },
        { id: 55, name: "Rishi Kumar" }
    ])
    const SearchFormik = useFormik({
        initialValues: {
            selectedOrganisation: process.env.NEXT_PUBLIC_ORGANISATION,
            selectedRole: "retailer",
            selectedUser: "",
        }
    })

    function fetchUsersList() {
        setAvailableUsers([])
        axios.get(`/api/admin/users-list/${SearchFormik.values.selectedRole}`).then((res) => {
            console.log(res.data)
            setAvailableUsers(res.data)
        }).catch((err) => {
            console.log(err)
            Toast({
                status: 'error',
                description: err.message
            })
        })
    }


    useEffect(() => {
        if (availableUsers && searchingFor) {
            setAvailableUsers(availableUsers.filter((user) => {
                return user.name.includes(searchingFor)
            }))
        }
        else {
            fetchUsersList()
        }
    }, [searchingFor, SearchFormik.values.selectedRole])


    const Formik = useFormik({
        initialValues: {
            userId: "",
            firstName: "",
            lastName: "",
            phone: "",
            currentRole: "",
            currentPlan: "",
            availableServices: "",
            firmName: "",
            firmType: "",
        }
    })

    return (
        <>
            <Layout pageTitle={'Manage User'}>
                <Stack
                    direction={['column', 'row']}
                >
                    <FormControl w={['full', 'xs']}>
                        <Input
                            name={'selectedOrganisation'}
                            value={`Your Organisation ${process.env.NEXT_PUBLIC_ORGANISATION}`}
                            bg={'white'} isDisabled={true}
                        />
                    </FormControl>
                    <FormControl w={['full', 'xs']}>
                        <Select
                            placeholder='Select Role'
                            name='selectedRole'
                            onChange={SearchFormik.handleChange}
                        >

                            <option value="retailer">Retailer</option>
                            <option value="distributor">Distributor</option>
                            <option value="super_distributor">Super Distributor</option>
                            {/* <option value="1">Admin (Whitelabel)</option> */}
                        </Select>
                    </FormControl>
                    <FormControl w={['full', 'xs']}>
                        <Popover initialFocusRef={initialFocusRef}>
                            <PopoverTrigger>
                                <Input
                                    name={'selectedUser'} onChange={(e) => setSearchingFor(e.target.value)}
                                    bg={'white'} value={searchingFor}
                                    placeholder={'Search User'} ref={initialFocusRef}
                                />
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverArrow />
                                <PopoverHeader>Available Users</PopoverHeader>
                                <PopoverBody>
                                    <VStack>
                                        {
                                            availableUsers.map((user, key) => {
                                                return (
                                                    <Text
                                                        w={'full'} p={2} _hover={{ bg: 'aqua' }} key={key}
                                                        onClick={() => {
                                                            SearchFormik.setFieldValue("selectedUser", user.id)
                                                            setSearchingFor(user.name)
                                                        }}
                                                        cursor={'pointer'} textTransform={'capitalize'}
                                                    >{user.name} - {user.id}</Text>
                                                )
                                            })
                                        }
                                    </VStack>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                    </FormControl>
                </Stack>

                <Text pt={28} pb={4} fontSize={'xl'} color={'#444'} fontWeight={'semibold'}>Edit Details</Text>
                <Stack
                    direction={['column', 'row']}
                    spacing={4} py={4}
                >
                    <FormControl w={['full', 'xs']}>
                        <FormLabel>First Name</FormLabel>
                        <Input
                            name={'firstName'}
                            value={Formik.values.firstName}
                            onChange={Formik.handleChange}
                            bg={'white'}
                        />
                    </FormControl>
                    <FormControl w={['full', 'xs']}>
                        <FormLabel>Last Name</FormLabel>
                        <Input
                            name={'LastName'}
                            value={Formik.values.lastName}
                            onChange={Formik.handleChange}
                            bg={'white'}
                        />
                    </FormControl>
                    <FormControl w={['full', 'xs']}>
                        <FormLabel>Role</FormLabel>
                        <Select
                            name={'LastName'}
                            value={Formik.values.lastName}
                            onChange={Formik.handleChange}
                            bg={'white'}
                        >
                            <option value="3">Retailer</option>
                            <option value="2">Distributor</option>
                            <option value="4">Super Distributor</option>
                            {/* <option value="1">Admin (Whitelabel)</option> */}
                        </Select>
                    </FormControl>
                </Stack>
            </Layout>
        </>
    )
}

export default ManageUser