import PdfPrinter from "pdfmake";
import {
  BufferOptions,
  CustomTableLayout,
  TDocumentDefinitions,
} from "pdfmake/interfaces";
//import { TDocumentDefinitions } from 'pdfmake/interfaces';

const fonts = {
  Roboto: {
    normal: "fonts/Roboto-Regular.ttf",
    bold: "fonts/Roboto-Medium.ttf",
    italics: "fonts/Roboto-Italic.ttf",
    bolditalics: "fonts/Roboto-MediumItalic.ttf",
  },
};
const customTableLayouts: Record<string, CustomTableLayout> = {
    customLayout01: {
      hLineWidth: function (i, node) {
        if (i === 0 || i === node.table.body.length) {
          return 0;
        }
        return i === node.table.headerRows ? 2 : 1;
      },
      vLineWidth: function (i) {
        return 0;
      },
      hLineColor: function (i) {
        return i === 1 ? 'black' : '#bbbbbb';
      },
      paddingLeft: function (i) {
        return i === 0 ? 0 : 7;
      },
      paddingRight: function (i, node) {
        return i === node.table.widths.length - 1 ? 0 : 7;
      },
      fillColor: function (i, node) {
        if (i === 0) {
          return '#2c9bfa';
        }
        if (i === node.table.body.length - 1) {
          return '#acb3c1';
        }
  
        return i % 2 === 0 ? '#f3f3f3' : null;
      },
    },
    customLayout02: {
      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 2 : 1;
      },
      vLineWidth: function (i, node) {
        return (i === 0 || i === node.table.widths.length) ? 2 : 1;
      },
     /*  hLineColor: function (i) {
        return i === 1 ? 'black' : '#bbbbbb';
      },
       */
      paddingLeft: function (i) {
        return i === 0 ? 0 : 8;
      },
      paddingRight: function (i, node) {
        return i === node.table.widths.length - 1 ? 0 : 9;
      },
      fillColor: function (i, node) {
        if (i === 0) {
          return '#2c9bfa';
        }
        if (i === node.table.body.length - 1) {
          return '#acb3c1';
        }
  
        /* return i % 2 === 0 ? '#f3f3f3' : null; */
      },
    },
    customLayout04: {
      hLineWidth: function (i, node) {
        if (i === 0 || i === node.table.body.length) {
          return 0;
        }
        return i === node.table.headerRows ? 2 : 1;
      },
      vLineWidth: function (i) {
        return 0;
      },
      hLineColor: function (i) {
        return i === 1 ? 'black' : '#bbbbbb';
      },
      paddingLeft: function (i) {
        return i === 0 ? 0 : 7;
      },
      paddingRight: function (i, node) {
        return i === node.table.widths.length - 1 ? 0 : 7;
      },
      fillColor: function (i, node) {
        if (i === 0) {
          return '#5cb7f5';
        }
       /*  if (i === node.table.body.length - 1) {
          return '#99cff5';
        } */
  
         return i % 2 === 0 ? '#dbeffe' : null;
      },
    },
    customLayout03: {
      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 2 : 1;
      },
      vLineWidth: function (i, node) {
        return (i === 0 || i === node.table.widths.length) ? 2 : 1;
      },
     /*  hLineColor: function (i) {
        return i === 1 ? 'black' : '#bbbbbb';
      },
       */
      paddingLeft: function (i) {
        return i === 0 ? 0 : 8;
      },
      paddingRight: function (i, node) {
        return i === node.table.widths.length - 1 ? 0 : 9;
      },
      fillColor: function (i, node) {
        if (i === 0) {
          return '#2c9bfa';
        }
       /*  if (i === node.table.body.length - 1) {
          return '#acb3c1';
        } */
  
        /* return i % 2 === 0 ? '#f3f3f3' : null; */
      },
    },
    borderBlue: {
      hLineColor: function () {
        return '#5f96d4';
      },
      vLineColor: function () {
        return '#5f96d4';
      },
    },
  };
export default class PrinterService {
  private printer = new PdfPrinter(fonts);

  createPdf(
    docDefinition: TDocumentDefinitions,
    options: BufferOptions = { tableLayouts: customTableLayouts }
  ): PDFKit.PDFDocument {
    return this.printer.createPdfKitDocument(docDefinition, options);
  }
}
