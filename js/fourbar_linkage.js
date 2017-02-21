function FourbarLinkage( q, len, angle ) {
    this.q = q;
    this.len = len;
    this.angle = angle;
}

FourbarLinkage.prototype.aPos = function() { return aPos(this.q); }
FourbarLinkage.prototype.bPos = function() { return bPos(this.q); }

FourbarLinkage.prototype.bdLen = function() { return bdLen(this.q); }
FourbarLinkage.prototype.acLen = function() { return acLen(this.q); }
FourbarLinkage.prototype.cdLen = function() { return cdLen(this.q); }
FourbarLinkage.prototype.abLen = function() { return abLen(this.q); }

FourbarLinkage.prototype.cPos = function(th) {
    return cPos(this.q, th);
}

FourbarLinkage.prototype.solveCDEPos = function(th) {
    var cd = solveCDPos(this.q, th);
    var ref = minus( cd[1], cd[0] );
    var e = rotateOffRef(cd[0], ref, this.len, this.angle);
    cd.push(e);
    return cd;
}
