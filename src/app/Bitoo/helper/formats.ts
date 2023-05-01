export class Formats {
    /**
     * @author Juan Antonio Guevara Flores
     * @description Formatea y retorna el valor en modo de precio
     * @param number
     * @returns
     */
    public formatCurrency(number: number) {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(number);
    }
}
