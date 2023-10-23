# api-node-ts
Trabalho pós graduação Puc Minas 2/2023

### Como criar uma api nodeJs em TypeScript:

1. Inicialize um projeto Node.js e configure o TypeScript:
```
npm init -y
npm install typescript ts-node @types/node
```

2.  Crie um arquivo tsconfig.json na raiz do projeto para configurar o TypeScript:
```
{
  "compilerOptions": {
    "target": "ES2019",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*.ts"]
}
```

3. Atualize seu arquivo package.json para definir um script de inicialização:
```
"scripts": {
  "start": "ts-node src/app.ts"
}
```

4. Crie um arquivo src/app.ts e defina a estrutura de código da sua API

5. Pacote utilizados nesse projeto:
```
npm install express @types/express
npm install node-cache
npm install --save-dev @types/object-hash
```

6. Iniciar o servidor:
```
npm start
```

## Projeto publicado na plataforma Replit:
[replit.com/](https://replit.com/)

Link API:

[https://api-node-ts.joaopertence22.repl.co/data](https://api-node-ts.joaopertence22.repl.co/data)
