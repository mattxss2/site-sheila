const Transaction = require('../models/transactionModel');

async function createTransaction(req, res, next) {
  try {
    // Pega o ID do usuário autenticado via middleware
    const usuario_id = req.user.id; 
    const { categoria_id, descricao, valor, tipo, data } = req.body;

    const transaction = await Transaction.create({
      usuario_id,
      categoria_id,
      descricao,
      valor,
      tipo,
      data
    });
    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
}

async function listTransactions(req, res, next) {
  try {
    const usuario_id = req.user.id;
    // O .populate traz os dados da categoria junto, similar a um JOIN
    const transactions = await Transaction.find({ usuario_id })
      .populate('categoria_id', 'nome') 
      .sort({ data: -1 });

    // Ajuste simples para manter compatibilidade com o frontend antigo se necessário
    const formatted = transactions.map(t => ({
      ...t.toJSON(),
      categoria_nome: t.categoria_id ? t.categoria_id.nome : null
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
}

async function getTransaction(req, res, next) {
   // Implementação simples de busca por ID
   try {
     const t = await Transaction.findById(req.params.id);
     res.json(t);
   } catch(err) { next(err); }
}

async function updateTransaction(req, res, next) {
   try {
     const t = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
     res.json(t);
   } catch(err) { next(err); }
}

async function deleteTransaction(req, res, next) {
   try {
     await Transaction.findByIdAndDelete(req.params.id);
     res.json({ success: true });
   } catch(err) { next(err); }
}

module.exports = { 
  createTransaction, 
  listTransactions, 
  getTransaction, 
  updateTransaction, 
  deleteTransaction 
};