const natural = require('natural');

// Sentiment analysis function
function analyzeSentiment(text) {
    const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text);
    const score = analyzer.getSentiment(tokens);

    return {
        score,
        sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral',
        text
    };
}

// Route to analyze sentiment of a review
function analyzeReview(req, res) {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }
    const result = analyzeSentiment(text);
    res.status(200).json(result);
}

module.exports = { analyzeSentiment, analyzeReview };
