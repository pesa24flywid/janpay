import React, { useState, useEffect } from 'react'
import {
    Box,
    Text,
    Button,
    InputGroup,
    InputRightAddon,
    Input,
    FormControl,
    FormLabel,
    useToast,
    VisuallyHidden,
    HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    VStack,
    Image
} from '@chakra-ui/react'
import jsPDF from 'jspdf';
import 'jspdf-autotable'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { BsCheck2Circle, BsChevronDoubleLeft, BsChevronDoubleRight, BsChevronLeft, BsChevronRight, BsDownload, BsEye, BsXCircle } from 'react-icons/bs';
import { useRouter } from 'next/router';
import BackendAxios from '../../../../lib/axios';
import DashboardWrapper from '../../../../hocs/DashboardLayout';
import Pdf from 'react-to-pdf'

const ExportPDF = () => {
    const doc = new jsPDF('landscape')

    doc.autoTable({ html: '#printable-table' })
    doc.output('dataurlnewwindow');
}



const UserLedger = () => {
    const Toast = useToast({ position: 'top-right' })
    const [userId, setUserId] = useState("")
    const [rowData, setRowData] = useState([])
    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: "Transaction ID",
            field: "transaction_id"
        },
        {
            headerName: "Done By",
            field: 'trigered_by',
            cellRenderer: 'merchantCellRenderer'
        },
        {
            headerName: "Description",
            field: "transaction_for"
        },
        {
            headerName: "Type",
            field: "service_type"
        },
        {
            headerName: "Credit",
            field: "credit_amount"
        },
        {
            headerName: "Debit",
            field: "debit_amount"
        },
        {
            headerName: "Opening Balance",
            field: "opening_balance"
        },
        {
            headerName: "Closing Balance",
            field: "closing_balance"
        },
        {
            headerName: "Timestamp",
            field: "created_at"
        },
        {
            headerName: "Additional Info",
            field: "metadata"
        },
        {
            headerName: "Receipt",
            field: "receipt",
            pinned: 'right',
            cellRenderer: 'receiptCellRenderer'
        }
    ])
    const [printableRow, setPrintableRow] = useState(rowData)
    const [pagination, setPagination] = useState({
        current_page: "1",
        total_pages: "1",
        first_page_url: "",
        last_page_url: "",
        next_page_url: "",
        prev_page_url: "",
    })
    const Router = useRouter()
    const { user_id } = Router.query

    const handleShare = async () => {
        const myFile = await toBlob(pdfRef.current, { quality: 0.95 })
        const data = {
            files: [
                new File([myFile], 'receipt.jpeg', {
                    type: myFile.type
                })
            ],
            title: 'Receipt',
            text: 'Receipt'
        }
        try {
            await navigator.share(data)
        } catch (error) {
            console.error('Error sharing:', error?.toString());
            Toast({
                status: 'warning',
                description: error?.toString()
            })
        }
    };

    function fetchLedger(pageLink) {
        BackendAxios.get(pageLink || `/api/parent/users-transactions?page=1`).then((res) => {
            setPagination({
                current_page: res.data.current_page,
                total_pages: parseInt(res.data.last_page),
                first_page_url: res.data.first_page_url,
                last_page_url: res.data.last_page_url,
                next_page_url: res.data.next_page_url,
                prev_page_url: res.data.prev_page_url,
            })
            setRowData(res.data.data)
            setPrintableRow(res.data.data)
        }).catch(err => {
            console.log(err)
            Toast({
                status: 'error',
                title: 'Error while fetching user transactions',
                description: err.response.data.message || err.response.data || err.message
            })
        })
    }

    const merchantCellRenderer = (params) => {
        return (
            <Text>({params.data.trigered_by}) {params.data.name}</Text>
        )
    }
    const pdfRef = React.createRef()
    const [receipt, setReceipt] = useState({
        show: false,
        status: "success",
        data: {}
    })
    const receiptCellRenderer = (params) => {
        function showReceipt() {
            if (!params.data.metadata) {
                Toast({
                    description: 'No Receipt Available'
                })
                return
            }
            setReceipt({
                status: JSON.parse(params.data.metadata).status,
                show: true,
                data: JSON.parse(params.data.metadata)
            })
        }
        return (
            <HStack height={'full'} w={'full'} gap={4}>
                <Button rounded={'full'} colorScheme='twitter' size={'xs'} onClick={() => showReceipt()}><BsEye /></Button>
            </HStack>
        )
    }


    useEffect(() => {
        if (Router.isReady && user_id) {
            BackendAxios.get(`/api/parent/users-transactions/${user_id}?page=1`).then((res) => {
                setPagination({
                    current_page: res.data.current_page,
                    total_pages: parseInt(res.data.last_page),
                    first_page_url: res.data.first_page_url,
                    last_page_url: res.data.last_page_url,
                    next_page_url: res.data.next_page_url,
                    prev_page_url: res.data.prev_page_url,
                })
                setRowData(res.data.data)
                setPrintableRow(res.data.data)
                setUserId(user_id)
            }).catch(err => {
                console.log(err)
                Toast({
                    status: 'error',
                    title: 'Error while fetching user transactions',
                    description: err.response.data.message || err.response.data || err.message
                })
            })
        }
        else {
            fetchLedger()
        }
    }, [Router.isReady])

    return (
        <>
            <DashboardWrapper pageTitle={'User Ledger'}>
                <Box p={4}>
                    <FormControl w={['full', 'xs']}>
                        <FormLabel py={2}>Type User ID To Get His Ledger</FormLabel>
                        <InputGroup>
                            <Input
                                name={'userId'} value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder={'Enter User ID'}
                                bg={'white'}
                            />
                            <InputRightAddon
                                children={'Fetch'}
                                cursor={'pointer'}
                                onClick={() => fetchLedger(`/api/parent/users-transactions/${userId}?page=1`)}
                            />
                        </InputGroup>
                    </FormControl>

                    <HStack mt={12} pb={4} justifyContent={'flex-end'}>
                        <Button colorScheme={'red'} onClick={ExportPDF} size={'sm'}>Export PDF</Button>
                    </HStack>
                    <HStack spacing={2} py={4} bg={'white'} justifyContent={'center'}>
                        <Button
                            colorScheme={'twitter'}
                            fontSize={12} size={'xs'}
                            variant={'outline'}
                            onClick={() => fetchLedger(pagination.first_page_url)}
                        ><BsChevronDoubleLeft />
                        </Button>
                        <Button
                            colorScheme={'twitter'}
                            fontSize={12} size={'xs'}
                            variant={'outline'}
                            onClick={() => fetchLedger(pagination.prev_page_url)}
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
                            onClick={() => fetchLedger(pagination.next_page_url)}
                        ><BsChevronRight />
                        </Button>
                        <Button
                            colorScheme={'twitter'}
                            fontSize={12} size={'xs'}
                            variant={'outline'}
                            onClick={() => fetchLedger(pagination.last_page_url)}
                        ><BsChevronDoubleRight />
                        </Button>
                    </HStack>
                    <Box className={'ag-theme-alpine'} h={'sm'}>
                        <AgGridReact
                            columnDefs={columnDefs}
                            rowData={rowData}
                            defaultColDef={{
                                filter: true,
                                floatingFilter: true,
                                resizable: true,
                            }}
                            components={{
                                'merchantCellRenderer': merchantCellRenderer,
                                'receiptCellRenderer': receiptCellRenderer
                            }}
                            onFilterChanged={
                                (params) => {
                                    setPrintableRow(params.api.getRenderedNodes().map((item) => {
                                        return (
                                            item.data
                                        )
                                    }))
                                }
                            }
                        >

                        </AgGridReact>
                    </Box>
                    <HStack spacing={2} py={4} bg={'white'} justifyContent={'center'}>
                        <Button
                            colorScheme={'twitter'}
                            fontSize={12} size={'xs'}
                            variant={'outline'}
                            onClick={() => fetchLedger(pagination.first_page_url)}
                        ><BsChevronDoubleLeft />
                        </Button>
                        <Button
                            colorScheme={'twitter'}
                            fontSize={12} size={'xs'}
                            variant={'outline'}
                            onClick={() => fetchLedger(pagination.prev_page_url)}
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
                            onClick={() => fetchLedger(pagination.next_page_url)}
                        ><BsChevronRight />
                        </Button>
                        <Button
                            colorScheme={'twitter'}
                            fontSize={12} size={'xs'}
                            variant={'outline'}
                            onClick={() => fetchLedger(pagination.last_page_url)}
                        ><BsChevronDoubleRight />
                        </Button>
                    </HStack>

                    <VisuallyHidden>
                        <table id='printable-table'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    {
                                        columnDefs.filter((column) => {
                                            if (
                                                column.field != "transaction_for" &&
                                                column.field != "name" &&
                                                column.field != "receipt" &&
                                                column.field != "metadata"
                                            ) {
                                                return (
                                                    column
                                                )
                                            }
                                        }).map((column, key) => {
                                            return (
                                                <th key={key}>{column.headerName}</th>
                                            )
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    printableRow.map((data, key) => {
                                        return (
                                            <tr key={key}>
                                                <td>{key + 1}</td>
                                                <td>{data.transaction_id}</td>
                                                <td>({data.trigered_by}) {data.name}</td>
                                                <td>{data.service_type}</td>
                                                <td>{data.credit_amount}</td>
                                                <td>{data.debit_amount}</td>
                                                <td>{data.opening_balance}</td>
                                                <td>{data.closing_balance}</td>
                                                <td>{data.created_at}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </VisuallyHidden>

                </Box>

            </DashboardWrapper>


            {/* Receipt */}
            <Modal
                isOpen={receipt.show}
                onClose={() => setReceipt({ ...receipt, show: false })}
            >
                <ModalOverlay />
                <ModalContent width={'xs'}>
                    <Box ref={pdfRef} style={{ border: '1px solid #999' }}>
                        <ModalHeader p={0}>
                            <VStack w={'full'} p={8} bg={receipt.status ? "green.500" : "red.500"}>
                                {
                                    receipt.status ?
                                        <BsCheck2Circle color='#FFF' fontSize={72} /> :
                                        <BsXCircle color='#FFF' fontSize={72} />
                                }
                                <Text color={'#FFF'} textTransform={'capitalize'}>₹ {receipt.data.amount || 0}</Text>
                                <Text color={'#FFF'} fontSize={'sm'} textTransform={'uppercase'}>TRANSACTION {receipt.status ? "success" : "failed"}</Text>
                            </VStack>
                        </ModalHeader>
                        <ModalBody p={0} bg={'azure'}>
                            <VStack w={'full'} spacing={0} p={4} bg={'#FFF'}>
                                {
                                    receipt.data ?
                                        Object.entries(receipt.data).map((item, key) => {

                                            if (
                                                item[0].toLowerCase() != "status" &&
                                                item[0].toLowerCase() != "user" &&
                                                item[0].toLowerCase() != "user_id" &&
                                                item[0].toLowerCase() != "user_phone" &&
                                                item[0].toLowerCase() != "amount"
                                            )
                                                return (
                                                    <HStack
                                                        justifyContent={'space-between'}
                                                        gap={8} pb={1} w={'full'} key={key}
                                                        borderWidth={'0.75px'} p={2}
                                                    >
                                                        <Text
                                                            fontSize={'xs'}
                                                            fontWeight={'medium'}
                                                            textTransform={'capitalize'}
                                                        >{item[0].replace(/_/g, " ")}</Text>
                                                        <Text fontSize={'xs'} maxW={'full'} >{`${item[1]}`}</Text>
                                                    </HStack>
                                                )

                                        }
                                        ) : null
                                }
                                <VStack pt={8} spacing={0} w={'full'}>
                                    <HStack borderWidth={'0.75px'} p={2} pb={1} justifyContent={'space-between'} w={'full'}>
                                        <Text fontSize={'xs'} fontWeight={'semibold'}>Merchant:</Text>
                                        <Text fontSize={'xs'}>{receipt.data.user}</Text>
                                    </HStack>
                                    <HStack borderWidth={'0.75px'} p={2} pb={1} justifyContent={'space-between'} w={'full'}>
                                        <Text fontSize={'xs'} fontWeight={'semibold'}>Merchant ID:</Text>
                                        <Text fontSize={'xs'}>{receipt.data.user_id}</Text>
                                    </HStack>
                                    <HStack borderWidth={'1px'} p={2} pb={1} justifyContent={'space-between'} w={'full'}>
                                        <Text fontSize={'xs'} fontWeight={'semibold'}>Merchant Mobile:</Text>
                                        <Text fontSize={'xs'}>{receipt.data.user_phone}</Text>
                                    </HStack>
                                    <Image src='/logo_long.jpeg' w={'20'} pt={4} />
                                    <Text fontSize={'xs'}>{process.env.NEXT_PUBLIC_ORGANISATION_NAME}</Text>
                                </VStack>
                            </VStack>
                        </ModalBody>
                    </Box>
                    <ModalFooter>
                        <HStack justifyContent={'center'} gap={4}>
                            <Button
                                colorScheme='yellow'
                                size={'sm'} rounded={'full'}
                                onClick={handleShare}
                            >Share</Button>
                            <Pdf targetRef={pdfRef} filename="Receipt.pdf">
                                {
                                    ({ toPdf }) => <Button
                                        rounded={'full'}
                                        size={'sm'}
                                        colorScheme={'twitter'}
                                        leftIcon={<BsDownload />}
                                        onClick={toPdf}
                                    >Download
                                    </Button>
                                }
                            </Pdf>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UserLedger