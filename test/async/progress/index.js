class Loader extends DEW.Async
{
    constructor(bar)
    {
        super();

        let list = [],
            ref = new DEW.Async();

        setTimeout(function(){
            ref.reject();
        }, 500);

        list.push(DEW.http.get('/test/assets/big.jpg', { progress : true }));
        list.push(DEW.http.get('/test/assets/big.jpg', { progress : true }));
        // list.push(ref);

        this.progress(function(e){
            // log(e)
            bar.transform({
                scale : e.ready
            })
        });

        this.wait(list, true)
        .then(() => log("loaded!"))
        .except((err) => DEW.printErr(err));
    }
}

$html.ready(function(){

    let bar = $html.create("div", "loadbar");
        bar.style({
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

    let loader = new Loader(bar);
});
