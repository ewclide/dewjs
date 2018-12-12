class Loader extends DEW.Async
{
    constructor(list) {
        super();

        list = list.map((item) => DEW.http.get(item, null, { progress : true }));

        this._createBar();
        this.load(list);
    }
    
    _createBar() {
        this._bar = $html.create('div', 'loadbar');
        this._bar.styles({
            height: '5px',
            width: '100%',
            background: '#0070ff',
            transition: '500ms'
        })

        this._bar.origin([0, 0]).scaleX(0);

        // this._bar.transform({ scaleX: 0 }, {
        //     origin: [0, 0]
        // })

        $html.ready.then(() => $html.body.append(this._bar));

        this.onProgress(({ loaded, total }) => {
            // this._bar.transform({ scaleX: loaded / total })
            console.log(loaded)
            this._bar.scaleX(loaded / total)
        });
    }

    load(list) {
        this.wait(list, true)
        .then(() => log('loaded!'))
        .catch((e) => DEW.printErr(e));
    }
}

let loader = new Loader([
    '/test/assets/big.jpg',
    '/test/assets/big.jpg',
    // '/test/assets/empty.jpg'
]);

