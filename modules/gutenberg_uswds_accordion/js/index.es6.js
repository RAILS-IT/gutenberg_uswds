const { blocks, data, element, components, editor, blockEditor } = wp;
const { registerBlockType } = blocks;
const { dispatch, select, useSelect } = data;
const { Fragment } = element;
const { Toolbar, Placeholder, ToggleControl, PanelBody } = components;
const { RichText, InspectorControls, BlockIcon, TextControl, InnerBlocks } = blockEditor;
const __ = Drupal.t;

const accordion = {
  title: __('Accordion'),
  description: __('Wrapper for Accordion Items'),
  icon: 'editor-justify',
  attributes: {
    multiselect: {
      type: 'boolean',
      default: false,
    },
    controlButton: {
      type: 'boolean',
      default: false,
    }
  },

  edit({ attributes, className, setAttributes, isSelected }) {
    const { multiselect, controlButton } = attributes;

    return (
      <Fragment>
        <div className={ `${className} usa-accordion` } aria-multiselectable={multiselect}>
          { controlButton &&
            <a href="" target="blank" className="usa-link expand-link">{ __('Expand All') }</a>
          }
          <InnerBlocks allowedBlocks={ ['uswds/accordion-item'] } />
        </div>
        <InspectorControls>
          <PanelBody title={ __('Settings') }>
            <ToggleControl
              label={ __('Allow multiple items to be expanded at the same time') }
              checked={ multiselect }
              onChange={() => {
                if (multiselect) {
                  setAttributes({ controlButton: false })
                }
                setAttributes({ multiselect: !multiselect })
              }}
            />
            { multiselect &&
              <ToggleControl
                label={ __('Expand/Collapse All Button') }
                checked={ controlButton }
                onChange={() => setAttributes({ controlButton: !controlButton })}
              />
            }
          </PanelBody>
        </InspectorControls>
      </Fragment>
    );
  },

  save({ className, attributes }) {
    // @todo looks like is needed to maintain those attributes here, but I'm not sure why.
    const { multiselect, controlButton } = attributes;
    return (
      <InnerBlocks.Content />
    );
  }
};

const accordionItem = {
  title: __('Accordion Item'),
  description: __('A single Accordion Item'),
  icon: 'align-wide',
  attributes: {
    open: {
      type: 'boolean',
      default: false,
    },
    heading: {
      type: 'string',
      default: '',
    },
  },

  edit({ attributes, className, setAttributes, isSelected, clientId }) {
    const { open, heading } = attributes;

    const isParentOfSelectedBlock = useSelect( ( select ) => select( 'core/block-editor' ).hasSelectedInnerBlock( clientId, true ) );
    const isSelectedOrChild = isSelected || isParentOfSelectedBlock;

    return (
      <Fragment>
        <h4 className={ `${className} usa-accordion__heading` }>
          <RichText
            tagName='div'
            className='usa-accordion__button'
            value={ heading }
            onChange={ ( heading ) => setAttributes( { heading } ) }
            placeholder={ __( 'Write a heading...')}
            keepPlaceholderOnFocus={true}
            withoutInteractiveFormatting={true}
            allowedFormats={[]}
            aria-expanded={ isSelectedOrChild }
          />
        </h4>
        <div
          className='usa-accordion__content usa-prose'
          { ...( !isSelectedOrChild && { hidden: true } ) }
        >
          <InnerBlocks />
        </div>
        <InspectorControls>
          <PanelBody title={ __('Settings') }>
            <ToggleControl
              label={ __('Expanded by default') }
              checked={ open }
              onChange={() => setAttributes({ open: !open })}
            />
          </PanelBody>
        </InspectorControls>
      </Fragment>
    );
  },

  save({ className, attributes }) {
    // @todo looks like is needed to maintain those attributes here, but I'm not sure why.
    const { open, heading } = attributes;
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

registerBlockType(`${category.slug}/accordion-item`, { category: category.slug, parent: ['uswds/accordion'], ...accordionItem });
registerBlockType(`${category.slug}/accordion`, { category: category.slug, ...accordion });
