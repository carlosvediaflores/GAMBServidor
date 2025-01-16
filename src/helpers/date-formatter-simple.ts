export class DateFormatterSimple{
    static formatter  = new Intl.DateTimeFormat('es-Es',{
            year:'numeric',
            //month:'long',
            //day:'2-digit', 
            month: "numeric",
            day: "numeric",
            // hour: "numeric",
            // minute: "numeric",
            // second: "numeric",      
            //timeZone: 'America/la_paz', // Ajusta para UTC     
            //dateStyle: 'full',
            //timeStyle: 'full',
        });
        static getDDMMYYYY(date:Date): string{
        return this.formatter.format(date)
    }
}
