import { Controller, All, Req, Res, HttpStatus, Post, Body, Delete, Param, UseGuards, Request as NJRequest } from '@nestjs/common';
import { RouterService } from './router.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import axios, { AxiosRequestConfig } from 'axios';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoutesDto } from './dto/routes.dto';

@Controller()
export class RouterController {
    constructor(private readonly routerService: RouterService) { }

    // Добавить правило перенаправления
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('routes')
    async addRoute(@Body() routesDto: RoutesDto) {
        await this.routerService.addRoute(routesDto.resourceId, routesDto.internalUrl);
        return { message: 'Route added successfully' };
    }

    // Удалить правило перенаправления
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete('routes/:resourceId')
    async removeRoute(@Param('resourceId') resourceId: string) {
        await this.routerService.removeRoute(resourceId);
        return { message: 'Route removed successfully' };
    }

    // Обработка всех входящих запросов
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @All('*')
    async handleRequest(@NJRequest() njreq, @Req() req: Request, @Res() res: Response) {
        try {
            // Извлекаем `resourceId` из пути
            const resourceId = req.params['0'].split('/')[0]; // Предполагается формат: /resource_id/some-path
            const userId = njreq.user.userId; // Данные пользователя из JWT

            // Проверяем доступ
            const isAllowed = await this.routerService.checkAccess(userId as string, resourceId);
            if (!isAllowed) {
                return res.status(HttpStatus.FORBIDDEN).send('Forbidden');
            }

            // Получаем внутренний URL ресурса
            const internalUrl = await this.routerService.getInternalUrl(resourceId);
            if (!internalUrl) {
                return res.status(HttpStatus.NOT_FOUND).send('Resource not found');
            }

            // Собираем данные для перенаправления
            const axiosConfig: AxiosRequestConfig = {
                method: req.method,
                url: `${internalUrl}${req.url.substring(resourceId.length + 1)}`, // Добавляем остальную часть пути
                headers: {
                    ...req.headers, // Копируем все заголовки
                    host: undefined, // Удаляем `host`, чтобы избежать конфликтов
                },
                data: req.body, // Передаём тело запроса
                params: req.query, // Передаём параметры запроса
                responseType: 'stream', // Потоковый ответ
            };

            // Перенаправляем запрос на внутренний ресурс
            const internalResponse = await axios(axiosConfig);

            // Передаём ответ обратно клиенту
            res.status(internalResponse.status);
            internalResponse.data.pipe(res);
        } catch (error) {
            // Обрабатываем ошибки
            console.error('Error forwarding request:', error);

            if (error.response) {
                // Ошибка от внутреннего ресурса
                return res.status(error.response.status).send(error.response.data);
            }

            // Ошибка уровня сети или настроек
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal server error');
        }
    }
}
