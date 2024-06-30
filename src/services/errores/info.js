const generarInfoError = (productData) => {
    const { producto, carrito, stock, ticket } = productData;
    
    return `Los datos están incompletos o no son válidos.
    Necesitamos recibir los siguientes datos:

    - producto: String, recibimos ${typeof producto === 'string' ? producto : 'valor no válido'}
    - carrito: String, recibimos ${typeof carrito === 'string' ? carrito : 'valor no válido'}
    - stock: number, recibimos ${typeof stock === 'number' ? stock : 'valor no válido'}
    - ticket: String, recibimos ${typeof ticket === 'string' ? ticket : 'valor no válido'}
    `;
}

export default generarInfoError;


