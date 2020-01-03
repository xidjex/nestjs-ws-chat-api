import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data, socket) => {
  return socket.handshake.query.user;
});
