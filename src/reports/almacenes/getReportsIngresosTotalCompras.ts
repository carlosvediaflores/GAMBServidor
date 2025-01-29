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
export const getReportsIngresosTotalCompras = (options: any): TDocumentDefinitions => {
  const values = options;
// console.log(values);

  // const totalCantidad = values.reduce(
  //   (acc: any, detail: { cantidadFactura: any }) =>
  //     acc + detail.cantidadFactura,
  //   0
  // );
  // const totalMonto = values.reduce(
  //   (acc: any, detail: { montoFactura: any }) => acc + detail.montoFactura,
  //   0
  // );
  // const totalCantidadVale = values.reduce(
  //   (sum: any, factura: { idVale: { cantidad: any } }) =>
  //     sum + factura.idVale.cantidad,
  //   0
  // );
  // const totalMontoEntregado = values.reduce(
  //   (sum: any, factura: { idVale: { precio: any } }) =>
  //     sum + factura.idVale.precio,
  //   0
  // );
  // const totalMontoPagado = values.reduce(
  //   (sum: any, factura: { idVale: { cantidadAdquirida: any } }) =>
  //     sum + factura.idVale.cantidadAdquirida,
  //   0
  // );
  // const totalSaldo = values.reduce(
  //   (sum: any, factura: { idVale: { saldoDevolucion: any } }) =>
  //     sum + factura.idVale.saldoDevolucion,
  //   0
  // );
  // const totalSaldoDev = values.reduce(
  //   (sum: any, factura: { idVale: { saldoDevuelto: any } }) =>
  //     sum + factura.idVale.saldoDevuelto,
  //   0
  // );
  // const totalSaldoTotal = totalSaldo - totalSaldoDev;
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
      title: `LISTA DE INGRESOS MAS SU MONTO TOTAL \n  Expresado en Bolivianos`,
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
          widths: [18, 35, 80, 330, 50],

          body: [
            [
              { text: "Nº", style: "tableHeader" },
              { text: "Nº de Ingreso", style: "tableHeader" },
              { text: "Fecha", style: "tableHeader" },
              { text: "Glosa", style: "tableHeader" },
              { text: "Monto", style: "tableHeader" },
            ],
            ...values.map((ingreso: { productos: any[]; numeroEntrada: string; fecha: Date; concepto: string; }, indice: number) => {
              const productos = ingreso.productos || [];
              const numeroEntrada = ingreso.numeroEntrada || 'N/A';
              const fecha = ingreso.fecha || new Date();
              const concepto = ingreso.concepto || 'Sin Concepto';
          
              const totalPrecio = productos.reduce((acc, producto) => acc + (producto.cantidadCompra * producto.precio), 0);
          
              return [
                { text: indice + 1, style: "tableBody" },
                { text: numeroEntrada, style: "tableBody", alignment: "center" },
                { text: DateFormatterSimple.getDDMMYYYY(fecha), style: "tableBody", alignment: "center", },
                { text: concepto, style: "tableBody",alignment: "justify", },
                { text: CurrencyFormatter.formatCurrency(totalPrecio), style: "tableBody",alignment: "right", },
              ];
            }),
          
            [
              {
                text: `Monto Total`,
                colSpan: 3,
              },
              "",
              "",
              {
                text: `${CurrencyFormatter.formatCurrency(values.reduce((acc: any, ingreso: { productos: any[]; }) => acc + ingreso.productos.reduce((acc, producto) => acc + (producto.cantidadCompra * producto.precio), 0), 0))}`,
                style: "tableBody",
                alignment: "right",
                colSpan: 2,
                bold: true,
              },
              {
           
              },
            ],
          ],
        },
      },
    ],
  };

  return docDefinition;
};
