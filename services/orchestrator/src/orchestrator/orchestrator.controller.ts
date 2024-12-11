import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';

@Controller('orchestrator')
export class OrchestratorController {
    constructor(private readonly orchestratorService: OrchestratorService) { }

    // Создать ресурс для пользователя
    @Post('create')
    async createResource(
        @Body('userId') userId: string,
        @Body('resourceData') resourceData: any,
    ) {
        const externalUrl = await this.orchestratorService.createResource(userId, resourceData);
        return { externalUrl };
    }

    // Удалить ресурс
    @Delete('delete/:resourceId')
    async deleteResource(@Param('resourceId') resourceId: string) {
        await this.orchestratorService.deleteResource(resourceId);
        return { message: 'Resource deleted successfully' };
    }
}
