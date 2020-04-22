const express = require('express');
const server = express();
const router = express.Router();
const fs = require('fs');
const { uuid, isUuid } = require("uuidv4");

server.use(express.json({extended: true}));

const readFile = () => {
  const content = fs.readFileSync('./data/dados.json', 'utf-8');
  return JSON.parse(content);
}

const writeFile = (content) => {
  const updateFile = JSON.stringify(content)
  fs.writeFileSync('./data/dados.json', updateFile, 'utf-8');
}

router.get('/', (req, res) => {
  const content = readFile();
  res.send(content);
});

router.post('/', (req, res) => {
  const { name, email, phone } = req.body;
  const id = uuid();

  const currentContent = readFile();
  currentContent.push({ id, name, email, phone });
  
  writeFile(currentContent);

  res.send({ id, name, email, phone });

});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const currentContent = readFile();

  const selectItem = currentContent.findIndex(item => item.id === id);
  
  if (selectItem < 0) {
    return res.status(400).json({ error: 'Item not found' })
  };

  const { name: cName, email: cMail, phone: cPhone } = currentContent[selectItem];

  const newObject = {
    id,
    name: name ? name : cName,
    email: email ? email : cMail,
    phone: phone ? phone : cPhone,
  };

  currentContent[selectItem] = newObject;

  writeFile(currentContent);

  res.send(newObject);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const currentContent = readFile();
  
  const selectItem = currentContent.findIndex(item => item.id === id);
  
  if (selectItem < 0) {
    return res.status(400).json({ error: 'Item not found' })
  };

  currentContent.splice(selectItem, 1);

  writeFile(currentContent);

  res.status(204).send();

});

server.use(router);

server.listen(3000, () => {
  console.log('Rodando servidor');
});