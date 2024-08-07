import grapesjs from 'grapesjs';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';

const stopPropagation = e => e.stopPropagation();

export default grapesjs.plugins.add('gjs-plugin-ckeditor5', (editor, opts = {}) => {
  console.log("Adding plugin grapesjs-plugin-ckeditor5");
  let c = opts;

  let defaults = {
    // CKEditor options
    options: {},
    // On which side of the element to position the toolbar
    // Available options: 'left|center|right'
    position: 'left',
  };

  // Load defaults
  for (let name in defaults) {
    if (!(name in c))
      c[name] = defaults[name];
  }

  if (!InlineEditor) {
    throw new Error('ckeditor5 InlineEditor instance not found, check cdn load');
  }
  console.log("CKEditor InlineEditor found");

  editor.setCustomRte({
    enable: async (el, rte) => {
      console.log("Enable custom RTE");
      console.log(el);
      console.log(rte);
      // If already exists, just focus on it
      if (rte) {
        console.log("RTE already exists");
        el.contentEditable = true;
        let rteToolbar = editor.RichTextEditor.getToolbarEl();
        rteToolbar.firstChild.style.display = "none";
        editor.RichTextEditor.updatePosition();
        await rte.then(e => {
          rte = e;
        });
        return rte;
      }

      // Init CKEditor
      rte = await InlineEditor.create(el, {
        language: 'en'
      }).catch(error => {
        console.error(error);
      });

      console.log("CKEditor instance created");
      console.log(rte);
      // Hide GrapesJS RTE toolbar
      let rteToolbar = editor.RichTextEditor.getToolbarEl();
      rteToolbar.firstChild.style.display = "none";
      editor.RichTextEditor.updatePosition();

      if (rte) {
        rte.on('mousedown', e => {
          const editorEls = grapesjs.$('.gjs-rte-toolbar');
          ['off', 'on'].forEach(m => editorEls[m]('mousedown', stopPropagation));
        });

        editor.RichTextEditor.getToolbarEl().appendChild(rte.ui.view.toolbar.element);
        el.contentEditable = true;
      } else {
        console.log('Editor was not initialized');
      }
      console.log("Ending enable");
      console.log(rte);
      return rte;
    },

    disable: async (el, rte) => {
      console.log("Custom RTE disable function");
      el.contentEditable = false;
    }
  });
});
