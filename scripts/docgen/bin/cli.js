#!/usr/bin/env node

const cli = require('commander');
const DocumentGenerator = require('../src');

cli
    .option('-i, --input <path>', 'path to folder of sources')
    .option('-o, --output <path>', 'path to folder of results')
    .option('-t, --type', 'type of output format');

const { input, output, type } = cli.parse(process.argv);
const docgen = new DocumentGenerator();

docgen.genereate(input, output, type);
