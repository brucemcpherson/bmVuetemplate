'use strict';
/**
 * Adds a custom menu with items to show the sidebar and dialog.
 *
 * @param {Object} e The event parameter for a simple onOpen trigger.
 */
function onOpen(e) {
  SpreadsheetApp.getUi()
      .createAddonMenu()
      .addItem('bmVuetemplate', 'showTemplate')
      .addToUi();
}

/**
 * Runs when the add-on is installed; calls onOpen() to ensure menu creation and
 * any other initializion work is done immediately.
 *
 * @param {Object} e The event parameter for a simple onInstall trigger.
 */
function onInstall(e) {
  onOpen(e);
}


/**
 * Opens a sidebar. 
 */
function showTemplate() {
  
  const code = HtmlService.createTemplateFromFile('index.html')
    .evaluate()
  console.log(code.getContent())
  var ui = code
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('bm Vue.js Template for apps script');
  
  SpreadsheetApp.getUi().showSidebar(ui);
}




