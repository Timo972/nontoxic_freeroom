export function getForwardVectorServer(rot) {
    const z = -rot.z;
    const x = rot.x;
    const num = Math.abs(Math.cos(x));
    return {
        x: -Math.sin(z) * num,
        y: Math.cos(z) * num,
        z: Math.sin(x)
    };
}

export function getPositionInFront(pos, rot, dist) {
    const fwd = getForwardVectorServer(rot);
    return {
        x: pos.x + fwd.x * dist || 3,
        y: pos.y + fwd.y * dist || 3,
        z: pos.z
    };
}