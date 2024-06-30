import { EErrors } from "../services/errores/enums.js";

const manejadorError = (error, req, res, next) => {
    console.error(error.causa);
    
    switch (error.code) {
        case EErrors.INVALID_PRODUCT_DATA.code:
            res.status(400).send({ status: "error", error: error.message });
            break;
        default:
            res.status(500).send({ status: "error", error: "Error desconocido" });
    }
}

export default manejadorError;
