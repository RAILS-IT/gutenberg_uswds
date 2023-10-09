<?php

namespace Drupal\gutenberg_uswds_card\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\gutenberg\MediaSelectionProcessor\MediaSelectionProcessorManagerInterface;
use Drupal\gutenberg\Service\MediaEntityNotFoundException;
use Drupal\media\MediaInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\gutenberg\DataProvider\EntityDataProviderManager;

/**
 * Returns responses for our image routes.
 */
class UswdsCardLoadMediaController extends ControllerBase {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The entity data provider manager.
   *
   * @var \Drupal\gutenberg\DataProvider\EntityDataProviderManager
   */
  protected $entityDataProviderManager;

  /**
   * The media selection processor manager.
   *
   * @var \Drupal\gutenberg\MediaSelectionProcessor\MediaSelectionProcessorManagerInterface
   */
  protected $mediaSelectionProcessorManager;

  /**
   * MediaController constructor.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\gutenberg\DataProvider\EntityDataProviderManager $entity_data_provider_manager
   *   The entity data provider manager.
   * @param \Drupal\gutenberg\MediaSelectionProcessor\MediaSelectionProcessorManagerInterface $media_selection_processor_manager
   *   The media selection processor manager.
   */
  public function __construct(
    EntityTypeManagerInterface $entity_type_manager,
    EntityDataProviderManager $entity_data_provider_manager,
    MediaSelectionProcessorManagerInterface $media_selection_processor_manager
  ) {
    $this->entityTypeManager = $entity_type_manager;
    $this->entityDataProviderManager = $entity_data_provider_manager;
    $this->mediaSelectionProcessorManager = $media_selection_processor_manager;
  }

  /**
   * {@inheritDoc}
   *
   * @throws \Symfony\Component\DependencyInjection\Exception\ServiceCircularReferenceException
   * @throws \Symfony\Component\DependencyInjection\Exception\ServiceNotFoundException
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager'),
      $container->get('gutenberg.entity_type.data_provider_manager'),
      $container->get('gutenberg.media_selection_processor_manager')
    );
  }

  /**
   * Load media data.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   Current request.
   * @param string $media
   *   Media data (numeric or stringified JSON for media data processing).
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   The JSON response.
   *
   * @throws \InvalidArgumentException
   * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
   * @throws \Exception
   */
  public function loadMedia(Request $request, string $media) {
    $media_entities = $this->mediaSelectionProcessorManager->processData($media);

    try {
      if (!$media_entities) {
        throw new MediaEntityNotFoundException();
      }

      return new JsonResponse($this->loadMediaData(reset($media_entities)));
    }
    catch (MediaEntityNotFoundException $exception) {
      throw new NotFoundHttpException($exception->getMessage(), $exception);
    }
  }

  /**
   * Load media entity data.
   *
   * @param \Drupal\media\MediaInterface $media
   *   Media entity instance.
   *
   * @return mixed
   *   The file entity data for the specified media.
   *
   * @throws \RuntimeException
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   * @throws \Exception
   */
  private function loadMediaData(MediaInterface $media) {
    $file_entity_id = $media->getSource()->getSourceFieldValue($media);
    /** @var \Drupal\file\Entity\File $file_entity */
    $file_entity = $this->entityTypeManager->getStorage('file')->load($file_entity_id);
    $file_data = $this->entityDataProviderManager->getData('file', $file_entity);
    $file_data['media_entity'] = $media->toArray();
    return $file_data;
  }

}
