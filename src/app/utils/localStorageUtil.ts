import { LOCAL_STORAGE_KEY } from './localStorageKey';

export class LocalStorageUtil{
    
    public static existe(clave: string): boolean{
        const elemento = localStorage.getItem(clave);
        return elemento !== null;
    }
    public static eliminar(clave: string): void{
        localStorage.removeItem(clave);
    }
}