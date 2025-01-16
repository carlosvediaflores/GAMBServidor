import { Content } from "pdfmake/interfaces";
import { DateFormatter } from "../../helpers";

const logo: Content = {
    image: 'src/assets/otro.png',
    width: 40,
    height:50,
    alignment: 'center',
    margin:[0,20,-20,0],
}
const logoGamb: Content = {
    image: 'src/assets/logogamb.png',
    width: 100,
    height:40,
    alignment: 'center',
    margin:[0,20,-20,0],
}
const sisal: Content = {
    image: 'src/assets/sisal.png',
    width: 100,
    height:30,
    alignment: 'center',
    margin:[0,30,20,0],
}

const currentDate: Content = {
    text:DateFormatter.getDDMMYYYY(new Date()),
    alignment:'right',
    margin:[20,30],
    width:100,
    fontSize:7
}
interface HeaderOptions{
    title?: string;
    subTitle?: string;
    showLogo?: boolean;
    showLogo2?: boolean;
    userActual?:string;
}

export const headerSection = (options: HeaderOptions): Content => {
    const {title, subTitle, showLogo= true, showLogo2=true,userActual} = options;
    
    const hedarLogo: Content = showLogo ? logoGamb : null;
    const hedarLogo2: Content = showLogo2 ? sisal : null;
   /*  const info: Content = {
        text: `Gobierno Autónomo Municipal de Betanzos \n Diercción de Planificación \n Gestión 2021- 2026 \n Ususario: ${userActual}`,style: {
            bold: true,
            fontSize:7  ,
          },
          
        alignment:'justify',
        margin:[20,30],
        width:180
    } */

    const headerSubTitle:Content=subTitle?{
        text: subTitle,
        alignment: 'center',
        margin: [0,0,0,0],
        style:{
            fontSize:12,
            bold:true
        },
        
    }: null;

    const headerTitle: Content = title
    ? {
        stack:[{
            text:title,
            alignment: 'center',
            margin:[0,30,0,0],
            style:{
                bold:true,
                fontSize:11,
                color: '#0e78d1',
            },
        },
       // headerSubTitle,
        ]
        /* text: title,
        style: {
          bold: true,
        }, */
      }
    : null;

    return{
        columns:[hedarLogo,headerTitle, hedarLogo2, ],
        

    };

};