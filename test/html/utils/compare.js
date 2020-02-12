import pixelmatch from 'pixelmatch';
import nodePath from 'path';
import fs from 'fs';
import { PNG } from 'pngjs';

const isExists = name => fs.existsSync(name);
const getRawImage = (src) => PNG.sync.read(fs.readFileSync(nodePath.resolve(src)));
const writeImage = (src, image) => fs.writeFileSync(provideFolder(src), PNG.sync.write(image));

function provideFolder(filePath) {
    const resolved = nodePath.resolve(filePath);
    if (isExists(resolved)) return resolved;

    const { dir } = nodePath.parse(resolved);
    let path = '';

    dir.split('/').forEach(subDir => {
        if (!subDir) return;
        path += '/' + subDir;
        if (isExists(path)) return;
        fs.mkdirSync(path);
    });

    return resolved;
}

export default function compareImages({ etalon, work, diff, ...options }, callback = () => {}) {
    const etalonImage = getRawImage(etalon)
    const workImage = getRawImage(work);
    const { width, height } = etalonImage;
    const diffImage = new PNG({ width, height });

    const matchOptions = {
        threshold: 0.01,
        includeAA: false,
        alpha: 0.5,
        aaColor: [0, 255, 0],
        diffColor: [255, 0, 255],
        ...options
    };

    const diffPixels = pixelmatch(
        etalonImage.data,
        workImage.data,
        diffImage.data,
        width,
        height,
        matchOptions
    );

    const difference = diffPixels / (width * height) * 100;
    const compatibility = 100 - difference;
    const equal = difference < matchOptions.threshold * 100;

    if (!equal) {
        writeImage(diff, diffImage);
    }

    callback({
        difference,
        compatibility,
        pixels: diffPixels,
        equal
    });
}