// TODO 未被引用
function Ke(e) {
  return '<i class="m-font m-font-star m-star-'.concat(e, '"></i>');
}

export default (e) => {
  if (!e) return null;
  var t = e.replace(/\[星星]/g, Ke("full"));
  return (
    (t = t.replace(/\[半星]/g, Ke("half"))),
    (t = t.replace(/\[空星]/g, Ke("null"))),
    (t = t.replace(/iconimg iconimg-xs/g, "url-icon")),
    t
  );
};
