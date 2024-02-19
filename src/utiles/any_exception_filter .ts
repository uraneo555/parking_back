import { ExceptionFilter, ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
    catch(error: Error, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();
        const status = (error instanceof HttpException) ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        console.log(error);
        
        response
          .status(status)
          .json({message:error.message});
      }
}