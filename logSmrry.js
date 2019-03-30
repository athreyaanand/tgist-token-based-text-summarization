console.log("Hello World!");

var submitButton = document.getElementById("submit");
    submitButton.addEventListener("click", summarize, false);

function summarize() {
    var n = 8;
    var chatLog = document.getElementById("logTxt").value;
    var sentenceMap = getSentenceRanks(chatLog);
    var bestSentences = getNBestSentences(n, sentenceMap);
    console.log("BEST ", n, "SENTENCES: ", bestSentences);
}

// returns map of all sentences mapped to corresponding score
function getSentenceRanks(chatLog) {
    // Split content by new line --> arr of sentences
    // TODO: lemmatize before splitting by new line
    // TODO: plausibly split into individual sentences
    sentences = chatLog.split(/\r?\n/);
    var sentenceCount = sentences.length;

    // //create 2D array in to compare intersect with every other sentence
    // var values = new Array(sentenceCount);
    // for (var i = 0; i < sentenceCount; i++) {
    //     values[i] = new Array(sentenceCount);
    // }

    // for (var i = 0; i < sentenceCount; i++) {
    //     for (var j = 0; j < sentenceCount; j++) {
    //         //average number of words used to normalize score within intersection\
    //         var normalize = (sentences[i].split(' ').length + sentences[j].split(' ').length) / 2
    //         values[i][j] = getSentenceIntersect(sentences[i].substring(sentences[i].indexOf(':') + 1), sentences[j].substring(sentences[j].indexOf(':') + 1)).length / normalize;
    //     }
    // }

    // // DEBUGGING PURPOSES ONLY
    // for (var i = 0; i < sentenceCount; i++) {
    //     for (var j = 0; j < sentenceCount; j++) {
    //         console.log("Comparing Sentences:\n\t" + sentences[i] + "\n\t" + sentences[j] + "\n\tRESULT SCORE: " + values[i][j]);
    //     }
    // }

    // // Maps total score to specific sentences
    // sentencesDict = new Map();
    // for (var i = 0; i < sentenceCount; i++) {
    //     var score = 0;
    //     for (var j = 0; j < sentenceCount; j++) {
    //         // ignore duplicate sentences
    //         if (i == j) {
    //             continue;
    //         } else {
    //             score += values[i][j];
    //         }
    //     }
    //     sentencesDict.set(sentences[i], score);
    // }
    // return sentencesDict;

    sentencesDict = new Map();
    var wordMap = createWordMap(chatLog);

    for (var i = 0; i < sentenceCount; i++) {
        // init score for sentence 0
        var score = 0;

        // get words within sentence
        var words = sentences[i].match(/\w+/g);
        // iterate through sentence words and add score through frequency
        for (var j = 0; j < words.length; j++) {
            score += wordMap.get(words[j]);
        }

        sentencesDict.set(sentences[i], score/words.length);
    }

    return sentencesDict;7
}

// calculates intersect values of any number of parameter sentences 
// returns array of keywords
function getSentenceIntersect() {
    var set = {};
   [].forEach.call(arguments, function(a,i){
     var tokens = a.match(/\w+/g);
     if (!i) {
       tokens.forEach(function(t){ set[t]=1 });
     } else {
       for (var k in set){
         if (tokens.indexOf(k)<0) delete set[k];
       }
     }
   });
   return Object.keys(set)
}

// returns a map of every word in text along with frequency
// returned words sorted by increasing frequency
function createWordMap(logTxt) {
    var words = logTxt.match(/\w+/g);
    var wordMap = new Map();
    words.forEach(word => {
        wordMap.set(word, (wordMap.get(word) || 0) + 1);
    });
    return new Map([...wordMap.entries()].sort((a, b) => b[1] - a[1]));
}

//returns n best sentence within dictionary
function getNBestSentences(n, sentenceMap) {
    // TODO: add edge cases (less than two sentences, etc.)

    const sortedSentenceMap = new Map([...sentenceMap.entries()].sort((a, b) => b[1] - a[1]));
    const sortedSentences = Array.from(sortedSentenceMap.keys());

    var nSortedSentences = new Array(n);
    for (var i = 0; i < n; i++) {
        nSortedSentences[i] = sortedSentences[i];
    }

    return nSortedSentences;
}