import React, { useEffect, useState } from "react";
import DashboardWrapper from "../../../../hocs/DashboardLayout";
import {
  useToast,
  Box,
  Button,
  HStack,
  VisuallyHidden,
  Stack,
  FormLabel,
  FormControl,
  Input,
  Text,
} from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
  BsChevronLeft,
  BsChevronRight,
  BsEye,
} from "react-icons/bs";
import BackendAxios from "../../../../lib/axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toBlob } from "html-to-image";
import { useFormik } from "formik";
import { Select } from "@chakra-ui/react";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { SiMicrosoftexcel } from "react-icons/si";
import { FiRefreshCcw } from "react-icons/fi";

const ExportPDF = () => {
  const doc = new jsPDF("landscape");

  doc.autoTable({ html: "#printable-table" });
  doc.output("dataurlnewwindow");
};

const Index = () => {
  const Toast = useToast({
    position: "top-right",
  });
  const [loading, setLoading] = useState(false);
  const [printableRow, setPrintableRow] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: "1",
    total_pages: "1",
    first_page_url: "",
    last_page_url: "",
    next_page_url: "",
    prev_page_url: "",
  });
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Trnxn ID",
      field: "transaction_id",
    },
    {
      headerName: "Amount",
      field: "amount",
      width: 120,
    },
    {
      headerName: "Status",
      field: "status",
      width: 120,
    },
    {
      headerName: "Admin Remarks",
      field: "admin_remarks",
      defaultMinWidth: 300,
    },
    {
      headerName: "Bank",
      field: "bank_name",
      width: 160,
    },
    {
      headerName: "Trnxn Type",
      field: "transaction_type",
      width: 120,
    },
    {
      headerName: "Trnxn Date",
      field: "transaction_date",
    },
    {
      headerName: "Requested At",
      field: "created_at",
    },
    {
      headerName: "Updated At",
      field: "updated_at",
    },
    {
      headerName: "My Remarks",
      field: "remarks",
      defaultMinWidth: 300,
    },
    {
      headerName: "Receipt",
      field: "receipt",
      cellRenderer: "receiptCellRenderer",
      pinned: "right",
      width: 80,
    },
  ]);

  const handleShare = async () => {
    const myFile = await toBlob(pdfRef.current, { quality: 0.95 });
    const data = {
      files: [
        new File([myFile], "receipt.jpeg", {
          type: myFile.type,
        }),
      ],
      title: "Receipt",
      text: "Receipt",
    };
    try {
      await navigator.share(data);
    } catch (error) {
      console.error("Error sharing:", error?.toString());
      Toast({
        status: "warning",
        description: error?.toString(),
      });
    }
  };

  const Formik = useFormik({
    initialValues: {
      from: "",
      to: "",
      trnxnId: "",
      status: "all",
    },
  });

  function fetchTransactions(pageLink) {
    setLoading(true);
    BackendAxios.get(
      pageLink ||
        `/api/fund/fetch-fund?from=${
          Formik.values.from + (Formik.values.from && "T" + "00:00")
        }&to=${Formik.values.to + (Formik.values.to && "T" + "23:59")}&status=${
          Formik.values.status != "all" ? Formik.values.status : ""
        }&search=${Formik.values.trnxnId}&page=1`
    )
      .then((res) => {
        setLoading(false);
        setPagination({
          current_page: res.data.current_page,
          total_pages: parseInt(res.data.last_page),
          first_page_url: res.data.first_page_url,
          last_page_url: res.data.last_page_url,
          next_page_url: res.data.next_page_url,
          prev_page_url: res.data.prev_page_url,
        });
        setPrintableRow(res.data.data);
        setRowData(res.data.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        Toast({
          status: "error",
          description:
            err.response.data.message || err.response.data || err.message,
        });
      });
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  const receiptCellRenderer = (params) => {
    function showReceipt() {
      if (!params.data.receipt) {
        Toast({
          description: "No Receipt Available",
        });
        return;
      }
      window.open(`https://janpay.online/${params.data.receipt}`, "_blank");
    }
    return (
      <HStack height={"full"} w={"full"} gap={4}>
        <Button
          rounded={"full"}
          colorScheme="twitter"
          size={"xs"}
          onClick={() => showReceipt()}
        >
          <BsEye />
        </Button>
      </HStack>
    );
  };

  const tableRef = React.useRef(null);
  return (
    <>
      <DashboardWrapper pageTitle={"Fund Requests Reports"}>
        <HStack>
          <Button onClick={ExportPDF} colorScheme={"red"} size={"sm"}>
            Export PDF
          </Button>
          <DownloadTableExcel
            filename="FundRequests"
            sheet="sheet1"
            currentTableRef={tableRef.current}
          >
            <Button
              size={["xs", "sm"]}
              colorScheme={"whatsapp"}
              leftIcon={<SiMicrosoftexcel />}
            >
              Excel
            </Button>
          </DownloadTableExcel>
        </HStack>
        <br />
        <br />
        <Stack p={4} spacing={8} w={"full"} direction={["column", "row"]}>
          <FormControl w={["full", "xs"]}>
            <FormLabel>From Date</FormLabel>
            <Input
              name="from"
              onChange={Formik.handleChange}
              type="date"
              bg={"white"}
            />
          </FormControl>
          <FormControl w={["full", "xs"]}>
            <FormLabel>To Date</FormLabel>
            <Input
              name="to"
              onChange={Formik.handleChange}
              type="date"
              bg={"white"}
            />
          </FormControl>
          <FormControl w={["full", "xs"]}>
            <FormLabel>Transaction ID</FormLabel>
            <Input
              name="trnxnId"
              onChange={Formik.handleChange}
              bg={"white"}
              isDisabled={Formik.values.status != "all"}
            />
          </FormControl>
          <FormControl w={["full", "xs"]}>
            <FormLabel>Status</FormLabel>
            <Select bg={"#FFF"} name="status" onChange={Formik.handleChange}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </Select>
          </FormControl>
        </Stack>
        <HStack mb={4} justifyContent={"flex-end"}>
          <Button onClick={() => fetchTransactions()} colorScheme={"orange"}>
            Search
          </Button>
        </HStack>

        <HStack
          spacing={2}
          p={4}
          mt={24}
          bg={"white"}
          justifyContent={"space-between"}
        >
          <HStack spacing={2}>
            <Button
              colorScheme={"orange"}
              fontSize={12}
              size={"xs"}
              variant={"outline"}
              onClick={() => fetchTransactions(pagination.first_page_url)}
            >
              <BsChevronDoubleLeft />
            </Button>
            <Button
              colorScheme={"orange"}
              fontSize={12}
              size={"xs"}
              variant={"outline"}
              onClick={() => fetchTransactions(pagination.prev_page_url)}
            >
              <BsChevronLeft />
            </Button>
            <Button
              colorScheme={"orange"}
              fontSize={12}
              size={"xs"}
              variant={"solid"}
            >
              {pagination.current_page}
            </Button>
            <Button
              colorScheme={"orange"}
              fontSize={12}
              size={"xs"}
              variant={"outline"}
              onClick={() => fetchTransactions(pagination.next_page_url)}
            >
              <BsChevronRight />
            </Button>
            <Button
              colorScheme={"orange"}
              fontSize={12}
              size={"xs"}
              variant={"outline"}
              onClick={() => fetchTransactions(pagination.last_page_url)}
            >
              <BsChevronDoubleRight />
            </Button>
          </HStack>
          <Button
            colorScheme="blue"
            isLoading={loading}
            variant={"ghost"}
            onClick={() => fetchTransactions()}
            leftIcon={<FiRefreshCcw />}
          >
            Click To Reload Data
          </Button>
        </HStack>

        <Box py={6}>
          <Box
            className="ag-theme-alpine ag-theme-pesa24-blue"
            rounded={"12"}
            overflow={"hidden"}
            w={"full"}
            h={["2xl"]}
          >
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              defaultColDef={{
                filter: true,
                floatingFilter: true,
                resizable: true,
                sortable: true,
              }}
              onFilterChanged={(params) => {
                setPrintableRow(
                  params.api.getRenderedNodes().map((item) => {
                    return item.data;
                  })
                );
              }}
              components={{
                receiptCellRenderer: receiptCellRenderer,
              }}
            ></AgGridReact>
          </Box>
        </Box>
      </DashboardWrapper>

      <VisuallyHidden>
        <table id="printable-table" ref={tableRef}>
          <thead>
            <tr>
              <th>#</th>
              {columnDefs
                .filter((column) => {
                  if (
                    column.field != "metadata" &&
                    column.field != "name" &&
                    column.field != "receipt"
                  ) {
                    return column;
                  }
                })
                .map((column, key) => {
                  return <th key={key}>{column.headerName}</th>;
                })}
            </tr>
          </thead>
          <tbody>
            {printableRow.map((data, key) => {
              return (
                <tr key={key}>
                  <td>{key + 1}</td>
                  <td>{data.transaction_id}</td>
                  <td>{data.amount}</td>
                  <td>{data.status}</td>
                  <td>{data.admin_remarks}</td>
                  <td>{data.bank_name}</td>
                  <td>{data.transaction_type}</td>
                  <td>{data.transaction_date}</td>
                  <td>{data.created_at}</td>
                  <td>{data.updated_at}</td>
                  <td>{data.remarks}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </VisuallyHidden>
    </>
  );
};

export default Index;
