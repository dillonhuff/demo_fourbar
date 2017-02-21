function Quadrilateral( a, b, ac_len, bd_len, cd_len ) {
    this.a = a;
    this.b = b;
    this.ac_len = ac_len;
    this.bd_len = bd_len;
    this.cd_len = cd_len;
}

function aPos(q) { return q.a; }
function bPos(q) { return q.b; }
function bdLen(q) { return q.bd_len; }
function acLen(q) { return q.ac_len; }
function cdLen(q) { return q.cd_len; }

function cPos(q, th) {
    var k = normalize( minus( bPos(q), aPos(q) ) );
    return rotateOffRef( aPos(q), k, acLen(q), th);
}

function doubleWithinEps( x, y, eps ) {
    var diff = Math.abs(x - y);
    return diff < eps;
}

function solveTheta4(quad, theta_val) {
    //return theta_val;

    var r1 = ( minus( bPos(quad), aPos(quad) ) ).length();
    var r2 = acLen(quad);
    var r3 = cdLen(quad);
    var r4 = bdLen(quad);

    var theta = theta_val;

    var cos_theta = Math.cos( theta );

    alert('cos_theta = ' + cos_theta);

    var r7sq = r1*r1 + r2*r2 - 2*r1*r2*cos_theta;

    if (doubleWithinEps(r7sq, 0.0, 1e-6)) {
	return 0.0;
    }

    var r7 = Math.sqrt(r7sq);

    alert('r7 = ' + r7);
    alert('r7*r7 = ' + r7sq);
    alert('r4 = ' + r4);
    alert('r2 = ' + r2);

    var psi_denom = 2*r7*r4;

    //alert('psi_denom = ' + psi_denom);

    var psi_num = r3*r3 - r7sq - r4*r4;

    //alert('psi_num = ' + psi_num);

    var psi = Math.acos(psi_num / psi_denom);

    var alpha_num = r2*r2 - r7sq - r1*r1;

    alert('alpha_num = ' + alpha_num);

    var alpha_denom = 2*r1*r7;
    alert('alpha_denom = ' + alpha_denom);

    var alpha_pre = alpha_num / alpha_denom;

    alert('alpha_pre = ' + alpha_pre);

    var alpha =
	Math.acos(alpha_pre);

    alert('psi = ' + psi + '\nalpha = ' + alpha);

    if (!doubleWithinEps(theta_2, Math.PI / 2.0, Math.PI / 2.0)) {
    	//alert('within eps');
    	alpha = Math.abs(alpha);
    	psi = Math.abs(psi);
    } else {
    	//alert('not within eps');
    	alpha = -1*Math.abs(alpha);
    	psi = -1*Math.abs(psi);
    }

    // var psi = psi_in_deg; //to_degrees(acos(psi_in_deg));      
    // var alpha = alpha_in_deg; //to_degrees(acos(alpha_in_deg));

    //alert('alpha = ' + alpha + '\npsi = ' + psi);

    return Math.PI - alpha - psi;
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

    var theta4 = solveTheta4(quad, theta); //Math.PI / 2.0); //theta);
    var d = rotateOffRef(bPos(quad),
			 normalize( minus(bPos(quad), aPos(quad)) ),
			 bdLen(quad),
			 theta4);

    return [c, d];
}

