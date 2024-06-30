import winston from "winston"

const loggerLevels =  {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2, 
        info: 3, 
        http: 4, 
        debug: 5
    }, 
    colors: {
        fatal: "red", 
        error: "yellow",
        warning: "blue", 
        info: "green", 
        http: "magenta", 
        debug: "white"
    }
}

winston.addColors(loggerLevels.colors);

const loggerDesarrollo = winston.createLogger({
    levels: loggerLevels.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({ colors: loggerLevels.colors }),
                winston.format.simple()
            )
        })
    ]
});

const loggerProduccion = winston.createLogger({
    levels: loggerLevels.levels,
    transports: [
        new winston.transports.File({
            filename: "./errors.log",
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({ colors: loggerLevels.colors }),
                winston.format.simple()
            )
        })
    ]
});

export const logger = process.env.NODE_ENV === "produccion" ? loggerProduccion : loggerDesarrollo

const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}


export default addLogger