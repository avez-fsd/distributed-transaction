
const local = (message: string, data: any) => {
  console.log(message, data);
}

const logger = {
  info: (message: string, data: any) => {
    // if (process.env.DATADOG_ACTIVE) log.info(data, message);
    local(message, data);
  },
  warn: (message: string, data: any) => {
    // if (process.env.DATADOG_ACTIVE) log.warn(data, message);
    local(message, data);
  },
  error: (message: string, data: any) => {
    // if (process.env.DATADOG_ACTIVE) log.error(data, message);
    local(message, data);
  },
}

export default logger;