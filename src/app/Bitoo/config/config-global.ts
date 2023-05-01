export class ConfigGlobal {
    
    public static setUser(data: any) {
        if (localStorage.getItem('tk_str')) {
            localStorage.clear();
        }
        localStorage.setItem('tk_str', data.data.token);
        localStorage.setItem('u_data', JSON.stringify(data.data.ms_persona));
        localStorage.setItem('u_privilegio', JSON.stringify(data.data.det_privilegio_usuario));
        localStorage.setItem('u_perfil', data.data.det_usuario_perfil_sistema);
        localStorage.setItem('u_permisos', JSON.stringify(data.data.permisos));
        localStorage.setItem('u_roles', JSON.stringify(data.data.roles));
        localStorage.setItem('u_sistema', JSON.stringify(data.data.usuario_sistema));
    }
}
