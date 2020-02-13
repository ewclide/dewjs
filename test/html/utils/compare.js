import pixelmatch from 'pixelmatch';
import nodePath from 'path';
import fs from 'fs';
import { PNG } from 'pngjs';

const isExists = name => fs.existsSync(name);
const getRawImage = (src) => PNG.sync.read(fs.readFileSync(nodePath.resolve(src)));
const writeImage = (src, image) => fs.writeFileSync(provideFolder(src), PNG.sync.write(image));

const clipImage = (image, { width, height }) => {
    if (image.width === width && image.height === height) {
        return image;
    }

    const result = new PNG({ width, height });
    PNG.bitblt(image, result, 0, 0, width, height, 0, 0);

    return {
        ...image,
        data: result.data,
        width,
        height
    };
};

const alignImageSizes = (image1, image2) => {
    const { width: w1, height: h1 } = image1;
    const { width: w2, height: h2 } = image2;
    const size = {
        width: Math.min(w1, w2),
        height: Math.min(h1, h2)
    };

    return [clipImage(image1, size), clipImage(image2, size)];
};

function provideFolder(filePath) {
    const resolved = nodePath.resolve(filePath);
    if (isExists(resolved)) return resolved;

    const { dir } = nodePath.parse(resolved);
    let path = '';

    dir.split(/\\|\//g).forEach((subDir, index) => {
        if (!index || !subDir) return;
        path += '/' + subDir;
        if (isExists(path)) return;
        fs.mkdirSync(path);
    });

    return resolved;
}

export default function compareImages({ etalon, work, diff, ...options }, callback = () => {}) {
    let workImage = getRawImage(work);
    let etalonImage = getRawImage(etalon);
    [workImage, etalonImage] = alignImageSizes(workImage, etalonImage);

    const { width, height } = etalonImage;
    const diffImage = new PNG({ width, height });

    const matchOptions = {
        threshold: 0.01,
        includeAA: true,
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