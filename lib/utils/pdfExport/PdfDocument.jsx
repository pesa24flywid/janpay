import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  container: {
    flexDirection: "row",
    padding: 5
  },
  column: {
    flexDirection: "row",
    backgroundColor: "#525FE1",
    color: "#FFF",
    padding: 5,
  },
  cell: {
    padding: 5,
    width: 200,
  },
  font: {
    fontSize: "8px",
  },
});

const PdfDocument = ({ rowData, columnDefs }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.column}>
        <View style={{width: 20}}>
          <Text style={styles.font}>#</Text>
        </View>
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
            return (
              <View style={styles.cell} key={key}>
                <Text style={styles.font}>{column?.headerName}</Text>
              </View>
            );
          })}
      </View>
      {rowData.map((data, key) => (
        <View style={styles.container} key={key}>
          <View style={{ padding: 5, width: 20 }}>
            <Text style={styles.font}>{key + 1}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.font}>{data.transaction_id}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.font}>{data.debit_amount}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.font}>{data.credit_amount}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.font}>{data.opening_balance}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.font}>{data.closing_balance}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.font}>{data.transaction_for}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.font}>{data.service_type}</Text>
          </View>
          <View style={{ ...styles.cell }}>
            <Text style={styles.font}>{JSON.parse(data.metadata).status}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.font}>{data.created_at}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.font}>{data.updated_at}</Text>
          </View>
        </View>
      ))}
    </Page>
  </Document>
);

export default PdfDocument;
