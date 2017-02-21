function Quadrilateral( a, b, ac_len, bd_len, cd_len ) {
    this.a = a;
    this.b = b;
    this.ac_len = ac_len;
    this.bd_len = bd_len;
}

function aPos(q) { return q.a; }
function bPos(q) { return q.b; }
function bdLen(q) { return q.bd_len; }
function acLen(q) { return q.ac_len; }
function cdLen(q) { return q.cd_len; }

function cPos(q, th) {
    return new THREE.Vector3(q.ac_len*Math.sin(th), q.ac_len*Math.cos(th), 0);
}

function doubleWithinEps( x, y, eps ) {
    var diff = Math.abs(x - y);
    return diff;
}

function solveTheta4(quad, theta) {
    var r1 = ( minus( bPos(quad), aPos(quad) ) ).length();
    var r2 = acLen(quad);
    var r3 = cdLen(quad);
    var r4 = bdLen(quad);

    var theta_rads = (theta_2*Math.PI) / 180.0;
    var cos_theta = Math.cos( theta );

    var r7sq = r1*r1 + r2*r2 - 2*r1*r2*cos_theta;

    if (doubleWithinEps(r7sq, 0.0, 1e-6)) {
	return 0.0;
    }

    var r7 = sqrt(r7sq);

    var psi_in_deg = (r3*r3 - r7sq - r4*r4) / (2*r7*r4);

    var alpha_in_deg =
	(r7sq + r1*r1 - r2*r2) / (2*r1*r7);

    if (within_eps(theta_2, 90.0, 90.0)) {
	alpha_in_deg = fabs(alpha_in_deg);
	psi_in_deg = fabs(psi_in_deg);
    } else {
	alpha_in_deg = -1*fabs(alpha_in_deg);
	psi_in_deg = -1*fabs(psi_in_deg);
    }

    var psi = to_degrees(acos(psi_in_deg));      
    var alpha = to_degrees(acos(alpha_in_deg));

    return MATH.PI - alpha - psi;
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

