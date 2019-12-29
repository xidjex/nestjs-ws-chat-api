import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  @Get('test')
  @UseGuards(AuthGuard())
  test(@Req() request: any) {
    return 'Test';
  }
}
