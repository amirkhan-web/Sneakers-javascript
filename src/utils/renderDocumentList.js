export const renderDocumentList = (tag, className = [], typeId) => {
  const node = document.createElement(tag);

  if (className.length) {
    node.classList.add(...className);
  }

  if (typeId) {
    node.id = typeId;
  }

  return node;
};
