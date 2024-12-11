# Используем официальный Node.js образ
FROM node:18-alpine

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --production

# Копируем исходный код
COPY . .

# Строим приложение
RUN npm run build

# Указываем порт
EXPOSE 3002

# Запускаем приложение
CMD ["node", "dist/main"]
