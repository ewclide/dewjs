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
        this._bar.style({
            height: '5px',
            width: '100%',
            background: '#0070ff',
            transition: '500ms'
        })
        this._bar.transform({
            scale: 0.01,
            settings: {
                origin: [0, 0]
            }
        })

        $html.ready(() => $html.body.append(this._bar));

        this.onAsyncProgress((e) => this._bar.transform({ scale: e.ready }));
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
    '/test/assets/empty.jpg'
]);

