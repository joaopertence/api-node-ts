import express from 'express';
import NodeCache from 'node-cache';
import objectHash from 'object-hash';

const app = express();
const port = 3000;

// Tempo cache 1 hora
const cache = new NodeCache({stdTTL: 60 * 60, checkperiod: 0});

interface IDadosIniciais {
  pessoas: { id: number; nome: string }[];
  carros: { id: number; modelo: string }[];
  animais: { id: number; nome: string }[];
}

// Dados iniciais em cache
const dadosIniciais: IDadosIniciais = {
  pessoas: [{ id: 1, nome: "Marcelo" }, { id: 2, nome: "João" }, { id: 3, nome: "Maria" }],
  carros: [{ id: 1, modelo: "Fusca" }, { id: 2, modelo: "Gol" }, { id: 3, modelo: "Palio" }],
  animais: [{ id: 1, nome: "Cachorro" }, { id: 2, nome: "Gato" }, { id: 3, nome: "Papagaio" }],
};

// Cálculo do hash dos dados iniciais
const hashDadosIniciais = objectHash.sha1(dadosIniciais);

// Armazene os dados iniciais em cache com um ETag com base no hash
cache.set<IDadosIniciais>('cachedData', dadosIniciais);
cache.set('cachedDataETag', hashDadosIniciais);

app.use(express.json());

/**
 * Função para obter um tipo de dados específico (pessoas, carros, animais)
 * keyof extrai todas as chaves (nomes de propriedades) do tipo de dado 
 * @param dataType IDadosIniciais
 * @returns Type "pessoas" ou "carros" ou "animais"
 */
function getDataType(dataType: keyof IDadosIniciais) {
  return (req: express.Request, res: express.Response) => {
    const cachedData = cache.get<IDadosIniciais>('cachedData');
    
    if (!cachedData || !cachedData[dataType]) {
      res.status(404).json({ error: 'Dados não encontrados' });
    } else {
      res.status(200).json(cachedData[dataType]);
    }

  };
}

// GET: Rota para obter todos os dados em cache (Solicitação GET)
app.get('/data', (req, res) => {
  // Obtenha o ETag dos dados em cache
  const cachedDataETag = cache.get('cachedDataETag');

  if (!cachedDataETag) {
    // Dados em cache não existem
    res.status(200).json({ message: 'Cache vazio' });

  } else {
    // Verifique o cabeçalho If-None-Match da solicitação
    const requestDataETag = req.header('If-None-Match');

    if (requestDataETag === cachedDataETag) {
      // Dados em cache não mudaram
      res.status(304).end();
    } else {
      // Dados em cache estão desatualizados
      const cachedData = cache.get<IDadosIniciais>('cachedData');

      // Atualize o cabeçalho ETag com a nova versão de hash
      res.setHeader('ETag', String(cachedDataETag));
      res.status(200).json(cachedData);
    }
  }
});

// PUT: Rota para atualizar os dados em cache (Solicitação PUT)
app.put('/data', (req, res) => {
  const updatedData: IDadosIniciais = req.body;

  if (updatedData) {
    // Atualize os dados em cache
    const updatedDataHash = objectHash.sha1(updatedData);
    cache.set<IDadosIniciais>('cachedData', updatedData);
    cache.set('cachedDataETag', updatedDataHash);

    res.status(200).json({ message: 'Dados atualizados com sucesso' });
  } else {
    res.status(400).json({ error: 'Dados inválidos' });
  }
});

// PONTO EXTRA:

// GET: Rota para obter pessoas
app.get('/pessoas', getDataType('pessoas'));

// GET: Rota para obter carros
app.get('/carros', getDataType('carros'));

// GET: Rota para obter animais
app.get('/animais', getDataType('animais'));

// GET: Rota para obter pessoa by ID
app.get('/pessoas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const cachedData = cache.get<IDadosIniciais>('cachedData');

  if (!cachedData || !cachedData.pessoas) {
    res.status(404).json({ error: 'Dados não encontrados' });
  } else {
    const pessoa = cachedData.pessoas.find((p) => p.id === id);
    if (pessoa) {
      res.status(200).json(pessoa);
    } else {
      res.status(404).json({ error: 'Pessoa não encontrada' });
    }
  }
});

// GET: Rota para obter carro by ID
app.get('/carros/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const cachedData = cache.get<IDadosIniciais>('cachedData');

  if (!cachedData || !cachedData.carros) {
    res.status(404).json({ error: 'Dados não encontrados' });
  } else {
    const carro = cachedData.carros.find((c) => c.id === id);
    if (carro) {
      res.status(200).json(carro);
    } else {
      res.status(404).json({ error: 'Carro não encontrado' });
    }
  }
});

// GET: Rota para obter animal by ID
app.get('/animais/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const cachedData = cache.get<IDadosIniciais>('cachedData');
  
  if (!cachedData || !cachedData.animais) {
    res.status(404).json({ error: 'Dados não encontrados' });
  } else {
    const animal = cachedData.animais.find((a) => a.id === id);
    if (animal) {
      res.status(200).json(animal);
    } else {
      res.status(404).json({ error: 'Animal não encontrado' });
    }
  }
});

// Serviço API: http://localhost:3000
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}/`);
});
