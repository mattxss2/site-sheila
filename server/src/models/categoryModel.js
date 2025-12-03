const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  nome: { type: String, required: true },
  tipo: { type: String, enum: ['entrada', 'saida'], required: true },
  criado_em: { type: Date, default: Date.now }
});

categorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model('Category', categorySchema);