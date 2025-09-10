const AIIntentClassifier = require('./services/ai-intent-classifier');

const classifier = new AIIntentClassifier();

console.log('🎯 Testing Specific Problem Cases\n');

const testCases = [
    "Put this in my basket",
    "I bought something last week but haven't received it",
    "Keep this item"
];

testCases.forEach((message, index) => {
    console.log(`${index + 1}. "${message}"`);
    const intent = classifier.detectIntent(message);
    console.log(`   → ${intent}\n`);
});
