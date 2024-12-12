import { Controller, All, Req, Res, HttpStatus, Post, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { RouterService } from './router.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller()
export class RouterController {
    constructor(private readonly routerService: RouterService) { }

    // Обработка всех входящих запросов
    @All('*')
    async handleRequest(@Req() req: Request, @Res() res: Response) {
        const authorization = req.headers['authorization'];
        const resourceId = req.params['0']; // предполагается формат /resource_id/...
        console.log(`Authorization: ${authorization}`)
        if (!authorization) {
            return res.status(HttpStatus.UNAUTHORIZED).send('Unauthorized');
        }

        const isAllowed = await this.routerService.checkAccess(authorization as string, resourceId);
        if (!isAllowed) {
            return res.status(HttpStatus.FORBIDDEN).send('Forbidden');
        }
        console.log(`handleRequest, is allowed: ${isAllowed}`)
        // Получить внутренний URL ресурса
        const internalUrl = await this.routerService.getInternalUrl(resourceId);
        if (!internalUrl) {
            return res.status(HttpStatus.NOT_FOUND).send('Resource not found');
        }

        // Перенаправить запрос
        return res.redirect(internalUrl);
    }

    // Добавить правило перенаправления
    @UseGuards(JwtAuthGuard)
    @Post('routes')
    async addRoute(
        @Body('resourceId') resourceId: string,
        @Body('internalUrl') internalUrl: string,
    ) {
        await this.routerService.addRoute(resourceId, internalUrl);
        return { message: 'Route added successfully' };
    }

    // Удалить правило перенаправления
    @UseGuards(JwtAuthGuard)
    @Delete('routes/:resourceId')
    async removeRoute(@Param('resourceId') resourceId: string) {
        await this.routerService.removeRoute(resourceId);
        return { message: 'Route removed successfully' };
    }
}
