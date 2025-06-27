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
export const printDetalleFactura = (
  options: any,
  user: any
): TDocumentDefinitions => {
  const values = options;
  const facturas = values.idFacturas || [];
  const totalMonto = facturas.reduce(
    (acc: any, detail: { montoFactura: any }) => acc + detail.montoFactura,
    0
  );
  const CantidadProducto = facturas.reduce(
    (acc: any, detail: { cantidadFactura: any }) =>
      acc + detail.cantidadFactura,
    0
  );
  let nombreSolicitado =
    values.conductor.username + " " + values.conductor.surnames;
  let cargo = values.conductor.post;
  let destino = values.destino;
  let motivo = values.motivo;
  let numAuth = values.autorizacion
    ? values.autorizacion.numeroAutorizacion
    : "";
  let titulo = `COMBUSTIBLE`;
  let titulo2 = `FONDO \n ROTATORIO`;
  if (values.autorizacion) {
    nombreSolicitado =
      values.autorizacion.unidadSolicitante.user.username +
      " " +
      values.autorizacion.unidadSolicitante.user.surnames;
    cargo = values.autorizacion.unidadSolicitante.user.post;
    destino = values.autorizacion.destino;
    motivo = values.autorizacion.motivo;
  }
  if (values.productos.length > 0) {
    titulo = `LUBRICANTES`;
    titulo2 = `\n LUBRICANTES`;
  }
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
    pageSize: values.productos.length > 0 ? "LEGAL" : "LETTER",
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
            text: `FOMULARIO DE DEVOLUCÓN DE SALDOS \n COMBUSTIBLE`,
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
        text: "I. Detalles del vale otorgado",
        style: "subTitle",
        decoration: 'underline'
      },
      {
        layout: "noBorders",
        table: {
          widths: ["auto", 132, "auto", 257],
          body: [
            [
              {
                text: values.autorizacion ? "Nº AUTORIZACIÓN" : "",
                fillColor: "#dbeffe",
                fontSize: 10,
                bold: true,
                // border: [false, false, false, false],
              },
              {
                text: numAuth,
                fillColor: "#dbeffe",
                fontSize: 11,
                // border: [false, false, false, false],
              },
              {
                text: "Nº VALE",
                fillColor: "#dbeffe",
                alignment: "right",
                fontSize: 11,
                bold: true,
                // border: [false, false, false, false],
              },
              {
                text: `Nº ${values.numeroVale}`,
                fillColor: "#dbeffe",
                fontSize: 13,
                bold: true,
                //alignment: "center",
                // border: [false, false, false, false],},
              },
            ],

            // Razón social
            [
              {
                text: "AP. PROGRAMÁTICA:",
                fillColor: "#dbeffe",
                bold: true,
              },
              {
                text: values.catProgra,
                fillColor: "white",
              },
              {
                text: "FECHA:",
                fillColor: "#dbeffe",
                bold: true,
              },
              {
                text: DateFormatterSimple.getDDMMYYYY(values.fecha),
                fillColor: "white",
              },
            ],
            [
              {
                text: "SOLICITADO POR:",
                fillColor: "#dbeffe",
                bold: true,
              },
              {
                text: nombreSolicitado,
                fillColor: "white",
              },
              {
                text: "CARGO:",
                fillColor: "#dbeffe",
                bold: true,
              },
              {
                text: cargo,
                fillColor: "white",
              },
            ],
            [
              {
                text: "DESTINO:",
                fillColor: "#dbeffe",
                bold: true,
              },
              {
                text: destino,
                fillColor: "white",
                colSpan: 3,
              },
              {},
              {},
            ],
          ],
        },
      },
      {
        layout: "borderBlue",
        table: {
          body: [
            [
              {
                margin: [0, 0, 0, 0],
                layout: "customLayout04", // 'lightHorizontalLines', // optional
                table: {
                  widths: [15, 180, 70, 120, 100],
                  body: [
                    [
                      {
                        text: "Nº",
                        style: "tableHeader",
                        alignment: "center",
                      },
                      {
                        text: "Producto",
                        style: "tableHeader",
                        alignment: "center",
                      },
                      {
                        text: "Cantidad",
                        style: "tableHeader",
                        alignment: "center",
                      },
                      {
                        text: "Unidad de Medida",
                        style: "tableHeader",
                        alignment: "center",
                      },
                      {
                        text: "Monto (Bs.)",
                        style: "tableHeader",
                        alignment: "center",
                      },
                    ],
                    // Si existen productos, listarlos
                    ...(values.productos.length > 0
                      ? values.productos.map(
                          (
                            producto: {
                              articulo: any;
                              cantidadCompra: any;
                              unidadMedida: string;
                              precio: number;
                            },
                            indice: number
                          ) => [
                            {
                              text: indice + 1,
                              style: "tableBody",
                              alignment: "center",
                            },
                            {
                              text: producto.articulo || "Sin Nombre",
                              alignment: "center",
                              fontSize: 7,
                            },
                            {
                              text: producto.cantidadCompra || "0",
                              alignment: "center",
                              fontSize: 7,
                            },
                            {
                              text: `${
                                capitalize(producto.unidadMedida) || "N/A"
                              }s`,
                              alignment: "center",
                              fontSize: 7,
                            },
                            {
                              text:
                                CurrencyFormatter.formatCurrency(
                                  producto.precio
                                ) || "0.00",
                              alignment: "center",
                              fontSize: 7,
                            },
                          ]
                        )
                      : [
                          // Si no hay productos, mostrar idProducto si está disponible
                          [
                            {
                              text: 1,
                              style: "tableBody",
                              alignment: "center",
                            },
                            {
                              text: values.idProducto?.nombre || "Sin Producto",
                              alignment: "center",
                            },
                            {
                              text:
                                CurrencyFormatter.formatCurrency(
                                  values.cantidad
                                ) || "0",
                              alignment: "center",
                            },
                            {
                              text: `${
                                capitalize(values.idProducto?.unidadDeMedida) ||
                                "N/A"
                              }s`,
                              alignment: "center",
                            },
                            {
                              text:
                                CurrencyFormatter.formatCurrency(
                                  values.precio
                                ) || "0.00",
                              alignment: "center",
                            },
                          ],
                        ]),
                  ],
                },
                border: [true, true, true, false],
              },
            ],
            [
              {
                margin: [0, 0, 0, 0],
                layout: "customLayout01", // 'lightHorizontalLines', // optional
                table: {
                  headerRows: 2,
                  widths: [180, 60, 160, 100],
                  body: [
                    [
                      {
                        text: "DATOS DEL CONDUCTOR - VECHÍCULO",
                        style: "tableHeader",
                        alignment: "center",
                        colSpan: 4,
                      },
                      {},
                      {},
                      {},
                    ],
                    [
                      {
                        text: "Vehículo",
                        style: "tableHeader",
                        alignment: "center",
                        fillColor: "#99cff5",
                      },
                      {
                        text: "Nº de Placa",
                        style: "tableHeader",
                        alignment: "center",
                        fillColor: "#99cff5",
                      },
                      {
                        text: "Conductor",
                        style: "tableHeader",
                        alignment: "center",
                        fillColor: "#99cff5",
                      },
                      {
                        text: "Nº de Licencia",
                        style: "tableHeader",
                        alignment: "center",
                        fillColor: "#99cff5",
                      },
                    ],
                    [
                      {
                        text: values.vehiculo.tipo,
                        alignment: "center",
                      },
                      {
                        text: values.vehiculo.placa,
                        alignment: "center",
                      },
                      {
                        text:
                          values.conductor.username +
                          " " +
                          values.conductor.surnames,
                        alignment: "center",
                      },
                      {
                        text: `${values.conductor.ci} - Cat. ${values.conductor.categoriaLicencia}`,
                        alignment: "center",
                      },
                    ],
                  ],
                },
                border: [true, false, true, true],
              },
            ],
          ],
        },
      },
      {
        layout: "noBorders",
        table: {
          widths: ["auto", 132, "auto", "*"],
          body: [
            [
              {
                text: "MOTIVO DE SALIDA:",
                fillColor: "#dbeffe",
                bold: true,
              },
              {
                text: motivo,
                fillColor: "white",
                colSpan: 3,
              },
              {},
              {},
            ],
          ],
        },
      },
      {
        text: "II Detalle de gatos - Facturas",
        style: "subTitle",
        decoration: 'underline'
      },
      // DETALLE DE FACTURAS
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
              { text: "Nº de Factura", style: "tableHeader" },
              { text: "Fecha", style: "tableHeader" },

              { text: "Cantidad Litros", style: "tableHeader" },
              { text: "Monto Pagado.", style: "tableHeader" },
            ],
            ...facturas.map(
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
                  text: CurrencyFormatter.formatCurrency(
                    factura.cantidadFactura
                  ),
                  style: "tableBody",
                  alignment: "right",
                },
                {
                  text: CurrencyFormatter.formatCurrency(factura.montoFactura),
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
                text: `${CurrencyFormatter.formatCurrency(CantidadProducto)}`,
                style: "tableBody",
                alignment: "right",
                // colSpan: 4,
                bold: true,
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
  text: "III. Resumen de fondos:",
  style: "subTitle",
  decoration: 'underline'
},
{
  layout: "customLayout04",
  table: {
    widths: ["*", "auto"],
    body: [
       [
        { text: "Descripción", bold: true },
        { text: "Monto", bold: true },
      ],
      [
        { text: "Monto entregado al conductor:", bold: true },
        { text: CurrencyFormatter.formatCurrency(values.precio) },
      ],
      [
        { text: "Total pagado en facturas:", bold: true },
        { text: CurrencyFormatter.formatCurrency(totalMonto) },
      ],
      [
        { text: "Saldo pendiente de entrega de factura:", bold: true },
        //{ text: "Saldo a justificar (entregado - pagado):", bold: true },
        {
          text: CurrencyFormatter.formatCurrency(values.precio - totalMonto),
        },
      ],
      [
        {
          text: "Monto devuelto al fondo rotatorio:",
          bold: true,
        },
        {
          text: CurrencyFormatter.formatCurrency(values.saldoDevuelto),
        },
      ],
      [
        {
          text: "Monto devuelto al conductor:",
          bold: true,
        },
        {
          text: CurrencyFormatter.formatCurrency(
            values.saldoDevuelto - values.saldoDevolucion
          ),
        },
      ],
     /*  [
        {
          text: "Saldo final (diferencia no justificada):",
          bold: true,
          fillColor: "#f3f3f3",
        },
        {
          text: CurrencyFormatter.formatCurrency(
            values.precio -
              totalMonto -
              values.saldoDevuelto -
              (values.saldoDevuelto - values.saldoDevolucion)
          ),
          fillColor: "#f3f3f3",
          bold: true,
        },
      ], */
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
