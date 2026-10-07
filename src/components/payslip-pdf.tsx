'use client'

import {
  Document, Page, Text, View, StyleSheet, pdf,
} from '@react-pdf/renderer'
import { formatCurrency, formatDate, formatMonthYear } from '@/lib/utils'
import { terbilang } from '@/lib/terbilang'

interface PayslipDetailItem {
  name: string
  type: 'earning' | 'deduction'
  amount: number
}

interface PayslipData {
  employeeName: string
  position: string
  employeeType: string
  vesselName: string
  joinDate: string
  periodMonth: number
  periodYear: number
  basicSalary: number
  totalEarning: number
  totalDeduction: number
  netPay: number
  details: PayslipDetailItem[]
}

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 40,
    fontFamily: 'Helvetica',
    color: '#1e293b',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#1e40af',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  companyTagline: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
  payslipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    letterSpacing: 2,
  },
  period: {
    fontSize: 10,
    color: '#475569',
    marginTop: 4,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  infoLabel: {
    width: 100,
    color: '#64748b',
  },
  infoValue: {
    flex: 1,
    fontWeight: 'bold',
  },
  tableContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8,
  },
  tableColumn: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    fontWeight: 'bold',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    marginBottom: 4,
  },
  tableHeaderName: {
    flex: 2,
    fontSize: 9,
    color: '#475569',
  },
  tableHeaderAmount: {
    flex: 1.5,
    fontSize: 9,
    color: '#475569',
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  tableName: {
    flex: 2,
    fontSize: 9,
  },
  tableAmount: {
    flex: 1.5,
    fontSize: 9,
    textAlign: 'right',
  },
  tableTotal: {
    flexDirection: 'row',
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
    fontWeight: 'bold',
  },
  netPayBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#bae6fd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netPayLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  netPayValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  terbilang: {
    marginTop: 8,
    fontSize: 9,
    fontStyle: 'italic',
    color: '#475569',
  },
  signature: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureCol: {
    textAlign: 'center',
    width: 180,
  },
  signatureLabel: {
    fontSize: 9,
    color: '#64748b',
  },
  signatureName: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 40,
  },
})

function PayslipDocument({ data }: { data: PayslipData }) {
  const earnings = data.details.filter(d => d.type === 'earning')
  const deductions = data.details.filter(d => d.type === 'deduction')

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>PT Nusantara Maritime Charter</Text>
          <Text style={styles.companyTagline}>Navigating Your Maritime Business</Text>
          <Text style={styles.payslipTitle}>PAYSLIP</Text>
          <Text style={styles.period}>
            Periode: {formatMonthYear(data.periodMonth, data.periodYear)}
          </Text>
        </View>

        {/* Employee Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Karyawan</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nama</Text>
            <Text style={styles.infoValue}>: {data.employeeName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Posisi</Text>
            <Text style={styles.infoValue}>: {data.position}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tipe</Text>
            <Text style={styles.infoValue}>: {data.employeeType === 'crew' ? 'Crew' : 'Staff'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kapal</Text>
            <Text style={styles.infoValue}>: {data.vesselName || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Join Date</Text>
            <Text style={styles.infoValue}>: {formatDate(data.joinDate)}</Text>
          </View>
        </View>

        {/* Earnings & Deductions */}
        <View style={styles.tableContainer}>
          {/* Earnings */}
          <View style={styles.tableColumn}>
            <Text style={styles.sectionTitle}>Earnings</Text>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderName}>Komponen</Text>
              <Text style={styles.tableHeaderAmount}>Jumlah</Text>
            </View>
            {earnings.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableName}>{item.name}</Text>
                <Text style={styles.tableAmount}>{formatCurrency(item.amount)}</Text>
              </View>
            ))}
            <View style={styles.tableTotal}>
              <Text style={styles.tableName}>Total Earning</Text>
              <Text style={styles.tableAmount}>{formatCurrency(data.totalEarning)}</Text>
            </View>
          </View>

          {/* Deductions */}
          <View style={styles.tableColumn}>
            <Text style={styles.sectionTitle}>Deductions</Text>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderName}>Komponen</Text>
              <Text style={styles.tableHeaderAmount}>Jumlah</Text>
            </View>
            {deductions.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableName}>{item.name}</Text>
                <Text style={styles.tableAmount}>{formatCurrency(item.amount)}</Text>
              </View>
            ))}
            <View style={styles.tableTotal}>
              <Text style={styles.tableName}>Total Deduction</Text>
              <Text style={styles.tableAmount}>{formatCurrency(data.totalDeduction)}</Text>
            </View>
          </View>
        </View>

        {/* Net Pay */}
        <View style={styles.netPayBox}>
          <Text style={styles.netPayLabel}>NET PAY (Take Home)</Text>
          <Text style={styles.netPayValue}>{formatCurrency(data.netPay)}</Text>
        </View>

        {/* Terbilang */}
        <Text style={styles.terbilang}>
          Terbilang: {terbilang(data.netPay)}
        </Text>

        {/* Signature */}
        <View style={styles.signature}>
          <View style={styles.signatureCol}>
            <Text style={styles.signatureLabel}>Dibayarkan oleh,</Text>
            <Text style={styles.signatureName}>Finance Manager</Text>
          </View>
          <View style={styles.signatureCol}>
            <Text style={styles.signatureLabel}>Diterima oleh,</Text>
            <Text style={styles.signatureName}>{data.employeeName}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export async function generatePayslipPDF(data: PayslipData) {
  const blob = await pdf(<PayslipDocument data={data} />).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `payslip-${data.employeeName.replace(/\s/g, '-')}-${data.periodMonth}-${data.periodYear}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}

export { PayslipDocument }
