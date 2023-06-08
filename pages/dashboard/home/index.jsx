import React, { useState, useEffect } from 'react'
import DashboardWrapper from '../../../hocs/DashboardLayout'
import { Box, Button, HStack, Icon, Image, Stack, Text, VStack } from '@chakra-ui/react'
import { Carousel } from 'react-responsive-carousel'
import Link from 'next/link'
import { FaCar, FaFingerprint, FaMobile, FaRegMoneyBillAlt } from 'react-icons/fa'
import { BiIdCard, BiMobileAlt } from 'react-icons/bi'
import { BsArrowRight, BsHeartFill } from 'react-icons/bs'
import { IoMdFingerPrint, IoMdUmbrella } from 'react-icons/io'
import BackendAxios from '../../../lib/axios'
import Cookies from 'js-cookie'
import Marquee from 'react-fast-marquee'

const Index = () => {
    const images = [
        'https://cdn.corporatefinanceinstitute.com/assets/online-payment-companies-1024x683.jpeg',
        'https://images.gizbot.com/fit-in/img/600x338/2020/11/ds4-1605688425.jpg',
        'https://sbnri.com/blog/wp-content/uploads/2022/09/Bharat-Bill-Payment-1.jpg',
        // Add more image URLs as needed
    ];

    return (
        <>
            <DashboardWrapper pageTitle={'Home'}>
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
                            <Icon as={IoMdFingerPrint} fontSize={[28, 48]} />
                            <Box>
                                <Text fontSize={['sm']} textAlign={['center', 'left']}>AePS</Text>
                                <Text fontSize={['lg', '2xl']} fontWeight={'semibold'}>₹ 23453</Text>
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
                                <Text fontSize={['sm']} textAlign={['center', 'left']}>Recharges</Text>
                                <Text fontSize={['lg', '2xl']} fontWeight={'semibold'}>₹ 23453</Text>
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
                                <Text fontSize={['lg', '2xl']} fontWeight={'semibold'}>₹ 23453</Text>
                            </Box>
                        </Stack>
                    </HStack>


                    <Box
                        width={'100%'}
                        rounded={16}
                        boxShadow={'lg'}
                        p={4} marginTop={8}
                        bgImage={'/mobileBg.svg'}
                        bgAttachment={'fixed'}
                    >
                        <Text color={'#FFF'} mb={[8]} fontWeight={'semibold'} fontSize={'md'}>Explore Our Services</Text>

                        <HStack justifyContent={'flex-start'} gap={[4, 8]} flexWrap={'wrap'}>

                            <Box w={['27.5%', '20%']} p={4} _hover={{ bgColor: 'rgba(0,0,0,0.2)' }} rounded={'full'} transition={'all .3s ease'}>
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
                                    <Icon fontSize={[36, 24]} as={FaFingerprint} color={'#FFF'} />
                                    <Text
                                        textAlign={'center'}
                                        color={'#FFF'}
                                        fontSize={['sm', 'md']}
                                    >AePS</Text>
                                </Link>
                            </Box>

                            <Box w={['27.5%', '20%']} p={4} _hover={{ bgColor: 'rgba(0,0,0,0.2)' }} rounded={'full'} transition={'all .3s ease'}>
                                <Link
                                    href={'/dashboard/services/bbps?pageId=services'}
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
                                        fontSize={[36, 24]}
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
                                    <Icon fontSize={[36, 24]} as={FaRegMoneyBillAlt} color={'#FFF'} />
                                    <Text
                                        textAlign={'center'}
                                        color={'#FFF'}
                                        fontSize={['sm', 'md']}
                                    >DMT</Text>
                                </Link>
                            </Box>

                            <Box w={['27.5%', '20%']} p={4} _hover={{ bgColor: 'rgba(0,0,0,0.2)' }} rounded={'full'} transition={'all .3s ease'}>
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
                                    <Icon fontSize={[36, 24]} as={BiMobileAlt} color={'#FFF'} />
                                    <Text
                                        textAlign={'center'}
                                        color={'#FFF'}
                                        fontSize={['sm', 'md']}
                                    >Recharge</Text>
                                </Link>
                            </Box>

                            <Box w={['27.5%', '20%']} p={4} _hover={{ bgColor: 'rgba(0,0,0,0.2)' }} rounded={'full'} transition={'all .3s ease'}>
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
                                    <Icon fontSize={[36, 24]} as={FaCar} color={'#FFF'} />
                                    <Text
                                        textAlign={'center'}
                                        color={'#FFF'}
                                        fontSize={['sm', 'md']}
                                    >Fastag</Text>
                                </Link>
                            </Box>

                            <Box w={['27.5%', '20%']} p={4} _hover={{ bgColor: 'rgba(0,0,0,0.2)' }} rounded={'full'} transition={'all .3s ease'}>
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
                                    <Icon fontSize={[36, 24]} as={BsHeartFill} color={'#FFF'} />
                                    <Text
                                        textAlign={'center'}
                                        color={'#FFF'}
                                        fontSize={['sm', 'md']}
                                    >LIC</Text>
                                </Link>
                            </Box>

                            <Box w={['27.5%', '20%']} p={4} _hover={{ bgColor: 'rgba(0,0,0,0.2)' }} rounded={'full'} transition={'all .3s ease'}>
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
                                    <Icon fontSize={[36, 24]} as={BiIdCard} color={'#FFF'} />
                                    <Text
                                        textAlign={'center'}
                                        color={'#FFF'}
                                        fontSize={['sm', 'md']}
                                    >PAN Card</Text>
                                </Link>
                            </Box>

                            <Box w={['27.5%', '20%']} p={4} _hover={{ bgColor: 'rgba(0,0,0,0.2)' }} rounded={'full'} transition={'all .3s ease'}>
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
                            </Box>

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