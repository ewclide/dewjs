// const path = require('path');
const DocumentGenerator = require('../src');
const docgen = new DocumentGenerator();

docgen.genereate('./scripts/docgen/test/docs', './scripts/docgen/test/md');