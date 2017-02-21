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

