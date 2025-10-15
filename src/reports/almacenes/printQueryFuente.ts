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
  tableBody2: {
    fontSize: 6,
    //color: 'black',
  },
  tableHeader2: {
    bold: true,
    alignment: "center",
    fontSize: 7,
    color: "black",
  },
};
export const printQueryFuente = (options: any): TDocumentDefinitions => {
  const values = options;
  const user = values.user;
  log("printDescargoGasto", user);
  log("filter1", values.filter);
  const desemFuentes = values.desembolsoFuentes || [];
  const resumenPorTipoFondo = values.resumenPorTipoFondo || [];
  const resumenPorFuente = values.resumenPorFuente || [];
  const resumenPorBeneficiario = values.resumenPorBeneficiario || [];
  const totalMonto = resumenPorFuente.reduce(
    (acc: any, detail: { totalMonto: any }) => acc + detail.totalMonto,
    0
  );
  const totalGasto = resumenPorFuente.reduce(
    (acc: any, detail: { totalGasto: any }) => acc + detail.totalGasto,
    0
  );
  const totalGastoCatPro = resumenPorBeneficiario.reduce(
    (acc: any, detail: { totalMonto: any }) => acc + detail.totalMonto,
    0
  );
  // log("values", values.idFuentes);

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
    // pageOrientation: 'landscape',
    styles: styles,
    pageSize: "LEGAL",
    pageMargins: [30, 65, 30, 30],
    defaultStyle: {
      fontSize: 10,
    },

    // ✅ Marca de agua en diagonal
    // watermark: {
    //   text: "BORRADOR",
    //   color: "#d00000",
    //   opacity: 0.1,
    //   bold: true,
    //   fontSize: 150,
    //   angle: -60, // 🔹 Rotación en grados (positivo = antihorario)
    // },
    header: [
      {
        columns: [
          logoGamb,
          {
            text: `REPORTE DETALLADO DEL GASTO`,
            alignment: "center",
            margin: [0, 30, 0, 0],
            style: {
              bold: true,
              fontSize: 13,
              color: "#0e78d1",
            },
          },
          sisal,
        ],
      },
      // Horizontal Line
      {
        margin: [22, 0, 0, 0],
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 5,
            x2: 570,
            y2: 5,
            lineWidth: 1,
            lineColor: "#2195ca",
          },
        ],
      },
    ],
    footer: footerSectionLan,

    content: [
      // Detalles del Vale

      /*  // Horizontal Line
      {
        margin: [0, 0, 0, 0],
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
      }, */
      {
        text: "I. Detalle de Gastos de Fuentes de Financiamiento",
        style: "subTitle",
        decoration: "underline",
      },
      // DETALLE DE REGISTRO de Fuentes
      {
        layout: "customLayout04", // 'lightHorizontalLines', // optional
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: [12, 30, 245, 60, 60, 40, 40],

          body: [
            [
              { text: "Nº", style: "tableHeader" },
              { text: "FF-OF", style: "tableHeader" },
              { text: "Descripción", style: "tableHeader" },
              { text: "Monto Acumulado", style: "tableHeader" },
              { text: "Monto Ejecutado", style: "tableHeader" },
              { text: "Saldo", style: "tableHeader" },
              { text: "%", style: "tableHeader" },
            ],
            ...resumenPorFuente.map((desemFuente: any, indice: number) => [
              { text: indice + 1, style: "tableBody", alignment: "center" },
              {
                text: desemFuente._id,
                style: "tableBody",
                alignment: "center",
              },
              {
                text: desemFuente.denominacionFuente,
                style: "tableBody2",
              },
              {
                text: CurrencyFormatter.formatCurrency(desemFuente.totalMonto),
                style: "tableBody",
                alignment: "right",
              },
              {
                text: CurrencyFormatter.formatCurrency(desemFuente.totalGasto),
                style: "tableBody",
                alignment: "right",
              },
              {
                text: CurrencyFormatter.formatCurrency(
                  desemFuente.totalMonto - desemFuente.totalGasto
                ),
                style: "tableBody",
                alignment: "right",
              },

              {
                text: `${CurrencyFormatter.formatCurrency(
                  (desemFuente.totalGasto / desemFuente.totalMonto) * 100
                )}%`,
                style: "tableBody",
                alignment: "right",
              },
            ]),
            ["", "", "", "", "", "", ""],
            ["", "", "", "", "", "", ""],
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
                text: `${CurrencyFormatter.formatCurrency(
                  totalMonto - totalGasto
                )}`,
                style: "tableBody",
                alignment: "right",
                // colSpan: 4,
                bold: true,
              },
              {
                text: `${CurrencyFormatter.formatCurrency(
                  (totalGasto / totalMonto) * 100
                )}%`,
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
        text: "II Resumen de gasto por beneficiario",
        style: "subTitle",
        decoration: "underline",
      },
      ...resumenPorBeneficiario.flatMap((benef: any, index: number) => {
        const totalMonto = benef.sumaTotalMonto || 0;
        const totalGasto = benef.sumaTotalGasto || 0;

        return [
          {
            text: `${index + 1}. ${benef.beneficiario} ${benef.surnames}`,
            style: {
              bold: true,
              fontSize: 11,
              margin: [0, 6, 0, 3],
              color: "#0a0a0a",
            },
          },
          {
            layout: "customLayout04",
            table: {
              headerRows: 1,
              widths: [12, 40, 240, 60, 60, 40, 40],
              body: [
                [
                  { text: "Nº", style: "tableHeader" },
                  { text: "FF-OF", style: "tableHeader" },
                  { text: "Descripción", style: "tableHeader" },
                  { text: "Monto Acumulado", style: "tableHeader" },
                  { text: "Monto Ejecutado", style: "tableHeader" },
                  { text: "Saldo", style: "tableHeader" },
                  { text: "%", style: "tableHeader" },
                ],
                ...benef.fuentes.map((fuente: any, i: number) => [
                  { text: i + 1, style: "tableBody", alignment: "center" },
                  { text: fuente._id, style: "tableBody", alignment: "center" },
                  { text: fuente.denominacionFuente, style: "tableBody2" },
                  {
                    text: CurrencyFormatter.formatCurrency(fuente.totalMonto),
                    style: "tableBody",
                    alignment: "right",
                  },
                  {
                    text: CurrencyFormatter.formatCurrency(fuente.totalGasto),
                    style: "tableBody",
                    alignment: "right",
                  },
                  {
                    text: CurrencyFormatter.formatCurrency(
                      fuente.totalMonto - fuente.totalGasto
                    ),
                    style: "tableBody",
                    alignment: "right",
                  },
                  {
                    text: `${CurrencyFormatter.formatCurrency(
                      (fuente.totalGasto / fuente.totalMonto) * 100
                    )}%`,
                    style: "tableBody",
                    alignment: "right",
                  },
                ]),
                ["", "", "", "", "", "", ""],
                [
                  {
                    text: "Total Beneficiario",
                    colSpan: 3,
                    style: "tableHeader",
                    alignment: "center",
                  },
                  "",
                  "",
                  {
                    text: CurrencyFormatter.formatCurrency(totalMonto),
                    style: "tableBody",
                    alignment: "right",
                    bold: true,
                  },
                  {
                    text: CurrencyFormatter.formatCurrency(totalGasto),
                    style: "tableBody",
                    alignment: "right",
                    bold: true,
                  },
                  {
                    text: CurrencyFormatter.formatCurrency(
                      totalMonto - totalGasto
                    ),
                    style: "tableBody",
                    alignment: "right",
                    bold: true,
                  },
                  {
                    text: `${CurrencyFormatter.formatCurrency(
                      (totalGasto / totalMonto) * 100
                    )}%`,
                    style: "tableBody",
                    alignment: "right",
                    bold: true,
                  },
                ],
              ],
            },
          },
        ];
      }),

      {
        text: "III. Resumen de gasto por tipo de fondo",
        style: "subTitle",
        decoration: "underline",
      },
      // DETALLE DE REGISTRO de Fuentes
      ...resumenPorTipoFondo.flatMap((tipo: any, index: number) => {
        const totalMonto = tipo.sumaTotalMonto || 0;
        const totalGasto = tipo.sumaTotalGasto || 0;

        return [
          {
            text: `${index + 1}. ${tipo.tipoFondo}`,
            style: {
              bold: true,
              fontSize: 11,
              margin: [0, 6, 0, 3],
              color: "#0a0a0a",
            },
          },
          {
            layout: "customLayout04",
            table: {
              headerRows: 1,
              widths: [12, 40, 240, 60, 60, 40, 40],
              body: [
                [
                  { text: "Nº", style: "tableHeader" },
                  { text: "FF-OF", style: "tableHeader" },
                  { text: "Descripción", style: "tableHeader" },
                  { text: "Monto Acumulado", style: "tableHeader" },
                  { text: "Monto Ejecutado", style: "tableHeader" },
                  { text: "Saldo", style: "tableHeader" },
                  { text: "%", style: "tableHeader" },
                ],
                ...tipo.fuentes.map((fuente: any, i: number) => [
                  { text: i + 1, style: "tableBody", alignment: "center" },
                  { text: fuente._id, style: "tableBody", alignment: "center" },
                  { text: fuente.denominacionFuente, style: "tableBody2" },
                  {
                    text: CurrencyFormatter.formatCurrency(fuente.totalMonto),
                    style: "tableBody",
                    alignment: "right",
                  },
                  {
                    text: CurrencyFormatter.formatCurrency(fuente.totalGasto),
                    style: "tableBody",
                    alignment: "right",
                  },
                  {
                    text: CurrencyFormatter.formatCurrency(
                      fuente.totalMonto - fuente.totalGasto
                    ),
                    style: "tableBody",
                    alignment: "right",
                  },
                  {
                    text: `${CurrencyFormatter.formatCurrency(
                      (fuente.totalGasto / fuente.totalMonto) * 100
                    )}%`,
                    style: "tableBody",
                    alignment: "right",
                  },
                ]),
                ["", "", "", "", "", "", ""],
                [
                  {
                    text: "Total por Tipo de Fondo",
                    colSpan: 3,
                    style: "tableHeader",
                    alignment: "center",
                  },
                  "",
                  "",
                  {
                    text: CurrencyFormatter.formatCurrency(totalMonto),
                    style: "tableBody",
                    alignment: "right",
                    bold: true,
                  },
                  {
                    text: CurrencyFormatter.formatCurrency(totalGasto),
                    style: "tableBody",
                    alignment: "right",
                    bold: true,
                  },
                  {
                    text: CurrencyFormatter.formatCurrency(
                      totalMonto - totalGasto
                    ),
                    style: "tableBody",
                    alignment: "right",
                    bold: true,
                  },
                  {
                    text: `${CurrencyFormatter.formatCurrency(
                      (totalGasto / totalMonto) * 100
                    )}%`,
                    style: "tableBody",
                    alignment: "right",
                    bold: true,
                  },
                ],
              ],
            },
          },
        ];
      }),
      {
        text: "Total General por Tipo de Fondo",
        style: "tableHeader",
        margin: [0, 6, 0, 2],
      },
      {
        layout: "customLayout04",
        table: {
          widths: [300, 60, 60, 40, 40],
          body: [
            [
              {
                text: "Total General",
                style: "tableHeader",
                alignment: "center",
              },
              {
                text: CurrencyFormatter.formatCurrency(
                  resumenPorTipoFondo.reduce(
                    (a: number, b: { sumaTotalMonto: number }) =>
                      a + b.sumaTotalMonto,
                    0
                  )
                ),
                style: "tableBody",
                alignment: "right",
                bold: true,
              },
              {
                text: CurrencyFormatter.formatCurrency(
                  resumenPorTipoFondo.reduce(
                    (a: number, b: { sumaTotalGasto: number }) =>
                      a + b.sumaTotalGasto,
                    0
                  )
                ),
                style: "tableBody",
                alignment: "right",
                bold: true,
              },
              {
                text: CurrencyFormatter.formatCurrency(
                  resumenPorTipoFondo.reduce(
                    (
                      a: number,
                      b: { sumaTotalMonto: number; sumaTotalGasto: number }
                    ) => a + (b.sumaTotalMonto - b.sumaTotalGasto),
                    0
                  )
                ),
                style: "tableBody",
                alignment: "right",
                bold: true,
              },
              {
                text: `${CurrencyFormatter.formatCurrency(
                  (resumenPorTipoFondo.reduce(
                    (a: number, b: { sumaTotalGasto: number }) =>
                      a + b.sumaTotalGasto,
                    0
                  ) /
                    resumenPorTipoFondo.reduce(
                      (a: number, b: { sumaTotalMonto: number }) =>
                        a + b.sumaTotalMonto,
                      0
                    )) *
                    100
                )}%`,
                style: "tableBody",
                alignment: "right",
                bold: true,
              },
            ],
          ],
        },
      },

      // {
      //   margin: [10, 120, 0, 5],
      //   layout: "noBorders", // 'lightHorizontalLines', // optional
      //   table: {
      //     headerRows: 1,
      //     widths: [120, 120, 140, 140],

      //     body: [
      //       [
      //         {
      //           text: "Entrgue Conforme ",
      //           style: "tableHeader",
      //           alignment: "center",
      //         },
      //         {
      //           // text: "Responsable Almacen",
      //           // style: "tableHeader",
      //           // alignment: "center",
      //         },
      //         {
      //           // text: "Autorizado por:",
      //           // style: "tableHeader",
      //           // alignment: "center",
      //         },
      //         {
      //           text: "Recibí Conforme ",
      //           style: "tableHeader",
      //           alignment: "center",
      //         },
      //       ],
      //     ],
      //   },
      // },
      // {
      //   margin: [0, -5, 0, 0],
      //   layout: "noBorders", // 'lightHorizontalLines', // optional
      //   table: {
      //     headerRows: 1,
      //     widths: [120, 120, 140, 140],

      //     body: [
      //       [
      //         {
      //           text: `Fecha de impresión: ${DateFormatter.getDDMMYYYY(
      //             new Date()
      //           )}`,
      //           style: "footer",
      //           alignment: "left",
      //           colSpan: 2,
      //         },
      //         {},
      //         {
      //           text: `Impreso por: ${capitalize(user.username)} ${capitalize(
      //             user.surnames
      //           )}`,
      //           style: "footer",
      //           alignment: "right",
      //           colSpan: 2,
      //         },
      //         {},
      //       ],
      //     ],
      //   },
      // },
      // {
      //   margin: [0, -5, 0, 30],
      //   canvas: [
      //     {
      //       type: "line",
      //       x1: 0,
      //       y1: 5,
      //       x2: 550,
      //       y2: 5,
      //       lineWidth: 1,
      //       lineColor: "#3Ae546",
      //     },
      //   ],
      // },
    ],
  };

  return docDefinition;
};
