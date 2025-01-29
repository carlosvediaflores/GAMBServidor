import type { Content, ContextPageSize, StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import { headerSection } from "../sections/header.section";
import {
  CurrencyFormatter,
  DateFormatter,
  DateFormatterSimple,
} from "../../helpers";
import { log } from "console";

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
export const getReportsLubricantes = (options: any): TDocumentDefinitions => {
  const values = options;
  // log(values);
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
      title: ` LISTA DE VALES PARA LUBRICANTES \n  Expresado en Bolivianos`,
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
          widths: [18, 38, 43, 43, 70, 60, 100, 100],

          body: [
            [
              { text: "Nº", style: "tableHeader" },
              { text: "Nº de Vale", style: "tableHeader" },
              { text: "Fecha", style: "tableHeader" },
              { text: "Cantidad Productos", style: "tableHeader" },
              { text: "Motivo", style: "tableHeader" },
              { text: "Destino", style: "tableHeader" },
              { text: "Conductor", style: "tableHeader" },
              { text: "Vehículo", style: "tableHeader" },
              
            ],
            ...values.map(
              (
                vale: {
                  vehiculo: any;
                  conductor: any;
                  destino: any;
                  motivo: any;
                  productos: any;
                  numeroVale: number;
                  fecha: Date;
                  cantidadFactura: number;
                  montoFactura: number;
                },
                indice: number
              ) => [
                { text: indice + 1, style: "tableBody" },
                {
                  text: vale.numeroVale,
                  style: "tableBody",
                  alignment: "center",
                },
                {
                  text: DateFormatterSimple.getDDMMYYYY(vale.fecha),
                  style: "tableBody",
                  alignment: "center",
                },
                {
                  text: vale.productos.length,
                  style: "tableBody",
                  alignment: "right",
                },
                {
                  text: vale.motivo,
                  style: "tableBody",
                  alignment: "center",
                },
                {
                  text: vale.destino,
                  style: "tableBody",
                  alignment: "center",
                },
                {
                  text: `${vale.conductor.username} ${vale.conductor.surnames}`,
                  style: "tableBody",
                  alignment: "center",
                },
                {
                  text: `${vale.vehiculo.tipo} ${vale.vehiculo.placa}`,
                  style: "tableBody",
                  alignment: "center",
                },
               
               
              ]
            ),
            // ["", "", "", "", "", "", "", "", "", "", "", "", ""],
            // ["", "", "", "", "", "", "", "", "", "", "", "", ""],
            // [
            //   {
            //     text: `Monto Total`,
            //     colSpan: 9,
            //   },
            //   "",
            //   "",
            //   "",
            //   "",
            //   "",
            //   "",
            //   "",
            //   "",
            //   {
            //     text: `${CurrencyFormatter.formatCurrency(totalMonto)}`,
            //     style: "tableBody",
            //     alignment: "right",
            //     colSpan: 4,
            //     bold: true,
            //   },
            // ],
          ],
        },
      },
    ],
  };

  return docDefinition;
};
