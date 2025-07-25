import type {
  Content,
  ContextPageSize,
  StyleDictionary,
  TDocumentDefinitions,
} from "pdfmake/interfaces";
import { headerSection } from "../sections/header.section";
import {
  capitalize,
  CurrencyFormatter,
  DateFormatter,
  DateFormatterSimple,
} from "../../helpers";
import { log, table } from "console";

const logoGamb: Content = {
  image: "src/assets/logogamb1.png",
  width: 100,
  height: 40,
  alignment: "center",
  margin: [0, 20, -20, 0],
};
const sisal: Content = {
  image: "src/assets/sisal.png",
  width: 100,
  height: 30,
  alignment: "center",
  margin: [0, 30, 20, 0],
};

interface ReportOptions {
  values: any;
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
    fontSize: 7,
    italics: true,
    margin: [0, 0, 0, 0],
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
export const printDesemFuente = (
  options: any,
  user: any
): TDocumentDefinitions => {
  const values = options;
  const desemFuentes = values.idFuentes || [];
  const totalMonto = desemFuentes.reduce(
    (acc: any, detail: { montoTotal: any }) => acc + detail.montoTotal,
    0
  );
  const totalGasto = desemFuentes.reduce(
    (acc: any, detail: { montoGasto: any }) =>
      acc + detail.montoGasto,
    0
  );
 log('values',values.idFuentes)

  const currentDate: Content = {
    text: `Fecha: ${DateFormatter.getDDMMYYYY(new Date())}`,
    alignment: "left",
    margin: [40, 0, 0, 0],
    //width:100,
    fontSize: 8,
  };
  const footerSectionLan = (
    currentPage: number,
    pageCount: number,
    pageSize: ContextPageSize
  ): Content => {
    const page: Content = {
      text: `Página ${currentPage} de ${pageCount}`,
      alignment: "right",
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
    pageMargins: [30, 0, 30, 30],
    defaultStyle: {
      fontSize: 10,
    },
    content: [
      // Detalles del Vale
      {
        columns: [
          logoGamb,
          {
            text: `DETALLE DE DESEMBOLSO`,
            alignment: "center",
            margin: [0, 30, 0, 0],
            style: {
              bold: true,
              fontSize: 15,
              color: "#0e78d1",
            },
          },
          sisal,
        ],
      },

      // Horizontal Line
      {
        margin: [0, 0, 0, 3],
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 5,
            x2: 550,
            y2: 5,
            lineWidth: 1,
            lineColor: "#3Ae546",
          },
        ],
      },
      {
        text: "I. Detalles General de Desembolso",
        style: "subTitle",
        decoration: 'underline'
      },
      // {
      //   layout: "noBorders",
      //   table: {
      //     widths: ["auto", 132, "auto", 257],
      //     body: [
      //       [
      //         {
      //           text: values.autorizacion ? "Nº AUTORIZACIÓN" : "",
      //           fillColor: "#dbeffe",
      //           fontSize: 10,
      //           bold: true,
      //           // border: [false, false, false, false],
      //         },
      //         {
      //           text: numAuth,
      //           fillColor: "#dbeffe",
      //           fontSize: 11,
      //           // border: [false, false, false, false],
      //         },
      //         {
      //           text: "Nº VALE",
      //           fillColor: "#dbeffe",
      //           alignment: "right",
      //           fontSize: 11,
      //           bold: true,
      //           // border: [false, false, false, false],
      //         },
      //         {
      //           text: `Nº ${values.numeroVale}`,
      //           fillColor: "#dbeffe",
      //           fontSize: 13,
      //           bold: true,
      //           //alignment: "center",
      //           // border: [false, false, false, false],},
      //         },
      //       ],

      //       // Razón social
      //       [
      //         {
      //           text: "AP. PROGRAMÁTICA:",
      //           fillColor: "#dbeffe",
      //           bold: true,
      //         },
      //         {
      //           text: values.catProgra,
      //           fillColor: "white",
      //         },
      //         {
      //           text: "FECHA:",
      //           fillColor: "#dbeffe",
      //           bold: true,
      //         },
      //         {
      //           text: DateFormatterSimple.getDDMMYYYY(values.fecha),
      //           fillColor: "white",
      //         },
      //       ],
      //       [
      //         {
      //           text: "SOLICITADO POR:",
      //           fillColor: "#dbeffe",
      //           bold: true,
      //         },
      //         {
      //           text: nombreSolicitado,
      //           fillColor: "white",
      //         },
      //         {
      //           text: "CARGO:",
      //           fillColor: "#dbeffe",
      //           bold: true,
      //         },
      //         {
      //           text: cargo,
      //           fillColor: "white",
      //         },
      //       ],
      //       [
      //         {
      //           text: "DESTINO:",
      //           fillColor: "#dbeffe",
      //           bold: true,
      //         },
      //         {
      //           text: destino,
      //           fillColor: "white",
      //           colSpan: 3,
      //         },
      //         {},
      //         {},
      //       ],
      //     ],
      //   },
      // },
    
      {
        text: "II Detalle de Registro de F.F. - O.F.",
        style: "subTitle",
        decoration: 'underline'
      },
      // DETALLE DE REGISTRO de Fuentes
      {
        layout: "customLayout04", // 'lightHorizontalLines', // optional
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: [18, 120, 122, 120, 120],

          body: [
            [
              { text: "Nº", style: "tableHeader" },
              { text: "Fecha Desembolso", style: "tableHeader" },
              { text: "Beneficiario", style: "tableHeader" },
              { text: "FF-OF", style: "tableHeader" },
              { text: "Monto", style: "tableHeader" },
            ],
            ...desemFuentes.map(
              (
                desemFuente: any,
                indice: number
              ) => [
                { text: indice + 1, style: "tableBody" },
                {
                  text: DateFormatterSimple.getDDMMYYYY(new Date(desemFuente.fechaDesembolso)),
                  style: "tableBody",
                  alignment: "center",
                },
                
                {
                  text: `${ desemFuente.beneficiario.username } ${desemFuente.beneficiario.surnames}`,     
                  style: "tableBody",
                  alignment: "right",
                },
                {
                  text: desemFuente.idFuente.ffof,
                  style: "tableBody",
                  alignment: "center",
                },
                {
                  text: CurrencyFormatter.formatCurrency(desemFuente.montoTotal),
                  style: "tableBody",
                  alignment: "right",
                },
              ]
            ),
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            [
              {
                text: `Total`,
                colSpan: 3,
              },

              "",
              "",
              {
               
              },
              {
                text: `${CurrencyFormatter.formatCurrency(totalMonto)}`,
                style: "tableBody",
                alignment: "right",
                // colSpan: 4,
                bold: true,
              },
            ],
          ],
        },
      },

      {
  text: "III. Detalle de Registro de Gasto",
  style: "subTitle",
  decoration: 'underline'
},
  // DETALLE DE REGISTRO de Fuentes
      {
        layout: "customLayout04", // 'lightHorizontalLines', // optional
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: [18, 40, 200, 70, 70,40,40],

          body: [
            [
              { text: "Nº", style: "tableHeader" },
              { text: "FF-OF", style: "tableHeader" },
              { text: "Descripción", style: "tableHeader" },
              { text: "Desembolso", style: "tableHeader" },
              { text: "Ejecutado", style: "tableHeader" },
               { text: "Saldo", style: "tableHeader" },
                { text: "%", style: "tableHeader" },
            ],
            ...desemFuentes.map(
              (
                desemFuente: any,
                indice: number
              ) => [
                { text: indice + 1, style: "tableBody" },
                {
                  text: desemFuente.idFuente.ffof,
                  style: "tableBody",
                  alignment: "center",
                },
                {
                  text: desemFuente.idFuente.denominacion,
                  style: "tableBody",
                  alignment: "center",
                },
                
                {
                  text: CurrencyFormatter.formatCurrency(desemFuente.montoTotal),
                  style: "tableBody",
                  alignment: "right",
                },
                {
                  text: CurrencyFormatter.formatCurrency(desemFuente.montoGasto),
                  style: "tableBody",
                  alignment: "right",
                },
                 {
                  text: CurrencyFormatter.formatCurrency(desemFuente.montoTotal - desemFuente.montoGasto),
                  style: "tableBody",
                  alignment: "right",
                },
                 {
                  text:`${ CurrencyFormatter.formatCurrency((desemFuente.montoGasto / desemFuente.montoTotal  )*100)}%`,
                  style: "tableBody",
                  alignment: "right",
                },
              ]
            ),
            ["", "", "", "", "","",""],
            ["", "", "", "", "","",""],
            [
              {
                text: `Total`,
                colSpan: 3,
              },

              "",
              "",
              {
                text: `${CurrencyFormatter.formatCurrency(totalMonto)}`,
                style: "tableBody",
                alignment: "right",
                // colSpan: 4,
                bold: true,
              },
              {
                text: `${CurrencyFormatter.formatCurrency(totalGasto)}`,
                style: "tableBody",
                alignment: "right",
                // colSpan: 4,
                bold: true,
              },
              {
                text: `${CurrencyFormatter.formatCurrency(totalMonto - totalGasto)}`,
                style: "tableBody",
                alignment: "right",
                // colSpan: 4,
                bold: true,
              },
              {
                text: `${CurrencyFormatter.formatCurrency((totalGasto/totalMonto)*100)}%`,
                style: "tableBody",
                alignment: "right",
                // colSpan: 4,
                bold: true,
              },
            ],
          ],
        },
      },
// {
//   layout: "customLayout04",
//   table: {
//     widths: ["*", "auto"],
//     body: [
//        [
//         { text: "Descripción", bold: true },
//         { text: "Monto", bold: true },
//       ],
//       [
//         { text: "Monto entregado al conductor:", bold: true },
//         { text: CurrencyFormatter.formatCurrency(values.precio) },
//       ],
//       [
//         { text: "Total pagado en facturas:", bold: true },
//         { text: CurrencyFormatter.formatCurrency(totalMonto) },
//       ],
//       [
//         { text: "Saldo pendiente de entrega de factura:", bold: true },
//         //{ text: "Saldo a justificar (entregado - pagado):", bold: true },
//         {
//           text: CurrencyFormatter.formatCurrency(values.precio - totalMonto),
//         },
//       ],
//       [
//         {
//           text: "Monto devuelto al fondo rotatorio:",
//           bold: true,
//         },
//         {
//           text: CurrencyFormatter.formatCurrency(values.saldoDevuelto),
//         },
//       ],
//       [
//         {
//           text: "Monto devuelto al conductor:",
//           bold: true,
//         },
//         {
//           text: CurrencyFormatter.formatCurrency(
//             values.saldoDevuelto - values.saldoDevolucion
//           ),
//         },
//       ],
//      /*  [
//         {
//           text: "Saldo final (diferencia no justificada):",
//           bold: true,
//           fillColor: "#f3f3f3",
//         },
//         {
//           text: CurrencyFormatter.formatCurrency(
//             values.precio -
//               totalMonto -
//               values.saldoDevuelto -
//               (values.saldoDevuelto - values.saldoDevolucion)
//           ),
//           fillColor: "#f3f3f3",
//           bold: true,
//         },
//       ], */
//     ],
//   },
// },

      {
        margin: [10, 120, 0, 5],
        layout: "noBorders", // 'lightHorizontalLines', // optional
        table: {
          headerRows: 1,
          widths: [120, 120, 140, 140],

          body: [
            [
              {
                text: "Entrgue Conforme ",
                style: "tableHeader",
                alignment: "center",
              },
              {
                // text: "Responsable Almacen",
                // style: "tableHeader",
                // alignment: "center",
              },
              {
                // text: "Autorizado por:",
                // style: "tableHeader",
                // alignment: "center",
              },
              {
                text: "Recibí Conforme ",
                style: "tableHeader",
                alignment: "center",
              },
            ],
          ],
        },
      },
      {
        margin: [0, -5, 0, 0],
        layout: "noBorders", // 'lightHorizontalLines', // optional
        table: {
          headerRows: 1,
          widths: [120, 120, 140, 140],

          body: [
            [
              {
                text: `Fecha de impresión: ${DateFormatter.getDDMMYYYY(
                  new Date()
                )}`,
                style: "footer",
                alignment: "left",
                colSpan: 2,
              },
              {},
              {
                text: `Impreso por: ${capitalize(user.username)} ${capitalize(
                  user.surnames
                )}`,
                style: "footer",
                alignment: "right",
                colSpan: 2,
              },
              {},
            ],
          ],
        },
      },
      {
        margin: [0, -5, 0, 30],
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 5,
            x2: 550,
            y2: 5,
            lineWidth: 1,
            lineColor: "#3Ae546",
          },
        ],
      },
    ],
  };

  return docDefinition;
};
