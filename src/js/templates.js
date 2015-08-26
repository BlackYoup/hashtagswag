module.exports = function(){this["Templates"] = this["Templates"] || {};

this["Templates"]["classes"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 _.each(classes, function(c){ ;
__p += '\n  <li data-id="' +
__e( c.id ) +
'">' +
__e( c.name ) +
'</li>\n';
});
__p += '\n';

}
return __p
}; return this["Templates"];}