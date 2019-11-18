// Stop Words from https://www.ranks.nl/stopwords
const stopWords = ['able','about','above','abst','accordance','according','accordingly','across','actually','added','affected','affecting','affects','after','afterwards','again','against','almost','alone','along','already','also','although','always','among','amongst','announce','another','anybody','anyhow','anymore','anyone','anything','anyway','anyways','anywhere','apparently','approximately','aren','arent','arise','around','aside','asking','auth','available','away','awfully','back','became','because','become','becomes','becoming','been','before','beforehand','begin','beginning','beginnings','begins','behind','being','believe','below','beside','besides','between','beyond','biol','both','brief','briefly','came','cannot','cause','causes','certain','certainly','come','comes','contain','containing','contains','could','couldnt','date','different','does','doing','done','down','downwards','during','each','effect','eight','eighty','either','else','elsewhere','ending','enough','especially','et-al','even','ever','every','everybody','everyone','everything','everywhere','except','fifth','first','five','followed','following','follows','former','formerly','forth','found','four','from','further','furthermore','gave','gets','getting','give','given','gives','giving','goes','gone','gotten','happens','hardly','have','having','hence','here','hereafter','hereby','herein','heres','hereupon','hers','herself','himself','hither','home','howbeit','however','hundred','immediate','immediately','importance','important','indeed','index','information','instead','into','invention','inward','itself','just','keep	keeps','kept','know','known','knows','largely','last','lately','later','latter','latterly','least','less','lest','lets','like','liked','likely','line','little','look','looking','looks','made','mainly','make','makes','many','maybe','mean','means','meantime','meanwhile','merely','might','million','miss','more','moreover','most','mostly','much','must','myself','name','namely','near','nearly','necessarily','necessary','need','needs','neither','never','nevertheless','next','nine','ninety','nobody','none','nonetheless','noone','normally','noted','nothing','nowhere','obtain','obtained','obviously','often','okay','omitted','once','ones','only','onto','other','others','otherwise','ought','ours','ourselves','outside','over','overall','owing','page','pages','part','particular','particularly','past','perhaps','placed','please','plus','poorly','possible','possibly','potentially','predominantly','present','previously','primarily','probably','promptly','proud','provides','quickly','quite','rather','readily','really','recent','recently','refs','regarding','regardless','regards','related','relatively','research','respectively','resulted','resulting','results','right','said','same','saying','says','section','seeing','seem','seemed','seeming','seems','seen','self','selves','sent','seven','several','shall','shed','shes','should','show','showed','shown','showns','shows','significant','significantly','similar','similarly','since','slightly','some','somebody','somehow','someone','somethan','something','sometime','sometimes','somewhat','somewhere','soon','sorry','specifically','specified','specify','specifying','still','stop','strongly','substantially','successfully','such','sufficiently','suggest','sure	t','take','taken','taking','tell','tends','than','thank','thanks','thanx','that','thats','their','theirs','them','themselves','then','thence','there','thereafter','thereby','thered','therefore','therein','thereof','therere','theres','thereto','thereupon','these','they','theyd','theyre','think','this','those','thou','though','thoughh','thousand','throug','through','throughout','thru','thus','together','took','toward','towards','tried','tries','truly','trying','twice','under','unfortunately','unless','unlike','unlikely','until','unto','upon','used','useful','usefully','usefulness','uses','using','usually','value','various','very','vols','want','wants','wasnt','welcome','went','were','werent','what','whatever','whats','when','whence','whenever','where','whereafter','whereas','whereby','wherein','wheres','whereupon','wherever','whether','which','while','whim','whither','whod','whoever','whole','whom','whomever','whos','whose','widely','willing','wish','with','within','without','wont','words','world','would','wouldnt','youd','your','youre','yours','yourself','yourselves','zero'];

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
    if (!word || word.length < 4 || stopWords.indexOf(word) >= 0) {
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
