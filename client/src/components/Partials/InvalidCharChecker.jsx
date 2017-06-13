const InvalidCharChecker = (str, maxChar, type) => {
  let regEx;
  const profanityRegEx = new RegExp(['fuck', 'dick', 'asshole', 'bitch', 'motherfucker'].join('|'));

  switch (type) {
    case 'posterName':
      regEx = new RegExp(/[^a-zA-Z0-9\ \&\_\'\.]/);
      break;
    case 'workLocationHashtag':
      regEx = new RegExp(/[^a-zA-Z0-9\_\#]/);
      break;
    case 'companyHashtag':
      regEx = new RegExp(/[^a-zA-Z0-9\_\#]/);
      break;
    case 'companySearchPhrase':
      regEx = new RegExp(/[^a-zA-Z0-9\ \_\#]/);
      break;
    case 'content':
      regEx = new RegExp(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|/\n/]/);
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
