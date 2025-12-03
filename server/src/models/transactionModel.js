const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categoria_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  descricao: { type: String },
  valor: { type: Number, required: true },
  tipo: { type: String, enum: ['entrada', 'saida'], required: true },
  data: { type: Date, required: true, default: Date.now },
  criado_em: { type: Date, default: Date.now }
});

transactionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model('Transaction', transactionSchema);