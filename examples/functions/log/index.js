const { log } = Dew.helper;

log.IGNORE.push('index');

function doSomeThingImportant() {
	// ...code
	log('something important action is completed!');
}