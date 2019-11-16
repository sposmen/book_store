module.exports = class WordCounter {

  constructor(cb) {
    this.lastChunk = '';
    this.counts = new Map();
    this.sizeKeys = new Map();
    this.data = '';
    this.cb = cb;
    this.chunkProcessor = this.chunkProcessor.bind(this);
    this.endProcess = this.endProcess.bind(this);
    this.addWord = this.addWord.bind(this);
  }

  run(streamer) {
    streamer.setEncoding('utf8');

    streamer
    .on('data', this.chunkProcessor)
    .on('end', this.endProcess);

  }

  chunkProcessor(chunk) {
    this.data += chunk;
    let words = chunk.match(/(\w+)/g);
    if (!words.length) {
      return;
    }

    if (this.lastChunk) {
      words[0] = this.lastChunk + words[0];
    }

    this.lastChunk = words.pop();
    words.forEach(this.addWord);
  }

  endProcess() {
    if (this.lastChunk) {
      this.addWord(this.lastChunk);
    }
    this.cb(null, this);
  }

  addWord(word) {
    if (!word || word.length < 4) {
      return;
    }

    word = word.toLowerCase();

    let wordSize = (this.counts.get(word) || 0) + 1;
    this.counts.set(word, wordSize);

    if (wordSize > 1) {
      this.sizeKeys.get(wordSize - 1).delete(word);
    }

    let sizeKey = this.sizeKeys.get(wordSize) || new Map();
    sizeKey.set(word, wordSize);

    this.sizeKeys.set(wordSize, sizeKey);
  }
};
