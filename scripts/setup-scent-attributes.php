<?php

use Magento\Eav\Setup\EavSetup;
use Magento\Eav\Setup\EavSetupFactory;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Framework\Setup\InstallDataInterface;
use Magento\Framework\Setup\InstallDataSetupInterface;
use Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface;

class InstallScentAttributes implements InstallDataInterface
{
    private $eavSetupFactory;

    public function __construct(EavSetupFactory $eavSetupFactory)
    {
        $this->eavSetupFactory = $eavSetupFactory;
    }

    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        $eavSetup = $this->eavSetupFactory->create(['setup' => $setup]);

        // Create attribute group for scent attributes
        $eavSetup->addAttributeGroup(
            \Magento\Catalog\Model\Product::ENTITY,
            'Default',
            'Scent Attributes',
            1000
        );

        // Primary Notes
        $eavSetup->addAttribute(
            \Magento\Catalog\Model\Product::ENTITY,
            'primary_notes',
            [
                'type' => 'text',
                'label' => 'Primary Notes',
                'input' => 'multiselect',
                'source' => 'ScentNoteSource',
                'required' => false,
                'global' => ScopedAttributeInterface::SCOPE_GLOBAL,
                'group' => 'Scent Attributes',
                'visible_on_front' => true,
                'is_used_in_grid' => true,
                'is_visible_in_grid' => true,
                'is_filterable_in_grid' => true
            ]
        );

        // Middle Notes
        $eavSetup->addAttribute(
            \Magento\Catalog\Model\Product::ENTITY,
            'middle_notes',
            [
                'type' => 'text',
                'label' => 'Middle Notes',
                'input' => 'multiselect',
                'source' => 'ScentNoteSource',
                'required' => false,
                'global' => ScopedAttributeInterface::SCOPE_GLOBAL,
                'group' => 'Scent Attributes',
                'visible_on_front' => true,
                'is_used_in_grid' => true,
                'is_visible_in_grid' => true,
                'is_filterable_in_grid' => true
            ]
        );

        // Base Notes
        $eavSetup->addAttribute(
            \Magento\Catalog\Model\Product::ENTITY,
            'base_notes',
            [
                'type' => 'text',
                'label' => 'Base Notes',
                'input' => 'multiselect',
                'source' => 'ScentNoteSource',
                'required' => false,
                'global' => ScopedAttributeInterface::SCOPE_GLOBAL,
                'group' => 'Scent Attributes',
                'visible_on_front' => true,
                'is_used_in_grid' => true,
                'is_visible_in_grid' => true,
                'is_filterable_in_grid' => true
            ]
        );

        // Scent Intensity
        $eavSetup->addAttribute(
            \Magento\Catalog\Model\Product::ENTITY,
            'scent_intensity',
            [
                'type' => 'varchar',
                'label' => 'Scent Intensity',
                'input' => 'select',
                'source' => 'ScentIntensitySource',
                'required' => true,
                'global' => ScopedAttributeInterface::SCOPE_GLOBAL,
                'group' => 'Scent Attributes',
                'visible_on_front' => true,
                'is_used_in_grid' => true,
                'is_visible_in_grid' => true,
                'is_filterable_in_grid' => true
            ]
        );

        // Scent Mood
        $eavSetup->addAttribute(
            \Magento\Catalog\Model\Product::ENTITY,
            'scent_mood',
            [
                'type' => 'text',
                'label' => 'Scent Mood',
                'input' => 'multiselect',
                'source' => 'ScentMoodSource',
                'required' => false,
                'global' => ScopedAttributeInterface::SCOPE_GLOBAL,
                'group' => 'Scent Attributes',
                'visible_on_front' => true,
                'is_used_in_grid' => true,
                'is_visible_in_grid' => true,
                'is_filterable_in_grid' => true
            ]
        );

        // Seasonal Recommendation
        $eavSetup->addAttribute(
            \Magento\Catalog\Model\Product::ENTITY,
            'seasonal_recommendation',
            [
                'type' => 'text',
                'label' => 'Seasonal Recommendation',
                'input' => 'multiselect',
                'source' => 'SeasonSource',
                'required' => false,
                'global' => ScopedAttributeInterface::SCOPE_GLOBAL,
                'group' => 'Scent Attributes',
                'visible_on_front' => true,
                'is_used_in_grid' => true,
                'is_visible_in_grid' => true,
                'is_filterable_in_grid' => true
            ]
        );

        // Similar Scents
        $eavSetup->addAttribute(
            \Magento\Catalog\Model\Product::ENTITY,
            'similar_scents',
            [
                'type' => 'text',
                'label' => 'Similar Scents',
                'input' => 'multiselect',
                'source' => 'ProductSource',
                'required' => false,
                'global' => ScopedAttributeInterface::SCOPE_GLOBAL,
                'group' => 'Scent Attributes',
                'visible_on_front' => false,
                'is_used_in_grid' => false,
                'is_visible_in_grid' => false,
                'is_filterable_in_grid' => false
            ]
        );
    }
}
