import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      name: 'Skill Graph API',
      description: 'NestJS API backed by CognoDB. This is the API server, not the app itself.',
      frontend: 'https://graph-database-application-peach.vercel.app',
      health: '/api/health',
    };
  }
}
