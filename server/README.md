Création d'un projet express
Initialisation du projet
```bash	
- npm init --yes
- npm install express
- npm install --save-dev typescript @types/express ts-node
- npx tsc --init
- npm install nodemon
```
Configuration du fichier tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

Création du fichier src/index.ts
```typescript
import express from 'express';

const app = express();
const PORT = 3005;

app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

```

Ajout des scripts dans le fichier package.json
```json
{
  "scripts": {
    "start": "tsc && nodemon  src/main.ts",
    "build": "tsc"
  }
}
```

Installation Prisma (ORM) Connect BDD
```bash
- npm install @prisma/client
- npm install --save-dev prisma
- npm install mysql2
- npx prisma init
- npx prisma migrate dev --name init
- npx prisma generate
```

Ajout de la config dans le fichier prisma/schema.prisma
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Users {
  users_id   BigInt    @id @default(autoincrement()) @map("users_id")
  name       String
  email      String
  password   String   
}
```

Dans le fichier .env
```env
DATABASE_URL="mysql://username:password@hostname:port/bdd_name"
```

Exemple récupération des données
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

app.get('/users', async (req,res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        users_id: true,
        name: true,
        email: true,
      }
    });

    // Convertir les BigInt en chaînes de caractères
    const usersStringifiable = users.map(
      (user:{
        users_id: bigint;
        name: string;
        email: string;
      }) => ({
      ...user,
      users_id: user.users_id.toString()
    }));

    // Exemple 2

     const users2: Array<{
      users_id: bigint;
      name: string;
      email: string;
      status: string;
    }> = await prisma.$queryRaw`SELECT * FROM users`;

    const test = users2.map((user) => {
      return {
        users_id: user.users_id.toString(),
        name: user.name,
        email: user.email,
        status: user.status,
      }
    })

    res.json(usersStringifiable);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
```
