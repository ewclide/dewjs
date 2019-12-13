export const BROWSERS = {
	UNKNOWN: 0,
	CHROME: 1,
	FIREFOX: 2,
	OPERA: 3,
	SAFARI: 4,
	IE: 5
}

function _getBrowser() {
    const agent = navigator.userAgent;

    if (agent.search(/Chrome/) > 0)  return BROWSERS.CHROME;
    if (agent.search(/Firefox/) > 0) return BROWSERS.FIREFOX;
    if (agent.search(/Opera/) > 0)   return BROWSERS.OPERA;
    if (agent.search(/Safari/) > 0)  return BROWSERS.SAFARI;
    if (agent.search(/MSIE|\.NET/) > 0) return BROWSERS.IE;

    return BROWSERS.UNKNOWN;
}

const browser = _getBrowser();
const system = 'Windows'; // need recognize
const mobile = false; // need recognize

export default {
    browser,
    mobile,
    system
}