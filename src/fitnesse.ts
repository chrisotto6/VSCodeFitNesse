import FitnesseView = require('fitnesse-view');
import WikiFormatter = require('wiki-formatter');

export default {
  config: {
    formatOnSave: {
      description: 'Automatically format the file on save.',
      type: 'boolean',
      default: true
    }
  },

  fitnesseView: null,
  subscriptions: null,
  needsFormatting: true,

  activate(state) {
    this.fitnesseView = new FitnesseView(state.fitnesseViewState);
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', { 'fitnesse:format': () => this.format() }));
    return this.subscriptions.add(atom.workspace.observeTextEditors(editor => this.handleEvents(editor)));
  },

  deactivate() {
    this.fitnesseView.destroy();
    return this.subscriptions.dispose();
  },

  serialize() {
    return { fitnesseViewState: this.fitnesseView.serialize() };
  },

  handleEvents(editor) {
    this.subscriptions.add(editor.onDidSave(() => this.onSave(editor)));
    return this.subscriptions.add(editor.onDidStopChanging(() => this.needsFormatting = true));
  },

  // This should prevent attempting to format non text files if the plugin
  // is enabled and the user is editing a non-fitnesse file.
  isFormattableGrammar(grammar) {
    return grammar.scopeName === 'text.plain';
  },

  onSave(editor) {
    // Only auto-format if configured
    if (!atom.config.get('fitnesse.formatOnSave')) {
      return;
    }

    // Don't try to format non text files
    if (!this.isFormattableGrammar(editor.getGrammar())) {
      this.needsFormatting = false;
      return;
    }

    // Only format if there are changes
    // This also prevents an infinite loop from the save call
    if (this.needsFormatting) {
      this.format(editor);
      this.needsFormatting = false;
      return editor.save();
    }
  },

  // Formats the file
  format(editor) {
    let formatter = new WikiFormatter();
    let text = editor.getText();
    //console.log("formatting text: " + text.length)
    let formattedText = formatter.format(text);
    return editor.setText(formattedText);
  }
};
