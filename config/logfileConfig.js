import logging from 'py-logging'
import {install} from 'py-logging/nodekit/index.js'

install(logging)

logging.basicConfig({
    filename: './logFiles/logs.log',
    format:'%(asctime)s - %(levelname)s - %(message)s - %(error)s',
    level: 'DEBUG',
    datefmt: '%d-%m-%Y %I:%M:%S %p'
})


export default logging
