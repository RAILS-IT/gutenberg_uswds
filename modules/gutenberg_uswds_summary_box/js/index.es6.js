const { blocks, data, element, components, editor, blockEditor } = wp;
const { registerBlockType } = blocks;
const { dispatch, select, useSelect } = data;
const { Fragment } = element;
const { Toolbar, ColorPalette, PanelBody } = components;
const { RichText, InnerBlocks, InspectorControls } = blockEditor;
const __ = Drupal.t;

const settings = {
  title: __('Summary Box'),
  description: __('Summarize dense content'),
  icon: 'format-aside',
  attributes: {
    title: {
      type: 'string',
      default: 'Summary'
    },
    backgroundColor: {
      type: 'string',
      default: '#e7f6f8'
    },
    borderColor: {
      type: 'string',
      default: '#99deea'
    }
  },

  edit({ attributes, className, setAttributes, isSelected, clientId }) {
    const { title, backgroundColor, borderColor } = attributes;

    const divStyle = {
      backgroundColor: backgroundColor,
      borderColor: borderColor
    }

    const backgroundColors = [
      { name: 'white', color: '#fff' },
      { name: 'red', color: '#f9eeee' },
      { name: 'orange', color: '#f6efe9' },
      { name: 'yellow', color: '#faf3d1' },
      { name: 'green', color: '#eaf4dd' },
      { name: 'blue', color: '#e7f6f8' },
    ];

    const borderColors = [
      { name: 'white', color: '#fff' },
      { name: 'red', color: '#f7bbb1' },
      { name: 'orange', color: '#f3bf90' },
      { name: 'yellow', color: '#e6c74c' },
      { name: 'green', color: '#b8d293' },
      { name: 'blue', color: '#99deea' },
    ];

    return (
      <Fragment>
        <div
          className={ `${className} usa-summary-box` }
          role="region"
          aria-labelledby="summary-box-key-information"
          style={ divStyle }
        >
          <div class="usa-usa-summary-box__body">
            <RichText
              tagName='h3'
              className='usa-summary-box__heading'
              value={ title }
              onChange={ ( title ) => setAttributes( { title } ) }
              placeholder={ __( 'Summary')}
              keepPlaceholderOnFocus={true}
              withoutInteractiveFormatting={true}
              allowedFormats={[]}
            />
            <div className="usa-summary-box__text">
              <InnerBlocks allowedBlocks={ ['core/paragraph', 'core/list', 'core/image'] } />
            </div>
          </div>
        </div>
        <InspectorControls>
          <PanelBody title={ __('Background Color') }>
            <ColorPalette
              colors={ backgroundColors }
              value={ backgroundColor }
              disableCustomColors={ true }
              onChange={ color => {
                setAttributes( { backgroundColor: color } )
              }}
            />
          </PanelBody>
          <PanelBody title={ __('Border Color') }>
            <ColorPalette
              colors={ borderColors }
              value={ borderColor }
              disableCustomColors={ true }
              onChange={ color => {
                setAttributes( { borderColor: color } )
              }}
            />
          </PanelBody>
        </InspectorControls>
      </Fragment>
    );
  },

  save({ className, attributes }) {
    return (
      <InnerBlocks.Content />
    );
  }
};

const category = {
  slug: 'uswds',
  title: __('USWDS'),
};

const currentCategories = select('core/blocks').getCategories().filter(item => item.slug !== category.slug);
dispatch('core/blocks').setCategories([ category, ...currentCategories ]);

registerBlockType(`${category.slug}/summary-box`, { category: category.slug, ...settings });
