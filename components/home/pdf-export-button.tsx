import React, { useCallback } from "react";
import {
  Document,
  StyleSheet,
  Page,
  Text,
  PDFDownloadLink,
  Note,
} from "@react-pdf/renderer";
import { JSONContent } from "@tiptap/react";
import { uuid } from "utils";

interface ExportPdfButtonProps {
  json: JSONContent;
  name: string;
}

const PDFExportButton = ({ json, name }: ExportPdfButtonProps) => {
  const Doc = useCallback(
    () => (
      <Document>
        <Page wrap={true} size="A4" style={styles.body}>
          {json.content &&
            json.content.map((node) => {
              if (node.type === "heading" && node.attrs?.level === 1) {
                return (
                  <Text key={uuid()} style={styles.title}>
                    {node.content &&
                      node.content.map((child) => {
                        if (child.type === "text") {
                          return child.text;
                        }
                      })}
                  </Text>
                );
              }
              if (node.type === "heading" && node.attrs?.level === 2) {
                return (
                  <Text key={uuid()} style={styles.subtitle}>
                    {node.content &&
                      node.content.map((child) => {
                        if (child.type === "text") {
                          return child.text;
                        }
                      })}
                  </Text>
                );
              }
              if (node.type === "paragraph") {
                return (
                  <Text key={uuid()} style={styles.text}>
                    {node.content &&
                      node.content.map((child) => {
                        if (child.type === "text") {
                          return child.text;
                        }
                      })}
                  </Text>
                );
              }
              if (node.type === "blockquote") {
                const text = node.content?.[0].content?.[0].text;
                return (
                  <Text key={uuid()} style={styles.quote}>
                    {text}
                  </Text>
                );
              }
            })}
          <Text></Text>
        </Page>
      </Document>
    ),
    [json],
  );

  return (
    <PDFDownloadLink
      className="px-2"
      document={<Doc />}
      fileName={`${name}.pdf`}
    >
      {({ blob, url, loading, error }) => "PDF"}
    </PDFDownloadLink>
  );
};

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
    lineHeight: 1.5,
    fontWeight: 800,
    textAlign: "center",
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 12,
    lineHeight: 1.2,
    fontWeight: 600,
  },
  text: {
    marginVertical: 6,
    fontSize: 14,
    lineHeight: 1.5,
    textAlign: "justify",
  },
  quote: {
    margin: 6,
    fontSize: 12,
    lineHeight: 1.3,
    fontStyle: "italic",
    textAlign: "justify",
    fontFamily: "Times-Italic",
    paddingLeft: 20,
    borderLeft: "1px solid #000",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

export default PDFExportButton;
