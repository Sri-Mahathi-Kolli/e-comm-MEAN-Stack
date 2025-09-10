const natural = require('natural');
const compromise = require('compromise');

class AIIntentClassifier {
    constructor() {
        // Initialize stemmer for better word matching
        this.stemmer = natural.PorterStemmer;
        
        // Training data for intent classification
        this.trainingData = {
            'product_search': [
                'find products', 'search items', 'show me products', 'browse catalog',
                'what products do you have', 'available items', 'product list',
                'skincare products', 'beauty items', 'cosmetics', 'moisturizer',
                'find moisturizer', 'search for cream', 'show skincare',
                'what do you sell', 'product catalog', 'items for sale',
                'looking for products', 'want to buy something', 'shopping',
                'need products', 'show inventory', 'available products',
                'see your products', 'what you have for sale', 'see products',
                'items available', 'what items', 'show me what you have'
            ],
            'add_to_cart': [
                'add to cart', 'put in cart', 'buy this', 'purchase item',
                'add item to shopping cart', 'buy now', 'purchase this product',
                'want to buy', 'add product', 'cart this item',
                'buy product', 'purchase now', 'add this', 'want this item',
                'put this in basket', 'add to basket', 'put in my basket',
                'place in cart', 'throw in cart', 'toss in cart'
            ],
            'add_to_wishlist': [
                'add to wishlist', 'save for later', 'add to favorites',
                'bookmark this', 'save item', 'add to saved items',
                'wishlist this', 'save product', 'add to wish list',
                'favorite this', 'keep for later', 'save to favorites',
                'keep this item', 'hold this', 'remember this'
            ],
            'cart_info': [
                'show cart', 'view cart', 'my cart', 'shopping cart',
                'what is in my cart', 'cart contents', 'check cart',
                'cart items', 'my shopping cart', 'cart details',
                'show me my cart', 'view my cart', 'see my cart',
                'display cart', 'cart status', 'items in cart',
                'what\'s in my cart', 'cart summary', 'review cart'
            ],
            'product_details': [
                'tell me about', 'more info about', 'product details',
                'tell me more about', 'describe this product', 'product info',
                'how to use', 'usage instructions', 'product usage',
                'ingredients', 'specifications', 'features',
                'product description', 'more details', 'product guide',
                'how to use this product', 'tell me more', 'product benefits',
                'product information', 'what is this product', 'explain product'
            ],
            'wishlist_remove': [
                'remove from wishlist', 'delete from wishlist', 'remove wishlist item',
                'take off wishlist', 'remove from saved', 'delete saved item',
                'remove saved product', 'unsave product', 'remove favorite',
                'delete favorite', 'remove from favorites', 'take off saved'
            ],
            'receipt_download': [
                'download receipt', 'get receipt', 'receipt download',
                'download invoice', 'get invoice', 'invoice download',
                'receipt copy', 'invoice copy', 'download payment receipt',
                'get payment receipt', 'order receipt', 'transaction receipt'
            ],
            'wishlist_info': [
                'show wishlist', 'my wishlist', 'view wishlist', 'saved items',
                'my favorites', 'wishlist items', 'saved products',
                'favorite items', 'my saved items', 'check wishlist',
                'view my wishlist', 'show my wishlist', 'display wishlist',
                'list my favorites', 'see my wishlist', 'wishlist contents'
            ],
            'order_status': [
                'my orders', 'order history', 'check orders', 'track order',
                'order status', 'purchase history', 'recent orders',
                'show orders', 'my purchases', 'order tracking',
                'delivery status', 'shipment status', 'where is my order',
                'what I bought', 'show me what I bought', 'purchase record',
                'buying history', 'check my purchase', 'haven\'t received',
                'order confirmation', 'receipt',
                'I bought something but haven\'t received', 'didn\'t receive my order',
                'ordered something but no delivery', 'where is my purchase',
                'bought last week haven\'t received', 'order not arrived'
            ],
            'order_details': [
                'order details', 'view order details', 'show order details',
                'order information', 'order info', 'detailed order',
                'full order details', 'complete order info', 'order summary',
                'view order', 'show order', 'order contents', 'what\'s in my order',
                'order breakdown', 'order items', 'order products'
            ],
            'payment_info': [
                'payment methods', 'how to pay', 'payment options',
                'payment history', 'billing info', 'transaction history',
                'refund status', 'payment status', 'card payments',
                'check payment', 'payment details', 'billing details',
                'view payment history', 'show payment history', 'my payments',
                'show my payments', 'view payments', 'payment records',
                'check payments', 'billing history', 'transaction records'
            ],
            'payment_issues': [
                'payment problem', 'payment issue', 'payment not working',
                'payment failed', 'payment error', 'transaction failed',
                'card declined', 'payment declined', 'billing problem',
                'billing issue', 'can\'t pay', 'payment trouble',
                'transaction error', 'payment not going through',
                'payment processing error', 'payment gateway error',
                'card not working', 'payment system down',
                'can\'t complete payment', 'payment unsuccessful',
                'billing error', 'transaction problem', 'payment blocked',
                'payment rejected', 'charge issue', 'billing trouble'
            ],
            'shipping_info': [
                'shipping details', 'delivery info', 'shipping cost',
                'delivery time', 'shipping options', 'delivery methods',
                'how long shipping', 'shipping fees', 'delivery charges',
                'when will it arrive', 'shipping time', 'delivery estimate',
                'track my package', 'where is my package', 'shipping status',
                'delivery date', 'expected delivery', 'how long to ship',
                'shipping cost', 'free shipping', 'express delivery',
                'overnight shipping', 'shipping speed', 'delivery options'
            ],
            'contact_info': [
                'contact us', 'customer service', 'support', 'help desk',
                'get help', 'contact support', 'customer care',
                'support team', 'contact details', 'phone number',
                'how to contact', 'reach out', 'get in touch',
                'support hours', 'contact hours', 'customer support',
                'help center', 'assistance', 'support center'
            ],
            'contact_action': [
                'send email', 'email support', 'report issue', 'report problem',
                'file complaint', 'check faq', 'frequently asked questions',
                'submit ticket', 'contact form', 'email us', 'live chat',
                'chat support', 'phone support', 'call support',
                'speak to agent', 'talk to someone', 'human support',
                'customer service chat', 'technical support', 'billing support'
            ],
            'return_policy': [
                'return policy', 'refund policy', 'return item', 'refund inquiry',
                'how to return', 'exchange policy', 'return process',
                'refund process', 'can I return', 'return guidelines',
                'what if I want to return', 'return something I bought',
                'bought wrong item', 'need to send back', 'return this product',
                'want my money back', 'can I get refund', 'exchange this item',
                'return an order', 'return within days', 'return timeframe',
                'return product', 'money back guarantee', 'return merchandise',
                'exchange product', 'wrong size', 'defective item',
                'start return process', 'initiate return', 'begin return',
                'refund inquiry', 'refund enquiry', 'check refund status',
                'refund request', 'request refund', 'get my money back'
            ],
            'payment_update': [
                'update payment method', 'change payment method', 'new payment method',
                'add payment method', 'edit payment info', 'update card',
                'change card', 'new card', 'payment method update',
                'update billing info', 'change billing', 'edit billing',
                'update payment details', 'change payment details',
                'add new card', 'remove payment method', 'delete card',
                'update credit card', 'change credit card', 'payment settings'
            ],
            'address_change': [
                'change address', 'update address', 'new address',
                'shipping address', 'billing address', 'edit address',
                'address update', 'move to new address', 'relocate',
                'change delivery address', 'update shipping address',
                'modify address', 'address change', 'new location',
                'update location', 'change my address', 'address settings',
                'delivery location', 'shipping location', 'home address',
                'update billing address', 'change billing address', 'billing location',
                'go to address book', 'address book', 'manage addresses',
                'edit billing address', 'modify billing address'
            ],
            'account_help': [
                'account settings', 'profile settings', 'login help',
                'password reset', 'account issues', 'update profile',
                'change password', 'account details', 'my account'
            ],
            'checkout': [
                'checkout', 'proceed to checkout', 'complete purchase',
                'finalize order', 'place order', 'complete order',
                'finish buying', 'pay now', 'complete payment'
            ],
            'greeting': [
                'hello', 'hi', 'hey', 'good morning', 'good afternoon',
                'good evening', 'greetings', 'howdy', 'what\'s up'
            ],
            'help': [
                'help', 'help me', 'assist me', 'guide me', 'support',
                'what can you do', 'how does this work', 'need assistance'
            ],
            'affirmative': [
                'yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'alright',
                'correct', 'right', 'exactly', 'absolutely', 'definitely'
            ]
        };

        // Initialize classifiers for each intent
        this.classifiers = {};
        this.initializeClassifiers();
        
        // Context tracking for better understanding
        this.conversationContext = {
            lastIntent: null,
            lastEntities: [],
            sessionData: {}
        };
    }

    initializeClassifiers() {
        // Create a classifier for each intent
        Object.keys(this.trainingData).forEach(intent => {
            const classifier = new natural.LogisticRegressionClassifier();
            
            // Add positive examples
            this.trainingData[intent].forEach(phrase => {
                classifier.addDocument(phrase, intent);
            });
            
            // Add some negative examples from other intents
            Object.keys(this.trainingData).forEach(otherIntent => {
                if (otherIntent !== intent) {
                    // Add a few examples as negative
                    this.trainingData[otherIntent].slice(0, 3).forEach(phrase => {
                        classifier.addDocument(phrase, 'not_' + intent);
                    });
                }
            });
            
            classifier.train();
            this.classifiers[intent] = classifier;
        });
    }

    // Enhanced entity extraction
    extractEntities(message) {
        const doc = compromise(message);
        const entities = {
            productId: null,
            productNames: [],
            numbers: [],
            emails: [],
            actions: []
        };

        // Extract product IDs (24-character hex strings)
        const productIdMatch = message.match(/[a-f0-9]{24}/i);
        if (productIdMatch) {
            entities.productId = productIdMatch[0];
        }

        // Extract product names/nouns
        entities.productNames = doc.nouns().out('array');
        
        // Extract numbers
        entities.numbers = doc.values().out('array');
        
        // Extract actions/verbs
        entities.actions = doc.verbs().out('array');

        return entities;
    }

    // Calculate semantic similarity
    calculateSimilarity(input, trainingPhrase) {
        const inputTokens = natural.WordTokenizer.prototype.tokenize(input.toLowerCase());
        const phraseTokens = natural.WordTokenizer.prototype.tokenize(trainingPhrase.toLowerCase());
        
        // Use Jaccard distance for similarity
        const distance = natural.JaroWinklerDistance(input.toLowerCase(), trainingPhrase.toLowerCase());
        return distance;
    }

    // AI-powered intent detection
    detectIntent(message) {
        console.log('🧠 AI Intent Detection for:', message);
        
        const normalizedMessage = message.toLowerCase().trim();
        const entities = this.extractEntities(message);
        
        // Score each intent
        const intentScores = {};
        
        Object.keys(this.trainingData).forEach(intent => {
            let maxScore = 0;
            let bestMatch = '';
            
            // Check against all training phrases for this intent
            this.trainingData[intent].forEach(phrase => {
                const similarity = this.calculateSimilarity(normalizedMessage, phrase);
                
                // Also check if key terms from the phrase appear in the message
                const phraseWords = phrase.split(' ');
                const messageWords = normalizedMessage.split(' ');
                const wordMatches = phraseWords.filter(word => 
                    messageWords.some(mWord => 
                        this.stemmer.stem(word) === this.stemmer.stem(mWord) ||
                        mWord.includes(word) || word.includes(mWord)
                    )
                ).length;
                
                const wordScore = wordMatches / phraseWords.length;
                const combinedScore = (similarity * 0.7) + (wordScore * 0.3);
                
                if (combinedScore > maxScore) {
                    maxScore = combinedScore;
                    bestMatch = phrase;
                }
            });
            
            intentScores[intent] = {
                score: maxScore,
                confidence: maxScore,
                bestMatch: bestMatch
            };
        });

        // Enhanced scoring with context
        this.enhanceScoresWithContext(intentScores, entities, normalizedMessage);
        
        // Find the best intent
        const sortedIntents = Object.entries(intentScores)
            .sort(([,a], [,b]) => b.score - a.score);
        
        const bestIntent = sortedIntents[0];
        const confidence = Math.min(bestIntent[1].score, 1.0); // Normalize confidence to max 1.0
        
        console.log('🎯 AI Analysis:');
        console.log('Top 3 intents:', sortedIntents.slice(0, 3).map(([intent, data]) => 
            `${intent}: ${(data.score * 100).toFixed(1)}%`
        ));
        console.log('Entities found:', entities);
        console.log('Selected intent:', bestIntent[0], 'with confidence:', (confidence * 100).toFixed(1) + '%');
        
        // If confidence is too low, return unknown
        if (confidence < 0.4) {
            console.log('⚠️ Low confidence, returning unknown intent');
            return 'unknown';
        }
        
        // Update context
        this.conversationContext.lastIntent = bestIntent[0];
        this.conversationContext.lastEntities = entities;
        
        return bestIntent[0];
    }

    // Enhance scores based on context and entities
    enhanceScoresWithContext(intentScores, entities, message) {
        // Keyword boosting for specific intents
        const keywordBoosts = {
            'return_policy': ['return', 'refund', 'money back', 'exchange', 'send back', "doesn't fit"],
            'shipping_info': ['shipping', 'delivery', 'ship', 'deliver', 'track', 'package', 'shipping options', 'shipping cost'],
            'add_to_cart': ['add to cart', 'buy', 'purchase', 'cart', 'basket', 'put in', 'put this in'],
            'add_to_wishlist': ['wishlist', 'save', 'favorite', 'bookmark', 'keep this', 'keep for later'],
            'wishlist_info': ['view wishlist', 'my wishlist', 'show wishlist', 'check wishlist', 'view my wishlist', 'display wishlist'],
            'greeting': ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
            'order_status': ['order', 'track order', 'order status', 'my orders', 'purchase history', 'what I bought', 'haven\'t received', 'bought something', 'didn\'t receive', 'not arrived'],
            'product_search': ['see products', 'show me', 'available', 'what you have', 'items', 'for sale'],
            'help': ['help', 'assistance', 'confused', 'need help'],
            'payment_info': ['payment', 'payments', 'payment history', 'transaction', 'view payment', 'show payment', 'my payments'],
            'address_change': ['update address', 'change address', 'billing address', 'shipping address', 'address book', 'update billing', 'change billing'],
            'contact_info': ['contact', 'support', 'help desk', 'customer service', 'hours', 'support hours', 'business hours', 'store hours'],
            'contact_action': ['contact support about', 'support about', 'help with order', 'order issue'],
            'payment_update': ['update payment', 'change payment', 'update payment method', 'change payment method']
        };

        // Strong negative keywords to prevent misclassification
        const negativeKeywords = {
            'greeting': ['return', 'shipping', 'purchase', 'cart', 'wishlist', 'order', 'track', 'package', 'payment', 'billing', 'view payment', 'payment history'],
            'product_search': ['return', 'shipping', 'track', 'order status', 'payment', 'billing', 'transaction'],
            'add_to_wishlist': ['view wishlist', 'show wishlist', 'my wishlist', 'check wishlist', 'display wishlist']
        };

        Object.keys(keywordBoosts).forEach(intent => {
            const keywords = keywordBoosts[intent];
            const hasKeyword = keywords.some(keyword => message.includes(keyword));
            if (hasKeyword) {
                intentScores[intent].score *= 2.2; // Strong boost for keyword matches
            }
        });

        // Apply negative scoring for mismatched contexts
        Object.keys(negativeKeywords).forEach(intent => {
            const negatives = negativeKeywords[intent];
            const hasNegative = negatives.some(keyword => message.includes(keyword));
            if (hasNegative) {
                intentScores[intent].score *= 0.3; // Strong penalty for negative matches
            }
        });

        // Boost cart-related intents if product ID is found
        if (entities.productId) {
            if (message.includes('cart')) {
                intentScores.add_to_cart.score *= 1.5;
            }
            if (message.includes('wishlist') || message.includes('save') || message.includes('favorite')) {
                intentScores.add_to_wishlist.score *= 1.5;
            }
        }

        // Boost product search if no specific action is mentioned
        if (!entities.actions.length && entities.productNames.length) {
            intentScores.product_search.score *= 1.2;
        }

        // Context-based boosting
        if (this.conversationContext.lastIntent) {
            // If last intent was product_search, boost cart/wishlist actions
            if (this.conversationContext.lastIntent === 'product_search') {
                intentScores.add_to_cart.score *= 1.2;
                intentScores.add_to_wishlist.score *= 1.2;
            }
        }

        // Specific pattern matching boosts
        if (message.includes('add') && message.includes('cart')) {
            intentScores.add_to_cart.score *= 2.0;
        }
        if (message.includes('add') && (message.includes('wishlist') || message.includes('wish list'))) {
            intentScores.add_to_wishlist.score *= 2.0;
        }
        
        // Billing address vs payment info distinction
        if ((message.includes('update') || message.includes('change')) && message.includes('billing') && message.includes('address')) {
            intentScores.address_change.score *= 3.0;
            intentScores.payment_info.score *= 0.2; // Strong penalty for payment_info
        }
        
        // Payment method updates vs payment info distinction
        if ((message.includes('update') || message.includes('change')) && message.includes('payment') && (message.includes('method') || message.includes('card'))) {
            intentScores.payment_update.score *= 3.0;
            intentScores.payment_info.score *= 0.3; // Reduce payment_info for update actions
        }
        
        // Hours/time related queries
        if (message.includes('hours') || message.includes('time') || (message.includes('check') && message.includes('hours'))) {
            intentScores.contact_info.score *= 2.5;
            intentScores.checkout.score *= 0.2; // Strong penalty for checkout
        }
        
        // Cart quantity management
        if ((message.includes('update') || message.includes('change')) && (message.includes('quantity') || message.includes('quantities') || message.includes('amount'))) {
            intentScores.cart_info.score *= 2.5;
            intentScores.address_change.score *= 0.2; // Reduce address_change for quantity updates
        }
        
        // Contact support about orders vs regular order status
        if (message.includes('contact') && message.includes('support') && message.includes('order')) {
            intentScores.contact_action.score *= 2.5;
            intentScores.order_status.score *= 0.4; // Reduce order_status for contact queries
        }
        
        // Specific cart viewing vs adding distinctions
        if ((message.includes('view') || message.includes('show') || message.includes('see') || message.includes('check')) && message.includes('cart')) {
            intentScores.cart_info.score *= 2.5;
            intentScores.add_to_cart.score *= 0.3; // Reduce add_to_cart score for viewing actions
        }
        if (message.includes('my cart') || message.includes('my shopping cart')) {
            intentScores.cart_info.score *= 2.0;
            intentScores.add_to_cart.score *= 0.5;
        }
        
        if (message.includes('my') && message.includes('order')) {
            intentScores.order_status.score *= 2.0;
        }
    }

    // Get conversation context
    getContext() {
        return this.conversationContext;
    }

    // Update context
    updateContext(intent, entities) {
        this.conversationContext.lastIntent = intent;
        this.conversationContext.lastEntities = entities;
    }
}

module.exports = AIIntentClassifier;
