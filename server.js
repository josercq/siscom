const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');

const DB_FILE = path.join(__dirname, 'db.json');
const JWT_SECRET = process.env.SISCOM_JWT_SECRET || 'SISCOM_DEV_SECRET';

function readDB() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch(e){ return { users:[], oportunidades:[], propostas:[], history:[] }; }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function addHistory(action) {
  const db = readDB();
  db.history = db.history || [];
  db.history.push(Object.assign({ id: 'h-' + Date.now(), timestamp: new Date().toISOString() }, action));
  writeDB(db);
}

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// multer storage for attachments (MVP: store in /uploads)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({ destination: uploadDir, filename: (req,file,cb)=> cb(null, Date.now() + '-' + file.originalname) });
const upload = multer({ storage });

// Auth helpers
function generateToken(user){
  return jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
}

function authMiddleware(req,res,next){
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Não autorizado' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Token inválido' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; next();
  } catch(e){ return res.status(401).json({ message: 'Token inválido' }); }
}

function requireRole(role){
  return (req,res,next)=>{ if (!req.user) return res.status(401).json({ message: 'Não autorizado' }); if (req.user.role !== role) return res.status(403).json({ message: 'Acesso negado' }); next(); }
}

// -------------------- ROUTES --------------------
// Register supplier via contact form
app.post('/api/fornecedores', (req,res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Nome e e-mail são obrigatórios' });
    const db = readDB();
    const exists = db.users.find(u=>u.email === email);
    const id = 'u-forn-' + Date.now();
    if (exists) {
      // store as contact only
      db.history.push({ id: 'c-' + Date.now(), type: 'contact', name, email, subject, message, createdAt: new Date().toISOString() });
      writeDB(db);
      return res.status(200).json({ message: 'Contato recebido' });
    }
    // create basic supplier user with random password (for MVP admin can reset)
    const passwordHash = bcrypt.hashSync('password', 10);
    const user = { id, name, email, passwordHash, role: 'fornecedor' };
    db.users.push(user);
    db.history.push({ id: 'c-' + Date.now(), type: 'register_fornecedor', name, email, subject, message, createdAt: new Date().toISOString() });
    writeDB(db);
    return res.status(201).json({ message: 'Fornecedor cadastrado', userId: id });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Erro interno' }); }
});

// Auth login
app.post('/api/auth/login', (req,res)=>{
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Credenciais inválidas' });
  const db = readDB();
  const user = db.users.find(u => u.email === username || u.email === username.toLowerCase());
  if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });
  if (!bcrypt.compareSync(password, user.passwordHash)) return res.status(401).json({ message: 'Senha incorreta' });
  const token = generateToken(user);
  addHistory({ type: 'login', userId: user.id });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// GET /api/me
app.get('/api/me', authMiddleware, (req,res)=>{
  const db = readDB();
  const u = db.users.find(x=>x.id === req.user.id) || req.user;
  res.json({ id: u.id, name: u.name, email: u.email, role: u.role });
});

// oportunidades: list/create
app.get('/api/oportunidades', (req,res)=>{
  try {
    const db = readDB();
    const status = (req.query.status || '').toLowerCase();
    const now = new Date();
    // update expired
    db.oportunidades = db.oportunidades.map(o=>{
      if (o.status === 'aberto' && new Date(o.deadline) < now) o.status = 'expirada';
      return o;
    });
    writeDB(db);
    let out = db.oportunidades;
    if (status) out = out.filter(o => (o.status||'').toLowerCase() === status);
    res.json(out);
  } catch(e){ console.error(e); res.status(500).json({ message: 'Erro interno' }); }
});

app.post('/api/oportunidades', authMiddleware, requireRole('apm'), (req,res)=>{
  try {
    const { title, description, deadline, school } = req.body;
    if (!title || !deadline || !school) return res.status(400).json({ message: 'Dados incompletos' });
    const db = readDB();
    const id = 'op-' + Date.now();
    const op = { id, title, description, deadline, school, status: 'aberto', createdBy: req.user.id };
    db.oportunidades.push(op);
    addHistory({ type: 'create_oportunidade', userId: req.user.id, oportunidadeId: id });
    writeDB(db);
    res.status(201).json(op);
  } catch(e){ console.error(e); res.status(500).json({ message: 'Erro interno' }); }
});

// propostas
app.get('/api/oportunidades/:id/propostas', authMiddleware, (req,res)=>{
  const db = readDB();
  const propostas = db.propostas.filter(p=>p.opportunityId === req.params.id);
  res.json(propostas);
});

app.post('/api/oportunidades/:id/propostas', authMiddleware, requireRole('fornecedor'), (req,res)=>{
  try {
    const { value, prazo, observations } = req.body;
    const db = readDB();
    const opportunity = db.oportunidades.find(o=>o.id === req.params.id);
    if (!opportunity) return res.status(404).json({ message: 'Oportunidade não encontrada' });
    if (opportunity.status !== 'aberto') return res.status(400).json({ message: 'Oportunidade não aceita propostas' });
    const id = 'p-' + Date.now();
    const p = { id, opportunityId: opportunity.id, supplierId: req.user.id, value, prazo, observations, createdAt: new Date().toISOString() };
    db.propostas.push(p);
    addHistory({ type: 'create_proposta', userId: req.user.id, propostaId: id, opportunityId: opportunity.id });
    writeDB(db);
    res.status(201).json(p);
  } catch(e){ console.error(e); res.status(500).json({ message: 'Erro interno' }); }
});

// escolher proposta
app.post('/api/oportunidades/:id/choose-proposal', authMiddleware, requireRole('apm'), (req,res)=>{
  try {
    const { proposalId } = req.body;
    const db = readDB();
    const op = db.oportunidades.find(o=>o.id === req.params.id);
    if (!op) return res.status(404).json({ message: 'Oportunidade não encontrada' });
    const prop = db.propostas.find(p=>p.id === proposalId && p.opportunityId === op.id);
    if (!prop) return res.status(404).json({ message: 'Proposta não encontrada' });
    op.chosenProposal = prop.id; op.status = 'escolhida';
    addHistory({ type: 'choose_proposal', userId: req.user.id, propostaId: prop.id, opportunityId: op.id });
    writeDB(db);
    res.json({ message: 'Proposta selecionada' });
  } catch(e){ console.error(e); res.status(500).json({ message: 'Erro interno' }); }
});

app.get('/api/history', authMiddleware, (req,res)=>{
  const db = readDB();
  res.json(db.history || []);
});

// Fallback - serve static files by express.static above

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log('SISCOM backend started on http://localhost:' + port));
