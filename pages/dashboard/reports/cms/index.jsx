import React, { useState, useEffect } from 'react'
import DashboardWrapper from '../../../../hocs/DashboardLayout'
import {
  Box,
  Text,
  Button,
  useToast,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  VStack,
} from '@chakra-ui/react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import BackendAxios from '../../../../lib/axios';
import { BsCheck2Circle, BsDownload, BsXCircle } from 'react-icons/bs';
import Pdf from 'react-to-pdf'

const Index = () => {
  const Toast = useToast({ position: 'top-right' })
  const [colDefs, setColDefs] = useState([
    {
      field: 'id',
      hide: true,
      suppressToolPanel: true
    },
    {
      field: 'provider',
      headerName: 'Provider'
    },
    {
      field: 'transaction_id',
      headerName: 'Transaction ID'
    },
    {
      field: 'reference_id',
      headerName: 'Reference ID'
    },
    {
      field: 'created_at',
      headerName: 'Timestamp'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      cellRenderer: 'actionsCellRenderer'
    }
  ])
  const [rowData, setRowData] = useState([])


  const pdfRef = React.createRef()
  const [receipt, setReceipt] = useState({
    show: false,
    status: "success",
    data: {}
  })
  const actionsCellRenderer = (params) => {
    function checkStatus() {
      BackendAxios.post(`/api/paysprint/cms/status`, {
        referenceId: params.data.reference_id,
        provider: params.data.provider
      }).then(res => {
        setReceipt({
          show: true,
          data: res.data.data
        })
      }).catch(err => {
        Toast({
          status: 'error',
          description: err.response.data?.message || err.response.data || err.message
        })
      })
    }

    return (
      <Button
        size={'xs'} variant={'solid'}
        colorScheme='twitter'
        onClick={checkStatus}
      >Check Status</Button>
    )
  }

  useEffect(() => {
    BackendAxios.get(`/api/cms-records`).then(res => {
      setRowData(res.data)
    }).catch(err => {
      Toast({
        status: 'error',
        description: err.response.data?.message || err.response.data || err.message
      })
    })
  }, [])

  return (
    <>
      <DashboardWrapper pageTitle={'CMS Reports'}>
        <Box w={'full'} p={20}></Box>
        <Box className='ag-theme-alpine' w={'full'} h={['sm', 'md']}>
          <AgGridReact
            columnDefs={colDefs}
            rowData={rowData}
            defaultColDef={{
              filter: true,
              floatingFilter: true,
              resizable: true,
              sortable: true,
            }}
            components={{
              'actionsCellRenderer': actionsCellRenderer,
            }}
          >

          </AgGridReact>
        </Box>
      </DashboardWrapper>



      <Modal
        isOpen={receipt.show}
        onClose={() => setReceipt({ ...receipt, show: false })}
      >
        <ModalOverlay />
        <ModalContent width={'sm'}>
          <Box ref={pdfRef} style={{ border: '1px solid #999' }}>
            <ModalBody p={0} bg={'azure'}>
              <VStack w={'full'} p={4} bg={'#FFF'}>
                {
                  receipt.data ?
                    Object.entries(receipt.data).map((item, key) => (
                      <HStack
                        justifyContent={'space-between'}
                        gap={8} pb={2} w={'full'} key={key}
                      >
                        <Text fontSize={14}
                          fontWeight={'medium'}
                          textTransform={'capitalize'}
                        >{item[0]}</Text>
                        <Text fontSize={14} >{`${item[1]}`}</Text>
                      </HStack>
                    )) : null
                }
              </VStack>
            </ModalBody>
          </Box>
          <ModalFooter>
            <HStack justifyContent={'center'} gap={8}>

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

export default Index