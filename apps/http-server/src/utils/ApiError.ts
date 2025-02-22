interface ErrorInterface {
    statusCode: Number,
    data: any,
    message: string,
    success: Boolean,
    errors: any,
    stack?: any
}

class ApiError extends Error implements ErrorInterface {
    statusCode: Number
    data: any
    message: string
    success: Boolean
    errors: any
    stack?: string | undefined

    constructor(
        statusCode: Number,
        message: string = "Something went wrong",
        errors: any = [],
        stack: any = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if(stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}