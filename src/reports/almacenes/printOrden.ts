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
  image: "src/assets/logogamb.png",
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
export const printOrden = (
  options: any,
  user: any,
  catPro: any
): TDocumentDefinitions => {
  const values = options;
  log("values en printOrden", values);
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
  let subTitulo = `ESTACIÓN DE SERVICIO`;
  let subTitulo2 = `RESP. FONDO ROTATORIO`;

  let montoTotalProductos = values.productos.reduce((acc: number, prod: any) => {
    return acc + (prod.precio || 0) * (prod.cantidadCompra || 0);
  }, 0);
  
  let montoTotalServicios = values.servicios.reduce((acc: number, serv: any) => {
    return acc + (serv.precioServ || 0) * (serv.cantidadServicio || 0);
  }, 0);

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
    pageSize: "LEGAL",
    pageMargins: [30, 0, 30, 30],
    defaultStyle: {
      fontSize: 9,
    },
    content: [

       headerSection({
        title: `FORMULARIO ENTREGA DE EFECTIVO PARA ADQUISISICIÓN DE REPUESTOS Y MANTENIMIENTO DEL PARQUE AUTOMOTOR`,
        // subTitle: `TALLER MECÁNICO`,
        showLogo2: true,
        //userActual: values.userActual.toUpperCase(),
      }),
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
        layout: "noBorders",
        table: {
          widths: [95, 132, 60, 100, 40, 90],
          body: [
            [
              {
                text: values.autorizacion ? "AUTORIZACIÓN A.F.:" : "",
                fillColor: "#dbeffe",
                fontSize: 10,
                bold: true,
                // border: [false, false, false, false],
              },
              {
                text: `${numAuth ? "Nº" : ""} ${numAuth}`,
                // fillColor: "#dbeffe",
                fontSize: 11,
                // border: [false, false, false, false],
              },
              {
                text: "FORM.:",
                fillColor: "#dbeffe",
                fontSize: 11,
                bold: true,
                alignment: "right",
                // border: [false, false, false, false],
              },
              {
                text: `Nº ${values.numeroOrden}`,
                // fillColor: "#dbeffe",
                fontSize: 13,
                bold: true,
                //alignment: "center",
                // border: [false, false, false, false],},
              },
              {
                text: "FECHA:",
                fillColor: "#dbeffe",
                alignment: "right",
                bold: true,
                // border: [false, false, false, false],
              },
              {
                text: DateFormatterSimple.getDDMMYYYY(values.fecha),
                // fillColor: "#dbeffe",
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
              },

              {
                text: "DESCRIPCIÓN:",
                fillColor: "#dbeffe",
                bold: true,
              },
              {
                text: catPro ? catPro.proyect_acti : "N/A",
                colSpan: 3,
              },
              {},
              {},
            ],
            [
              {
                text: "SOLICITADO POR:",
                fillColor: "#dbeffe",
                bold: true,
              },
              {
                text: nombreSolicitado,
              },
              {
                text: "CARGO:",
                fillColor: "#dbeffe",
                bold: true,
              },
              {
                text: cargo,
                colSpan: 3,
              },
              {},
              {},
            ],
            [
              {
                text: "TIPO SERICIO:",
                fillColor: "#dbeffe",
                bold: true,
              },
              {
                text: values.tipoServicio || "N/A",
                colSpan: 3,
              },
              {},
              {},
              {
                text: "DOC. PARA:",
                fillColor: "#dbeffe",
                bold: true,
                fontSize: 7,
              },
              {
                text: subTitulo2,
                fontSize: 7,
              },
            ],
          ],
        },
      },
      {
        layout: "borderBlue",
        table: {
          body: [
            [
              { text: "REPUESTOS Y ACCESORIOS", colSpan: 1, border: [false, false, false, false] },
            ],
            [
              {
                layout: "customLayout04", // 'lightHorizontalLines', // optional
                table: {
                  widths: [15, 180, 70, 120, 50, 40],
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
                        text: "P. Unitario",
                        style: "tableHeader",
                        alignment: "center",
                      },
                      {
                        text: "P. Total",
                        style: "tableHeader",
                        alignment: "center",
                      },
                    ],
                    // Si existen productos, listarlos
                    ...(values.productos.length > 0 ? values.productos.map(
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
                            alignment: " right",
                            fontSize: 7,
                          },
                          {
                            text:
                              CurrencyFormatter.formatCurrency(
                                producto.precio * producto.cantidadCompra
                              ) || "0.00",
                            alignment: "right",
                            fontSize: 7,
                          },
                          ]
                        )
                      : []),
                      [
                      {
                        text: `Total General`,
                        colSpan: 3,
                      },

                      "",
                      "",
                      "",
                      "",

                      {
                        text: `${CurrencyFormatter.formatCurrency(montoTotalProductos)}`,
                        style: "tableBody",
                        alignment: "right",
                        // colSpan: 4,
                        bold: true,
                      },
                    ],
                  ],
                },
                border: [true, true, true, true],
              },
            ],
            [
              { text: "SERVICIOS EJECUTADOS", colSpan: 1, border: [false, false, false, false] },
            ],
            [
              {
                margin: [0, 0, 0, 0],
                layout: "customLayout04", // 'lightHorizontalLines', // optional
                table: {
                  widths: [15, 180, 70, 120, 50, 40],
                  body: [
                    [
                      {
                        text: "Nº",
                        style: "tableHeader",
                        alignment: "center",
                      },
                      {
                        text: "Detalle de Servicio",
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
                        text: "P. Unitario",
                        style: "tableHeader",
                        alignment: "center",
                      },
                      {
                        text: "P. Total",
                        style: "tableHeader",
                        alignment: "center",
                      },
                    ],
                    // Si existen productos, listarlos
                    ...(values.servicios.length > 0
                      ? values.servicios.map(
                        (
                          producto: {
                            servicio: any;
                            cantidadServicio: any;
                            unidadMedidaSer: string;
                            precioServ: number;
                          },
                          indice: number
                        ) => [
                            {
                              text: indice + 1,
                              style: "tableBody",
                              alignment: "center",
                            },
                            {
                              text: producto.servicio || "Sin Nombre",

                              fontSize: 7,
                            },
                            {
                              text: producto.cantidadServicio || "0",
                              alignment: "center",
                              fontSize: 7,
                            },
                            {
                              text: `${capitalize(producto.unidadMedidaSer) || "N/A"
                                }s`,
                              alignment: "center",
                              fontSize: 7,
                            },
                            {
                              text:
                                CurrencyFormatter.formatCurrency(
                                  producto.precioServ
                                ) || "0.00",
                              alignment: "right",
                              fontSize: 7,
                            },

                            {
                              text:
                                CurrencyFormatter.formatCurrency(
                                  producto.precioServ * producto.cantidadServicio
                                ) || "0.00",
                              alignment: "right",
                              fontSize: 7,
                            },
                          ]
                      )

                      : []),
                    [
                      {
                        text: `Total General`,
                        colSpan: 3,
                      },

                      "",
                      "",
                      "",
                      "",

                      {
                        text: `${CurrencyFormatter.formatCurrency(montoTotalServicios)}`,
                        style: "tableBody",
                        alignment: "right",
                        // colSpan: 4,
                        bold: true,
                      },
                    ],
                  ],
                },
                border: [true, true, true, true],
              },
            ],
            [
              { text: "", colSpan: 1, border: [false, false, false, false] },
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
                border: [true, true, true, true],
              },
            ],
          ],
        },
      },
       {
        layout: "noBorders",
        table: {
          widths: [40, 380, 40, 60],
          body: [
            [
              {
                text: "GLOSA:",
                fillColor: "#dbeffe",
                bold: true,
              },
              {
                text: values.descripcion || " ",
                fillColor: "white",
          
              },
              { text: "TOTAL:",
                fillColor: "#dbeffe",
                bold: true,},
               {
                text: `${CurrencyFormatter.formatCurrency(montoTotalServicios + montoTotalProductos)}`,
                alignment: "right",
                bold: true,
              },
            ],
          ],
        },
      },
      {
        margin: [20, values.productos.length > 0 ? 70 : 70, 0, 5],
        layout: "noBorders", // 'lightHorizontalLines', // optional
        table: {
          headerRows: 1,
          widths: [160, 160, 160],

          body: [
            [
              {
                text:
                  values.productos.length > 0
                    ? "Entregué Conforme"
                    : "Entregué Conforme  \n (Resp. Fondo Rotatorio)",
                style: "tableHeader",
                alignment: "center",
              },
              {
               
              },
              {
                text: "Recibí Conforme (chofer)",
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
        margin: [0, -5, 0, 0],
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




      // Detalles del Vale
      {
        columns: [
          logoGamb,
          {
            stack: [
              {
                text: `ORDEN PARA ADQUISISICIÓN DE REPUESTOS Y MANTENIMIENTO DEL PARQUE AUTOMOTOR`,
                alignment: "center",
                margin: [0, 30, 0, 0],
                style: {
                  bold: true,
                  fontSize: 13,
                  color: "#0e78d1",
                },
              },
              {
                text: `TALLER MECÁNICO`,
                alignment: "center",
                fontSize: 10,
                color: "#009ffe",
                margin: [0, 0, 0, 0],
              },
            ],
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
        layout: "noBorders",
        table: {
          widths: [95, 132, 60, 125, 48, 55],
          body: [
            [
              {
                text: values.autorizacion ? "AUTORIZACIÓN A.F.:" : "",
                fillColor: "#e7f6de",
                fontSize: 10,
                bold: true,
                // border: [false, false, false, false],
              },
              {
                text: `${numAuth ? "Nº" : ""} ${numAuth}`,
                // fillColor: "#e7f6de",
                fontSize: 11,
                // border: [false, false, false, false],
              },
              {
                text: "FORM.:",
                fillColor: "#e7f6de",
                fontSize: 11,
                bold: true,
                alignment: "right",
                // border: [false, false, false, false],
              },
              {
                text: `Nº ${values.numeroOrden}`,
                // fillColor: "#e7f6de",
                fontSize: 13,
                bold: true,
                //alignment: "center",
                // border: [false, false, false, false],},
              },
              {
                text: "FECHA:",
                fillColor: "#e7f6de",
                alignment: "right",
                bold: true,
                // border: [false, false, false, false],
              },
              {
                text: DateFormatterSimple.getDDMMYYYY(values.fecha),
                // fillColor: "#e7f6de",
                bold: true,
                //alignment: "center",
                // border: [false, false, false, false],},
              },
            ],

            // Razón social
            [
              {
                text: "AP. PROGRAMÁTICA:",
                fillColor: "#e7f6de",
                bold: true,
              },
              {
                text: values.catProgra,
              },

              {
                text: "DESCRIPCIÓN:",
                fillColor: "#e7f6de",
                bold: true,
              },
              {
                text: catPro ? catPro.proyect_acti : "",
                colSpan: 3,
              },
              {},
              {},
            ],
            [
              {
                text: "SOLICITADO POR:",
                fillColor: "#e7f6de",
                bold: true,
              },
              {
                text: values.unidadSolicitante.nombresubdir,
              },
              {
                text: "CARGO:",
                fillColor: "#e7f6de",
                bold: true,
              },
              {
                text: cargo,
                colSpan: 3,
              },
              {},
              {},
            ],
            [
              {
                text: "TIPO SERVICIO:",
                fillColor: "#e7f6de",
                bold: true,
              },
              {
                text: values.tipoServicio || "N/A",
                colSpan: 3,
              },
              {},
              {},
              {
                text: "DOC. PARA:",
                fillColor: "#e7f6de",
                bold: true,
              },
               {
                text: subTitulo2,
                fontSize: 7,
              },
            ],
          ],
        },
      },
      {
        layout: "borderSuccess",
        table: {
          body: [
            [
              { text: "REPUESTOS Y ACCESORIOS", colSpan: 1, border: [false, false, false, false] },
            ],
            [
              {
                margin: [0, 0, 0, 0],
                layout: "customLayout05", // 'lightHorizontalLines', // optional
                table: {
                  widths: [15, 180, 70, 120, 50, 40],
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
                        text: "P. Unitario",
                        style: "tableHeader",
                        alignment: "center",
                      },
                      {
                        text: "P. Total",
                        style: "tableHeader",
                        alignment: "center",
                      },
                    ],
                    // Si existen productos, listarlos
                    ...(values.productos.length > 0 ? values.productos.map(
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

                            fontSize: 7,
                          },
                          {
                            text: producto.cantidadCompra || "0",
                            alignment: "center",
                            fontSize: 7,
                          },
                          {
                            text: `${capitalize(producto.unidadMedida) || "N/A"
                              }s`,
                            alignment: "center",
                            fontSize: 7,
                          },
                          {
                            text:
                              CurrencyFormatter.formatCurrency(
                                producto.precio
                              ) || "0.00",
                            alignment: " right",
                            fontSize: 7,
                          },
                          {
                            text:
                              CurrencyFormatter.formatCurrency(
                                producto.precio * producto.cantidadCompra
                              ) || "0.00",
                            alignment: "right",
                            fontSize: 7,
                          },
                        ]
                    ) : []),
                    [
                      {
                        text: `Total General`,
                        colSpan: 3,
                      },

                      "",
                      "",
                      "",
                      "",

                      {
                        text: `${CurrencyFormatter.formatCurrency(montoTotalProductos)}`,
                        style: "tableBody",
                        alignment: "right",
                        // colSpan: 4,
                        bold: true,
                      },
                    ],
                  ],
                },
                border: [true, true, true, true],
              },
            ],
            [
              { text: "SERVICIOS EJECUTADOS", colSpan: 1, border: [false, false, false, false] },
            ],
            [
              {
                margin: [0, 0, 0, 0],
                layout: "customLayout05", // 'lightHorizontalLines', // optional
                table: {
                  widths: [15, 180, 70, 120, 50, 40],
                  body: [
                    [
                      {
                        text: "Nº",
                        style: "tableHeader",
                        alignment: "center",
                      },
                      {
                        text: "Detalle de Servicio",
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
                        text: "P. Unitario",
                        style: "tableHeader",
                        alignment: "center",
                      },
                      {
                        text: "P. Total",
                        style: "tableHeader",
                        alignment: "center",
                      },
                    ],
                    // Si existen productos, listarlos
                    ...(values.servicios.length > 0
                      ? values.servicios.map(
                        (
                          producto: {
                            servicio: any;
                            cantidadServicio: any;
                            unidadMedidaSer: string;
                            precioServ: number;
                          },
                          indice: number
                        ) => [
                            {
                              text: indice + 1,
                              style: "tableBody",
                              alignment: "center",
                            },
                            {
                              text: producto.servicio || "Sin Nombre",

                              fontSize: 7,
                            },
                            {
                              text: producto.cantidadServicio || "0",
                              alignment: "center",
                              fontSize: 7,
                            },
                            {
                              text: `${capitalize(producto.unidadMedidaSer) || "N/A"
                                }s`,
                              alignment: "center",
                              fontSize: 7,
                            },
                            {
                              text:
                                CurrencyFormatter.formatCurrency(
                                  producto.precioServ
                                ) || "0.00",
                              alignment: "right",
                              fontSize: 7,
                            },

                            {
                              text:
                                CurrencyFormatter.formatCurrency(
                                  producto.precioServ * producto.cantidadServicio
                                ) || "0.00",
                              alignment: "right",
                              fontSize: 7,
                            },
                          ]
                      )

                      : []),
                    [
                      {
                        text: `Total General`,
                        colSpan: 3,
                      },

                      "",
                      "",
                      "",
                      "",

                      {
                        text: `${CurrencyFormatter.formatCurrency(montoTotalServicios)}`,
                        style: "tableBody",
                        alignment: "right",
                        // colSpan: 4,
                        bold: true,
                      },
                    ],
                  ],
                },
                border: [true, true, true, true],
              },
            ],
            [
              { text: "", colSpan: 1, border: [false, false, false, false] },
            ],
            [
              {
                margin: [0, 0, 0, 0],
                layout: "customLayout06", // 'lightHorizontalLines', // optional
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
                        fillColor: "#e7f6de",
                      },
                      {
                        text: "Nº de Placa",
                        style: "tableHeader",
                        alignment: "center",
                        fillColor: "#e7f6de",
                      },
                      {
                        text: "Conductor",
                        style: "tableHeader",
                        alignment: "center",
                        fillColor: "#e7f6de",
                      },
                      {
                        text: "Nº de Licencia",
                        style: "tableHeader",
                        alignment: "center",
                        fillColor: "#e7f6de",
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
                border: [true, true, true, true],
              },
            ],
          ],
        },
      },
      {
        layout: "noBorders",
        table: {
          widths: [40, 380, 40, 60],
          body: [
            [
              {
                text: "GLOSA:",
                fillColor: "#e7f6de",
                bold: true,
              },
              {
                text: values.descripcion || " ",
                fillColor: "white",
          
              },
              { text: "TOTAL:",
                fillColor: "#e7f6de",
                bold: true,},
               {
                text: `${CurrencyFormatter.formatCurrency(montoTotalServicios + montoTotalProductos)}`,
                alignment: "right",
                bold: true,
              },
            ],
           
          ],
        },
      },
      {
        margin: [10, values.productos.length > 0 ? 70 : 70, 0, 5],
        layout: "noBorders", // 'lightHorizontalLines', // optional
        table: {
          headerRows: 1,
          widths: [120, 120, 140, 140],

          body: [
            [
              {
                text: "Solicitado por: \n (Chofer)",
                style: "tableHeader",
                alignment: "center",
              },
              {
                text: "Unidad Solicitante",
                style: "tableHeader",
                alignment: "center",
              },
              {
                text: "Autorizado por: \n (Mecánico)",
                style: "tableHeader",
                alignment: "center",
              },
              {
                text: "Recibí Conforme \n (Resp. Fondo Rotatorio)",
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
      // Detalles del Vale

     
    ],
  };

  return docDefinition;
};
