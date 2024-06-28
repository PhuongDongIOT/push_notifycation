import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller'

@Module({
    imports: [TerminusModule, HttpModule], // Authentication
    controllers: [HealthController],
    // providers: [AuthService, UserService],
})
export class BaseModule { }