const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  occasion: { type: String, required: true },
  imageUrl: { type: String, required: true },
  analysis: { type: Object, required: true } // We store the entire JSON object from Gemini
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
