class Loader extends Dew.Async
{
    constructor(bar)
    {
        super();

        var list = [],
            ref = new Dew.Async();

        setTimeout(function(){
            ref.reject();
        }, 500);

        list.push(Dew.http.get('/test/assets/big.bmp', { progress : true }));
        list.push(Dew.http.get('/test/assets/big.bmp', { progress : true }));
        list.push(ref);

        this.progress(function(e){
            // log(e)
            bar.transform({
                scale : e.ready
            })
        });

        this.wait(list, true)
        .then(() => log("loaded!"))
        .except((err) => Dew.printErr(err));
    }
}

$html.ready(function(){

    var bar = $html.create("div", "loadbar");
        bar.css({
            height : "5px",
            width  : "100%",
            background : "#0070ff",
            transition : "500ms"
        })
        bar.transform({
            scale : 0.01,
            settings : {
                origin : [0, 0]
            }
        })


    $html.body.append(bar);

    var loader = new Loader(bar);
});