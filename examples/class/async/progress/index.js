const { http, html } = Dew.common;
const { Async } = Dew.type;

class Loader extends Async {
    constructor(list) {
        super();

        list = list.map((item) => http.get(item, null, { progress : true }));

        this._createBar();
        this.load(list);
    }

    _createBar() {
        this._bar = html.create('div', 'loadbar');
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

        html.ready.then(() => html.body.append(this._bar));

        this.progress(({ loaded, total }) => {
            // this._bar.transform({ scaleX: loaded / total })
            console.log(loaded)
            this._bar.scaleX(loaded / total)
        });
    }

    load(list) {
        this.wait(list, true)
            .then(() => log('loaded!'))
            .catch((e) => log.error(e));
    }
}

let loader = new Loader([
    '/examples/assets/img.png',
    '/examples/assets/img.png',
    // '/examples/assets/empty.jpg'
]);

