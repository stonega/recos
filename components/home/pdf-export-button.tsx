import React from 'react';
import { Document, Page, Text, PDFDownloadLink } from '@react-pdf/renderer';

interface ExportPdfButtonProps {
  text: string;
  name:string
}

const PDFExportButton = ({ text, name }: ExportPdfButtonProps) => {
  const MyDoc = () => (
    <Document>
      <Page>
        <Text>{text}</Text>
      </Page>
    </Document>
  );

  return (
    <PDFDownloadLink document={<MyDoc />} fileName={`${name}.pdf`}>
      {({ blob, url, loading, error }) =>
        loading ? 'Loading document...' : 'Export PDF'
      }
    </PDFDownloadLink>
  );
};

export default PDFExportButton;