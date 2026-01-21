/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 12 },
  header: { marginBottom: 20, borderBottom: 1, paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2563eb' },
  subtitle: { fontSize: 10, color: '#64748b', marginTop: 4 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, backgroundColor: '#f1f5f9', padding: 5 },
  summary: { fontSize: 12, lineHeight: 1.5, marginBottom: 15 },
  table: { display: 'flex', width: 'auto', marginTop: 10 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderColor: '#e2e8f0', padding: 5 },
  tableCellLabel: { width: '40%', fontWeight: 'bold' },
  tableCellValue: { width: '20%' },
  tableCellStatus: { width: '40%', fontSize: 10, fontStyle: 'italic' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 8, textAlign: 'center', color: '#94a3b8' }
});

export const ReportPDF = ({ data, date }: { data: any, date: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>MediSync Izveštaj</Text>
        <Text style={styles.subtitle}>Datum analize: {date}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rezime zdravstvenog stanja</Text>
        <Text style={styles.summary}>{data.summary}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detaljni parametri</Text>
        <View style={styles.table}>
          {data.fullAnalysis.map((res: any, idx: number) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>{res.parameter} ({res.abbreviation})</Text>
              <Text style={styles.tableCellValue}>{res.value} {res.unit}</Text>
              <Text style={styles.tableCellStatus}>Status: {res.status}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.footer}>
        Ovaj izveštaj je generisan pomoću MediSync AI asisenta. 
        Nije zamena za lekarsku dijagnozu. Molimo konsultujte se sa lekarom.
      </Text>
    </Page>
  </Document>
);