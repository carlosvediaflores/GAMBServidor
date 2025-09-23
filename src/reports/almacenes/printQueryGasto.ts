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
export const printQueryGasto = (options: any): TDocumentDefinitions => {
  const values = options;
  const user = values.user;
  log("printDescargoGasto", user);
  const desemFuentes = values.idFuentes || [];
  const desemGast = values.gastos || [];
  const resumenPorFuente = values.resumenPorFuente || [];
  const resumenPorCatProgra = values.resumenPorCatProgra || [];
  const totalMonto = resumenPorFuente.reduce(
    (acc: any, detail: { totalMonto: any }) => acc + detail.totalMonto,
    0
  );
  const totalGasto = desemGast.reduce(
    (acc: any, detail: { montoGasto: any }) => acc + detail.montoGasto,
    0
  );
  const totalGastoCatPro = resumenPorCatProgra.reduce(
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
    watermark: {
      text: "NO VÁLIDO",
      color: "#d00000",
      opacity: 0.1,
      bold: true,
      fontSize: 150,
      angle: -60, // 🔹 Rotación en grados (positivo = antihorario)
    },
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
          widths: [18, 80, 320, 95],

          body: [
            [
              { text: "Nº", style: "tableHeader" },
              { text: "FF-OF", style: "tableHeader" },
              { text: "Descripción", style: "tableHeader" },
              { text: "Monto Ejecutado", style: "tableHeader" },
              // { text: "%", style: "tableHeader" },
            ],
            ...resumenPorFuente.map((desemFuente: any, indice: number) => [
              { text: indice + 1, style: "tableBody", alignment: "center" },
              {
                text: desemFuente._id,
                style: "tableBody",
                alignment: "center",
              },
              {
                text: desemFuente.denominacion,
                style: "tableBody2",
              },
              {
                text: CurrencyFormatter.formatCurrency(desemFuente.totalMonto),
                style: "tableBody",
                alignment: "right",
              },

              // {
              //   text: `${CurrencyFormatter.formatCurrency(
              //     (desemFuente.totalMonto / desemFuente.totalMonto) * 100
              //   )}%`,
              //   style: "tableBody",
              //   alignment: "right",
              // },
            ]),
            ["", "", "", ""],
            ["", "", "", ""],
            [
              {
                text: `Total`,
                colSpan: 2,
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
            ],
          ],
        },
      },

      {
        text: "II Detalle de Registro de Gasto",
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
          widths: [10, 30, 60, 30, 80, 20, 25, 80, 38, 20, 25],

          body: [
            [
              { text: "Nº", style: "tableHeader2" },
              { text: "Fecha", style: "tableHeader2" },
              { text: "Solicitado por:", style: "tableHeader2" },
              { text: "Ap. Prog.", style: "tableHeader2" },
              { text: "Descrip. Ap. Prog.", style: "tableHeader2" },
              { text: "FF-OF", style: "tableHeader2" },
              { text: "Partida Gasto", style: "tableHeader2" },
              { text: "Descripción de partida", style: "tableHeader2" },
              { text: "Tipo de gasto", style: "tableHeader2" },
              { text: "Nº de Vale", style: "tableHeader2" },
              { text: "Monto", style: "tableHeader2" },
            ],
            ...desemGast.map((desemGasto: any, indice: number) => [
              { text: indice + 1, style: "tableBody2", alignment: "center" },
              {
                text: DateFormatterSimple.getDDMMYYYY(
                  new Date(desemGasto.fechaRegistro)
                ),
                style: "tableBody2",
                alignment: "center",
              },

              {
                text: `${capitalize(desemGasto.solicitante)} `,
                style: "tableBody2",
              },

              {
                text: `${desemGasto.catProgra} `,
                style: "tableBody2",
                alignment: "center",
              },

              {
                text: `${desemGasto.nameCatProg} `,
                style: "tableBody2",
              },

              {
                text: desemGasto.fuente,
                style: "tableBody2",
                alignment: "center",
              },

              {
                text: `${desemGasto.partida} `,
                style: "tableBody2",
                alignment: "center",
              },

              {
                text: `${desemGasto.idPartida?.denominacion ?? ""} `,
                style: "tableBody2",
              },

              {
                text: `${desemGasto.tipoGasto} `,
                style: "tableBody2",
                alignment: "center",
              },

              {
                text: `${desemGasto.idCombustible?.numeroVale ?? ""} `,
                style: "tableBody2",
                alignment: "center",
              },

              {
                text: CurrencyFormatter.formatCurrency(desemGasto.montoGasto),
                style: "tableBody2",
                alignment: "right",
              },
            ]),
            ["", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", ""],
            [
              {
                text: `Total`,
                colSpan: 7,
              },
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              {
                text: `${CurrencyFormatter.formatCurrency(totalGasto)}`,
                style: "tableBody",
                alignment: "right",
                colSpan: 3,
                bold: true,
              },
              "",
              "",
            ],
          ],
        },
      },
      {
        text: "III. Detalle Gasto por Categorìa Programática",
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
          widths: [18, 80, 300, 30, 70],

          body: [
            [
              { text: "Nº", style: "tableHeader" },
              { text: "Cat. Prog.", style: "tableHeader" },
              { text: "Descripción", style: "tableHeader" },
              { text: "FF-OF", style: "tableHeader" },
              { text: "Monto Ejecutado", style: "tableHeader" },
            ],
            ...resumenPorCatProgra.map((catProg: any, indice: number) => [
              { text: indice + 1, style: "tableBody", alignment: "center" },
              {
                text: catProg._id,
                style: "tableBody",
                alignment: "center",
              },
              {
                text: catProg.nameCatProg,
                style: "tableBody2",
              },
              {
                text: catProg.fuente,
                style: "tableBody",
                alignment: "center",
              },
              {
                text: CurrencyFormatter.formatCurrency(catProg.totalMonto),
                style: "tableBody",
                alignment: "right",
              },
            ]),
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            [
              {
                text: `Total`,
                colSpan: 3,
              },

              "",
              "",
              "",

              {
                text: `${CurrencyFormatter.formatCurrency(totalGastoCatPro)}`,
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
