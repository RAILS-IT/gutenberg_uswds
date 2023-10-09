const { blocks, data, element, components, editor, blockEditor } = wp;
const { registerBlockType } = blocks;
const { dispatch, select, useSelect } = data;
const { Fragment } = element;
const { ToggleControl, PanelBody } = components;
const { RichText, BlockControls, InspectorControls, InnerBlocks } = blockEditor;
const __ = Drupal.t;

const settings = {
  title: __('Modal'),
  description: __('A button that opens a modal.'),
  icon: 'align-wide',
  attributes: {
    large: {
      type: 'boolean',
      default: false,
    },
    title: {
      type: 'string',
      default: '',
    },
    button: {
      type: 'string',
      default: '',
    },
    buttonUnstyled: {
      type: 'boolean',
      default: false,
    }
  },

  edit({ attributes, className, setAttributes, isSelected, clientId }) {
    const { title, buttonUnstyled, button, large } = attributes;

    const isParentOfSelectedBlock = useSelect( ( select ) => select( 'core/block-editor' ).hasSelectedInnerBlock( clientId, true ) );
    const isSelectedOrChild = isSelected || isParentOfSelectedBlock;

    const MODAL_CONTENT_TEMPLATE = [
      ['core/paragraph'],
      ['core/buttons']
    ];

    const NOT_ALLOWED_BLOCKS = [
      'uswds/modal',
      'uswds/accordion-item',
    ];

    const ALLOWED_BLOCKS = wp.blocks.getBlockTypes().map(block => block.name).filter(blockName => NOT_ALLOWED_BLOCKS.indexOf(blockName) === -1);

    return (
      <Fragment>
        <div className={className}>
          <div>
            <RichText
              tagName='div'
              className={(buttonUnstyled ? 'usa-link' : 'usa-button')}
              value={ button }
              onChange={ ( button ) => setAttributes( { button } ) }
              placeholder={ __( 'Opener button text')}
              keepPlaceholderOnFocus={true}
              withoutInteractiveFormatting={true}
              allowedFormats={[]}
            />
          </div>
          { isSelectedOrChild &&
            <div
              className={"usa-modal" + (large ? 'usa-modal--lg' : '')}
            >
              <div className="usa-modal__content">
                <div className="usa-modal__main">
                  <RichText
                    tagName='h2'
                    className='modal__heading'
                    value={ title }
                    onChange={ ( title ) => setAttributes( { title } ) }
                    placeholder={ __( 'Modal title')}
                    keepPlaceholderOnFocus={true}
                    withoutInteractiveFormatting={true}
                    allowedFormats={[]}
                  />
                  <div class="usa-prose">
                    <InnerBlocks template={ MODAL_CONTENT_TEMPLATE } allowedBlocks={ ALLOWED_BLOCKS } />
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
        <InspectorControls>
          <PanelBody title={ __('Settings') }>
            <ToggleControl
              label={ __('Modal window size') }
              help={ large ? __('Large') : __('Default') }
              checked={ large }
              onChange={() => {
                if (large) {
                  setAttributes({ controlButton: false })
                }
                setAttributes({ large: !large })
              }}
            />
            <ToggleControl
              label={ __('Show opener as link') }
              help={ buttonUnstyled ? __('Showing as Link') : __('Showing as Button') }
              checked={ buttonUnstyled }
              onChange={() => {
                if (buttonUnstyled) {
                  setAttributes({ controlButton: false })
                }
                setAttributes({ buttonUnstyled: !buttonUnstyled })
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

registerBlockType(`${category.slug}/modal`, { category: category.slug, ...settings });
