const Transaction = require('../models/transactionModel');
const mongoose = require('mongoose');

async function getBalance(req, res, next) {
  try {
    const usuario_id = req.user.id;
    const result = await Transaction.aggregate([
      { $match: { usuario_id: new mongoose.Types.ObjectId(usuario_id) } },
      { 
        $group: { 
          _id: null, 
          totalEntrada: { $sum: { $cond: [{ $eq: ["$tipo", "entrada"] }, "$valor", 0] } },
          totalSaida: { $sum: { $cond: [{ $eq: ["$tipo", "saida"] }, "$valor", 0] } }
        } 
      }
    ]);

    const saldo = result.length > 0 ? (result[0].totalEntrada - result[0].totalSaida) : 0;
    res.json({ saldo: saldo.toFixed(2) });
  } catch (err) {
    next(err);
  }
}

async function summaryMonth(req, res, next) {
  // Lógica simplificada: filtrar no código ou criar aggregate complexo.
  // Vou usar aggregate simples para manter performance.
  try {
    const usuario_id = req.user.id;
    const now = new Date();
    const year = parseInt(req.query.year) || now.getFullYear();
    const month = parseInt(req.query.month) || (now.getMonth() + 1);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59); // Último dia do mês

    const result = await Transaction.aggregate([
      { 
        $match: { 
          usuario_id: new mongoose.Types.ObjectId(usuario_id),
          data: { $gte: startDate, $lte: endDate }
        } 
      },
      {
        $group: {
          _id: "$tipo",
          total: { $sum: "$valor" }
        }
      }
    ]);

    const summary = { entrada: 0, saida: 0 };
    result.forEach(item => {
      summary[item._id] = item.total.toFixed(2);
    });

    res.json(summary);
  } catch (err) {
    next(err);
  }
}

module.exports = { getBalance, summaryMonth };