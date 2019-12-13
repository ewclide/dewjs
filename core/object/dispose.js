export default function dispose(inst) {
    Object.keys(inst).forEach(prop => inst[prop] = null);
}