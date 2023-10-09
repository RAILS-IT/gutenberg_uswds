const { blocks, data, element, components, editor, blockEditor } = wp;
const { registerBlockType } = blocks;
const { dispatch, select, useSelect } = data;
const { Fragment } = element;
const { Toolbar, ToggleControl, SelectControl, Notice, PanelBody, Dashicon, Flex, FlexItem, FlexBlock, __experimentalInputControl } = components;
const { RichText, InspectorControls, BlockControls, BlockIcon, TextControl, InnerBlocks, MediaUpload } = blockEditor;
const __ = Drupal.t;

const card = {
  title: __('Card'),
  description: __('A single card'),
  icon: 'image-rotate-right',
  attributes: {
    layout: {
      type: 'string',
      default: 'default',
    },
    title: {
      type: 'string',
    },
    showButton: {
      type: 'boolean',
      default: false,
    },
    button: {
      type: 'string',
    },
    buttonUrl: {
      type: 'string',
    },
    buttonOpenNewTab: {
      type: 'boolean',
      default: false,
    },
    mediaEntityId: {
      type: 'integer',
    },
    mediaEntity: {
      type: 'object',
    },
    titleAtTop: {
      type: 'boolean',
      default: false,
    },
    insetMedia: {
      type: 'boolean',
      default: false,
    },
    mediaOnRight: {
      type: 'boolean',
      default: false,
    },
    columns: {
      type: 'number',
      default: 0,
    },
  },

  edit({ attributes, className, setAttributes, isSelected, clientId }) {
    const { layout, title, showButton, button, buttonUrl, buttonOpenNewTab, mediaEntityId, mediaEntity, titleAtTop, insetMedia, mediaOnRight } = attributes;

    const isParentOfSelectedBlock = useSelect( ( select ) => select( 'core/block-editor' ).hasSelectedInnerBlock( clientId, true ) );
    const isSelectedOrChild = isSelected || isParentOfSelectedBlock;
    let loading = false;

    /**
     * Return a media entity given the media id.
     * @param {Number} item The media id
     * @returns {Object} The media entity
     */
     const getMediaEntity = async (item) => {
      const response = await fetch(
        Drupal.url(`gutenberg_uswds_card/media/load-media/${item}`),
      );

      if (response.ok) {
        const mediaEntity = await response.json();

        if (mediaEntity) {
          return mediaEntity;
        }
      }

      if (response.status === 404) {
        Drupal.notifyError("Media entity couldn't be found.");
        return null;
      }

      if (!response.ok) {
        Drupal.notifyError('An error occurred while fetching data.');
        return null;
      }
    };

    /**
     * Set the mediaEntity attribute when the media upload is updated.
     * @param {Number} mediaEntityId The media entity
     */
    const insertMedia = mediaEntityId => {

      if (isNaN(mediaEntityId)) {
        const regex = /\((\d*)\)$/;
        const match = regex.exec(mediaEntityId);
        mediaEntityId = match[1];
      }

      getMediaEntity(mediaEntityId).then(media => {
        setAttributes({
          mediaEntityId: Number(media.id),
          mediaEntity: media
        });
      });

    }

    return (
      <Fragment>
        <div className={ `${className} usa-card tablet:grid-col ` + (titleAtTop ? 'usa-card--header-first' : '') + (layout == 'flag' ? 'usa-card--flag ' : '')  + (mediaOnRight ? 'usa-card--media-right' : '') }>
          <div class="usa-card__container">
            <header class="usa-card__header">
              <RichText
                tagName='h2'
                className='usa-card__heading'
                value={ title }
                onChange={ ( title ) => setAttributes( { title } ) }
                placeholder={ __( 'Card title...')}
                keepPlaceholderOnFocus={true}
                withoutInteractiveFormatting={true}
                allowedFormats={[]}
              />
            </header>
            <div className={ "usa-card__media " + (insetMedia ? 'usa-card__media--inset' : '') }>
              <div className="usa-card__img">
              { mediaEntityId ?
                <img
                  src={mediaEntity.media_details.sizes.large.source_url}
                  className="image"
                />
              :
               isSelected &&
                <MediaUpload
                  onSelect={insertMedia}
                  allowedTypes={['image']}
                  allowedBundles={['image']}
                  multiple={false}
                  handlesMediaEntity={true}
                />
              }
              </div>
            </div>
            <div className="usa-card__body">
              <InnerBlocks allowedBlocks={ ['core/paragraph', 'core/list'] } />
            </div>
            { showButton &&
              <div class="usa-card__footer">
                <RichText
                  tagName='div'
                  className='usa-button'
                  value={ button }
                  onChange={ ( button ) => setAttributes( { button } ) }
                  placeholder={ __( 'Footer button text')}
                  keepPlaceholderOnFocus={true}
                  withoutInteractiveFormatting={true}
                  allowedFormats={[]}
                />
                { isSelected &&
                  <Fragment>
                    <Flex className="button-link">
                      <FlexItem>
                        <Dashicon icon="admin-links" />
                      </FlexItem>
                      <FlexBlock>
                        <__experimentalInputControl
                          value={ buttonUrl }
                          placeholder="https://example.com"
                          onChange={ ( buttonUrl ) => setAttributes( { buttonUrl } ) }
                        />
                      </FlexBlock>
                    </Flex>
                  </Fragment>
                }
              </div>
            }
          </div>
        </div>
        <InspectorControls>
          <PanelBody title={ __('General Settings') }>
            <SelectControl
              label="Layout"
              value={ layout }
              options={ [
                  { label: 'Default', value: 'default' },
                  { label: 'Flag', value: 'flag' },
              ] }
              onChange={nextLayout => {
                if (nextLayout == 'flag') {
                  setAttributes({ titleAtTop: false, insetMedia: false })
                }
                else {
                  setAttributes({ mediaOnRight: false })
                }
                setAttributes({
                  layout: nextLayout,
                });
              }}
            />
            { layout === 'flag' && !mediaEntityId &&
              <Notice status="error" isDismissible={false}>
                <p>
                  {__('Media is required when flag layout is selected.')}
                </p>
              </Notice>
            }
          </PanelBody>
          <PanelBody title={ __('Footer Settings') }>
            <ToggleControl
              label={ __('Show button') }
              checked={ showButton }
              onChange={() => setAttributes({ showButton: !showButton })}
            />
            { showButton &&
              <ToggleControl
               label={ __('Open link in new tab') }
               checked={ buttonOpenNewTab }
               onChange={() => setAttributes({ buttonOpenNewTab: !buttonOpenNewTab })}
             />
            }
          </PanelBody>
          { mediaEntityId && layout == "default" &&
            <PanelBody title={ __('Default Layout - Media Settings') }>
              <ToggleControl
                label={ __('Title at top') }
                checked={ titleAtTop }
                onChange={() => setAttributes({ titleAtTop: !titleAtTop })}
              />
              <ToggleControl
                label={ __('Inset Media') }
                checked={ insetMedia }
                onChange={() => setAttributes({ insetMedia: !insetMedia })}
              />
            </PanelBody>
          }
          { mediaEntityId && layout == "flag" &&
            <PanelBody title={ __('Flag Layout - Media Settings') }>
              <ToggleControl
                label={ __('Media on right') }
                checked={ mediaOnRight }
                onChange={() => setAttributes({ mediaOnRight: !mediaOnRight })}
              />
            </PanelBody>
          }
        </InspectorControls>
        { mediaEntityId &&
          <BlockControls>
            <Toolbar
              controls={[
                {
                  icon: 'no',
                  title: __('Clear media'),
                  onClick: () => setAttributes({
                    mediaEntityId: null,
                    mediaEntity: null,
                  }),
                },
              ]}
            >
              {loading && (
                <div className="ajax-progress ajax-progress-throbber">
                  <div className="throbber">&nbsp;</div>
                </div>
              )}
            </Toolbar>
          </BlockControls>
        }
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

registerBlockType(`${category.slug}/card`, { category: category.slug, ...card });
