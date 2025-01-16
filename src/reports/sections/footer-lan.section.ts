import { log } from 'console';
import { Content, ContextPageSize } from 'pdfmake/interfaces';
import { DateFormatter } from '../../helpers';


export const footerSectionLan = (
  currentPage: number,
  pageCount: number,
  pageSize: ContextPageSize,
): Content => {
  const page:Content={text: `Página ${currentPage} de ${pageCount}`,
    alignment: 'right',
    fontSize: 10,
    bold: true,
    margin: [0, 10, 40, 0],
  }
  return [
    {
      columns:[currentDate, page]
      }
  ]
};

const currentDate: Content = {
  text:DateFormatter.getDDMMYYYY(new Date()),
  alignment: 'left',
  margin:[40, 10, 0, 0],
  //width:100,
  fontSize:7
}

interface HeaderOptions{
  title?: string;
  subTitle?: string;
  showLogo?: boolean;
  showLogo2?: boolean;
  userActual?:string;
}
