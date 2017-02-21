function Quadrilateral( a, b, d, ac_len, bd_len ) {
    this.a = a;
    this.b = b;
    this.d = d;
    this.ac_len = ac_len;
    this.bd_len = bd_len;
}

function aPos(q) { return q.a; }
function bPos(q) { return q.b; }
function dPos(q) { return q.d; }
function bdLen(q) { return q.bd_len; }

function cPos(q, th) {
    return new THREE.Vector3(q.ac_len*Math.sin(th), q.ac_len*Math.cos(th), 0);
}

function solveTheta4(quad, theta) {
    return Math.PI / 3.0;
}

function normalize( vec ) {
    var v = vec.clone();
    v.normalize();
    return v;
}

function minus( l, r ) {
    var m = l.clone();
    m.sub(r);
    return m;
}

function plus( l, r ) {
    var m = l.clone();
    m.add(r);
    return m;
}

function scalarTimes( s, u ) {
    var v = u.clone();
    v.multiplyScalar( s );
    return v;
}

function rotated( v , angle) {
    var rx = Math.cos( angle ) * v.x - Math.sin( angle ) * v.y;
    var ry = Math.sin( angle ) * v.x + Math.cos( angle ) * v.y;
    var rv = new THREE.Vector3(rx, ry, v.z);
    return rv;
    // return vec2(cos(angle_rads)*x() - sin(angle_rads)*y(),
    // 		sin(angle_rads)*x() + cos(angle_rads)*y());
    
}

function rotateOffRef(center,
		      ref,
		      len,
		      angle) {
    return plus( center, scalarTimes( len, rotated( ref, angle ) ) );
}

function solveCDPos(quad, theta) {
    var c = cPos(quad, theta);

    var theta4 = solveTheta4(quad, theta);
    var d = rotateOffRef(bPos(quad),
			 normalize( minus(bPos(quad), aPos(quad)) ),
			 bdLen(quad),
			 theta4); //dPos(quad);

    return [c, d];
}

