<?php
/**
 * Created by PhpStorm.
 * User: rv
 * Date: 03/04/18
 * Time: 17:50
 */

namespace App\Form;

use App\Entity\ItemList;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ItemListType extends AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class, array(
                'label' => false ,
                'attr' => array(
                    'pattern' => '[a-zA-Z]{1}[a-zA-Z0-9_.]+',
                    'title' => 'Caractères alphanumériques; commençant par une lettre')))
            ->add('save', SubmitType::class, array('label' => 'Ajouter'));

    }
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => ItemList::class
        ));
    }
}