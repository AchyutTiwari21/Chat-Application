interface ResponseInterface {
    statusCode: Number,
    data: any,
    message: string,
    success: Boolean
}

class ApiResponse implements ResponseInterface {
    statusCode: Number
    data: any
    message: string
    success: Boolean
    constructor(statusCode: Number, data: any, message: string = "Success", success: Boolean) {
        this.statusCode = statusCode,
        this.data = data,
        this.message = message,
        this.success = success
    }
}

export { ApiResponse }