const { blocks, data, element, components, editor, blockEditor } = wp;
const { registerBlockType } = blocks;
const { dispatch, select, useSelect } = data;
const { Fragment } = element;
const { SelectControl, ColorPalette, PanelBody } = components;
const { RichText, InnerBlocks, InspectorControls } = blockEditor;
const __ = Drupal.t;

const processList = {
  title: __('Process List'),
  description: __('A single process list'),
  icon: 'list-view',
  attributes: {
    title: {
      type: 'string',
    },
    layout: {
      type: 'string',
      default: 'numerical'
    },
    borderColor: {
      type: 'string',
      default: 'black',
    },
  },

  edit({ attributes, setAttributes }) {
    const { title, layout, borderColor } = attributes;

    const borderColors = [
      { name: 'black', color: 'black' },
      { name: 'red', color: 'red' },
      { name: 'orange', color: 'orange' },
      { name: 'yellow', color: 'yellow' },
      { name: 'green', color: 'green' },
      { name: 'blue', color: 'blue' },
    ];

    return (
      <Fragment>
        <RichText
          tagName='h3'
          className='site-preview-heading usa-process-list__title'
          value={ title }
          onChange={ ( title ) => setAttributes( { title } ) }
          placeholder={ __( 'Process List title...')}
          keepPlaceholderOnFocus={true}
          withoutInteractiveFormatting={true}
          allowedFormats={[]}
        />
        <ul className={ `usa-process-list usa-process-list--${layout} usa-process-list--${borderColor}` }>
          <InnerBlocks allowedBlocks={ ['uswds/list-item'] } />
        </ul>
        <InspectorControls>
          <PanelBody title={ __('List Type') }>
            <SelectControl
              value={ layout }
              options={[
                { label: 'Alphabetical', value: 'alphabetical' },
                { label: 'Numerical', value: 'numerical' },
              ]}
              onChange={ layout => {
                setAttributes({ layout: layout });
              }}
            />
          </PanelBody>
          <PanelBody title={ __('List Color') }>
            <ColorPalette
              colors={ borderColors }
              value={ borderColor }
              disableCustomColors={ true }
              onChange={ color => {
                setAttributes({ borderColor: color });
              }}
            />
          </PanelBody>
        </InspectorControls>
      </Fragment>
    );
  },

  save({ attributes }) {
    const { title, layout, borderColor } = attributes;
    return (
      <InnerBlocks.Content />
    );
  }
};

const processListItem = {
  title: __('Process List Item'),
  description: __('A single Process List Item'),
  icon: 'list-view',
  attributes: {
    heading: {
      type: 'string',
      default: '',
    }
  },

  edit({ attributes, setAttributes }) {
    const { heading } = attributes;

    return (
      <Fragment>
        <li className="usa-process-list__item">
          <RichText
            tagName='h4'
            className='usa-process-list__heading'
            value={ heading }
            onChange={ ( heading ) => setAttributes( { heading } ) }
            placeholder={ __( 'Insert heading...')}
            keepPlaceholderOnFocus={true}
          />
          <InnerBlocks allowedBlocks={ ['core/paragraph', 'core/list', 'core/image'] } />
        </li>
      </Fragment>
    );
  },

  save({ attributes }) {
    const { heading } = attributes;
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

registerBlockType(`${category.slug}/process-list-item`, { category: category.slug, parent: ['uswds/process-list'], ...processListItem });
registerBlockType(`${category.slug}/process-list`, { category: category.slug, ...processList });
