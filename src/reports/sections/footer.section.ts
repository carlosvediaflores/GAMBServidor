import { Content, ContextPageSize } from 'pdfmake/interfaces';
import { DateFormatter } from '../../helpers';

const linea: Content = {
  image: 'src/assets/linea.png',
  width: 550,
  height:1,
  //alignment: 'center',
  color: 'gray', italics: true,
  margin:[28,-20,-10,0],
}

interface footerOptions{
  currentPage?: number;
  pageCount?: number;
  frase?: string;
  showline?: boolean;
  showDate?: boolean;
  userActual?:any;
}

export const footerSection = (options:footerOptions): Content => {
  
  const currentDate: Content = {
    text:`Fecha: ${DateFormatter.getDDMMYYYY(new Date())}`,
    alignment:'center',
    margin:[0,0,0,0],
    //width:100,
    fontSize:8
  }

  const {frase, showline= true, showDate=true,userActual, currentPage, pageCount} = options;
   linea
   const info:Content = {
      text: 'Este documento es una constancia de que existe registrado el proyecto en el Sistema de SISPRO.',
      style: 'footer',
    }
    const userName:Content = {
      text: `Impreso por: ${userActual.name}`,
      style: 'footer',
    }
    const user:Content = {
      text: `Usuario: ${userActual.email}`,
      style: 'footer',
    }
    const page:Content={text: `Página ${currentPage} de ${pageCount}`,
    alignment: 'right',
    fontSize: 10,
    bold: true,
    margin: [0, 0, 0, 0],
  }
  return [
    //info,
    linea,
    {
    columns:[userName, user, currentDate]
    }]
};