const InvalidCharChecker = (str, maxChar, type) => {
  let regEx;
  const profanityRegEx = new RegExp(['fuck', 'dick', 'asshole', 'bitch', 'motherfucker'].join('|'));

  switch (type) {
    case 'posterName':
      regEx = new RegExp(/[^a-zA-Z0-9\ \&\_\'\.]/);
      break;
    case 'location':
      regEx = new RegExp(/[^a-zA-Z0-9\&\_\'\.]/);
      break;
    case 'company':
      regEx = new RegExp(/[^a-zA-Z0-9\&\_\'\.]/);
      break;
    case 'content':
      regEx = new RegExp(/[^a-zA-Z0-9\ \&\*\(\)\_\-\~\:\"\'\,\.\[\]\|]/);
      break;
    default:
      regEx = 'iL5mdXEbyY';
      break;
  }

  return str.length > maxChar ||
         str.search(regEx) != -1 ||
         profanityRegEx.test(str);
};

export default InvalidCharChecker;
