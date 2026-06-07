# Imagem base oficial do Node.js
FROM node:18-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências de produção
RUN npm install --production

# Copiar o restante do código
COPY . .

# Expor a porta da aplicação
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
