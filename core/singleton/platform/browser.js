const BROWSER = {
	UNKNOWN: 0,
	CHROME: 1,
	FIREFOX: 2,
	OPERA: 3,
	SAFARI: 4,
	IE: 5
}

function getBrowser() {
    const agent = navigator.userAgent;

    if (agent.search(/Chrome/) > 0)  return BROWSER.CHROME;
    if (agent.search(/Firefox/) > 0) return BROWSER.FIREFOX;
    if (agent.search(/Opera/) > 0)   return BROWSER.OPERA;
    if (agent.search(/Safari/) > 0)  return BROWSER.SAFARI;
    if (agent.search(/MSIE|\.NET/) > 0) return BROWSER.IE;

    return BROWSER.UNKNOWN;
}

export default {
    name: getBrowser(),
    BROWSER
}