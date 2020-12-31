/**
 *used to include code in htmloutput
 *@nameSpace Include
 */
var Include = (function (ns) {
  // this'll add script tags if they are not there
  const addScript = (text) =>
    text.match(/^\s*?\<script\>/i) ? text : `<script>\n${text}</script>\n`;

  // this'll add style tags if they are not there
  const addStyle = (text) =>
    text.match(/^\s*?\<style\>/i) ? text : `<style>\n${text}</style>\n`;

  /**
   * given an array of .gs file names, it will get the source and return them concatenated for insertion into htmlservice
   * like this you can share the same code between client and server side, and use the Apps Script IDE to manage your js code
   * @param {string[]} scripts the names of all the scripts needed
   * @return {string} the code inside script tags
   */
  ns.gs = (scripts, library) =>
    addScript(
      scripts
        .map((d) => ScriptApp.getResource(d).getDataAsString())
        .join("\n\n")
    );

  /**
   * given an array of .html file names, it will get the source and return them concatenated for insertion into htmlservice
   * @param {string[]} scripts the names of all the scripts needed
   * @param {string} ext file extendion
   * @return {string} the code inside script tags
   */
  ns.html = (scripts, ext) =>
    scripts
      .map((d) =>
        HtmlService.createHtmlOutputFromFile(d + (ext || "")).getContent()
      )
      .join("\n\n");

  /**
   * given an array of .html file names, it will get the source and return them concatenated for insertion into htmlservice
   * inserts js
   * @param {string[]} scripts the names of all the scripts needed
   * @return {string} the code inside script tags
   */
  ns.js = (scripts) => addScript(ns.html(scripts, ".js"));

  /**
   * given an array of .html file names, it will get the source and return them concatenated for insertion into htmlservice
   * inserts css style
   * @param {string[]} scripts the names of all the scripts needed
   * @return {string} the code inside script tags
   */
  ns.css = (scripts) => addStyle(ns.html(scripts, ".css"));

  /**
   * given an array of .html file names, it will get the source and return them concatenated for insertion into htmlservice
   * inserts vue files
   * @param {string[]} scripts the names of all the scripts needed
   * @return {string} the code inside script tags
   */
  ns.vue = (scripts) => addScript(ns.html(scripts, ".vue"));

  /**
   * given an array of .html file names, it will get the source and return them concatenated for insertion into htmlservice
   * in this case there's no file input
   * This uses es2020 import with promises so you may need a babel
   * it's expecting to be able to deal with this as modules, and needs the name of promise var, or it will create one
   * @param {object} options the names of all the scripts needed
   * @param {object[]} options.sources the names of all the scripts needed
   * @param {boolean} [options.initialize =true] whether to inistialize the import promise
   * @param {string} [options.promiseName ='moduleImports'] the name of the global variable to receive the import promise
   * @return {string} the code inside script tags
   */
  ns.mjs = ({sources, initialize = true, promiseName = "moduleImports"}) => {
    // sources look like this {key: 'string', src: 'url', exportName: 'default'}

    const promiseList = sources.map((f) => `    import ('${f.src}')`).join(",\n");
    const reducer = sources.map((f, i) => `    ${f.key}: modules[${i}]${f.exportName ? '.'+f.exportName : ''}`).join(",\n");
    const init = initialize
      ? `<script>\n  ${promiseName.match(/\./) ? '' : 'let '}${promiseName} = {};\n</script>\n`
      : "";
    const str = `  ${promiseName} = Promise.all([\n${promiseList}\n  ])\n  .then(modules=>({\n${reducer}\n  }))`;
    return `${init}\n<script type="module">\n${str}\n</script>\n`;
  };


  return ns;
})(Include || {});