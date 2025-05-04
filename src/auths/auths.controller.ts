import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auths.service';
import { Auth } from '../entities/auths.entity';
import { signInDto } from '../DTOs/signIn.dto';

@Controller('auths')
export class AuthsController {
    constructor(private readonly authservice: AuthService){}

    @Post()
    create(@Body() auth: Auth): Promise<Auth>{
        return this.authservice.signup(auth);
    }

    @Post('/signIn')
    signIn(@Body() signInDto:signInDto){
        return this.authservice.signin(signInDto);
    }

}
