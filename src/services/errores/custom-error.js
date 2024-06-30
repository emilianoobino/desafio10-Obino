class CustomError {
    static crearError({ nombre = "Error", causa = "desconocido", mensaje, codigo = 1 }) {
       
        const error = new Error(mensaje);
        error.name = nombre;
        error.cause = causa;
        error.code = codigo;

        throw error; 
    }
}

export default CustomError;

