import type { Content, ContextPageSize, StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import { headerSection } from "../sections/header.section";
import {
  CurrencyFormatter,
  DateFormatter,
  DateFormatterSimple,
} from "../../helpers";

interface ReportOptions {
  values: [];
}
const styles: StyleDictionary = {
  defaultStyle: {
    fontSize: 10,
  },

  subTitle: {
    fontSize: 13,
    //bold: true,
    //alignment: 'center',
    margin: [0, 10, 0, 5],
    //color: '#6b6363'
  },
  body: {
    alignment: "justify",
    margin: [0, 5, 0, 5],
    bold: true,
    fontSize: 12,
  },
  signature: {
    fontSize: 14,
    bold: true,
  },
  data: {
    fontSize: 10,
    bold: false,
  },
  footer: {
    fontSize: 9,
    italics: true,
    margin: [30, 0, 0, 20],
  },
  tableHeader: {
    bold: true,
    alignment: "center",
    fontSize: 9,
    color: "black",
  },
  tableBody: {
    fontSize: 8,
    //color: 'black',
  },
};
export const getFacturasReport = (options: any): TDocumentDefinitions => {
  const values = options;

  const totalCantidad = values.reduce(
    (acc: any, detail: { cantidadFactura: any }) =>
      acc + detail.cantidadFactura,
    0
  );
  const totalMonto = values.reduce(
    (acc: any, detail: { montoFactura: any }) => acc + detail.montoFactura,
    0
  );
  const totalCantidadVale = values.reduce(
    (sum: any, factura: { idVale: { cantidad: any } }) =>
      sum + factura.idVale.cantidad,
    0
  );
  const totalMontoEntregado = values.reduce(
    (sum: any, factura: { idVale: { precio: any } }) =>
      sum + factura.idVale.precio,
    0
  );
  const totalMontoPagado = values.reduce(
    (sum: any, factura: { idVale: { cantidadAdquirida: any } }) =>
      sum + factura.idVale.cantidadAdquirida,
    0
  );
  const totalSaldo = values.reduce(
    (sum: any, factura: { idVale: { saldoDevolucion: any } }) =>
      sum + factura.idVale.saldoDevolucion,
    0
  );
  const totalSaldoDev = values.reduce(
    (sum: any, factura: { idVale: { saldoDevuelto: any } }) =>
      sum + factura.idVale.saldoDevuelto,
    0
  );
  const totalSaldoTotal = totalSaldo - totalSaldoDev;
  const currentDate: Content = {
    text: `Fecha: ${DateFormatter.getDDMMYYYY(new Date())}`,
    alignment: 'left',
    margin: [40, 0, 0, 0],
    //width:100,
    fontSize: 8,
  };
  const footerSectionLan = (
    currentPage: number,
    pageCount: number,
    pageSize: ContextPageSize,
  ): Content => {
    const page: Content = {
      text: `Página ${currentPage} de ${pageCount}`,
      alignment: 'right',
      fontSize: 10,
      bold: true,
      margin: [0, 0, 40, 0],
    };
    return [
      {
        //columns:[currentDate,User1, User2, page]
        columns: [currentDate, page],
      },
    ];
  };
  const docDefinition: TDocumentDefinitions = {
    styles: styles,
    pageSize: "LETTER",
    pageMargins: [25, 70, 40, 50],
    header: headerSection({
      title: `DETALLE GENERAL MOVIMIENTO EN EFECTIVO DE VALES Y FACTURAS \n  Expresado en Bolivianos`,
      subTitle: "Información del Proyecto",
      showLogo: true,
      showLogo2: true,
      //userActual: values.userActual.toUpperCase(),
    }),
    footer: footerSectionLan,

    content: [
      // Detalles del cliente

      {
        layout: "customLayout04", // 'lightHorizontalLines', // optional
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: [18, 38, 43, 37, 26, 25, 26, 35, 32, 33, 27, 26, 27],

          body: [
            [
              { text: "Nº", style: "tableHeader" },
              { text: "Nº de Factura", style: "tableHeader" },
              { text: "Fecha", style: "tableHeader" },
              { text: "Cantidad", style: "tableHeader" },
              { text: "Monto", style: "tableHeader" },
              { text: "Nº de Vale", style: "tableHeader" },
              { text: "Nº de ValeA", style: "tableHeader" },
              { text: "Cantidad Vale", style: "tableHeader" },
              { text: "Monto Entr.", style: "tableHeader" },
              { text: "Monto Pagado", style: "tableHeader" },
              { text: "Saldo", style: "tableHeader" },
              { text: "Saldo Dev.", style: "tableHeader" },
              { text: "Saldo Total", style: "tableHeader" },
            ],
            ...values.map(
              (
                factura: {
                  idVale: any;
                  numeroFactura: number;
                  fechaFactura: Date;
                  cantidadFactura: number;
                  montoFactura: number;
                },
                indice: number
              ) => [
                { text: indice + 1, style: "tableBody" },
                {
                  text: factura.numeroFactura,
                  style: "tableBody",
                  alignment: "center",
                },
                {
                  text: DateFormatterSimple.getDDMMYYYY(factura.fechaFactura),
                  style: "tableBody",
                  alignment: "center",
                },
                {
                  text: `${CurrencyFormatter.formatCurrency(
                    factura.cantidadFactura
                  )}`,
                  style: "tableBody",
                  alignment: "right",
                },
                {
                  text: CurrencyFormatter.formatCurrency(factura.montoFactura),
                  style: "tableBody",
                  alignment: "right",
                },
                {
                  text: factura.idVale.numeroVale,
                  style: "tableBody",
                  alignment: "center",
                },
                {
                  text: factura.idVale.numAntiguo,
                  style: "tableBody",
                  alignment: "center",
                },
                {
                  text: CurrencyFormatter.formatCurrency(
                    factura.idVale.cantidad
                  ),
                  style: "tableBody",
                  alignment: "center",
                },
                {
                  text: CurrencyFormatter.formatCurrency(factura.idVale.precio),
                  style: "tableBody",
                  alignment: "center",
                },
                {
                  text: CurrencyFormatter.formatCurrency(
                    factura.idVale.cantidadAdquirida
                  ),
                  style: "tableBody",
                  alignment: "center",
                },
                {
                  text: CurrencyFormatter.formatCurrency(
                    factura.idVale.saldoDevolucion
                  ),
                  style: "tableBody",
                  alignment: "center",
                },
                {
                  text: CurrencyFormatter.formatCurrency(
                    factura.idVale.saldoDevuelto
                  ),
                  style: "tableBody",
                  alignment: "center",
                },
                {
                  text: CurrencyFormatter.formatCurrency(
                    factura.idVale.saldoDevolucion -
                      factura.idVale.saldoDevuelto
                  ),
                  style: "tableBody",
                  alignment: "center",
                },
              ]
            ),
            ["", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", ""],
            [
              {
                text: `Monto Total`,
                colSpan: 9,
              },
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              {
                text: `${CurrencyFormatter.formatCurrency(totalMonto)}`,
                style: "tableBody",
                alignment: "right",
                colSpan: 4,
                bold: true,
              },
            ],
          ],
        },
      },
    ],
  };

  return docDefinition;
};
