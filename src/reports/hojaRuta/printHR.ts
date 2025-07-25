// import type {
//   Content,
//   ContextPageSize,
//   StyleDictionary,
//   TDocumentDefinitions,
// } from "pdfmake/interfaces";
// import { headerSection } from "../sections/header.section";
// import {
//   capitalize,
//   CurrencyFormatter,
//   DateFormatter,
//   DateFormatterSimple,
// } from "../../helpers";
// import { log, table } from "console";

// const logoGamb: Content = {
//   image: "src/assets/logogamb1.png",
//   width: 100,
//   height: 40,
//   alignment: "center",
//   margin: [0, 20, -20, 0],
// };
// const sisal: Content = {
//   image: "src/assets/sisal.png",
//   width: 100,
//   height: 30,
//   alignment: "center",
//   margin: [0, 30, 20, 0],
// };

// interface ReportOptions {
//   values: any;
// }
// const styles: StyleDictionary = {
//   defaultStyle: {
//     fontSize: 10,
//   },

//   subTitle: {
//     fontSize: 13,
//     //bold: true,
//     //alignment: 'center',
//     margin: [0, 10, 0, 5],
//     //color: '#6b6363'
//   },
//   body: {
//     alignment: "justify",
//     margin: [0, 5, 0, 5],
//     bold: true,
//     fontSize: 12,
//   },
//   signature: {
//     fontSize: 14,
//     bold: true,
//   },
//   data: {
//     fontSize: 10,
//     bold: false,
//   },
//   footer: {
//     fontSize: 7,
//     italics: true,
//     margin: [0, 0, 0, 0],
//   },
//   tableHeader: {
//     bold: true,
//     alignment: "center",
//     fontSize: 9,
//     color: "black",
//   },
//   tableBody: {
//     fontSize: 8,
//     //color: 'black',
//   },
// };
// export const printHR = (
//   options: any,
//   user: any
// ): TDocumentDefinitions => {
//   const values = options;
//   log(values)
//   const currentDate: Content = {
//     text: `Fecha: ${DateFormatter.getDDMMYYYY(new Date())}`,
//     alignment: "left",
//     margin: [40, 0, 0, 0],
//     //width:100,
//     fontSize: 8,
//   };
//   const footerSectionLan = (
//     currentPage: number,
//     pageCount: number,
//     pageSize: ContextPageSize
//   ): Content => {
//     const page: Content = {
//       text: `Página ${currentPage} de ${pageCount}`,
//       alignment: "right",
//       fontSize: 10,
//       bold: true,
//       margin: [0, 0, 40, 0],
//     };
//     return [
//       {
//         //columns:[currentDate,User1, User2, page]
//         columns: [currentDate, page],
//       },
//     ];
//   };
//   const docDefinition: TDocumentDefinitions = {
//     styles: styles,
//     pageSize: "LETTER",
//     pageMargins: [30, 0, 30, 30],
//     defaultStyle: {
//       fontSize: 10,
//     },
//     content: [
//       // Detalles del Vale
//       {
//         columns: [
//           logoGamb,
//           {
//             text: `DETALLE DE DESEMBOLSO`,
//             alignment: "center",
//             margin: [0, 30, 0, 0],
//             style: {
//               bold: true,
//               fontSize: 15,
//               color: "#0e78d1",
//             },
//           },
//           sisal,
//         ],
//       },

//       // Horizontal Line
//       {
//         margin: [0, 0, 0, 3],
//         canvas: [
//           {
//             type: "line",
//             x1: 0,
//             y1: 5,
//             x2: 550,
//             y2: 5,
//             lineWidth: 1,
//             lineColor: "#3Ae546",
//           },
//         ],
//       },
//       {
//         text: "I. Detalles General de Desembolso",
//         style: "subTitle",
//         decoration: 'underline'
//       },
    
//   // DETALLE DE REGISTRO de Fuentes
     
//       {
//         margin: [0, -5, 0, 30],
//         canvas: [
//           {
//             type: "line",
//             x1: 0,
//             y1: 5,
//             x2: 550,
//             y2: 5,
//             lineWidth: 1,
//             lineColor: "#3Ae546",
//           },
//         ],
//       },
//     ],
//   };

//   return docDefinition;
// };
// import type { Content, TDocumentDefinitions, StyleDictionary } from 'pdfmake/interfaces';
// import * as path from 'path';
// import * as fs from 'fs';
// import { DateFormatter } from "../../helpers";
// //import { DateTime } from 'luxon';

// interface HojaRutaOptions {
//   origen: string;
//   beneficiarioPago: string;
//   fecharesepcion: string;
//   fechadocumento: string;
//   nuit: string;
//   referencia: string;
//   tipodoc: string;
//   numCite: string;
// }

// const styles: StyleDictionary = {
//   tableHeader: {
//     bold: true,
//     fontSize: 10,
//     color: 'black',
//     alignment: 'center',
//   },
//   smallText: {
//     fontSize: 8,
//   },
// };

// export const printHR = (data: HojaRutaOptions, user:any): TDocumentDefinitions => {
//   const fechaRecepcion = DateFormatter.getDDMMYYYY(new Date(data.fecharesepcion));
//   const horaRecepcion = DateFormatter.getDDMMYYYY(new Date(data.fecharesepcion));
//   const fechaDocumento = DateFormatter.getDDMMYYYY(new Date(data.fechadocumento));

//   return {
//     pageSize: 'LETTER',
//     pageMargins: [30, 30, 30, 30],
//     styles,
//     content: [
//       {
//         columns: [
//           {
//             image: path.resolve('src/assets/logogamb1.png'),
//             width: 60,
//           },
//           {
//             stack: [
//               { text: 'GOBIERNO AUTÓNOMO MUNICIPAL DE BETANZOS', style: 'tableHeader' },
//               { text: 'Primera Sección Municipal Provincial Cornelio Saavedra', fontSize: 9 },
//               { text: 'Betanzos - Potosí - Bolivia', fontSize: 9 },
//               { text: 'HOJA DE RUTA', style: 'tableHeader', margin: [0, 5] },
//             ],
//             alignment: 'center',
//           },
//           {
//             stack: [
//               { text: `NUIT`, bold: true },
//               { text: `N°: ${data.nuit}`, fontSize: 11 },
//             ],
//             alignment: 'right',
//           },
//         ],
//       },

//       {
//         margin: [0, 10, 0, 0],
//         table: {
//           widths: ['auto', '*', 'auto', '*'],
//           body: [
//             [
//               { text: 'Fecha de recepción:', bold: true },
//               fechaRecepcion,
//               { text: 'Hora:', bold: true },
//               horaRecepcion,
//             ],
//             [
//               { text: 'Fecha de documento:', bold: true },
//               fechaDocumento,
//               { text: 'Teléfono:', bold: true },
//               '',
//             ],
//             [
//               { text: 'Origen:', bold: true },
//               data.origen,
//               { text: 'Beneficiario:', bold: true },
//               data.beneficiarioPago,
//             ],
//             [
//               { text: 'Referencia:', bold: true },
//               {
//                 text: data.referencia,
//                 colSpan: 3,
//               },
//               '',
//               '',
//             ],
//             [
//               { text: 'Tipo de documento:', bold: true },
//               data.tipodoc,
//               { text: 'Cite N°:', bold: true },
//               data.numCite,
//             ],
//           ],
//         },
//       },

//       {
//         margin: [0, 15, 0, 0],
//         columns: [
//           {
//             width: '*',
//             stack: [
//               { text: 'DERIVADO A LA UNIDAD DE:', bold: true },
//               {
//                 columns: [
//                   {
//                     width: '50%',
//                     ul: [
//                       'Concejo Municipal',
//                       'Secretaría despacho',
//                       'Asesoría Legal',
//                       'Stria. Mpal. Adm.Fin.',
//                       'Stía. Mpal de DDHH',
//                       'Stria Mpal de Infraestructura',
//                       'Stria Mpal de DD EE',
//                       'Planificación',
//                       'Recursos Humanos',
//                       'Contabilidad',
//                     ],
//                     fontSize: 8,
//                   },
//                   {
//                     width: '50%',
//                     ul: [
//                       'Activos Fijos',
//                       'Almacenes',
//                       'Defensorías',
//                       'SLIM',
//                       'Catastro Urbano',
//                       'Intendencia',
//                       'Recaudaciones',
//                       'Comunicación',
//                       'Turismo y Cultura',
//                     ],
//                     fontSize: 8,
//                   },
//                 ],
//               },
//             ],
//           },
//           {
//             width: '*',
//             stack: [
//               { text: 'INSTRUCCIÓN:', bold: true },
//               {
//                 ul: [
//                   'Remita informe',
//                   'Dar el curso al trámite',
//                   'Supervise',
//                   'Proceda a su registro',
//                   'Prepare el documento',
//                   'Revise',
//                   'Resuelva',
//                   'Para su conocimiento',
//                 ],
//                 fontSize: 8,
//               },
//               {
//                 text: '\nFirma y sello MAE\n\n\n__________________________\nFecha: ____/____/_______',
//                 fontSize: 9,
//                 alignment: 'center',
//               },
//             ],
//           },
//         ],
//       },

//       {
//         text: '\nSEGUIMIENTO:',
//         style: 'tableHeader',
//         alignment: 'left',
//       },

//       {
//         table: {
//           widths: ['50%', '50%'],
//           body: Array(6)
//             .fill(null)
//             .map(() => [
//               {
//                 text: 'Fecha de recepción: ___/___/____ Hora: ______\nDerivado a: ____________________________\nInstrucción: _____________________________________________\n\n',
//                 border: true,
//                 fontSize: 8,
//               },
//               {
//                 text: 'Fecha de recepción: ___/___/____ Hora: ______\nDerivado a: ____________________________\nInstrucción: _____________________________________________\n\n',
//                 border: true,
//                 fontSize: 8,
//               },
//             ]),
//         },
//         layout: {
//           hLineWidth: () => 0.5,
//           vLineWidth: () => 0.5,
//         },
//       },
//     ],
//   };
// };
import type { Content, TDocumentDefinitions, StyleDictionary } from 'pdfmake/interfaces';
import * as path from 'path';
import { DateFormatter } from "../../helpers";

interface HojaRutaOptions {
  origen: string;
  beneficiarioPago: string;
  fecharesepcion: string;
  fechadocumento: string;
  nuit: string;
  referencia: string;
  tipodoc: string;
  numCite: string;
}

const styles: StyleDictionary = {
  tableHeader: {
    bold: true,
    fontSize: 10,
    color: 'black',
    alignment: 'center',
  },
  smallText: {
    fontSize: 8,
  },
};

export const printHR = (data: HojaRutaOptions, user: any): TDocumentDefinitions => {
  const fechaRecepcion = DateFormatter.getDDMMYYYY(new Date(data.fecharesepcion || new Date()));
  const horaRecepcion = new Date(data.fecharesepcion || new Date()).toTimeString().split(' ')[0];
  const fechaDocumento = DateFormatter.getDDMMYYYY(new Date(data.fechadocumento || new Date()));

  return {
    pageSize: 'LETTER',
    pageMargins: [30, 30, 30, 30],
    styles,
    content: [
      {
        columns: [
          {
            image: path.resolve('src/assets/logogamb1.png'),
            width: 60,
          },
          {
            stack: [
              { text: 'GOBIERNO AUTÓNOMO MUNICIPAL DE BETANZOS', style: 'tableHeader' },
              { text: 'Primera Sección Municipal Provincial Cornelio Saavedra', fontSize: 9 },
              { text: 'Betanzos - Potosí - Bolivia', fontSize: 9 },
              { text: 'HOJA DE RUTA', style: 'tableHeader', margin: [0, 5] },
            ],
            alignment: 'center',
          },
          {
            stack: [
              { text: `NUIT`, bold: true },
              { text: `N°: ${data.nuit || ''}`, fontSize: 11 },
            ],
            alignment: 'right',
          },
        ],
      },

      {
        margin: [0, 10, 0, 0],
        table: {
          widths: ['auto', '*', 'auto', '*'],
          body: [
            [
              { text: 'Fecha de recepción:', bold: true },
              fechaRecepcion,
              { text: 'Hora:', bold: true },
              horaRecepcion,
            ],
            [
              { text: 'Fecha de documento:', bold: true },
              fechaDocumento,
              { text: 'Teléfono:', bold: true },
              '', // Puedes agregar data.telefono || ''
            ],
            [
              { text: 'Origen:', bold: true },
              data.origen || '',
              { text: 'Beneficiario:', bold: true },
              data.beneficiarioPago || '',
            ],
            [
              { text: 'Referencia:', bold: true },
              {
                text: data.referencia || '',
                colSpan: 3,
              },
              '', '',
            ],
            [
              { text: 'Tipo de documento:', bold: true },
              data.tipodoc || '',
              { text: 'Cite N°:', bold: true },
              data.numCite || '',
            ],
          ],
        },
      },

      {
        margin: [0, 15, 0, 0],
        columns: [
          {
            width: '*',
            stack: [
              { text: 'DERIVADO A LA UNIDAD DE:', bold: true },
              {
                columns: [
                  {
                    width: '50%',
                    ul: [
                      'Concejo Municipal',
                      'Secretaría despacho',
                      'Asesoría Legal',
                      'Stria. Mpal. Adm.Fin.',
                      'Stía. Mpal de DDHH',
                      'Stria Mpal de Infraestructura',
                      'Stria Mpal de DD EE',
                      'Planificación',
                      'Recursos Humanos',
                      'Contabilidad',
                    ],
                    fontSize: 8,
                  },
                  {
                    width: '50%',
                    ul: [
                      'Activos Fijos',
                      'Almacenes',
                      'Defensorías',
                      'SLIM',
                      'Catastro Urbano',
                      'Intendencia',
                      'Recaudaciones',
                      'Comunicación',
                      'Turismo y Cultura',
                    ],
                    fontSize: 8,
                  },
                ],
              },
            ],
          },
          {
            width: '*',
            stack: [
              { text: 'INSTRUCCIÓN:', bold: true },
              {
                ul: [
                  'Remita informe',
                  'Dar el curso al trámite',
                  'Supervise',
                  'Proceda a su registro',
                  'Prepare el documento',
                  'Revise',
                  'Resuelva',
                  'Para su conocimiento',
                ],
                fontSize: 8,
              },
              {
                text: '\nFirma y sello MAE\n\n\n__________________________\nFecha: ____/____/_______',
                fontSize: 9,
                alignment: 'center',
              },
            ],
          },
        ],
      },

      {
        text: '\nSEGUIMIENTO:',
        style: 'tableHeader',
        alignment: 'left',
      },

      {
        table: {
          widths: ['50%', '50%'],
          body: Array(6).fill(0).map(() => [
            {
              text: 'Fecha de recepción: ___/___/____ Hora: ______\nDerivado a: ____________________________\nInstrucción: _____________________________________________\n\n',
              border: true,
              fontSize: 8,
            },
            {
              text: 'Fecha de recepción: ___/___/____ Hora: ______\nDerivado a: ____________________________\nInstrucción: _____________________________________________\n\n',
              border: true,
              fontSize: 8,
            },
          ]),
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
        },
      },
    ],
  };
};